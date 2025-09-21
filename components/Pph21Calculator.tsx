'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Calculator, RotateCcw, FileSpreadsheet } from 'lucide-react';
import { usePph21Store } from '../lib/store/pph21-store';
import { ptkpOptions, formatNumber, getPtkpTahunan } from '../lib/pph21-utils';
import * as XLSX from 'xlsx';

export default function Pph21Calculator() {
  const {
    activeTab,
    bulananInputs,
    tahunanInputs,
    bulananResult,
    tahunanResult,
    error,
    setActiveTab,
    updateBulananInput,
    updateTahunanInput,
    calculateBulanan,
    calculateTahunan,
    resetBulanan,
    resetTahunan,
    clearError,
  } = usePph21Store();

  const [showImport, setShowImport] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'bulanan' | 'tahunan');
    clearError();
  };

  const handleBulananInputChange = (key: string, value: any) => {
    updateBulananInput(key as keyof typeof bulananInputs, value);
  };

  const handleTahunanInputChange = (key: string, value: any) => {
    updateTahunanInput(key as keyof typeof tahunanInputs, value);
  };

  const handleCalculate = () => {
    if (activeTab === 'bulanan') {
      calculateBulanan();
    } else {
      calculateTahunan();
    }
  };

  const handleReset = () => {
    if (activeTab === 'bulanan') {
      resetBulanan();
    } else {
      resetTahunan();
    }
  };

  const exportToExcel = () => {
    if (activeTab === 'bulanan' && bulananResult) {
      const data = [{
        'Penghasilan Bruto': bulananResult.penghasilanBruto,
        'Status PTKP': bulananInputs.ptkpStatus,
        'Kategori': bulananResult.category,
        'Tarif Efektif (TER)': `${(bulananResult.terRate * 100).toFixed(4)}%`,
        'PPh 21 Terutang': bulananResult.pph21Terutang,
      }];
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Hasil PPh 21 Bulanan');
      XLSX.writeFile(wb, 'hasil_pph21_bulanan.xlsx');
    } else if (activeTab === 'tahunan' && tahunanResult) {
      const data = [{
        'Bruto Setahun': tahunanResult.brutoSetahun,
        'Netto Setahun': tahunanResult.nettoSetahun,
        'PKP Setahun': tahunanResult.pkpSetahun,
        'PPh Terutang Setahun': tahunanResult.pphTerutangSetahun,
        'PPh Masa Terakhir': Math.abs(tahunanResult.pph21MasaTerakhir),
        'Status': tahunanResult.statusPotong,
      }];
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Hasil PPh 21 Tahunan');
      XLSX.writeFile(wb, 'hasil_pph21_tahunan.xlsx');
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Kalkulator PPh 21</h1>
        <p className="text-lg text-gray-600">Sesuai PP-58/2023 & PMK-168/2023</p>
      </motion.div>

      <Card className="shadow-lg">
        <CardHeader>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bulanan" className="text-sm font-semibold">
                Bulanan (TER)
              </TabsTrigger>
              <TabsTrigger value="tahunan" className="text-sm font-semibold">
                Masa Pajak Terakhir
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'bulanan' && (
              <motion.div
                key="bulanan"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Left Column: Inputs */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Data Personal</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="status-pegawai">Status Pegawai</Label>
                        <Select
                          value={bulananInputs.statusPegawai}
                          onValueChange={(value) => handleBulananInputChange('statusPegawai', value)}
                        >
                          <SelectTrigger aria-label="Pilih status pegawai">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pegawai Tetap">Pegawai Tetap</SelectItem>
                            <SelectItem value="Pensiunan">Pensiunan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="ptkp-status">Status Kawin & Tanggungan</Label>
                        <Select
                          value={bulananInputs.ptkpStatus}
                          onValueChange={(value) => handleBulananInputChange('ptkpStatus', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ptkpOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.text}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Metode Tunjangan Pajak</Label>
                        <RadioGroup
                          value={bulananInputs.taxMethod}
                          onValueChange={(value: string) => handleBulananInputChange('taxMethod', value)}
                          className="flex gap-4 mt-2"
                          role="radiogroup"
                          aria-label="Pilih metode tunjangan pajak"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="gross" id="gross" aria-describedby="gross-label" />
                            <Label htmlFor="gross" id="gross-label">Gross</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="gross-up" id="gross-up" aria-describedby="gross-up-label" />
                            <Label htmlFor="gross-up" id="gross-up-label">Gross-up</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">A. Penghasilan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="gaji">Gaji/Pensiun atau THT/JHT</Label>
                          <Input
                            id="gaji"
                            type="number"
                            value={bulananInputs.gaji || ''}
                            onChange={(e) => handleBulananInputChange('gaji', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            aria-describedby="gaji-help"
                            min="0"
                            step="0.01"
                          />
                          <span id="gaji-help" className="sr-only">Masukkan jumlah gaji atau pensiun dalam rupiah</span>
                        </div>
                        <div>
                          <Label htmlFor="tunjangan-pph">Tunjangan PPh</Label>
                          <Input
                            id="tunjangan-pph"
                            type="number"
                            value={bulananInputs.tunjanganPph || ''}
                            onChange={(e) => handleBulananInputChange('tunjanganPph', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            disabled={bulananInputs.taxMethod === 'gross-up'}
                          />
                        </div>
                        <div>
                          <Label htmlFor="tunjangan-lain">Tunjangan Lainnya, Lembur, dsb.</Label>
                          <Input
                            id="tunjangan-lain"
                            type="number"
                            value={bulananInputs.tunjanganLain || ''}
                            onChange={(e) => handleBulananInputChange('tunjanganLain', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="honorarium">Honorarium & Imbalan Lain</Label>
                          <Input
                            id="honorarium"
                            type="number"
                            value={bulananInputs.honorarium || ''}
                            onChange={(e) => handleBulananInputChange('honorarium', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="premi-asuransi">Premi Asuransi (oleh Pemberi Kerja)</Label>
                          <Input
                            id="premi-asuransi"
                            type="number"
                            value={bulananInputs.premiAsuransi || ''}
                            onChange={(e) => handleBulananInputChange('premiAsuransi', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="natura">Natura & Kenikmatan Lainnya</Label>
                          <Input
                            id="natura"
                            type="number"
                            value={bulananInputs.natura || ''}
                            onChange={(e) => handleBulananInputChange('natura', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="bonus">Tantiem, Bonus, Gratifikasi, THR</Label>
                          <Input
                            id="bonus"
                            type="number"
                            value={bulananInputs.bonus || ''}
                            onChange={(e) => handleBulananInputChange('bonus', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Penghasilan Bruto</Label>
                          <Input
                            value={formatNumber(
                              bulananInputs.gaji + bulananInputs.tunjanganPph + bulananInputs.tunjanganLain +
                              bulananInputs.honorarium + bulananInputs.premiAsuransi + bulananInputs.natura + bulananInputs.bonus
                            )}
                            disabled
                            className="bg-gray-100 font-bold"
                          />
                        </div>
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

                {/* Right Column: Results */}
                <div className="space-y-6">
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="text-lg">B. Penghitungan PPh Pasal 21</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {bulananResult ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="flex justify-between py-2 border-b">
                            <span>Penghasilan Bruto</span>
                            <span className="font-semibold">Rp {formatNumber(bulananResult.penghasilanBruto)}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>Status PTKP / Kategori</span>
                            <span className="font-semibold">{bulananInputs.ptkpStatus} / {bulananResult.category}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>Tarif Efektif (TER)</span>
                            <span className="font-semibold">{(bulananResult.terRate * 100).toFixed(4).replace(/\.?0+$/, '')}%</span>
                          </div>
                          <div className="flex justify-between py-2 pt-4 border-t-2 border-red-300 text-lg font-bold">
                            <span>PPh 21 Terutang Bulan Ini</span>
                            <span className="text-red-600">Rp {formatNumber(bulananResult.pph21Terutang)}</span>
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
                        disabled={!bulananResult}
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

            {activeTab === 'tahunan' && (
              <motion.div
                key="tahunan"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Tahunan inputs - similar structure */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">A. Informasi Pegawai & Metode</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="status-pegawai-tahunan">Status Pegawai</Label>
                        <Select
                          value={tahunanInputs.statusPegawai}
                          onValueChange={(value) => handleTahunanInputChange('statusPegawai', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tetap">Pegawai Tetap</SelectItem>
                            <SelectItem value="pensiunan">Pensiunan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status-kawin-tahunan">Status Perkawinan</Label>
                        <Select
                          value={tahunanInputs.statusKawin}
                          onValueChange={(value) => handleTahunanInputChange('statusKawin', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TK">Tidak Kawin</SelectItem>
                            <SelectItem value="K">Kawin</SelectItem>
                            <SelectItem value="KI">Kawin (Penghasilan Istri Digabung)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tanggungan-tahunan">Jumlah Tanggungan</Label>
                        <Input
                          id="tanggungan-tahunan"
                          type="number"
                          min="0"
                          max="3"
                          value={tahunanInputs.tanggungan}
                          onChange={(e) => handleTahunanInputChange('tanggungan', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Metode Tunjangan Pajak</Label>
                        <RadioGroup
                          value={tahunanInputs.taxMethod}
                          onValueChange={(value: string) => handleTahunanInputChange('taxMethod', value)}
                          className="flex gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="gross" id="gross-tahunan" />
                            <Label htmlFor="gross-tahunan">Gross</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="gross-up" id="gross-up-tahunan" />
                            <Label htmlFor="gross-up-tahunan">Gross-up</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Penghasilan Bruto Setahun */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">B. Penghasilan Bruto Setahun</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="gaji-tahunan">Gaji/Pensiun Setahun</Label>
                          <Input
                            id="gaji-tahunan"
                            type="number"
                            value={tahunanInputs.gajiTahunan || ''}
                            onChange={(e) => handleTahunanInputChange('gajiTahunan', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tunjangan-pph-tahunan">Tunjangan PPh</Label>
                          <Input
                            id="tunjangan-pph-tahunan"
                            type="number"
                            value={tahunanInputs.tunjanganPphTahunan || ''}
                            onChange={(e) => handleTahunanInputChange('tunjanganPphTahunan', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            disabled={tahunanInputs.taxMethod === 'gross-up'}
                          />
                        </div>
                        {/* Add other income fields similar to bulanan */}
                        <div>
                          <Label htmlFor="tunjangan-lain-tahunan">Tunjangan Lainnya, Uang Lembur, dll.</Label>
                          <Input
                            id="tunjangan-lain-tahunan"
                            type="number"
                            value={tahunanInputs.tunjanganLainTahunan || ''}
                            onChange={(e) => handleTahunanInputChange('tunjanganLainTahunan', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="honorarium-tahunan">Honorarium dan Imbalan Sejenis</Label>
                          <Input
                            id="honorarium-tahunan"
                            type="number"
                            value={tahunanInputs.honorariumTahunan || ''}
                            onChange={(e) => handleTahunanInputChange('honorariumTahunan', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="premi-asuransi-tahunan">Premi Asuransi</Label>
                          <Input
                            id="premi-asuransi-tahunan"
                            type="number"
                            value={tahunanInputs.premiAsuransiTahunan || ''}
                            onChange={(e) => handleTahunanInputChange('premiAsuransiTahunan', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="natura-tahunan">Natura & Kenikmatan</Label>
                          <Input
                            id="natura-tahunan"
                            type="number"
                            value={tahunanInputs.naturaTahunan || ''}
                            onChange={(e) => handleTahunanInputChange('naturaTahunan', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="bonus-tahunan">Bonus, THR, dsb.</Label>
                          <Input
                            id="bonus-tahunan"
                            type="number"
                            value={tahunanInputs.bonusTahunan || ''}
                            onChange={(e) => handleTahunanInputChange('bonusTahunan', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Total Penghasilan Bruto</Label>
                          <Input
                            value={formatNumber(
                              tahunanInputs.gajiTahunan + tahunanInputs.tunjanganPphTahunan + tahunanInputs.tunjanganLainTahunan +
                              tahunanInputs.honorariumTahunan + tahunanInputs.premiAsuransiTahunan + tahunanInputs.naturaTahunan + tahunanInputs.bonusTahunan
                            )}
                            disabled
                            className="bg-gray-100 font-bold"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pengurang */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">C. Pengurang</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="iuran-pensiun-tahunan">Iuran Pensiun / THT / JHT</Label>
                          <Input
                            id="iuran-pensiun-tahunan"
                            type="number"
                            value={tahunanInputs.iuranPensiunTahunan || ''}
                            onChange={(e) => handleTahunanInputChange('iuranPensiunTahunan', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="zakat-tahunan">Zakat/Sumbangan Wajib</Label>
                          <Input
                            id="zakat-tahunan"
                            type="number"
                            value={tahunanInputs.zakatTahunan || ''}
                            onChange={(e) => handleTahunanInputChange('zakatTahunan', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label>Biaya Jabatan/Pensiun</Label>
                          <Input
                            value={formatNumber(Math.min(
                              (tahunanInputs.gajiTahunan + tahunanInputs.tunjanganPphTahunan + tahunanInputs.tunjanganLainTahunan +
                               tahunanInputs.honorariumTahunan + tahunanInputs.premiAsuransiTahunan + tahunanInputs.naturaTahunan + tahunanInputs.bonusTahunan) * 0.05,
                              tahunanInputs.statusPegawai === 'tetap' ? 6000000 : 2400000
                            ))}
                            disabled
                            className="bg-gray-100"
                          />
                        </div>
                        <div>
                          <Label>Jumlah Pengurang</Label>
                          <Input
                            value={formatNumber(
                              Math.min((tahunanInputs.gajiTahunan + tahunanInputs.tunjanganPphTahunan + tahunanInputs.tunjanganLainTahunan +
                                       tahunanInputs.honorariumTahunan + tahunanInputs.premiAsuransiTahunan + tahunanInputs.naturaTahunan + tahunanInputs.bonusTahunan) * 0.05,
                                       tahunanInputs.statusPegawai === 'tetap' ? 6000000 : 2400000) +
                              tahunanInputs.iuranPensiunTahunan + tahunanInputs.zakatTahunan
                            )}
                            disabled
                            className="bg-gray-100 font-bold"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* PPh 21 Telah Dipotong */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">D. PPh 21 Telah Dipotong</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <Label htmlFor="pph21-dipotong-sebelumnya">Total PPh 21 dipotong (Jan - Nov)</Label>
                        <Input
                          id="pph21-dipotong-sebelumnya"
                          type="number"
                          value={tahunanInputs.pph21DipotongSebelumnya || ''}
                          onChange={(e) => handleTahunanInputChange('pph21DipotongSebelumnya', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

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

                {/* Tahunan Results */}
                <div className="space-y-6">
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="text-lg">E. Hasil Perhitungan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {tahunanResult ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div>
                            <h5 className="font-semibold">1. Penghasilan Neto Setahun</h5>
                            <div className="pl-4 space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Penghasilan Bruto Setahun</span>
                                <span>Rp {formatNumber(tahunanResult.brutoSetahun)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total Pengurang</span>
                                <span>- Rp {formatNumber(tahunanResult.totalPengurang)}</span>
                              </div>
                              <div className="flex justify-between font-bold border-t pt-1">
                                <span>Penghasilan Neto Setahun</span>
                                <span>Rp {formatNumber(tahunanResult.nettoSetahun)}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-semibold">2. Penghasilan Kena Pajak (PKP)</h5>
                            <div className="pl-4 space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Penghasilan Neto Setahun</span>
                                <span>Rp {formatNumber(tahunanResult.nettoSetahun)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>PTKP</span>
                                <span>- Rp {formatNumber(getPtkpTahunan(tahunanInputs.statusKawin, tahunanInputs.tanggungan) || 0)}</span>
                              </div>
                              <div className="flex justify-between font-bold border-t pt-1">
                                <span>PKP Setahun (Dibulatkan)</span>
                                <span>Rp {formatNumber(tahunanResult.pkpSetahun)}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-semibold">3. PPh 21 Terutang Setahun (Tarif Psl. 17)</h5>
                            <div className="pl-4">
                              <ul className="space-y-1 text-sm">
                                {tahunanResult.detailPerhitungan.map((detail, index) => (
                                  <li key={index} className="flex justify-between">
                                    <span>{detail.split(' = ')[0]}</span>
                                    <span>= {detail.split(' = ')[1]}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="flex justify-between font-bold border-t pt-1">
                                <span>Total PPh Terutang Setahun</span>
                                <span>Rp {formatNumber(tahunanResult.pphTerutangSetahun)}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-semibold">4. PPh 21 Masa Pajak Terakhir</h5>
                            <div className="pl-4 space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>PPh Terutang Setahun</span>
                                <span>Rp {formatNumber(tahunanResult.pphTerutangSetahun)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Telah Dipotong (Jan-Nov)</span>
                                <span>- Rp {formatNumber(tahunanInputs.pph21DipotongSebelumnya)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="border-t-2 border-red-500 pt-4">
                            <div className="flex justify-between items-center text-lg font-bold">
                              <span>PPh 21 Masa Pajak Terakhir</span>
                              <span className="text-red-600">Rp {formatNumber(Math.abs(tahunanResult.pph21MasaTerakhir))}</span>
                            </div>
                            <p className="text-sm text-center font-semibold mt-2 text-gray-700">
                              ({tahunanResult.statusPotong})
                            </p>
                          </div>

                          <div className="text-xs p-2 bg-gray-100 rounded">
                            <strong>Catatan:</strong> Jika Lebih Bayar, pemberi kerja wajib mengembalikan kelebihan potong kepada pegawai. PPh 21 terutang setahun ini menjadi kredit pajak di SPT Tahunan OP.
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
                        disabled={!tahunanResult}
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
    </div>
  );
}