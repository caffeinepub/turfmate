import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ClipboardCheck,
  ClipboardList,
  Edit2,
  ImagePlus,
  Layers,
  LayoutDashboard,
  Plus,
  Trash2,
  TrendingUp,
  Trophy as TrophyIcon,
  Upload,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";
import type { SurfaceType, Tournament, Turf } from "../types";

type TurfForm = Omit<Turf, "id" | "ownerId"> & { ownerId?: string };

const emptyTurf: TurfForm = {
  name: "",
  location: "",
  description: "",
  pricePerHour: 800,
  nightPricePerHour: 1000,
  advanceAmount: 400,
  facilities: [],
  surfaceType: "Artificial Grass",
  openTime: "6:00 AM",
  closeTime: "11:00 PM",
  safetyInfo: [],
  ownerId: "",
  imageUrl: "",
  galleryImages: [],
  qrCodeUrl: "",
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  ocid: string;
  helperText?: string;
}

function ImageUploadField({
  label,
  value,
  onChange,
  ocid,
  helperText,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    onChange(b64);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <Label>{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
        data-ocid={ocid}
      />
      {!value ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-1 w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-green-400 hover:text-green-600 transition-colors cursor-pointer"
          data-ocid={`${ocid}_upload_button`}
        >
          <ImagePlus size={24} />
          <span className="text-xs font-medium">Click to upload image</span>
        </button>
      ) : (
        <div className="mt-1 relative group rounded-xl overflow-hidden border border-border">
          <img src={value} alt={label} className="w-full h-32 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 flex items-center gap-1"
            >
              <Upload size={12} /> Change
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 flex items-center gap-1"
            >
              <X size={12} /> Remove
            </button>
          </div>
        </div>
      )}
      {helperText && (
        <p className="text-xs text-muted-foreground mt-1">{helperText}</p>
      )}
    </div>
  );
}

interface GalleryUploadFieldProps {
  images: string[];
  onChange: (images: string[]) => void;
}

function GalleryUploadField({ images, onChange }: GalleryUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const b64s = await Promise.all(files.map(fileToBase64));
    onChange([...images, ...b64s]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <Label>Gallery Images</Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
        data-ocid="admin.gallery.upload_button"
      />
      <div className="mt-1 grid grid-cols-3 sm:grid-cols-4 gap-2">
        {images.map((img, idx) => (
          <div
            key={`gallery-${img.slice(-20)}`}
            className="relative group rounded-lg overflow-hidden border border-border aspect-video"
          >
            <img
              src={img}
              alt={`Gallery ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => remove(idx)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="aspect-video border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-green-400 hover:text-green-600 transition-colors cursor-pointer"
          data-ocid="admin.gallery.secondary_button"
        >
          <Plus size={16} />
          <span className="text-xs">Add photos</span>
        </button>
      </div>
    </div>
  );
}

interface RevenueEntry {
  date: string;
  totalBookings: number;
  totalRevenue: number;
}

function computeDailyRevenue(
  bookings: import("../types").Booking[],
  turfId?: string,
): RevenueEntry[] {
  const filtered = turfId
    ? bookings.filter((b) => b.turfId === turfId)
    : bookings;
  const active = filtered.filter(
    (b) => b.status !== "cancelled" && b.status !== "rejected",
  );
  const map: Record<string, { totalBookings: number; totalRevenue: number }> =
    {};
  for (const b of active) {
    if (!map[b.date]) map[b.date] = { totalBookings: 0, totalRevenue: 0 };
    map[b.date].totalBookings += 1;
    map[b.date].totalRevenue +=
      b.paymentType === "advance" ? b.advanceAmount : b.totalPrice;
  }
  return Object.entries(map)
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function AdminRevenuePanel({
  bookings,
}: { bookings: import("../types").Booking[] }) {
  const entries = computeDailyRevenue(bookings);
  const totalRevenue = entries.reduce((s, e) => s + e.totalRevenue, 0);
  const totalBookings = entries.reduce((s, e) => s + e.totalBookings, 0);

  return (
    <div>
      <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-green-600" />
        Daily Revenue Report
      </h2>
      {/* Summary cards */}
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
          data-ocid="admin.revenue.empty_state"
        >
          No booking revenue data yet.
        </p>
      ) : (
        <div
          className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
          data-ocid="admin.revenue.table"
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
                  data-ocid={`admin.revenue.row.${i + 1}`}
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

function AdminTournamentsTab() {
  const {
    turfs,
    tournaments,
    tournamentRegistrations,
    createTournament,
    deleteTournament,
  } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    turfId: "",
    turfName: "",
    location: "",
    date: "",
    organizerName: "",
    winningPrize: 10000,
    maxTeams: 8,
    registrationEndDate: "",
    rules: "",
    contact1: "",
    contact2: "",
    entryFee: 500,
    qrCodeUrl: "",
  });
  const qrRef = useRef<HTMLInputElement>(null);

  const handleTurfChange = (turfId: string) => {
    const turf = turfs.find((t) => t.id === turfId);
    setForm((p) => ({ ...p, turfId, turfName: turf?.name ?? "" }));
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => ({ ...p, qrCodeUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.name || !form.turfId || !form.date || !form.registrationEndDate) {
      return;
    }
    createTournament({ ...form, createdBy: "admin" });
    setForm({
      name: "",
      turfId: "",
      turfName: "",
      location: "",
      date: "",
      organizerName: "",
      winningPrize: 10000,
      maxTeams: 8,
      registrationEndDate: "",
      rules: "",
      contact1: "",
      contact2: "",
      entryFee: 500,
      qrCodeUrl: "",
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl flex items-center gap-2">
          <TrophyIcon size={20} className="text-green-600" /> Tournaments
        </h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white"
          data-ocid="admin.tournaments.primary_button"
        >
          {showForm ? "Cancel" : "Create Tournament"}
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border p-5 shadow-sm"
          data-ocid="admin.tournaments.panel"
        >
          <h3 className="font-semibold text-gray-800 mb-4">New Tournament</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Tournament Name *</Label>
              <Input
                className="mt-1"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Summer Cup 2026"
                data-ocid="admin.tournaments.input"
              />
            </div>
            <div>
              <Label>Turf *</Label>
              <Select value={form.turfId} onValueChange={handleTurfChange}>
                <SelectTrigger
                  className="mt-1"
                  data-ocid="admin.tournaments.select"
                >
                  <SelectValue placeholder="Select turf" />
                </SelectTrigger>
                <SelectContent>
                  {turfs.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Location *</Label>
              <Input
                className="mt-1"
                value={form.location}
                onChange={(e) =>
                  setForm((p) => ({ ...p, location: e.target.value }))
                }
                placeholder="City / Venue"
                data-ocid="admin.tournaments.input"
              />
            </div>
            <div>
              <Label>Date of Tournament *</Label>
              <Input
                type="date"
                className="mt-1"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                data-ocid="admin.tournaments.input"
              />
            </div>
            <div>
              <Label>Organizer Name</Label>
              <Input
                className="mt-1"
                value={form.organizerName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, organizerName: e.target.value }))
                }
                placeholder="Organizer"
                data-ocid="admin.tournaments.input"
              />
            </div>
            <div>
              <Label>Winning Prize (₹)</Label>
              <Input
                type="number"
                className="mt-1"
                value={form.winningPrize}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    winningPrize: Number(e.target.value),
                  }))
                }
                data-ocid="admin.tournaments.input"
              />
            </div>
            <div>
              <Label>Max Teams</Label>
              <Input
                type="number"
                className="mt-1"
                value={form.maxTeams}
                onChange={(e) =>
                  setForm((p) => ({ ...p, maxTeams: Number(e.target.value) }))
                }
                data-ocid="admin.tournaments.input"
              />
            </div>
            <div>
              <Label>Registration End Date *</Label>
              <Input
                type="date"
                className="mt-1"
                value={form.registrationEndDate}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    registrationEndDate: e.target.value,
                  }))
                }
                data-ocid="admin.tournaments.input"
              />
            </div>
            <div>
              <Label>Contact Number 1</Label>
              <Input
                className="mt-1"
                value={form.contact1}
                onChange={(e) =>
                  setForm((p) => ({ ...p, contact1: e.target.value }))
                }
                placeholder="Primary contact"
                data-ocid="admin.tournaments.input"
              />
            </div>
            <div>
              <Label>Contact Number 2</Label>
              <Input
                className="mt-1"
                value={form.contact2}
                onChange={(e) =>
                  setForm((p) => ({ ...p, contact2: e.target.value }))
                }
                placeholder="Secondary contact"
                data-ocid="admin.tournaments.input"
              />
            </div>
            <div>
              <Label>Entry Fee (₹)</Label>
              <Input
                type="number"
                className="mt-1"
                value={form.entryFee}
                onChange={(e) =>
                  setForm((p) => ({ ...p, entryFee: Number(e.target.value) }))
                }
                data-ocid="admin.tournaments.input"
              />
            </div>
            <div>
              <Label>Upload QR Code for Payment</Label>
              <input
                ref={qrRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleQrUpload}
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-1 w-full"
                onClick={() => qrRef.current?.click()}
                data-ocid="admin.tournaments.upload_button"
              >
                <Upload size={14} className="mr-1" /> Upload QR Code
              </Button>
              {form.qrCodeUrl && (
                <img
                  src={form.qrCodeUrl}
                  alt="QR Preview"
                  className="mt-2 w-24 h-24 object-contain rounded border border-border"
                />
              )}
            </div>
            <div className="sm:col-span-2">
              <Label>Rules and Regulations</Label>
              <Textarea
                className="mt-1 min-h-[100px]"
                value={form.rules}
                onChange={(e) =>
                  setForm((p) => ({ ...p, rules: e.target.value }))
                }
                placeholder="Tournament rules..."
                data-ocid="admin.tournaments.textarea"
              />
            </div>
          </div>
          <Button
            className="mt-4 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSubmit}
            data-ocid="admin.tournaments.submit_button"
          >
            Create Tournament
          </Button>
        </motion.div>
      )}

      {/* Tournament list */}
      <div className="space-y-3">
        {tournaments.length === 0 ? (
          <div
            className="text-center py-12 text-gray-400"
            data-ocid="admin.tournaments.empty_state"
          >
            No tournaments created yet.
          </div>
        ) : (
          tournaments.map((t, idx) => (
            <TournamentListCard
              key={t.id}
              tournament={t}
              index={idx + 1}
              registrationCount={
                tournamentRegistrations.filter((r) => r.tournamentId === t.id)
                  .length
              }
              onDelete={() => deleteTournament(t.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TournamentListCard({
  tournament,
  index,
  registrationCount,
  onDelete,
}: {
  tournament: Tournament;
  index: number;
  registrationCount: number;
  onDelete: () => void;
}) {
  return (
    <div
      className="bg-white rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      data-ocid={`admin.tournaments.item.${index}`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <TrophyIcon size={16} className="text-green-600" />
          <span className="font-semibold text-gray-800">{tournament.name}</span>
        </div>
        <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
          <span>Turf: {tournament.turfName}</span>
          <span>
            Date: {new Date(tournament.date).toLocaleDateString("en-IN")}
          </span>
          <span>Prize: ₹{tournament.winningPrize.toLocaleString()}</span>
          <span>
            Teams: {registrationCount}/{tournament.maxTeams}
          </span>
          <span>Location: {tournament.location}</span>
        </div>
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        data-ocid={`admin.tournaments.delete_button.${index}`}
      >
        <Trash2 size={14} className="mr-1" /> Delete
      </Button>
    </div>
  );
}

function AdminTournamentRegsTab() {
  const { tournamentRegistrations } = useApp();
  return (
    <div className="space-y-4">
      <h2 className="font-display font-bold text-xl flex items-center gap-2">
        <ClipboardCheck size={20} className="text-green-600" /> Tournament
        Registrations
      </h2>
      {tournamentRegistrations.length === 0 ? (
        <div
          className="text-center py-12 text-gray-400"
          data-ocid="admin.tournament-registrations.empty_state"
        >
          No team registrations yet.
        </div>
      ) : (
        <div
          className="overflow-x-auto rounded-xl border border-border"
          data-ocid="admin.tournament-registrations.table"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tournament</TableHead>
                <TableHead>Team Name</TableHead>
                <TableHead>Captain</TableHead>
                <TableHead>Contact 1</TableHead>
                <TableHead>Contact 2</TableHead>
                <TableHead>Players</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tournamentRegistrations.map((r, idx) => (
                <TableRow
                  key={r.id}
                  data-ocid={`admin.tournament-registrations.row.${idx + 1}`}
                >
                  <TableCell className="font-medium">
                    {r.tournamentName}
                  </TableCell>
                  <TableCell>{r.teamName}</TableCell>
                  <TableCell>{r.captainName}</TableCell>
                  <TableCell>{r.contact1}</TableCell>
                  <TableCell>{r.contact2 || "—"}</TableCell>
                  <TableCell>{r.numberOfPlayers}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700">Paid</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const {
    turfs,
    users,
    bookings,
    addTurf,
    editTurf,
    deleteTurf,
    createTurfOwner,
    approveBooking,
    rejectBooking,
  } = useApp();
  const [turfModal, setTurfModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [turfForm, setTurfForm] = useState<TurfForm>(emptyTurf);
  const [inlineOwner, setInlineOwner] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [ownerModal, setOwnerModal] = useState(false);
  const [ownerForm, setOwnerForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    turfId: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const totalRevenue = bookings.reduce(
    (s, b) => s + (b.paymentType === "full" ? b.totalPrice : b.advanceAmount),
    0,
  );
  const totalUsers = users.filter((u) => u.role === "user").length;

  const openAddTurf = () => {
    setEditingId(null);
    setTurfForm(emptyTurf);
    setInlineOwner({ name: "", email: "", password: "", phone: "" });
    setTurfModal(true);
  };
  const openEditTurf = (t: Turf) => {
    setEditingId(t.id);
    setTurfForm({ ...t, galleryImages: t.galleryImages || [] });
    setTurfModal(true);
  };

  const setF =
    (k: keyof TurfForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setTurfForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSaveTurf = () => {
    const turf: Omit<Turf, "id"> = {
      ...turfForm,
      ownerId: turfForm.ownerId || "",
      galleryImages: turfForm.galleryImages || [],
      facilities:
        typeof turfForm.facilities === "string"
          ? (turfForm.facilities as string)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : turfForm.facilities,
      safetyInfo:
        typeof turfForm.safetyInfo === "string"
          ? (turfForm.safetyInfo as string)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : turfForm.safetyInfo,
      pricePerHour: Number(turfForm.pricePerHour),
      nightPricePerHour: Number(turfForm.nightPricePerHour),
      advanceAmount: Number(turfForm.advanceAmount),
    };
    if (editingId) editTurf(editingId, turf);
    else {
      const createdTurf = addTurf(turf);
      if (inlineOwner.email) {
        createTurfOwner(
          inlineOwner.name,
          inlineOwner.email,
          inlineOwner.password,
          inlineOwner.phone,
          createdTurf.id,
        );
      }
    }
    setTurfModal(false);
  };

  const handleCreateOwner = () => {
    createTurfOwner(
      ownerForm.name,
      ownerForm.email,
      ownerForm.password,
      ownerForm.phone,
      ownerForm.turfId,
    );
    setOwnerModal(false);
    setOwnerForm({ name: "", email: "", password: "", phone: "", turfId: "" });
  };

  const statusInfo = (s: string) => {
    if (s === "fullyPaid") return { label: "Fully Paid", cls: "bg-green-600" };
    if (s === "advancePaid")
      return { label: "Advance Paid", cls: "bg-amber-500" };
    return { label: "Remaining Pending", cls: "bg-orange-500" };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16 min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-sidebar text-sidebar-foreground p-4 gap-1">
          <div className="px-2 py-3 mb-2">
            <p className="font-display font-bold text-lg text-white">
              Admin Panel
            </p>
            <p className="text-xs text-green-300">Platform Owner</p>
          </div>
          {[
            { icon: LayoutDashboard, label: "Overview", tab: "overview" },
            { icon: Layers, label: "Turfs", tab: "turfs" },
            { icon: ClipboardList, label: "Bookings", tab: "bookings" },
            { icon: Users, label: "Turf Owners", tab: "owners" },
          ].map(({ icon: Icon, label, tab }) => (
            <button
              type="button"
              key={tab}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Tabs defaultValue="overview">
            <TabsList className="mb-6 flex-wrap h-auto">
              <TabsTrigger value="overview" data-ocid="admin.tab">
                Overview
              </TabsTrigger>
              <TabsTrigger value="turfs" data-ocid="admin.tab">
                Turfs
              </TabsTrigger>
              <TabsTrigger value="bookings" data-ocid="admin.tab">
                Bookings
              </TabsTrigger>
              <TabsTrigger value="owners" data-ocid="admin.tab">
                Turf Owners
              </TabsTrigger>
              <TabsTrigger value="tournaments" data-ocid="admin.tab">
                <TrophyIcon size={16} className="mr-1" /> Tournaments
              </TabsTrigger>
              <TabsTrigger
                value="tournament-registrations"
                data-ocid="admin.tab"
              >
                <ClipboardCheck size={16} className="mr-1" /> Tournament
                Registrations
              </TabsTrigger>
              <TabsTrigger value="revenue" data-ocid="admin.tab">
                Daily Revenue
              </TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {[
                  {
                    label: "Total Turfs",
                    value: turfs.length,
                    color: "bg-green-50 border-green-200",
                  },
                  {
                    label: "Total Bookings",
                    value: bookings.length,
                    color: "bg-blue-50 border-blue-200",
                  },
                  {
                    label: "Total Users",
                    value: totalUsers,
                    color: "bg-purple-50 border-purple-200",
                  },
                  {
                    label: "Revenue",
                    value: `₹${totalRevenue}`,
                    color: "bg-amber-50 border-amber-200",
                  },
                ].map(({ label, value, color }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`${color} border rounded-2xl p-5`}
                  >
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-display font-bold text-3xl mt-1">
                      {value}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              <div className="mt-8 bg-white rounded-2xl p-5 border border-border shadow-sm">
                <h2 className="font-display font-bold text-xl mb-4">
                  Recent Bookings
                </h2>
                {bookings
                  .slice(-5)
                  .reverse()
                  .map((b, i) => (
                    <div
                      key={b.id}
                      className="flex justify-between items-center py-2 border-b last:border-0 text-sm"
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <div>
                        <span className="font-semibold">{b.userName}</span>
                        <span className="text-muted-foreground ml-2">
                          {b.turfName} • {b.date}
                        </span>
                      </div>
                      <Badge
                        className={`${statusInfo(b.paymentStatus).cls} text-white text-xs`}
                      >
                        {statusInfo(b.paymentStatus).label}
                      </Badge>
                    </div>
                  ))}
                {bookings.length === 0 && (
                  <p
                    className="text-muted-foreground text-sm"
                    data-ocid="admin.empty_state"
                  >
                    No bookings yet.
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Turfs */}
            <TabsContent value="turfs">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display font-bold text-xl">Manage Turfs</h2>
                <Button
                  className="bg-green-600 hover:bg-green-500 text-white"
                  onClick={openAddTurf}
                  data-ocid="admin.primary_button"
                >
                  <Plus size={16} className="mr-1" />
                  Add Turf
                </Button>
              </div>
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Turf</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Surface</TableHead>
                      <TableHead>Day/Night</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {turfs.map((t, i) => (
                      <TableRow key={t.id} data-ocid={`admin.row.${i + 1}`}>
                        <TableCell className="font-semibold">
                          {t.name}
                        </TableCell>
                        <TableCell>{t.location}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{t.surfaceType}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          ₹{t.pricePerHour} / ₹{t.nightPricePerHour}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditTurf(t)}
                              data-ocid={`admin.edit_button.${i + 1}`}
                            >
                              <Edit2 size={13} />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setDeleteConfirm(t.id)}
                              data-ocid={`admin.delete_button.${i + 1}`}
                            >
                              <Trash2 size={13} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {turfs.length === 0 && (
                  <p
                    className="text-center text-muted-foreground py-10"
                    data-ocid="admin.empty_state"
                  >
                    No turfs added yet.
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Bookings */}
            <TabsContent value="bookings">
              <h2 className="font-display font-bold text-xl mb-4">
                All Bookings
              </h2>
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-x-auto">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Turf</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Slots</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((b, i) => (
                      <TableRow key={b.id} data-ocid={`admin.row.${i + 1}`}>
                        <TableCell className="font-semibold text-sm">
                          {b.userName}
                        </TableCell>
                        <TableCell className="text-sm">{b.phone}</TableCell>
                        <TableCell className="text-sm">{b.turfName}</TableCell>
                        <TableCell className="text-sm">{b.date}</TableCell>
                        <TableCell className="text-xs max-w-[120px] truncate">
                          {b.slotLabels.join(", ")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${statusInfo(b.paymentStatus).cls} text-white text-xs`}
                          >
                            {statusInfo(b.paymentStatus).label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              b.status === "approved"
                                ? "default"
                                : b.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {b.status || "pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {b.status !== "approved" && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-500 text-white h-7 text-xs"
                                onClick={() => approveBooking(b.id)}
                                data-ocid={`admin.confirm_button.${i + 1}`}
                              >
                                Approve
                              </Button>
                            )}
                            {b.status !== "rejected" && (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-7 text-xs"
                                onClick={() => rejectBooking(b.id)}
                                data-ocid={`admin.delete_button.${i + 1}`}
                              >
                                Reject
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {bookings.length === 0 && (
                  <p
                    className="text-center text-muted-foreground py-10"
                    data-ocid="admin.empty_state"
                  >
                    No bookings yet.
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Owners */}
            <TabsContent value="owners">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display font-bold text-xl">Turf Owners</h2>
                <Button
                  className="bg-green-600 hover:bg-green-500 text-white"
                  onClick={() => setOwnerModal(true)}
                  data-ocid="admin.open_modal_button"
                >
                  <Plus size={16} className="mr-1" />
                  Create Owner
                </Button>
              </div>
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Assigned Turf</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter((u) => u.role === "turfOwner")
                      .map((u, i) => {
                        const t = turfs.find((t) => t.id === u.assignedTurfId);
                        return (
                          <TableRow key={u.id} data-ocid={`admin.row.${i + 1}`}>
                            <TableCell className="font-semibold text-sm">
                              {u.fullName}
                            </TableCell>
                            <TableCell className="text-sm">{u.email}</TableCell>
                            <TableCell className="text-sm">{u.phone}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {t?.name || "Unassigned"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
                {users.filter((u) => u.role === "turfOwner").length === 0 && (
                  <p
                    className="text-center text-muted-foreground py-10"
                    data-ocid="admin.empty_state"
                  >
                    No turf owners yet.
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Tournaments */}
            <TabsContent value="tournaments">
              <AdminTournamentsTab />
            </TabsContent>

            {/* Tournament Registrations */}
            <TabsContent value="tournament-registrations">
              <AdminTournamentRegsTab />
            </TabsContent>

            {/* Daily Revenue */}
            <TabsContent value="revenue">
              <AdminRevenuePanel bookings={bookings} />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Add/Edit Turf Modal */}
      <Dialog open={turfModal} onOpenChange={setTurfModal}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Turf" : "Add New Turf"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Turf Name</Label>
              <Input
                className="mt-1"
                value={turfForm.name}
                onChange={setF("name")}
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                className="mt-1"
                value={turfForm.location}
                onChange={setF("location")}
                data-ocid="admin.input"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                className="mt-1"
                value={turfForm.description}
                onChange={setF("description")}
                data-ocid="admin.textarea"
              />
            </div>
            <div>
              <Label>Day Price/hr (₹)</Label>
              <Input
                className="mt-1"
                type="number"
                value={turfForm.pricePerHour}
                onChange={setF("pricePerHour")}
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label>Night Price/hr (₹)</Label>
              <Input
                className="mt-1"
                type="number"
                value={turfForm.nightPricePerHour}
                onChange={setF("nightPricePerHour")}
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label>Advance Amount (₹)</Label>
              <Input
                className="mt-1"
                type="number"
                value={turfForm.advanceAmount}
                onChange={setF("advanceAmount")}
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label>Surface Type</Label>
              <Select
                value={turfForm.surfaceType}
                onValueChange={(v) =>
                  setTurfForm((f) => ({ ...f, surfaceType: v as SurfaceType }))
                }
              >
                <SelectTrigger className="mt-1" data-ocid="admin.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Artificial Grass">
                    Artificial Grass
                  </SelectItem>
                  <SelectItem value="Natural Grass">Natural Grass</SelectItem>
                  <SelectItem value="Hybrid Surface">Hybrid Surface</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Open Time (e.g. 6:00 AM)</Label>
              <Input
                className="mt-1"
                value={turfForm.openTime}
                onChange={setF("openTime")}
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label>Close Time (e.g. 11:00 PM)</Label>
              <Input
                className="mt-1"
                value={turfForm.closeTime}
                onChange={setF("closeTime")}
                data-ocid="admin.input"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Facilities (comma-separated)</Label>
              <Input
                className="mt-1"
                value={
                  Array.isArray(turfForm.facilities)
                    ? turfForm.facilities.join(", ")
                    : turfForm.facilities
                }
                onChange={setF("facilities" as keyof TurfForm)}
                data-ocid="admin.input"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Safety Info (comma-separated)</Label>
              <Input
                className="mt-1"
                value={
                  Array.isArray(turfForm.safetyInfo)
                    ? turfForm.safetyInfo.join(", ")
                    : turfForm.safetyInfo
                }
                onChange={setF("safetyInfo" as keyof TurfForm)}
                data-ocid="admin.input"
              />
            </div>

            {/* Images section */}
            <div className="sm:col-span-2">
              <div className="border-t border-border pt-4 mb-2">
                <p className="font-semibold text-sm flex items-center gap-1.5 mb-3">
                  <ImagePlus size={16} className="text-green-500" />
                  Turf Images
                </p>
              </div>
            </div>

            <div className="sm:col-span-2">
              <ImageUploadField
                label="Main Turf Image"
                value={turfForm.imageUrl}
                onChange={(v) => setTurfForm((f) => ({ ...f, imageUrl: v }))}
                ocid="admin.image"
              />
            </div>

            <div className="sm:col-span-2">
              <GalleryUploadField
                images={turfForm.galleryImages || []}
                onChange={(imgs) =>
                  setTurfForm((f) => ({ ...f, galleryImages: imgs }))
                }
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUploadField
                label="Payment QR Code"
                value={turfForm.qrCodeUrl || ""}
                onChange={(v) => setTurfForm((f) => ({ ...f, qrCodeUrl: v }))}
                ocid="admin.qr"
                helperText="This QR code will be shown to users on the payment page."
              />
            </div>

            {/* Turf Owner Account (only on Add) */}
            {!editingId && (
              <>
                <div className="sm:col-span-2">
                  <div className="border-t border-border pt-4 mb-2">
                    <p className="font-semibold text-sm flex items-center gap-1.5 mb-1">
                      <span className="text-green-500">👤</span>
                      Turf Owner Account
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Fill in these details to automatically create a Turf Owner
                      login for this turf.
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Owner Name</Label>
                  <Input
                    className="mt-1"
                    placeholder="e.g. Rajesh Patil"
                    value={inlineOwner.name}
                    onChange={(e) =>
                      setInlineOwner((o) => ({ ...o, name: e.target.value }))
                    }
                    data-ocid="admin.input"
                  />
                </div>
                <div>
                  <Label>Owner Contact Number</Label>
                  <Input
                    className="mt-1"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={inlineOwner.phone}
                    onChange={(e) =>
                      setInlineOwner((o) => ({ ...o, phone: e.target.value }))
                    }
                    data-ocid="admin.input"
                  />
                </div>
                <div>
                  <Label>Owner Email</Label>
                  <Input
                    className="mt-1"
                    type="email"
                    placeholder="owner@email.com"
                    value={inlineOwner.email}
                    onChange={(e) =>
                      setInlineOwner((o) => ({ ...o, email: e.target.value }))
                    }
                    data-ocid="admin.input"
                  />
                </div>
                <div>
                  <Label>Owner Password</Label>
                  <Input
                    className="mt-1"
                    type="password"
                    placeholder="Set a login password"
                    value={inlineOwner.password}
                    onChange={(e) =>
                      setInlineOwner((o) => ({
                        ...o,
                        password: e.target.value,
                      }))
                    }
                    data-ocid="admin.input"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex gap-3 mt-4">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-500 text-white"
              onClick={handleSaveTurf}
              data-ocid="admin.save_button"
            >
              {editingId ? "Save Changes" : "Add Turf"}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setTurfModal(false)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Owner Modal */}
      <Dialog open={ownerModal} onOpenChange={setOwnerModal}>
        <DialogContent data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle>Create Turf Owner</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Full Name</Label>
              <Input
                className="mt-1"
                value={ownerForm.name}
                onChange={(e) =>
                  setOwnerForm((f) => ({ ...f, name: e.target.value }))
                }
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                className="mt-1"
                type="email"
                value={ownerForm.email}
                onChange={(e) =>
                  setOwnerForm((f) => ({ ...f, email: e.target.value }))
                }
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                className="mt-1"
                type="password"
                value={ownerForm.password}
                onChange={(e) =>
                  setOwnerForm((f) => ({ ...f, password: e.target.value }))
                }
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                className="mt-1"
                type="tel"
                value={ownerForm.phone}
                onChange={(e) =>
                  setOwnerForm((f) => ({ ...f, phone: e.target.value }))
                }
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label>Assign Turf</Label>
              <Select
                value={ownerForm.turfId}
                onValueChange={(v) =>
                  setOwnerForm((f) => ({ ...f, turfId: v }))
                }
              >
                <SelectTrigger className="mt-1" data-ocid="admin.select">
                  <SelectValue placeholder="Select a turf" />
                </SelectTrigger>
                <SelectContent>
                  {turfs.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} — {t.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-500 text-white"
              onClick={handleCreateOwner}
              data-ocid="admin.confirm_button"
            >
              Create Owner
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOwnerModal(false)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle>Delete Turf?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            This action cannot be undone. All associated data will be removed.
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                if (deleteConfirm) {
                  deleteTurf(deleteConfirm);
                  setDeleteConfirm(null);
                }
              }}
              data-ocid="admin.confirm_button"
            >
              Delete
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDeleteConfirm(null)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
