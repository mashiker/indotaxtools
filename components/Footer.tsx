import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">IndoTax Tools</h3>
            <p className="text-sm text-muted-foreground">
              Alat bantu pajak modern untuk Wajib Pajak Indonesia.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Alat</h4>
            <div className="space-y-2 text-sm">
              <Link href="/kalkulator-pph-21" className="block text-muted-foreground hover:text-foreground">
                Kalkulator PPh 21
              </Link>
              <Link href="/kalkulator-pph-unifikasi" className="block text-muted-foreground hover:text-foreground">
                Kalkulator PPh Unifikasi
              </Link>
              <Link href="/xml-generator" className="block text-muted-foreground hover:text-foreground">
                XML Generator
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Informasi</h4>
            <div className="space-y-2 text-sm">
              <Link href="/blog" className="block text-muted-foreground hover:text-foreground">
                Blog
              </Link>
              <Link href="/about" className="block text-muted-foreground hover:text-foreground">
                Tentang Kami
              </Link>
              <Link href="/kebijakan-privasi" className="block text-muted-foreground hover:text-foreground">
                Kebijakan Privasi
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Kontak</h4>
            <p className="text-sm text-muted-foreground">
              Dukung proyek ini dengan donasi.
            </p>
            <Link href="/donasi" className="inline-flex items-center text-sm text-primary hover:underline">
              Donate Sekarang →
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © 2025 IndoTax Tools. Semua data diproses di perangkat Anda.
          </p>
        </div>
      </div>
    </footer>
  );
}