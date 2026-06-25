import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { TranslationPrompt } from "./components/TranslationPrompt";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Laureates from "./pages/Laureates";
import Council from "./pages/Council";
import Mentors from "./pages/Mentors";
import LoadingScreen from "./components/LoadingScreen";
import PaintReveal from "./components/PaintReveal";
import { useState, useEffect } from "react";
import { initializeGoogleTranslate } from "./lib/translate";

// Hidden div for Google Translate element
if (typeof document !== "undefined" && !document.getElementById("google_translate_element")) {
  const div = document.createElement("div");
  div.id = "google_translate_element";
  div.style.display = "none";
  document.body.appendChild(div);
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/discover" component={Discover} />
      <Route path="/laureates" component={Laureates} />
      <Route path="/council" component={Council} />
      <Route path="/mentors" component={Mentors} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { theme } = useTheme();
  // Always show loading screen on every page load/refresh
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showPaintReveal, setShowPaintReveal] = useState(false);
  const [revealComplete, setRevealComplete] = useState(false);

  useEffect(() => {
    // Show loading screen for 5.8s, then fade out over 700ms
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 5800);

    const hideTimer = setTimeout(() => {
      setLoading(false);
      // Start paint reveal immediately after loading screen disappears
      setShowPaintReveal(true);
    }, 6500); // 5800 + 700ms fade

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Initialize Google Translate
  useEffect(() => {
    initializeGoogleTranslate();
  }, []);

  const handleRevealComplete = () => {
    setRevealComplete(true);
    setShowPaintReveal(false);
  };

  return (
    <>
      <Toaster />
      {loading && <LoadingScreen fadeOut={fadeOut} />}
      {!loading && (
        <>
          <Router />
          {/* Paint Reveal overlay — sits above content and paints away */}
          {showPaintReveal && !revealComplete && (
            <PaintReveal
              duration={2200}
              darkOverlay={theme === "dark"}
              onComplete={handleRevealComplete}
            />
          )}
          <TranslationPrompt />
        </>
      )}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <AppContent />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
