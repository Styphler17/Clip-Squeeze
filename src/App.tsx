import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { BackToTop } from "@/components/ui/back-to-top";
import VideoCompressor from "./pages/VideoCompressor";
import VideoRepair from "./pages/VideoRepair";
import History from "./pages/History";
import HowToUse from "./pages/HowToUse";
import Settings from "./pages/Settings";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<VideoCompressor />} />
          <Route path="/repair" element={<VideoRepair />} />
          <Route path="/history" element={<History />} />
          <Route path="/guide" element={<HowToUse />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
          <BackToTop />
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
