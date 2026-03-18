import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

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
    ? scrolled
      ? "bg-black/90 backdrop-blur-xl border-b border-green-900/40 shadow-glass"
      : "bg-transparent"
    : "bg-black/90 backdrop-blur-xl border-b border-green-900/40 shadow-glass";

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
              className="flex items-center group"
              data-ocid="nav.link"
            >
              <motion.div whileHover={{ scale: 1.05 }}>
                <img
                  src="/assets/generated/turfmate-logo-premium-transparent.dim_400x120.png"
                  alt="TurfMate"
                  className="h-8 w-auto object-contain"
                />
              </motion.div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-3">
              {currentUser ? (
                <>
                  <span className="text-green-300/80 text-sm font-medium flex items-center gap-1.5">
                    <User size={14} />
                    {currentUser.fullName}
                  </span>
                  {dashLink && (
                    <Link
                      to={dashLink.to}
                      className="relative group text-white/80 hover:text-green-400 transition-colors text-sm font-medium px-3 py-2"
                      data-ocid="nav.link"
                    >
                      <LayoutDashboard size={14} className="inline mr-1" />
                      {dashLink.label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300" />
                    </Link>
                  )}
                  <Link
                    to="/tournaments"
                    className="relative group text-white/80 hover:text-green-400 transition-colors text-sm font-medium px-3 py-2"
                    data-ocid="nav.link"
                  >
                    Tournaments
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300" />
                  </Link>
                  {currentUser.role === "user" && (
                    <button
                      type="button"
                      onClick={handleExploreTurfs}
                      className="relative group text-white/80 hover:text-green-400 transition-colors text-sm font-medium px-3 py-2"
                      data-ocid="nav.link"
                    >
                      Explore Turfs
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 border border-green-500/50 text-green-400 hover:bg-green-500/10 transition-all text-sm font-medium px-4 py-2 rounded-xl"
                    data-ocid="nav.button"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleExploreTurfs}
                    className="relative group text-white/80 hover:text-green-400 transition-colors text-sm font-medium px-3 py-2"
                    data-ocid="nav.link"
                  >
                    Explore Turfs
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300" />
                  </button>
                  <Link
                    to="/login"
                    className="relative group text-white/80 hover:text-green-400 transition-colors text-sm font-medium px-3 py-2"
                    data-ocid="nav.link"
                  >
                    Login
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300" />
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-green-600 hover:bg-green-500 text-white font-semibold text-sm px-5 py-2 rounded-xl shadow-premium transition-all hover:shadow-neon-green"
                    data-ocid="nav.link"
                  >
                    Sign Up
                  </Link>
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
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-green-900/30 px-4 py-4 flex flex-col gap-3"
          >
            {currentUser ? (
              <>
                <span className="text-green-300 text-sm">
                  {currentUser.fullName}
                </span>
                {dashLink && (
                  <Link
                    to={dashLink.to}
                    className="text-white/80 hover:text-green-400 py-1 transition-colors"
                    onClick={() => setMobileOpen(false)}
                    data-ocid="nav.link"
                  >
                    {dashLink.label}
                  </Link>
                )}
                <Link
                  to="/tournaments"
                  className="text-white/80 hover:text-green-400 py-1 transition-colors"
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
                    className="text-white/80 text-left hover:text-green-400 py-1 transition-colors"
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
                  className="text-white/80 text-left py-1 hover:text-green-400 transition-colors"
                  data-ocid="nav.link"
                >
                  Explore Turfs
                </button>
                <Link
                  to="/login"
                  className="text-white/80 hover:text-green-400 py-1 transition-colors"
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
