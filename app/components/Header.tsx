"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex justify-between items-center bg-card px-4 h-14">
      {/* left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl text-brown"
        >
          <Menu size={22} />
        </button>
        <Link href="/">
          <span className="font-bold text-brown text-lg">🇪🇸 단어 퀴즈</span>
        </Link>
      </div>

      {/* right: search */}
      <button className="p-2 rounded-xl text-brown">
        <Search size={22} />
      </button>

      {/* Drawer menu */}
    </header>
  );
}
