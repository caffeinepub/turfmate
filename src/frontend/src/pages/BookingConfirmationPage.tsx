import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-lg mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-300"
            >
              <CheckCircle size={48} className="text-green-600" />
            </motion.div>
            <h1 className="font-display font-bold text-3xl text-green-700">
              Turf Booked!
            </h1>
            <p className="text-muted-foreground mt-2">
              Your Turf Is Booked Successfully 🎉
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-6 border border-border shadow-md space-y-4"
          >
            <h2 className="font-display font-bold text-xl">Booking Details</h2>

            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Hash size={14} />
                  Booking ID
                </span>
                <span className="font-mono font-bold text-xs">
                  {booking.id}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <MapPin size={14} />
                  Turf
                </span>
                <span className="font-semibold">{booking.turfName}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar size={14} />
                  Date
                </span>
                <span className="font-semibold">{booking.date}</span>
              </div>
              <div className="flex items-start justify-between p-3 bg-muted/40 rounded-xl">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock size={14} />
                  Slots
                </span>
                <span className="font-semibold text-right text-xs">
                  {booking.slotLabels.join(", ")}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-bold text-green-700">
                  ₹{booking.totalPrice}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge className={`${statusInfo.cls} text-white`}>
                  {statusInfo.label}
                </Badge>
              </div>
              {booking.paymentStatus !== "fullyPaid" && (
                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-xl">
                  <span className="text-orange-700 text-xs">
                    Remaining Balance
                  </span>
                  <span className="font-bold text-orange-700">
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
            <Button
              className="flex-1 bg-green-600 hover:bg-green-500 text-white"
              onClick={() => navigate("/")}
              data-ocid="confirmation.primary_button"
            >
              <Home size={16} className="mr-2" />
              Go To Home
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/dashboard")}
              data-ocid="confirmation.secondary_button"
            >
              View My Bookings
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
