"use client";

import { useEffect, useState } from "react";
import { getWrongNotes, WrongNote } from "@/lib/db";
import { useRouter } from "next/navigation";

export default function NotePage() {
  const [notes, setNotes] = useState<WrongNote[]>([]);
  const router = useRouter();

  useEffect(() => {
    // getWrongNotes data
    async function load() {
      const data = await getWrongNotes();
      setNotes(data);
    }
    load();
  }, []);

  return (
    <div className="px-4 py-6">
      <ul>
        {notes.map((note) => (
          <li key={note.id} className="mb-1">
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

      <button
        onClick={() => router.replace(`/quiz/notes`)}
        className="right-6 bottom-6 fixed bg-linear-to-br from-tema-brown to-tema-orange px-6 py-2 rounded-4xl text-white text-sm"
      >
        퀴즈 시작
      </button>
    </div>
  );
}
