import EditCell from './EditCell'

const uid = () => Math.random().toString(36).slice(2, 10)

// ─── helpers ────────────────────────────────────────────────────────────────

function updMonth(month, fn) { return fn(month) }

function setHeader(month, key, val) {
  return { ...month, header: { ...month.header, [key]: val } }
}

function setBaseConfigCol(month, ci, val) {
  const columns = [...month.baseConfig.columns]
  columns[ci] = val
  return { ...month, baseConfig: { ...month.baseConfig, columns } }
}

function setBaseConfigCell(month, ri, ci, val) {
  const rows = month.baseConfig.rows.map((r, i) => {
    if (i !== ri) return r
    const cells = [...r.cells]
    cells[ci] = val
    return { ...r, cells }
  })
  return { ...month, baseConfig: { ...month.baseConfig, rows } }
}

function addBaseConfigCol(month) {
  const columns = [...month.baseConfig.columns, 'Nova coluna']
  const rows = month.baseConfig.rows.map(r => ({ ...r, cells: [...r.cells, ''] }))
  return { ...month, baseConfig: { columns, rows } }
}

function removeBaseConfigCol(month, ci) {
  const columns = month.baseConfig.columns.filter((_, i) => i !== ci)
  const rows = month.baseConfig.rows.map(r => ({ ...r, cells: r.cells.filter((_, i) => i !== ci) }))
  return { ...month, baseConfig: { columns, rows } }
}

function addBaseConfigRow(month) {
  const nCols = month.baseConfig.columns.length
  const rows = [...month.baseConfig.rows, { id: uid(), cells: Array(nCols).fill('') }]
  return { ...month, baseConfig: { ...month.baseConfig, rows } }
}

function removeBaseConfigRow(month, ri) {
  const rows = month.baseConfig.rows.filter((_, i) => i !== ri)
  return { ...month, baseConfig: { ...month.baseConfig, rows } }
}

function updateSection(month, sk, fn) {
  return {
    ...month,
    sections: month.sections.map(s => s.key === sk ? fn(s) : s),
  }
}

function setSectionTitle(month, sk, val) {
  return updateSection(month, sk, s => ({ ...s, title: val }))
}

function setSectionCol(month, sk, ci, val) {
  return updateSection(month, sk, s => {
    const columns = [...s.columns]; columns[ci] = val
    return { ...s, columns }
  })
}

function setSectionCell(month, sk, ri, ci, val) {
  return updateSection(month, sk, s => ({
    ...s,
    rows: s.rows.map((r, i) => {
      if (i !== ri) return r
      const cells = [...r.cells]; cells[ci] = val
      return { ...r, cells }
    }),
  }))
}

function addSectionRow(month, sk) {
  return updateSection(month, sk, s => ({
    ...s,
    rows: [...s.rows, { id: uid(), cells: Array(s.columns.length).fill('') }],
  }))
}

function removeSectionRow(month, sk, ri) {
  return updateSection(month, sk, s => ({
    ...s,
    rows: s.rows.filter((_, i) => i !== ri),
  }))
}

function addSectionCol(month, sk) {
  return updateSection(month, sk, s => ({
    ...s,
    columns: [...s.columns, 'Nova coluna'],
    rows: s.rows.map(r => ({ ...r, cells: [...r.cells, ''] })),
  }))
}

function removeSectionCol(month, sk, ci) {
  return updateSection(month, sk, s => ({
    ...s,
    columns: s.columns.filter((_, i) => i !== ci),
    rows: s.rows.map(r => ({ ...r, cells: r.cells.filter((_, i) => i !== ci) })),
  }))
}

function setSummaryCell(month, sIdx, bIdx, ri, ci, val) {
  const summaries = month.summaries.map((sum, si) => {
    if (si !== sIdx) return sum
    return {
      ...sum,
      blocks: sum.blocks.map((blk, bi) => {
        if (bi !== bIdx) return blk
        return {
          ...blk,
          rows: blk.rows.map((row, i) => {
            if (i !== ri) return row
            const cells = [...row.cells]; cells[ci] = val
            return { ...row, cells }
          }),
        }
      }),
    }
  })
  return { ...month, summaries }
}

function addSummaryRow(month, sIdx, bIdx) {
  const summaries = month.summaries.map((sum, si) => {
    if (si !== sIdx) return sum
    return {
      ...sum,
      blocks: sum.blocks.map((blk, bi) => {
        if (bi !== bIdx) return blk
        const maxCols = Math.max(...blk.rows.map(r => r.cells.length), 4)
        return { ...blk, rows: [...blk.rows, { id: uid(), cells: Array(maxCols).fill('') }] }
      }),
    }
  })
  return { ...month, summaries }
}

function removeSummaryRow(month, sIdx, bIdx, ri) {
  const summaries = month.summaries.map((sum, si) => {
    if (si !== sIdx) return sum
    return {
      ...sum,
      blocks: sum.blocks.map((blk, bi) => {
        if (bi !== bIdx) return blk
        return { ...blk, rows: blk.rows.filter((_, i) => i !== ri) }
      }),
    }
  })
  return { ...month, summaries }
}

// ─── sub-components ─────────────────────────────────────────────────────────

function HeaderSection({ month, update }) {
  const h = month.header
  return (
    <div className="sp-header">
      <div className="sp-institution">
        <EditCell value={h.institution} onChange={v => update(m => setHeader(m, 'institution', v))} />
      </div>
      <div className="sp-title">
        <EditCell value={h.title} onChange={v => update(m => setHeader(m, 'title', v))} />
      </div>
      <div className="sp-dates">
        <span className="date-label">DATA DA LEITURA ANTERIOR</span>
        <EditCell className="date-val" value={h.dateAnterior} onChange={v => update(m => setHeader(m, 'dateAnterior', v))} />
        <span className="date-sep" />
        <span className="date-label">DATA DA LEITURA ATUAL</span>
        <EditCell className="date-val" value={h.dateAtual} onChange={v => update(m => setHeader(m, 'dateAtual', v))} />
        <span className="date-sep" />
        <span className="date-label">MEDIÇÃO</span>
        <EditCell className="date-val" value={h.medicao} onChange={v => update(m => setHeader(m, 'medicao', v))} />
        <span className="date-sep" />
        <span className="date-label">VENCIMENTO</span>
        <EditCell className="date-val" value={h.vencimento} onChange={v => update(m => setHeader(m, 'vencimento', v))} />
      </div>
    </div>
  )
}

function BaseConfigTable({ month, update }) {
  const { columns, rows } = month.baseConfig
  return (
    <div className="sp-section">
      <div className="sp-section-title">CONFIGURAÇÕES BASE</div>
      <div className="table-wrapper">
        <table className="sp-table config-table">
          <thead>
            <tr>
              {columns.map((col, ci) => (
                <th key={ci} className="col-header">
                  <EditCell value={col} onChange={v => update(m => setBaseConfigCol(m, ci, v))} />
                  {columns.length > 1 && (
                    <button className="btn-del-col" onClick={() => update(m => removeBaseConfigCol(m, ci))} title="Remover coluna">×</button>
                  )}
                </th>
              ))}
              <th className="col-action">
                <button className="btn-add-col" onClick={() => update(m => addBaseConfigCol(m))} title="Adicionar coluna">+</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.id} className={ri % 2 === 0 ? 'row-even' : 'row-odd'}>
                {columns.map((_, ci) => (
                  <td key={ci}>
                    <EditCell
                      value={row.cells[ci] ?? ''}
                      onChange={v => update(m => setBaseConfigCell(m, ri, ci, v))}
                    />
                  </td>
                ))}
                <td className="col-action">
                  <button className="btn-del-row" onClick={() => update(m => removeBaseConfigRow(m, ri))} title="Remover linha">×</button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={columns.length + 1}>
                <button className="btn-add-row" onClick={() => update(m => addBaseConfigRow(m))}>+ Adicionar linha</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DataSection({ section, update }) {
  const { columns, rows, title, key } = section
  return (
    <div className="sp-section">
      <div className="sp-section-title">
        <EditCell value={title} onChange={v => update(m => setSectionTitle(m, key, v))} />
      </div>
      <div className="table-wrapper">
        <table className="sp-table data-table">
          <thead>
            <tr>
              <th className="col-num">#</th>
              {columns.map((col, ci) => (
                <th key={ci} className="col-header">
                  <div className="col-header-inner">
                    <EditCell value={col} onChange={v => update(m => setSectionCol(m, key, ci, v))} />
                    {columns.length > 1 && (
                      <button className="btn-del-col" onClick={() => update(m => removeSectionCol(m, key, ci))} title="Remover coluna">×</button>
                    )}
                  </div>
                </th>
              ))}
              <th className="col-action">
                <button className="btn-add-col" onClick={() => update(m => addSectionCol(m, key))} title="Adicionar coluna">+</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.id} className={ri % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td className="col-num">{ri + 1}</td>
                {columns.map((_, ci) => (
                  <td key={ci} className={getColClass(columns[ci])}>
                    <EditCell
                      value={row.cells[ci] ?? ''}
                      onChange={v => update(m => setSectionCell(m, key, ri, ci, v))}
                    />
                  </td>
                ))}
                <td className="col-action">
                  <button className="btn-del-row" onClick={() => update(m => removeSectionRow(m, key, ri))} title="Remover linha">×</button>
                </td>
              </tr>
            ))}
            <tr className="add-row-tr">
              <td colSpan={columns.length + 2}>
                <button className="btn-add-row" onClick={() => update(m => addSectionRow(m, key))}>+ Adicionar linha</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function getColClass(colName) {
  if (colName === 'LEITURA ATUAL') return 'td-leitura-atual'
  if (colName === 'LEITURA ANTERIOR') return 'td-leitura-anterior'
  if (colName === 'TOTAL A PAGAR') return 'td-total'
  if (colName === 'CONSUMIDOR') return 'td-consumidor'
  return ''
}

function SummarySection({ month, update }) {
  if (!month.summaries?.length) return null
  return (
    <>
      {month.summaries.map((summary, sIdx) => (
        <div key={summary.id} className="sp-section">
          <div className="sp-section-title sp-section-title--sm">
            <EditCell
              value={summary.title}
              onChange={v => {
                update(m => ({
                  ...m,
                  summaries: m.summaries.map((s, i) => i === sIdx ? { ...s, title: v } : s),
                }))
              }}
            />
          </div>
          {summary.blocks.map((blk, bIdx) => (
            <div key={blk.id} className="summary-block">
              <table className="sp-table summary-table">
                <tbody>
                  {blk.rows.map((row, ri) => (
                    <tr key={row.id} className={ri === 0 ? 'summary-header-row' : 'summary-data-row'}>
                      {row.cells.map((cell, ci) => (
                        <td key={ci} className={ri === 0 ? 'summary-th' : 'summary-td'}>
                          <EditCell
                            value={cell}
                            onChange={v => update(m => setSummaryCell(m, sIdx, bIdx, ri, ci, v))}
                          />
                        </td>
                      ))}
                      <td className="col-action">
                        <button className="btn-del-row" onClick={() => update(m => removeSummaryRow(m, sIdx, bIdx, ri))}>×</button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={(blk.rows[0]?.cells.length || 4) + 1}>
                      <button className="btn-add-row" onClick={() => update(m => addSummaryRow(m, sIdx, bIdx))}>+ Linha</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

function ObservationsSection({ month, update }) {
  return (
    <div className="sp-obs">
      <span className="obs-label">Obs.:</span>
      <EditCell
        value={month.observations}
        onChange={v => update(m => ({ ...m, observations: v }))}
        multiline
        className="obs-text"
        placeholder="Observações..."
      />
    </div>
  )
}

function SignatureSection({ month, update }) {
  const sig = month.signatures
  function updateSig(side, key, val) {
    update(m => ({
      ...m,
      signatures: {
        ...m.signatures,
        [side]: { ...m.signatures[side], [key]: val },
      },
    }))
  }
  return (
    <div className="sp-signatures">
      {['approvedBy', 'preparedBy'].map(side => (
        <div key={side} className="sig-block">
          <div className="sig-label">
            <EditCell value={sig[side].label} onChange={v => updateSig(side, 'label', v)} />
          </div>
          <div className="sig-name">
            <EditCell value={sig[side].name} onChange={v => updateSig(side, 'name', v)} />
          </div>
          <div className="sig-rank">
            <EditCell value={sig[side].rank} onChange={v => updateSig(side, 'rank', v)} />
          </div>
          <div className="sig-role">
            <EditCell value={sig[side].role} onChange={v => updateSig(side, 'role', v)} multiline />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── main export ─────────────────────────────────────────────────────────────

export default function Spreadsheet({ month, update }) {
  return (
    <div className="spreadsheet">
      <HeaderSection month={month} update={update} />
      <BaseConfigTable month={month} update={update} />
      {month.sections.map(section => (
        <DataSection key={section.id} section={section} update={update} />
      ))}
      <SummarySection month={month} update={update} />
      <ObservationsSection month={month} update={update} />
      <SignatureSection month={month} update={update} />
    </div>
  )
}
