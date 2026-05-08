import { useState, useRef, useCallback } from 'react'

const uid = () => Math.random().toString(36).slice(2, 11)
const mk = (...cells) => ({ id: uid(), cells: [...cells] })
const MESES = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ']

function nextLabel(label) {
  const [m, y] = (label || '').split('/')
  const i = MESES.indexOf(m)
  if (i < 0) return 'NOVO'
  return `${MESES[(i + 1) % 12]}/${i === 11 ? parseInt(y) + 1 : parseInt(y)}`
}

/* ── Dados iniciais MAR/2026 ─────────────────────────────────────────────── */
function buildMonth() {
  const std = ['CONSUMIDOR','CÓDIGO DA OM','HIDRÔMETRO','LEITURA ATUAL','LEITURA ANTERIOR','CONSUMO (M³)','CONSUMO TOTAL (M³)','TOTAL A PAGAR']
  const dia = ['CONSUMIDOR','CÓDIGO DA OM','HIDRÔMETRO','LEITURA ATUAL','LEITURA ANTERIOR','CONSUMO (M³)','DIAS','CONSUMO TOTAL (M³)','TOTAL A PAGAR']
  return {
    id: uid(), label: 'MAR/2026',
    institution: 'MARINHA DO BRASIL - BASE NAVAL DA ILHA DAS COBRAS - DEPARTAMENTO DE APOIO - DIVISAO DE MECANICA E CAV (BNIC -33)',
    title: 'PLANILHA DE FATURAMENTO DE AGUA DOCE E TRATAMENTO DE ESGOTO',
    dateAnterior: '27/02/2026', dateAtual: '30/03/26', medicao: '03/2026', vencimento: '23/04/2026',
    cfgCols: ['OM','MATRICULAS','VALOR DO CONSUMO (R$)','VALOR TOTAL (R$)','VOLUME CONSUMIDO (M3)','VOLUME CONSUMIDO TOTAL (M3)','VALOR DO (M3)','R$ 21,959'],
    cfgRows: [
      mk('BNIC','400485340-0','R$ 356.740,27','R$ 1.844.553,07','7.972','41.022','RATEIO OM APOIADAS','R$ 896.400,94'),
      mk('','400447071-3','R$ 1.487.812,80','','','33.050','',''),
      mk('ARES-MAS (FORA DO RATEIO)','400485344-2','R$ 23.418,16','R$ 23.418,16','531','531','RATEIO CONSUMO OM (M3)','20011'),
      mk('','','','TAXAS (%)','2,00%','','',''),
    ],
    sections: [
      { id:uid(), key:'oms', title:'OMs APOIADAS', cols:[...std], rows:[
        mk('AMRJ','41000','Consumidores nao hidrometrados','*******','*******','7.984','7.984','R$ 360.297,81'),
        mk('','','Compart: H-09 (Ed.16)','43.241','43.191','30','30','R$ 1.343,86'),
        mk('','','Compart: H-14 (Ed.11)','48.095','47.972','51','51','R$ 2.263,73'),
        mk('','','H-17 (Ed.17)','18.263','17.229','1.034','1.034','R$ 46.318,45'),
        mk('','','H-36 (Ed.02)','104.643','104.174','469','469','R$ 21.009,05'),
        mk('','','H-53 (Ed.10)','23.774','23.576','154','154','R$ 6.898,49'),
        mk('','','H-55 (Ed.19)','','','599','599','R$ 26.832,45'),
        mk('','','H-58 (Ed.19)','6.207','6.052','155','155','R$ 6.943,29'),
        mk('','','H-61 (Ed.19)','14.966','14.600','366','366','R$ 16.395,12'),
        mk('','','H-63 (Ed.04)','58.897','58.398','499','499','R$ 22.352,91'),
        mk('','','H-80 (Ed.7B)','420','387','33','33','R$ 1.478,25'),
        mk('','','H-82 (Ed.24)','9.341','8.983','358','358','R$ 16.036,76'),
        mk('','','H-83 (Ed.06)','201','188','13','13','R$ 582,34'),
        mk('','','H-84 (Ed.08)','9.036','8.439','597','37','R$ 1.657,43'),
        mk('','','H-85 (Ed.05)','459','404','55','55','R$ 2.463,75'),
        mk('','','H-86 (Ed.03)','3.695','3.587','108','108','R$ 4.837,90'),
        mk('BNIC','40015','Consumidores nao hidrometrados','*******','*******','13.027','13.027','R$ 587.854,32'),
        mk('','','H-12 (Ed.17A)','6.701','6.457','244','244','R$ 10.930,08'),
        mk('','','H-47 (Ed.09)','286','282','4','4','R$ 179,18'),
        mk('','','H-71 (Ed.17 - Caldeira)','24.380','24.116','264','264','R$ 11.825,99'),
        mk('','','H-76 (Ed.31)','4.570','4.556','14','14','R$ 627,14'),
        mk('','','H-77 (Ed.46)','5.764','5.752','12','12','R$ 537,54'),
        mk('','','H-78 (Ed.49)','1.750','1.655','95','95','R$ 4.255,56'),
        mk('','','H-79 (Ed.48)','30.372','30.038','334','334','R$ 14.961,67'),
        mk('','','H-81 (Ed.41)','423','392','31','31','R$ 1.388,66'),
        mk('RANCHO (BNIC)','40015','H-08 (Ed.43)','34.043','33.216','827','827','R$ 37.045,80'),
        mk('DgePM-RIO (ed.16)','40005','Compart: H-09 (Ed.16)','43.241','43.191','20','20','R$ 895,91'),
        mk('CMS - CETM / DGMM-COGESN (Rateio interno, sob responsabilidade do CMS)','44021','H-11','17.144','16.760','384','384','R$ 17.201,44'),
        mk('DIM','40030','Compart: H-14','48.095','47.972','72','72','R$ 3.246,10'),
        mk('CMS / DGPeM / AMRJ (Rateio interno, sob responsabilidade do CMS)','44021','H-25 (Ed.08, 2 andar)','4.929','4.923','6','6','R$ 268,77'),
        mk('CCSM','11100','H-26 (Ed.08)','1.116','1.112','4','4','R$ 179,18'),
        mk('CMS - CAM','44021','H-27','32.171','32.036','135','135','R$ 6.047,38'),
        mk('ETAM','40031','H-39','17.058','17.011','47','47','R$ 2.105,38'),
        mk('DPHDM (ed.32)','79000','H-44','15.487','15.424','63','63','R$ 2.822,11'),
        mk('Ed. ALTE. GASTAO MOTTA','71000','H-45','222.075','221.194','881','881','R$ 39.464,76'),
        mk('PAPEM (ed. 23)','73200','H-48','55.510','55.270','240','187','R$ 8.368,96'),
        mk('DCTIM (ed.23)','49000','','','','','53','R$ 2.381,94'),
        mk('CASNAV (ed. 23)','23000','H-49','48.128','47.888','240','240','R$ 10.750,90'),
        mk('ComGptPatNavSe','81100','H-50','2.114','2.052','62','62','R$ 2.777,32'),
        mk('ILHA FISCAL','79000','H-65','5.104','4.784','320','320','R$ 14.334,53'),
        mk('CPMM','65730','H-66 (caixa dagua)','22.381','22.381','153','153','R$ 6.853,70'),
        mk('HCM','65701','H-67','714.231','710.755','3.476','1.295','R$ 58.010,06'),
        mk('PRESIDIO DA MARINHA','81940','H-68 (calcada)','47.127','46.981','146','268','R$ 12.005,17'),
        mk('','','H-69 (portao)','11.107','10.985','122','122',''),
        mk('BATALHO NAVAL','31050','H-70','415.309','413.396','1.913','1.913','R$ 85.693,62'),
        mk('SecNSNQ','18000','H-73','7.977','7.843','134','134','R$ 6.002,58'),
        mk('XXXX','20001','C.Pipa (m3)','*******','*******','*******','','R$ 0,00'),
        mk('XXXX','81000','C.Pipa (m3)','*******','*******','*******','','R$ 0,00'),
        mk('','','','*******','*******','*******','','R$ 0,00'),
      ]},
      { id:uid(), key:'extra', title:'EXTRA MARINHA', cols:[...std], rows:[
        mk('BNIC (NM ENGENHARIA)','40015','H-08A (Obra Ed.43)','270','270','0','0','R$ 0,00'),
        mk('BANCO SANTANDER','356','H-15','1.627','1.623','4','4','R$ 179,18'),
        mk('BANCO DO BRASIL','994','H-16','1.123','1.120','3','3','R$ 134,39'),
        mk('BANCO ITAU','997','H-18','1.131','1.117','14','14','R$ 627,14'),
        mk('EMGEPRON (ed.39)','10200','H-51','18.416','18.001','415','415','R$ 18.590,09'),
        mk('AMRJ (PRESTNAV-anexo ao ed.19)','41000','H-54','5.179','5.170','9','9','R$ 403,16'),
        mk('AMRJ [SKM (ed.07A)]','41000','H-75','4.209','4.174','35','35','R$ 1.567,84'),
      ]},
      { id:uid(), key:'cais-oeste', title:'CAIS OESTE, NORTE, LESTE E SUL INTERNO', cols:[...dia], rows:[
        mk('SEM CONEXAO','*******','H-01','164','164','0','','0','R$ 0,00'),
        mk('SEM CONEXAO','*******','H-02','15.504','15.504','0','','0','R$ 0,00'),
        mk('NT. ALTE GASTAO MOTTA','91665','H-03','1.754','1.432','322','31','322','R$ 14.424,12'),
        mk('SEM CONEXAO','*******','H-10','9.319','9.319','0','','0','R$ 0,00'),
        mk('SEM CONEXAO','*******','H-13','38.973','38.973','0','','0','R$ 0,00'),
        mk('SKANDI ACU','41000','H-28','43.919','43.319','600','6','540','R$ 24.189,52'),
        mk('CV. BARROSO','91645','','','','','27','60','R$ 2.687,72'),
        mk('NapOc MEARIM','85120','H-29','14.338','14.164','174','6','174','R$ 7.794,40'),
        mk('NDM BAHIA','91670','H-30','13.069','12.890','179','31','179','R$ 8.018,38'),
        mk('SEM CONEXAO','*******','H-31','26.085','26.085','0','','0','R$ 0,00'),
        mk('F. LIBERAL','91614','H-32','1.330','944','386','31','193','R$ 8.645,51'),
        mk('F. RADEMAKER','91624','','','','','31','193','R$ 8.645,51'),
        mk('SEM CONEXAO','*******','H-33','32.858','32.858','0','','0','R$ 0,00'),
        mk('SEM CONEXAO','*******','H-34','17.667','17.667','0','28','0','R$ 0,00'),
        mk('SEM CONEXAO','*******','H-35','43.820','43.820','0','28','0','R$ 0,00'),
        mk('SEM CONEXAO','*******','H-37','1','1','0','','0','R$ 0,00'),
        mk('F. UNIAO','91616','H-38','16.793','16.503','290','14','290','R$ 12.990,67'),
        mk('AMRJ (DIQUE ALTE SCHIEK)','41000','H-64','324','318','6','28','6','R$ 268,77'),
        mk('SEM CONEXAO','*******','H-74','4','4','0','','0','R$ 0,00'),
        mk('EDCG TAMBAU','91673','H-88','410','399','11','7','11','R$ 492,75'),
      ]},
      { id:uid(), key:'portuguesa', title:'CAIS DA PORTUGUESA E MOLHE SUL EXTERNO', cols:[...dia], rows:[
        mk('Npa GURUPI','81147','H-56','3.994','3.969','25','29','25','R$ 1.119,89'),
        mk('SEM CONEXAO','*******','H-57','6.687','6.687','0','','0','R$ 0,00'),
        mk('SEM CONEXAO','*******','H-59','4.889','4.889','0','','0','R$ 0,00'),
        mk('SEM CONEXAO','*******','H-60','4.298','4.298','0','','0','R$ 0,00'),
        mk('AviPA ANEQUIM','81100','H-62','4.442','4.428','14','31','14','R$ 627,14'),
        mk('SEM CONEXAO','*******','H-87','','','0','','0','R$ 0,00'),
      ]},
      { id:uid(), key:'regis', title:'DIQUE ALMIRANTE REGIS', cols:[...dia], rows:[
        mk('NAM ATLANTICO','230318','H-19','30.167','29.325','842','31','842','R$ 37.717,73'),
        mk('SKANDI ACU','41000','H-20','12.225','11.194','1.031','25','1.031','R$ 46.184,07'),
        mk('SKANDI ACU','41000','H-21','21.953','20.718','1.235','25','1.235','R$ 55.322,33'),
        mk('SKANDI ACU','41000','H-22','18.213','16.272','1.941','25','1.941','R$ 86.947,89'),
        mk('SKANDI ACU','41000','H-23','9.437','9.437','0','25','0','R$ 0,00'),
        mk('SEM CONEXAO','*******','H-24','2.847','2.847','0','','0','R$ 0,00'),
        mk('SKANDI ACU','41000','H-46 (Ed.51)','1.428','1.373','55','25','55','R$ 2.463,75'),
        mk('SEM CONEXAO','*******','H-52','3.844','3.844','0','','0','R$ 0,00'),
      ]},
      { id:uid(), key:'jardim', title:'DIQUE JARDIM', cols:[...dia], rows:[
        mk('Npa MACAE','81148','H-41','24.408','24.132','276','18','276','R$ 12.363,53'),
        mk('Npa MACAE','81148','H-42','4.152','4.102','50','18','50','R$ 2.239,77'),
      ]},
      { id:uid(), key:'santa-cruz', title:'DIQUE SANTA CRUZ', cols:[...dia], rows:[
        mk('S. TIKUNA','91534','H-43','19.744','19.740','4','26','4','R$ 179,18'),
      ]},
      { id:uid(), key:'submarinos', title:'EDIFICIO APOIO AOS SUBMARINOS', cols:[...dia], rows:[
        mk('S. TIKUNA','91534','H-40','15.208','15.141','67','26','67','R$ 3.001,29'),
      ]},
      { id:uid(), key:'ares-mas', title:'ARES-MAS (FORA DO RATEIO - CONSUMO DESTINADO AO BATALHO NAVAL)', cols:[...std], rows:[
        mk('ARES-MAS (BATALHO NAVAL)','31050','MAT. 400485344-2','*******','*******','*******','531','R$ 23.418,16'),
      ]},
    ],
    summaries: [
      { id:uid(), title:'TOTAL DE CONSUMO DOS NAVIOS/OM COM HIDROMETRO COMPARTILHADO OU COM ACRESCIMO NO CONSUMO',
        blocks:[
          { id:uid(), rows:[
            mk('OM','AMRJ (COM TERCEIRIZADAS)','AMRJ (SEM TERCEIRIZADAS)','S. TIKUNA'),
            mk('R$','R$ 755.058,92','R$ 537.711,59','R$ 3.180,47'),
            mk('m3','16.797','11.945','71'),
          ]},
          { id:uid(), rows:[
            mk('OM','BNIC (SEM RANCHO)','SKANDI ACU'),
            mk('R$','R$ 632.560,14','R$ 215.107,56'),
            mk('m3','14.025','4.802'),
          ]},
        ],
      },
    ],
    obs: 'Consumo do HCM = H67 (entrada do HCM) - H66 (CPMM) - H68 - H69 (PRESIDIO) - H70 (BATALHO)',
    sig: [
      { label:'Aprovado por:', nome:'DANIEL ALBUERNE DINIZ BEZERRA', cargo:'1T(EN)', funcao:'Encarregado da Divisao de Mecanica e Cav - BNIC-33' },
      { label:'Elaborado por:', nome:'SAMUEL PIRES DE ARAUJO', cargo:'Segundo-Sargento - CA', funcao:'Aux. da Secao de Manutencao de Redes da Aguada e Esgoto - BNIC-33.1' },
    ],
  }
}

/* ── Persistência ─────────────────────────────────────────────────────────── */
function load() {
  try { const r = localStorage.getItem('hm3'); if (r) return JSON.parse(r) } catch {}
  return [buildMonth()]
}
function save(ms) { try { localStorage.setItem('hm3', JSON.stringify(ms)) } catch {} }

/* ── Célula editável ─────────────────────────────────────────────────────── */
function C({ v, on, wide }) {
  const [ed, setEd] = useState(false)
  const [val, setVal] = useState(v)
  if (!ed && val !== v) setVal(v)
  function done() { setEd(false); if (val !== v) on(val) }
  if (ed) return (
    <input autoFocus className="inp"
      style={{ width: wide ? '100%' : '100%', minWidth: wide ? 180 : 60 }}
      value={val} onChange={e => setVal(e.target.value)}
      onBlur={done} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); done() } if (e.key === 'Escape') { setVal(v); setEd(false) } }}
    />
  )
  return (
    <div className="cel" onClick={() => { setVal(v); setEd(true) }} title="Clique para editar">
      {v || <span style={{color:'#bbb'}}>—</span>}
    </div>
  )
}

/* ── Tabela editável ─────────────────────────────────────────────────────── */
function T({ cols, rows, onCC, onRC, onAR, onDR, onAC, onDC, num = true }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="tbl">
        <thead>
          <tr>
            {num && <th className="th-n">#</th>}
            {cols.map((c, ci) => (
              <th key={ci} className="th">
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <C v={c} on={v => onCC(ci, v)} />
                  {cols.length > 1 && <button className="bx" onClick={() => onDC(ci)}>×</button>}
                </div>
              </th>
            ))}
            <th className="th-act"><button className="b+" onClick={onAC}>+</button></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={r.id} className={ri % 2 === 0 ? 'r0' : 'r1'}>
              {num && <td className="td-n">{ri + 1}</td>}
              {cols.map((_, ci) => (
                <td key={ci} className={ci === 0 ? 'td-w' : 'td'}>
                  <C v={r.cells[ci] ?? ''} on={v => onRC(ri, ci, v)} wide={ci === 0} />
                </td>
              ))}
              <td className="td-act">
                <button className="bx" onClick={() => onDR(ri)}>×</button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={(num ? 1 : 0) + cols.length + 1} className="td-add">
              <button className="b-add" onClick={onAR}>+ Adicionar linha</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

/* ── Transferir leituras ─────────────────────────────────────────────────── */
function transfer(prev, next) {
  const map = {}
  for (const s of prev.sections) {
    const iH = s.cols.indexOf('HIDRÔMETRO'); const iA = s.cols.indexOf('LEITURA ATUAL')
    if (iH < 0 || iA < 0) continue
    map[s.key] = map[s.key] || {}
    for (const r of s.rows) { const h = (r.cells[iH] || '').trim(); if (h && h !== '*******') map[s.key][h] = r.cells[iA] || '' }
  }
  return {
    ...next,
    sections: next.sections.map(s => {
      const iH = s.cols.indexOf('HIDRÔMETRO'); const iP = s.cols.indexOf('LEITURA ANTERIOR')
      if (iH < 0 || iP < 0 || !map[s.key]) return s
      return { ...s, rows: s.rows.map(r => { const h = (r.cells[iH] || '').trim(); if (h && map[s.key][h] !== undefined) { const c = [...r.cells]; c[iP] = map[s.key][h]; return { ...r, cells: c } } return r }) }
    })
  }
}

/* ── App ─────────────────────────────────────────────────────────────────── */
export default function App() {
  const [months, setMonths] = useState(load)
  const [idx, setIdx] = useState(0)
  const [modal, setModal] = useState(null)
  const [newLbl, setNewLbl] = useState('')
  const [delI, setDelI] = useState(null)
  const [exporting, setExp] = useState(false)
  const fileRef = useRef(null)

  const m = months[idx]

  const upd = useCallback(fn => {
    setMonths(prev => { const n = prev.map((x, i) => i === idx ? fn(x) : x); save(n); return n })
  }, [idx])

  const sf = (k, v) => upd(m => ({ ...m, [k]: v }))

  // config
  const ccc = (ci, v) => upd(m => { const c = [...m.cfgCols]; c[ci] = v; return { ...m, cfgCols: c } })
  const crc = (ri, ci, v) => upd(m => ({ ...m, cfgRows: m.cfgRows.map((r, i) => i !== ri ? r : { ...r, cells: r.cells.map((c, j) => j !== ci ? c : v) }) }))
  const car = () => upd(m => ({ ...m, cfgRows: [...m.cfgRows, mk(...Array(m.cfgCols.length).fill(''))] }))
  const cdr = (ri) => upd(m => ({ ...m, cfgRows: m.cfgRows.filter((_, i) => i !== ri) }))
  const cac = () => upd(m => ({ ...m, cfgCols: [...m.cfgCols, 'Nova col'], cfgRows: m.cfgRows.map(r => ({ ...r, cells: [...r.cells, ''] })) }))
  const cdc = (ci) => upd(m => ({ ...m, cfgCols: m.cfgCols.filter((_, i) => i !== ci), cfgRows: m.cfgRows.map(r => ({ ...r, cells: r.cells.filter((_, i) => i !== ci) })) }))

  // seções
  const su = (sk, fn) => upd(m => ({ ...m, sections: m.sections.map(s => s.key === sk ? fn(s) : s) }))
  const stc = (sk, v) => su(sk, s => ({ ...s, title: v }))
  const scc = (sk, ci, v) => su(sk, s => { const c = [...s.cols]; c[ci] = v; return { ...s, cols: c } })
  const src = (sk, ri, ci, v) => su(sk, s => ({ ...s, rows: s.rows.map((r, i) => i !== ri ? r : { ...r, cells: r.cells.map((c, j) => j !== ci ? c : v) }) }))
  const sar = (sk) => su(sk, s => ({ ...s, rows: [...s.rows, mk(...Array(s.cols.length).fill(''))] }))
  const sdr = (sk, ri) => su(sk, s => ({ ...s, rows: s.rows.filter((_, i) => i !== ri) }))
  const sac = (sk) => su(sk, s => ({ ...s, cols: [...s.cols, 'Nova col'], rows: s.rows.map(r => ({ ...r, cells: [...r.cells, ''] })) }))
  const sdc = (sk, ci) => su(sk, s => ({ ...s, cols: s.cols.filter((_, i) => i !== ci), rows: s.rows.map(r => ({ ...r, cells: r.cells.filter((_, i) => i !== ci) })) }))

  // sumários
  const smc = (si, bi, ri, ci, v) => upd(m => ({
    ...m, summaries: m.summaries.map((s, si2) => si2 !== si ? s : {
      ...s, blocks: s.blocks.map((b, bi2) => bi2 !== bi ? b : {
        ...b, rows: b.rows.map((r, ri2) => ri2 !== ri ? r : { ...r, cells: r.cells.map((c, ci2) => ci2 !== ci ? c : v) })
      })
    })
  }))

  // assinaturas
  const sigs = (si, k, v) => upd(m => ({ ...m, sig: m.sig.map((s, i) => i !== si ? s : { ...s, [k]: v }) }))

  // novo mês
  function newMonth() {
    if (!newLbl.trim()) return
    const prev = months[months.length - 1]
    let novo = JSON.parse(JSON.stringify(prev || buildMonth()))
    novo.id = uid(); novo.label = newLbl.trim()
    for (const s of novo.sections) { const iA = s.cols.indexOf('LEITURA ATUAL'); if (iA >= 0) for (const r of s.rows) { r.id = uid(); r.cells[iA] = '' } }
    if (prev) novo = transfer(prev, novo)
    const n = [...months, novo]; setMonths(n); save(n); setIdx(n.length - 1); setModal(null)
  }

  function delMonth() {
    const n = months.filter((_, i) => i !== delI); setMonths(n); save(n); setIdx(Math.min(delI, n.length - 1)); setModal(null)
  }

  function importFile(e) {
    const f = e.target.files[0]; if (!f) return
    const r = new FileReader(); r.onload = ev => {
      try { const d = JSON.parse(ev.target.result); if (!d || !d.sections) { alert('Arquivo inválido'); return }; d.id = uid(); const n = [...months, d]; setMonths(n); save(n); setIdx(n.length - 1); setModal(null) }
      catch { alert('Erro ao ler arquivo') }
    }; r.readAsText(f)
  }

  function exportJson() {
    const b = new Blob([JSON.stringify(m, null, 2)], { type: 'application/json' })
    const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = `Planilha_${m.label.replace('/', '_')}.json`; a.click(); URL.revokeObjectURL(u)
  }

  async function exportXlsx() {
    setExp(true)
    try { const { exportToXlsx } = await import('./utils/export.js'); await exportToXlsx(m) }
    catch (e) { alert('Erro ao exportar: ' + e.message) }
    finally { setExp(false) }
  }

  if (!m) return <div style={{ padding: 32, color: 'red' }}>Erro: sem dados</div>

  return (
    <div className="app">
      <div className="tabs">
        <div className="tabs-list">
          {months.map((mo, i) => (
            <div key={mo.id} className={'tab' + (i === idx ? ' tab-on' : '')} onClick={() => setIdx(i)}>
              {mo.label}
              {months.length > 1 && <button className="tab-x" onClick={e => { e.stopPropagation(); setDelI(i); setModal('del') }}>×</button>}
            </div>
          ))}
          <button className="tab-new" onClick={() => { setNewLbl(nextLabel(months[months.length - 1]?.label || 'MAR/2026')); setModal('new') }}>＋ Novo mês</button>
        </div>
        <div className="tools">
          <button className="bt" onClick={() => setModal('imp')}>⬆ Importar</button>
          <button className="bt" onClick={exportJson}>⬇ JSON</button>
          <button className="bt bt-xl" onClick={exportXlsx} disabled={exporting}>{exporting ? '...' : '📥 Excel'}</button>
        </div>
      </div>

      <div className="wrap">
        <div className="sheet">
          <div className="hdr-i"><C v={m.institution} on={v => sf('institution', v)} wide /></div>
          <div className="hdr-t"><C v={m.title} on={v => sf('title', v)} wide /></div>
          <div className="hdr-d">
            {[['DATA LEITURA ANTERIOR','dateAnterior'],['DATA LEITURA ATUAL','dateAtual'],['MEDICAO','medicao'],['VENCIMENTO','vencimento']].map(([lbl, k]) => (
              <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="dlbl">{lbl}</span>
                <C v={m[k]} on={v => sf(k, v)} />
              </span>
            ))}
          </div>

          <div className="sec-t sec-cfg">CONFIGURACOES BASE</div>
          <T cols={m.cfgCols} rows={m.cfgRows} onCC={ccc} onRC={crc} onAR={car} onDR={cdr} onAC={cac} onDC={cdc} num={false} />

          {m.sections.map(s => (
            <div key={s.id}>
              <div className="sec-t"><C v={s.title} on={v => stc(s.key, v)} wide /></div>
              <T cols={s.cols} rows={s.rows}
                onCC={(ci,v)=>scc(s.key,ci,v)} onRC={(ri,ci,v)=>src(s.key,ri,ci,v)}
                onAR={()=>sar(s.key)} onDR={ri=>sdr(s.key,ri)}
                onAC={()=>sac(s.key)} onDC={ci=>sdc(s.key,ci)} />
            </div>
          ))}

          {m.summaries.map((sum, si) => (
            <div key={sum.id}>
              <div className="sec-t sec-sm">{sum.title}</div>
              {sum.blocks.map((blk, bi) => (
                <table key={blk.id} className="tbl sum-tbl">
                  <tbody>
                    {blk.rows.map((row, ri) => (
                      <tr key={row.id} className={ri === 0 ? 'sum-h' : 'sum-d'}>
                        {row.cells.map((c, ci) => (
                          <td key={ci} className={ri === 0 ? 'sum-th' : 'sum-td'}>
                            <C v={c} on={v => smc(si, bi, ri, ci, v)} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
            </div>
          ))}

          <div className="obs-row">
            <b style={{ whiteSpace: 'nowrap' }}>Obs.:</b>
            <C v={m.obs} on={v => sf('obs', v)} wide />
          </div>

          <div className="sig-row">
            {m.sig.map((s, si) => (
              <div key={si} className="sig-col">
                <div className="sig-lbl"><C v={s.label} on={v => sigs(si, 'label', v)} /></div>
                <div className="sig-nome"><C v={s.nome} on={v => sigs(si, 'nome', v)} wide /></div>
                <div className="sig-cargo"><C v={s.cargo} on={v => sigs(si, 'cargo', v)} /></div>
                <div><C v={s.funcao} on={v => sigs(si, 'funcao', v)} wide /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modal === 'new' && (
        <div className="ov" onClick={() => setModal(null)}>
          <div className="mod" onClick={e => e.stopPropagation()}>
            <h3>Novo mês</h3>
            <p>A <b>LEITURA ATUAL</b> do mês anterior será copiada para <b>LEITURA ANTERIOR</b>.</p>
            <label>Identificação (ex: ABR/2026)
              <input className="mod-inp" value={newLbl} onChange={e => setNewLbl(e.target.value)} onKeyDown={e => e.key === 'Enter' && newMonth()} autoFocus />
            </label>
            <div className="mod-btns"><button className="b-can" onClick={() => setModal(null)}>Cancelar</button><button className="b-ok" onClick={newMonth}>Criar</button></div>
          </div>
        </div>
      )}
      {modal === 'del' && (
        <div className="ov" onClick={() => setModal(null)}>
          <div className="mod" onClick={e => e.stopPropagation()}>
            <h3>Excluir mês</h3>
            <p>Excluir <b>{months[delI]?.label}</b>?</p>
            <div className="mod-btns"><button className="b-can" onClick={() => setModal(null)}>Cancelar</button><button className="b-del" onClick={delMonth}>Excluir</button></div>
          </div>
        </div>
      )}
      {modal === 'imp' && (
        <div className="ov" onClick={() => setModal(null)}>
          <div className="mod" onClick={e => e.stopPropagation()}>
            <h3>Importar JSON</h3>
            <input ref={fileRef} type="file" accept=".json" onChange={importFile} />
            <div className="mod-btns"><button className="b-can" onClick={() => setModal(null)}>Fechar</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
