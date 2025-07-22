import { ArrowRight, TrendingUp, PieChart, Brain, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-stock-chart.jpg";

const LandingPage = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Real-time Stock Tracking",
      description: "Monitor stock prices with live updates and instant notifications for your watchlists"
    },
    {
      icon: PieChart,
      title: "Historical Data Analysis",
      description: "Dive deep into historical trends with interactive charts and comprehensive data analysis"
    },
    {
      icon: Brain,
      title: "AI-Powered News Summaries",
      description: "Get intelligent insights from market news with our advanced AI summarization technology"
    },
    {
      icon: Star,
      title: "Custom Watchlists",
      description: "Create and manage personalized watchlists to track your favorite stocks and portfolios"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050d1f] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-[#3b82f6]" />
            <span className="text-2xl font-bold">StockPulse</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:text-[#3b82f6]">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
<section className="relative min-h-screen flex items-center justify-center overflow-hidden">        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/80 to-[#1e293b]/80"></div>
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Stock market visualization" 
            className="w-full h-full object-cover mix-blend-soft-light"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-[#3b82f6] to-white bg-clip-text text-transparent">
              Discover Why Your 
              <span className="block text-[#3b82f6]">Stocks Move</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Track stock prices, analyze historical data, and get AI-powered insights into market movements with our comprehensive analysis platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button size="lg" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-md shadow-blue-500/30 transition">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border border-white/30 text-white bg-white/5 hover:bg-white/10 backdrop-blur">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0a122e]/60 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need for Smart Investing
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our comprehensive suite of tools helps you make informed investment decisions with confidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group transition-all duration-300 border border-white/10 hover:border-[#3b82f6] bg-[#1e293b]/70 backdrop-blur-md"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[#3b82f6]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#3b82f6]/20 transition-colors">
                      <Icon className="h-8 w-8 text-[#3b82f6]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#3b82f6]/10 to-[#1e40af]/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Transform Your Investment Strategy?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Join thousands of investors who trust StockPulse for their market analysis needs
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-md shadow-blue-500/30 transition">
                Start Your Journey Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-[#0a122e] text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <TrendingUp className="h-6 w-6 text-[#3b82f6]" />
              <span className="text-lg font-semibold">StockPulse</span>
            </div>
            <div className="text-gray-400">
              © 2024 StockPulse. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
