"use client";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, MapPin, Navigation } from "lucide-react";
import { useRouteStore } from "@/lib/routeStore";
import { fetchMatches } from "@/lib/api";
import { Match } from "@/lib/types";
import { useStore } from "@/lib/store";
import { getDistance } from "geolib";

// Add variants for the container and items
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
};

export const SearchResults = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

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
            ? new Date(date.from.setHours(0, 0, 0, 0)).toISOString()
            : undefined,
        dateTo:
          date?.to instanceof Date
            ? new Date(date.to.setHours(23, 59, 59, 999)).toISOString()
            : undefined,
        distance: distance,
        lat: userLocation?.lat,
        lng: userLocation?.lng,
      };

      let data = await fetchMatches(filters);

      const parseDate = (dateStr: string | null): Date => {
        return dateStr ? new Date(dateStr) : new Date(0);
      };

      data.sort((a, b) => {
        const dateA = parseDate(a.event_date);
        const dateB = parseDate(b.event_date);

        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        const timeA = a.event_time || "";
        const timeB = b.event_time || "";

        if (timeA < timeB) return -1;
        if (timeA > timeB) return 1;

        return 0;
      });

      setMatches(data);

      const newMarkers = data
        .filter((match) => match.latitude !== null && match.longitude !== null)
        .map((match) => ({
          id: match.id.toString(),
          position: {
            lat: match.latitude as number,
            lng: match.longitude as number,
          },
        }));
      useStore.getState().setMarkers(newMarkers);

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
      distance: "calculating...",
    });
  };
  if (loading) {
    return <div> </div>;
  }

  return (
    <div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <AnimatePresence>
          {matches.map((match, index) =>
            index < 6 ? (
              <motion.div
                key={match.id}
                variants={itemVariants}
                transition={{ duration: 0.5 }}
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
                    <p>
                      {match.date_string}
                      {", "}
                      {match.event_time
                        ? `${match.event_time.substring(11, 16)} Uhr`
                        : "Time unavailable"}{" "}
                    </p>
                  </CardContent>
                  <CardFooter className="flex flex-row items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <p>{match.stadium}</p>
                    {userLocation?.lat && userLocation?.lng && (
                      <>
                        <div className="h-6 w-[1px] bg-border mx-3" />
                        <Navigation className="h-4 w-4 mr-2" />
                        <p>
                          {match.latitude && match.longitude
                            ? `${(
                                getDistance(
                                  {
                                    latitude: userLocation.lat,
                                    longitude: userLocation.lng,
                                  },
                                  {
                                    latitude: match.latitude,
                                    longitude: match.longitude,
                                  }
                                ) / 1000
                              ).toFixed(1)} km`
                            : "Distance unavailable"}
                        </p>
                      </>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ) : (
              <div key={match.id}>
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
                    <p>
                      {match.date_string}
                      {", "}
                      {match.event_time
                        ? `${match.event_time.substring(11, 16)} Uhr`
                        : "Time unavailable"}{" "}
                    </p>
                  </CardContent>
                  <CardFooter className="flex flex-row items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <p>{match.stadium}</p>
                    {userLocation?.lat && userLocation?.lng && (
                      <>
                        <div className="h-6 w-[1px] bg-border mx-3" />
                        <Navigation className="h-4 w-4 mr-2" />
                        <p>
                          {match.latitude && match.longitude
                            ? `${(
                                getDistance(
                                  {
                                    latitude: userLocation.lat,
                                    longitude: userLocation.lng,
                                  },
                                  {
                                    latitude: match.latitude,
                                    longitude: match.longitude,
                                  }
                                ) / 1000
                              ).toFixed(1)} km`
                            : "Distance unavailable"}
                        </p>
                      </>
                    )}
                  </CardFooter>
                </Card>
              </div>
            )
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
