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
  Phone,
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
  const isRegClosed = today > tournament.registrationEndDate;
  const canRegister = !isFull && !isRegClosed;

  const handleRegister = () => {
    if (!form.teamName || !form.captainName || !form.contact1) {
      toast.error("Please fill in all required fields.");
      return;
    }
    registerForTournament({
      tournamentId: tournament.id,
      tournamentName: tournament.name,
      teamName: form.teamName,
      captainName: form.captainName,
      contact1: form.contact1,
      contact2: form.contact2,
      numberOfPlayers: form.numberOfPlayers,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
      data-ocid="tournaments.card"
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 px-5 py-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-white text-lg leading-tight">
            {tournament.name}
          </h3>
          <Badge className="bg-yellow-400 text-yellow-900 shrink-0 font-bold">
            ₹{tournament.winningPrize.toLocaleString()}
          </Badge>
        </div>
        <p className="text-green-200 text-sm mt-1 flex items-center gap-1">
          <Trophy size={12} /> {tournament.turfName}
        </p>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={14} className="text-green-600 shrink-0" />
            <span>{tournament.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays size={14} className="text-green-600 shrink-0" />
            <span>{new Date(tournament.date).toLocaleDateString("en-IN")}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={14} className="text-green-600 shrink-0" />
            <span>
              {registeredCount} / {tournament.maxTeams} Teams
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays size={14} className="text-orange-500 shrink-0" />
            <span className="text-orange-600 font-medium">
              Reg. ends:{" "}
              {new Date(tournament.registrationEndDate).toLocaleDateString(
                "en-IN",
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Entry Fee:</span>
          <span className="font-bold text-green-700">
            ₹{tournament.entryFee.toLocaleString()}
          </span>
        </div>

        {/* Rules toggle */}
        <button
          type="button"
          onClick={() => setShowRules(!showRules)}
          className="flex items-center gap-1 text-sm text-green-700 font-medium hover:underline"
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
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-line border border-border">
                {tournament.rules || "No rules specified."}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        {isFull ? (
          <div className="space-y-1">
            <Button disabled className="w-full" data-ocid="tournaments.button">
              Register for Tournament
            </Button>
            <p className="text-xs text-center text-red-500 font-medium">
              Registration Closed – Maximum Teams Reached.
            </p>
          </div>
        ) : isRegClosed ? (
          <div className="space-y-1">
            <Button disabled className="w-full" data-ocid="tournaments.button">
              Register for Tournament
            </Button>
            <p className="text-xs text-center text-red-500 font-medium">
              Registration Closed.
            </p>
          </div>
        ) : (
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setRegisterOpen(true)}
            data-ocid="tournaments.primary_button"
          >
            Register for Tournament
          </Button>
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Trophy size={22} className="text-green-700" />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900">
                  Available Tournaments
                </h1>
                <p className="text-gray-500 text-sm">
                  Join a tournament, bring your team, and compete for glory
                </p>
              </div>
            </div>
          </motion.div>

          {tournaments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
              data-ocid="tournaments.empty_state"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Trophy size={36} className="text-green-400" />
              </div>
              <h3 className="font-display font-semibold text-lg text-gray-700 mb-1">
                No Tournaments Available
              </h3>
              <p className="text-gray-400 text-sm max-w-xs">
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
