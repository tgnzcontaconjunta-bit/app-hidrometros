import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

// Paleta de cores matching o original
const C = {
  navyBg: 'FF1F3864',  // cabeçalho instituição (azul escuro)
  navyFg: 'FFFFFFFF',
  titleBg: 'FF1F3864',
  titleFg: 'FFFFFFFF',
  dateBg: 'FFDCE6F1',
  dateFg: 'FF000000',
  configHeaderBg: 'FF002060',
  configHeaderFg: 'FFFFFFFF',
  configRowBg: 'FFFFFFFF',
  sectionTitleBg: 'FF1F3864',
  sectionTitleFg: 'FFFFFFFF',
  colHeaderBg: 'FF4472C4',
  colHeaderFg: 'FFFFFFFF',
  rowOdd: 'FFDCE6F1',
  rowEven: 'FFFFFFFF',
  totalBg: 'FFFFFF00',
  summaryHeaderBg: 'FF4472C4',
  summaryHeaderFg: 'FFFFFFFF',
  summaryRowBg: 'FFDCE6F1',
  sigBg: 'FFDCE6F1',
  border: 'FF000000',
}

function applyBorder(ws, row, col, style = 'thin') {
  const cell = ws.getCell(row, col)
  cell.border = {
    top: { style, color: { argb: C.border } },
    left: { style, color: { argb: C.border } },
    bottom: { style, color: { argb: C.border } },
    right: { style, color: { argb: C.border } },
  }
}

function fillRow(ws, rowNum, bgArgb, fgArgb, values, bold = false, center = false) {
  const exRow = ws.getRow(rowNum)
  values.forEach((v, i) => {
    const cell = exRow.getCell(i + 1)
    cell.value = v ?? ''
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } }
    cell.font = { name: 'Arial', size: 9, bold, color: { argb: fgArgb } }
    cell.alignment = {
      vertical: 'middle',
      horizontal: center ? 'center' : (i === 0 ? 'left' : 'center'),
      wrapText: true,
    }
    cell.border = {
      top: { style: 'thin', color: { argb: C.border } },
      left: { style: 'thin', color: { argb: C.border } },
      bottom: { style: 'thin', color: { argb: C.border } },
      right: { style: 'thin', color: { argb: C.border } },
    }
  })
  exRow.height = 20
  exRow.commit()
}

function mergeAndFill(ws, rowNum, startCol, endCol, value, bgArgb, fgArgb, bold = false, center = true, height = 22) {
  ws.mergeCells(rowNum, startCol, rowNum, endCol)
  const cell = ws.getCell(rowNum, startCol)
  cell.value = value
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } }
  cell.font = { name: 'Arial', size: 10, bold, color: { argb: fgArgb } }
  cell.alignment = { vertical: 'middle', horizontal: center ? 'center' : 'left', wrapText: true }
  cell.border = {
    top: { style: 'medium', color: { argb: C.border } },
    left: { style: 'medium', color: { argb: C.border } },
    bottom: { style: 'medium', color: { argb: C.border } },
    right: { style: 'medium', color: { argb: C.border } },
  }
  ws.getRow(rowNum).height = height
}

export async function exportToXlsx(month) {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'App Hidrometros BNIC'
  wb.created = new Date()

  const ws = wb.addWorksheet(month.label, { pageSetup: { orientation: 'landscape', fitToPage: true } })

  // Largura das colunas: 1=#, 2=consumidor(grande), 3=cod.om, 4=hidrometro, 5=l.atual, 6=l.ant, 7=consumo, 8=dias, 9=total, 10=total pagar
  ws.columns = [
    { width: 5 },   // #
    { width: 38 },  // consumidor
    { width: 10 },  // código OM
    { width: 18 },  // hidrômetro
    { width: 12 },  // leitura atual
    { width: 12 },  // leitura anterior
    { width: 12 },  // consumo m³
    { width: 8 },   // dias
    { width: 14 },  // consumo total
    { width: 16 },  // total a pagar
  ]

  const TOTAL_COLS = 10
  let rowNum = 1

  // ---- CABEÇALHO INSTITUIÇÃO ----
  mergeAndFill(ws, rowNum, 1, TOTAL_COLS, month.header.institution, C.navyBg, C.navyFg, true, true, 28)
  rowNum++

  // ---- TÍTULO ----
  mergeAndFill(ws, rowNum, 1, TOTAL_COLS, month.header.title, C.titleBg, C.titleFg, true, true, 28)
  rowNum++

  // ---- LINHA DE DATAS ----
  const dateStr = `DATA DA LEITURA ANTERIOR  ${month.header.dateAnterior}          DATA DA LEITURA ATUAL  ${month.header.dateAtual}          MEDIÇÃO  ${month.header.medicao}          VENCIMENTO  ${month.header.vencimento}`
  mergeAndFill(ws, rowNum, 1, TOTAL_COLS, dateStr, C.dateBg, C.dateFg, false, false, 18)
  rowNum++

  // ---- CONFIGURAÇÕES BASE ----
  mergeAndFill(ws, rowNum, 1, TOTAL_COLS, 'CONFIGURAÇÕES BASE', C.configHeaderBg, C.configHeaderFg, true, true, 18)
  rowNum++

  // Headers config
  const cfgCols = month.baseConfig.columns
  fillRow(ws, rowNum, C.colHeaderBg, C.colHeaderFg, cfgCols, true, true)
  rowNum++

  for (const row of month.baseConfig.rows) {
    const cells = [...(row.cells || [])]
    while (cells.length < TOTAL_COLS) cells.push('')
    fillRow(ws, rowNum, C.rowOdd, C.border, cells.slice(0, TOTAL_COLS))
    rowNum++
  }

  rowNum++ // espaço

  // ---- SEÇÕES ----
  let sectionIndex = 0
  for (const section of month.sections) {
    // Título da seção
    mergeAndFill(ws, rowNum, 1, TOTAL_COLS, section.title, C.sectionTitleBg, C.sectionTitleFg, true, true, 20)
    rowNum++

    // Headers das colunas
    const cols = ['#', ...section.columns]
    const headerCells = cols.slice(0, TOTAL_COLS)
    while (headerCells.length < TOTAL_COLS) headerCells.push('')
    fillRow(ws, rowNum, C.colHeaderBg, C.colHeaderFg, headerCells, true, true)
    rowNum++

    // Linhas de dados
    section.rows.forEach((row, idx) => {
      const cells = [String(idx + 1), ...(row.cells || [])]
      while (cells.length < TOTAL_COLS) cells.push('')
      const bg = idx % 2 === 0 ? C.rowEven : C.rowOdd
      fillRow(ws, rowNum, bg, 'FF000000', cells.slice(0, TOTAL_COLS))
      rowNum++
    })

    rowNum++ // espaço entre seções
    sectionIndex++
  }

  // ---- RESUMO ----
  for (const summary of (month.summaries || [])) {
    mergeAndFill(ws, rowNum, 1, TOTAL_COLS, summary.title, C.sectionTitleBg, C.sectionTitleFg, true, true, 20)
    rowNum++

    for (const block of (summary.blocks || [])) {
      for (const row of (block.rows || [])) {
        const cells = [...(row.cells || [])]
        while (cells.length < TOTAL_COLS) cells.push('')
        fillRow(ws, rowNum, C.summaryRowBg, 'FF000000', cells.slice(0, TOTAL_COLS))
        rowNum++
      }
      rowNum++
    }
  }

  rowNum++

  // ---- OBSERVAÇÕES ----
  if (month.observations) {
    mergeAndFill(ws, rowNum, 1, TOTAL_COLS, 'Obs.: ' + month.observations, C.rowOdd, 'FF000000', false, false, 28)
    rowNum += 2
  }

  // ---- ASSINATURAS ----
  const sig = month.signatures
  mergeAndFill(ws, rowNum, 1, 5, sig.approvedBy.label, C.dateBg, 'FF000000', false, false, 16)
  mergeAndFill(ws, rowNum, 6, TOTAL_COLS, sig.preparedBy.label, C.dateBg, 'FF000000', false, false, 16)
  rowNum++
  mergeAndFill(ws, rowNum, 1, 5, sig.approvedBy.name, C.sigBg, 'FF000000', true, true, 22)
  mergeAndFill(ws, rowNum, 6, TOTAL_COLS, sig.preparedBy.name, C.sigBg, 'FF000000', true, true, 22)
  rowNum++
  mergeAndFill(ws, rowNum, 1, 5, sig.approvedBy.rank, C.sigBg, 'FF000000', false, true, 18)
  mergeAndFill(ws, rowNum, 6, TOTAL_COLS, sig.preparedBy.rank, C.sigBg, 'FF000000', false, true, 18)
  rowNum++
  mergeAndFill(ws, rowNum, 1, 5, sig.approvedBy.role, C.sigBg, 'FF000000', false, true, 22)
  mergeAndFill(ws, rowNum, 6, TOTAL_COLS, sig.preparedBy.role, C.sigBg, 'FF000000', false, true, 22)

  // Gera e salva
  const buf = await wb.xlsx.writeBuffer()
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const filename = `Planilha_Hidrometros_${month.label.replace('/', '_')}.xlsx`
  saveAs(blob, filename)
}
