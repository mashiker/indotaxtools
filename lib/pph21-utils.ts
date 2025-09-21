export interface PtkpRate {
  ptkp: number;
  category: string;
}

export interface TerRange {
  from: number;
  to: number;
  rate: number;
}

export interface TerResult {
  pph21: number;
  terRate: number;
  category: string;
  bruto: number;
}

export interface GrossUpResult {
  tunjanganPph: number;
  pphFinal: number;
  terRate: number;
  category: string;
  finalBruto: number;
}

export const ptkpRates: Record<string, PtkpRate> = {
  'TK0': { ptkp: 54000000, category: 'A' }, 'TK1': { ptkp: 58500000, category: 'A' },
  'TK2': { ptkp: 63000000, category: 'B' }, 'TK3': { ptkp: 67500000, category: 'B' },
  'K0': { ptkp: 58500000, category: 'A' }, 'K1': { ptkp: 63000000, category: 'B' },
  'K2': { ptkp: 67500000, category: 'B' }, 'K3': { ptkp: 72000000, category: 'C' },
  'KI0': { ptkp: 112500000, category: 'C' }, 'KI1': { ptkp: 117000000, category: 'C' },
  'KI2': { ptkp: 121500000, category: 'C' }, 'KI3': { ptkp: 126000000, category: 'C' }
};

export const ter_A: TerRange[] = [
  { from: 0, to: 5400000, rate: 0.0 }, { from: 5400001, to: 5650000, rate: 0.0025 },
  { from: 5650001, to: 5950000, rate: 0.005 }, { from: 5950001, to: 6300000, rate: 0.0075 },
  { from: 6300001, to: 6750000, rate: 0.01 }, { from: 6750001, to: 7500000, rate: 0.0125 },
  { from: 7500001, to: 8550000, rate: 0.015 }, { from: 8550001, to: 9650000, rate: 0.0175 },
  { from: 9650001, to: 10050000, rate: 0.02 }, { from: 10050001, to: 10350000, rate: 0.0225 },
  { from: 10350001, to: 10700000, rate: 0.025 }, { from: 10700001, to: 11050000, rate: 0.03 },
  { from: 11050001, to: 11600000, rate: 0.035 }, { from: 11600001, to: 12500000, rate: 0.04 },
  { from: 12500001, to: 13750000, rate: 0.05 }, { from: 13750001, to: 15100000, rate: 0.06 },
  { from: 15100001, to: 16950000, rate: 0.07 }, { from: 16950001, to: 19750000, rate: 0.08 },
  { from: 19750001, to: 24150000, rate: 0.09 }, { from: 24150001, to: 26450000, rate: 0.1 },
  { from: 26450001, to: 28000000, rate: 0.11 }, { from: 28000001, to: 30050000, rate: 0.12 },
  { from: 30050001, to: 32400000, rate: 0.13 }, { from: 32400001, to: 35400000, rate: 0.14 },
  { from: 35400001, to: 39100000, rate: 0.15 }, { from: 39100001, to: 43850000, rate: 0.16 },
  { from: 43850001, to: 47800000, rate: 0.17 }, { from: 47800001, to: 51400000, rate: 0.18 },
  { from: 51400001, to: 56300000, rate: 0.19 }, { from: 56300001, to: 62200000, rate: 0.2 },
  { from: 62200001, to: 68600000, rate: 0.21 }, { from: 68600001, to: 77500000, rate: 0.22 },
  { from: 77500001, to: 89000000, rate: 0.23 }, { from: 89000001, to: 103000000, rate: 0.24 },
  { from: 103000001, to: 125000000, rate: 0.25 }, { from: 125000001, to: 157000000, rate: 0.26 },
  { from: 157000001, to: 206000000, rate: 0.27 }, { from: 206000001, to: 337000000, rate: 0.28 },
  { from: 337000001, to: 454000000, rate: 0.29 }, { from: 454000001, to: 550000000, rate: 0.3 },
  { from: 550000001, to: 695000000, rate: 0.31 }, { from: 695000001, to: 910000000, rate: 0.32 },
  { from: 910000001, to: 1400000000, rate: 0.33 }, { from: 1400000001, to: Infinity, rate: 0.34 }
];

export const ter_B: TerRange[] = [
  { from: 0, to: 6200000, rate: 0.0 }, { from: 6200001, to: 6500000, rate: 0.0025 },
  { from: 6500001, to: 6850000, rate: 0.005 }, { from: 6850001, to: 7300000, rate: 0.0075 },
  { from: 7300001, to: 9200000, rate: 0.01 }, { from: 9200001, to: 10750000, rate: 0.015 },
  { from: 10750001, to: 11250000, rate: 0.02 }, { from: 11250001, to: 11600000, rate: 0.025 },
  { from: 11600001, to: 12600000, rate: 0.03 }, { from: 12600001, to: 13600000, rate: 0.04 },
  { from: 13600001, to: 14950000, rate: 0.05 }, { from: 14950001, to: 16400000, rate: 0.06 },
  { from: 16400001, to: 18450000, rate: 0.07 }, { from: 18450001, to: 21850000, rate: 0.08 },
  { from: 21850001, to: 26000000, rate: 0.09 }, { from: 26000001, to: 27700000, rate: 0.1 },
  { from: 27700001, to: 29350000, rate: 0.11 }, { from: 29350001, to: 31450000, rate: 0.12 },
  { from: 31450001, to: 33950000, rate: 0.13 }, { from: 33950001, to: 37100000, rate: 0.14 },
  { from: 37100001, to: 41100000, rate: 0.15 }, { from: 411000001, to: 45800000, rate: 0.16 },
  { from: 45800001, to: 49500000, rate: 0.17 }, { from: 49500001, to: 53800000, rate: 0.18 },
  { from: 53800001, to: 58500000, rate: 0.19 }, { from: 58500001, to: 64000000, rate: 0.2 },
  { from: 64000001, to: 71000000, rate: 0.21 }, { from: 71000001, to: 80000000, rate: 0.22 },
  { from: 80000001, to: 93000000, rate: 0.23 }, { from: 93000001, to: 109000000, rate: 0.24 },
  { from: 109000001, to: 129000000, rate: 0.25 }, { from: 129000001, to: 163000000, rate: 0.26 },
  { from: 163000001, to: 211000000, rate: 0.27 }, { from: 211000001, to: 374000000, rate: 0.28 },
  { from: 374000001, to: 459000000, rate: 0.29 }, { from: 459000001, to: 555000000, rate: 0.3 },
  { from: 555000001, to: 704000000, rate: 0.31 }, { from: 704000001, to: 957000000, rate: 0.32 },
  { from: 957000001, to: 1405000000, rate: 0.33 }, { from: 1405000001, to: Infinity, rate: 0.34 }
];

export const ter_C: TerRange[] = [
  { from: 0, to: 6600000, rate: 0.0 }, { from: 6600001, to: 6950000, rate: 0.0025 },
  { from: 6950001, to: 7350000, rate: 0.005 }, { from: 7350001, to: 7800000, rate: 0.0075 },
  { from: 7800001, to: 8850000, rate: 0.01 }, { from: 8850001, to: 9800000, rate: 0.0125 },
  { from: 9800001, to: 10950000, rate: 0.015 }, { from: 10950001, to: 11200000, rate: 0.0175 },
  { from: 11200001, to: 12050000, rate: 0.02 }, { from: 12050001, to: 12950000, rate: 0.03 },
  { from: 12950001, to: 14150000, rate: 0.04 }, { from: 14150001, to: 15550000, rate: 0.05 },
  { from: 15550001, to: 17050000, rate: 0.06 }, { from: 17050001, to: 19500000, rate: 0.07 },
  { from: 19500001, to: 22700000, rate: 0.08 }, { from: 22700001, to: 26600000, rate: 0.09 },
  { from: 26600001, to: 28100000, rate: 0.1 }, { from: 28100001, to: 30100000, rate: 0.11 },
  { from: 30100001, to: 32600000, rate: 0.12 }, { from: 32600001, to: 35400000, rate: 0.13 },
  { from: 35400001, to: 38900000, rate: 0.14 }, { from: 38900001, to: 43000000, rate: 0.15 },
  { from: 43000001, to: 47400000, rate: 0.16 }, { from: 47400001, to: 51200000, rate: 0.17 },
  { from: 51200001, to: 55800000, rate: 0.18 }, { from: 55800001, to: 60400000, rate: 0.19 },
  { from: 60400001, to: 66700000, rate: 0.2 }, { from: 66700001, to: 74500000, rate: 0.21 },
  { from: 74500001, to: 83200000, rate: 0.22 }, { from: 83200001, to: 95600000, rate: 0.23 },
  { from: 95600001, to: 110000000, rate: 0.24 }, { from: 110000001, to: 134000000, rate: 0.25 },
  { from: 134000001, to: 169000000, rate: 0.26 }, { from: 169000001, to: 221000000, rate: 0.27 },
  { from: 221000001, to: 390000000, rate: 0.28 }, { from: 390000001, to: 463000000, rate: 0.29 },
  { from: 463000001, to: 561000000, rate: 0.3 }, { from: 561000001, to: 709000000, rate: 0.31 },
  { from: 709000001, to: 965000000, rate: 0.32 }, { from: 965000001, to: 1419000000, rate: 0.33 },
  { from: 1419000001, to: Infinity, rate: 0.34 }
];

export const ptkpOptions = [
  { value: 'TK0', text: 'TK/0 - Tidak Kawin, 0 Tanggungan' },
  { value: 'TK1', text: 'TK/1 - Tidak Kawin, 1 Tanggungan' },
  { value: 'TK2', text: 'TK/2 - Tidak Kawin, 2 Tanggungan' },
  { value: 'TK3', text: 'TK/3 - Tidak Kawin, 3 Tanggungan' },
  { value: 'K0', text: 'K/0 - Kawin, 0 Tanggungan' },
  { value: 'K1', text: 'K/1 - Kawin, 1 Tanggungan' },
  { value: 'K2', text: 'K/2 - Kawin, 2 Tanggungan' },
  { value: 'K3', text: 'K/3 - Kawin, 3 Tanggungan' },
  { value: 'KI0', text: 'K/I/0 - Kawin (Istri Bekerja), 0 Tanggungan' },
  { value: 'KI1', text: 'K/I/1 - Kawin (Istri Bekerja), 1 Tanggungan' },
  { value: 'KI2', text: 'K/I/2 - Kawin (Istri Bekerja), 2 Tanggungan' },
  { value: 'KI3', text: 'K/I/3 - Kawin (Istri Bekerja), 3 Tanggungan' }
];

export function calculateTer(bruto: number, ptkpStatus: string): TerResult {
  bruto = Math.round(bruto);
  const ptkpInfo = ptkpRates[ptkpStatus];
  if (!ptkpInfo) return { pph21: 0, terRate: 0, category: 'N/A', bruto };
  const category = ptkpInfo.category;
  const terTable = category === 'A' ? ter_A : (category === 'B' ? ter_B : ter_C);
  const foundRate = terTable.find(range => bruto >= range.from && bruto <= range.to);
  const terRate = foundRate ? foundRate.rate : 0;
  const pph21 = Math.round(bruto * terRate);
  return { pph21, terRate, category, bruto };
}

export function calculateGrossUp(baseIncome: number, ptkpStatus: string): GrossUpResult {
  let tunjanganPph = 0;
  for (let i = 0; i < 10; i++) {
    let bruto = Math.round(baseIncome + tunjanganPph);
    const terResult = calculateTer(bruto, ptkpStatus);
    if (Math.abs(terResult.pph21 - tunjanganPph) < 1) {
      tunjanganPph = terResult.pph21;
      break;
    }
    tunjanganPph = terResult.pph21;
  }
  const finalBruto = Math.round(baseIncome + tunjanganPph);
  const finalResult = calculateTer(finalBruto, ptkpStatus);
  return {
    tunjanganPph: Math.round(tunjanganPph),
    pphFinal: finalResult.pph21,
    terRate: finalResult.terRate,
    category: finalResult.category,
    finalBruto: finalResult.bruto
  };
}

export function getPtkpTahunan(statusKawin: string, tanggungan: number): number | null {
  const ptkpMatrix: Record<string, number[]> = {
    'TK': [54000000, 58500000, 63000000, 67500000],
    'K':  [58500000, 63000000, 67500000, 72000000],
    'KI': [112500000, 117000000, 121500000, 126000000]
  };
  return ptkpMatrix[statusKawin] ? ptkpMatrix[statusKawin][tanggungan] : null;
}

export function calculatePphTerutang(pkp: number): number {
  let pph = 0;
  let sisaPkp = pkp;
  const tarifLayers = [
    { limit: 60000000, rate: 0.05 }, { limit: 250000000, rate: 0.15 },
    { limit: 500000000, rate: 0.25 }, { limit: 5000000000, rate: 0.30 },
    { limit: Infinity, rate: 0.35 }
  ];
  let batasBawah = 0;
  for (const layer of tarifLayers) {
    if (sisaPkp <= 0) break;
    const pkpDiLayer = Math.min(sisaPkp, layer.limit - batasBawah);
    pph += pkpDiLayer * layer.rate;
    sisaPkp -= pkpDiLayer;
    batasBawah = layer.limit;
  }
  return pph;
}

export interface GrossUpTahunanResult {
  tunjanganPph: number;
  brutoSetahun: number;
}

export function calculateGrossUpTahunan(baseBruto: number, pengurangLain: number, ptkp: number, statusPegawai: string): GrossUpTahunanResult {
  let tunjanganPph = 0;
  const maxBiayaJabatan = statusPegawai === 'tetap' ? 6000000 : 2400000;
  for(let i=0; i < 10; i++) {
    const brutoSetahun = baseBruto + tunjanganPph;
    const biayaJabatan = Math.min(brutoSetahun * 0.05, maxBiayaJabatan);
    const nettoSetahun = brutoSetahun - biayaJabatan - pengurangLain;
    const pkpSetahun = Math.max(0, Math.floor((nettoSetahun - ptkp) / 1000) * 1000);
    const pphTerutang = calculatePphTerutang(pkpSetahun);
    if (Math.abs(pphTerutang - tunjanganPph) < 1) {
      tunjanganPph = pphTerutang;
      break;
    }
    tunjanganPph = pphTerutang;
  }
  return { tunjanganPph: Math.round(tunjanganPph), brutoSetahun: baseBruto + Math.round(tunjanganPph) };
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(Math.round(num));
}