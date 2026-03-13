import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Eye, EyeOff, Trophy } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.18_0.06_145)] to-[oklch(0.28_0.08_145)] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-[oklch(0.22_0.06_145)] px-8 pt-10 pb-8">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Trophy size={26} className="text-green-400" />
              <span className="font-display font-bold text-xl text-white">
                Turf<span className="text-green-400">Mate</span>
              </span>
            </Link>
            <h1 className="font-display font-bold text-3xl text-white">
              Create Account
            </h1>
            <p className="text-green-200 mt-1">
              Join TurfMate today — it's free!
            </p>
          </div>

          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Arjun Sharma"
                  value={form.fullName}
                  onChange={set("fullName")}
                  required
                  className="mt-1"
                  data-ocid="signup.input"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={set("phone")}
                  required
                  className="mt-1"
                  maxLength={10}
                  data-ocid="signup.input"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set("email")}
                  required
                  className="mt-1"
                  data-ocid="signup.input"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={set("password")}
                    required
                    data-ocid="signup.input"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
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
                            ? "bg-red-400"
                            : s === "medium" &&
                                (passwordStrength === "medium" ||
                                  passwordStrength === "strong")
                              ? "bg-yellow-400"
                              : s === "strong" && passwordStrength === "strong"
                                ? "bg-green-500"
                                : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="confirm">Confirm Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={set("confirmPassword")}
                    required
                    data-ocid="signup.input"
                  />
                  {form.confirmPassword &&
                    form.password === form.confirmPassword && (
                      <CheckCircle
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                      />
                    )}
                </div>
              </div>

              {error && (
                <div
                  className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm"
                  data-ocid="signup.error_state"
                >
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold h-11"
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

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-600 hover:underline font-medium"
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
