import { useState } from "react";
import { ArrowLeft, Calendar as CalendarIcon, TrendingUp, TrendingDown, ChevronDown, Loader2, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

import {
  Button
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import StockChart from "@/components/StockChart"; // Adjust the import path as needed
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mockStockData = {
  symbol: "AAPL",
  name: "Apple Inc.",
  price: 175.43,
  change: 2.15,
  changePercent: 1.24,
  metrics: {
    high: "2.75T",
    volume: "45.2M",
    low: 28.5,
    weekHigh52: 182.94,
    weekLow52: 124.17,
  },
};

const mockChartData = {
  "1D": [
    { time: "09:30", price: 173.28, volume: 2.1 },
    { time: "10:00", price: 174.15, volume: 1.8 },
    { time: "10:30", price: 173.92, volume: 1.5 },
    { time: "11:00", price: 175.43, volume: 2.3 },
  ],
  "1W": [
    { time: "Mon", price: 170.25, volume: 45.2 },
    { time: "Tue", price: 172.80, volume: 38.7 },
    { time: "Wed", price: 174.15, volume: 42.1 },
    { time: "Thu", price: 173.50, volume: 35.9 },
    { time: "Fri", price: 175.43, volume: 48.3 },
  ],
  "1M": [
    { time: "Week 1", price: 165.20, volume: 225.4 },
    { time: "Week 2", price: 168.75, volume: 198.7 },
    { time: "Week 3", price: 172.30, volume: 210.8 },
    { time: "Week 4", price: 175.43, volume: 235.1 },
  ],
};
const mockNews = [
  {
    id: 1,
    headline: "Apple Reports Strong Q4 Earnings, Beats Revenue Expectations",
    source: "Reuters",
    timestamp: "2 hours ago",
    summary: "Apple Inc. reported quarterly revenue of $89.5 billion, surpassing analyst expectations...",
    thumbnail: "📱"
  },
  {
    id: 2,
    headline: "iPhone 15 Pro Max Sales Exceed Projections in First Quarter",
    source: "Bloomberg",
    timestamp: "4 hours ago",
    summary: "The latest iPhone model has seen unprecedented demand across global markets...",
    thumbnail: "📱"
  },
  {
    id: 3,
    headline: "Apple Announces New AI Features for iOS 18",
    source: "TechCrunch",
    timestamp: "1 day ago",
    summary: "The tech giant unveiled advanced AI capabilities integrated into its mobile operating system...",
    thumbnail: "🤖"
  }
];


type TimePeriod = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "5Y";

export function StockDetail() {
  const periods: TimePeriod[] = ["1D", "1W", "1M"];
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1D");

  const currentChartData = mockChartData[selectedPeriod] || [];
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [expandedNews, setExpandedNews] = useState<number | null>(null);
    const [isAiSummaryOpen, setIsAiSummaryOpen] = useState(false);
  const [isLoadingAiSummary, setIsLoadingAiSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const handleGetAiSummary = async () => {
    setIsLoadingAiSummary(true);
    // Simulate API call
    setTimeout(() => {
      setAiSummary(`
        • Strong quarterly performance with revenue beating expectations by 3.2%
        • iPhone 15 series showing robust sales momentum globally
        • Services revenue continues to grow at 16% year-over-year
        • Management guidance for next quarter appears conservative
        • Overall sentiment: POSITIVE with bullish outlook for next 6 months
      `);
      setIsLoadingAiSummary(false);
      setIsAiSummaryOpen(true);
    }, 2000);
  };

  return (
    <>
      <div className="pb-8 text-white">
            <h1 className="text-5xl font-extrabold text-left">{mockStockData.name}</h1>
            <div className="flex items-baseline gap-4 mt-2">
              <span className="text-5xl font-bold">${mockStockData.price.toFixed(2)}</span>
              <div
                className={`flex items-center gap-1 text-xl ${
                  mockStockData.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {mockStockData.change >= 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                {mockStockData.change >= 0 ? "+" : ""}
                ${mockStockData.change.toFixed(2)} (
                {mockStockData.change >= 0 ? "+" : ""}
                {mockStockData.changePercent.toFixed(2)}%)
              </div>
            </div>
            <h4 className="text-xl font-semibold text-muted-foreground text-left mt-1">
              {mockStockData.symbol}
            </h4>
      </div>

      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">
        {[
          { label: "Market Cap", value: mockStockData.metrics.high },
          { label: "Volume", value: mockStockData.metrics.volume },
          { label: "P/E Ratio", value: mockStockData.metrics.low },
          { label: "52W High", value: `$${mockStockData.metrics.weekHigh52}` },
          { label: "52W Low", value: `$${mockStockData.metrics.weekLow52}` },
        ].map((metric) => (
          <Card
            key={metric.label}
            className="bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-sm rounded-xl"
          >
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
              <p className="text-xl font-bold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <StockChart
        data={currentChartData}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        periods={periods}
      />
      <br>
      </br>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-sm rounded-xl">
                    {/* Header with Title and Calendar */}
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

                    {/* News List */}
                    <CardContent className="space-y-4 p-4">
                {mockNews.map((article) => (
                  <div
                    key={article.id}
                    className="border border-white/10 rounded-lg p-4 bg-white/5"
                  >
                    <div className="flex flex-col items-start">
                      <h3 className="font-semibold text-white mb-1">{article.headline}</h3>

                      <div className="flex gap-2 text-sm text-muted-foreground mb-2">
                        <span>{article.source}</span>
                        <span>•</span>
                        <span>{article.timestamp}</span>
                      </div>

                      {/* Expandable Summary */}
                      <Collapsible
                open={expandedNews === article.id}
                onOpenChange={(open) => setExpandedNews(open ? article.id : null)}
              >
                <CollapsibleTrigger asChild>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto justify-start text-sm text-left w-full text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>{expandedNews === article.id ? "Read Less" : "Read More"}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        expandedNews === article.id && "rotate-180"
                      )}
                    />
                  </div>
                </Button>
              </CollapsibleTrigger>

                <CollapsibleContent className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    {article.summary}
                  </p>
                  <div className="text-left ml-0 pl-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 p-0 h-auto text-muted-foreground ml-0 pl-0  "
                    >
                      <ExternalLink className="h-3 w-3 mr-1 ml-0 pl-0   " />
                      Read full article
                    </Button>

                  </div>
                </CollapsibleContent>
              </Collapsible>
                    </div>
                  </div>
                ))}
              </CardContent>

                  </Card>
                </div>
                <div>
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-2xl">AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {!aiSummary ? (
                  <Button 
                    variant={'secondary'}
                    onClick={handleGetAiSummary}
                    disabled={isLoadingAiSummary}
                    className="w-full"
                  >
                    {isLoadingAiSummary ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Get AI Summary"
                    )}
                  </Button>
                ) : (
                  <Collapsible open={isAiSummaryOpen} onOpenChange={setIsAiSummaryOpen}>
                    <CollapsibleTrigger asChild>
                      <Button variant="secondary" className="w-full">
                        <span className="mr-2">AI Summary</span>
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform",
                          isAiSummaryOpen && "rotate-180"
                        )} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      <div className="space-y-2">
                        <Badge className="mb-2 w-full">Sentiment: Positive</Badge>
                        <div className="text-sm whitespace-pre-line text-left">{aiSummary}</div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </CardContent>
            </Card>
          </div>

      </div>  

    </>
  );
}
