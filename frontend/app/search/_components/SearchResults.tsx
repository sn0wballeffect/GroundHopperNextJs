"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, MapPin, ArrowRight, Navigation } from "lucide-react";
import { useRouteStore } from "@/lib/routeStore";
import { fetchMatches } from "@/lib/api";
import { Match } from "@/lib/types";
import { useStore } from "@/lib/store";

export const SearchResults = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // Get global state
  const date = useStore((state) => state.date);
  const distance = useStore((state) => state.distance);
  const userLocation = useStore((state) => state.userLocation);
  const sportTyp = useStore((state) => state.sportTyp);
  const addRoute = useRouteStore((state) => state.addRoute);
  const sportTypeMapping: { [key: string]: string } = {
    Fußball: "football",
    Basketball: "basketball",
    Eishockey: "ice_hockey",
  };
  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      const filters = {
        sport: sportTyp === "Alle" ? undefined : sportTypeMapping[sportTyp],
        dateFrom:
          date?.from instanceof Date
            ? new Date(date.from.setHours(0, 0, 0, 0)).toISOString() // Start of day
            : undefined,
        dateTo:
          date?.to instanceof Date
            ? new Date(date.to.setHours(23, 59, 59, 999)).toISOString() // End of day
            : undefined,
        distance: distance,
        lat: userLocation?.lat,
        lng: userLocation?.lng,
      };

      const data = await fetchMatches(filters);
      setMatches(data);
      setLoading(false);
    };

    loadMatches();
  }, [date, distance, userLocation, sportTyp]);

  const handleAddToRoute = (match: Match) => {
    addRoute({
      id: match.id.toString(),
      title: `${match.home_team} vs ${match.away_team}`,
      date: match.date_string || "",
      location: match.stadium || "",
      distance: "calculating...", // You could calculate this based on user location
    });
  };

  if (loading) {
    return <div>Loading matches...</div>;
  }

  return (
    <div>
      {matches.map((match) => (
        <div key={match.id} style={{ perspective: "1000px" }}>
          <motion.div
            className="relative cursor-pointer"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              style={{
                backfaceVisibility: "hidden",
                position: isFlipped ? "absolute" : "relative",
              }}
            >
              <Card className="mb-3 shadow-md">
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle className="text-lg font-bold">
                    {match.home_team} vs {match.away_team}
                  </CardTitle>
                  <Button onClick={() => handleAddToRoute(match)}>
                    Zur Route Hinzufügen
                  </Button>
                </CardHeader>
                <CardContent className="flex flex-row items-center">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <p>{match.date_string}</p>
                  <div className="h-6 w-[1px] bg-border mx-3" />
                </CardContent>
                <CardFooter className="flex flex-row items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <p>{match.stadium}</p>
                  <div className="h-6 w-[1px] bg-border mx-3" />
                  <Navigation className="h-4 w-4 mr-2" />
                  <p>calculating...</p>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};
