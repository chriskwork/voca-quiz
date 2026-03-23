import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
// import BottomNav from "./components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "스페인어 단어 퀴즈",
  description: "스페인어-한국어 단어 퀴즈 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full`}>
      <body className="flex flex-col mx-auto pb-16 max-w-md min-h-full">
        <Header />
        {children}
        {/* <BottomNav /> */}
      </body>
    </html>
  );
}
