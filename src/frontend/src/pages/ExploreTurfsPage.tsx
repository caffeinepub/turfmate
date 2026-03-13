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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <div className="bg-[oklch(0.22_0.06_145)] text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display font-bold text-4xl mb-2"
            >
              Explore Turfs
            </motion.h1>
            <p className="text-green-200 mb-6">
              Find and book the perfect venue for your next match
            </p>
            <div className="relative max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Explore the Best Turf"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                data-ocid="explore.search_input"
              />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">
          {filtered.length === 0 ? (
            <div
              className="text-center py-20 text-muted-foreground"
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
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-border overflow-hidden"
                  data-ocid={`explore.item.${i + 1}`}
                >
                  <div className="relative h-48">
                    <img
                      src={turf.imageUrl}
                      alt={turf.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute top-3 right-3 bg-white/90 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">
                      ₹{turf.pricePerHour}/hr
                    </span>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs">
                      <span className="bg-green-500/90 px-2 py-0.5 rounded flex items-center gap-1">
                        {surfaceIcon(turf.surfaceType)}
                        {turf.surfaceType}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-xl mb-1">
                      {turf.name}
                    </h3>
                    <p className="text-muted-foreground text-sm flex items-center gap-1 mb-2">
                      <MapPin size={13} className="text-green-500" />
                      {turf.location}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {turf.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                      <Clock size={12} />
                      {turf.openTime} – {turf.closeTime}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {turf.facilities.slice(0, 3).map((f) => (
                        <Badge key={f} variant="secondary" className="text-xs">
                          {f}
                        </Badge>
                      ))}
                      {turf.facilities.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{turf.facilities.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link
                          to={`/turf/${turf.id}`}
                          data-ocid={"explore.secondary_button"}
                        >
                          Details
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-500 text-white"
                        onClick={() => navigate(`/book/${turf.id}`)}
                        data-ocid={"explore.primary_button"}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="bg-[oklch(0.15_0.05_145)] text-gray-400 py-6 text-center text-sm">
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
