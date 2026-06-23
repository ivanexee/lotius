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
  // Add transition class
  root.classList.add("theme-transitioning");
  // Execute the actual theme change
  callback();
  // Remove after transition completes (450ms + small buffer)
  const timer = window.setTimeout(() => {
    root.classList.remove("theme-transitioning");
  }, 500);
  return timer;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = true,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for stored preference first
    const stored = localStorage.getItem("theme");
    if (stored) return (stored as Theme);
    
    // Detect system preference automatically
    if (typeof window !== "undefined" && window.matchMedia) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return defaultTheme;
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

    if (switchable) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, switchable]);

  // Listen for OS-level system theme changes (e.g. iPhone switches to dark mode)
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually overridden theme
      const hasManualPreference = localStorage.getItem("theme-manual");
      if (!hasManualPreference) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    // Fallback for older browsers
    else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handleChange);
      return () => (mediaQuery as any).removeListener(handleChange);
    }
  }, []);

  const toggleTheme = switchable
    ? () => {
        setTheme(prev => {
          const newTheme = prev === "light" ? "dark" : "light";
          // Mark that user manually changed theme so system changes don't override
          localStorage.setItem("theme-manual", "true");
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
