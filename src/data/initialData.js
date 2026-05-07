const uid = () => Math.random().toString(36).slice(2, 10)

// Colunas padrão sem DIAS (OMs Apoiadas, Extra Marinha, ARES-MAS)
export const COL_STANDARD = [
  'CONSUMIDOR', 'CÓDIGO DA OM', 'HIDRÔMETRO',
  'LEITURA ATUAL', 'LEITURA ANTERIOR', 'CONSUMO (M³)',
  'CONSUMO TOTAL (M³)', 'TOTAL A PAGAR'
]

// Colunas com DIAS (seções de embarcações/navios)
export const COL_DIAS = [
  'CONSUMIDOR', 'CÓDIGO DA OM', 'HIDRÔMETRO',
  'LEITURA ATUAL', 'LEITURA ANTERIOR', 'CONSUMO (M³)',
  'DIAS', 'CONSUMO TOTAL (M³)', 'TOTAL A PAGAR'
]

const r = (...cells) => ({ id: uid(), cells })

export function createMar2026() {
  return {
    id: uid(),
    label: 'MAR/2026',
    header: {
      institution: 'MARINHA DO BRASIL – BASE NAVAL DA ILHA DAS COBRAS – DEPARTAMENTO DE APOIO – DIVISÃO DE MECÂNICA E CAV (BNIC -33)',
      title: 'PLANILHA DE FATURAMENTO DE ÁGUA DOCE E TRATAMENTO DE ESGOTO',
      dateAnterior: '27/02/2026',
      dateAtual: '30/03/26',
      medicao: '03/2026',
      vencimento: '23/04/2026',
    },
    baseConfig: {
      columns: [
        'OM', 'MATRÍCULAS', 'VALOR DO CONSUMO (R$)', 'VALOR TOTAL (R$)',
        'VOLUME CONSUMIDO (M³)', 'VOLUME CONSUMIDO TOTAL (M³)',
        'VALOR DO (M³)', 'R$ 21,959'
      ],
      rows: [
        r('BNIC', '400485340-0', 'R$ 356.740,27', 'R$ 1.844.553,07', '7.972', '41.022', 'RATEIO OM APOIADAS', 'R$ 896.400,94'),
        r('', '400447071-3', 'R$ 1.487.812,80', '', '', '33.050', '', ''),
        r('ARES-MAS (FORA DO RATEIO)', '400485344-2', 'R$ 23.418,16', 'R$ 23.418,16', '531', '531', 'RATEIO CONSUMO OM (M³)', '20011'),
        r('', '', '', 'TAXAS (%)', '2,00%', '', '', ''),
      ],
    },
    sections: [
      {
        id: uid(),
        key: 'oms-apoiadas',
        title: 'OMs APOIADAS',
        hasDias: false,
        columns: [...COL_STANDARD],
        rows: [
          r('AMRJ', '41000', 'Consumidores não hidrometrados', '*******', '*******', '7.984', '7.984', 'R$ 360.297,81'),
          r('', '', 'Compart: H-09 (Ed.16)', '43.241', '43.191', '30', '30', 'R$ 1.343,86'),
          r('', '', 'Compart: H-14 (Ed.11)', '48.095', '47.972', '51', '51', 'R$ 2.263,73'),
          r('', '', 'H-17 (Ed.17)', '18.263', '17.229', '1.034', '1.034', 'R$ 46.318,45'),
          r('', '', 'H-36 (Ed.02)', '104.643', '104.174', '469', '469', 'R$ 21.009,05'),
          r('', '', 'H-53 (Ed.10)', '23.774', '23.576', '154', '154', 'R$ 6.898,49'),
          r('', '', 'H-55 (Ed.19)', '', '', '599', '599', 'R$ 26.832,45'),
          r('', '', 'H-58 (Ed.19)', '6.207', '6.052', '155', '155', 'R$ 6.943,29'),
          r('', '', 'H-61 (Ed.19)', '14.966', '14.600', '366', '366', 'R$ 16.395,12'),
          r('', '', 'H-63 (Ed.04)', '58.897', '58.398', '499', '499', 'R$ 22.352,91'),
          r('', '', 'H-80 (Ed.7B)', '420', '387', '33', '33', 'R$ 1.478,25'),
          r('', '', 'H-82 (Ed.24)', '9.341', '8.983', '358', '358', 'R$ 16.036,76'),
          r('', '', 'H-83 (Ed.06)', '201', '188', '13', '13', 'R$ 582,34'),
          r('', '', 'H-84 (Ed.08)', '9.036', '8.439', '597', '37', 'R$ 1.657,43'),
          r('', '', 'H-85 (Ed.05)', '459', '404', '55', '55', 'R$ 2.463,75'),
          r('', '', 'H-86 (Ed.03)', '3.695', '3.587', '108', '108', 'R$ 4.837,90'),
          r('BNIC', '40015', 'Consumidores não hidrometrados', '*******', '*******', '13.027', '13.027', 'R$ 587.854,32'),
          r('', '', 'H-12 (Ed.17A)', '6.701', '6.457', '244', '244', 'R$ 10.930,08'),
          r('', '', 'H-47 (Ed.09)', '286', '282', '4', '4', 'R$ 179,18'),
          r('', '', 'H-71 (Ed.17 – Caldeira)', '24.380', '24.116', '264', '264', 'R$ 11.825,99'),
          r('', '', 'H-76 (Ed.31)', '4.570', '4.556', '14', '14', 'R$ 627,14'),
          r('', '', 'H-77 (Ed.46)', '5.764', '5.752', '12', '12', 'R$ 537,54'),
          r('', '', 'H-78 (Ed.49)', '1.750', '1.655', '95', '95', 'R$ 4.255,56'),
          r('', '', 'H-79 (Ed.48)', '30.372', '30.038', '334', '334', 'R$ 14.961,67'),
          r('', '', 'H-81 (Ed.41)', '423', '392', '31', '31', 'R$ 1.388,66'),
          r('RANCHO (BNIC)', '40015', 'H-08 (Ed.43)', '34.043', '33.216', '827', '827', 'R$ 37.045,80'),
          r('DgePM-RIO (ed.16)', '40005', 'Compart: H-09 (Ed.16)', '43.241', '43.191', '20', '20', 'R$ 895,91'),
          r('CMS – CETM / DGMM-COGESN (Rateio interno, sob responsabilidade do CMS)', '44021', 'H-11', '17.144', '16.760', '384', '384', 'R$ 17.201,44'),
          r('DIM', '40030', 'Compart: H-14', '48.095', '47.972', '72', '72', 'R$ 3.246,10'),
          r('CMS / DGPeM / AMRJ (Rateio interno, sob responsabilidade do CMS)', '44021', 'H-25 (Ed.08, 2°andar)', '4.929', '4.923', '6', '6', 'R$ 268,77'),
          r('CCSM', '11100', 'H-26 (Ed.08)', '1.116', '1.112', '4', '4', 'R$ 179,18'),
          r('CMS – CAM', '44021', 'H-27', '32.171', '32.036', '135', '135', 'R$ 6.047,38'),
          r('ETAM', '40031', 'H-39', '17.058', '17.011', '47', '47', 'R$ 2.105,38'),
          r('DPHDM (ed.32)', '79000', 'H-44', '15.487', '15.424', '63', '63', 'R$ 2.822,11'),
          r('Ed. ALTE. GASTÃO MOTTA', '71000', 'H-45', '222.075', '221.194', '881', '881', 'R$ 39.464,76'),
          r('PAPEM (ed. 23)', '73200', 'H-48', '55.510', '55.270', '240', '187', 'R$ 8.368,96'),
          r('DCTIM (ed.23)', '49000', '', '', '', '', '53', 'R$ 2.381,94'),
          r('CASNAV (ed. 23)', '23000', 'H-49', '48.128', '47.888', '240', '240', 'R$ 10.750,90'),
          r('ComGptPatNavSe', '81100', 'H-50', '2.114', '2.052', '62', '62', 'R$ 2.777,32'),
          r('ILHA FISCAL', '79000', 'H-65', '5.104', '4.784', '320', '320', 'R$ 14.334,53'),
          r('CPMM', '65730', 'H-66 (caixa d\'água)', '22.381', '22.381', '153', '153', 'R$ 6.853,70'),
          r('HCM', '65701', 'H-67', '714.231', '710.755', '3.476', '1.295', 'R$ 58.010,06'),
          r('PRESÍDIO DA MARINHA', '81940', 'H-68 (calçada)', '47.127', '46.981', '146', '268', 'R$ 12.005,17'),
          r('', '', 'H-69 (portão)', '11.107', '10.985', '122', '122', ''),
          r('BATALHÃO NAVAL', '31050', 'H-70', '415.309', '413.396', '1.913', '1.913', 'R$ 85.693,62'),
          r('SecNSNQ', '18000', 'H-73', '7.977', '7.843', '134', '134', 'R$ 6.002,58'),
          r('XXXX', '20001', 'C.Pipa (m³)', '*******', '*******', '*******', '', 'R$ 0,00'),
          r('XXXX', '81000', 'C.Pipa (m³)', '*******', '*******', '*******', '', 'R$ 0,00'),
          r('', '', '', '*******', '*******', '*******', '', 'R$ 0,00'),
        ],
      },
      {
        id: uid(),
        key: 'extra-marinha',
        title: 'EXTRA MARINHA',
        hasDias: false,
        columns: [...COL_STANDARD],
        rows: [
          r('BNIC (NM ENGENHARIA)', '40015', 'H-08A (Obra Ed.43)', '270', '270', '0', '0', 'R$ 0,00'),
          r('BANCO SANTANDER', '356', 'H-15', '1.627', '1.623', '4', '4', 'R$ 179,18'),
          r('BANCO DO BRASIL', '994', 'H-16', '1.123', '1.120', '3', '3', 'R$ 134,39'),
          r('BANCO ITAU', '997', 'H-18', '1.131', '1.117', '14', '14', 'R$ 627,14'),
          r('EMGEPRON (ed.39)', '10200', 'H-51', '18.416', '18.001', '415', '415', 'R$ 18.590,09'),
          r('AMRJ (PRESTNAV-anexo ao ed.19)', '41000', 'H-54', '5.179', '5.170', '9', '9', 'R$ 403,16'),
          r('AMRJ [SKM (ed.07A)]', '41000', 'H-75', '4.209', '4.174', '35', '35', 'R$ 1.567,84'),
        ],
      },
      {
        id: uid(),
        key: 'cais-oeste',
        title: 'CAIS OESTE, NORTE, LESTE E SUL INTERNO',
        hasDias: true,
        columns: [...COL_DIAS],
        rows: [
          r('SEM CONEXÃO', '*******', 'H-01', '164', '164', '0', '', '0', 'R$ 0,00'),
          r('SEM CONEXÃO', '*******', 'H-02', '15.504', '15.504', '0', '', '0', 'R$ 0,00'),
          r('NT. ALTE GASTÃO MOTTA', '91665', 'H-03', '1.754', '1.432', '322', '31', '322', 'R$ 14.424,12'),
          r('SEM CONEXÃO', '*******', 'H-10', '9.319', '9.319', '0', '', '0', 'R$ 0,00'),
          r('SEM CONEXÃO', '*******', 'H-13', '38.973', '38.973', '0', '', '0', 'R$ 0,00'),
          r('SKANDI AÇU', '41000', 'H-28', '43.919', '43.319', '600', '6', '540', 'R$ 24.189,52'),
          r('CV. BARROSO', '91645', '', '', '', '', '27', '60', 'R$ 2.687,72'),
          r('NapOc MEARIM', '85120', 'H-29', '14.338', '14.164', '174', '6', '174', 'R$ 7.794,40'),
          r('NDM BAHIA', '91670', 'H-30', '13.069', '12.890', '179', '31', '179', 'R$ 8.018,38'),
          r('SEM CONEXÃO', '*******', 'H-31', '26.085', '26.085', '0', '', '0', 'R$ 0,00'),
          r('F. LIBERAL', '91614', 'H-32', '1.330', '944', '386', '31', '193', 'R$ 8.645,51'),
          r('F. RADEMAKER', '91624', '', '', '', '', '31', '193', 'R$ 8.645,51'),
          r('SEM CONEXÃO', '*******', 'H-33', '32.858', '32.858', '0', '', '0', 'R$ 0,00'),
          r('SEM CONEXÃO', '*******', 'H-34', '17.667', '17.667', '0', '28', '0', 'R$ 0,00'),
          r('SEM CONEXÃO', '*******', 'H-35', '43.820', '43.820', '0', '28', '0', 'R$ 0,00'),
          r('SEM CONEXÃO', '*******', 'H-37', '1', '1', '0', '', '0', 'R$ 0,00'),
          r('F. UNIÂO', '91616', 'H-38', '16.793', '16.503', '290', '14', '290', 'R$ 12.990,67'),
          r('AMRJ (DIQUE ALTE SCHIEK)', '41000', 'H-64', '324', '318', '6', '28', '6', 'R$ 268,77'),
          r('SEM CONEXÃO', '*******', 'H-74', '4', '4', '0', '', '0', 'R$ 0,00'),
          r('EDCG TAMBAÚ', '91673', 'H-88', '410', '399', '11', '7', '11', 'R$ 492,75'),
        ],
      },
      {
        id: uid(),
        key: 'cais-portuguesa',
        title: 'CAIS DA PORTUGUESA E MOLHE SUL EXTERNO',
        hasDias: true,
        columns: [...COL_DIAS],
        rows: [
          r('Npa GURUPÍ', '81147', 'H-56', '3.994', '3.969', '25', '29', '25', 'R$ 1.119,89'),
          r('SEM CONEXÃO', '*******', 'H-57', '6.687', '6.687', '0', '', '0', 'R$ 0,00'),
          r('SEM CONEXÃO', '*******', 'H-59', '4.889', '4.889', '0', '', '0', 'R$ 0,00'),
          r('SEM CONEXÃO', '*******', 'H-60', '4.298', '4.298', '0', '', '0', 'R$ 0,00'),
          r('AviPA ANEQUIM', '81100', 'H-62', '4.442', '4.428', '14', '31', '14', 'R$ 627,14'),
          r('SEM CONEXÃO', '*******', 'H-87', '', '', '0', '', '0', 'R$ 0,00'),
        ],
      },
      {
        id: uid(),
        key: 'dique-almirante-regis',
        title: 'DIQUE ALMIRANTE RÉGIS',
        hasDias: true,
        columns: [...COL_DIAS],
        rows: [
          r('NAM ATLÂNTICO', '230318', 'H-19', '30.167', '29.325', '842', '31', '842', 'R$ 37.717,73'),
          r('SKANDI AÇU', '41000', 'H-20', '12.225', '11.194', '1.031', '25', '1.031', 'R$ 46.184,07'),
          r('SKANDI AÇU', '41000', 'H-21', '21.953', '20.718', '1.235', '25', '1.235', 'R$ 55.322,33'),
          r('SKANDI AÇU', '41000', 'H-22', '18.213', '16.272', '1.941', '25', '1.941', 'R$ 86.947,89'),
          r('SKANDI AÇU', '41000', 'H-23', '9.437', '9.437', '0', '25', '0', 'R$ 0,00'),
          r('SEM CONEXÃO', '*******', 'H-24', '2.847', '2.847', '0', '', '0', 'R$ 0,00'),
          r('SKANDI AÇU', '41000', 'H-46 (Ed.51)', '1.428', '1.373', '55', '25', '55', 'R$ 2.463,75'),
          r('SEM CONEXÃO', '*******', 'H-52', '3.844', '3.844', '0', '', '0', 'R$ 0,00'),
        ],
      },
      {
        id: uid(),
        key: 'dique-jardim',
        title: 'DIQUE JARDIM',
        hasDias: true,
        columns: [...COL_DIAS],
        rows: [
          r('Npa MACAÉ', '81148', 'H-41', '24.408', '24.132', '276', '18', '276', 'R$ 12.363,53'),
          r('Npa MACAÉ', '81148', 'H-42', '4.152', '4.102', '50', '18', '50', 'R$ 2.239,77'),
        ],
      },
      {
        id: uid(),
        key: 'dique-santa-cruz',
        title: 'DIQUE SANTA CRUZ',
        hasDias: true,
        columns: [...COL_DIAS],
        rows: [
          r('S. TIKUNA', '91534', 'H-43', '19.744', '19.740', '4', '26', '4', 'R$ 179,18'),
        ],
      },
      {
        id: uid(),
        key: 'edificio-submarinos',
        title: 'EDIFÍCIO APOIO AOS SUBMARINOS',
        hasDias: true,
        columns: [...COL_DIAS],
        rows: [
          r('S. TIKUNA', '91534', 'H-40', '15.208', '15.141', '67', '26', '67', 'R$ 3.001,29'),
        ],
      },
      {
        id: uid(),
        key: 'ares-mas',
        title: 'ARES-MAS (FORA DO RATEIO – CONSUMO DESTINADO AO BATALHÃO NAVAL)',
        hasDias: false,
        columns: [...COL_STANDARD],
        rows: [
          r('ARES-MAS (BATALHÃO NAVAL)', '31050', 'MAT. 400485344-2', '*******', '*******', '*******', '531', 'R$ 23.418,16'),
        ],
      },
    ],
    summaries: [
      {
        id: uid(),
        title: 'TOTAL DE CONSUMO DOS NAVIOS/OM COM HIDRÔMETRO COMPARTILHADO OU COM ACRÉSCIMO NO CONSUMO',
        blocks: [
          {
            id: uid(),
            rows: [
              r('OM', 'AMRJ (COM TERCEIRIZADAS)', 'AMRJ (SEM TERCEIRIZADAS)', 'S. TIKUNA'),
              r('R$', 'R$ 755.058,92', 'R$ 537.711,59', 'R$ 3.180,47'),
              r('m³', '16.797', '11.945', '71'),
            ],
          },
          {
            id: uid(),
            rows: [
              r('OM', 'BNIC (SEM RANCHO)', 'SKANDI AÇU'),
              r('R$', 'R$ 632.560,14', 'R$ 215.107,56'),
              r('m³', '14.025', '4.802'),
            ],
          },
        ],
      },
    ],
    observations: 'Consumo do HCM = H67 (entrada do HCM) – H66 (CPMM) – H68 – H69 (PRESÍDIO) – H70 (BATALHÃO)',
    signatures: {
      approvedBy: {
        label: 'Aprovado por:',
        name: 'DANIEL ALBUERNE DINIZ BEZERRA',
        rank: '1T(EN)',
        role: 'Encarregado da Divisão de Mecânica e Cav – BNIC-33',
      },
      preparedBy: {
        label: 'Elaborado por:',
        name: 'SAMUEL PIRES DE ARAÚJO',
        rank: 'Segundo-Sargento – CA',
        role: 'Aux. da Seção de Manutenção de Redes da Aguada e Esgoto – BNIC-33.1',
      },
    },
  }
}

export function getStoredMonths() {
  try {
    const raw = localStorage.getItem('hidrometros_months')
    if (raw) return JSON.parse(raw)
  } catch {}
  return [createMar2026()]
}

export function saveMonths(months) {
  localStorage.setItem('hidrometros_months', JSON.stringify(months))
}
