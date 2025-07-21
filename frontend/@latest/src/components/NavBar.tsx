import { Home, Search, BarChart3, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-transparent backdrop-blur supports-[backdrop-filter]:bg-transparent pb-2 mb-4">
      <div className="container flex h-10 max-w-screen-2xl items-center justify-between" >
        {/* Left side - Logo */}
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-white" />
          <span className="hidden font-bold sm:inline-block text-xl text-white">
            StockPulse
          </span>
        </div>

        {/* Right side - Navigation buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="default" size="sm" className="h-9">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="default" size="sm" className="h-9">
            <Search className="mr-2 h-4 w-4" />
            Discover
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 px-0 text-white">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
