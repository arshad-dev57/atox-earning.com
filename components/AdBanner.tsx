"use client";

import { useEffect, useRef } from "react";

export default function AdBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined" || !containerRef.current) return;

    // Clear previous script elements to avoid duplicate banners on re-renders
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://pl30103964.effectivecpmnetwork.com/1b52814ede6fd3a1a8ab62cb45f7e48d/invoke.js";

    // Adsterra scripts typically look for the container ID in the document
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-semibold">Sponsored Advertisement</p>
      <div 
        ref={containerRef} 
        id="container-1b52814ede6fd3a1a8ab62cb45f7e48d" 
        className="w-full max-w-full flex justify-center min-h-[80px]"
      />
    </div>
  );
}
