import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
// import Dashboard from "./pages/Dashboard";
// import WatchlistDetails from "./pages/WatchlistDetails";
import StockDetails from "./pages/StockDetails";
// import StockDiscovery from "./pages/StockDiscovery";
import NotFound from "./pages/NotFound";
import Topbar from "./components/Topbar";


function AppContent() {
  const location = useLocation();
  const showTopbar = !["/", "/signup", "/login"].includes(location.pathname);

  return (
    <>
      <Toaster />
      <Sonner position="top-right" />
      {showTopbar && <Topbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/watchlist/:id" element={<WatchlistDetails />} /> */}
        <Route path="/stock/:symbol" element={<StockDetails />} />
        {/* <Route path="/stocks" element={<StockDiscovery />} /> */}
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
    <TooltipProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
);

export default App;
