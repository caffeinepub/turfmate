import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Leaf, MapPin, Search, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";

export default function ExploreTurfsPage() {
  const { turfs } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = turfs.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase()),
  );

  const surfaceIcon = (s: string) => {
    if (s === "Artificial Grass") return <Zap size={12} />;
    if (s === "Natural Grass") return <Leaf size={12} />;
    return <MapPin size={12} />;
  };

  return (
    <div className="min-h-screen bg-[#060e07]">
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <div
          className="relative text-white py-20 px-4 overflow-hidden"
          style={{
            backgroundImage:
              "url('/assets/generated/explore-header-bg.dim_1920x400.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-black/60" />
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="section-header-line">
                <h1 className="font-display font-bold text-4xl text-white neon-text flex items-center gap-3">
                  <Search size={28} className="text-green-400" />
                  Explore Turfs
                </h1>
              </div>
              <p className="text-green-200/70 mt-2 ml-5">
                Find and book the perfect venue for your next match
              </p>
            </motion.div>
            <div className="glass-dark rounded-2xl border border-green-500/30 focus-within:border-green-400/60 focus-within:shadow-neon-green p-4 max-w-md transition-all duration-300">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400/60"
                />
                <Input
                  placeholder="Explore the Best Turf"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-transparent border-0 text-white placeholder:text-white/40 focus:ring-0 focus-visible:ring-0"
                  data-ocid="explore.search_input"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">
          {filtered.length === 0 ? (
            <div
              className="glass-dark rounded-2xl text-center py-16 text-white/50"
              data-ocid="explore.empty_state"
            >
              <MapPin size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">
                No turfs found for "{search}"
              </p>
              <p className="text-sm">Try a different search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((turf, i) => (
                <motion.div
                  key={turf.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-[#0a1a0c] border border-green-900/30 hover:border-green-400/40 hover:shadow-neon-green hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden"
                  data-ocid={`explore.item.${i + 1}`}
                >
                  <div className="relative h-48">
                    <img
                      src={turf.imageUrl}
                      alt={turf.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span
                      className="absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #15803d, #059669)",
                        boxShadow: "0 4px 24px rgba(22,163,74,0.4)",
                      }}
                    >
                      ₹{turf.pricePerHour}/hr
                    </span>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs">
                      <span className="bg-green-600/90 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                        {surfaceIcon(turf.surfaceType)}
                        {turf.surfaceType}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-xl text-white mb-1">
                      {turf.name}
                    </h3>
                    <p className="text-green-300/70 text-sm flex items-center gap-1 mb-2">
                      <MapPin size={13} className="text-green-400" />
                      {turf.location}
                    </p>
                    <p className="text-sm text-white/50 line-clamp-2 mb-3">
                      {turf.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-green-300/60 mb-4">
                      <Clock size={12} />
                      {turf.openTime} – {turf.closeTime}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {turf.facilities.slice(0, 3).map((f) => (
                        <Badge
                          key={f}
                          variant="secondary"
                          className="text-xs bg-green-900/30 border border-green-700/40 text-green-300"
                        >
                          {f}
                        </Badge>
                      ))}
                      {turf.facilities.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-900/30 border border-green-700/40 text-green-300"
                        >
                          +{turf.facilities.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-green-700/40 text-green-300 hover:bg-green-900/30 bg-transparent"
                        asChild
                      >
                        <Link
                          to={`/turf/${turf.id}`}
                          data-ocid={"explore.secondary_button"}
                        >
                          Details
                        </Link>
                      </Button>
                      <button
                        type="button"
                        className="btn-premium flex-1 h-9 text-sm px-4"
                        onClick={() => navigate(`/book/${turf.id}`)}
                        data-ocid={"explore.primary_button"}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="bg-[#030806] text-gray-400 py-6 text-center text-sm border-t border-green-900/20">
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
    </div>
  );
}
