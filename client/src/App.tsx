import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Lessons from "./pages/Lessons";
import LessonView from "./pages/LessonView";
import SongStudio from "./pages/SongStudio";
import Progress from "./pages/Progress";
import Dashboard from "./pages/Dashboard";
import DJParty from "./pages/DJParty";
import Privacy from "./pages/Privacy";
import CookieConsent from "./components/CookieConsent";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat" component={Chat} />
      <Route path="/lessons" component={Lessons} />
      <Route path="/lesson/:id" component={LessonView} />
      <Route path="/songs" component={SongStudio} />
      <Route path="/progress" component={Progress} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dj-party" component={DJParty} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
          <CookieConsent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
