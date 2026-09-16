import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function ThemeSelector() {
  const { theme, setTheme, actualTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [iconRotation, setIconRotation] = useState(0);

  const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
  const currentIndex = theme ? themes.indexOf(theme) : 0;

  const handleNextTheme = () => {
    setIsAnimating(true);
    setIconRotation((prev) => prev + 180);

    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    if (nextTheme) {
      setTheme(nextTheme);
    }

    setTimeout(() => {
      setIsAnimating(false);
      setIconRotation(0); // Reset rotation to keep icon upright
    }, 400);
  };

  const getIcon = () => {
    if (theme === "system") {
      return Monitor;
    }
    return theme === "dark" ? Moon : Sun;
  };

  const Icon = getIcon();
  const label =
    theme === "system"
      ? `System (${actualTheme})`
      : theme
        ? theme.charAt(0).toUpperCase() + theme.slice(1)
        : "System";

  return (
    <button
      onClick={handleNextTheme}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300",
        "bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]",
        "hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]",
        "shadow-sm hover:shadow-md hover:shadow-[var(--primary)]/10",
        "active:scale-95",
        isAnimating && "scale-95",
      )}
      title={`Current: ${label}. Click to cycle through themes: Light → Dark → System`}
    >
      <Icon
        className={cn(
          "h-5 w-5 transition-transform duration-400 ease-in-out",
          isAnimating && "rotate-180",
        )}
        style={{ transform: `rotate(${iconRotation}deg)` }}
      />
      <span className="sr-only">{label}</span>

      {/* Animated glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 hover:opacity-100" />

      {/* Theme indicator dot with pulse animation */}
      <span
        className={cn(
          "absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--primary)]",
          "shadow-[0_0_8px_rgba(56,189,248,0.8)]",
          isAnimating && "animate-ping",
        )}
      />
    </button>
  );
}
