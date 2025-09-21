export interface Pph22Result {
  nilaiTransaksi: number;
  tarif: number;
  pph22Terutang: number;
  jenisBarang: string;
}

export interface Pph23Result {
  nilaiPenghasilan: number;
  tarif: number;
  pph23Terutang: number;
  jenisPenghasilan: string;
  npwp: boolean;
}

export interface Pph42Result {
  nilaiPenghasilan: number;
  tarif: number;
  pph42Terutang: number;
  jenisPenghasilan: string;
}

export interface PpnResult {
  nilaiTransaksi: number;
  tarif: number;
  ppnTerutang: number;
  dpp: number;
  jenisTransaksi: string;
}

export interface PphUnifikasiResult {
  penghasilanBruto: number;
  pengurangan: number;
  penghasilanNetto: number;
  tarif: number;
  pphUnifikasiTerutang: number;
  jenisUsaha: string;
  statusKelayakan: string;
}

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

// Tarif PPh 22 berdasarkan jenis barang
export const pph22TarifOptions = {
  'impor': 2.5,
  'mewah': 10,
  'non_mewah': 1.5,
  'pertambangan': 1.5,
  'kehutanan': 1.5,
  'perikanan': 1.5,
};

// Tarif PPh 23 berdasarkan jenis penghasilan
export const pph23TarifOptions = {
  'dividen': 15,
  'bunga': 15,
  'royalti': 15,
  'sewa': 10,
  'hadiah': 25,
  'penghasilan_lain': 15,
};

// Tarif PPh 4(2) berdasarkan jenis penghasilan
export const pph42TarifOptions = {
  'bunga': 10,
  'hadiah': 25,
  'undian': 25,
  'transaksi_saham': 0.1,
  'penjualan_saham': 0.1,
};

// Tarif PPN
export const ppnTarifOptions = {
  'umum': 11,
  'fasilitas': 0,
};

// Fungsi perhitungan PPh 22
export function calculatePph22(inputs: Pph22Inputs): Pph22Result {
  const { jenisBarang, nilaiTransaksi, tarifPph22 } = inputs;

  if (nilaiTransaksi < 0) {
    throw new Error('Nilai transaksi tidak boleh negatif');
  }

  const tarif = tarifPph22 / 100;
  const pph22Terutang = Math.round(nilaiTransaksi * tarif);

  return {
    nilaiTransaksi,
    tarif: tarifPph22,
    pph22Terutang,
    jenisBarang,
  };
}

// Fungsi perhitungan PPh 23
export function calculatePph23(inputs: Pph23Inputs): Pph23Result {
  const { jenisPenghasilan, nilaiPenghasilan, tarifPph23, npwp } = inputs;

  if (nilaiPenghasilan < 0) {
    throw new Error('Nilai penghasilan tidak boleh negatif');
  }

  const tarif = tarifPph23 / 100;
  let pph23Terutang = Math.round(nilaiPenghasilan * tarif);

  // Jika tidak memiliki NPWP, tarif dikenakan 100% lebih tinggi
  if (!npwp) {
    pph23Terutang = Math.round(pph23Terutang * 2);
  }

  return {
    nilaiPenghasilan,
    tarif: tarifPph23,
    pph23Terutang,
    jenisPenghasilan,
    npwp,
  };
}

// Fungsi perhitungan PPh 4(2)
export function calculatePph42(inputs: Pph42Inputs): Pph42Result {
  const { jenisPenghasilan, nilaiPenghasilan, tarifPph42 } = inputs;

  if (nilaiPenghasilan < 0) {
    throw new Error('Nilai penghasilan tidak boleh negatif');
  }

  const tarif = tarifPph42 / 100;
  const pph42Terutang = Math.round(nilaiPenghasilan * tarif);

  return {
    nilaiPenghasilan,
    tarif: tarifPph42,
    pph42Terutang,
    jenisPenghasilan,
  };
}

// Fungsi perhitungan PPN
export function calculatePpn(inputs: PpnInputs): PpnResult {
  const { nilaiTransaksi, tarifPpn, jenisTransaksi } = inputs;

  if (nilaiTransaksi < 0) {
    throw new Error('Nilai transaksi tidak boleh negatif');
  }

  const tarif = tarifPpn / 100;
  const dpp = Math.round(nilaiTransaksi / (1 + tarif));
  const ppnTerutang = Math.round(dpp * tarif);

  return {
    nilaiTransaksi,
    tarif: tarifPpn,
    ppnTerutang,
    dpp,
    jenisTransaksi,
  };
}

// Fungsi perhitungan PPh Unifikasi
export function calculatePphUnifikasi(inputs: PphUnifikasiInputs): PphUnifikasiResult {
  const { penghasilanBruto, pengurangan, jenisUsaha } = inputs;

  if (penghasilanBruto < 0) {
    throw new Error('Penghasilan bruto tidak boleh negatif');
  }

  if (pengurangan < 0) {
    throw new Error('Pengurangan tidak boleh negatif');
  }

  const penghasilanNetto = penghasilanBruto - pengurangan;

  let tarif = 0;
  let statusKelayakan = '';

  if (jenisUsaha === 'umkm') {
    // PPh Unifikasi untuk UMKM: 0.5% flat untuk penghasilan sampai 500 juta per tahun
    if (penghasilanNetto <= 500000000) {
      tarif = 0.5;
      statusKelayakan = 'Layak PPh Unifikasi (UMKM)';
    } else {
      tarif = 0; // Melebihi batas, tidak menggunakan tarif unifikasi
      statusKelayakan = 'Tidak layak PPh Unifikasi (penghasilan > 500 juta)';
    }
  } else {
    // Untuk non-UMKM, menggunakan tarif progresif normal
    statusKelayakan = 'Non-UMKM - Gunakan tarif progresif PPh 17';
    tarif = 0; // Akan dihitung terpisah jika diperlukan
  }

  const pphUnifikasiTerutang = Math.round(penghasilanNetto * (tarif / 100));

  return {
    penghasilanBruto,
    pengurangan,
    penghasilanNetto,
    tarif,
    pphUnifikasiTerutang,
    jenisUsaha,
    statusKelayakan,
  };
}

// Fungsi format number
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(Math.round(num));
}