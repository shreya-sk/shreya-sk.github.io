
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Index from "./pages/Index";
import NotesLayout from "./pages/Noteslayout";
import BlogPost from "./pages/BlogPost";
import TIL from "./pages/TIL";
import Gists from "./pages/Gists";
import GistDetail from "./pages/GistDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<NotesLayout />} />
            <Route path="/blog/*" element={<BlogPost />} />
            <Route path="/til" element={<TIL />} />
            <Route path="/gists" element={<Gists />} />
            <Route path="/gists/:gistId" element={<GistDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
