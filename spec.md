# TurfMate – Tournament Management Feature

## Current State
TurfMate is a full-stack turf booking platform with Admin, Turf Owner, and User dashboards. Admin Dashboard uses a Tabs layout with: overview, turfs, bookings, owners, revenue. Turf Owner Dashboard uses tabs: slots, bookings, edit, revenue. App routing is HashRouter-based. State is managed in AppContext using localStorage. Types are in types/index.ts.

## Requested Changes (Diff)

### Add
- `Tournament` and `TournamentRegistration` types to `types/index.ts`
- Tournament state + CRUD functions to `AppContext.tsx`
- Two new tabs in Admin Dashboard: "Tournaments" (create/list) and "Tournament Registrations"
- Two new tabs in Turf Owner Dashboard: "Tournaments" (create/list) and "Tournament Registrations"
- New page `TournamentsPage.tsx` (route `/tournaments`) for users to browse available tournaments and register teams
- Route `/tournaments` added to `App.tsx`
- "Tournaments" link on Navbar for logged-in users

### Modify
- `AppContext.tsx`: add tournaments and tournamentRegistrations state arrays, add functions: `createTournament`, `deleteTournament`, `registerForTournament`
- `AdminDashboard.tsx`: add two new TabsTrigger/TabsContent entries for tournaments
- `TurfOwnerDashboard.tsx`: add two new TabsTrigger/TabsContent entries for tournaments
- `App.tsx`: add `/tournaments` route
- `Navbar.tsx`: add Tournaments nav link for logged-in users

### Remove
- Nothing

## Implementation Plan
1. Add `Tournament` interface and `TournamentRegistration` interface to `types/index.ts`
2. Update `AppContext.tsx`:
   - Add `tournaments: Tournament[]` and `tournamentRegistrations: TournamentRegistration[]` state with localStorage persistence
   - Add `createTournament`, `deleteTournament`, `registerForTournament` functions to context
3. Update `AdminDashboard.tsx`: add "Tournaments" tab (create form + list) and "Tournament Registrations" tab
4. Update `TurfOwnerDashboard.tsx`: add "Tournaments" tab (create form + list, filtered to owner's turf) and "Tournament Registrations" tab
5. Create `TournamentsPage.tsx`: grid of tournament cards with team registration modal (with QR code and "I Have Paid Tournament Fee" button), team limit enforcement
6. Update `App.tsx` to add `/tournaments` route
7. Update `Navbar.tsx` to add Tournaments link for logged-in users
