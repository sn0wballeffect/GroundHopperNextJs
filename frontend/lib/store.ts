// store.ts
import { create } from "zustand";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

interface UserLocation {
  lat: number | null;
  lng: number | null;
}

interface Store {
  // Date
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;

  // Distance
  distance: number;
  setDistance: (distance: number) => void;

  // Sport Type
  sportTyp: string;
  setSportTyp: (sport: string) => void;

  // Search Query
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // User Location
  userLocation: UserLocation;
  setUserLocation: (location: UserLocation) => void;
}

export const useStore = create<Store>((set) => ({
  // Date
  date: {
    from: new Date(),
    to: addDays(new Date(), 7),
  },
  setDate: (date) => set({ date }),

  // Distance
  distance: 10,
  setDistance: (distance) => set({ distance }),

  // Sport Type
  sportTyp: "Alle",
  setSportTyp: (sport) => set({ sportTyp: sport }),

  // Search Query
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // User Location
  userLocation: { lat: null, lng: null },
  setUserLocation: (location) => set({ userLocation: location }),
}));
