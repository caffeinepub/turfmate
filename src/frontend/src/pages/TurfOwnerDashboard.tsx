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
  ChevronDown,
  ClipboardCheck,
  Clock,
  Edit2,
  MapPin,
  Moon,
  Save,
  Sun,
  Trash2,
  TrendingUp,
  Trophy as TrophyIcon,
  Upload,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";
import type { TimeSlot, Tournament } from "../types";

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
      b.paymentStatus === "fullyPaid" ? b.totalPrice : b.advanceAmount;
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

function OwnerSettingsTab() {
  const { currentUser, updateTurfOwner } = useApp();
  const [form, setForm] = useState({
    email: currentUser?.email ?? "",
    phone: currentUser?.phone ?? "",
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;
    if (form.password && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const updates: { email?: string; phone?: string; password?: string } = {};
    if (form.email) updates.email = form.email;
    if (form.phone) updates.phone = form.phone;
    if (form.password) updates.password = form.password;
    updateTurfOwner(currentUser.id, updates);
    setSuccess("Settings updated successfully!");
    setError("");
    setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
  }

  return (
    <div className="max-w-lg">
      <h2 className="font-display font-bold text-xl mb-4">Account Settings</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Update your email, contact number, or password.
      </p>
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-5">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="settings-email">Email / Gmail</Label>
            <input
              id="settings-email"
              type="email"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="owner@email.com"
              data-ocid="owner.settings.input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-phone">Contact Number</Label>
            <input
              id="settings-phone"
              type="tel"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 9876543210"
              data-ocid="owner.settings.input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-password">New Password</Label>
            <input
              id="settings-password"
              type="password"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Leave blank to keep current"
              data-ocid="owner.settings.input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-confirm">Confirm Password</Label>
            <input
              id="settings-confirm"
              type="password"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              placeholder="Confirm new password"
              data-ocid="owner.settings.input"
            />
          </div>
          {error && (
            <p
              className="text-red-600 text-sm"
              data-ocid="owner.settings.error_state"
            >
              {error}
            </p>
          )}
          {success && (
            <p
              className="text-green-600 text-sm"
              data-ocid="owner.settings.success_state"
            >
              {success}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl py-2.5 transition-colors"
            data-ocid="owner.settings.save_button"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

function OwnerTournamentsTab() {
  const {
    currentUser,
    turfs,
    tournaments,
    tournamentRegistrations,
    createTournament,
    deleteTournament,
  } = useApp();
  const myTurfId = currentUser?.assignedTurfId ?? "";
  const myTurf = turfs.find((t) => t.id === myTurfId);
  const myTournaments = tournaments.filter(
    (t) => t.turfId === myTurfId || t.createdBy === currentUser?.id,
  );

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    date: "",
    organizerName: "",
    winningPrize: 10000,
    maxTeams: 8,
    playersPerTeam: 0,
    registrationEndDate: "",
    rules: "",
    contact1: "",
    contact2: "",
    entryFee: 500,
    qrCodeUrl: "",
  });
  const qrRef = useRef<HTMLInputElement>(null);

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setForm((p) => ({ ...p, qrCodeUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.name || !form.date || !form.registrationEndDate) return;
    const now = new Date();
    const tournamentDate = new Date(form.date);
    if (tournamentDate <= now) {
      alert("Tournament date has already passed. Please select a future date.");
      return;
    }
    const regEndDate = new Date(form.registrationEndDate);
    if (regEndDate <= now) {
      alert(
        "Registration end date has already passed. Please select a future date.",
      );
      return;
    }
    createTournament({
      ...form,
      turfId: myTurfId,
      turfName: myTurf?.name ?? "",
      createdBy: currentUser?.id ?? "",
    });
    setForm({
      name: "",
      location: "",
      date: "",
      organizerName: "",
      winningPrize: 10000,
      maxTeams: 8,
      playersPerTeam: 0,
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
        <button
          type="button"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
          onClick={() => setShowForm(!showForm)}
          data-ocid="owner.tournaments.primary_button"
        >
          {showForm ? "Cancel" : "Create Tournament"}
        </button>
      </div>

      {myTurf && (
        <div className="text-sm text-gray-500 bg-green-50 rounded-lg px-3 py-2 border border-green-100">
          Creating tournament for:{" "}
          <span className="font-semibold text-green-700">{myTurf.name}</span>
        </div>
      )}

      {showForm && (
        <div
          className="bg-white rounded-2xl border border-border p-5 shadow-sm"
          data-ocid="owner.tournaments.panel"
        >
          <h3 className="font-semibold text-gray-800 mb-4">New Tournament</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700 block">
                Tournament Name *
              </span>
              <input
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Summer Cup 2026"
                data-ocid="owner.tournaments.input"
              />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 block">
                Location
              </span>
              <input
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm"
                value={form.location}
                onChange={(e) =>
                  setForm((p) => ({ ...p, location: e.target.value }))
                }
                placeholder="City / Venue"
                data-ocid="owner.tournaments.input"
              />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 block">
                Date of Tournament *
              </span>
              <input
                type="date"
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                data-ocid="owner.tournaments.input"
              />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 block">
                Organizer Name
              </span>
              <input
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm"
                value={form.organizerName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, organizerName: e.target.value }))
                }
                placeholder="Organizer"
                data-ocid="owner.tournaments.input"
              />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 block">
                Winning Prize (₹)
              </span>
              <input
                type="number"
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm"
                value={form.winningPrize}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    winningPrize: Number(e.target.value),
                  }))
                }
                data-ocid="owner.tournaments.input"
              />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 block">
                Max Teams
              </span>
              <input
                type="number"
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm"
                value={form.maxTeams}
                onChange={(e) =>
                  setForm((p) => ({ ...p, maxTeams: Number(e.target.value) }))
                }
                data-ocid="owner.tournaments.input"
              />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 block">
                Players Per Team (0 = no restriction)
              </span>
              <input
                type="number"
                min={0}
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm"
                value={form.playersPerTeam}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    playersPerTeam: Number(e.target.value),
                  }))
                }
                placeholder="e.g. 7 or 11"
                data-ocid="owner.tournaments.input"
              />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 block">
                Registration End Date *
              </span>
              <input
                type="date"
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm"
                value={form.registrationEndDate}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    registrationEndDate: e.target.value,
                  }))
                }
                data-ocid="owner.tournaments.input"
              />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 block">
                Entry Fee (₹)
              </span>
              <input
                type="number"
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm"
                value={form.entryFee}
                onChange={(e) =>
                  setForm((p) => ({ ...p, entryFee: Number(e.target.value) }))
                }
                data-ocid="owner.tournaments.input"
              />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 block">
                Contact Number 1
              </span>
              <input
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm"
                value={form.contact1}
                onChange={(e) =>
                  setForm((p) => ({ ...p, contact1: e.target.value }))
                }
                placeholder="Primary"
                data-ocid="owner.tournaments.input"
              />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 block">
                Contact Number 2
              </span>
              <input
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm"
                value={form.contact2}
                onChange={(e) =>
                  setForm((p) => ({ ...p, contact2: e.target.value }))
                }
                placeholder="Secondary"
                data-ocid="owner.tournaments.input"
              />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 block">
                Upload QR Code
              </span>
              <input
                ref={qrRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleQrUpload}
              />
              <button
                type="button"
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm flex items-center justify-center gap-2 hover:bg-gray-50"
                onClick={() => qrRef.current?.click()}
                data-ocid="owner.tournaments.upload_button"
              >
                <Upload size={14} /> Upload QR
              </button>
              {form.qrCodeUrl && (
                <img
                  src={form.qrCodeUrl}
                  alt="QR"
                  className="mt-2 w-20 h-20 object-contain rounded border border-border"
                />
              )}
            </div>
            <div className="sm:col-span-2">
              <span className="text-sm font-medium text-gray-700 block">
                Rules and Regulations
              </span>
              <textarea
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm min-h-[80px] resize-y"
                value={form.rules}
                onChange={(e) =>
                  setForm((p) => ({ ...p, rules: e.target.value }))
                }
                placeholder="Tournament rules..."
                data-ocid="owner.tournaments.textarea"
              />
            </div>
          </div>
          <button
            type="button"
            className="mt-4 px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
            onClick={handleSubmit}
            data-ocid="owner.tournaments.submit_button"
          >
            Create Tournament
          </button>
        </div>
      )}

      <div className="space-y-3">
        {myTournaments.length === 0 ? (
          <div
            className="text-center py-10 text-gray-400"
            data-ocid="owner.tournaments.empty_state"
          >
            No tournaments yet.
          </div>
        ) : (
          myTournaments.map((t, idx) => (
            <OwnerTournamentCard
              key={t.id}
              tournament={t}
              index={idx + 1}
              registrations={tournamentRegistrations.filter(
                (r) => r.tournamentId === t.id,
              )}
              onDelete={() => deleteTournament(t.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function OwnerTournamentCard({
  tournament,
  index,
  registrations,
  onDelete,
}: {
  tournament: Tournament;
  index: number;
  registrations: import("../types").TournamentRegistration[];
  onDelete: () => void;
}) {
  const [activeSection, setActiveSection] = useState<
    "details" | "teams" | "payments"
  >("details");
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-white rounded-xl border border-border shadow-sm overflow-hidden"
      data-ocid={`owner.tournaments.item.${index}`}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-700 to-green-600">
        <button
          type="button"
          className="flex items-center gap-2 text-white font-semibold text-base flex-1 text-left"
          onClick={() => setExpanded(!expanded)}
        >
          <TrophyIcon size={16} className="shrink-0" />
          <span>{tournament.name}</span>
          <ChevronDown
            size={16}
            className={`ml-auto transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
        <button
          type="button"
          className="ml-3 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg flex items-center gap-1 shrink-0"
          onClick={onDelete}
          data-ocid={`owner.tournaments.delete_button.${index}`}
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-2 bg-green-50 text-xs text-gray-600 border-b border-border">
        <span>{new Date(tournament.date).toLocaleDateString("en-IN")}</span>
        <span>₹{tournament.winningPrize.toLocaleString()} prize</span>
        <span className="font-medium text-green-700">
          {registrations.length}/{tournament.maxTeams} teams
        </span>
        {tournament.playersPerTeam > 0 && (
          <span className="font-medium text-blue-700">
            {tournament.playersPerTeam} players/team
          </span>
        )}
      </div>

      {expanded && (
        <div>
          <div className="flex border-b border-border bg-gray-50">
            {(["details", "teams", "payments"] as const).map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setActiveSection(sec)}
                className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
                  activeSection === sec
                    ? "bg-white text-green-700 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                data-ocid="owner.tournaments.tab"
              >
                {sec === "teams"
                  ? `Teams (${registrations.length})`
                  : sec === "payments"
                    ? "Payments"
                    : "Details"}
              </button>
            ))}
          </div>

          <div className="p-4">
            {activeSection === "details" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">Location:</span>{" "}
                  <span className="font-medium">
                    {tournament.location || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Organizer:</span>{" "}
                  <span className="font-medium">
                    {tournament.organizerName || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Entry Fee:</span>{" "}
                  <span className="font-medium">
                    ₹{tournament.entryFee.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Max Teams:</span>{" "}
                  <span className="font-medium">{tournament.maxTeams}</span>
                </div>
                <div>
                  <span className="text-gray-400">Players/Team:</span>{" "}
                  <span className="font-medium">
                    {tournament.playersPerTeam > 0
                      ? tournament.playersPerTeam
                      : "No restriction"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Reg. End Date:</span>{" "}
                  <span className="font-medium">
                    {new Date(
                      tournament.registrationEndDate,
                    ).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Contact 1:</span>{" "}
                  <span className="font-medium">
                    {tournament.contact1 || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Contact 2:</span>{" "}
                  <span className="font-medium">
                    {tournament.contact2 || "—"}
                  </span>
                </div>
                {tournament.rules && (
                  <div className="sm:col-span-2">
                    <span className="text-gray-400">Rules:</span>
                    <p className="mt-1 text-gray-700 whitespace-pre-line bg-gray-50 rounded p-2 text-xs">
                      {tournament.rules}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeSection === "teams" && (
              <div>
                {registrations.length === 0 ? (
                  <p
                    className="text-center py-6 text-gray-400 text-sm"
                    data-ocid="owner.tournaments.teams.empty_state"
                  >
                    No teams registered yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500 font-medium mb-2">
                      {registrations.length} team
                      {registrations.length !== 1 ? "s" : ""} registered
                    </p>
                    {registrations.map((r, i) => (
                      <div
                        key={r.id}
                        className="bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-xl p-4 text-sm"
                        data-ocid={`owner.tournaments.teams.item.${i + 1}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold shrink-0">
                              {i + 1}
                            </span>
                            <span className="font-bold text-gray-800 text-base">
                              {r.teamName}
                            </span>
                          </div>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                          >
                            {r.paymentStatus === "paid" ? "Paid" : "Pending"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                          <div>
                            <span className="text-gray-400 text-xs">
                              Captain
                            </span>
                            <p className="font-medium text-gray-800">
                              {r.captainName}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs">
                              Players
                            </span>
                            <p className="font-medium text-gray-800">
                              {r.numberOfPlayers}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs">
                              Contact 1
                            </span>
                            <p className="font-medium text-gray-800">
                              {r.contact1 || "—"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs">
                              Contact 2
                            </span>
                            <p className="font-medium text-gray-800">
                              {r.contact2 || "—"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-400 text-xs">
                              Registered At
                            </span>
                            <p className="font-medium text-gray-800">
                              {new Date(r.registeredAt).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === "payments" && (
              <div>
                {registrations.length === 0 ? (
                  <p className="text-center py-6 text-gray-400 text-sm">
                    No registrations yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-border">
                          <th className="px-3 py-2 text-left font-medium text-gray-600">
                            Team
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">
                            Captain
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">
                            Entry Fee
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">
                            Status
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">
                            Registered At
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {registrations.map((r) => (
                          <tr key={r.id}>
                            <td className="px-3 py-2 font-medium">
                              {r.teamName}
                            </td>
                            <td className="px-3 py-2">{r.captainName}</td>
                            <td className="px-3 py-2">
                              ₹{tournament.entryFee.toLocaleString()}
                            </td>
                            <td className="px-3 py-2">
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                                Paid
                              </span>
                            </td>
                            <td className="px-3 py-2 text-gray-500">
                              {new Date(r.registeredAt).toLocaleDateString(
                                "en-IN",
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function OwnerTournamentRegsTab() {
  const { currentUser, tournamentRegistrations, tournaments } = useApp();
  const myTurfId = currentUser?.assignedTurfId ?? "";
  const myTournaments = tournaments.filter(
    (t) => t.turfId === myTurfId || t.createdBy === currentUser?.id,
  );
  const myTournamentIds = myTournaments.map((t) => t.id);
  const myRegs = tournamentRegistrations.filter((r) =>
    myTournamentIds.includes(r.tournamentId),
  );

  // Group registrations by tournament
  const grouped = myTournaments.reduce<
    Record<
      string,
      { tournament: (typeof myTournaments)[0]; regs: typeof myRegs }
    >
  >((acc, t) => {
    const regs = myRegs.filter((r) => r.tournamentId === t.id);
    if (regs.length > 0) {
      acc[t.id] = { tournament: t, regs };
    }
    return acc;
  }, {});
  const groupKeys = Object.keys(grouped);

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-xl flex items-center gap-2">
        <ClipboardCheck size={20} className="text-green-600" /> Tournament
        Registrations
      </h2>
      {myRegs.length === 0 ? (
        <div
          className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200"
          data-ocid="owner.tournament-registrations.empty_state"
        >
          No team registrations yet.
        </div>
      ) : (
        <div
          className="space-y-6"
          data-ocid="owner.tournament-registrations.table"
        >
          {groupKeys.map((tId, gIdx) => {
            const { tournament, regs } = grouped[tId];
            return (
              <div
                key={tId}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                data-ocid={`owner.tournament-registrations.panel.${gIdx + 1}`}
              >
                {/* Tournament Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrophyIcon size={20} className="text-white" />
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {tournament.name}
                      </h3>
                      <p className="text-green-100 text-sm">
                        {tournament.location} &bull; {tournament.date}
                      </p>
                    </div>
                  </div>
                  <span className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {regs.length} / {tournament.maxTeams} Teams
                  </span>
                </div>
                {/* Registrations Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">
                          #
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">
                          Team Name
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">
                          Captain
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">
                          Contact 1
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">
                          Players
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">
                          Payment
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {regs.map((r, idx) => (
                        <tr
                          key={r.id}
                          className="hover:bg-green-50 transition-colors"
                          data-ocid={`owner.tournament-registrations.row.${idx + 1}`}
                        >
                          <td className="px-4 py-3 text-gray-400 font-medium">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-800">
                            {r.teamName}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {r.captainName}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {r.contact1}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {r.numberOfPlayers}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              ✓ Paid
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
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
    name: turf?.name ?? "",
    location: turf?.location ?? "",
    description: turf?.description ?? "",
    pricePerHour: turf?.pricePerHour ?? 0,
    nightPricePerHour: turf?.nightPricePerHour ?? 0,
    advanceAmount: turf?.advanceAmount ?? 0,
    openTime: turf?.openTime ?? "6:00 AM",
    closeTime: turf?.closeTime ?? "11:00 PM",
    facilities: turf?.facilities?.join(", ") ?? "",
    safetyInfo: turf?.safetyInfo?.join(", ") ?? "",
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
    if (s === "fullyPaid") return { label: "Done", cls: "bg-green-600" };
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
    <div className="min-h-screen bg-[#050c06]">
      <Navbar />
      <main className="pt-16 pb-12">
        {/* Header */}
        <div
          className="relative text-white py-8 px-4 overflow-hidden"
          style={{
            backgroundImage:
              "url(/assets/generated/dashboard-bg.dim_1920x1080.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="absolute inset-0 bg-[#061209]/80"
            style={{
              backgroundImage:
                "url(/assets/generated/turf-hero-bg.dim_1920x1080.jpg)",
              backgroundSize: "cover",
            }}
          />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <img
                src={turf.imageUrl}
                alt={turf.name}
                className="w-20 h-20 rounded-xl object-cover ring-2 ring-green-400/50"
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
              <TabsTrigger value="tournaments" data-ocid="owner.tab">
                <TrophyIcon size={16} className="mr-1" /> Tournaments
              </TabsTrigger>
              <TabsTrigger
                value="tournament-registrations"
                data-ocid="owner.tab"
              >
                <ClipboardCheck size={16} className="mr-1" /> Registrations
              </TabsTrigger>
              <TabsTrigger value="revenue" data-ocid="owner.tab">
                Daily Revenue
              </TabsTrigger>
              <TabsTrigger value="settings" data-ocid="owner.tab">
                Settings
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

                <div className="flex flex-wrap gap-4 mb-4 text-xs font-semibold">
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-600/20 border border-green-500/40 text-green-300">
                    <span className="w-3.5 h-3.5 rounded bg-gradient-to-br from-green-500 to-green-700 border border-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
                    Available – click to mark booked
                  </span>
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-300">
                    <span className="w-3.5 h-3.5 rounded bg-gradient-to-br from-red-500 to-red-700 border border-red-400 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
                    Booked – click to reopen
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Turf Name</Label>
                      <Input
                        className="mt-1"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, name: e.target.value }))
                        }
                        placeholder="e.g. Green Arena"
                        data-ocid="owner.input"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        className="mt-1"
                        value={editForm.location}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            location: e.target.value,
                          }))
                        }
                        placeholder="e.g. Kolhapur, MH"
                        data-ocid="owner.input"
                      />
                    </div>
                  </div>
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
                    <Label>Advance Payment Amount (₹)</Label>
                    <Input
                      className="mt-1"
                      type="number"
                      value={editForm.advanceAmount}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          advanceAmount: Number(e.target.value),
                        }))
                      }
                      data-ocid="owner.input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Open Time</Label>
                      <Input
                        className="mt-1"
                        value={editForm.openTime}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            openTime: e.target.value,
                          }))
                        }
                        placeholder="e.g. 6:00 AM"
                        data-ocid="owner.input"
                      />
                    </div>
                    <div>
                      <Label>Close Time</Label>
                      <Input
                        className="mt-1"
                        value={editForm.closeTime}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            closeTime: e.target.value,
                          }))
                        }
                        placeholder="e.g. 11:00 PM"
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
                    <Label>Safety Info (comma-separated)</Label>
                    <Input
                      className="mt-1"
                      value={editForm.safetyInfo}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          safetyInfo: e.target.value,
                        }))
                      }
                      placeholder="e.g. First Aid Kit, CCTV"
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
                        name: editForm.name,
                        location: editForm.location,
                        description: editForm.description,
                        pricePerHour: editForm.pricePerHour,
                        nightPricePerHour: editForm.nightPricePerHour,
                        advanceAmount: editForm.advanceAmount,
                        openTime: editForm.openTime,
                        closeTime: editForm.closeTime,
                        facilities: editForm.facilities
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                        safetyInfo: editForm.safetyInfo
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

            {/* Tournaments */}
            <TabsContent value="tournaments">
              <OwnerTournamentsTab />
            </TabsContent>

            {/* Tournament Registrations */}
            <TabsContent value="tournament-registrations">
              <OwnerTournamentRegsTab />
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings">
              <OwnerSettingsTab />
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
