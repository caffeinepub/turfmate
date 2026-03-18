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
      <div className="min-h-screen bg-[#060e07] flex items-center justify-center">
        <p className="text-white/50">Turf not found.</p>
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
    <div className="min-h-screen bg-[#060e07]">
      <Navbar />
      <main className="pt-16">
        {/* Hero image / slider */}
        <div className="relative h-80 sm:h-96 overflow-hidden">
          {allImages.length > 0 ? (
            allImages.map((img, i) => (
              <img
                key={`slide-${img.slice(-20)}`}
                src={img}
                alt={`${turf.name} ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  i === activeSlide ? "opacity-100" : "opacity-0"
                }`}
              />
            ))
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('/assets/generated/booking-bg.dim_1920x1080.jpg')",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors neon-border"
                data-ocid="detail.pagination_prev"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors neon-border"
                data-ocid="detail.pagination_next"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full border border-white/20">
                {activeSlide + 1} / {allImages.length}
              </div>
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5">
                {allImages.map((img, i) => (
                  <button
                    type="button"
                    key={`dot-${img.slice(-20)}`}
                    onClick={() => setActiveSlide(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === activeSlide ? "bg-green-400 w-6" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Turf name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
              {turf.name}
            </h1>
            <p className="text-green-300/80 flex items-center gap-1.5 mt-1">
              <MapPin size={15} />
              {turf.location}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main info */}
            <div className="lg:col-span-2 space-y-5">
              {/* Quick info */}
              <div className="glass-dark rounded-2xl border border-green-900/30 p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    {surfaceIcon}
                    <div>
                      <p className="text-white/40 text-xs">Surface</p>
                      <p className="text-white font-medium text-sm">
                        {turf.surfaceType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-green-400" />
                    <div>
                      <p className="text-white/40 text-xs">Hours</p>
                      <p className="text-white font-medium text-sm">
                        {turf.openTime} – {turf.closeTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-bold text-base">
                      ₹
                    </span>
                    <div>
                      <p className="text-white/40 text-xs">Day Rate</p>
                      <p className="text-green-400 font-display font-black text-lg">
                        {turf.pricePerHour}/hr
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {turf.description && (
                <div className="glass-dark rounded-2xl border border-green-900/30 p-5">
                  <h2 className="section-header-line font-display font-bold text-lg text-white mb-3">
                    About This Turf
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {turf.description}
                  </p>
                </div>
              )}

              {/* Facilities */}
              {turf.facilities.length > 0 && (
                <div className="glass-dark rounded-2xl border border-green-900/30 p-5">
                  <h2 className="section-header-line font-display font-bold text-lg text-white mb-3">
                    Facilities
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {turf.facilities.map((f) => (
                      <Badge
                        key={f}
                        className="bg-green-900/30 border border-green-700/40 text-green-300 hover:bg-green-900/50"
                      >
                        <CheckCircle size={12} className="mr-1" />
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Info */}
              {turf.safetyInfo && turf.safetyInfo.length > 0 && (
                <div className="glass-dark rounded-2xl border border-green-900/30 p-5">
                  <h2 className="section-header-line font-display font-bold text-lg text-white mb-3">
                    <Shield size={18} className="text-green-400 inline mr-1" />
                    Safety Information
                  </h2>
                  <ul className="space-y-2">
                    {turf.safetyInfo.map((s) => (
                      <li
                        key={s}
                        className="text-white/60 text-sm flex items-start gap-2"
                      >
                        <CheckCircle
                          size={14}
                          className="text-green-400 mt-0.5 flex-shrink-0"
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Booking card */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 glass-dark neon-border rounded-2xl p-5">
                <h2 className="font-display font-bold text-xl text-white mb-4">
                  Book This Turf
                </h2>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm">Day Rate</span>
                    <span className="text-green-400 font-display font-black text-2xl">
                      ₹{turf.pricePerHour}
                      <span className="text-sm font-normal text-white/40">
                        /hr
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm">Night Rate</span>
                    <span className="text-white font-bold text-lg">
                      ₹{turf.nightPricePerHour}/hr
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm">Advance</span>
                    <span className="text-amber-400 font-semibold">
                      ₹{turf.advanceAmount}
                    </span>
                  </div>
                </div>

                {currentUser ? (
                  <button
                    type="button"
                    className="btn-premium w-full"
                    onClick={() => navigate(`/book/${turf.id}`)}
                    data-ocid="detail.primary_button"
                  >
                    Book Now →
                  </button>
                ) : (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate("/login")}
                    data-ocid="detail.primary_button"
                  >
                    Login to Book
                  </Button>
                )}

                <p className="text-center text-xs text-white/30 mt-3">
                  {turf.openTime} – {turf.closeTime}
                </p>
              </div>
            </div>
          </div>
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
