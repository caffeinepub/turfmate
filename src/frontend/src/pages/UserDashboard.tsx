import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CreditCard, History, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";

export default function UserDashboard() {
  const { currentUser, bookings, updatePaymentStatus } = useApp();
  const navigate = useNavigate();
  const myBookings = bookings
    .filter((b) => b.userId === currentUser?.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const statusInfo = (s: string) => {
    if (s === "fullyPaid") return { label: "Fully Paid", cls: "bg-green-600" };
    if (s === "advancePaid")
      return { label: "Advance Paid", cls: "bg-amber-500" };
    return { label: "Remaining Pending", cls: "bg-orange-500" };
  };

  const isSlotPast = (date: string, slotLabels: string[]) => {
    const now = new Date();
    const bookingDate = new Date(date);
    if (bookingDate < now) return true;
    if (bookingDate.toDateString() === now.toDateString()) {
      const lastSlot = slotLabels[slotLabels.length - 1];
      if (lastSlot) {
        const endLabel = lastSlot.split("-")[1];
        const hourMatch = endLabel?.match(/(\d+)(AM|PM)/i);
        if (hourMatch) {
          let h = Number.parseInt(hourMatch[1]);
          if (hourMatch[2].toUpperCase() === "PM" && h !== 12) h += 12;
          return now.getHours() >= h;
        }
      }
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display font-bold text-3xl">My Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {currentUser?.fullName}
            </p>
          </motion.div>

          {/* Booking History Section */}
          <div className="mb-6 flex items-center gap-2">
            <History size={20} className="text-green-600" />
            <h2 className="font-display font-bold text-xl">Booking History</h2>
            <Badge variant="secondary" className="ml-1">
              {myBookings.length} booking{myBookings.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {myBookings.length === 0 ? (
            <div
              className="text-center py-20 text-muted-foreground"
              data-ocid="dashboard.empty_state"
            >
              <Calendar size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No bookings yet</p>
              <p className="text-sm mt-1">
                Start exploring turfs to make your first booking.
              </p>
              <Button
                className="mt-4 bg-green-600 hover:bg-green-500 text-white"
                onClick={() => navigate("/explore")}
                data-ocid="dashboard.primary_button"
              >
                Explore Turfs
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((b, i) => {
                const st = statusInfo(b.paymentStatus);
                const past = isSlotPast(b.date, b.slotLabels);
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-white rounded-2xl p-5 border border-border shadow-sm"
                    data-ocid={`dashboard.item.${i + 1}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display font-bold text-lg">
                            {b.turfName}
                          </h3>
                          <Badge className={`${st.cls} text-white text-xs`}>
                            {st.label}
                          </Badge>
                          {b.status === "rejected" && (
                            <Badge variant="destructive" className="text-xs">
                              Rejected
                            </Badge>
                          )}
                          {b.status === "approved" && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              Approved
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <Calendar size={13} />
                          {b.date}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <Clock size={13} />
                          {b.slotLabels.join(", ")}
                        </p>
                        <p className="text-sm font-semibold text-green-700 flex items-center gap-1.5">
                          <CreditCard size={13} />
                          Total: ₹{b.totalPrice}
                        </p>
                        {b.paymentStatus !== "fullyPaid" &&
                          b.remainingAmount > 0 && (
                            <p className="text-xs text-orange-600">
                              Remaining balance: ₹{b.remainingAmount}
                            </p>
                          )}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <p className="text-xs text-muted-foreground font-mono">
                          #{b.id}
                        </p>
                        {/* Book Again button */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-600 text-green-700 hover:bg-green-50 text-xs flex items-center gap-1"
                          onClick={() => navigate(`/book/${b.turfId}`)}
                          data-ocid={`dashboard.secondary_button.${i + 1}`}
                        >
                          <RefreshCw size={12} />
                          Book Again
                        </Button>
                        {b.paymentStatus !== "fullyPaid" && past && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-500 text-white text-xs"
                            onClick={() =>
                              updatePaymentStatus(b.id, "fullyPaid")
                            }
                            data-ocid={`dashboard.primary_button.${i + 1}`}
                          >
                            Pay Remaining Amount
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
