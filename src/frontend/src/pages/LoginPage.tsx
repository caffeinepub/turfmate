import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import type { UserRole } from "../types";

const REMEMBER_KEY = (role: UserRole) => `turfmate_remember_${role}`;

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("user");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const isAdmin = role === "admin";

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY(role));
    if (saved) {
      try {
        const { id, pwd } = JSON.parse(saved);
        setIdentifier(id || "");
        setPassword(pwd || "");
        setRememberMe(true);
      } catch {
        setIdentifier("");
        setPassword("");
        setRememberMe(false);
      }
    } else {
      setIdentifier("");
      setPassword("");
      setRememberMe(false);
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const ok = login(identifier, password, role);
    setLoading(false);
    if (!ok) {
      if (isAdmin) {
        setError("Invalid Admin ID or Password.");
      } else {
        setError("Invalid email or password for the selected role.");
      }
      return;
    }
    if (rememberMe) {
      localStorage.setItem(
        REMEMBER_KEY(role),
        JSON.stringify({ id: identifier, pwd: password }),
      );
    } else {
      localStorage.removeItem(REMEMBER_KEY(role));
    }
    if (role === "admin") navigate("/admin");
    else if (role === "turfOwner") navigate("/owner");
    else navigate("/explore");
  };

  const fillDemo = () => {
    setIdentifier("user@turfmate.com");
    setPassword("user123");
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/assets/generated/login-bg.dim_1920x1080.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70" />

      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-green-400/5 rounded-full blur-2xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-dark neon-border rounded-3xl shadow-glass overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#061209] to-[#0d2612] px-8 pt-10 pb-8">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img
                src="/assets/generated/turfmate-icon-transparent.dim_200x200.png"
                alt="TurfMate"
                className="w-10 h-10 object-contain"
              />
              <span className="font-display font-bold text-xl text-white">
                Turf<span className="text-green-400">Mate</span>
              </span>
            </Link>
            <h1 className="font-display font-bold text-3xl text-white">
              Welcome back!
            </h1>
            <p className="text-green-300/70 mt-1">Sign in to your account</p>
          </div>

          <div className="px-8 py-6">
            {/* Role tabs */}
            <Tabs
              value={role}
              onValueChange={(v) => {
                setRole(v as UserRole);
                setError("");
              }}
            >
              <TabsList className="w-full mb-6 bg-white/5 border border-white/10">
                <TabsTrigger
                  value="user"
                  className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-neon-green text-white/60"
                  data-ocid="login.tab"
                >
                  User
                </TabsTrigger>
                <TabsTrigger
                  value="turfOwner"
                  className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-neon-green text-white/60"
                  data-ocid="login.tab"
                >
                  Turf Owner
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-neon-green text-white/60"
                  data-ocid="login.tab"
                >
                  Admin
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="identifier" className="text-green-300 text-sm">
                  {isAdmin ? "Admin ID" : "Email"}
                </Label>
                <Input
                  id="identifier"
                  type={isAdmin ? "text" : "email"}
                  placeholder={isAdmin ? "Enter Admin ID" : "you@example.com"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="mt-1 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-green-400/70 focus:ring-1 focus:ring-green-400/30"
                  autoComplete={isAdmin ? "username" : "email"}
                  data-ocid="login.input"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-green-300 text-sm">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-green-400/70 focus:ring-1 focus:ring-green-400/30"
                    data-ocid="login.input"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                    onClick={() => setShowPwd(!showPwd)}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                  data-ocid="login.checkbox"
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm text-green-300/70 cursor-pointer select-none"
                >
                  Remember Me
                </Label>
              </div>

              {error && (
                <div
                  className="flex items-center gap-2 bg-red-950/50 border border-red-500/30 text-red-300 rounded-lg p-3 text-sm"
                  data-ocid="login.error_state"
                >
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className={`w-full text-white font-semibold h-11 rounded-xl transition-all shadow-premium border-0 ${!loading ? "animate-pulse-glow" : ""}`}
                style={{
                  background: "linear-gradient(135deg, #16a34a, #059669)",
                }}
                disabled={loading}
                data-ocid="login.submit_button"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {role === "user" && (
              <button
                type="button"
                onClick={fillDemo}
                className="w-full text-center text-xs text-green-400/70 hover:text-green-300 mt-3 underline"
                data-ocid="login.secondary_button"
              >
                Fill demo credentials
              </button>
            )}

            {!isAdmin && (
              <p className="text-center text-sm text-white/50 mt-6">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-green-400 hover:text-green-300 font-medium"
                  data-ocid="login.link"
                >
                  Sign Up
                </Link>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
