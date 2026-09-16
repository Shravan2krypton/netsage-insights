import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-provider";

interface PageBackgroundProps {
  variant: "dashboard" | "audit" | "analysis" | "learning" | "results" | "reports";
}

export function PageBackground({ variant }: PageBackgroundProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const { actualTheme } = useTheme();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const isDark = actualTheme === "dark";

  const baseGrid = (
    <div
      className="absolute inset-0 z-0 bg-[linear-gradient(rgba(56,189,248,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_60%,transparent_100%)]"
      style={{ opacity: isDark ? 1 : 0.5 }}
    ></div>
  );

  const sharedBlobs = (
    <>
      <div
        className={cn(
          "absolute -top-[15%] -left-[10%] h-[60%] w-[60%] rounded-full blur-[140px]",
          !reduceMotion && "animate-float-slow",
        )}
        style={{
          background: `radial-gradient(circle, rgba(56,189,248,${isDark ? 0.3 : 0.12}) 0%, rgba(56,189,248,${isDark ? 0.12 : 0.05}) 45%, transparent 75%)`,
        }}
      />
      <div
        className={cn(
          "absolute -bottom-[12%] -right-[8%] h-[58%] w-[58%] rounded-full blur-[140px]",
          !reduceMotion && "animate-float-slower",
        )}
        style={{
          background: `radial-gradient(circle, rgba(251,146,60,${isDark ? 0.28 : 0.1}) 0%, rgba(251,146,60,${isDark ? 0.1 : 0.04}) 45%, transparent 75%)`,
        }}
      />
    </>
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-colors duration-500"
      style={{
        background: isDark
          ? `
            radial-gradient(ellipse 65% 55% at 12% 15%, rgba(56, 189, 248, 0.28) 0%, transparent 80%),
            radial-gradient(ellipse 65% 55% at 88% 85%, rgba(251, 146, 60, 0.25) 0%, transparent 80%),
            radial-gradient(ellipse 45% 45% at 85% 15%, rgba(56, 189, 248, 0.16) 0%, transparent 70%),
            radial-gradient(ellipse 45% 45% at 15% 85%, rgba(251, 146, 60, 0.18) 0%, transparent 70%),
            linear-gradient(145deg, #07192c 0%, #0a2542 45%, #181d28 75%, #2a1508 100%)
          `
          : `
            radial-gradient(ellipse 65% 55% at 12% 15%, rgba(56, 189, 248, 0.08) 0%, transparent 80%),
            radial-gradient(ellipse 65% 55% at 88% 85%, rgba(251, 146, 60, 0.06) 0%, transparent 80%),
            radial-gradient(ellipse 45% 45% at 85% 15%, rgba(56, 189, 248, 0.05) 0%, transparent 70%),
            radial-gradient(ellipse 45% 45% at 15% 85%, rgba(251, 146, 60, 0.04) 0%, transparent 70%),
            linear-gradient(145deg, #F5F7FA 0%, #EEF2F6 45%, #E8F4FB 75%, #F0F4F8 100%)
          `,
      }}
    >
      {baseGrid}
      {sharedBlobs}

      {variant === "dashboard" && (
        <>
          <div
            className="absolute inset-0 z-0 opacity-[0.04]"
            style={{ opacity: isDark ? 0.04 : 0.02 }}
          >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="dash-net"
                  x="0"
                  y="0"
                  width="80"
                  height="80"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="40" cy="40" r="1.5" fill="#38BDF8" />
                  <path
                    d="M40 0 L40 80 M0 40 L80 40"
                    stroke="#38BDF8"
                    strokeWidth="0.4"
                    strokeDasharray="3 5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dash-net)" />
            </svg>
          </div>
          <div
            className={cn(
              "absolute top-[30%] right-[25%] h-[35%] w-[35%] rounded-full blur-[120px]",
              !reduceMotion && "animate-pulse-slow",
            )}
            style={{
              background: `radial-gradient(circle, rgba(251,146,60,${isDark ? 0.14 : 0.06}) 0%, transparent 70%)`,
            }}
          />
        </>
      )}

      {variant === "audit" && (
        <>
          <div
            className="absolute inset-0 z-0 opacity-[0.04]"
            style={{ opacity: isDark ? 0.04 : 0.02 }}
          >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="audit-lines"
                  x="0"
                  y="0"
                  width="120"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M10 20 h30 M50 20 h60"
                    stroke="#38BDF8"
                    strokeWidth="0.8"
                    strokeDasharray="4 2"
                  />
                  <rect x="0" y="18" width="4" height="4" fill="#FB923C" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#audit-lines)" />
            </svg>
          </div>
          <div
            className={cn(
              "absolute inset-y-0 left-0 w-full bg-gradient-to-b from-transparent via-sky-400/5 to-transparent",
              !reduceMotion && "animate-scan-slow",
            )}
            style={{ opacity: isDark ? 1 : 0.5 }}
          />
          <div
            className="absolute top-[10%] right-[5%] h-[40%] w-[40%] rounded-full blur-[130px]"
            style={{
              background: `radial-gradient(circle, rgba(251,146,60,${isDark ? 0.14 : 0.06}) 0%, transparent 70%)`,
            }}
          />
        </>
      )}

      {variant === "analysis" && (
        <>
          <div
            className="absolute inset-0 z-0 opacity-[0.05]"
            style={{ opacity: isDark ? 0.05 : 0.025 }}
          >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="ai-nodes"
                  x="0"
                  y="0"
                  width="80"
                  height="80"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="20" cy="20" r="1.5" fill="#38BDF8" />
                  <circle cx="60" cy="40" r="1.5" fill="#FB923C" />
                  <circle cx="40" cy="60" r="1.5" fill="#38BDF8" />
                  <path d="M20 20 L60 40 L40 60 Z" stroke="#38BDF8" strokeWidth="0.4" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ai-nodes)" />
            </svg>
          </div>
          <div
            className={cn(
              "absolute top-[15%] right-[15%] h-[45%] w-[45%] rounded-full blur-[110px]",
              !reduceMotion && "animate-pulse-slow",
            )}
            style={{
              background: `radial-gradient(circle, rgba(56,189,248,${isDark ? 0.18 : 0.08}) 0%, transparent 70%)`,
            }}
          />
          <div
            className={cn(
              "absolute bottom-[5%] left-[10%] h-[35%] w-[40%] rounded-full blur-[120px]",
              !reduceMotion && "animate-float-slow",
            )}
            style={{
              background: `radial-gradient(circle, rgba(251,146,60,${isDark ? 0.14 : 0.06}) 0%, transparent 70%)`,
            }}
          />
        </>
      )}

      {variant === "learning" && (
        <>
          <div
            className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.06]"
            style={{ opacity: isDark ? 0.06 : 0.03 }}
          >
            <div
              className={cn(
                "h-[600px] w-[600px] rounded-full border border-sky-400 border-dashed",
                !reduceMotion && "animate-[spin_40s_linear_infinite]",
              )}
              style={{ opacity: isDark ? 1 : 0.6 }}
            ></div>
            <div
              className={cn(
                "absolute h-[400px] w-[400px] rounded-full border border-orange-400",
                !reduceMotion && "animate-[spin_30s_linear_infinite_reverse]",
              )}
            ></div>
          </div>
          <div
            className="absolute top-[20%] left-[20%] h-[30%] w-[30%] rounded-full blur-[100px]"
            style={{
              background: `radial-gradient(circle, rgba(251,146,60,${isDark ? 0.18 : 0.08}) 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute bottom-[20%] right-[20%] h-[30%] w-[30%] rounded-full blur-[100px]"
            style={{
              background: `radial-gradient(circle, rgba(56,189,248,${isDark ? 0.16 : 0.07}) 0%, transparent 70%)`,
            }}
          />
        </>
      )}

      {variant === "results" && (
        <>
          <div
            className="absolute inset-0 z-0 opacity-[0.03]"
            style={{ opacity: isDark ? 0.03 : 0.015 }}
          >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="results-grid"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M0 40 L40 0" stroke="#38BDF8" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#results-grid)" />
            </svg>
          </div>
          <div
            className="absolute top-0 right-0 h-[45%] w-[45%] rounded-full blur-[120px]"
            style={{
              background: `radial-gradient(circle, rgba(56,189,248,${isDark ? 0.12 : 0.05}) 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute bottom-0 left-0 h-[40%] w-[45%] rounded-full blur-[120px]"
            style={{
              background: `radial-gradient(circle, rgba(251,146,60,${isDark ? 0.1 : 0.04}) 0%, transparent 70%)`,
            }}
          />
        </>
      )}

      {variant === "reports" && (
        <>
          <div
            className="absolute inset-0 z-0 opacity-[0.05]"
            style={{ opacity: isDark ? 0.05 : 0.025 }}
          >
            <div
              className="absolute left-12 top-0 h-full w-px"
              style={{
                background: "linear-gradient(to bottom, transparent, #38BDF8, transparent)",
                opacity: isDark ? 1 : 0.5,
              }}
            ></div>
            <div
              className="absolute left-[calc(100%-3rem)] top-0 h-full w-px"
              style={{
                background: "linear-gradient(to bottom, transparent, #FB923C, transparent)",
                opacity: isDark ? 1 : 0.5,
              }}
            ></div>
          </div>
          <div
            className="absolute top-[10%] right-[10%] h-[60%] w-[35%] rounded-full blur-[130px]"
            style={{
              background: `radial-gradient(circle, rgba(56,189,248,${isDark ? 0.18 : 0.08}) 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute bottom-[10%] left-[10%] h-[50%] w-[35%] rounded-full blur-[130px]"
            style={{
              background: `radial-gradient(circle, rgba(251,146,60,${isDark ? 0.16 : 0.07}) 0%, transparent 70%)`,
            }}
          />
        </>
      )}
    </div>
  );
}
