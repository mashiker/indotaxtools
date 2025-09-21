import { create } from 'zustand';
import {
  calculateTer,
  calculateGrossUp,
  calculatePphTerutang,
  calculateGrossUpTahunan,
  getPtkpTahunan,
  TerResult,
  GrossUpResult,
  GrossUpTahunanResult
} from '../pph21-utils';

export interface BulananInputs {
  statusPegawai: string;
  ptkpStatus: string;
  taxMethod: 'gross' | 'gross-up';
  gaji: number;
  tunjanganPph: number;
  tunjanganLain: number;
  honorarium: number;
  premiAsuransi: number;
  natura: number;
  bonus: number;
}

export interface TahunanInputs {
  statusPegawai: string;
  statusKawin: string;
  tanggungan: number;
  taxMethod: 'gross' | 'gross-up';
  gajiTahunan: number;
  tunjanganPphTahunan: number;
  tunjanganLainTahunan: number;
  honorariumTahunan: number;
  premiAsuransiTahunan: number;
  naturaTahunan: number;
  bonusTahunan: number;
  iuranPensiunTahunan: number;
  zakatTahunan: number;
  pph21DipotongSebelumnya: number;
}

export interface BulananResult {
  penghasilanBruto: number;
  pph21Terutang: number;
  terRate: number;
  category: string;
  tunjanganPph: number;
}

export interface TahunanResult {
  brutoSetahun: number;
  nettoSetahun: number;
  pkpSetahun: number;
  pphTerutangSetahun: number;
  pph21MasaTerakhir: number;
  statusPotong: string;
  tunjanganPph: number;
  biayaJabatan: number;
  totalPengurang: number;
  detailPerhitungan: string[];
}

export interface Pph21State {
  activeTab: 'bulanan' | 'tahunan';
  bulananInputs: BulananInputs;
  tahunanInputs: TahunanInputs;
  bulananResult: BulananResult | null;
  tahunanResult: TahunanResult | null;
  error: string | null;

  // Actions
  setActiveTab: (tab: 'bulanan' | 'tahunan') => void;
  updateBulananInput: (key: keyof BulananInputs, value: any) => void;
  updateTahunanInput: (key: keyof TahunanInputs, value: any) => void;
  calculateBulanan: () => void;
  calculateTahunan: () => void;
  resetBulanan: () => void;
  resetTahunan: () => void;
  clearError: () => void;
}

const initialBulananInputs: BulananInputs = {
  statusPegawai: 'Pegawai Tetap',
  ptkpStatus: 'TK0',
  taxMethod: 'gross',
  gaji: 0,
  tunjanganPph: 0,
  tunjanganLain: 0,
  honorarium: 0,
  premiAsuransi: 0,
  natura: 0,
  bonus: 0,
};

const initialTahunanInputs: TahunanInputs = {
  statusPegawai: 'tetap',
  statusKawin: 'TK',
  tanggungan: 0,
  taxMethod: 'gross',
  gajiTahunan: 0,
  tunjanganPphTahunan: 0,
  tunjanganLainTahunan: 0,
  honorariumTahunan: 0,
  premiAsuransiTahunan: 0,
  naturaTahunan: 0,
  bonusTahunan: 0,
  iuranPensiunTahunan: 0,
  zakatTahunan: 0,
  pph21DipotongSebelumnya: 0,
};

export const usePph21Store = create<Pph21State>((set, get) => ({
  activeTab: 'bulanan',
  bulananInputs: initialBulananInputs,
  tahunanInputs: initialTahunanInputs,
  bulananResult: null,
  tahunanResult: null,
  error: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  updateBulananInput: (key, value) => {
    set((state) => ({
      bulananInputs: { ...state.bulananInputs, [key]: value },
      bulananResult: null,
      error: null,
    }));
  },

  updateTahunanInput: (key, value) => {
    set((state) => ({
      tahunanInputs: { ...state.tahunanInputs, [key]: value },
      tahunanResult: null,
      error: null,
    }));
  },

  calculateBulanan: () => {
    const { bulananInputs } = get();
    const { taxMethod, tunjanganPph, ptkpStatus } = bulananInputs;

    let baseBruto = bulananInputs.gaji + bulananInputs.tunjanganLain + bulananInputs.honorarium +
                    bulananInputs.premiAsuransi + bulananInputs.natura + bulananInputs.bonus;

    let finalBruto: number;
    let pph21: number;
    let terRate: number;
    let category: string;
    let tunjanganPphResult = 0;

    if (taxMethod === 'gross-up') {
      const grossUpResult: GrossUpResult = calculateGrossUp(baseBruto, ptkpStatus);
      tunjanganPphResult = grossUpResult.tunjanganPph;
      pph21 = grossUpResult.pphFinal;
      finalBruto = grossUpResult.finalBruto;
      terRate = grossUpResult.terRate;
      category = grossUpResult.category;
    } else {
      tunjanganPphResult = tunjanganPph;
      finalBruto = Math.round(baseBruto + tunjanganPph);
      if (finalBruto <= 0) {
        set({ error: 'Penghasilan bruto harus lebih besar dari 0.' });
        return;
      }
      const terResult: TerResult = calculateTer(finalBruto, ptkpStatus);
      pph21 = terResult.pph21;
      terRate = terResult.terRate;
      category = terResult.category;
    }

    const result: BulananResult = {
      penghasilanBruto: finalBruto,
      pph21Terutang: pph21,
      terRate,
      category,
      tunjanganPph: tunjanganPphResult,
    };

    set({ bulananResult: result, error: null });
  },

  calculateTahunan: () => {
    const { tahunanInputs } = get();
    const {
      statusPegawai, statusKawin, tanggungan, taxMethod, pph21DipotongSebelumnya,
      gajiTahunan, tunjanganLainTahunan, honorariumTahunan, premiAsuransiTahunan,
      naturaTahunan, bonusTahunan, iuranPensiunTahunan, zakatTahunan
    } = tahunanInputs;

    const ptkpTahunan = getPtkpTahunan(statusKawin, tanggungan);
    if (ptkpTahunan === null) {
      set({ error: 'Status kawin atau tanggungan tidak valid.' });
      return;
    }

    let baseBrutoSetahun = gajiTahunan + tunjanganLainTahunan + honorariumTahunan +
                           premiAsuransiTahunan + naturaTahunan + bonusTahunan;

    const pengurangLain = iuranPensiunTahunan + zakatTahunan;

    let brutoSetahun: number;
    let tunjanganPph = 0;

    if (taxMethod === 'gross-up') {
      const grossUpResult: GrossUpTahunanResult = calculateGrossUpTahunan(
        baseBrutoSetahun, pengurangLain, ptkpTahunan, statusPegawai
      );
      tunjanganPph = grossUpResult.tunjanganPph;
      brutoSetahun = grossUpResult.brutoSetahun;
    } else {
      tunjanganPph = tahunanInputs.tunjanganPphTahunan;
      brutoSetahun = baseBrutoSetahun + tunjanganPph;
    }

    const maxBiayaJabatan = statusPegawai === 'tetap' ? 6000000 : 2400000;
    const biayaJabatan = Math.min(brutoSetahun * 0.05, maxBiayaJabatan);
    const totalPengurang = biayaJabatan + pengurangLain;
    const nettoSetahun = brutoSetahun - totalPengurang;
    const pkpSetahun = Math.max(0, Math.floor((nettoSetahun - ptkpTahunan) / 1000) * 1000);
    const pphTerutangSetahun = calculatePphTerutang(pkpSetahun);

    // Calculate detail perhitungan
    const detailPerhitungan: string[] = [];
    let sisaPkp = pkpSetahun;
    const tarifLayers = [
      { limit: 60000000, rate: 0.05 }, { limit: 250000000, rate: 0.15 },
      { limit: 500000000, rate: 0.25 }, { limit: 5000000000, rate: 0.30 },
      { limit: Infinity, rate: 0.35 }
    ];
    let batasBawah = 0;
    for (const layer of tarifLayers) {
      if (sisaPkp <= 0) break;
      const pkpDiLayer = Math.min(sisaPkp, layer.limit - batasBawah);
      const pajakDiLayer = pkpDiLayer * layer.rate;
      if (pajakDiLayer > 0) {
        detailPerhitungan.push(`${(layer.rate * 100)}% × Rp ${Math.round(pkpDiLayer).toLocaleString('id-ID')} = Rp ${Math.round(pajakDiLayer).toLocaleString('id-ID')}`);
      }
      sisaPkp -= pkpDiLayer;
      batasBawah = layer.limit;
    }

    const pph21MasaTerakhir = Math.round(pphTerutangSetahun - pph21DipotongSebelumnya);
    const statusPotong = pph21MasaTerakhir >= 0 ? "Kurang Bayar" : "Lebih Bayar";

    const result: TahunanResult = {
      brutoSetahun,
      nettoSetahun,
      pkpSetahun,
      pphTerutangSetahun,
      pph21MasaTerakhir,
      statusPotong,
      tunjanganPph,
      biayaJabatan,
      totalPengurang,
      detailPerhitungan,
    };

    set({ tahunanResult: result, error: null });
  },

  resetBulanan: () => {
    set({
      bulananInputs: initialBulananInputs,
      bulananResult: null,
      error: null,
    });
  },

  resetTahunan: () => {
    set({
      tahunanInputs: initialTahunanInputs,
      tahunanResult: null,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));