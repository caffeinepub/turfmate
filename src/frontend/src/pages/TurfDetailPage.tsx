import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  Leaf,
  MapPin,
  Shield,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";

export default function TurfDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { turfs, currentUser } = useApp();
  const navigate = useNavigate();
  const turf = turfs.find((t) => t.id === id);
  const [activeSlide, setActiveSlide] = useState(0);

  if (!turf)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Turf not found.</p>
      </div>
    );

  const allImages = [turf.imageUrl, ...(turf.galleryImages || [])].filter(
    Boolean,
  );

  const prevSlide = () =>
    setActiveSlide((s) => (s - 1 + allImages.length) % allImages.length);
  const nextSlide = () => setActiveSlide((s) => (s + 1) % allImages.length);

  const surfaceIcon =
    turf.surfaceType === "Artificial Grass" ? (
      <Zap size={16} />
    ) : turf.surfaceType === "Natural Grass" ? (
      <Leaf size={16} />
    ) : (
      <Layers size={16} />
    );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero image / slider */}
        <div className="relative h-80 sm:h-96 overflow-hidden">
          {allImages.map((img, i) => (
            <img
              key={`slide-${img.slice(-20)}`}
              src={img}
              alt={`${turf.name} ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                i === activeSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Prev/Next buttons */}
          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                data-ocid="detail.pagination_prev"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                data-ocid="detail.pagination_next"
              >
                <ChevronRight size={20} />
              </button>

              {/* Counter badge */}
              <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                {activeSlide + 1} / {allImages.length}
              </div>

              {/* Dot indicators */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5">
                {allImages.map((img, i) => (
                  <button
                    type="button"
                    key={`dot-${img.slice(-20)}`}
                    onClick={() => setActiveSlide(i)}
                    className={`h-1.5 rounded-full transition-all bg-white ${
                      i === activeSlide ? "w-4 opacity-100" : "w-2 opacity-50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Title overlay */}
          <div className="absolute bottom-6 left-6">
            <Badge className="bg-green-500 text-white mb-2 flex items-center gap-1 w-fit">
              {surfaceIcon}
              {turf.surfaceType}
            </Badge>
            <h1 className="font-display font-bold text-4xl text-white">
              {turf.name}
            </h1>
            <p className="text-gray-200 flex items-center gap-1 mt-1">
              <MapPin size={14} />
              {turf.location}
            </p>
          </div>
        </div>

        {/* Thumbnail strip */}
        {allImages.length > 1 && (
          <div className="bg-black/80 px-4 py-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-5xl mx-auto">
              {allImages.map((img, i) => (
                <button
                  type="button"
                  key={`thumb-${img.slice(-20)}`}
                  onClick={() => setActiveSlide(i)}
                  className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all ${
                    i === activeSlide
                      ? "border-green-500 opacity-100"
                      : "border-transparent opacity-60 hover:opacity-80"
                  }`}
                  data-ocid={`detail.item.${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Operating hours */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-5 border border-border shadow-sm"
              >
                <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-green-500" />
                  Operating Hours
                </h2>
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Opens
                    </p>
                    <p className="font-semibold text-green-700 text-lg">
                      {turf.openTime}
                    </p>
                  </div>
                  <div className="border-l border-border pl-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Closes
                    </p>
                    <p className="font-semibold text-green-700 text-lg">
                      {turf.closeTime}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-5 border border-border shadow-sm"
              >
                <h2 className="font-display font-bold text-xl mb-3">
                  About this Turf
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {turf.description}
                </p>
              </motion.div>

              {/* Facilities */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl p-5 border border-border shadow-sm"
              >
                <h2 className="font-display font-bold text-xl mb-4">
                  Facilities
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {turf.facilities.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle
                        size={16}
                        className="text-green-500 flex-shrink-0"
                      />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Safety */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-5 border border-border shadow-sm"
              >
                <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-green-500" />
                  Safety Information
                </h2>
                <ul className="space-y-2">
                  {turf.safetyInfo.map((info) => (
                    <li key={info} className="flex items-start gap-2 text-sm">
                      <Shield
                        size={14}
                        className="text-green-500 flex-shrink-0 mt-0.5"
                      />
                      <span>{info}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Booking panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl p-5 border border-border shadow-md"
                >
                  <h2 className="font-display font-bold text-xl mb-4">
                    Pricing
                  </h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center p-3 bg-secondary/40 rounded-xl">
                      <span className="text-sm font-medium">
                        Day Rate (before 6PM)
                      </span>
                      <span className="font-bold text-green-700">
                        ₹{turf.pricePerHour}/hr
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary/40 rounded-xl">
                      <span className="text-sm font-medium flex items-center gap-1">
                        🌙 Night Rate (after 6PM)
                      </span>
                      <span className="font-bold text-green-700">
                        ₹{turf.nightPricePerHour}/hr
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-xl">
                      <span className="text-sm font-medium">
                        Advance Amount
                      </span>
                      <span className="font-bold text-green-700">
                        ₹{turf.advanceAmount}
                      </span>
                    </div>
                  </div>

                  {currentUser?.role === "user" && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold h-12 text-base"
                      onClick={() => navigate(`/book/${turf.id}`)}
                      data-ocid="detail.primary_button"
                    >
                      Book Now
                    </Button>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-[oklch(0.15_0.05_145)] text-gray-400 py-6 text-center text-sm mt-10">
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
