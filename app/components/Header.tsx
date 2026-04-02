"use client";

import { Menu, Search, Home, Shuffle, BookOpen, Settings, Info } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="flex justify-between items-center bg-card px-2 h-14">
      {/* left */}
      <div className="flex items-center gap-3">
        <button onClick={() => setIsOpen(true)} className="p-2 rounded-xl text-tema-brown cursor-pointer">
          <Menu size={22} />
        </button>
        <Link href="/">
          <span className="font-bold text-tema-brown text-lg">🇪🇸🇰🇷 Quiz</span>
        </Link>
      </div>

      {/* right: search */}
      <button className="p-2 rounded-xl text-tema-brown">
        <Search size={22} />
      </button>

      {/* Drawer menu */}

      {isOpen && <div className="z-40 fixed inset-0 bg-black/30" onClick={() => setIsOpen(false)} />}

      {/* Menu panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-card z-50
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col gap-1 p-6">
          {/* 섹션 라벨 없는 메뉴 */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold ${pathname === "/" ? "bg-tema-cream text-tema-brown" : "text-tema-brown"}`}
          >
            <Home size={18} />홈
          </Link>

          {/* Quiz 섹션 */}
          <p className="px-4 pt-4 pb-1 font-bold text-[10px] text-tema-brown-muted uppercase tracking-widest">Quiz</p>
          <Link
            href="/quiz/random"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold ${pathname === "/quiz/random" ? "bg-tema-cream text-tema-brown" : "text-tema-brown"}`}
          >
            <Shuffle size={18} />
            랜덤퀴즈
          </Link>
          <Link
            href="/notes"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold ${pathname === "/notes" ? "bg-tema-cream text-tema-brown" : "text-tema-brown"}`}
          >
            <BookOpen size={18} />
            오답노트
          </Link>

          {/* General 섹션 */}
          {/* <p className="px-4 pt-4 pb-1 font-bold text-[10px] text-tema-brown-muted uppercase tracking-widest">
            General
          </p> */}
          {/* <Link
            href="/search"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold ${pathname === "/search" ? "bg-tema-cream text-tema-brown" : "text-tema-brown"}`}
          >
            <Search size={18} />
            검색
          </Link> */}
          {/* <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold ${pathname === "/settings" ? "bg-tema-cream text-tema-brown" : "text-tema-brown"}`}
          >
            <Settings size={18} />
            설정
          </Link>

          <Link
            href="/info"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold ${pathname === "/info" ? "bg-tema-cream text-tema-brown" : "text-tema-brown"}`}
          >
            <Info size={18} />앱 소개
          </Link> */}
        </div>
      </div>
    </header>
  );
}
