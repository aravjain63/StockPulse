import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Search, TrendingUp, User } from "lucide-react";

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = (path: string) => location.pathname === path;

  const fetchSuggestions = async (q: string) => {
    if (!q) return setResults([]);
    try {
      const res = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${q}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`
        
      );
      const data = await res.json();
      setResults(data.bestMatches || []);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSuggestions(query);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSymbolClick = (symbol: string) => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
    navigate(`/stock/${symbol}`);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Brand */}
        <div className="mr-4 flex">
          <button
            onClick={() => navigate("/stock/AAPL")}
            className="mr-6 flex items-center space-x-2"
          >
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block text-xl">
              StockPulse
            </span>
          </button>
        </div>

        {/* Nav */}
        <nav className="relative flex items-center space-x-1 text-sm font-medium">
          <Button
            variant={searchOpen ? "default" : "ghost"}
            size="sm"
            onClick={() => setSearchOpen((prev) => !prev)}
            className="h-9"
          >
            <Search className="mr-2 h-4 w-4" />
            Discover
          </Button>

          {searchOpen && (
            <div
              ref={inputRef}
              className="absolute left-32 top-12 z-50 w-72 rounded-md border bg-background p-2 shadow-lg"
            >
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a stock (AAPL, TSLA...)"
              />
              {results.length > 0 && (
                <ul className="mt-2 max-h-60 overflow-y-auto text-sm">
                  {results.map((match) => (
                    <li
                      key={match["1. symbol"]}
                      onClick={() => handleSymbolClick(match["1. symbol"])}
                      className="cursor-pointer rounded-md px-2 py-1 hover:bg-muted"
                    >
                      <strong>{match["1. symbol"]}</strong> –{" "}
                      {match["2. name"].slice(0, 40)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </nav>

        {/* Right Side */}
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-9 w-9 px-0">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
