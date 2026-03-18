import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";

function QRCodeSVG({ amount }: { amount: number }) {
  return (
    <svg
      width="180"
      height="180"
      viewBox="0 0 180 180"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="UPI Payment QR Code"
    >
      <title>UPI Payment QR Code</title>
      <rect width="180" height="180" fill="white" />
      <rect
        x="5"
        y="5"
        width="170"
        height="170"
        fill="none"
        stroke="#16a34a"
        strokeWidth="4"
      />
      <rect
        x="15"
        y="15"
        width="45"
        height="45"
        fill="none"
        stroke="#111"
        strokeWidth="3"
      />
      <rect x="23" y="23" width="29" height="29" fill="#111" />
      <rect x="29" y="29" width="17" height="17" fill="white" />
      <rect x="33" y="33" width="9" height="9" fill="#111" />
      <rect
        x="120"
        y="15"
        width="45"
        height="45"
        fill="none"
        stroke="#111"
        strokeWidth="3"
      />
      <rect x="128" y="23" width="29" height="29" fill="#111" />
      <rect x="134" y="29" width="17" height="17" fill="white" />
      <rect x="138" y="33" width="9" height="9" fill="#111" />
      <rect
        x="15"
        y="120"
        width="45"
        height="45"
        fill="none"
        stroke="#111"
        strokeWidth="3"
      />
      <rect x="23" y="128" width="29" height="29" fill="#111" />
      <rect x="29" y="134" width="17" height="17" fill="white" />
      <rect x="33" y="138" width="9" height="9" fill="#111" />
      {[70, 77, 84, 91, 98, 105, 112].map((x, i) =>
        [70, 77, 84, 91, 98, 105, 112].map((y, j) =>
          (i + j) % 2 === 0 ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="5"
              height="5"
              fill="#111"
            />
          ) : null,
        ),
      )}
      {[70, 84, 98, 112].map((x) =>
        [15, 22, 29, 36, 43, 50, 57].map((y) => (
          <rect
            key={`v-${x}-${y}`}
            x={x}
            y={y}
            width="5"
            height="5"
            fill="#111"
          />
        )),
      )}
      <text
        x="90"
        y="165"
        textAnchor="middle"
        fontSize="10"
        fill="#16a34a"
        fontWeight="bold"
      >
        ₹{amount} UPI
      </text>
    </svg>
  );
}

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { createBooking, currentUser } = useApp();
  const [loading, setLoading] = useState(false);
  const state = location.state as {
    turfId: string;
    turfName: string;
    date: string;
    slotIds: string[];
    slotLabels: string[];
    totalPrice: number;
    advanceAmount: number;
    remainingAmount: number;
    paymentType: string;
    userName: string;
    phone: string;
    emergencyContact: string;
    qrCodeUrl?: string;
  } | null;

  if (!state) {
    navigate("/explore");
    return null;
  }

  const payAmount =
    state.paymentType === "full" ? state.totalPrice : state.advanceAmount;
  const isFullPayment = state.paymentType === "full";

  const handlePaid = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const booking = createBooking({
      userId: currentUser!.id,
      turfId: state.turfId,
      turfName: state.turfName,
      slotIds: state.slotIds,
      slotLabels: state.slotLabels,
      date: state.date,
      totalPrice: state.totalPrice,
      advanceAmount: state.advanceAmount,
      remainingAmount: isFullPayment ? 0 : state.remainingAmount,
      paymentType: state.paymentType as "advance" | "full",
      paymentStatus: isFullPayment ? "fullyPaid" : "advancePaid",
      userName: state.userName,
      phone: state.phone,
      emergencyContact: state.emergencyContact,
    });
    setLoading(false);
    navigate("/confirmation", { state: { booking } });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage:
          "url('/assets/generated/payment-bg.dim_1920x1080.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="min-h-screen bg-black/80">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-2xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="glass-dark neon-border rounded-2xl p-6 text-center">
                <h1 className="font-display font-bold text-3xl text-white">
                  Complete Payment
                </h1>
                <p className="text-green-300/70 mt-1">
                  Scan QR and click confirm after payment
                </p>
              </div>

              {/* Booking summary */}
              <div className="glass-dark rounded-2xl p-5 border border-green-900/30">
                <h2 className="section-header-line font-display font-bold text-lg text-white mb-4">
                  Booking Summary
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50 flex items-center gap-1.5">
                      <MapPin size={13} />
                      Turf
                    </span>
                    <span className="font-semibold text-white">
                      {state.turfName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 flex items-center gap-1.5">
                      <Calendar size={13} />
                      Date
                    </span>
                    <span className="font-semibold text-white">
                      {state.date}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 flex items-center gap-1.5">
                      <Clock size={13} />
                      Slots
                    </span>
                    <span className="font-semibold text-white text-right max-w-[60%]">
                      {state.slotLabels.join(", ")}
                    </span>
                  </div>
                  <div className="border-t border-green-900/30 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-white/50">Total Price</span>
                      <span className="font-bold text-white">
                        ₹{state.totalPrice}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-white/50">Payment Mode</span>
                      <Badge
                        className={
                          isFullPayment ? "bg-green-600" : "bg-amber-500"
                        }
                      >
                        {isFullPayment ? "Full Payment" : "Advance Payment"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR code */}
              <div className="glass-dark neon-border animate-pulse-glow rounded-2xl p-6 text-center">
                <h2 className="section-header-line font-display font-bold text-lg text-white mb-2 justify-center">
                  Scan to Pay
                </h2>
                <p className="text-green-400 font-display font-black text-3xl mb-4">
                  ₹{payAmount}
                </p>
                <div className="flex justify-center mb-3">
                  {state.qrCodeUrl ? (
                    <img
                      src={state.qrCodeUrl}
                      alt="QR Code"
                      className="w-44 h-44 object-contain rounded-xl border-2 border-green-400/50 shadow-neon-green"
                    />
                  ) : (
                    <div className="rounded-xl border-2 border-green-400/50 shadow-neon-green overflow-hidden">
                      <QRCodeSVG amount={payAmount} />
                    </div>
                  )}
                </div>
                <p className="text-xs text-white/40">UPI / Any Payment App</p>
                <p className="text-xs text-green-400/70 font-medium mt-1">
                  TurfMate Demo Payment
                </p>
              </div>

              {/* Pay button */}
              <motion.div whileTap={{ scale: 0.98 }}>
                <button
                  type="button"
                  className="btn-premium w-full h-14 text-base"
                  onClick={handlePaid}
                  disabled={loading}
                  data-ocid="payment.primary_button"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle size={20} />
                      {isFullPayment
                        ? "Pay Full Amount"
                        : "I Have Paid Advance"}
                    </span>
                  )}
                </button>
              </motion.div>

              <p className="text-center text-xs text-white/30">
                🔒 Demo project — no real payment is processed
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
