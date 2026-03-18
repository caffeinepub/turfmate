import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, Hash, Home, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import type { Booking } from "../types";

export default function BookingConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking as Booking | undefined;

  if (!booking) {
    navigate("/");
    return null;
  }

  const statusMap = {
    advancePaid: { label: "Advance Paid", cls: "bg-amber-500" },
    remainingPending: { label: "Remaining Pending", cls: "bg-orange-500" },
    fullyPaid: { label: "Fully Paid", cls: "bg-green-600" },
  };
  const statusInfo = statusMap[booking.paymentStatus];

  return (
    <div className="min-h-screen bg-[#060e07]">
      <Navbar />
      {/* Radial glow behind card */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(74,222,128,0.06) 0%, transparent 70%)",
        }}
      />
      <main className="pt-20 pb-12 relative z-10">
        <div className="max-w-lg mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="text-center mb-8"
          >
            <div className="relative flex justify-center mb-4">
              {/* Glow rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full border border-green-400/20 animate-ping" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-green-400/30" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="relative w-20 h-20 rounded-full flex items-center justify-center neon-glow"
                style={{ background: "rgba(74,222,128,0.15)" }}
              >
                <CheckCircle size={40} className="text-green-400" />
              </motion.div>
            </div>
            <h1 className="font-display font-bold text-3xl text-green-400 neon-text">
              Turf Booked!
            </h1>
            <p className="text-white/50 mt-2">
              Your Turf Is Booked Successfully 🎉
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-dark neon-border rounded-3xl p-8 shadow-glass space-y-4"
          >
            <h2 className="section-header-line font-display font-bold text-xl text-white">
              Booking Details
            </h2>

            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-white/50 flex items-center gap-1.5">
                  <Hash size={14} />
                  Booking ID
                </span>
                <span className="font-mono font-bold text-xs text-green-400">
                  {booking.id}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-white/50 flex items-center gap-1.5">
                  <MapPin size={14} />
                  Turf
                </span>
                <span className="font-semibold text-white">
                  {booking.turfName}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-white/50 flex items-center gap-1.5">
                  <Calendar size={14} />
                  Date
                </span>
                <span className="font-semibold text-white">{booking.date}</span>
              </div>
              <div className="flex items-start justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-white/50 flex items-center gap-1.5">
                  <Clock size={14} />
                  Slots
                </span>
                <span className="font-semibold text-white text-right text-xs">
                  {booking.slotLabels.join(", ")}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-white/50">Total Amount</span>
                <span className="font-bold text-green-400">
                  ₹{booking.totalPrice}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-white/50">Payment Status</span>
                <Badge className={`${statusInfo.cls} text-white`}>
                  {statusInfo.label}
                </Badge>
              </div>
              {booking.paymentStatus !== "fullyPaid" && (
                <div className="flex items-center justify-between p-3 bg-amber-900/20 border border-amber-700/30 rounded-xl">
                  <span className="text-amber-400/80 text-xs">
                    Remaining Balance
                  </span>
                  <span className="font-bold text-amber-400">
                    ₹{booking.remainingAmount}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3 mt-6"
          >
            <button
              type="button"
              className="btn-premium flex-1 h-11"
              onClick={() => navigate("/")}
              data-ocid="confirmation.primary_button"
            >
              <Home size={16} className="mr-2" />
              Go To Home
            </button>
            <button
              type="button"
              className="flex-1 h-11 border border-green-700/40 text-green-300 hover:bg-green-900/20 font-semibold text-sm rounded-xl transition-all"
              onClick={() => navigate("/dashboard")}
              data-ocid="confirmation.secondary_button"
            >
              View My Bookings
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
