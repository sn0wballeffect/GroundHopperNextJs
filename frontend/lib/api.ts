import { Match, City } from "./types";

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

// Add an environment variable for the API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

    const url = `${API_URL}/matches?${params.toString()}`;
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

export const searchCities = async (query: string): Promise<City[]> => {
  try {
    const url = `${API_URL}/cities?search=${encodeURIComponent(query)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching cities:", error);
    return [];
  }
};
