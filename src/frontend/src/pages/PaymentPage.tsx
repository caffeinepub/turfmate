import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      {/* Outer border */}
      <rect
        x="5"
        y="5"
        width="170"
        height="170"
        fill="none"
        stroke="#16a34a"
        strokeWidth="4"
      />
      {/* Top-left finder */}
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
      {/* Top-right finder */}
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
      {/* Bottom-left finder */}
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
      {/* Data modules (simplified pattern) */}
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
      {/* Amount text */}
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h1 className="font-display font-bold text-3xl">
                Complete Payment
              </h1>
              <p className="text-muted-foreground mt-1">
                Scan QR and click confirm after payment
              </p>
            </div>

            {/* Booking summary */}
            <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
              <h2 className="font-display font-bold text-lg mb-4">
                Booking Summary
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <MapPin size={13} />
                    Turf
                  </span>
                  <span className="font-semibold">{state.turfName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar size={13} />
                    Date
                  </span>
                  <span className="font-semibold">{state.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Clock size={13} />
                    Slots
                  </span>
                  <span className="font-semibold text-right max-w-[60%]">
                    {state.slotLabels.join(", ")}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Price</span>
                    <span className="font-bold">₹{state.totalPrice}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-muted-foreground">Payment Mode</span>
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
            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm text-center">
              <h2 className="font-display font-bold text-lg mb-2">
                Scan to Pay
              </h2>
              <p className="text-3xl font-bold text-green-600 mb-4">
                ₹{payAmount}
              </p>
              <div className="flex justify-center mb-3">
                {state.qrCodeUrl ? (
                  <img
                    src={state.qrCodeUrl}
                    alt="QR Code"
                    className="w-44 h-44 object-contain"
                  />
                ) : (
                  <QRCodeSVG amount={payAmount} />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                UPI / Any Payment App
              </p>
              <p className="text-xs text-green-600 font-medium mt-1">
                TurfMate Demo Payment
              </p>
            </div>

            {/* Pay button */}
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full h-14 text-base font-bold bg-green-600 hover:bg-green-500 text-white rounded-2xl shadow-lg"
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
                    {isFullPayment ? "Pay Full Amount" : "I Have Paid Advance"}
                  </span>
                )}
              </Button>
            </motion.div>

            <p className="text-center text-xs text-muted-foreground">
              🔒 Demo project — no real payment is processed
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
