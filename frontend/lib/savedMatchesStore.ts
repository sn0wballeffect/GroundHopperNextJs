import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Match } from "./types";

interface CompletedSections {
  tickets: boolean;
  travel: boolean;
  accommodation: boolean;
}

interface SavedMatchesState {
  savedMatches: Match[];
  completedSections: Record<number, CompletedSections>;
  addSavedMatch: (match: Match) => void;
  removeSavedMatch: (matchId: number) => void;
  updateCompletedSections: (
    matchId: number,
    sections: CompletedSections
  ) => void;
  resetMatches: () => void;
}

export const useSavedMatchesStore = create<SavedMatchesState>()(
  persist(
    (set) => ({
      savedMatches: [],
      completedSections: {},
      addSavedMatch: (match) =>
        set((state) => ({
          savedMatches: state.savedMatches.some((m) => m.id === match.id)
            ? state.savedMatches
            : [...state.savedMatches, match],
        })),
      removeSavedMatch: (matchId) =>
        set((state) => ({
          savedMatches: state.savedMatches.filter((m) => m.id !== matchId),
          completedSections: Object.fromEntries(
            Object.entries(state.completedSections).filter(
              ([id]) => Number(id) !== matchId
            )
          ),
        })),
      updateCompletedSections: (matchId, sections) =>
        set((state) => ({
          completedSections: {
            ...state.completedSections,
            [matchId]: sections,
          },
        })),
      resetMatches: () =>
        set((state) => ({
          savedMatches: [],
          completedSections: {},
        })),
    }),
    {
      name: "saved-matches-storage",
    }
  )
);
