import { Match } from "./types";

// lib/api.ts
interface FilterParams {
  sport?: string;
  dateFrom?: string;
  dateTo?: string;
  distance?: number;
  lat?: number | null;
  lng?: number | null;
  limit?: number;
}

export const fetchMatches = async (
  filters: FilterParams = {}
): Promise<Match[]> => {
  try {
    const params = new URLSearchParams();

    params.append("limit", (filters.limit || 100).toString());

    if (filters.sport) params.append("sport", filters.sport);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);
    if (filters.distance)
      params.append("distance", filters.distance.toString());
    if (filters.lat) params.append("lat", filters.lat?.toString() || "");
    if (filters.lng) params.append("lng", filters.lng?.toString() || "");

    const url = `http://localhost:3000/matches?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
};