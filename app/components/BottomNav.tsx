"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shuffle, BookOpen } from "lucide-react";

// active ? "#7B4A1E" : "#A0896A"

const links = [
  {
    href: "/",
    label: "홈",
    icon: (active: boolean) => <Home size={22} color={active ? "#7B4A1E" : "#A0896A"} />,
  },
  {
    href: "/quiz/random",
    label: "랜덤퀴즈",
    icon: (active: boolean) => <Shuffle size={22} color={active ? "#7B4A1E" : "#A0896A"} />,
  },
  {
    href: "/notes",
    label: "오답노트",
    icon: (active: boolean) => <BookOpen size={22} color={active ? "#7B4A1E" : "#A0896A"} />,
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
            <span className={`text-xs font-medium ${active ? "text-brown" : "text-brown-muted"}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
