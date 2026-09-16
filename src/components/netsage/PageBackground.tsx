import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PageBackgroundProps {
  variant: "dashboard" | "audit" | "analysis" | "learning" | "results" | "reports";
}

export function PageBackground({ variant }: PageBackgroundProps) {
  // Respect prefers-reduced-motion
  const [reduceMotion, setReduceMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Shared base network grid pattern (very faint)
  const baseGrid = (
    <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(15,23,42,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_60%,transparent_100%)]"></div>
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#F4F7FB] dark:bg-slate-900 transition-colors duration-500">
      {baseGrid}
      
      {/* ---------------- DASHBOARD ---------------- */}
      {variant === "dashboard" && (
        <>
          {/* Subtle Network Topology Nodes */}
          <div className="absolute inset-0 z-0 opacity-[0.03]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dashboard-nodes" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="50" cy="50" r="2" fill="#1E3A8A" />
                  <path d="M50 0 L50 100 M0 50 L100 50" stroke="#1E3A8A" strokeWidth="0.5" strokeDasharray="2 4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dashboard-nodes)" />
            </svg>
          </div>
          {/* Ambient Gradients */}
          <div className={cn("absolute -top-[20%] -left-[10%] h-[60%] w-[60%] rounded-full bg-blue-500/10 blur-[120px]", !reduceMotion && "animate-float-slow")}></div>
          <div className={cn("absolute top-[40%] -right-[10%] h-[50%] w-[50%] rounded-full bg-orange-400/10 blur-[120px]", !reduceMotion && "animate-float-slower")}></div>
        </>
      )}

      {/* ---------------- AUDIT HUB ---------------- */}
      {variant === "audit" && (
        <>
          {/* Configuration Traces / Document lines */}
          <div className="absolute inset-0 z-0 opacity-[0.03]">
             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="audit-lines" x="0" y="0" width="120" height="40" patternUnits="userSpaceOnUse">
                  <path d="M10 20 h30 M50 20 h60" stroke="#1E3A8A" strokeWidth="1" strokeDasharray="4 2" />
                  <rect x="0" y="18" width="4" height="4" fill="#1E3A8A" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#audit-lines)" />
            </svg>
          </div>
          {/* Subtle scanning gradient */}
          <div className={cn("absolute inset-y-0 left-0 w-full bg-gradient-to-b from-transparent via-blue-500/5 to-transparent", !reduceMotion && "animate-scan-slow")}></div>
          <div className="absolute bottom-0 right-0 h-[70%] w-[60%] rounded-full bg-amber-500/5 blur-[120px]"></div>
        </>
      )}

      {/* ---------------- AI ANALYSIS ---------------- */}
      {variant === "analysis" && (
        <>
          {/* Semantic Clusters */}
          <div className="absolute inset-0 z-0 opacity-[0.04]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="ai-nodes" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1.5" fill="#8B5CF6" />
                  <circle cx="60" cy="40" r="1.5" fill="#8B5CF6" />
                  <circle cx="40" cy="60" r="1.5" fill="#8B5CF6" />
                  <path d="M20 20 L60 40 L40 60 Z" stroke="#8B5CF6" strokeWidth="0.5" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ai-nodes)" />
            </svg>
          </div>
          <div className={cn("absolute top-[10%] right-[20%] h-[40%] w-[40%] rounded-full bg-purple-600/10 blur-[100px]", !reduceMotion && "animate-pulse-slow")}></div>
          <div className={cn("absolute bottom-[10%] left-[10%] h-[50%] w-[40%] rounded-full bg-blue-500/10 blur-[120px]", !reduceMotion && "animate-float-slow")}></div>
        </>
      )}

      {/* ---------------- ADAPTIVE LEARNING ---------------- */}
      {variant === "learning" && (
        <>
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03]">
             <div className={cn("h-[600px] w-[600px] rounded-full border border-orange-500 border-dashed", !reduceMotion && "animate-[spin_40s_linear_infinite]")}></div>
             <div className={cn("absolute h-[400px] w-[400px] rounded-full border border-purple-500", !reduceMotion && "animate-[spin_30s_linear_infinite_reverse]")}></div>
          </div>
          <div className="absolute top-[20%] left-[20%] h-[30%] w-[30%] rounded-full bg-orange-500/10 blur-[100px]"></div>
          <div className="absolute bottom-[20%] right-[20%] h-[30%] w-[30%] rounded-full bg-purple-500/10 blur-[100px]"></div>
        </>
      )}

      {/* ---------------- RESULTS ---------------- */}
      {variant === "results" && (
        <>
          <div className="absolute inset-0 z-0 opacity-[0.02]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="results-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 40 L40 0" stroke="#0F172A" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#results-grid)" />
            </svg>
          </div>
          {/* Very faint, calm gradients - strict adherence to minimal color for results */}
          <div className="absolute top-0 right-0 h-[40%] w-[50%] rounded-full bg-slate-300/20 blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 h-[40%] w-[50%] rounded-full bg-slate-300/10 blur-[100px]"></div>
        </>
      )}

      {/* ---------------- REPORTS ---------------- */}
      {variant === "reports" && (
        <>
          {/* Formal document layout hints */}
          <div className="absolute inset-0 z-0 opacity-[0.03]">
            <div className="absolute left-12 top-0 h-full w-px bg-slate-900"></div>
            <div className="absolute left-[calc(100%-3rem)] top-0 h-full w-px bg-slate-900"></div>
          </div>
          <div className="absolute top-[10%] right-[10%] h-[80%] w-[30%] rounded-full bg-blue-100/50 blur-[120px]"></div>
        </>
      )}

    </div>
  );
}
