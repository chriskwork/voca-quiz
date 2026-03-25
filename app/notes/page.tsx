"use client";

import { useEffect, useState } from "react";
import { getWrongNotes, WrongNote } from "@/lib/db";
import { useRouter } from "next/navigation";

export default function NotePage() {
  const [notes, setNotes] = useState<WrongNote[]>([]);
  const router = useRouter();
  // Filter tema
  const [selectedTema, setSelectedTema] = useState<string | null>(null);

  useEffect(() => {
    // getWrongNotes data
    async function load() {
      const data = await getWrongNotes();
      setNotes(data);
    }
    load();
  }, []);

  // 테마
  const temas = [...new Set(notes.map((n) => n.tema))];
  // 필터된 목록 계산
  const filtered = selectedTema ? notes.filter((n) => n.tema === selectedTema) : notes;

  const chipStyleDefault = "shrink-0 bg-tema-brown px-4 py-2 rounded-4xl text-white";
  const chipStyleSelected = "shrink-0 bg-tema-blue px-4 py-2 rounded-4xl text-white";

  return (
    <div className="px-4 py-6">
      {/* 테마 필터 chip */}
      <div className="flex items-center gap-4 mb-6 overflow-x-auto scrollbar-hide text-sm">
        <button
          onClick={() => setSelectedTema(null)}
          className={selectedTema === null ? chipStyleSelected : chipStyleDefault}
        >
          전체
        </button>
        {temas.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTema(t)}
            className={selectedTema === t ? chipStyleSelected : chipStyleDefault}
          >
            {t}
          </button>
        ))}
      </div>

      <ul>
        {filtered.map((note) => (
          <li key={note.id} className="mb-2">
            <div className="flex justify-between text-md">
              <div>
                <span>{note.spanish}</span>
                <span className="ml-2 text-tema-brown">{note.korean}</span>
              </div>
              <p className="text-tema-brown-muted text-sm">{`(${note.tema})`}</p>
            </div>
          </li>
        ))}
      </ul>

      {notes.length > 0 ? (
        <button
          onClick={() => router.replace(`/quiz/notes`)}
          className="right-6 bottom-6 fixed bg-linear-to-br from-tema-brown to-tema-orange px-6 py-2 rounded-4xl text-white text-sm"
        >
          퀴즈 시작
        </button>
      ) : (
        <h1>오답 목록이 비어있습니다.</h1>
      )}
    </div>
  );
}
