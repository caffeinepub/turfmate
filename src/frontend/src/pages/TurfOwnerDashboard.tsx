import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Edit2,
  MapPin,
  Moon,
  Save,
  Sun,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";
import type { TimeSlot } from "../types";

function OwnerRevenueContent() {
  const { currentUser, bookings } = useApp();
  const myTurfId = currentUser?.assignedTurfId;
  const filtered = bookings.filter(
    (b) =>
      b.turfId === myTurfId &&
      b.status !== "cancelled" &&
      b.status !== "rejected",
  );
  const map: Record<string, { totalBookings: number; totalRevenue: number }> =
    {};
  for (const b of filtered) {
    if (!map[b.date]) map[b.date] = { totalBookings: 0, totalRevenue: 0 };
    map[b.date].totalBookings += 1;
    map[b.date].totalRevenue +=
      b.paymentType === "advance" ? b.advanceAmount : b.totalPrice;
  }
  const entries = Object.entries(map)
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => b.date.localeCompare(a.date));
  const totalRevenue = entries.reduce((s, e) => s + e.totalRevenue, 0);
  const totalBookings = entries.reduce((s, e) => s + e.totalBookings, 0);

  return (
    <div>
      <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-green-600" />
        Daily Revenue Report
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-sm text-green-700 font-medium">
            Total Revenue (All Time)
          </p>
          <p className="text-2xl font-bold text-green-800 mt-1">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-sm text-blue-700 font-medium">
            Total Bookings (All Time)
          </p>
          <p className="text-2xl font-bold text-blue-800 mt-1">
            {totalBookings}
          </p>
        </div>
      </div>
      {entries.length === 0 ? (
        <p
          className="text-center text-muted-foreground py-10"
          data-ocid="owner.revenue.empty_state"
        >
          No booking revenue data yet.
        </p>
      ) : (
        <div
          className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
          data-ocid="owner.revenue.table"
        >
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-right px-4 py-3 font-semibold">
                  Total Bookings
                </th>
                <th className="text-right px-4 py-3 font-semibold">
                  Total Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr
                  key={e.date}
                  className={i % 2 === 0 ? "bg-white" : "bg-muted/20"}
                  data-ocid={`owner.revenue.row.${i + 1}`}
                >
                  <td className="px-4 py-3 font-medium">{e.date}</td>
                  <td className="px-4 py-3 text-right">{e.totalBookings}</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-700">
                    ₹{e.totalRevenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function TurfOwnerDashboard() {
  const {
    currentUser,
    turfs,
    bookings,
    getSlots,
    slots,
    toggleSlotStatus,
    reopenSlot,
    editTurf,
  } = useApp();
  const turf = turfs.find((t) => t.id === currentUser?.assignedTurfId);
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [dateSlots, setDateSlots] = useState<TimeSlot[]>([]);
  const [editForm, setEditForm] = useState({
    pricePerHour: turf?.pricePerHour ?? 0,
    nightPricePerHour: turf?.nightPricePerHour ?? 0,
    description: turf?.description ?? "",
    facilities: turf?.facilities?.join(", ") ?? "",
  });
  const [editSaved, setEditSaved] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: getSlots identity is stable
  useEffect(() => {
    if (turf && date) {
      const s = getSlots(turf.id, date);
      setDateSlots(s);
    }
  }, [turf?.id, date, slots]);

  const myBookings = bookings
    .filter((b) => b.turfId === turf?.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const todayBookings = myBookings.filter((b) => b.date === today);
  const availableCount = dateSlots.filter(
    (s) => s.status === "available",
  ).length;
  const bookedCount = dateSlots.filter((s) => s.status === "booked").length;

  const statusInfo = (s: string) => {
    if (s === "fullyPaid") return { label: "Fully Paid", cls: "bg-green-600" };
    if (s === "advancePaid")
      return { label: "Advance Paid", cls: "bg-amber-500" };
    return { label: "Remaining Pending", cls: "bg-orange-500" };
  };

  if (!turf)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          No turf assigned to your account. Contact admin.
        </p>
      </div>
    );

  const slotClass = (s: TimeSlot) => {
    if (s.status === "booked") return "slot-booked";
    if (s.status === "completed") return "slot-completed";
    return "slot-available";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 pb-12">
        {/* Header */}
        <div className="bg-[oklch(0.22_0.06_145)] text-white py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <img
                src={turf.imageUrl}
                alt={turf.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div>
                <h1 className="font-display font-bold text-3xl">{turf.name}</h1>
                <p className="text-green-200 flex items-center gap-1 mt-1">
                  <MapPin size={13} />
                  {turf.location}
                </p>
                <p className="text-green-300 text-sm mt-0.5">
                  {turf.surfaceType} • {turf.openTime} – {turf.closeTime}
                </p>
              </div>
            </div>
            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { label: "Today's Bookings", value: todayBookings.length },
                { label: "Available Slots", value: availableCount },
                { label: "Booked Slots", value: bookedCount },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-white/10 rounded-xl p-3 text-center"
                >
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-green-200 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          <Tabs defaultValue="slots">
            <TabsList className="mb-6">
              <TabsTrigger value="slots" data-ocid="owner.tab">
                Slot Management
              </TabsTrigger>
              <TabsTrigger value="bookings" data-ocid="owner.tab">
                Bookings
              </TabsTrigger>
              <TabsTrigger value="edit" data-ocid="owner.tab">
                Edit Turf
              </TabsTrigger>
              <TabsTrigger value="revenue" data-ocid="owner.tab">
                Daily Revenue
              </TabsTrigger>
            </TabsList>

            {/* Slot management */}
            <TabsContent value="slots">
              <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-5">
                  <h2 className="font-display font-bold text-xl">
                    Manage Slots
                  </h2>
                  <div className="flex items-center gap-2">
                    <Label>Date:</Label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-auto"
                      data-ocid="owner.input"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mb-4 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-200 border border-green-400 rounded" />
                    Available (click to book)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-red-100 border border-red-400 rounded" />
                    Booked (click to reopen)
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {dateSlots.map((slot, i) => (
                    <motion.button
                      key={slot.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.02 }}
                      onClick={() => {
                        if (slot.status === "booked") reopenSlot(slot.id);
                        else if (slot.status === "available")
                          toggleSlotStatus(slot.id);
                      }}
                      className={`relative border-2 rounded-xl px-2 py-2.5 text-xs font-semibold text-center transition-all ${slotClass(slot)}`}
                      data-ocid={`owner.toggle.${i + 1}`}
                    >
                      {slot.isNightSlot ? (
                        <Moon
                          size={10}
                          className="absolute top-1 right-1 opacity-60"
                        />
                      ) : (
                        <Sun
                          size={10}
                          className="absolute top-1 right-1 opacity-40"
                        />
                      )}
                      <div>{slot.label}</div>
                      <div className="text-[10px] mt-0.5 opacity-70">
                        {slot.status}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Bookings */}
            <TabsContent value="bookings">
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-x-auto">
                <Table data-ocid="owner.table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Emergency</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Slots</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myBookings.map((b, i) => (
                      <TableRow key={b.id} data-ocid={`owner.row.${i + 1}`}>
                        <TableCell className="font-semibold text-sm">
                          {b.userName}
                        </TableCell>
                        <TableCell className="text-sm">{b.phone}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {b.emergencyContact || "-"}
                        </TableCell>
                        <TableCell className="text-sm">{b.date}</TableCell>
                        <TableCell className="text-xs max-w-[120px] truncate">
                          {b.slotLabels.join(", ")}
                        </TableCell>
                        <TableCell className="font-bold text-green-700 text-sm">
                          ₹{b.totalPrice}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${statusInfo(b.paymentStatus).cls} text-white text-xs`}
                          >
                            {statusInfo(b.paymentStatus).label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {myBookings.length === 0 && (
                  <p
                    className="text-center text-muted-foreground py-10"
                    data-ocid="owner.empty_state"
                  >
                    No bookings for your turf yet.
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Edit Turf Details */}
            <TabsContent value="edit">
              <div className="bg-white rounded-2xl p-5 border border-border shadow-sm max-w-xl">
                <div className="flex items-center gap-2 mb-5">
                  <Edit2 size={18} className="text-green-600" />
                  <h2 className="font-display font-bold text-xl">
                    Edit Turf Details
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      className="mt-1"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      data-ocid="owner.textarea"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Day Price/hr (₹)</Label>
                      <Input
                        className="mt-1"
                        type="number"
                        value={editForm.pricePerHour}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            pricePerHour: Number(e.target.value),
                          }))
                        }
                        data-ocid="owner.input"
                      />
                    </div>
                    <div>
                      <Label>Night Price/hr (₹)</Label>
                      <Input
                        className="mt-1"
                        type="number"
                        value={editForm.nightPricePerHour}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            nightPricePerHour: Number(e.target.value),
                          }))
                        }
                        data-ocid="owner.input"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Facilities (comma-separated)</Label>
                    <Input
                      className="mt-1"
                      value={editForm.facilities}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          facilities: e.target.value,
                        }))
                      }
                      placeholder="e.g. Floodlights, Parking, Changing Rooms"
                      data-ocid="owner.input"
                    />
                  </div>
                  <div>
                    <Label>Main Turf Image</Label>
                    <input
                      ref={imgRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file || !turf) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          editTurf(turf.id, {
                            imageUrl: reader.result as string,
                          });
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => imgRef.current?.click()}
                      className="mt-1 w-full h-24 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-green-400 hover:text-green-600 transition-colors text-sm"
                      data-ocid="owner.upload_button"
                    >
                      {turf?.imageUrl ? (
                        <img
                          src={turf.imageUrl}
                          alt="Current"
                          className="h-full w-full object-cover rounded-xl"
                        />
                      ) : (
                        <span>Click to upload image</span>
                      )}
                    </button>
                  </div>
                  {editSaved && (
                    <p
                      className="text-green-600 text-sm font-medium"
                      data-ocid="owner.success_state"
                    >
                      ✓ Changes saved successfully!
                    </p>
                  )}
                  <Button
                    className="bg-green-600 hover:bg-green-500 text-white w-full"
                    onClick={() => {
                      if (!turf) return;
                      editTurf(turf.id, {
                        description: editForm.description,
                        pricePerHour: editForm.pricePerHour,
                        nightPricePerHour: editForm.nightPricePerHour,
                        facilities: editForm.facilities
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      });
                      setEditSaved(true);
                      setTimeout(() => setEditSaved(false), 3000);
                    }}
                    data-ocid="owner.save_button"
                  >
                    <Save size={15} className="mr-1" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Daily Revenue */}
            <TabsContent value="revenue">
              <OwnerRevenueContent />
            </TabsContent>
          </Tabs>
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
