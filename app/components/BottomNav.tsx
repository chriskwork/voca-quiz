"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/",
    label: "홈",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#7B4A1E" : "#A0896A"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    href: "/notes",
    label: "오답노트",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#7B4A1E" : "#A0896A"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="13" y2="17" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="right-0 bottom-0 left-0 fixed flex justify-around items-center bg-card mx-auto px-6 border-border border-t max-w-md h-16">
      {links.map(({ href, label, icon }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} className="flex flex-col items-center gap-1">
            {icon(active)}
            <span className={`text-xs font-medium ${active ? "text-brown" : "text-brown-muted"}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
