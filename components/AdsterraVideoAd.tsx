"use client";

import { useEffect, useRef, useId } from "react";
import { ADSTERRA_VAST_URL, AD_WATCH_SECONDS } from "@/lib/ads";

declare global {
  interface Window {
    fluidPlayer?: (
      id: string,
      options: Record<string, unknown>
    ) => {
      destroy?: () => void;
      pause?: () => void;
    };
  }
}

type Props = {
  /** Remount key so each ad slot starts a fresh VAST request */
  slotKey: number | string;
  onCompleted: () => void;
  onError?: (message: string) => void;
};

/**
 * Plays a real Adsterra VAST video ad (Fluid Player + Adsterra watch.xml tag).
 * Claim should unlock only after the ad finishes (not if skipped).
 */
export default function AdsterraVideoAd({ slotKey, onCompleted, onError }: Props) {
  const reactId = useId().replace(/:/g, "");
  const videoDomId = `adsterra-vast-${reactId}-${slotKey}`;
  const playerRef = useRef<{ destroy?: () => void; pause?: () => void } | null>(null);
  const doneRef = useRef(false);
  const onCompletedRef = useRef(onCompleted);
  const onErrorRef = useRef(onError);
  onCompletedRef.current = onCompleted;
  onErrorRef.current = onError;

  useEffect(() => {
    let cancelled = false;
    let safetyTimer: ReturnType<typeof setTimeout> | undefined;
    doneRef.current = false;

    const markDone = () => {
      if (cancelled || doneRef.current) return;
      doneRef.current = true;
      try {
        playerRef.current?.pause?.();
      } catch {
        /* ignore */
      }
      onCompletedRef.current();
    };

    const fail = (message: string) => {
      if (cancelled || doneRef.current) return;
      onErrorRef.current?.(message);
    };

    const loadFluidPlayer = () =>
      new Promise<void>((resolve, reject) => {
        if (typeof window.fluidPlayer === "function") {
          resolve();
          return;
        }
        const existing = document.querySelector<HTMLScriptElement>(
          'script[data-fluid-player="true"]'
        );
        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(new Error("script")), {
            once: true,
          });
          return;
        }
        const script = document.createElement("script");
        script.src = "https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js";
        script.async = true;
        script.dataset.fluidPlayer = "true";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Fluid Player"));
        document.body.appendChild(script);
      });

    const start = async () => {
      if (!ADSTERRA_VAST_URL) {
        fail(
          "Adsterra VAST not configured. Add NEXT_PUBLIC_ADSTERRA_VAST_KEY or NEXT_PUBLIC_ADSTERRA_VAST_URL in .env.local"
        );
        return;
      }

      try {
        await loadFluidPlayer();
        if (cancelled || typeof window.fluidPlayer !== "function") return;

        // Wait a tick so the <video> node is in the DOM
        await new Promise((r) => requestAnimationFrame(() => r(null)));

        playerRef.current = window.fluidPlayer(videoDomId, {
          layoutControls: {
            primaryColor: "#10b981",
            autoPlay: true,
            mute: true,
            allowTheatre: false,
            allowDownload: false,
            playbackRateEnabled: false,
            playButtonShowing: true,
            fillToContainer: true,
            controlBar: {
              autoHide: true,
              autoHideTimeout: 3,
            },
          },
          vastOptions: {
            adList: [
              {
                roll: "preRoll",
                vastTag: ADSTERRA_VAST_URL,
                adText: "Advertisement",
              },
            ],
            adCTAText: "Visit",
            vastAdvanced: {
              vastVideoEndedCallback: () => markDone(),
              noVastVideoCallback: () =>
                fail("No Adsterra video available right now. Try again in a moment."),
              vastVideoSkippedCallback: () =>
                fail("Please watch the full video ad to earn. Skipped ads do not count."),
            },
          },
        });

        // Safety net if VAST end callback never fires after a long play
        safetyTimer = setTimeout(() => {
          if (!doneRef.current) {
            markDone();
          }
        }, Math.max(AD_WATCH_SECONDS, 45) * 1000);
      } catch {
        fail("Could not start Adsterra video ad. Please try again.");
      }
    };

    start();

    return () => {
      cancelled = true;
      if (safetyTimer) clearTimeout(safetyTimer);
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, [slotKey, videoDomId]);

  if (!ADSTERRA_VAST_URL) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-6 text-center bg-black">
        <div>
          <p className="text-white font-semibold mb-2">Adsterra video ad not set up</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            In Adsterra: <strong className="text-gray-300">Websites → Add Code → Video / VAST</strong>
            , copy the <code className="text-emerald-400">watch.xml?key=...</code> URL, then put the
            key in <code className="text-emerald-400">.env.local</code> as{" "}
            <code className="text-emerald-400">NEXT_PUBLIC_ADSTERRA_VAST_KEY</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black [&_.fluid_video_wrapper]:!w-full [&_.fluid_video_wrapper]:!h-full">
      {/* Short content source required by Fluid Player; real monetized ad is the VAST pre-roll */}
      <video
        id={videoDomId}
        className="w-full h-full object-contain"
        playsInline
        preload="auto"
        muted
      >
        <source src="/ad-content.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
