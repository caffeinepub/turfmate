import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LayoutDashboard, LogOut, Menu, Trophy, User, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModal, setAuthModal] = useState(false);

  const handleExploreTurfs = () => {
    if (!currentUser) {
      setAuthModal(true);
      return;
    }
    navigate("/explore");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!currentUser) return null;
    if (currentUser.role === "admin")
      return { to: "/admin", label: "Admin Panel" };
    if (currentUser.role === "turfOwner")
      return { to: "/owner", label: "My Dashboard" };
    return { to: "/dashboard", label: "My Bookings" };
  };

  const dashLink = getDashboardLink();

  const navBg = transparent
    ? "bg-transparent"
    : "bg-[oklch(0.22_0.06_145)] shadow-lg";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 ${navBg} transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              data-ocid="nav.link"
            >
              <motion.div
                whileHover={{ rotate: 15 }}
                className="text-green-400"
              >
                <Trophy size={28} strokeWidth={2.5} />
              </motion.div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Turf<span className="text-green-400">Mate</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-3">
              {currentUser ? (
                <>
                  <span className="text-green-200 text-sm font-medium">
                    <User size={14} className="inline mr-1" />
                    {currentUser.fullName}
                  </span>
                  {dashLink && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-white hover:bg-green-700/50"
                    >
                      <Link to={dashLink.to} data-ocid="nav.link">
                        <LayoutDashboard size={14} className="mr-1" />
                        {dashLink.label}
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-white hover:bg-green-700/50"
                  >
                    <Link to="/tournaments" data-ocid="nav.link">
                      Tournaments
                    </Link>
                  </Button>
                  {currentUser.role === "user" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleExploreTurfs}
                      className="text-white hover:bg-green-700/50"
                      data-ocid="nav.link"
                    >
                      Explore Turfs
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleLogout}
                    className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                    data-ocid="nav.button"
                  >
                    <LogOut size={14} className="mr-1" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExploreTurfs}
                    className="text-white hover:bg-green-700/50"
                    data-ocid="nav.link"
                  >
                    Explore Turfs
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-white hover:bg-green-700/50"
                  >
                    <Link to="/login" data-ocid="nav.link">
                      Login
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="bg-green-500 hover:bg-green-400 text-white"
                  >
                    <Link to="/signup" data-ocid="nav.link">
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden text-white p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[oklch(0.18_0.06_145)] border-t border-green-800 px-4 py-4 flex flex-col gap-3"
          >
            {currentUser ? (
              <>
                <span className="text-green-300 text-sm">
                  {currentUser.fullName}
                </span>
                {dashLink && (
                  <Link
                    to={dashLink.to}
                    className="text-white hover:text-green-400 py-1"
                    onClick={() => setMobileOpen(false)}
                    data-ocid="nav.link"
                  >
                    {dashLink.label}
                  </Link>
                )}
                <Link
                  to="/tournaments"
                  className="text-white hover:text-green-400 py-1"
                  onClick={() => setMobileOpen(false)}
                  data-ocid="nav.link"
                >
                  Tournaments
                </Link>
                {currentUser.role === "user" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      handleExploreTurfs();
                    }}
                    className="text-white text-left hover:text-green-400 py-1"
                    data-ocid="nav.link"
                  >
                    Explore Turfs
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="text-green-400 text-left py-1"
                  data-ocid="nav.button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleExploreTurfs();
                  }}
                  className="text-white text-left py-1"
                  data-ocid="nav.link"
                >
                  Explore Turfs
                </button>
                <Link
                  to="/login"
                  className="text-white hover:text-green-400 py-1"
                  onClick={() => setMobileOpen(false)}
                  data-ocid="nav.link"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-green-400 font-semibold py-1"
                  onClick={() => setMobileOpen(false)}
                  data-ocid="nav.link"
                >
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>
        )}
      </nav>

      {/* Auth required modal */}
      <Dialog open={authModal} onOpenChange={setAuthModal}>
        <DialogContent data-ocid="auth.dialog">
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              You must sign in to explore and book turfs.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button
              asChild
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => setAuthModal(false)}
            >
              <Link to="/login" data-ocid="auth.primary_button">
                Login
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1"
              onClick={() => setAuthModal(false)}
            >
              <Link to="/signup" data-ocid="auth.secondary_button">
                Sign Up
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
