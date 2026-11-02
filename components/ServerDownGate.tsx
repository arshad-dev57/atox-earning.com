"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  SERVER_DOWN_FIELD,
  SERVER_DOWN_MESSAGE,
  SERVER_STATUS_COLLECTION,
  SERVER_STATUS_DOC,
  type PlatformSettings,
} from "@/lib/server-status";
import { SITE_NAME } from "@/lib/site";

type GateState =
  | { status: "checking" }
  | { status: "up" }
  | { status: "down"; message: string };

export default function ServerDownGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<GateState>({ status: "checking" });

  useEffect(() => {
    const ref = doc(db, SERVER_STATUS_COLLECTION, SERVER_STATUS_DOC);

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        const data = snap.exists()
          ? (snap.data() as PlatformSettings)
          : undefined;
        const down = data?.[SERVER_DOWN_FIELD] === true;

        if (down) {
          const message =
            (typeof data?.serverDownMessage === "string" &&
              data.serverDownMessage.trim()) ||
            SERVER_DOWN_MESSAGE;
          setState({ status: "down", message });
        } else {
          setState({ status: "up" });
        }
      },
      (error) => {
        // Fail open: if the status doc cannot be read, keep the site usable.
        console.error("Server status listener error:", error);
        setState({ status: "up" });
      }
    );

    return () => unsubscribe();
  }, []);

  if (state.status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40">
        <div className="h-10 w-10 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (state.status === "down") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-6">
        <div className="max-w-md w-full text-center animate-fade-in-up">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 ring-1 ring-red-400/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              className="h-8 w-8 text-red-400"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold tracking-wide text-emerald-400/90 mb-3">
            {SITE_NAME}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Server Down
          </h1>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed">
            {state.message}
          </p>
          <p className="mt-8 text-sm text-slate-500">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
