"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Calculator } from "lucide-react";

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Calculator className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">IndoTax Tools</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Beranda
            </Link>
            <Link href="/alat-pajak" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Alat Pajak
            </Link>
            <Link href="/blog" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Blog
            </Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Tentang
            </Link>
          </nav>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleDark}>
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}