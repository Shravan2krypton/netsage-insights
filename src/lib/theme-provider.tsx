import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "netsage-theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"; // Default to light for SSR consistency
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light"; // Default to light for SSR consistency
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch (e) {
    console.warn("Failed to read theme from localStorage", e);
  }
  return "light"; // Default to light for consistency
}

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return getSystemTheme();
  }
  return theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<Theme>("light"); // Start with light for SSR
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn("Failed to save theme to localStorage", e);
    }
  };

  // Initialize theme on mount to avoid SSR mismatch
  useEffect(() => {
    setMounted(true);
    const storedTheme = getStoredTheme();
    setThemeState(storedTheme);
    setActualTheme(resolveTheme(storedTheme));

    // Apply theme immediately on mount to prevent flash
    const resolved = resolveTheme(storedTheme);
    const root = document.documentElement;
    root.classList.remove("dark"); // Ensure dark class is removed first
    if (resolved === "dark") {
      root.classList.add("dark");
    }
    root.style.setProperty("--initial-theme", resolved);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const resolved = resolveTheme(theme);
    setActualTheme(resolved);

    const root = document.documentElement;
    root.classList.remove("dark"); // Ensure clean state
    if (resolved === "dark") {
      root.classList.add("dark");
    }

    // Ensure CSS variables are set
    root.style.setProperty("--initial-theme", resolved);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const resolved = getSystemTheme();
      setActualTheme(resolved);
      const root = document.documentElement;
      if (resolved === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      // Ensure CSS variables are set
      root.style.setProperty("--initial-theme", resolved);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
