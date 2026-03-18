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
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  MapPin,
  QrCode,
  Trophy,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";
import type { Tournament } from "../types";

function TournamentCard({ tournament }: { tournament: Tournament }) {
  const { tournamentRegistrations, registerForTournament, currentUser } =
    useApp();
  const [showRules, setShowRules] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [form, setForm] = useState({
    teamName: "",
    captainName: "",
    contact1: "",
    contact2: "",
    numberOfPlayers: 5,
  });
  const [success, setSuccess] = useState(false);

  const registeredCount = tournamentRegistrations.filter(
    (r) => r.tournamentId === tournament.id,
  ).length;

  const today = new Date().toISOString().split("T")[0];
  const isFull = registeredCount >= tournament.maxTeams;
  const isRegClosed =
    today > tournament.registrationEndDate || today > tournament.date;
  const canRegister = !isFull && !isRegClosed;

  const handleRegister = () => {
    if (!form.teamName || !form.captainName || !form.contact1) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const finalPlayers =
      tournament.playersPerTeam > 0
        ? tournament.playersPerTeam
        : form.numberOfPlayers;
    registerForTournament({
      tournamentId: tournament.id,
      tournamentName: tournament.name,
      teamName: form.teamName,
      captainName: form.captainName,
      contact1: form.contact1,
      contact2: form.contact2,
      numberOfPlayers: finalPlayers,
      paymentStatus: "paid",
      userId: currentUser?.id ?? "",
    });
    setSuccess(true);
    setTimeout(() => {
      setRegisterOpen(false);
      setSuccess(false);
      setForm({
        teamName: "",
        captainName: "",
        contact1: "",
        contact2: "",
        numberOfPlayers: 5,
      });
    }, 1800);
  };

  const teamFillPercent = Math.min(
    100,
    Math.round((registeredCount / tournament.maxTeams) * 100),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0c1508] border border-amber-900/30 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden"
      data-ocid="tournaments.card"
    >
      {/* Card Header */}
      <div
        className="relative px-5 py-4 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(120,53,15,0.5), rgba(92,56,8,0.4))",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url('/assets/generated/tournament-bg.dim_1920x600.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-white text-lg leading-tight">
              {tournament.name}
            </h3>
            <span
              className="shrink-0 text-white font-bold text-sm px-3 py-1 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(161,98,7,0.9), rgba(120,53,15,0.9))",
                border: "1px solid rgba(251,191,36,0.4)",
              }}
            >
              ₹{tournament.winningPrize.toLocaleString()}
            </span>
          </div>
          <p className="text-amber-200/70 text-sm mt-1 flex items-center gap-1">
            <Trophy size={12} /> {tournament.turfName}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-white/60">
            <MapPin size={14} className="text-amber-500/70 shrink-0" />
            <span>{tournament.location}</span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <CalendarDays size={14} className="text-amber-500/70 shrink-0" />
            <span>{new Date(tournament.date).toLocaleDateString("en-IN")}</span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <Users size={14} className="text-amber-500/70 shrink-0" />
            <span>
              {registeredCount} / {tournament.maxTeams} Teams
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-amber-400 shrink-0" />
            <span className="text-amber-400 font-medium text-xs">
              Reg. ends:{" "}
              {new Date(tournament.registrationEndDate).toLocaleDateString(
                "en-IN",
              )}
            </span>
          </div>
        </div>

        {/* Team progress */}
        <div>
          <div className="flex justify-between text-xs text-white/40 mb-1">
            <span>Teams Registered</span>
            <span>{teamFillPercent}%</span>
          </div>
          <div className="h-2 bg-amber-900/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${teamFillPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">Entry Fee:</span>
          <span className="font-bold text-amber-400">
            ₹{tournament.entryFee.toLocaleString()}
          </span>
        </div>

        {/* Rules toggle */}
        <button
          type="button"
          onClick={() => setShowRules(!showRules)}
          className="flex items-center gap-1 text-sm text-amber-400/70 font-medium hover:text-amber-300 transition-colors"
          data-ocid="tournaments.toggle"
        >
          {showRules ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showRules ? "Hide Rules" : "Show Rules"}
        </button>

        <AnimatePresence>
          {showRules && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-amber-950/30 border border-amber-800/30 rounded-lg p-3 text-sm text-amber-100/60 whitespace-pre-line">
                {tournament.rules || "No rules specified."}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        {isFull ? (
          <div className="space-y-1">
            <button
              type="button"
              disabled
              className="w-full bg-gray-900/50 border border-gray-700/40 text-gray-500 rounded-xl cursor-not-allowed py-2 text-sm font-semibold"
              data-ocid="tournaments.button"
            >
              Register for Tournament
            </button>
            <p className="text-xs text-center text-red-400/70 font-medium">
              Registration Closed – Maximum Teams Reached.
            </p>
          </div>
        ) : isRegClosed ? (
          <div className="space-y-1">
            <button
              type="button"
              disabled
              className="w-full bg-gray-900/50 border border-gray-700/40 text-gray-500 rounded-xl cursor-not-allowed py-2 text-sm font-semibold"
              data-ocid="tournaments.button"
            >
              Register for Tournament
            </button>
            <p className="text-xs text-center text-red-400/70 font-medium">
              Registration closed. The deadline for this tournament has passed.
            </p>
          </div>
        ) : (
          <button
            type="button"
            className="btn-amber w-full text-sm py-2"
            onClick={() => setRegisterOpen(true)}
            data-ocid="tournaments.primary_button"
          >
            Register for Tournament
          </button>
        )}
      </div>

      {/* Registration Modal */}
      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent
          className="max-w-md max-h-[90vh] overflow-y-auto"
          data-ocid="tournaments.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-green-700 font-display">
              {tournament.name}
            </DialogTitle>
          </DialogHeader>

          {success ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3 py-8 text-center"
              data-ocid="tournaments.success_state"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Trophy size={32} className="text-green-600" />
              </div>
              <p className="font-bold text-lg text-green-700">
                Registration Successful!
              </p>
              <p className="text-sm text-gray-500">
                Your team has been registered. Good luck!
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="teamName">Team Name *</Label>
                <Input
                  id="teamName"
                  className="mt-1"
                  value={form.teamName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, teamName: e.target.value }))
                  }
                  placeholder="e.g. Red Dragons FC"
                  data-ocid="tournaments.input"
                />
              </div>
              <div>
                <Label htmlFor="captainName">Captain Name *</Label>
                <Input
                  id="captainName"
                  className="mt-1"
                  value={form.captainName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, captainName: e.target.value }))
                  }
                  placeholder="Team captain"
                  data-ocid="tournaments.input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="tContact1">Contact Number 1 *</Label>
                  <Input
                    id="tContact1"
                    className="mt-1"
                    value={form.contact1}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, contact1: e.target.value }))
                    }
                    placeholder="Primary"
                    data-ocid="tournaments.input"
                  />
                </div>
                <div>
                  <Label htmlFor="tContact2">Contact Number 2</Label>
                  <Input
                    id="tContact2"
                    className="mt-1"
                    value={form.contact2}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, contact2: e.target.value }))
                    }
                    placeholder="Secondary"
                    data-ocid="tournaments.input"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="numPlayers">Number of Players *</Label>
                {tournament.playersPerTeam > 0 ? (
                  <div className="mt-1">
                    <Input
                      id="numPlayers"
                      type="number"
                      className="mt-1 bg-gray-50"
                      value={tournament.playersPerTeam}
                      readOnly
                      disabled
                      data-ocid="tournaments.input"
                    />
                    <p className="text-xs text-blue-600 mt-1 font-medium">
                      Fixed: {tournament.playersPerTeam} players per team (set
                      by organizer)
                    </p>
                  </div>
                ) : (
                  <Input
                    id="numPlayers"
                    type="number"
                    min={1}
                    max={30}
                    className="mt-1"
                    value={form.numberOfPlayers}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        numberOfPlayers: Number(e.target.value),
                      }))
                    }
                    data-ocid="tournaments.input"
                  />
                )}
              </div>

              <Separator />

              {/* Payment info */}
              <div className="bg-green-50 rounded-xl p-4 space-y-3 border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Tournament Entry Fee
                  </span>
                  <span className="font-bold text-green-700 text-lg">
                    ₹{tournament.entryFee.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-orange-600 font-medium">
                  Full payment required to complete registration.
                </p>
                <div className="flex flex-col items-center gap-2">
                  {tournament.qrCodeUrl ? (
                    <>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <QrCode size={14} />
                        <span>Scan QR Code to Pay</span>
                      </div>
                      <img
                        src={tournament.qrCodeUrl}
                        alt="Payment QR Code"
                        className="w-40 h-40 object-contain rounded-lg border border-border"
                      />
                    </>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      QR Code not available
                    </p>
                  )}
                  <p className="text-xs text-center text-gray-500">
                    Scan the QR code above and pay the full entry fee
                  </p>
                </div>
              </div>

              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                onClick={handleRegister}
                disabled={!canRegister}
                data-ocid="tournaments.submit_button"
              >
                I Have Paid Tournament Fee
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default function TournamentsPage() {
  const { currentUser, tournaments } = useApp();

  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[#060e07]">
      <Navbar />
      <main className="pt-16 pb-16">
        {/* Hero */}
        <div
          className="relative overflow-hidden"
          style={{
            backgroundImage:
              "url('/assets/generated/tournament-bg.dim_1920x600.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative z-10 py-20 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-amber-500/20 border border-amber-400/40 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Trophy size={32} className="text-amber-300" />
                </div>
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl text-white neon-text mb-3">
                Tournaments
              </h1>
              <p className="text-amber-200/70 text-lg">
                Join a tournament, bring your team, and compete for glory
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="mb-8">
            <div
              className="section-header-line"
              style={
                {
                  "--before-color":
                    "linear-gradient(to bottom, #f59e0b, #d97706)",
                } as React.CSSProperties
              }
            >
              <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
                <Trophy size={22} className="text-amber-400" />
                Available Tournaments
              </h2>
            </div>
          </div>

          {tournaments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-dark rounded-2xl flex flex-col items-center justify-center py-24 text-center border border-amber-900/20"
              data-ocid="tournaments.empty_state"
            >
              <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mb-4">
                <Trophy size={36} className="text-amber-400/50" />
              </div>
              <h3 className="font-display font-semibold text-lg text-white/60 mb-1">
                No Tournaments Available
              </h3>
              <p className="text-white/30 text-sm max-w-xs">
                No tournaments have been created yet. Check back soon!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tournaments.map((t) => (
                <TournamentCard key={t.id} tournament={t} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-[#030806] text-gray-400 py-6 text-center text-sm border-t border-green-900/20">
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
