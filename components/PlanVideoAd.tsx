"use client";

import { AD_VIDEO_MODE } from "@/lib/ads";
import AdsterraVideoAd from "@/components/AdsterraVideoAd";
import StaticVideoAd from "@/components/StaticVideoAd";

type Props = {
  slotKey: number | string;
  onCompleted: () => void;
  onError?: (message: string) => void;
};

/** Picks static MP4 (temporary) or Adsterra VAST based on NEXT_PUBLIC_AD_VIDEO_MODE */
export default function PlanVideoAd({ slotKey, onCompleted, onError }: Props) {
  if (AD_VIDEO_MODE === "vast") {
    return (
      <AdsterraVideoAd
        slotKey={slotKey}
        onCompleted={onCompleted}
        onError={onError}
      />
    );
  }

  return <StaticVideoAd slotKey={slotKey} onCompleted={onCompleted} />;
}
