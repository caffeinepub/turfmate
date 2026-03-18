import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  Clock,
  MapPin,
  Shield,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";

export default function LandingPage() {
  const { currentUser, turfs } = useApp();
  const navigate = useNavigate();
  const [authModal, setAuthModal] = useState(false);

  const handleExploreTurfs = () => {
    if (!currentUser) {
      setAuthModal(true);
      return;
    }
    navigate("/explore");
  };

  const features = [
    {
      icon: MapPin,
      title: "Find Nearby Turfs",
      desc: "Discover the best turfs in your city with detailed info and photos.",
    },
    {
      icon: Clock,
      title: "Instant Booking",
      desc: "Select your time slots and confirm your booking in seconds.",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      desc: "All turfs are verified with CCTV, first-aid kits and safety protocols.",
    },
    {
      icon: Star,
      title: "Top-Rated Venues",
      desc: "Browse only the highest-rated, well-maintained turf facilities.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#060e07]">
      <Navbar transparent />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage:
              "url('/assets/generated/turf-hero-bg.dim_1920x1080.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/85" />

        {/* Turf grid lines */}
        <div className="absolute inset-0 opacity-[0.07]">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="absolute h-full border-r border-green-300"
              style={{ left: `${(i + 1) * 12.5}%` }}
            />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute w-full border-b border-green-300"
              style={{ top: `${(i + 1) * 20}%` }}
            />
          ))}
        </div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Logo badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="relative flex items-center gap-3 bg-black/40 border border-green-400/40 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl shadow-green-900/30">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/30 rounded-full blur-md" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <Trophy size={22} strokeWidth={2.5} className="text-white" />
                </div>
              </div>
              <div className="text-left">
                <span className="font-display font-black text-2xl text-white tracking-tight">
                  Turf<span className="text-green-400">Mate</span>
                </span>
                <div className="text-[10px] text-green-300/80 uppercase tracking-[0.2em] font-medium -mt-0.5">
                  Find Best Turf In Kolhapur
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="font-display font-black leading-none mb-6"
            style={{ fontSize: "clamp(3rem, 10vw, 7.5rem)" }}
          >
            <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Play
            </span>
            <span className="text-white/50 font-thin">.</span>
            <span
              className="inline-block mx-1"
              style={{
                background:
                  "linear-gradient(135deg, #4ade80, #22d3ee, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 20px rgba(74,222,128,0.5))",
              }}
            >
              Book
            </span>
            <span className="text-white/50 font-thin">.</span>
            <span
              className="inline-block ml-1"
              style={{
                background:
                  "linear-gradient(135deg, #fbbf24, #f97316, #ef4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 20px rgba(251,191,36,0.5))",
              }}
            >
              Enjoy
            </span>
            <span className="text-white/50 font-thin">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-gray-200 text-xl sm:text-2xl font-medium mb-3 max-w-2xl mx-auto"
          >
            Find & Book the Best Turf Near You
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {[
              { emoji: "⚡", text: "Instant Slot Booking" },
              { emoji: "📍", text: "Turfs Near You" },
              { emoji: "🏆", text: "Top-Rated Venues" },
              { emoji: "💰", text: "Best Prices" },
            ].map(({ emoji, text }) => (
              <span
                key={text}
                className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm px-4 py-1.5 rounded-full"
              >
                <span>{emoji}</span>
                <span className="font-medium">{text}</span>
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={handleExploreTurfs}
              className="relative group overflow-hidden text-white font-bold text-lg px-10 py-7 rounded-2xl shadow-2xl shadow-green-900/60 transition-all hover:scale-105 border-0 animate-pulse-glow"
              style={{
                background:
                  "linear-gradient(135deg, #16a34a, #059669, #0d9488)",
              }}
              data-ocid="hero.primary_button"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                🏟️ Explore Turfs
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </Button>
            <Button
              size="lg"
              asChild
              variant="outline"
              className="border-2 border-white/40 text-white hover:bg-white/15 font-semibold text-lg px-10 py-7 rounded-2xl backdrop-blur-sm transition-all hover:scale-105 hover:border-white/70"
            >
              <Link to="/signup" data-ocid="hero.secondary_button">
                Register Free
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {[
              { n: `${turfs.length || 10}+`, l: "Turfs Listed", emoji: "🏟️" },
              { n: "500+", l: "Slots Booked", emoji: "📅" },
              { n: "3+", l: "Cities", emoji: "🌆" },
            ].map(({ n, l, emoji }) => (
              <div
                key={l}
                className="text-center glass-card neon-border rounded-2xl py-4 px-3"
              >
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="text-3xl font-display font-black text-green-400 neon-text">
                  {n}
                </div>
                <div className="text-gray-400 text-xs mt-1 font-medium">
                  {l}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/30 uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-green-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-[#070f09]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-green-400 font-semibold text-sm uppercase tracking-widest">
              Why TurfMate?
            </span>
            <h2 className="font-display font-bold text-4xl text-white mt-2">
              Everything You Need to Play
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0d1f10] border border-green-900/30 hover:border-green-500/40 hover:shadow-neon-green rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={22} className="text-green-400" />
                </div>
                <h3 className="font-display font-bold text-lg text-green-100 mb-2">
                  {title}
                </h3>
                <p className="text-green-200/60 text-sm leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Turfs preview */}
      <section className="py-20 px-4 bg-[#060e07]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-green-400 font-semibold text-sm uppercase tracking-widest">
              Featured Venues
            </span>
            <h2 className="font-display font-bold text-4xl text-white mt-2">
              Top Turfs Near You
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {turfs.slice(0, 3).map((turf, i) => (
              <motion.div
                key={turf.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0a1a0c] border border-green-900/30 hover:border-green-400/40 hover:shadow-neon-green rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <img
                    src={turf.imageUrl}
                    alt={turf.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute bottom-3 left-3 bg-green-600/90 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                    {turf.surfaceType}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">
                        {turf.name}
                      </h3>
                      <p className="text-green-300/70 text-sm flex items-center gap-1 mt-0.5">
                        <MapPin size={12} />
                        {turf.location}
                      </p>
                    </div>
                    <span className="text-green-400 font-bold text-sm">
                      ₹{turf.pricePerHour}/hr
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-premium w-full mt-3 text-sm h-10"
                    onClick={handleExploreTurfs}
                    data-ocid="landing.primary_button"
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative py-24 px-4 text-white overflow-hidden"
        style={{
          backgroundImage:
            "url('/assets/generated/tournament-bg.dim_1920x600.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#061209]/85" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Zap size={40} className="text-green-400 mx-auto mb-4 neon-glow" />
            <h2 className="font-display font-bold text-4xl mb-4">
              Ready to Hit the Turf?
            </h2>
            <p className="text-gray-300 mb-8">
              Join thousands of players booking turfs every day. Fast, easy, and
              secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn-premium px-10 py-3 rounded-2xl text-base"
                data-ocid="cta.primary_button"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="border border-green-500/50 text-green-400 hover:bg-green-500/10 font-semibold text-base px-10 py-3 rounded-2xl transition-all"
                data-ocid="cta.secondary_button"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#030806] text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 justify-between items-start mb-8">
            <div>
              <img
                src="/assets/generated/turfmate-logo-premium-transparent.dim_400x120.png"
                alt="TurfMate"
                className="h-10 w-auto object-contain mb-3 opacity-80"
              />
              <p className="text-sm text-gray-500 max-w-xs">
                India's #1 platform for finding and booking football turfs near
                you.
              </p>
            </div>
            <div className="flex gap-12">
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">
                  Quick Links
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleExploreTurfs}
                    className="text-sm text-gray-400 hover:text-green-400 transition-colors text-left"
                  >
                    Explore Turfs
                  </button>
                  <Link
                    to="/login"
                    className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-green-900/20 pt-6 text-center text-sm">
            <p>
              © {new Date().getFullYear()} TurfMate. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noreferrer"
                className="text-green-400 hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Auth modal */}
      <Dialog open={authModal} onOpenChange={setAuthModal}>
        <DialogContent data-ocid="auth.dialog">
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              You must sign in to explore and book turfs.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button
              asChild
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => setAuthModal(false)}
            >
              <Link to="/login" data-ocid="auth.primary_button">
                Login
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1"
              onClick={() => setAuthModal(false)}
            >
              <Link to="/signup" data-ocid="auth.secondary_button">
                Sign Up
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
