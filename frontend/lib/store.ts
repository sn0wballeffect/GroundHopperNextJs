// store.ts
import { create } from "zustand";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

interface UserLocation {
  lat: number | null;
  lng: number | null;
}

interface Marker {
  id: string;
  position: google.maps.LatLngLiteral;
  sport: string;
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

  // Markers
  markers: Marker[];
  addMarker: (marker: Marker) => void;
  setMarkers: (markers: Marker[]) => void;

  // Hovered Coordinates
  hoveredCoords: { lat: number | null; lng: number | null };
  setHoveredCoords: (coords: {
    lat: number | null;
    lng: number | null;
  }) => void;

  selectedLocation: { lat: number | null; lng: number | null };
  setSelectedLocation: (location: {
    lat: number | null;
    lng: number | null;
  }) => void;
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

  // Markers
  markers: [],
  addMarker: (marker) =>
    set((state) => ({
      markers: state.markers.find(
        (m) =>
          m.position.lat === marker.position.lat &&
          m.position.lng === marker.position.lng
      )
        ? state.markers
        : [...state.markers, marker],
    })),
  setMarkers: (markers) =>
    set({
      markers: [
        ...new Map(
          markers.map((m) => [`${m.position.lat}-${m.position.lng}`, m])
        ).values(),
      ],
    }),

  // Hovered Coordinates
  hoveredCoords: { lat: null, lng: null },
  setHoveredCoords: (coords) => set({ hoveredCoords: coords }),

  selectedLocation: { lat: null, lng: null },
  setSelectedLocation: (location) => set({ selectedLocation: location }),
}));
