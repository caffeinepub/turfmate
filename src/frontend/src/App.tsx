import { Toaster } from "@/components/ui/sonner";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import AdminDashboard from "./pages/AdminDashboard";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import BookingPage from "./pages/BookingPage";
import ExploreTurfsPage from "./pages/ExploreTurfsPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import PaymentPage from "./pages/PaymentPage";
import SignupPage from "./pages/SignupPage";
import TournamentsPage from "./pages/TournamentsPage";
import TurfDetailPage from "./pages/TurfDetailPage";
import TurfOwnerDashboard from "./pages/TurfOwnerDashboard";
import UserDashboard from "./pages/UserDashboard";
import type { UserRole } from "./types";

function AuthGuard({
  children,
  allowedRoles,
}: { children: React.ReactNode; allowedRoles?: UserRole[] }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === "admin") return <Navigate to="/admin" replace />;
    if (currentUser.role === "turfOwner")
      return <Navigate to="/owner" replace />;
    return <Navigate to="/explore" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/explore"
        element={
          <AuthGuard allowedRoles={["user"]}>
            <ExploreTurfsPage />
          </AuthGuard>
        }
      />
      <Route
        path="/turf/:id"
        element={
          <AuthGuard>
            <TurfDetailPage />
          </AuthGuard>
        }
      />
      <Route
        path="/book/:id"
        element={
          <AuthGuard allowedRoles={["user"]}>
            <BookingPage />
          </AuthGuard>
        }
      />
      <Route
        path="/payment"
        element={
          <AuthGuard allowedRoles={["user"]}>
            <PaymentPage />
          </AuthGuard>
        }
      />
      <Route
        path="/confirmation"
        element={
          <AuthGuard allowedRoles={["user"]}>
            <BookingConfirmationPage />
          </AuthGuard>
        }
      />
      <Route
        path="/dashboard"
        element={
          <AuthGuard allowedRoles={["user"]}>
            <UserDashboard />
          </AuthGuard>
        }
      />
      <Route
        path="/tournaments"
        element={
          <AuthGuard>
            <TournamentsPage />
          </AuthGuard>
        }
      />
      <Route
        path="/admin"
        element={
          <AuthGuard allowedRoles={["admin"]}>
            <AdminDashboard />
          </AuthGuard>
        }
      />
      <Route
        path="/owner"
        element={
          <AuthGuard allowedRoles={["turfOwner"]}>
            <TurfOwnerDashboard />
          </AuthGuard>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
        <Toaster richColors position="top-right" />
      </HashRouter>
    </AppProvider>
  );
}
