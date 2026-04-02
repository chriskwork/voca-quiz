"use client";

import { useRouter } from "next/navigation";
import { saveWrongNotes } from "@/lib/db";
import { useEffect, useMemo, useState } from "react";

type Voca = {
  id: number;
  spanish: string;
  korean: string;
  tema: string;
};

const TEMAS = [
  "animal",
  "ave",
  "bathroom",
  "bebida",
  "carne",
  "ciencia",
  "cocina",
  "color",
  "cuerpo",
  "deporte",
  "desastre",
  "economia",
  "edificio",
  "elemento",
  "enfermedad",
  "espacio",
  "familia",
  "fruta",
  "hospital",
  "insecto",
  "instrumento",
  "medicamiento",
  "ordenador",
  "pais",
  "parque",
  "pelicula",
  "playa",
  "tienda",
  "time",
  "trabajo",
  "verdura",
  "viaje",
  "vida-marina",
  "weather",
];

function pickRandom(pool: Voca[], count: number, exclude: Voca[]): Voca[] {
  const excludeIds = new Set(exclude.map((v) => v.id));
  const available = pool.filter((v) => !excludeIds.has(v.id));
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function makeChoices(answer: Voca, pool: Voca[]): Voca[] {
  const sameTema = pool.filter((v) => v.tema === answer.tema);
  const others = sameTema.filter((v) => v.id !== answer.id);
  const wrong3 = others.sort(() => Math.random() - 0.5).slice(0, 3);
  return [...wrong3, answer].sort(() => Math.random() - 0.5);
}

export default function RandomQuiz() {
  const router = useRouter();
  const [allVocas, setAllVocas] = useState<Voca[]>([]);
  const [questions, setQuestions] = useState<Voca[]>([]);
  const [current, setCurrent] = useState(0);
  const [wrong, setWrong] = useState<Voca[]>([]);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    Promise.all(TEMAS.map((t) => fetch(`/json-files/es-ko/tema-${t}.json`).then((r) => r.json())))
      .then((results) => {
        const all: Voca[] = results.flat();
        setAllVocas(all);
        setQuestions(pickRandom(all, 10, []));
      })
      .catch((e) => console.error("fetch 실패:", e));
  }, []);

  const choices = useMemo(
    () => (questions[current] ? makeChoices(questions[current], allVocas) : []),
    [current, questions, allVocas],
  );

  const answer = questions[current];

  function handleSelect(picked: Voca) {
    if (selected !== null) return;

    setSelected(picked.id);

    const isCorrect = picked.id === answer.id;
    if (!isCorrect) setWrong((prev) => [...prev, answer]);

    setTimeout(() => {
      setSelected(null);
      if (current + 1 >= questions.length) {
        setFinished(true);
        setStarted(false);
        saveWrongNotes(wrong);
      } else {
        setCurrent((prev) => prev + 1);
      }
    }, 1000);
  }

  // Screen - loading
  if (questions.length === 0) return <div className="pt-20 text-sm text-center">로딩 중...</div>;

  // Screen - start quiz
  if (started)
    return (
      <div className="px-4 py-6">
        <p className="mb-6 text-gray-400 text-sm">
          {current + 1} / {questions.length}
        </p>

        <h2 className="mb-10 font-bold text-2xl text-center">{answer.spanish}</h2>

        <ul className="flex flex-col gap-6">
          {choices.map((v) => {
            const isSelected = selected === v.id;
            const isAnswer = v.id === answer.id;
            const showResult = selected !== null;

            let style = "py-3 border rounded-xl w-full text-center";
            if (showResult && isAnswer) style += " bg-green-200 border-green-400";
            else if (showResult && isSelected) style += " bg-red-200 border-red-400";

            return (
              <li key={`${v.tema}-${v.id}`}>
                <button className={style} onClick={() => handleSelect(v)}>
                  {v.korean}
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-20 text-xs">
          틀린답: {wrong.length} / 10
          <br />
          틀린답은 오답노트에 저장됩니다.
        </p>
      </div>
    );

  // Screen - end quiz
  if (finished)
    return (
      <div className="flex flex-col items-center gap-6 px-4 py-20">
        <p className="font-bold text-lg">결과</p>
        <p className="text-gray-500 text-sm">
          맞은 개수: {questions.length - wrong.length} / {questions.length}
        </p>
        <button
          className="py-3 border rounded-xl w-full"
          onClick={() => {
            const next = pickRandom(allVocas, 10, questions);
            if (next.length === 0) {
              setQuestions(pickRandom(allVocas, 10, []));
              setCurrent(0);
              setWrong([]);
              setFinished(false);
              setStarted(true);
              return;
            }
            setQuestions((prev) => [...prev, ...next]);
            setCurrent((prev) => prev + 1);
            setFinished(false);
            setStarted(true);
          }}
        >
          10개 더 풀기
        </button>
        <button className="py-3 border rounded-xl w-full" onClick={() => router.replace("/")}>
          그만하기
        </button>
        <button onClick={() => router.replace("/notes")} className="py-3 border rounded-xl w-full">
          오답노트 보기
        </button>
      </div>
    );

  // Screen - main screen
  return (
    <div className="mx-auto px-4 py-6">
      <h2 className="mb-4 font-semibold text-md text-tema-brown text-center">랜덤퀴즈</h2>

      <button
        onClick={() => {
          setStarted(true);
        }}
        className="bg-linear-to-br from-tema-brown to-tema-orange px-6 py-3 rounded-4xl text-md text-white"
      >
        퀴즈 시작
      </button>
    </div>
  );
}
