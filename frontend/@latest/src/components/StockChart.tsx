import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type TimePeriod = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "5Y";

interface ChartData {
  time: string;
  price: number;
  volume?: number;
}

interface StockChartProps {
  data: ChartData[];
  selectedPeriod: TimePeriod;
  setSelectedPeriod: (period: TimePeriod) => void;
  periods: TimePeriod[];
}

export default function StockChart({
  data,
  selectedPeriod,
  setSelectedPeriod,
  periods,
}: StockChartProps) {
  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-sm rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Price Chart</CardTitle>
          <div className="flex gap-1 flex-wrap">
            {periods.map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className={`${
                  selectedPeriod === period
                    ? "bg-black text-white"
                    : "border-white/30 text-black"
                }`}
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
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="darkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis
                dataKey="time"
                tick={{ fill: "#ccc", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={["dataMin - 2", "dataMax + 2"]}
                tick={{ fill: "#ccc", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${val.toFixed(2)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e1e1e",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                labelStyle={{ color: "#aaa" }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#4ade80"
                strokeWidth={3}
                fill="url(#darkGradient)"
                dot={{ r: 0 }}
                activeDot={{
                  r: 6,
                  stroke: "#4ade80",
                  strokeWidth: 2,
                  fill: "#0f0f0f",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
