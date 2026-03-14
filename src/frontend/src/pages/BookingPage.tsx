import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Clock, MapPin, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";
import type { PaymentType, TimeSlot } from "../types";

/**
 * Returns true if the slot's start time has already passed.
 * Slot ID format: `${turfId}-${date}-${startHour}`
 * where startHour is a 24-hour integer (0-23).
 */
function isPastSlot(slot: TimeSlot): boolean {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Past date — always blocked
  if (slot.date < todayStr) return true;

  // Future date — always allowed
  if (slot.date > todayStr) return false;

  // Same date — compare by hour (and minute for precision)
  const parts = slot.id.split("-");
  const slotHour = Number.parseInt(parts[parts.length - 1], 10);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const slotStartMinutes = slotHour * 60;

  // Block if current time >= slot start time
  return nowMinutes >= slotStartMinutes;
}

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const { turfs, currentUser, getSlots } = useApp();
  const navigate = useNavigate();
  const turf = turfs.find((t) => t.id === id);

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [paymentType, setPaymentType] = useState<PaymentType>("advance");
  const [pastSlotMsg, setPastSlotMsg] = useState(false);
  const [form, setForm] = useState({
    userName: currentUser?.fullName || "",
    phone: currentUser?.phone || "",
    emergency: "",
  });
  const [error, setError] = useState("");

  // biome-ignore lint/correctness/useExhaustiveDependencies: getSlots identity is stable
  useEffect(() => {
    if (turf && date) {
      const s = getSlots(turf.id, date);
      setSlots(s);
      setSelected([]);
      setPastSlotMsg(false);
    }
  }, [turf?.id, date]);

  const totalPrice = useMemo(() => {
    return selected.reduce((sum, sid) => {
      const slot = slots.find((s) => s.id === sid);
      if (!slot || !turf) return sum;
      return (
        sum + (slot.isNightSlot ? turf.nightPricePerHour : turf.pricePerHour)
      );
    }, 0);
  }, [selected, slots, turf]);

  const advanceAmount = turf?.advanceAmount || 0;
  const remainingAmount = totalPrice - advanceAmount;

  const toggleSlot = (slot: TimeSlot) => {
    if (slot.status === "booked" || slot.status === "completed") return;
    if (isPastSlot(slot)) {
      setPastSlotMsg(true);
      setTimeout(() => setPastSlotMsg(false), 3500);
      return;
    }
    setPastSlotMsg(false);
    setSelected((prev) =>
      prev.includes(slot.id)
        ? prev.filter((s) => s !== slot.id)
        : [...prev, slot.id],
    );
  };

  const handleProceed = () => {
    setError("");
    if (!form.userName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!form.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (selected.length === 0) {
      setError("Please select at least one time slot.");
      return;
    }
    // Final guard: re-validate all selected slots haven't passed since selection
    const hasExpired = selected.some((sid) => {
      const slot = slots.find((s) => s.id === sid);
      return slot ? isPastSlot(slot) : false;
    });
    if (hasExpired) {
      setError(
        "One or more selected slots have already passed. Please reselect.",
      );
      setSelected([]);
      return;
    }
    const selectedSlots = slots.filter((s) => selected.includes(s.id));
    navigate("/payment", {
      state: {
        turfId: turf!.id,
        turfName: turf!.name,
        date,
        slotIds: selected,
        slotLabels: selectedSlots.map((s) => s.label),
        totalPrice,
        advanceAmount,
        remainingAmount,
        paymentType,
        userName: form.userName,
        phone: form.phone,
        emergencyContact: form.emergency,
        qrCodeUrl: turf!.qrCodeUrl || "",
      },
    });
  };

  if (!turf)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Turf not found.</p>
      </div>
    );

  const slotColorClass = (slot: TimeSlot) => {
    if (isPastSlot(slot))
      return "bg-gray-100 border-gray-200 text-gray-400 opacity-60 cursor-not-allowed";
    if (slot.status === "booked") return "slot-booked";
    if (slot.status === "completed") return "slot-completed";
    if (selected.includes(slot.id)) return "slot-selected";
    return "slot-available";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Turf summary */}
          <div className="bg-[oklch(0.22_0.06_145)] text-white rounded-2xl p-5 mb-6 flex flex-col sm:flex-row gap-4 items-start">
            <img
              src={turf.imageUrl}
              alt={turf.name}
              className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
            />
            <div>
              <h1 className="font-display font-bold text-2xl">{turf.name}</h1>
              <p className="text-green-200 flex items-center gap-1 text-sm mt-0.5">
                <MapPin size={13} />
                {turf.location}
              </p>
              <div className="flex gap-3 mt-2 text-sm">
                <span className="bg-green-500/20 px-2 py-0.5 rounded">
                  ₹{turf.pricePerHour}/hr (Day)
                </span>
                <span className="bg-green-500/20 px-2 py-0.5 rounded">
                  🌙 ₹{turf.nightPricePerHour}/hr (Night)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: form + slots */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking form */}
              <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
                <h2 className="font-display font-bold text-xl mb-4">
                  Booking Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Your Name</Label>
                    <Input
                      className="mt-1"
                      value={form.userName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, userName: e.target.value }))
                      }
                      data-ocid="booking.input"
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      className="mt-1"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      data-ocid="booking.input"
                    />
                  </div>
                  <div>
                    <Label>Emergency Contact</Label>
                    <Input
                      className="mt-1"
                      type="tel"
                      placeholder="Emergency phone number"
                      value={form.emergency}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, emergency: e.target.value }))
                      }
                      data-ocid="booking.input"
                    />
                  </div>
                  <div>
                    <Label>Select Date</Label>
                    <Input
                      className="mt-1"
                      type="date"
                      min={today}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      data-ocid="booking.input"
                    />
                  </div>
                </div>
              </div>

              {/* Slot grid */}
              <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-xl">
                    Select Time Slots
                  </h2>
                  <div className="flex gap-2 text-xs flex-wrap">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-green-200 border border-green-400 rounded" />
                      Available
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-red-100 border border-red-400 rounded" />
                      Booked
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-amber-100 border border-amber-400 rounded" />
                      Selected
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-gray-100 border border-gray-200 rounded" />
                      Past / Unavailable
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {pastSlotMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-start gap-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl px-4 py-3 mb-4 text-sm"
                      data-ocid="booking.error_state"
                    >
                      <Clock size={16} className="mt-0.5 flex-shrink-0" />
                      <span>
                        This time slot has already passed. Please select a
                        future slot.
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slots.map((slot, i) => (
                      <motion.button
                        key={slot.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => toggleSlot(slot)}
                        className={`relative border-2 rounded-xl px-2 py-2.5 text-xs font-semibold text-center transition-all ${slotColorClass(slot)}`}
                        title={
                          isPastSlot(slot)
                            ? "This time slot has already passed"
                            : undefined
                        }
                        data-ocid={`booking.toggle.${i + 1}`}
                      >
                        {slot.isNightSlot && (
                          <Moon
                            size={10}
                            className="absolute top-1 right-1 opacity-60"
                          />
                        )}
                        {!slot.isNightSlot && !isPastSlot(slot) && (
                          <Sun
                            size={10}
                            className="absolute top-1 right-1 opacity-40"
                          />
                        )}
                        <div>{slot.label}</div>
                        <div className="text-[10px] opacity-70 mt-0.5">
                          {isPastSlot(slot)
                            ? "Passed"
                            : `₹${
                                slot.isNightSlot
                                  ? turf.nightPricePerHour
                                  : turf.pricePerHour
                              }`}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </AnimatePresence>
                {slots.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm py-8">
                    Loading slots...
                  </p>
                )}
              </div>
            </div>

            {/* Right: price summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white rounded-2xl p-5 border border-border shadow-md">
                <h2 className="font-display font-bold text-xl mb-4">
                  Price Summary
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Selected Slots
                    </span>
                    <span className="font-semibold">
                      {selected.length} hour{selected.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Price</span>
                    <span className="font-bold text-green-700 text-base">
                      ₹{totalPrice}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Advance Amount
                      </span>
                      <span className="font-semibold">₹{advanceAmount}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className="font-semibold">
                        ₹{Math.max(0, remainingAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment type */}
                <div className="mt-4">
                  <Label className="text-sm font-medium mb-2 block">
                    Payment Option
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentType("advance")}
                      className={`p-2.5 rounded-xl border-2 text-sm font-medium transition-all ${paymentType === "advance" ? "border-green-500 bg-green-50 text-green-700" : "border-border text-muted-foreground hover:border-green-300"}`}
                      data-ocid="booking.radio"
                    >
                      Advance (₹{advanceAmount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentType("full")}
                      className={`p-2.5 rounded-xl border-2 text-sm font-medium transition-all ${paymentType === "full" ? "border-green-500 bg-green-50 text-green-700" : "border-border text-muted-foreground hover:border-green-300"}`}
                      data-ocid="booking.radio"
                    >
                      Full (₹{totalPrice})
                    </button>
                  </div>
                </div>

                {selected.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-xs">
                    <p className="font-semibold text-green-700 mb-1">
                      Selected Slots:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {slots
                        .filter((s) => selected.includes(s.id))
                        .map((s) => (
                          <Badge
                            key={s.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {s.label}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div
                    className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-2.5 text-xs"
                    data-ocid="booking.error_state"
                  >
                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <Button
                  className="w-full mt-4 bg-green-600 hover:bg-green-500 text-white font-semibold h-11"
                  onClick={handleProceed}
                  disabled={selected.length === 0}
                  data-ocid="booking.primary_button"
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
