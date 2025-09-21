import { create } from 'zustand';
import {
  calculatePph22,
  calculatePph23,
  calculatePph42,
  calculatePpn,
  calculatePphUnifikasi,
  Pph22Result,
  Pph23Result,
  Pph42Result,
  PpnResult,
  PphUnifikasiResult
} from '../pph-unifikasi-utils';

export interface Pph22Inputs {
  jenisBarang: string;
  nilaiTransaksi: number;
  tarifPph22: number;
}

export interface Pph23Inputs {
  jenisPenghasilan: string;
  nilaiPenghasilan: number;
  tarifPph23: number;
  npwp: boolean;
}

export interface Pph42Inputs {
  jenisPenghasilan: string;
  nilaiPenghasilan: number;
  tarifPph42: number;
}

export interface PpnInputs {
  nilaiTransaksi: number;
  tarifPpn: number;
  jenisTransaksi: string;
}

export interface PphUnifikasiInputs {
  penghasilanBruto: number;
  pengurangan: number;
  jenisUsaha: string;
}

export interface PphUnifikasiState {
  activeTab: 'pph22' | 'pph23' | 'pph42' | 'ppn' | 'unifikasi';
  pph22Inputs: Pph22Inputs;
  pph23Inputs: Pph23Inputs;
  pph42Inputs: Pph42Inputs;
  ppnInputs: PpnInputs;
  unifikasiInputs: PphUnifikasiInputs;
  pph22Result: Pph22Result | null;
  pph23Result: Pph23Result | null;
  pph42Result: Pph42Result | null;
  ppnResult: PpnResult | null;
  unifikasiResult: PphUnifikasiResult | null;
  error: string | null;

  // Actions
  setActiveTab: (tab: 'pph22' | 'pph23' | 'pph42' | 'ppn' | 'unifikasi') => void;
  updatePph22Input: (key: keyof Pph22Inputs, value: any) => void;
  updatePph23Input: (key: keyof Pph23Inputs, value: any) => void;
  updatePph42Input: (key: keyof Pph42Inputs, value: any) => void;
  updatePpnInput: (key: keyof PpnInputs, value: any) => void;
  updateUnifikasiInput: (key: keyof PphUnifikasiInputs, value: any) => void;
  calculatePph22: () => void;
  calculatePph23: () => void;
  calculatePph42: () => void;
  calculatePpn: () => void;
  calculateUnifikasi: () => void;
  resetPph22: () => void;
  resetPph23: () => void;
  resetPph42: () => void;
  resetPpn: () => void;
  resetUnifikasi: () => void;
  clearError: () => void;
}

const initialPph22Inputs: Pph22Inputs = {
  jenisBarang: 'impor',
  nilaiTransaksi: 0,
  tarifPph22: 2.5,
};

const initialPph23Inputs: Pph23Inputs = {
  jenisPenghasilan: 'dividen',
  nilaiPenghasilan: 0,
  tarifPph23: 15,
  npwp: true,
};

const initialPph42Inputs: Pph42Inputs = {
  jenisPenghasilan: 'bunga',
  nilaiPenghasilan: 0,
  tarifPph42: 10,
};

const initialPpnInputs: PpnInputs = {
  nilaiTransaksi: 0,
  tarifPpn: 11,
  jenisTransaksi: 'penjualan',
};

const initialUnifikasiInputs: PphUnifikasiInputs = {
  penghasilanBruto: 0,
  pengurangan: 0,
  jenisUsaha: 'umkm',
};

export const usePphUnifikasiStore = create<PphUnifikasiState>((set, get) => ({
  activeTab: 'unifikasi',
  pph22Inputs: initialPph22Inputs,
  pph23Inputs: initialPph23Inputs,
  pph42Inputs: initialPph42Inputs,
  ppnInputs: initialPpnInputs,
  unifikasiInputs: initialUnifikasiInputs,
  pph22Result: null,
  pph23Result: null,
  pph42Result: null,
  ppnResult: null,
  unifikasiResult: null,
  error: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  updatePph22Input: (key, value) => {
    set((state) => ({
      pph22Inputs: { ...state.pph22Inputs, [key]: value },
      pph22Result: null,
      error: null,
    }));
  },

  updatePph23Input: (key, value) => {
    set((state) => ({
      pph23Inputs: { ...state.pph23Inputs, [key]: value },
      pph23Result: null,
      error: null,
    }));
  },

  updatePph42Input: (key, value) => {
    set((state) => ({
      pph42Inputs: { ...state.pph42Inputs, [key]: value },
      pph42Result: null,
      error: null,
    }));
  },

  updatePpnInput: (key, value) => {
    set((state) => ({
      ppnInputs: { ...state.ppnInputs, [key]: value },
      ppnResult: null,
      error: null,
    }));
  },

  updateUnifikasiInput: (key, value) => {
    set((state) => ({
      unifikasiInputs: { ...state.unifikasiInputs, [key]: value },
      unifikasiResult: null,
      error: null,
    }));
  },

  calculatePph22: () => {
    const { pph22Inputs } = get();
    try {
      const result = calculatePph22(pph22Inputs);
      set({ pph22Result: result, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Terjadi kesalahan perhitungan' });
    }
  },

  calculatePph23: () => {
    const { pph23Inputs } = get();
    try {
      const result = calculatePph23(pph23Inputs);
      set({ pph23Result: result, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Terjadi kesalahan perhitungan' });
    }
  },

  calculatePph42: () => {
    const { pph42Inputs } = get();
    try {
      const result = calculatePph42(pph42Inputs);
      set({ pph42Result: result, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Terjadi kesalahan perhitungan' });
    }
  },

  calculatePpn: () => {
    const { ppnInputs } = get();
    try {
      const result = calculatePpn(ppnInputs);
      set({ ppnResult: result, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Terjadi kesalahan perhitungan' });
    }
  },

  calculateUnifikasi: () => {
    const { unifikasiInputs } = get();
    try {
      const result = calculatePphUnifikasi(unifikasiInputs);
      set({ unifikasiResult: result, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Terjadi kesalahan perhitungan' });
    }
  },

  resetPph22: () => {
    set({
      pph22Inputs: initialPph22Inputs,
      pph22Result: null,
      error: null,
    });
  },

  resetPph23: () => {
    set({
      pph23Inputs: initialPph23Inputs,
      pph23Result: null,
      error: null,
    });
  },

  resetPph42: () => {
    set({
      pph42Inputs: initialPph42Inputs,
      pph42Result: null,
      error: null,
    });
  },

  resetPpn: () => {
    set({
      ppnInputs: initialPpnInputs,
      ppnResult: null,
      error: null,
    });
  },

  resetUnifikasi: () => {
    set({
      unifikasiInputs: initialUnifikasiInputs,
      unifikasiResult: null,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));