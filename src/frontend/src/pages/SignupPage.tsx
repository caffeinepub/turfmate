import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function SignupPage() {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone must be 10 digits.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const ok = signup(form.fullName, form.phone, form.email, form.password);
    setLoading(false);
    if (!ok) {
      setError("Email already registered.");
      return;
    }
    navigate("/explore");
  };

  const passwordStrength =
    form.password.length >= 8
      ? "strong"
      : form.password.length >= 6
        ? "medium"
        : "weak";

  return (
    <div
      className="min-h-screen relative flex items-center justify-center px-4 py-10"
      style={{
        backgroundImage: "url('/assets/generated/login-bg.dim_1920x1080.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70" />

      {/* Decorative orbs */}
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-green-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-dark neon-border rounded-3xl shadow-glass overflow-hidden">
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
              Create Account
            </h1>
            <p className="text-green-300/70 mt-1">
              Join TurfMate today — it's free!
            </p>
          </div>

          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-green-300 text-sm">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="Arjun Sharma"
                  value={form.fullName}
                  onChange={set("fullName")}
                  required
                  className="mt-1 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-green-400/70"
                  data-ocid="signup.input"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-green-300 text-sm">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={set("phone")}
                  required
                  className="mt-1 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-green-400/70"
                  maxLength={10}
                  data-ocid="signup.input"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-green-300 text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set("email")}
                  required
                  className="mt-1 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-green-400/70"
                  data-ocid="signup.input"
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
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={set("password")}
                    required
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-green-400/70"
                    data-ocid="signup.input"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                    onClick={() => setShowPwd(!showPwd)}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && (
                  <div className="flex gap-1 mt-1.5">
                    {["weak", "medium", "strong"].map((s) => (
                      <div
                        key={s}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          s === "weak"
                            ? "bg-red-500"
                            : s === "medium" &&
                                (passwordStrength === "medium" ||
                                  passwordStrength === "strong")
                              ? "bg-yellow-400"
                              : s === "strong" && passwordStrength === "strong"
                                ? "bg-green-500"
                                : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="confirm" className="text-green-300 text-sm">
                  Confirm Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={set("confirmPassword")}
                    required
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-green-400/70"
                    data-ocid="signup.input"
                  />
                  {form.confirmPassword &&
                    form.password === form.confirmPassword && (
                      <CheckCircle
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400"
                      />
                    )}
                </div>
              </div>

              {error && (
                <div
                  className="flex items-center gap-2 bg-red-950/50 border border-red-500/30 text-red-300 rounded-lg p-3 text-sm"
                  data-ocid="signup.error_state"
                >
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full text-white font-semibold h-11 rounded-xl transition-all shadow-premium border-0"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #059669)",
                }}
                disabled={loading}
                data-ocid="signup.submit_button"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-white/50 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-400 hover:text-green-300 font-medium"
                data-ocid="signup.link"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
