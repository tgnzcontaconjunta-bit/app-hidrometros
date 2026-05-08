// Exportação para XLSX usando ExcelJS com import dinâmico (não bloqueia o carregamento do app)

const C = {
  navyBg: 'FF1F3864',
  navyFg: 'FFFFFFFF',
  titleBg: 'FF1F3864',
  titleFg: 'FFFFFFFF',
  dateBg: 'FFDCE6F1',
  configHeaderBg: 'FF002060',
  configHeaderFg: 'FFFFFFFF',
  sectionTitleBg: 'FF1F3864',
  sectionTitleFg: 'FFFFFFFF',
  colHeaderBg: 'FF4472C4',
  colHeaderFg: 'FFFFFFFF',
  rowOdd: 'FFDCE6F1',
  rowEven: 'FFFFFFFF',
  summaryRowBg: 'FFDCE6F1',
  sigBg: 'FFDCE6F1',
  border: 'FF000000',
}

function cell(ws, row, col, value, bgArgb, fgArgb, bold = false, center = false, wrapText = true) {
  const c = ws.getCell(row, col)
  c.value = value ?? ''
  c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } }
  c.font = { name: 'Arial', size: 9, bold, color: { argb: fgArgb } }
  c.alignment = { vertical: 'middle', horizontal: center ? 'center' : 'left', wrapText }
  c.border = {
    top: { style: 'thin', color: { argb: C.border } },
    left: { style: 'thin', color: { argb: C.border } },
    bottom: { style: 'thin', color: { argb: C.border } },
    right: { style: 'thin', color: { argb: C.border } },
  }
  return c
}

function mergeRow(ws, row, c1, c2, value, bg, fg, bold = false, center = true, height = 22) {
  ws.mergeCells(row, c1, row, c2)
  cell(ws, row, c1, value, bg, fg, bold, center)
  ws.getRow(row).height = height
}

function dataRow(ws, rowNum, values, bg, bold = false) {
  const r = ws.getRow(rowNum)
  values.forEach((v, i) => cell(ws, rowNum, i + 1, v, bg, 'FF000000', bold, i > 0))
  r.height = 18
  r.commit()
}

export async function exportToXlsx(month) {
  // Carrega ExcelJS e file-saver dinamicamente para não bloquear o app
  const [{ default: ExcelJS }, { saveAs }] = await Promise.all([
    import('exceljs'),
    import('file-saver'),
  ])

  const wb = new ExcelJS.Workbook()
  wb.creator = 'App Hidrometros BNIC'
  wb.created = new Date()

  const ws = wb.addWorksheet(month.label, {
    pageSetup: { orientation: 'landscape', fitToPage: true },
  })

  const COLS = 10
  ws.columns = [
    { width: 5 },
    { width: 38 },
    { width: 10 },
    { width: 18 },
    { width: 12 },
    { width: 12 },
    { width: 12 },
    { width: 8 },
    { width: 14 },
    { width: 16 },
  ]

  let r = 1

  // Instituição
  mergeRow(ws, r++, 1, COLS, month.header.institution, C.navyBg, C.navyFg, true, true, 28)
  // Título
  mergeRow(ws, r++, 1, COLS, month.header.title, C.titleBg, C.titleFg, true, true, 28)
  // Datas
  const dateStr = `DATA LEITURA ANTERIOR: ${month.header.dateAnterior}   |   DATA LEITURA ATUAL: ${month.header.dateAtual}   |   MEDIÇÃO: ${month.header.medicao}   |   VENCIMENTO: ${month.header.vencimento}`
  mergeRow(ws, r++, 1, COLS, dateStr, C.dateBg, 'FF000000', false, false, 18)

  // Configurações Base
  mergeRow(ws, r++, 1, COLS, 'CONFIGURAÇÕES BASE', C.configHeaderBg, C.configHeaderFg, true, true, 18)
  const cfgCols = [...month.baseConfig.columns]
  while (cfgCols.length < COLS) cfgCols.push('')
  dataRow(ws, r++, cfgCols.slice(0, COLS), C.colHeaderBg, true)
  for (const row of month.baseConfig.rows) {
    const cells = [...(row.cells || [])]
    while (cells.length < COLS) cells.push('')
    dataRow(ws, r++, cells.slice(0, COLS), C.rowOdd)
  }
  r++ // espaço

  // Seções
  for (const sec of month.sections) {
    mergeRow(ws, r++, 1, COLS, sec.title, C.sectionTitleBg, C.sectionTitleFg, true, true, 20)
    const header = ['#', ...sec.columns]
    while (header.length < COLS) header.push('')
    dataRow(ws, r++, header.slice(0, COLS), C.colHeaderBg, true)
    sec.rows.forEach((row, idx) => {
      const cells = [String(idx + 1), ...(row.cells || [])]
      while (cells.length < COLS) cells.push('')
      dataRow(ws, r++, cells.slice(0, COLS), idx % 2 === 0 ? C.rowEven : C.rowOdd)
    })
    r++
  }

  // Resumos
  for (const sum of (month.summaries || [])) {
    mergeRow(ws, r++, 1, COLS, sum.title, C.sectionTitleBg, C.sectionTitleFg, true, true, 20)
    for (const blk of (sum.blocks || [])) {
      for (const row of (blk.rows || [])) {
        const cells = [...(row.cells || [])]
        while (cells.length < COLS) cells.push('')
        dataRow(ws, r++, cells.slice(0, COLS), C.summaryRowBg)
      }
      r++
    }
  }

  // Observações
  if (month.observations) {
    mergeRow(ws, r++, 1, COLS, 'Obs.: ' + month.observations, C.rowOdd, 'FF000000', false, false, 28)
    r++
  }

  // Assinaturas
  const sig = month.signatures
  const half = Math.floor(COLS / 2)
  mergeRow(ws, r++, 1, half, sig.approvedBy.label, C.dateBg, 'FF000000', false, false, 16)
  ws.getCell(r - 1, half + 1).value = sig.preparedBy.label
  ws.mergeCells(r - 1, half + 1, r - 1, COLS)
  mergeRow(ws, r++, 1, half, sig.approvedBy.name, C.sigBg, 'FF000000', true, true, 22)
  ws.mergeCells(r - 1, half + 1, r - 1, COLS)
  ws.getCell(r - 1, half + 1).value = sig.preparedBy.name
  mergeRow(ws, r++, 1, half, sig.approvedBy.rank, C.sigBg, 'FF000000', false, true, 18)
  ws.mergeCells(r - 1, half + 1, r - 1, COLS)
  ws.getCell(r - 1, half + 1).value = sig.preparedBy.rank
  mergeRow(ws, r++, 1, half, sig.approvedBy.role, C.sigBg, 'FF000000', false, true, 22)
  ws.mergeCells(r - 1, half + 1, r - 1, COLS)
  ws.getCell(r - 1, half + 1).value = sig.preparedBy.role

  const buf = await wb.xlsx.writeBuffer()
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(blob, `Planilha_Hidrometros_${month.label.replace('/', '_')}.xlsx`)
}
