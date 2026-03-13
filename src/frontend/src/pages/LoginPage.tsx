import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Eye, EyeOff, Trophy } from "lucide-react";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Pre-fill email when role changes if remember was set
  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY(role));
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    } else {
      setEmail("");
      setRememberMe(false);
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const ok = login(email, password, role);
    setLoading(false);
    if (!ok) {
      setError("Invalid email or password for the selected role.");
      return;
    }
    // Save or clear remember-me
    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY(role), email);
    } else {
      localStorage.removeItem(REMEMBER_KEY(role));
    }
    if (role === "admin") navigate("/admin");
    else if (role === "turfOwner") navigate("/owner");
    else navigate("/explore");
  };

  const roleDemos: Record<UserRole, { email: string; password: string }> = {
    admin: { email: "admin@turfmate.com", password: "admin123" },
    turfOwner: { email: "owner1@turfmate.com", password: "owner123" },
    user: { email: "user@turfmate.com", password: "user123" },
  };

  const fillDemo = () => {
    setEmail(roleDemos[role].email);
    setPassword(roleDemos[role].password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.18_0.06_145)] to-[oklch(0.28_0.08_145)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[oklch(0.22_0.06_145)] px-8 pt-10 pb-8">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Trophy size={26} className="text-green-400" />
              <span className="font-display font-bold text-xl text-white">
                Turf<span className="text-green-400">Mate</span>
              </span>
            </Link>
            <h1 className="font-display font-bold text-3xl text-white">
              Welcome back!
            </h1>
            <p className="text-green-200 mt-1">Sign in to your account</p>
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
              <TabsList className="w-full mb-6 bg-muted">
                <TabsTrigger
                  value="user"
                  className="flex-1"
                  data-ocid="login.tab"
                >
                  User
                </TabsTrigger>
                <TabsTrigger
                  value="turfOwner"
                  className="flex-1"
                  data-ocid="login.tab"
                >
                  Turf Owner
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="flex-1"
                  data-ocid="login.tab"
                >
                  Admin
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                  data-ocid="login.input"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    data-ocid="login.input"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPwd(!showPwd)}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                  data-ocid="login.checkbox"
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm text-muted-foreground cursor-pointer select-none"
                >
                  Remember Me
                </Label>
              </div>

              {error && (
                <div
                  className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm"
                  data-ocid="login.error_state"
                >
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold h-11"
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

            <button
              type="button"
              onClick={fillDemo}
              className="w-full text-center text-xs text-green-600 hover:text-green-800 mt-3 underline"
              data-ocid="login.secondary_button"
            >
              Fill demo credentials for {role}
            </button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-green-600 hover:underline font-medium"
                data-ocid="login.link"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
