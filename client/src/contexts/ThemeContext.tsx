import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

// Helper: inject .theme-transitioning on <html> for the duration of the cross-fade,
// then remove it so it doesn't interfere with scroll/motion animations afterwards.
function withThemeTransition(callback: () => void) {
  const root = document.documentElement;
  root.classList.add("theme-transitioning");
  callback();
  const timer = window.setTimeout(() => {
    root.classList.remove("theme-transitioning");
  }, 500);
  return timer;
}

// Detect the current system preference
function getSystemTheme(): Theme {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = true,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // On every page load, ALWAYS start from system preference.
    // A manual override stored in sessionStorage (NOT localStorage) is respected
    // only for the current browser session — it clears on tab close / refresh.
    const sessionOverride = sessionStorage.getItem("theme-manual-session");
    if (sessionOverride === "dark" || sessionOverride === "light") {
      return sessionOverride as Theme;
    }
    // No session override → use live system preference
    return getSystemTheme();
  });

  // Apply .dark class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    withThemeTransition(() => {
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    });
  }, [theme]);

  // Listen for OS-level system theme changes at runtime
  // (e.g. user flips dark mode on their iPhone while the page is open)
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if the user hasn't manually toggled this session
      const hasSessionOverride = sessionStorage.getItem("theme-manual-session");
      if (!hasSessionOverride) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handleChange);
      return () => (mediaQuery as any).removeListener(handleChange);
    }
  }, []);

  const toggleTheme = switchable
    ? () => {
        setTheme(prev => {
          const newTheme = prev === "light" ? "dark" : "light";
          // Store in sessionStorage only — clears on refresh so system preference
          // takes over again on the next page load.
          sessionStorage.setItem("theme-manual-session", newTheme);
          return newTheme;
        });
      }
    : undefined;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, switchable }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
