import fs from "fs";
import path from "path";
import Link from "next/link";
import { Shuffle } from "lucide-react";

// Tema data from json files
const TEMA_META: Record<string, { emoji: string; name: string }> = {
  animal: { emoji: "🐾", name: "동물" },
  ave: { emoji: "🐦", name: "새" },
  bathroom: { emoji: "🚿", name: "욕실" },
  bebida: { emoji: "🥤", name: "음료" },
  carne: { emoji: "🥩", name: "고기" },
  ciencia: { emoji: "🔬", name: "과학" },
  cocina: { emoji: "🍳", name: "주방" },
  color: { emoji: "🎨", name: "색깔" },
  cuerpo: { emoji: "🫀", name: "신체" },
  deporte: { emoji: "⚽", name: "스포츠" },
  desastre: { emoji: "🌪️", name: "재난" },
  economia: { emoji: "💰", name: "경제" },
  edificio: { emoji: "🏢", name: "건물" },
  elemento: { emoji: "⚗️", name: "원소" },
  enfermedad: { emoji: "🤒", name: "질병" },
  espacio: { emoji: "🚀", name: "우주" },
  familia: { emoji: "👨‍👩‍👧", name: "가족" },
  fruta: { emoji: "🍎", name: "과일" },
  hospital: { emoji: "🏥", name: "병원" },
  insecto: { emoji: "🐛", name: "곤충" },
  instrumento: { emoji: "🎸", name: "악기" },
  medicamiento: { emoji: "💊", name: "약" },
  ordenador: { emoji: "💻", name: "컴퓨터" },
  pais: { emoji: "🌍", name: "나라" },
  parque: { emoji: "🌳", name: "공원" },
  pelicula: { emoji: "🎬", name: "영화" },
  playa: { emoji: "🏖️", name: "해변" },
  tienda: { emoji: "🏪", name: "가게" },
  time: { emoji: "⏰", name: "시간" },
  trabajo: { emoji: "👔", name: "직업" },
  verdura: { emoji: "🥦", name: "채소" },
  viaje: { emoji: "✈️", name: "여행" },
  "vida-marina": { emoji: "🐠", name: "해양생물" },
  weather: { emoji: "⛅", name: "날씨" },
};

// Load json files
function getTemas() {
  return Object.entries(TEMA_META).map(([tema, meta]) => {
    const filePath = path.join(process.cwd(), "public/json-files/es-ko", `tema-${tema}.json`);
    const words = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return { tema, ...meta, count: words.length };
  });
}

// Main app
export default function Home() {
  const temas = getTemas();
  const totalWords = temas.reduce((sum, t) => sum + t.count, 0);

  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-linear-to-br from-tema-brown to-tema-orange px-5 pt-12 pb-8 rounded-b-3xl text-white">
        <p className="opacity-70 mb-1 text-sm">스페인어 단어/퀴즈</p>
        <h1 className="font-bold text-2xl leading-snug">
          오늘도 한 단어씩,
          <br />
          스페인어를 정복해요
        </h1>
        <p className="mt-2 mb-8 opacity-60 text-sm">
          {temas.length}개 테마 · {totalWords.toLocaleString()}개 단어
        </p>

        <Link
          href={"/quiz/random"}
          className="inline-flex items-center gap-3 bg-tema-cream px-8 py-3 rounded-4xl font-bold text-tema-brown text-sm"
        >
          <Shuffle size={18} />
          랜덤 퀴즈 시작
        </Link>
      </div>

      {/* Tema list */}
      <section className="px-4 pt-6 pb-4">
        <h2 className="mb-4 font-semibold text-tema-brown text-xs uppercase tracking-widest">테마별 단어 공부</h2>
        <div className="gap-3 grid grid-cols-2">
          {/* Contents */}
          {temas.map(({ tema, emoji, name, count }) => (
            <div key={tema} className="flex items-center gap-4 bg-card px-4 py-4 border border-border rounded-2xl">
              {/* Icon */}
              <span className="w-10 text-3xl text-center">{emoji}</span>
              {/* Button part */}
              <div className="flex flex-col flex-1 items-center">
                <span className="font-semibold text-base">{name}</span>
                <span className="mb-2 text-tema-brown-muted text-xs">{count}개 단어</span>
                <Link
                  href={`/voca/${tema}`}
                  className="bg-linear-to-br from-tema-brown to-tema-orange px-4 py-2 rounded-2xl w-full font-semibold text-white text-xs text-center"
                >
                  시작
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
