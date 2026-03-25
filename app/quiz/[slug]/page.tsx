"use client";

import { useParams, useRouter } from "next/navigation";
import { saveWrongNotes } from "@/lib/db";
import { useEffect, useMemo, useState } from "react";

type Voca = {
  id: number;
  spanish: string;
  korean: string;
  tema: string;
};

function pickRandom(pool: Voca[], count: number, exclude: Voca[]): Voca[] {
  const excludeIds = new Set(exclude.map((v) => v.id)); // set이 배열보다 검색 빠름
  const available = pool.filter((v) => !excludeIds.has(v.id));
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function makeChoices(answer: Voca, pool: Voca[]): Voca[] {
  const others = pool.filter((v) => v.id !== answer.id);
  const wrong3 = others.sort(() => Math.random() - 0.5).slice(0, 3);
  return [...wrong3, answer].sort(() => Math.random() - 0.5);
}

export default function TemaQuiz() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [allVocas, setAllVocas] = useState<Voca[]>([]);
  const [questions, setQuestions] = useState<Voca[]>([]);
  const [current, setCurrent] = useState(0);
  const [wrong, setWrong] = useState<Voca[]>([]);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState<number | null>(null); // 선택한 보기의 id

  useEffect(() => {
    fetch(`/json-files/tema-${slug}.json`)
      .then((res) => res.json())
      .then((data: Voca[]) => {
        setAllVocas(data);
        setQuestions(pickRandom(data, 10, []));
      })
      .catch((e) => console.error("fetch 실패:", e));
  }, [slug]);

  const choices = useMemo(
    () => (questions[current] ? makeChoices(questions[current], allVocas) : []),
    [current, questions, allVocas],
  );

  if (questions.length === 0) return <div className="pt-20 text-sm text-center">로딩 중...</div>;

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
              // 전체 초기화 후 처음부터
              setQuestions(pickRandom(allVocas, 10, []));
              setCurrent(0);
              setWrong([]);
              setFinished(false);
              return;
            }
            setQuestions((prev) => [...prev, ...next]);
            setCurrent((prev) => prev + 1);
            setFinished(false);
          }}
        >
          10개 더 풀기
        </button>
        <button className="py-3 border rounded-xl w-full" onClick={() => router.replace(`/voca/${slug}`)}>
          그만하기
        </button>
        <button onClick={() => router.replace("/notes")} className="py-3 border rounded-xl w-full">
          오답노트 보기
        </button>
      </div>
    );

  const answer = questions[current];

  function handleSelect(picked: Voca) {
    if (selected !== null) return; // 이미 선택했으면 무시

    setSelected(picked.id);

    const isCorrect = picked.id === answer.id;
    if (!isCorrect) setWrong((prev) => [...prev, answer]);

    // 1초 후 다음 문제로
    setTimeout(() => {
      setSelected(null);
      if (current + 1 >= questions.length) {
        setFinished(true);
        saveWrongNotes(wrong);
      } else {
        setCurrent((prev) => prev + 1);
      }
    }, 1000);
  }

  return (
    <div className="px-4 py-6">
      {/* 진행표시 */}
      <p className="mb-6 text-gray-400 text-sm">
        {current + 1} / {questions.length}
      </p>

      {/* 문제 */}
      <h2 className="mb-10 font-bold text-2xl text-center">{answer.spanish}</h2>

      {/* 보기 4개 */}
      <ul className="flex flex-col gap-6">
        {choices.map((v) => {
          const isSelected = selected === v.id;
          const isAnswer = v.id === answer.id;
          const showResult = selected !== null;

          let style = "py-3 border rounded-xl w-full text-center";
          if (showResult && isAnswer) style += " bg-green-200 border-green-400";
          else if (showResult && isSelected) style += " bg-red-200 border-red-400";

          return (
            <li key={v.id}>
              <button className={style} onClick={() => handleSelect(v)}>
                {v.korean}
              </button>
            </li>
          );
        })}
      </ul>

      {/* 틀린 답 갯수 */}
      <p className="mt-20 text-xs">
        틀린답: {wrong.length} / 10
        <br />
        틀린답은 오답노트에 저장됩니다.
      </p>

      {/* 그만하기, 계속하기 버튼 */}
    </div>
  );
}
