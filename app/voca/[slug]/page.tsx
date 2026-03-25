"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type Voca = {
  id: number;
  spanish: string;
  korean: string;
  synonym: string;
  example_es: string;
  example_ko: string;
  tema: string;
};

export default function TemaVoca() {
  const { slug } = useParams() as { slug: string };
  const [vocas, setVocas] = useState<Voca[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`/json-files/tema-${slug}.json`)
      .then((res) => res.json())
      .then(setVocas)
      .catch((e) => console.error("fetch 실패:", e));
  }, [slug]);

  return !slug ? (
    <div className="pt-20 text-tema-brown text-sm text-center">로딩 중입니다...</div>
  ) : (
    // Voca list (main content)
    <div className="px-4 py-6">
      <ul>
        {vocas.map((v) => (
          <li key={v.id} className="mb-4">
            <div className="text-lg">
              <span>{v.spanish}</span>
              <span className="ml-2 text-tema-brown">{v.korean}</span>
            </div>
            <p className="text-gray-600 text-sm">{v.example_es}</p>
            <p className="text-gray-600 text-sm">{v.example_ko}</p>
          </li>
        ))}
      </ul>

      <button
        onClick={() => router.replace(`/quiz/${slug}`)}
        className="right-6 bottom-6 fixed bg-linear-to-br from-tema-brown to-tema-orange px-6 py-2 rounded-4xl text-white text-sm"
      >
        퀴즈 시작
      </button>
    </div>
  );
}
