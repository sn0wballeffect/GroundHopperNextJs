import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Match } from "./types";

interface SavedMatchesState {
  savedMatches: Match[];
  addSavedMatch: (match: Match) => void;
  removeSavedMatch: (matchId: number) => void;
}

export const useSavedMatchesStore = create<SavedMatchesState>()(
  persist(
    (set) => ({
      savedMatches: [],
      addSavedMatch: (match) =>
        set((state) => ({
          savedMatches: state.savedMatches.some((m) => m.id === match.id)
            ? state.savedMatches
            : [...state.savedMatches, match],
        })),
      removeSavedMatch: (matchId) =>
        set((state) => ({
          savedMatches: state.savedMatches.filter((m) => m.id !== matchId),
        })),
    }),
    {
      name: "saved-matches-storage",
    }
  )
);
