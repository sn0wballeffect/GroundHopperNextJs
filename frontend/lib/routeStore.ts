// /lib/routeStore.ts
import { create } from "zustand";

export interface RouteItem {
  id: string;
  title: string;
  date: string;
  location: string;
  distance: string;
}

interface RouteStore {
  routes: RouteItem[];
  isVisible: boolean;
  addRoute: (route: RouteItem) => void;
  removeRoute: (id: string) => void;
  toggleVisibility: () => void;
}

export const useRouteStore = create<RouteStore>((set) => ({
  routes: [],
  isVisible: true,
  addRoute: (route) =>
    set((state) => ({
      routes: [...state.routes, route],
      isVisible: true,
    })),
  removeRoute: (id) =>
    set((state) => ({
      routes: state.routes.filter((route) => route.id !== id),
    })),
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
}));
