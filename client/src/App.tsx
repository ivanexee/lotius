import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Laureates from "./pages/Laureates";
import Council from "./pages/Council";
import Mentors from "./pages/Mentors";
import LoadingScreen from "./components/LoadingScreen";
import { useState, useEffect } from "react";

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

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          {loading && <LoadingScreen fadeOut={fadeOut} />}
          {!loading && <Router />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
