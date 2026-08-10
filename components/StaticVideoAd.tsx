"use client";

import { useEffect, useRef, useState } from "react";
import { AD_WATCH_SECONDS, STATIC_AD_VIDEO_SRC } from "@/lib/ads";

type Props = {
  slotKey: number | string;
  onCompleted: () => void;
};

/**
 * Temporary static MP4 + forced watch timer.
 * Switch to Adsterra VAST later with NEXT_PUBLIC_AD_VIDEO_MODE=vast
 */
export default function StaticVideoAd({ slotKey, onCompleted }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onCompletedRef = useRef(onCompleted);
  const [left, setLeft] = useState(AD_WATCH_SECONDS);
  onCompletedRef.current = onCompleted;

  useEffect(() => {
    let cancelled = false;
    setLeft(AD_WATCH_SECONDS);

    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {
        /* muted autoplay should work */
      });
    }

    const timer = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    const unlock = setTimeout(() => {
      if (cancelled) return;
      clearInterval(timer);
      try {
        videoRef.current?.pause();
      } catch {
        /* ignore */
      }
      onCompletedRef.current();
    }, AD_WATCH_SECONDS * 1000);

    return () => {
      cancelled = true;
      clearInterval(timer);
      clearTimeout(unlock);
      try {
        videoRef.current?.pause();
      } catch {
        /* ignore */
      }
    };
  }, [slotKey]);

  return (
    <div className="absolute inset-0 bg-black">
      <video
        ref={videoRef}
        key={String(slotKey)}
        className="w-full h-full object-contain"
        src={STATIC_AD_VIDEO_SRC}
        playsInline
        muted
        autoPlay
        loop
        controls={false}
      />
      {/* Block seeking / skipping */}
      <div className="absolute inset-0 cursor-not-allowed" />
      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full z-10 flex items-center gap-1.5">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-white text-sm font-bold">{left}s</span>
      </div>
    </div>
  );
}
