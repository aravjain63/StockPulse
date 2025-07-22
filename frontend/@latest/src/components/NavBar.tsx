import { Home, Search, BarChart3, User, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-md px-4 py-3 shadow-lg">
      <div className="container flex h-10 max-w-screen-2xl items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-8 w-8 text-[#3b82f6]" />
          <span className="hidden sm:inline-block font-bold text-xl text-white tracking-wide">
            StockPulse
          </span>
        </div>

        {/* Right - Navigation */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Search className="mr-2 h-4 w-4" />
            Discover
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
  