import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, Clock, MapPin, Shield, Star, Zap } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <Navbar transparent />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-turf.dim_1920x1080.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

        {/* Animated grass lines decoration */}
        <div className="absolute inset-0 opacity-10">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="absolute h-full border-r border-green-400"
              style={{ left: `${(i + 1) * 12.5}%` }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-green-500/20 border border-green-400/50 text-green-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              🏟️ India's #1 Turf Booking Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl text-white leading-tight mb-6"
          >
            Play. <span className="text-green-400">Book.</span> Enjoy.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-200 text-lg sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto"
          >
            Find and book the best football turfs near you. Instant slots, fair
            prices, and amazing facilities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={handleExploreTurfs}
              className="bg-green-500 hover:bg-green-400 text-white font-semibold text-lg px-8 py-6 rounded-xl shadow-lg shadow-green-900/40 transition-all hover:scale-105"
              data-ocid="hero.primary_button"
            >
              Explore Turfs <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button
              size="lg"
              asChild
              variant="outline"
              className="border-white/50 text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 rounded-xl backdrop-blur-sm"
            >
              <Link to="/signup" data-ocid="hero.secondary_button">
                Register Now
              </Link>
            </Button>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto"
          >
            {[
              { n: `${turfs.length}+`, l: "Turfs" },
              { n: "500+", l: "Bookings" },
              { n: "3", l: "Cities" },
            ].map(({ n, l }) => (
              <div key={l} className="text-center">
                <div className="text-3xl font-display font-bold text-green-400">
                  {n}
                </div>
                <div className="text-gray-400 text-sm mt-1">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">
              Why TurfMate?
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground mt-2">
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
                className="bg-secondary/40 rounded-2xl p-6 hover:shadow-lg hover:shadow-green-100 transition-all hover:-translate-y-1 border border-border"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={22} className="text-green-600" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Turfs preview */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">
              Featured Venues
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground mt-2">
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
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 bg-white border border-border"
              >
                <div className="relative h-48">
                  <img
                    src={turf.imageUrl}
                    alt={turf.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-3 left-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                    {turf.surfaceType}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-bold text-lg">
                        {turf.name}
                      </h3>
                      <p className="text-muted-foreground text-sm flex items-center gap-1 mt-0.5">
                        <MapPin size={12} />
                        {turf.location}
                      </p>
                    </div>
                    <span className="text-green-700 font-bold text-sm">
                      ₹{turf.pricePerHour}/hr
                    </span>
                  </div>
                  <Button
                    className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleExploreTurfs}
                    data-ocid="landing.primary_button"
                  >
                    Book Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[oklch(0.22_0.06_145)] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Zap size={40} className="text-green-400 mx-auto mb-4" />
            <h2 className="font-display font-bold text-4xl mb-4">
              Ready to Hit the Turf?
            </h2>
            <p className="text-gray-300 mb-8">
              Join thousands of players booking turfs every day. Fast, easy, and
              secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-green-500 hover:bg-green-400 text-white font-semibold px-10"
              >
                <Link to="/signup" data-ocid="cta.primary_button">
                  Get Started Free
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
              >
                <Link to="/login" data-ocid="cta.secondary_button">
                  Sign In
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[oklch(0.15_0.05_145)] text-gray-400 py-8 text-center text-sm">
        <p>
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="text-green-400 hover:underline"
          >
            caffeine.ai
          </a>
        </p>
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
