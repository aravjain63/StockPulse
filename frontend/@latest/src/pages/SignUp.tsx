import { useState, useEffect } from "react";
import { Link , useNavigate} from "react-router-dom";
import { Eye, EyeOff, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
const navigate = useNavigate();
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    navigate("/", { replace: true }); // ✅ prevents double render of toast
    setTimeout(() => {
      toast.info("You are already logged in", { duration: 1100 });
    }, 100); // ✅ ensures toast shows after navigation completes
  }
}, [navigate]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", { description: "Please make sure both passwords are the same." });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim()
      };

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, payload);
      console.log("Signup successful:", response.data);
      // Optional: navigate or store token
    } catch (error: any) {
        console.error("Signup failed:", error.response?.data || error.message);
        toast.error("Signup failed", {
            description: error.response?.data?.message  || "Something went wrong during signup."
        });
    } finally {
      toast.success("Signup successful!", { description: "Welcome to StockPulse 🎉" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d12] via-[#0f111a] to-[#0c0e18] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-[#3b82f6]" />
            <span className="text-2xl font-bold text-white">StockPulse</span>
          </Link>
        </div>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.05)]">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-white">Create your account</CardTitle>
            <CardDescription className="text-white/60">
              Enter your details to get started with StockPulse
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="bg-white/10 text-white placeholder-white/60 border border-white/10 focus-visible:ring-white/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="bg-white/10 text-white placeholder-white/60 border border-white/10 focus-visible:ring-white/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-white/10 text-white placeholder-white/60 border border-white/10 focus-visible:ring-white/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Atleast 6 Characters"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="bg-white/10 text-white placeholder-white/60 border border-white/10 pr-10 focus-visible:ring-white/30"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-white/60" />
                    ) : (
                      <Eye className="h-4 w-4 text-white/60" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="bg-white/10 text-white placeholder-white/60 border border-white/10 pr-10 focus-visible:ring-white/30"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-white/60" />
                    ) : (
                      <Eye className="h-4 w-4 text-white/60" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 via-white-500 to-blue-900 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:brightness-110"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
