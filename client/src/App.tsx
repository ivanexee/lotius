import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { TranslationPrompt } from "./components/TranslationPrompt";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Laureates from "./pages/Laureates";
import Council from "./pages/Council";
import Mentors from "./pages/Mentors";
import LoadingScreen from "./components/LoadingScreen";
import { useState, useEffect } from "react";
import { initializeGoogleTranslate, translatePage } from "./lib/translate";

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

function App() {
  const hasSeenLoading = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('lotius_loaded');
  const [loading, setLoading] = useState(!hasSeenLoading);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (hasSeenLoading) return;
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem('lotius_loaded', '1');
      }, 700);
    }, 5800);
    return () => clearTimeout(timer);
  }, []);

  // Initialize Google Translate
  useEffect(() => {
    initializeGoogleTranslate();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            {loading && <LoadingScreen fadeOut={fadeOut} />}
            {!loading && (
              <>
                <Router />
                <TranslationPrompt />
              </>
            )}
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
