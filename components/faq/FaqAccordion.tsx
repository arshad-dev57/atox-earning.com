"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/faq-data";

/**
 * Client-side accordion for the FAQ page. The FAQ content itself is passed in
 * from the server component so the questions and answers are present in the
 * server-rendered HTML (search engines see them without JavaScript).
 */
export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={faq.question}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <h3>
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
              className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition"
            >
              <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  openIndex === index ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          </h3>
          <div className={openIndex === index ? "px-6 pb-5 pt-0" : "hidden"}>
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}