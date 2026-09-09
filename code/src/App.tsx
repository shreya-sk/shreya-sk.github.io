
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";

// Every non-home route is code-split: the heavy markdown/highlighting stack
// loads only when a reader opens that page, and CodeMirror/LightningFS only
// on /editor. Keeps the first-visit bundle small.
const NotesLayout = lazy(() => import("./pages/Noteslayout"));
const TIL = lazy(() => import("./pages/TIL"));
const Work = lazy(() => import("./pages/Work"));
const NotFound = lazy(() => import("./pages/NotFound"));
const VaultEditor = lazy(() => import("./pages/VaultEditor"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <p className="text-muted-foreground text-sm font-mono">loading…</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<NotesLayout />} />
              <Route path="/til" element={<TIL />} />
              <Route path="/work" element={<Work />} />
              <Route path="/resume" element={<Navigate to="/work" replace />} />
              <Route path="/editor" element={<VaultEditor />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
