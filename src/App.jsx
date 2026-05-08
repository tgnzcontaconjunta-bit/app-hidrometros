import { useState, useCallback } from 'react'
import Spreadsheet from './components/Spreadsheet'
import { getStoredMonths, saveMonths, createMar2026 } from './data/initialData'
import { transferReadings } from './utils/transfer'
import { exportToXlsx } from './utils/export'

const uid = () => Math.random().toString(36).slice(2, 10)

const MONTHS_PT = [
  'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
  'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ',
]

function getNextMonthLabel(label) {
  // label formato "MAR/2026"
  const [mon, year] = label.split('/')
  const idx = MONTHS_PT.indexOf(mon)
  if (idx < 0) return 'NOVO MÊS'
  const nextIdx = (idx + 1) % 12
  const nextYear = nextIdx === 0 ? parseInt(year) + 1 : parseInt(year)
  return `${MONTHS_PT[nextIdx]}/${nextYear}`
}

function deepCloneMonth(src, newLabel) {
  const clone = JSON.parse(JSON.stringify(src))
  clone.id = uid()
  clone.label = newLabel
  // Zera leitura atual e mantém anterior
  for (const sec of clone.sections) {
    const iAtual = sec.columns.indexOf('LEITURA ATUAL')
    if (iAtual >= 0) {
      for (const row of sec.rows) {
        row.id = uid()
        row.cells[iAtual] = ''
      }
    }
  }
  return clone
}

export default function App() {
  const [months, setMonths] = useState(() => getStoredMonths())
  const [activeIdx, setActiveIdx] = useState(0)
  const [showNewModal, setShowNewModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [newMonthLabel, setNewMonthLabel] = useState('')
  const [deletingIdx, setDeletingIdx] = useState(null)
  const [exporting, setExporting] = useState(false)

  function persist(newMonths) {
    setMonths(newMonths)
    saveMonths(newMonths)
  }

  const updateMonth = useCallback((idx, fn) => {
    setMonths(prev => {
      const next = prev.map((m, i) => i === idx ? fn(m) : m)
      saveMonths(next)
      return next
    })
  }, [])

  const updateActive = useCallback((fn) => {
    setMonths(prev => {
      const next = prev.map((m, i) => i === activeIdx ? fn(m) : m)
      saveMonths(next)
      return next
    })
  }, [activeIdx])

  function openNewModal() {
    const last = months[months.length - 1]
    setNewMonthLabel(last ? getNextMonthLabel(last.label) : 'NOV MÊS')
    setShowNewModal(true)
  }

  function confirmNewMonth() {
    if (!newMonthLabel.trim()) return
    const prev = months[months.length - 1]
    let base = deepCloneMonth(prev || createMar2026(), newMonthLabel.trim())
    if (prev) base = transferReadings(prev, base)
    const updated = [...months, base]
    persist(updated)
    setActiveIdx(updated.length - 1)
    setShowNewModal(false)
  }

  function deleteMonth(idx) {
    if (months.length <= 1) return
    const updated = months.filter((_, i) => i !== idx)
    persist(updated)
    setActiveIdx(Math.min(idx, updated.length - 1))
    setDeletingIdx(null)
  }

  function importMonth(data) {
    // Importa mês de arquivo JSON
    const updated = [...months, { ...data, id: uid() }]
    persist(updated)
    setActiveIdx(updated.length - 1)
    setShowImportModal(false)
  }

  function handleImportFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data && data.sections) importMonth(data)
        else alert('Arquivo inválido. Exporte um mês em formato JSON para importar.')
      } catch { alert('Erro ao ler arquivo.') }
    }
    reader.readAsText(file)
  }

  function exportJson() {
    const month = months[activeIdx]
    const blob = new Blob([JSON.stringify(month, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `Planilha_${month.label.replace('/', '_')}.json`
    a.click(); URL.revokeObjectURL(url)
  }

  async function handleExport() {
    setExporting(true)
    try {
      await exportToXlsx(months[activeIdx])
    } catch (err) {
      alert('Erro ao exportar: ' + err.message)
    } finally {
      setExporting(false)
    }
  }

  const month = months[activeIdx]

  return (
    <div className="app">
      {/* ─── barra de abas ─────────────────────────────────────── */}
      <div className="tabs-bar">
        <div className="tabs-list">
          {months.map((m, i) => (
            <div
              key={m.id}
              className={`tab ${i === activeIdx ? 'tab--active' : ''}`}
              onClick={() => setActiveIdx(i)}
            >
              <span className="tab-label">{m.label}</span>
              {months.length > 1 && (
                <button
                  className="tab-close"
                  onClick={e => { e.stopPropagation(); setDeletingIdx(i) }}
                  title="Excluir aba"
                >×</button>
              )}
            </div>
          ))}
          <button className="tab-add" onClick={openNewModal} title="Novo mês">＋ Novo mês</button>
        </div>
        <div className="toolbar">
          <button className="btn-toolbar" onClick={() => setShowImportModal(true)} title="Importar mês de JSON">
            ⬆ Importar
          </button>
          <button className="btn-toolbar" onClick={exportJson} title="Exportar mês como JSON (backup)">
            ⬇ Salvar JSON
          </button>
          <button className="btn-toolbar btn-export" onClick={handleExport} disabled={exporting}>
            {exporting ? '⏳ Exportando...' : '📥 Exportar Excel'}
          </button>
        </div>
      </div>

      {/* ─── planilha ──────────────────────────────────────────── */}
      <div className="spreadsheet-container">
        {month && (
          <Spreadsheet
            key={month.id}
            month={month}
            update={updateActive}
          />
        )}
      </div>

      {/* ─── modal: novo mês ───────────────────────────────────── */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Novo mês</h3>
            <p>A <strong>LEITURA ATUAL</strong> do mês anterior será automaticamente copiada para <strong>LEITURA ANTERIOR</strong> do novo mês.</p>
            <label>
              Identificação do mês (ex: ABR/2026)
              <input
                className="modal-input"
                value={newMonthLabel}
                onChange={e => setNewMonthLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && confirmNewMonth()}
                autoFocus
              />
            </label>
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => setShowNewModal(false)}>Cancelar</button>
              <button className="btn-modal-confirm" onClick={confirmNewMonth}>Criar mês</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── modal: importar JSON ──────────────────────────────── */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Importar mês (JSON)</h3>
            <p>Selecione um arquivo JSON exportado anteriormente por esta aplicação.</p>
            <input type="file" accept=".json" onChange={handleImportFile} />
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => setShowImportModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── modal: confirmar exclusão ─────────────────────────── */}
      {deletingIdx !== null && (
        <div className="modal-overlay" onClick={() => setDeletingIdx(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Excluir aba</h3>
            <p>Tem certeza que deseja excluir o mês <strong>{months[deletingIdx]?.label}</strong>? Esta ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => setDeletingIdx(null)}>Cancelar</button>
              <button className="btn-modal-delete" onClick={() => deleteMonth(deletingIdx)}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
