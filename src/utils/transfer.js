// Copia LEITURA ATUAL do mês anterior para LEITURA ANTERIOR do novo mês
// Matching feito por HIDRÔMETRO (coluna índice 2) e seção key

export function transferReadings(prevMonth, newMonth) {
  // Monta mapa: sectionKey -> { hidrometro -> leituraAtual }
  const prevMap = {}
  for (const sec of prevMonth.sections) {
    prevMap[sec.key] = {}
    const colIdx = sec.columns
    const iAtual = colIdx.indexOf('LEITURA ATUAL')
    const iHidro = colIdx.indexOf('HIDRÔMETRO')
    if (iAtual < 0 || iHidro < 0) continue
    for (const row of sec.rows) {
      const hidro = row.cells[iHidro]?.trim()
      if (hidro && hidro !== '*******' && hidro !== '') {
        prevMap[sec.key][hidro] = row.cells[iAtual] || ''
      }
    }
  }

  // Aplica no novo mês
  const updated = {
    ...newMonth,
    sections: newMonth.sections.map(sec => {
      const iAnterior = sec.columns.indexOf('LEITURA ANTERIOR')
      const iHidro = sec.columns.indexOf('HIDRÔMETRO')
      if (iAnterior < 0 || iHidro < 0) return sec
      const map = prevMap[sec.key] || {}
      return {
        ...sec,
        rows: sec.rows.map(row => {
          const hidro = row.cells[iHidro]?.trim()
          if (hidro && hidro !== '*******' && map[hidro] !== undefined) {
            const newCells = [...row.cells]
            newCells[iAnterior] = map[hidro]
            return { ...row, cells: newCells }
          }
          return row
        }),
      }
    }),
  }
  return updated
}
