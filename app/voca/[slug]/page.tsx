"use client";

import { use, useEffect, useState } from "react";

type Voca = {
  id: number;
  spanish: string;
  korean: string;
  synonym: string;
  example_es: string;
  example_ko: string;
  tema: string;
};

export default function TemaVoca({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [vocas, setVocas] = useState<Voca[]>([]);

  useEffect(() => {
    fetch(`/json-files/tema-${slug}.json`)
      .then((res) => res.json())
      .then(setVocas);
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
    </div>
  );
}
