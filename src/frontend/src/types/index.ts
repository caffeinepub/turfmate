export type UserRole = "admin" | "turfOwner" | "user";
export type SurfaceType =
  | "Artificial Grass"
  | "Natural Grass"
  | "Hybrid Surface";
export type PaymentType = "advance" | "full";
export type PaymentStatus = "advancePaid" | "remainingPending" | "fullyPaid";
export type SlotStatus = "available" | "booked" | "completed";

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  assignedTurfId?: string;
}

export interface Turf {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerHour: number;
  nightPricePerHour: number;
  advanceAmount: number;
  facilities: string[];
  surfaceType: SurfaceType;
  openTime: string;
  closeTime: string;
  safetyInfo: string[];
  ownerId: string;
  imageUrl: string;
  galleryImages?: string[];
  qrCodeUrl?: string;
}

export interface TimeSlot {
  id: string;
  turfId: string;
  label: string;
  isNightSlot: boolean;
  status: SlotStatus;
  date: string;
  bookingId?: string;
}

export interface Booking {
  id: string;
  userId: string;
  turfId: string;
  turfName: string;
  slotIds: string[];
  slotLabels: string[];
  date: string;
  totalPrice: number;
  advanceAmount: number;
  remainingAmount: number;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  userName: string;
  phone: string;
  emergencyContact: string;
  createdAt: string;
  status?: "approved" | "rejected" | "pending" | "cancelled";
}

export interface Tournament {
  id: string;
  name: string;
  turfId: string;
  turfName: string;
  location: string;
  date: string;
  organizerName: string;
  winningPrize: number;
  maxTeams: number;
  registrationEndDate: string;
  rules: string;
  contact1: string;
  contact2: string;
  entryFee: number;
  qrCodeUrl: string;
  createdBy: string;
  createdAt: string;
}

export interface TournamentRegistration {
  id: string;
  tournamentId: string;
  tournamentName: string;
  teamName: string;
  captainName: string;
  contact1: string;
  contact2: string;
  numberOfPlayers: number;
  paymentStatus: "paid";
  registeredAt: string;
  userId: string;
}
