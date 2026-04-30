"use client";

import { useEffect, useState } from "react";

type Props = {
  /** פאזה 1 — מודפס ואז נמחק */
  phase1: string;
  /** פאזה 2 — מודפס ואז נמחק */
  phase2: string;
  /** פאזה 3 — מודפס ונשאר (חזק) */
  phase3: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseAfterType?: number;
};

type Stage = "type1" | "delete1" | "type2" | "delete2" | "type3" | "done";

/**
 * Typewriter sequence — מקליד שלוש פאזות, שתיים ראשונות מודפסות ונמחקות,
 * השלישית נשארת בולטת.
 */
export function HeroTypewriter({
  phase1,
  phase2,
  phase3,
  typeSpeed = 55,
  deleteSpeed = 25,
  pauseAfterType = 1100,
}: Props) {
  const [stage, setStage] = useState<Stage>("type1");
  const [text, setText] = useState("");

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    function typeIn(target: string, onDone: () => void) {
      let i = 0;
      const tick = () => {
        if (cancelled) return;
        i += 1;
        setText(Array.from(target).slice(0, i).join(""));
        if (i < Array.from(target).length) {
          timeout = setTimeout(tick, typeSpeed);
        } else {
          timeout = setTimeout(onDone, pauseAfterType);
        }
      };
      tick();
    }

    function deleteOut(onDone: () => void) {
      const tick = () => {
        if (cancelled) return;
        setText((cur) => {
          const arr = Array.from(cur);
          if (arr.length === 0) {
            timeout = setTimeout(onDone, 200);
            return "";
          }
          arr.pop();
          timeout = setTimeout(tick, deleteSpeed);
          return arr.join("");
        });
      };
      tick();
    }

    if (stage === "type1") {
      typeIn(phase1, () => setStage("delete1"));
    } else if (stage === "delete1") {
      deleteOut(() => setStage("type2"));
    } else if (stage === "type2") {
      typeIn(phase2, () => setStage("delete2"));
    } else if (stage === "delete2") {
      deleteOut(() => setStage("type3"));
    } else if (stage === "type3") {
      typeIn(phase3, () => setStage("done"));
    }

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const isFinal = stage === "type3" || stage === "done";

  return (
    <span
      className={`inline-block ${isFinal ? "opacity-100" : "opacity-90"}`}
      aria-label={phase3}
    >
      {text}
      <span
        className={`mr-1 inline-block w-[3px] translate-y-1.5 align-middle ${
          stage === "done" ? "animate-pulse opacity-60" : "opacity-100"
        }`}
        style={{ height: "0.85em", background: "currentColor" }}
        aria-hidden="true"
      />
    </span>
  );
}
