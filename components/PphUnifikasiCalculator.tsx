'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Calculator, RotateCcw, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { usePphUnifikasiStore } from '../lib/store/pph-unifikasi-store';
import { formatNumber } from '../lib/pph-unifikasi-utils';
import * as XLSX from 'xlsx';

export default function PphUnifikasiCalculator() {
  const {
    activeTab,
    pph22Inputs,
    pph23Inputs,
    pph42Inputs,
    ppnInputs,
    unifikasiInputs,
    pph22Result,
    pph23Result,
    pph42Result,
    ppnResult,
    unifikasiResult,
    error,
    setActiveTab,
    updatePph22Input,
    updatePph23Input,
    updatePph42Input,
    updatePpnInput,
    updateUnifikasiInput,
    calculatePph22,
    calculatePph23,
    calculatePph42,
    calculatePpn,
    calculateUnifikasi,
    resetPph22,
    resetPph23,
    resetPph42,
    resetPpn,
    resetUnifikasi,
    clearError,
  } = usePphUnifikasiStore();

  const [showImport, setShowImport] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value as any);
    clearError();
  };

  const handleCalculate = () => {
    switch (activeTab) {
      case 'pph22':
        calculatePph22();
        break;
      case 'pph23':
        calculatePph23();
        break;
      case 'pph42':
        calculatePph42();
        break;
      case 'ppn':
        calculatePpn();
        break;
      case 'unifikasi':
        calculateUnifikasi();
        break;
    }
  };

  const handleReset = () => {
    switch (activeTab) {
      case 'pph22':
        resetPph22();
        break;
      case 'pph23':
        resetPph23();
        break;
      case 'pph42':
        resetPph42();
        break;
      case 'ppn':
        resetPpn();
        break;
      case 'unifikasi':
        resetUnifikasi();
        break;
    }
  };

  const exportToExcel = () => {
    let data: any[] = [];
    let filename = '';

    switch (activeTab) {
      case 'pph22':
        if (pph22Result) {
          data = [{
            'Jenis Barang': pph22Result.jenisBarang,
            'Nilai Transaksi': pph22Result.nilaiTransaksi,
            'Tarif PPh 22': `${pph22Result.tarif}%`,
            'PPh 22 Terutang': pph22Result.pph22Terutang,
          }];
          filename = 'hasil_pph22.xlsx';
        }
        break;
      case 'pph23':
        if (pph23Result) {
          data = [{
            'Jenis Penghasilan': pph23Result.jenisPenghasilan,
            'Nilai Penghasilan': pph23Result.nilaiPenghasilan,
            'Tarif PPh 23': `${pph23Result.tarif}%`,
            'NPWP': pph23Result.npwp ? 'Ya' : 'Tidak',
            'PPh 23 Terutang': pph23Result.pph23Terutang,
          }];
          filename = 'hasil_pph23.xlsx';
        }
        break;
      case 'pph42':
        if (pph42Result) {
          data = [{
            'Jenis Penghasilan': pph42Result.jenisPenghasilan,
            'Nilai Penghasilan': pph42Result.nilaiPenghasilan,
            'Tarif PPh 4(2)': `${pph42Result.tarif}%`,
            'PPh 4(2) Terutang': pph42Result.pph42Terutang,
          }];
          filename = 'hasil_pph42.xlsx';
        }
        break;
      case 'ppn':
        if (ppnResult) {
          data = [{
            'Jenis Transaksi': ppnResult.jenisTransaksi,
            'Nilai Transaksi': ppnResult.nilaiTransaksi,
            'DPP': ppnResult.dpp,
            'Tarif PPN': `${ppnResult.tarif}%`,
            'PPN Terutang': ppnResult.ppnTerutang,
          }];
          filename = 'hasil_ppn.xlsx';
        }
        break;
      case 'unifikasi':
        if (unifikasiResult) {
          data = [{
            'Jenis Usaha': unifikasiResult.jenisUsaha,
            'Penghasilan Bruto': unifikasiResult.penghasilanBruto,
            'Pengurangan': unifikasiResult.pengurangan,
            'Penghasilan Netto': unifikasiResult.penghasilanNetto,
            'Tarif': `${unifikasiResult.tarif}%`,
            'PPh Unifikasi Terutang': unifikasiResult.pphUnifikasiTerutang,
            'Status Kelayakan': unifikasiResult.statusKelayakan,
          }];
          filename = 'hasil_pph_unifikasi.xlsx';
        }
        break;
    }

    if (data.length > 0) {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Hasil Perhitungan');
      XLSX.writeFile(wb, filename);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Kalkulator PPh Unifikasi</h1>
        <p className="text-lg text-gray-600">PPh 22, 23, 4(2), PPN & Sistem Unifikasi</p>
      </motion.div>

      <Card className="shadow-lg">
        <CardHeader>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="pph22" className="text-xs font-semibold">
                PPh 22
              </TabsTrigger>
              <TabsTrigger value="pph23" className="text-xs font-semibold">
                PPh 23
              </TabsTrigger>
              <TabsTrigger value="pph42" className="text-xs font-semibold">
                PPh 4(2)
              </TabsTrigger>
              <TabsTrigger value="ppn" className="text-xs font-semibold">
                PPN
              </TabsTrigger>
              <TabsTrigger value="unifikasi" className="text-xs font-semibold">
                Unifikasi
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            {/* PPh 22 Tab */}
            {activeTab === 'pph22' && (
              <motion.div
                key="pph22"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Data Transaksi PPh 22</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="jenis-barang">Jenis Barang</Label>
                        <Select
                          value={pph22Inputs.jenisBarang}
                          onValueChange={(value) => updatePph22Input('jenisBarang', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="impor">Barang Impor</SelectItem>
                            <SelectItem value="mewah">Barang Mewah</SelectItem>
                            <SelectItem value="non_mewah">Barang Non Mewah</SelectItem>
                            <SelectItem value="pertambangan">Hasil Pertambangan</SelectItem>
                            <SelectItem value="kehutanan">Hasil Kehutanan</SelectItem>
                            <SelectItem value="perikanan">Hasil Perikanan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="nilai-transaksi">Nilai Transaksi (Rp)</Label>
                        <Input
                          id="nilai-transaksi"
                          type="number"
                          value={pph22Inputs.nilaiTransaksi || ''}
                          onChange={(e) => updatePph22Input('nilaiTransaksi', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tarif-pph22">Tarif PPh 22 (%)</Label>
                        <Input
                          id="tarif-pph22"
                          type="number"
                          value={pph22Inputs.tarifPph22 || ''}
                          onChange={(e) => updatePph22Input('tarifPph22', parseFloat(e.target.value) || 0)}
                          placeholder="2.5"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button onClick={handleReset} variant="outline" className="flex-1">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button onClick={handleCalculate} className="flex-1">
                      <Calculator className="w-4 h-4 mr-2" />
                      Hitung
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Hasil Perhitungan PPh 22</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {pph22Result ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="flex justify-between py-2 border-b">
                            <span>Jenis Barang</span>
                            <span className="font-semibold">{pph22Result.jenisBarang}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>Nilai Transaksi</span>
                            <span className="font-semibold">Rp {formatNumber(pph22Result.nilaiTransaksi)}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>Tarif PPh 22</span>
                            <span className="font-semibold">{pph22Result.tarif}%</span>
                          </div>
                          <div className="flex justify-between py-2 pt-4 border-t-2 border-red-300 text-lg font-bold">
                            <span>PPh 22 Terutang</span>
                            <span className="text-red-600">Rp {formatNumber(pph22Result.pph22Terutang)}</span>
                          </div>
                        </motion.div>
                      ) : (
                        <p className="text-center text-gray-500">Hasil perhitungan akan muncul di sini.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ekspor Hasil</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={exportToExcel}
                        disabled={!pph22Result}
                        className="w-full"
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Ekspor ke Excel
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* PPh 23 Tab */}
            {activeTab === 'pph23' && (
              <motion.div
                key="pph23"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Data Penghasilan PPh 23</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="jenis-penghasilan">Jenis Penghasilan</Label>
                        <Select
                          value={pph23Inputs.jenisPenghasilan}
                          onValueChange={(value) => updatePph23Input('jenisPenghasilan', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dividen">Dividen</SelectItem>
                            <SelectItem value="bunga">Bunga</SelectItem>
                            <SelectItem value="royalti">Royalti</SelectItem>
                            <SelectItem value="sewa">Sewa</SelectItem>
                            <SelectItem value="hadiah">Hadiah</SelectItem>
                            <SelectItem value="penghasilan_lain">Penghasilan Lain</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="nilai-penghasilan">Nilai Penghasilan (Rp)</Label>
                        <Input
                          id="nilai-penghasilan"
                          type="number"
                          value={pph23Inputs.nilaiPenghasilan || ''}
                          onChange={(e) => updatePph23Input('nilaiPenghasilan', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tarif-pph23">Tarif PPh 23 (%)</Label>
                        <Input
                          id="tarif-pph23"
                          type="number"
                          value={pph23Inputs.tarifPph23 || ''}
                          onChange={(e) => updatePph23Input('tarifPph23', parseFloat(e.target.value) || 0)}
                          placeholder="15"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="npwp"
                          checked={pph23Inputs.npwp}
                          onChange={(e) => updatePph23Input('npwp', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="npwp">Memiliki NPWP</Label>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button onClick={handleReset} variant="outline" className="flex-1">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button onClick={handleCalculate} className="flex-1">
                      <Calculator className="w-4 h-4 mr-2" />
                      Hitung
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Hasil Perhitungan PPh 23</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {pph23Result ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="flex justify-between py-2 border-b">
                            <span>Jenis Penghasilan</span>
                            <span className="font-semibold">{pph23Result.jenisPenghasilan}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>Nilai Penghasilan</span>
                            <span className="font-semibold">Rp {formatNumber(pph23Result.nilaiPenghasilan)}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>Tarif PPh 23</span>
                            <span className="font-semibold">{pph23Result.tarif}%</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>NPWP</span>
                            <span className="font-semibold">{pph23Result.npwp ? 'Ya' : 'Tidak'}</span>
                          </div>
                          <div className="flex justify-between py-2 pt-4 border-t-2 border-red-300 text-lg font-bold">
                            <span>PPh 23 Terutang</span>
                            <span className="text-red-600">Rp {formatNumber(pph23Result.pph23Terutang)}</span>
                          </div>
                        </motion.div>
                      ) : (
                        <p className="text-center text-gray-500">Hasil perhitungan akan muncul di sini.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ekspor Hasil</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={exportToExcel}
                        disabled={!pph23Result}
                        className="w-full"
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Ekspor ke Excel
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* PPh 4(2) Tab */}
            {activeTab === 'pph42' && (
              <motion.div
                key="pph42"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Data Penghasilan PPh 4(2)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="jenis-penghasilan-42">Jenis Penghasilan</Label>
                        <Select
                          value={pph42Inputs.jenisPenghasilan}
                          onValueChange={(value) => updatePph42Input('jenisPenghasilan', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bunga">Bunga</SelectItem>
                            <SelectItem value="hadiah">Hadiah</SelectItem>
                            <SelectItem value="undian">Undian</SelectItem>
                            <SelectItem value="transaksi_saham">Transaksi Saham</SelectItem>
                            <SelectItem value="penjualan_saham">Penjualan Saham</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="nilai-penghasilan-42">Nilai Penghasilan (Rp)</Label>
                        <Input
                          id="nilai-penghasilan-42"
                          type="number"
                          value={pph42Inputs.nilaiPenghasilan || ''}
                          onChange={(e) => updatePph42Input('nilaiPenghasilan', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tarif-pph42">Tarif PPh 4(2) (%)</Label>
                        <Input
                          id="tarif-pph42"
                          type="number"
                          value={pph42Inputs.tarifPph42 || ''}
                          onChange={(e) => updatePph42Input('tarifPph42', parseFloat(e.target.value) || 0)}
                          placeholder="10"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button onClick={handleReset} variant="outline" className="flex-1">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button onClick={handleCalculate} className="flex-1">
                      <Calculator className="w-4 h-4 mr-2" />
                      Hitung
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Hasil Perhitungan PPh 4(2)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {pph42Result ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="flex justify-between py-2 border-b">
                            <span>Jenis Penghasilan</span>
                            <span className="font-semibold">{pph42Result.jenisPenghasilan}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>Nilai Penghasilan</span>
                            <span className="font-semibold">Rp {formatNumber(pph42Result.nilaiPenghasilan)}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>Tarif PPh 4(2)</span>
                            <span className="font-semibold">{pph42Result.tarif}%</span>
                          </div>
                          <div className="flex justify-between py-2 pt-4 border-t-2 border-red-300 text-lg font-bold">
                            <span>PPh 4(2) Terutang</span>
                            <span className="text-red-600">Rp {formatNumber(pph42Result.pph42Terutang)}</span>
                          </div>
                        </motion.div>
                      ) : (
                        <p className="text-center text-gray-500">Hasil perhitungan akan muncul di sini.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ekspor Hasil</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={exportToExcel}
                        disabled={!pph42Result}
                        className="w-full"
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Ekspor ke Excel
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* PPN Tab */}
            {activeTab === 'ppn' && (
              <motion.div
                key="ppn"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Data Transaksi PPN</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="jenis-transaksi">Jenis Transaksi</Label>
                        <Select
                          value={ppnInputs.jenisTransaksi}
                          onValueChange={(value) => updatePpnInput('jenisTransaksi', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="penjualan">Penjualan Barang/Jasa</SelectItem>
                            <SelectItem value="impor">Impor Barang</SelectItem>
                            <SelectItem value="pemanfaatan">Pemanfaatan BKP Tidak Berwujud</SelectItem>
                            <SelectItem value="pemanfaatan_jkp">Pemanfaatan JKP dari Luar Daerah Pabean</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="nilai-transaksi-ppn">Nilai Transaksi (Rp)</Label>
                        <Input
                          id="nilai-transaksi-ppn"
                          type="number"
                          value={ppnInputs.nilaiTransaksi || ''}
                          onChange={(e) => updatePpnInput('nilaiTransaksi', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tarif-ppn">Tarif PPN (%)</Label>
                        <Input
                          id="tarif-ppn"
                          type="number"
                          value={ppnInputs.tarifPpn || ''}
                          onChange={(e) => updatePpnInput('tarifPpn', parseFloat(e.target.value) || 0)}
                          placeholder="11"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button onClick={handleReset} variant="outline" className="flex-1">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button onClick={handleCalculate} className="flex-1">
                      <Calculator className="w-4 h-4 mr-2" />
                      Hitung
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Hasil Perhitungan PPN</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {ppnResult ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="flex justify-between py-2 border-b">
                            <span>Jenis Transaksi</span>
                            <span className="font-semibold">{ppnResult.jenisTransaksi}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>Nilai Transaksi</span>
                            <span className="font-semibold">Rp {formatNumber(ppnResult.nilaiTransaksi)}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>DPP</span>
                            <span className="font-semibold">Rp {formatNumber(ppnResult.dpp)}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>Tarif PPN</span>
                            <span className="font-semibold">{ppnResult.tarif}%</span>
                          </div>
                          <div className="flex justify-between py-2 pt-4 border-t-2 border-blue-300 text-lg font-bold">
                            <span>PPN Terutang</span>
                            <span className="text-blue-600">Rp {formatNumber(ppnResult.ppnTerutang)}</span>
                          </div>
                        </motion.div>
                      ) : (
                        <p className="text-center text-gray-500">Hasil perhitungan akan muncul di sini.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ekspor Hasil</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={exportToExcel}
                        disabled={!ppnResult}
                        className="w-full"
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Ekspor ke Excel
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* PPh Unifikasi Tab */}
            {activeTab === 'unifikasi' && (
              <motion.div
                key="unifikasi"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Data Penghasilan PPh Unifikasi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="jenis-usaha">Jenis Usaha</Label>
                        <Select
                          value={unifikasiInputs.jenisUsaha}
                          onValueChange={(value) => updateUnifikasiInput('jenisUsaha', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="umkm">UMKM (Penghasilan ≤ 500 juta/tahun)</SelectItem>
                            <SelectItem value="non_umkm">Non-UMKM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="penghasilan-bruto">Penghasilan Bruto (Rp)</Label>
                        <Input
                          id="penghasilan-bruto"
                          type="number"
                          value={unifikasiInputs.penghasilanBruto || ''}
                          onChange={(e) => updateUnifikasiInput('penghasilanBruto', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pengurangan">Pengurangan (Rp)</Label>
                        <Input
                          id="pengurangan"
                          type="number"
                          value={unifikasiInputs.pengurangan || ''}
                          onChange={(e) => updateUnifikasiInput('pengurangan', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button onClick={handleReset} variant="outline" className="flex-1">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button onClick={handleCalculate} className="flex-1">
                      <Calculator className="w-4 h-4 mr-2" />
                      Hitung
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Hasil Perhitungan PPh Unifikasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {unifikasiResult ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="flex justify-between py-2 border-b">
                            <span>Jenis Usaha</span>
                            <span className="font-semibold">{unifikasiResult.jenisUsaha === 'umkm' ? 'UMKM' : 'Non-UMKM'}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>Penghasilan Bruto</span>
                            <span className="font-semibold">Rp {formatNumber(unifikasiResult.penghasilanBruto)}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>Pengurangan</span>
                            <span className="font-semibold">- Rp {formatNumber(unifikasiResult.pengurangan)}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>Penghasilan Netto</span>
                            <span className="font-semibold">Rp {formatNumber(unifikasiResult.penghasilanNetto)}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>Tarif</span>
                            <span className="font-semibold">{unifikasiResult.tarif}%</span>
                          </div>
                          <div className="flex justify-between py-2 pt-4 border-t-2 border-green-300 text-lg font-bold">
                            <span>PPh Unifikasi Terutang</span>
                            <span className="text-green-600">Rp {formatNumber(unifikasiResult.pphUnifikasiTerutang)}</span>
                          </div>
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                              <span className="font-semibold text-blue-800">Status Kelayakan</span>
                            </div>
                            <p className="text-sm text-blue-700 mt-1">{unifikasiResult.statusKelayakan}</p>
                          </div>
                        </motion.div>
                      ) : (
                        <p className="text-center text-gray-500">Hasil perhitungan akan muncul di sini.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ekspor Hasil</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={exportToExcel}
                        disabled={!unifikasiResult}
                        className="w-full"
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Ekspor ke Excel
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}