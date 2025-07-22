import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Star, MoreVertical, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { NavBar } from "@/components/NavBar";

const watchlistSchema = z.object({
  name: z.string().min(1, "Watchlist name is required"),
  description: z.string().optional(),
});

type WatchlistForm = z.infer<typeof watchlistSchema>;

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [watchlists, setWatchlists] = useState([
    {
      id: 1,
      name: "Tech Giants",
      description: "Large cap technology companies",
      stockCount: 5,
      stocks: ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"]
    },
    {
      id: 2,
      name: "Growth Stocks",
      description: "High growth potential companies",
      stockCount: 4,
      stocks: ["NVDA", "AMD", "CRM", "SHOP"]
    },
    {
      id: 3,
      name: "Dividend Kings",
      description: "Reliable dividend paying stocks",
      stockCount: 4,
      stocks: ["JNJ", "PG", "KO", "PEP"]
    }
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<WatchlistForm>({
    resolver: zodResolver(watchlistSchema)
  });

  const onSubmit = (data: WatchlistForm) => {
    const newList = {
      id: Date.now(),
      name: data.name,
      description: data.description || "",
      stockCount: 0,
      stocks: []
    };
    setWatchlists(prev => [...prev, newList]);
    toast.success("Watchlist created successfully");
    reset();
  };

  const filteredWatchlists = watchlists.filter(watchlist =>
    watchlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    watchlist.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02030d] via-[#010416] to-[#020617] text-white ">
      <NavBar></NavBar>
      <header className=" bg-[#02030d]/60 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white text-left">Dashboard</h1>
              <p className="text-muted-foreground text-left">Manage your investment portfolio</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search watchlists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-[#02030d] border-border/40 text-white placeholder-muted-foreground"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className=" bg-[#02030d] text-white hover:brightness-110 shadow-md">
                    <Plus className="h-4 w-4 mr-2" />
                    New Watchlist
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-[#02030d] via-[#010416] to-[#020617] border border-border">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New Watchlist</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Create a new watchlist to organize and track your favorite stocks.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Watchlist Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Tech Stocks"
                        {...register("name")}
                        className="bg-[#131b3a] border-border/40 text-white placeholder-muted-foreground"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-white">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of this watchlist..."
                        {...register("description")}
                        className="bg-[#131b3a] border-border/40 text-white placeholder-muted-foreground"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-[#02030d] text-white hover:brightness-110 shadow-md">
                      Create Watchlist
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWatchlists.map(watchlist => (
          <Card key={watchlist.id} className="bg-[#131b3a] border border-border hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">{watchlist.name}</h3>
                  <p className="text-muted-foreground text-sm">{watchlist.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Separator className="bg-border" />
              <div className="flex flex-wrap gap-2">
                {watchlist.stocks.length > 0 ? (
                  watchlist.stocks.map(symbol => (
                    <Badge key={symbol} variant="outline" className="bg-[#0f172a] border-border text-white">
                      {symbol}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No stocks added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
};

export default Dashboard;
