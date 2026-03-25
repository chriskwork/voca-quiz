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

// Voca 풀에서 count 숫자만큼 문제를 냄
// 한번 낸 문제는 다시 나오지 않고 남은 문제에서만 나옴
// 답변 선택 옵션은 해당 테마 전체에서 계속 나옴
// (남은 문제가 몇 개 없을 때 고를 수 있는 답변이 한정적, 4개 미만일때 에러 방지)
// Picks `count` questions from the voca pool
// Questions already asked won't appear again — only remaining ones are used
// Answer choices always come from the full tema pool
// (When few questions remain, available choices are limited — guards against fewer than 4 options)
function pickRandom(pool: Voca[], count: number, exclude: Voca[]): Voca[] {
  const excludeIds = new Set(exclude.map((v) => v.id)); // Set for using has()
  const available = pool.filter((v) => !excludeIds.has(v.id));
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function makeChoices(answer: Voca, pool: Voca[]): Voca[] {
  const others = pool.filter((v) => v.id !== answer.id);
  const wrong3 = others.sort(() => Math.random() - 0.5).slice(0, 3);
  return [...wrong3, answer].sort(() => Math.random() - 0.5);
}

// 컴포넌트
// Component
export default function TemaQuiz() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [allVocas, setAllVocas] = useState<Voca[]>([]);
  const [questions, setQuestions] = useState<Voca[]>([]);
  const [current, setCurrent] = useState(0);
  const [wrong, setWrong] = useState<Voca[]>([]);
  const [finished, setFinished] = useState(false);
  // 선택한 보기의 id
  // ID of the selected answer option
  const [selected, setSelected] = useState<number | null>(null);

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

  // 퀴즈 끝났을 때
  // When the quiz is finished
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
              // Reset everything and start from the beginning
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
    if (selected !== null) return;
    // 이미 선택했으면 무시
    // Ignore if already selected

    setSelected(picked.id);

    const isCorrect = picked.id === answer.id;
    if (!isCorrect) setWrong((prev) => [...prev, answer]);

    // 1초 후 다음 문제로
    // Move to the next question after 1 second
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
      {/* Progress indicator */}
      <p className="mb-6 text-gray-400 text-sm">
        {current + 1} / {questions.length}
      </p>

      {/* 문제 */}
      {/* Question */}
      <h2 className="mb-10 font-bold text-2xl text-center">{answer.spanish}</h2>

      {/* 보기 4개 */}
      {/* 4 answer choices */}
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
      {/* Number of wrong answers */}
      <p className="mt-20 text-xs">
        틀린답: {wrong.length} / 10
        <br />
        틀린답은 오답노트에 저장됩니다.
      </p>
    </div>
  );
}
