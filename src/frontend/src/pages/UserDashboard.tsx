import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  History,
  Lock,
  PlayCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
              key={`d-${x}-${y}`}
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
        &#8377;{amount} UPI
      </text>
    </svg>
  );
}

export default function UserDashboard() {
  const { currentUser, bookings, turfs, updatePaymentStatus, cancelBooking } =
    useApp();
  const navigate = useNavigate();
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [payRemainingTarget, setPayRemainingTarget] = useState<string | null>(
    null,
  );
  // For live time-based badge updates
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const myBookings = bookings
    .filter((b) => b.userId === currentUser?.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const statusInfo = (s: string) => {
    if (s === "fullyPaid") return { label: "Done", cls: "bg-green-600" };
    if (s === "advancePaid")
      return { label: "Advance Paid", cls: "bg-amber-500" };
    return { label: "Remaining Pending", cls: "bg-orange-500" };
  };

  const parseSlotStartMinutes = (label: string): number | null => {
    const startLabel = label.split("-")[0]?.trim();
    const match = startLabel?.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
    if (!match) return null;
    let h = Number.parseInt(match[1]);
    const m = match[2] ? Number.parseInt(match[2]) : 0;
    if (match[3].toUpperCase() === "PM" && h !== 12) h += 12;
    if (match[3].toUpperCase() === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  const parseSlotEndMinutes = (slotLabels: string[]): number | null => {
    const lastSlot = slotLabels[slotLabels.length - 1];
    if (!lastSlot) return null;
    const endLabel = lastSlot.split("-")[1]?.trim();
    const hourMatch = endLabel?.match(/(\d+)(?::(\d+))?(AM|PM)/i);
    if (!hourMatch) return null;
    let h = Number.parseInt(hourMatch[1]);
    const m = hourMatch[2] ? Number.parseInt(hourMatch[2]) : 0;
    if (hourMatch[3].toUpperCase() === "PM" && h !== 12) h += 12;
    if (hourMatch[3].toUpperCase() === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  const isSameDay = (date: string) => {
    const bookingDate = new Date(date);
    return (
      bookingDate.getFullYear() === now.getFullYear() &&
      bookingDate.getMonth() === now.getMonth() &&
      bookingDate.getDate() === now.getDate()
    );
  };

  const isCancelAllowed = (b: (typeof myBookings)[0]): boolean => {
    const bookingDate = new Date(b.date);
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const bDate = new Date(
      bookingDate.getFullYear(),
      bookingDate.getMonth(),
      bookingDate.getDate(),
    );
    if (bDate > nowDate) return true;
    if (bDate < nowDate) return false;
    const firstSlot = b.slotLabels[0];
    if (!firstSlot) return false;
    const slotStartMinutes = parseSlotStartMinutes(firstSlot);
    if (slotStartMinutes === null) return false;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return nowMinutes < slotStartMinutes - 60;
  };

  // Returns true if slot time has fully passed
  const isSlotPast = (date: string, slotLabels: string[]) => {
    const bookingDate = new Date(date);
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const bDate = new Date(
      bookingDate.getFullYear(),
      bookingDate.getMonth(),
      bookingDate.getDate(),
    );
    if (bDate < nowDate) return true;
    if (bDate.getTime() === nowDate.getTime()) {
      const slotEndMinutes = parseSlotEndMinutes(slotLabels);
      if (slotEndMinutes !== null) {
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        return nowMinutes >= slotEndMinutes;
      }
    }
    return false;
  };

  // Returns true if user is currently playing (slot time is now)
  const isPlayingNow = (date: string, slotLabels: string[]): boolean => {
    if (!isSameDay(date)) return false;
    const firstSlot = slotLabels[0];
    if (!firstSlot) return false;
    const startMinutes = parseSlotStartMinutes(firstSlot);
    const endMinutes = parseSlotEndMinutes(slotLabels);
    if (startMinutes === null || endMinutes === null) return false;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  };

  // Returns true if slot is within 30 minutes (upcoming reminder)
  const isSlotSoon = (date: string, slotLabels: string[]): boolean => {
    if (!isSameDay(date)) return false;
    const firstSlot = slotLabels[0];
    if (!firstSlot) return false;
    const startMinutes = parseSlotStartMinutes(firstSlot);
    if (startMinutes === null) return false;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    // Within 30 mins before slot starts
    return nowMinutes >= startMinutes - 30 && nowMinutes < startMinutes;
  };

  const canShowCancel = (b: (typeof myBookings)[0]) =>
    b.status !== "cancelled" && b.status !== "rejected" && isCancelAllowed(b);

  const canPayRemaining = (b: (typeof myBookings)[0]) =>
    b.paymentStatus !== "fullyPaid" &&
    b.paymentType === "advance" &&
    b.remainingAmount > 0 &&
    b.status !== "cancelled" &&
    b.status !== "rejected" &&
    isSlotPast(b.date, b.slotLabels);

  const payRemainingBooking = payRemainingTarget
    ? (myBookings.find((b) => b.id === payRemainingTarget) ?? null)
    : null;
  const payRemainingTurf = payRemainingBooking
    ? (turfs.find((t) => t.id === payRemainingBooking.turfId) ?? null)
    : null;

  return (
    <div className="min-h-screen bg-[#060e07]">
      <Navbar />

      {/* Dashboard hero header */}
      <div
        className="relative mt-16"
        style={{
          backgroundImage:
            "url('/assets/generated/dashboard-bg.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#061209]/90 to-[#0a1f0c]/85" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-1">
              <img
                src="/assets/generated/turfmate-icon-transparent.dim_200x200.png"
                alt=""
                className="w-10 h-10 object-contain"
              />
              <h1 className="font-display font-bold text-3xl text-white">
                My Dashboard
              </h1>
            </div>
            <p className="text-green-300/70 mt-1 ml-1">
              Welcome back, {currentUser?.fullName}
            </p>
          </motion.div>
        </div>
      </div>

      <main className="pb-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="section-header-line">
              <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <History size={20} className="text-green-400" />
                My Bookings
              </h2>
            </div>
            <span className="bg-green-900/40 border border-green-700/40 text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
              {myBookings.length} booking{myBookings.length !== 1 ? "s" : ""}
            </span>
          </div>

          {myBookings.length === 0 ? (
            <div
              className="glass-dark rounded-2xl text-center py-20 border border-green-900/30"
              data-ocid="dashboard.empty_state"
            >
              <Calendar size={48} className="mx-auto mb-4 text-green-400/30" />
              <p className="text-lg font-medium text-white/60">
                No bookings yet
              </p>
              <p className="text-sm mt-1 text-white/40">
                Start exploring turfs to make your first booking.
              </p>
              <button
                type="button"
                className="btn-premium mt-6 px-8 py-3"
                onClick={() => navigate("/explore")}
                data-ocid="dashboard.primary_button"
              >
                Explore Turfs
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((b, i) => {
                const st = statusInfo(b.paymentStatus);
                const isCancelled = b.status === "cancelled";
                const isActive =
                  b.status !== "cancelled" && b.status !== "rejected";
                const cancelAllowed = isCancelAllowed(b);
                const playing = isActive && isPlayingNow(b.date, b.slotLabels);
                const soon =
                  isActive && !playing && isSlotSoon(b.date, b.slotLabels);
                const pastSlot = isSlotPast(b.date, b.slotLabels);
                const fullyDone = b.paymentStatus === "fullyPaid" && pastSlot;

                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`rounded-2xl p-5 border transition-all duration-200 ${
                      playing
                        ? "bg-[#0d2010] border-green-400/60 border-l-4 border-l-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.2)]"
                        : isCancelled
                          ? "bg-red-950/20 border-red-900/30 border-l-4 border-l-red-500 opacity-70"
                          : "bg-[#0a1a0c] border-green-900/30 hover:border-green-400/30 hover:shadow-neon-green border-l-4 border-l-green-500"
                    }`}
                    data-ocid={`dashboard.item.${i + 1}`}
                  >
                    {/* Reminder banner – shown when slot is within 30 minutes */}
                    {soon && (
                      <div className="mb-3 flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 rounded-xl px-3 py-2">
                        <Bell
                          size={14}
                          className="text-amber-400 animate-pulse shrink-0"
                        />
                        <p className="text-xs font-semibold text-amber-300">
                          Reminder: Your slot starts very soon! Get ready to
                          play.
                        </p>
                      </div>
                    )}

                    {/* Playing now banner */}
                    {playing && (
                      <div className="mb-3 flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/40 rounded-xl px-3 py-2">
                        <PlayCircle
                          size={14}
                          className="text-emerald-400 animate-pulse shrink-0"
                        />
                        <p className="text-xs font-semibold text-emerald-300">
                          You are playing now! Enjoy your game.
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display font-bold text-lg text-white">
                            {b.turfName}
                          </h3>
                          {/* Payment status badge – "Done" when fully paid */}
                          <Badge className={`${st.cls} text-white text-xs`}>
                            {st.label}
                          </Badge>
                          {/* Playing now badge on slot */}
                          {playing && (
                            <Badge className="bg-emerald-600 text-white text-xs flex items-center gap-1">
                              <PlayCircle size={10} />
                              Playing Now
                            </Badge>
                          )}
                          {/* Slot closed badge – past slot, not yet paid remaining */}
                          {!playing &&
                            pastSlot &&
                            isActive &&
                            b.paymentStatus !== "fullyPaid" &&
                            b.paymentType === "advance" && (
                              <Badge className="bg-gray-600 text-white text-xs flex items-center gap-1">
                                <Lock size={10} />
                                Closed
                              </Badge>
                            )}
                          {/* Done badge for fully completed bookings */}
                          {fullyDone && (
                            <Badge className="bg-teal-700 text-white text-xs flex items-center gap-1">
                              <CheckCircle size={10} />
                              Done
                            </Badge>
                          )}
                          {isCancelled && (
                            <Badge variant="destructive" className="text-xs">
                              Cancelled
                            </Badge>
                          )}
                          {b.status === "rejected" && (
                            <Badge variant="destructive" className="text-xs">
                              Rejected
                            </Badge>
                          )}
                          {b.status === "approved" && !playing && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              Approved
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-white/50 flex items-center gap-1.5">
                          <Calendar size={13} className="text-green-400/60" />
                          {b.date}
                        </p>
                        <p className="text-sm text-white/50 flex items-center gap-1.5">
                          <Clock size={13} className="text-green-400/60" />
                          {b.slotLabels.join(", ")}
                        </p>
                        <p className="text-sm font-semibold text-green-400 flex items-center gap-1.5">
                          <CreditCard size={13} />
                          Total: &#8377;{b.totalPrice}
                        </p>
                        {b.paymentStatus !== "fullyPaid" &&
                          b.remainingAmount > 0 &&
                          !isCancelled && (
                            <p className="text-xs text-amber-400/80">
                              Remaining balance: &#8377;{b.remainingAmount}
                            </p>
                          )}
                        {isCancelled && b.paymentType === "advance" && (
                          <p className="text-xs text-red-400/80 flex items-center gap-1">
                            <AlertTriangle size={11} />
                            Advance of &#8377;{b.advanceAmount} was
                            non-refundable
                          </p>
                        )}
                        {isActive &&
                          !cancelAllowed &&
                          !playing &&
                          !pastSlot && (
                            <p className="text-xs text-white/30 flex items-center gap-1">
                              <Clock size={11} />
                              Cancellation closed (less than 1 hour before slot)
                            </p>
                          )}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <p className="text-xs text-white/30 font-mono">
                          #{b.id}
                        </p>
                        {!isCancelled && (
                          <button
                            type="button"
                            className="bg-green-900/20 border border-green-500/30 hover:bg-green-900/40 text-green-400 rounded-xl text-xs font-semibold px-3 py-1.5 transition-all flex items-center gap-1"
                            onClick={() => navigate(`/book/${b.turfId}`)}
                            data-ocid={`dashboard.secondary_button.${i + 1}`}
                          >
                            <RefreshCw size={12} />
                            Book Again
                          </button>
                        )}
                        {canShowCancel(b) && (
                          <button
                            type="button"
                            className="bg-red-900/20 border border-red-500/30 hover:bg-red-900/40 text-red-400 rounded-xl text-xs font-semibold px-3 py-1.5 transition-all flex items-center gap-1"
                            onClick={() => setCancelTarget(b.id)}
                            data-ocid={`dashboard.delete_button.${i + 1}`}
                          >
                            <XCircle size={12} />
                            Cancel Booking
                          </button>
                        )}
                        {/* Pay Remaining button — only when slot has passed */}
                        {canPayRemaining(b) && (
                          <button
                            type="button"
                            className="btn-premium text-xs px-3 py-1.5 rounded-xl flex items-center gap-1"
                            onClick={() => setPayRemainingTarget(b.id)}
                            data-ocid={`dashboard.primary_button.${i + 1}`}
                          >
                            <CreditCard size={12} />
                            Pay Remaining Amount
                          </button>
                        )}
                        {/* Closed label — slot has passed without paying remaining */}
                        {!canPayRemaining(b) &&
                          b.paymentStatus !== "fullyPaid" &&
                          b.paymentType === "advance" &&
                          b.remainingAmount > 0 &&
                          isActive &&
                          pastSlot && (
                            <span className="flex items-center gap-1 text-gray-400 text-xs font-semibold px-3 py-1.5 bg-gray-800/60 border border-gray-600/40 rounded-xl">
                              <Lock size={12} />
                              Slot Closed
                            </span>
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

      {/* Cancel Confirmation Dialog */}
      <AlertDialog
        open={!!cancelTarget}
        onOpenChange={(open) => !open && setCancelTarget(null)}
      >
        <AlertDialogContent data-ocid="cancel.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle size={20} />
              Cancel Booking
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-relaxed">
              Are you sure you want to cancel this booking?
              <br />
              <span className="font-semibold text-red-600">
                Advance payment will not be refunded.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="cancel.cancel_button">
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-500 text-white"
              onClick={() => {
                if (cancelTarget) {
                  cancelBooking(cancelTarget);
                  setCancelTarget(null);
                }
              }}
              data-ocid="cancel.confirm_button"
            >
              Confirm Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pay Remaining Amount Dialog */}
      <Dialog
        open={!!payRemainingTarget}
        onOpenChange={(open) => !open && setPayRemainingTarget(null)}
      >
        <DialogContent className="max-w-sm" data-ocid="pay_remaining.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-green-700 text-center">
              Pay Remaining Amount
            </DialogTitle>
          </DialogHeader>
          {payRemainingBooking && (
            <div className="space-y-4 text-center">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-sm text-orange-700 font-medium">
                  Remaining Amount to Pay
                </p>
                <p className="text-3xl font-bold text-orange-600 mt-1">
                  &#8377;{payRemainingBooking.remainingAmount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {payRemainingBooking.turfName} &middot;{" "}
                  {payRemainingBooking.date}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Scan to Pay
                </p>
                {payRemainingTurf?.qrCodeUrl ? (
                  <img
                    src={payRemainingTurf.qrCodeUrl}
                    alt="Payment QR Code"
                    className="w-44 h-44 object-contain border rounded-xl"
                  />
                ) : (
                  <QRCodeSVG amount={payRemainingBooking.remainingAmount} />
                )}
                <p className="text-xs text-muted-foreground">
                  UPI / Any Payment App
                </p>
                <p className="text-xs text-green-600 font-medium">
                  TurfMate Demo Payment
                </p>
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold h-12 rounded-xl"
                onClick={() => {
                  updatePaymentStatus(payRemainingBooking.id, "fullyPaid");
                  setPayRemainingTarget(null);
                }}
                data-ocid="pay_remaining.confirm_button"
              >
                <CheckCircle size={16} className="mr-2" />I Have Paid Remaining
                Amount
              </Button>
              <p className="text-xs text-muted-foreground">
                &#128274; Demo project &mdash; no real payment is processed
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <footer className="bg-[#030806] text-gray-400 py-6 text-center text-sm border-t border-green-900/20">
        <p>
          &copy; {new Date().getFullYear()}. Built with &#10084;&#65039; using{" "}
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
