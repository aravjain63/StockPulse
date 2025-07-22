import { useState, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Loader2,
  Calendar as CalendarIcon,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StockChart from "@/components/StockChart";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import API from "@/lib/API";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const STOCK_SYMBOL = "AAPL";

type TimePeriod = "1D" | "1W" | "1M";

export function StockDetail() {
  const periods: TimePeriod[] = ["1D", "1W", "1M"];
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1D");

  const [stockData, setStockData] = useState<any>(null);
  const [chartData, setChartData] = useState<Record<TimePeriod, any[]>>({
    "1D": [],
    "1W": [],
    "1M": [],
  });
  const [news, setNews] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [expandedNews, setExpandedNews] = useState<number | null>(null);
  const [isAiSummaryOpen, setIsAiSummaryOpen] = useState(false);
  const [isLoadingAiSummary, setIsLoadingAiSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [sentiment, setsentiment] = useState<string | null>(null);

  const currentChartData = chartData[selectedPeriod] || [];

  // Fetch stock overview
  useEffect(() => {
    API
      .get(`${BASE_URL}/stocks/${STOCK_SYMBOL}`)
      .then(res => setStockData(res.data))
      .catch(err => console.error("Stock fetch error:", err));
  }, []);

  // Fetch historical chart data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const responses = await Promise.all([
          API.get(`${BASE_URL}/stocks/${STOCK_SYMBOL}/history?period=daily`),
          API.get(`${BASE_URL}/stocks/${STOCK_SYMBOL}/history?period=weekly`),
          API.get(`${BASE_URL}/stocks/${STOCK_SYMBOL}/history?period=monthly`),
        ]);
        setChartData({
          "1D": responses[0].data.map((d: any) => ({ time: d.date, price: d.close })),
          "1W": responses[1].data.map((d: any) => ({ time: d.date, price: d.close })),
          "1M": responses[2].data.map((d: any) => ({ time: d.date, price: d.close })),
        });
      } catch (err) {
        console.error("Chart data fetch error:", err);
      }
    };
    fetchHistory();
  }, []);

  // Fetch news
  useEffect(() => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    
    API.get(`/news/${STOCK_SYMBOL}`, {
      params: { date: formattedDate }
    })
    .then((res) => setNews(res.data))
    .catch((err) => console.error("News fetch error:", err));
  }, [selectedDate]);
  
//   const handleGetAiSummary = async () => {
//     const formattedDate = format(selectedDate, "yyyy-MM-dd");
//   setIsLoadingAiSummary(true);
//   try {
//     const response = await API.get(`${BASE_URL}/stocks/${STOCK_SYMBOL}/analyze`,{
//       params: { date: formattedDate }
//     });
//     setAiSummary(response.data.analysis.summary);  
//     setsentiment(response.data.analysis.sentiment);  
//     setIsAiSummaryOpen(true);
//   } catch (error) {
//     console.error("Failed to fetch AI summary:", error);
//   } finally {
//     setIsLoadingAiSummary(false);
//   }
// };
useEffect(() => {
  const fetchAISummary = async () => {
    setIsLoadingAiSummary(true);
    setAiSummary(null); // Clear old summary
    setIsAiSummaryOpen(false);

    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    try {
      const response = await API.get(`${BASE_URL}/stocks/${STOCK_SYMBOL}/analyze`, {
        params: { date: formattedDate },
      });
      setAiSummary(response.data.analysis.summary);
      setsentiment(response.data.analysis.sentiment);
    } catch (error) {
      console.error("Failed to fetch AI summary:", error);
    } finally {
      setIsLoadingAiSummary(false);
    }
  };

  fetchAISummary();
}, [selectedDate]);

  if (!stockData) return <div className="text-white text-4xl">Loading stock info...</div>;

  return (
    <div>
    <NavBar></NavBar>
    <div className="m-5 ">
      <div className="pb-8 text-white">
        <h1 className="text-5xl font-extrabold text-left">{stockData.name}</h1>
        <div className="flex items-baseline gap-4 mt-2">
          <span className="text-5xl font-bold">${stockData.price.toFixed(2)}</span>
          <div className={`flex items-center gap-1 text-xl ${stockData.change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {stockData.change >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            {stockData.change >= 0 ? "+" : ""}${stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
          </div>
        </div>
        <h4 className="text-xl font-semibold text-muted-foreground text-left mt-1">{stockData.symbol}</h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">
        {[
          { label: "Volume", value: stockData.volume.toLocaleString() },
          { label: "High", value: `$${stockData.high}` },
          { label: "Low", value: `$${stockData.low}` },
          { label: "Prev Close", value: `$${stockData.prevclose}` },
          { label: "Change", value: `${stockData.change.toFixed(2)} (${stockData.changePercent.toFixed(2)}%)` },
        ].map((metric) => (
          <Card key={metric.label} className="bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-sm rounded-xl">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
              <p className="text-xl font-bold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <StockChart
        data={currentChartData}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        periods={periods}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* news service */}
        <div className="lg:col-span-2">
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <CardTitle className="text-2xl font-semibold">Latest News</CardTitle>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <CardContent className="space-y-4 p-4">
              {news.map((article, idx) => (
                <div key={idx} className="border border-white/10 rounded-lg p-4 bg-white/5">
                  <div className="flex flex-col items-start">
                    <h3 className="font-semibold text-white mb-1">{article.title}</h3>
                    <div className="flex gap-2 text-sm text-muted-foreground mb-2">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{format(new Date(article.publishedAt), "PPP")}</span>
                    </div>
                    <Collapsible
                      open={expandedNews === idx}
                      onOpenChange={(open) => setExpandedNews(open ? idx : null)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button variant="link" size="sm" className="p-0 h-auto justify-start text-sm text-left w-full text-white">
                          <div className="flex items-center gap-1">
                            <span>{expandedNews === idx ? "Read Less" : "Read More"}</span>
                            <ChevronDown className={cn("h-4 w-4 transition-transform", expandedNews === idx && "rotate-180")} />
                          </div>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <p className="text-sm text-muted-foreground">{article.description}</p>
                        <div className="text-left mt-2">
                          <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="p-0 h-auto text-muted-foreground">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Read full article
                            </Button>
                          </a>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis */}
        <div>
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-sm rounded-xl">
  <CardHeader>
    <CardTitle className="text-2xl">AI Analysis</CardTitle>
  </CardHeader>
  <CardContent>
    {isLoadingAiSummary ? (
      <Button variant="secondary" disabled className="w-full">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Analyzing...
      </Button>
    ) : aiSummary ? (
      <Collapsible open={isAiSummaryOpen} onOpenChange={setIsAiSummaryOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="secondary" className="w-full">
            <span className="mr-2">AI Summary</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", isAiSummaryOpen && "rotate-180")} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div className="space-y-2">
            <Badge className="mb-2 w-full">Sentiment: {sentiment}</Badge>
            <div className="text-sm whitespace-pre-line text-left">{aiSummary}</div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    ) : (
      <p className="text-muted-foreground text-sm">No summary available for this date.</p>
    )}
  </CardContent>
</Card>
        </div>
      </div>
    </div>
    </div>
  );
}
