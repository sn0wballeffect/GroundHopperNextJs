import { SportColors, SportIcons } from "./types";

export const MAP_CONTAINER_STYLE = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
};

export const MAP_CENTER = {
  lat: 51.1333,
  lng: 10.4167,
};

export const MAP_OPTIONS = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "greedy",
  mapId: "c43642982b9e74e2",
  mapTypeControl: false,
  streetViewControl: false,
  minZoom: 3,
};

export const CIRCLE_OPTIONS = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.1,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 1,
};

export const SPORT_COLORS: SportColors = {
  football: "#4ade80",
  basketball: "#fb923c",
  ice_hockey: "#60a5fa",
  handball: "#facc15",
  volleyball: "#c084fc",
  tennis: "#f87171",
};

export const SPORT_ICONS: SportIcons = {
  football: "⚽",
  basketball: "🏀",
  ice_hockey: "🏒",
  handball: "🤾",
  volleyball: "🏐",
  tennis: "🎾",
};

export const getMarkerColor = (sport: keyof typeof SPORT_COLORS): string => {
  return SPORT_COLORS[sport] || "#d1d5db";
};

export const getGlyphForSport = (sport: keyof typeof SPORT_ICONS): string => {
  return SPORT_ICONS[sport] || "🎯";
};

export const getZoomLevel = (distance: number): number => {
  if (distance <= 2) return 13;
  if (distance <= 5) return 12;
  if (distance <= 10) return 11;
  if (distance <= 25) return 10;
  if (distance <= 50) return 9;
  if (distance <= 100) return 8;
  if (distance <= 250) return 7;
  if (distance <= 1000) return 6;
  return 3;
};
