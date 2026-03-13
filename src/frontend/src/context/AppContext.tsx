import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type {
  Booking,
  PaymentStatus,
  TimeSlot,
  Turf,
  User,
  UserRole,
} from "../types";

const SEED_TURFS: Turf[] = [
  {
    id: "turf-1",
    name: "Champions Turf",
    location: "Kolhapur",
    description:
      "5v5 football turf with premium floodlights, ample parking space, and professional changing rooms. A top-tier venue for competitive matches.",
    pricePerHour: 800,
    nightPricePerHour: 1000,
    advanceAmount: 400,
    facilities: ["Floodlights", "Parking", "Changing Rooms", "Drinking Water"],
    surfaceType: "Artificial Grass",
    openTime: "6:00 AM",
    closeTime: "11:00 PM",
    safetyInfo: [
      "First aid kit available",
      "Emergency exit on north side",
      "24/7 CCTV surveillance",
    ],
    ownerId: "owner-1",
    imageUrl: "/assets/generated/turf-champions.dim_800x500.jpg",
    qrCodeUrl: "",
  },
  {
    id: "turf-2",
    name: "Green Arena",
    location: "Pune",
    description:
      "Lush natural grass arena perfect for recreational play and training sessions. Scenic location with spectator seating and café nearby.",
    pricePerHour: 600,
    nightPricePerHour: 800,
    advanceAmount: 300,
    facilities: ["Floodlights", "Parking", "Changing Rooms", "Drinking Water"],
    surfaceType: "Natural Grass",
    openTime: "6:00 AM",
    closeTime: "10:00 PM",
    safetyInfo: [
      "First aid kit available",
      "Emergency exit on north side",
      "24/7 CCTV surveillance",
    ],
    ownerId: "owner-2",
    imageUrl: "/assets/generated/turf-arena.dim_800x500.jpg",
    qrCodeUrl: "",
  },
  {
    id: "turf-3",
    name: "Sunrise Ground",
    location: "Nashik",
    description:
      "Early-bird friendly hybrid surface turf with sunrise views. Ideal for morning training and weekend tournaments.",
    pricePerHour: 700,
    nightPricePerHour: 900,
    advanceAmount: 350,
    facilities: ["Floodlights", "Parking", "Changing Rooms", "Drinking Water"],
    surfaceType: "Hybrid Surface",
    openTime: "5:00 AM",
    closeTime: "11:00 PM",
    safetyInfo: [
      "First aid kit available",
      "Emergency exit on north side",
      "24/7 CCTV surveillance",
    ],
    ownerId: "owner-3",
    imageUrl: "/assets/generated/turf-green.dim_800x500.jpg",
    qrCodeUrl: "",
  },
];

const SEED_USERS: User[] = [
  {
    id: "admin-1",
    fullName: "Platform Admin",
    phone: "9000000000",
    email: "admin@turfmate.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "owner-1",
    fullName: "Rajesh Patil",
    phone: "9111111111",
    email: "owner1@turfmate.com",
    password: "owner123",
    role: "turfOwner",
    assignedTurfId: "turf-1",
  },
  {
    id: "owner-2",
    fullName: "Suresh Kulkarni",
    phone: "9222222222",
    email: "owner2@turfmate.com",
    password: "owner123",
    role: "turfOwner",
    assignedTurfId: "turf-2",
  },
  {
    id: "owner-3",
    fullName: "Anand Deshmukh",
    phone: "9333333333",
    email: "owner3@turfmate.com",
    password: "owner123",
    role: "turfOwner",
    assignedTurfId: "turf-3",
  },
  {
    id: "user-1",
    fullName: "Arjun Sharma",
    phone: "9444444444",
    email: "user@turfmate.com",
    password: "user123",
    role: "user",
  },
];

function parseHour(timeStr: string): number {
  const clean = timeStr.replace(/\s/g, "").toUpperCase();
  const ampm = clean.includes("PM") ? "PM" : "AM";
  const numPart = clean.replace("AM", "").replace("PM", "");
  let hour = Number.parseInt(numPart.split(":")[0]);
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  return hour;
}

function generateSlots(turf: Turf, date: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startHour = parseHour(turf.openTime);
  const endHour = parseHour(turf.closeTime);
  const hourLabels = [
    "12AM",
    "1AM",
    "2AM",
    "3AM",
    "4AM",
    "5AM",
    "6AM",
    "7AM",
    "8AM",
    "9AM",
    "10AM",
    "11AM",
    "12PM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM",
    "6PM",
    "7PM",
    "8PM",
    "9PM",
    "10PM",
    "11PM",
  ];
  for (let h = startHour; h < endHour; h++) {
    const label = `${hourLabels[h]}-${hourLabels[h + 1] || "12AM"}`;
    slots.push({
      id: `${turf.id}-${date}-${h}`,
      turfId: turf.id,
      label,
      isNightSlot: h >= 18,
      status: "available",
      date,
    });
  }
  return slots;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  turfs: Turf[];
  slots: TimeSlot[];
  bookings: Booking[];
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  signup: (
    fullName: string,
    phone: string,
    email: string,
    password: string,
  ) => boolean;
  addTurf: (turf: Omit<Turf, "id">) => void;
  editTurf: (id: string, updates: Partial<Turf>) => void;
  deleteTurf: (id: string) => void;
  createTurfOwner: (
    name: string,
    email: string,
    password: string,
    phone: string,
    turfId: string,
  ) => void;
  getSlots: (turfId: string, date: string) => TimeSlot[];
  createBooking: (booking: Omit<Booking, "id" | "createdAt">) => Booking;
  updatePaymentStatus: (bookingId: string, status: PaymentStatus) => void;
  toggleSlotStatus: (slotId: string) => void;
  reopenSlot: (slotId: string) => void;
  approveBooking: (bookingId: string) => void;
  rejectBooking: (bookingId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function loadLS<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveLS<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadLS("currentUser", null),
  );
  const [users, setUsers] = useState<User[]>(() => {
    const stored = loadLS<User[]>("users", []);
    if (stored.length === 0) {
      saveLS("users", SEED_USERS);
      return SEED_USERS;
    }
    // Merge seed users if missing
    const existingIds = stored.map((u) => u.id);
    const missing = SEED_USERS.filter((u) => !existingIds.includes(u.id));
    if (missing.length > 0) {
      const merged = [...stored, ...missing];
      saveLS("users", merged);
      return merged;
    }
    return stored;
  });
  const [turfs, setTurfs] = useState<Turf[]>(() => {
    const stored = loadLS<Turf[]>("turfs", []);
    if (stored.length === 0) {
      saveLS("turfs", SEED_TURFS);
      return SEED_TURFS;
    }
    return stored;
  });
  const [slots, setSlots] = useState<TimeSlot[]>(() => loadLS("slots", []));
  const [bookings, setBookings] = useState<Booking[]>(() =>
    loadLS("bookings", []),
  );

  useEffect(() => {
    saveLS("currentUser", currentUser);
  }, [currentUser]);
  useEffect(() => {
    saveLS("users", users);
  }, [users]);
  useEffect(() => {
    saveLS("turfs", turfs);
  }, [turfs]);
  useEffect(() => {
    saveLS("slots", slots);
  }, [slots]);
  useEffect(() => {
    saveLS("bookings", bookings);
  }, [bookings]);

  const login = (email: string, password: string, role: UserRole): boolean => {
    const user = users.find(
      (u) => u.email === email && u.password === password && u.role === role,
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const signup = (
    fullName: string,
    phone: string,
    email: string,
    password: string,
  ): boolean => {
    if (users.find((u) => u.email === email)) return false;
    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName,
      phone,
      email,
      password,
      role: "user",
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const addTurf = (turf: Omit<Turf, "id">) => {
    const newTurf: Turf = { ...turf, id: `turf-${Date.now()}` };
    setTurfs((prev) => [...prev, newTurf]);
  };

  const editTurf = (id: string, updates: Partial<Turf>) => {
    setTurfs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
  };

  const deleteTurf = (id: string) => {
    setTurfs((prev) => prev.filter((t) => t.id !== id));
  };

  const createTurfOwner = (
    name: string,
    email: string,
    password: string,
    phone: string,
    turfId: string,
  ) => {
    const existing = users.find((u) => u.email === email);
    if (existing) {
      setUsers((prev) =>
        prev.map((u) =>
          u.email === email
            ? { ...u, assignedTurfId: turfId, role: "turfOwner" }
            : u,
        ),
      );
      return;
    }
    const newOwner: User = {
      id: `owner-${Date.now()}`,
      fullName: name,
      phone,
      email,
      password,
      role: "turfOwner",
      assignedTurfId: turfId,
    };
    setUsers((prev) => [...prev, newOwner]);
  };

  const getSlots = (turfId: string, date: string): TimeSlot[] => {
    const existing = slots.filter(
      (s) => s.turfId === turfId && s.date === date,
    );
    if (existing.length > 0) return existing;
    const turf = turfs.find((t) => t.id === turfId);
    if (!turf) return [];
    const newSlots = generateSlots(turf, date);
    setSlots((prev) => [...prev, ...newSlots]);
    return newSlots;
  };

  const createBooking = (
    booking: Omit<Booking, "id" | "createdAt">,
  ): Booking => {
    const newBooking: Booking = {
      ...booking,
      id: `BK${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    setBookings((prev) => [...prev, newBooking]);
    setSlots((prev) =>
      prev.map((s) =>
        booking.slotIds.includes(s.id)
          ? { ...s, status: "booked", bookingId: newBooking.id }
          : s,
      ),
    );
    return newBooking;
  };

  const updatePaymentStatus = (bookingId: string, status: PaymentStatus) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, paymentStatus: status } : b,
      ),
    );
  };

  const toggleSlotStatus = (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.id === slotId
          ? { ...s, status: s.status === "available" ? "booked" : "available" }
          : s,
      ),
    );
  };

  const reopenSlot = (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.id === slotId
          ? { ...s, status: "available", bookingId: undefined }
          : s,
      ),
    );
  };

  const approveBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "approved" } : b)),
    );
  };

  const rejectBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setSlots((prev) =>
        prev.map((s) =>
          booking.slotIds.includes(s.id)
            ? { ...s, status: "available", bookingId: undefined }
            : s,
        ),
      );
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "rejected" } : b)),
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        turfs,
        slots,
        bookings,
        login,
        logout,
        signup,
        addTurf,
        editTurf,
        deleteTurf,
        createTurfOwner,
        getSlots,
        createBooking,
        updatePaymentStatus,
        toggleSlotStatus,
        reopenSlot,
        approveBooking,
        rejectBooking,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
