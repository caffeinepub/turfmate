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
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  History,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
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

  const myBookings = bookings
    .filter((b) => b.userId === currentUser?.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const statusInfo = (s: string) => {
    if (s === "fullyPaid") return { label: "Fully Paid", cls: "bg-green-600" };
    if (s === "advancePaid")
      return { label: "Advance Paid", cls: "bg-amber-500" };
    return { label: "Remaining Pending", cls: "bg-orange-500" };
  };

  // Returns true if the slot has already started or is in the past
  const isSlotStarted = (date: string, slotLabels: string[]) => {
    const now = new Date();
    const bookingDate = new Date(date);
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const bDate = new Date(
      bookingDate.getFullYear(),
      bookingDate.getMonth(),
      bookingDate.getDate(),
    );

    if (bDate < nowDate) return true;

    if (bDate.getTime() === nowDate.getTime()) {
      const firstSlot = slotLabels[0];
      if (firstSlot) {
        const startLabel = firstSlot.split("-")[0]?.trim();
        const hourMatch = startLabel?.match(/(\d+)(?::(\d+))?(AM|PM)/i);
        if (hourMatch) {
          let h = Number.parseInt(hourMatch[1]);
          const m = hourMatch[2] ? Number.parseInt(hourMatch[2]) : 0;
          if (hourMatch[3].toUpperCase() === "PM" && h !== 12) h += 12;
          if (hourMatch[3].toUpperCase() === "AM" && h === 12) h = 0;
          const slotMinutes = h * 60 + m;
          const nowMinutes = now.getHours() * 60 + now.getMinutes();
          return nowMinutes >= slotMinutes;
        }
      }
    }
    return false;
  };

  // Keep isSlotPast for "Pay Remaining" logic (after slot ends)
  const isSlotPast = (date: string, slotLabels: string[]) => {
    const now = new Date();
    const bookingDate = new Date(date);
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const bDate = new Date(
      bookingDate.getFullYear(),
      bookingDate.getMonth(),
      bookingDate.getDate(),
    );

    if (bDate < nowDate) return true;
    if (bDate.getTime() === nowDate.getTime()) {
      const lastSlot = slotLabels[slotLabels.length - 1];
      if (lastSlot) {
        const endLabel = lastSlot.split("-")[1]?.trim();
        const hourMatch = endLabel?.match(/(\d+)(?::(\d+))?(AM|PM)/i);
        if (hourMatch) {
          let h = Number.parseInt(hourMatch[1]);
          const m = hourMatch[2] ? Number.parseInt(hourMatch[2]) : 0;
          if (hourMatch[3].toUpperCase() === "PM" && h !== 12) h += 12;
          if (hourMatch[3].toUpperCase() === "AM" && h === 12) h = 0;
          const slotMinutes = h * 60 + m;
          const nowMinutes = now.getHours() * 60 + now.getMinutes();
          return nowMinutes >= slotMinutes;
        }
      }
    }
    return false;
  };

  // Show Cancel button only when slot has NOT yet started
  const canShowCancel = (b: (typeof myBookings)[0]) =>
    b.status !== "cancelled" &&
    b.status !== "rejected" &&
    !isSlotStarted(b.date, b.slotLabels);

  // Show inline "Cancellation no longer available" note when slot has started but booking is still active
  const isSlotStartedActive = (b: (typeof myBookings)[0]) =>
    b.status !== "cancelled" &&
    b.status !== "rejected" &&
    isSlotStarted(b.date, b.slotLabels);

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
                const isCancelled = b.status === "cancelled";
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`bg-white rounded-2xl p-5 border shadow-sm ${
                      isCancelled
                        ? "border-red-200 opacity-70"
                        : "border-border"
                    }`}
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
                          Total: &#8377;{b.totalPrice}
                        </p>
                        {b.paymentStatus !== "fullyPaid" &&
                          b.remainingAmount > 0 &&
                          !isCancelled && (
                            <p className="text-xs text-orange-600">
                              Remaining balance: &#8377;{b.remainingAmount}
                            </p>
                          )}
                        {isCancelled && b.paymentType === "advance" && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertTriangle size={11} />
                            Advance of &#8377;{b.advanceAmount} was
                            non-refundable
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <p className="text-xs text-muted-foreground font-mono">
                          #{b.id}
                        </p>
                        {!isCancelled && (
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
                        )}
                        {canShowCancel(b) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-400 text-red-600 hover:bg-red-50 text-xs flex items-center gap-1"
                            onClick={() => setCancelTarget(b.id)}
                            data-ocid={`dashboard.delete_button.${i + 1}`}
                          >
                            <XCircle size={12} />
                            Cancel Booking
                          </Button>
                        )}
                        {isSlotStartedActive(b) && (
                          <p className="text-xs text-muted-foreground text-right">
                            Cancellation no longer available
                          </p>
                        )}
                        {canPayRemaining(b) && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-500 text-white text-xs flex items-center gap-1"
                            onClick={() => setPayRemainingTarget(b.id)}
                            data-ocid={`dashboard.primary_button.${i + 1}`}
                          >
                            <CreditCard size={12} />
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
                The advance payment will not be refunded.
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
              Confirm Cancellation
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

      <footer className="bg-[oklch(0.15_0.05_145)] text-gray-400 py-6 text-center text-sm">
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
