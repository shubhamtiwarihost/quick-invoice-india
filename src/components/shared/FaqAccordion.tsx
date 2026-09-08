"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string | React.ReactNode;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const answerId = `faq-answer-${idx}`;
        const buttonId = `faq-question-${idx}`;

        return (
          <div
            key={item.question}
            className={`rounded-2xl border transition-colors ${
              isOpen
                ? "border-teal-300 bg-teal-50/30"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => toggle(idx)}
              className="flex w-full items-center justify-between gap-4 p-4 text-left font-semibold text-slate-900 transition focus:outline-hidden"
            >
              <span className="text-sm md:text-base leading-snug">
                {item.question}
              </span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform duration-200 ${
                  isOpen ? "rotate-180 bg-teal-100 text-teal-800" : ""
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>

            {isOpen && (
              <div
                id={answerId}
                role="region"
                aria-labelledby={buttonId}
                className="border-t border-slate-100 px-4 pb-4 pt-3 text-xs md:text-sm leading-relaxed text-slate-600"
              >
                {typeof item.answer === "string" ? (
                  <p>{item.answer}</p>
                ) : (
                  item.answer
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
