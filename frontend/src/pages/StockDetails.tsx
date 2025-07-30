import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, Calendar as CalendarIcon, TrendingUp, TrendingDown, ChevronDown, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { toast } from "sonner";
const baseUrl = import.meta.env.VITE_API_BASE_URL // replace with your actual backend URL

export default function StockDetails() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  /* ─────────────────── state ─────────────────── */
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  });
  const [isAiSummaryOpen, setIsAiSummaryOpen] = useState(false);
  const [expandedNews, setExpandedNews] = useState<number | null>(null);

  const [stockData, setStockData] = useState<any | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [aiSummary, setAiSummary] = useState<any | null>(null);

  const [loadingStock, setLoadingStock] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  

  const token = localStorage.getItem("token");

  /* ─────────────────── helpers ─────────────────── */
  const periods = ["1D", "1W", "1M"];
  const mapping: Record<string, string> = { "1D": "daily", "1W": "weekly", "1M": "monthly" };

  /* ─────────────────── auth guard ─────────────────── */
  useEffect(() => {
    if (!token) {
      toast.error("Need to login", { description: "Please login to access stock details" });
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  /* ─────────────────── fetch current quote ─────────────────── */
  useEffect(() => {
    if (!symbol || !token) return;
    setLoadingStock(true);

    axios
      .get(`${baseUrl}/stocks/${symbol}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setStockData(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoadingStock(false));
  }, [symbol, token]);

  /* ─────────────────── fetch chart history ─────────────────── */
  useEffect(() => {
    if (!symbol || !token || !selectedPeriod) return;
    setLoadingChart(true);

    axios
      .get(`${baseUrl}/stocks/${symbol}/history?period=${selectedPeriod}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // console.log("Frontend Raw History Data:", res.data); // Add this line
        const formatted = res.data.map((entry: any) => ({
          time: entry.date,
          price: entry.close,
        }));
        setChartData(formatted);
        // console.log("Chart Data:", formatted); // Add this line for debugging
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoadingChart(false));
  }, [symbol, selectedPeriod, token]);

  /* ─────────────────── fetch news ─────────────────── */
  useEffect(() => {
    if (!symbol || !token || !selectedDate) return;
    setLoadingNews(true);

    const dateStr = selectedDate.toISOString().split("T")[0];
    axios
      .get(`${baseUrl}/news/${symbol}/?date=${dateStr}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNews(res.data))
      .catch(console.error)
      .finally(() => setLoadingNews(false));
  }, [symbol, selectedDate, token]);

  /* ─────────────────── AI summary ─────────────────── */
  const fetchAiSummary = async () => {
    if (!symbol || !token) return;

    setIsAiSummaryOpen(false);
    setLoadingAI(true);
    try {
      const res = await axios.get(`${baseUrl}/news/${symbol}/analyze`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAiSummary(res.data.analysis);
      setIsAiSummaryOpen(true);
    } catch (err) {
      console.error("AI summary error:", err);
      toast.error("AI summary error", { description: "AI service is currently down" });
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    if (isAiSummaryOpen) fetchAiSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  

  /* ─────────────────── render ─────────────────── */
  if (!token) return null; // safeguard

  return (
    <div className="min-h-screen bg-background mx-4">
      <div className="container mx-auto p-6">
        {/* ───── stock header ───── */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-5xl font-bold mb-1">
                  {loadingStock ? "Loading…" : stockData?.name}
                </h1>
                <p className="text-lg text-muted-foreground">{stockData?.symbol}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ───── price section ───── */}
        {stockData && (
          <div className="mb-8">
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold">${stockData.price.toFixed(2)}</span>
              <div
                className={`flex items-center gap-1 text-xl ${
                  stockData.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stockData.change >= 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                {stockData.change >= 0 ? "+" : ""}${stockData.change.toFixed(2)}(
                {stockData.change >= 0 ? "+" : ""}
                {stockData.changePercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        )}

        {/* ───── key metrics ───── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            ["Volume", stockData?.volume],
            ["High", stockData?.high],
            ["Low", stockData?.low],
            ["Prev Close", stockData?.prevclose],
          ].map(([label, value]) => (
            <Card key={label}>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">{label}</div>
                <div className="text-lg font-semibold">{value ?? "-"}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ───── chart ───── */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Price Chart</CardTitle>
              <div className="flex gap-1">
                {periods.map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === mapping[period] ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPeriod(mapping[period])}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="2 2"
                    stroke="hsl(var(--border))"
                    strokeOpacity={0.3}
                  />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                    tickFormatter={(tick, index) => (index % 10 === 0 ? tick : '')}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `$${v.toFixed(2)}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(v: number) => [`$${v.toFixed(2)}`, "Price"]}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="hsl(var(--primary))"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* ───── news & AI analysis ───── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── news list ── */}
          <div className="lg:col-span-2">
            <Card className="p-2">
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div className="text-3xl px-2 mr-2">Latest News</div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
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
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {news.map((article: any, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📰</span>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{article.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <span>{article.source}</span>
                          <span>•</span>
                          <span>{new Date(article.publishedAt).toLocaleString()}</span>
                        </div>
                        <Collapsible
                          open={expandedNews === idx}
                          onOpenChange={(open) => setExpandedNews(open ? idx : null)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-0 h-auto">
                              <span className="mr-1">
                                {expandedNews === idx ? "Read Less" : "Read More"}
                              </span>
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 transition-transform",
                                  expandedNews === idx && "rotate-180"
                                )}
                              />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2">
                            <p className="text-sm text-muted-foreground">{article.content}</p>
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 mt-2 text-blue-500 text-sm"
                            >
                              <ExternalLink className="h-3 w-3" /> Read full article
                            </a>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* ── AI analysis ── */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {!aiSummary ? (
                  <Button onClick={fetchAiSummary} disabled={loadingAI} className="w-full">
                    {loadingAI ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing…
                      </>
                    ) : (
                      "Get AI Summary"
                    )}
                  </Button>
                ) : (
                  <Collapsible open={isAiSummaryOpen} onOpenChange={setIsAiSummaryOpen}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <span className="mr-2">AI Summary</span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isAiSummaryOpen && "rotate-180"
                          )}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      <div className="space-y-2">
                        <Badge
                          className={`mb-2 ${
                            aiSummary.sentiment === "positive"
                              ? "bg-green-400"
                              : aiSummary.sentiment === "negative"
                              ? "bg-red-400"
                              : "bg-slate-400"
                          }`}
                        >
                          Sentiment: {aiSummary.sentiment}
                        </Badge>
                        <ul className="list-disc pl-4 space-y-1 text-sm">
                          {aiSummary.keyPoints.map((p: string, i: number) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                        <p className="text-sm text-muted-foreground mt-2">
                          {aiSummary.potentialImpact}
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
