"use client";
// Add import for react-window
import { FixedSizeList as List } from "react-window";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin } from "lucide-react";
import { fetchMatches } from "@/lib/api";
import { Match } from "@/lib/types";
import { useStore } from "@/lib/store";
import { getDistance } from "geolib";
import { cn } from "@/lib/utils";
import { animateMapToLocation } from "@/lib/map-utils";

// Add variants for the container and items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.05,
      duration: 0.2,
    },
  },
};

// Only animate items in viewport
const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Define type for sport icons mapping
type SportIconMap = {
  [key: string]: string;
};

// Create a constant mapping object for all supported sports
const SPORT_ICONS: SportIconMap = {
  football: "⚽",
  basketball: "🏀",
  ice_hockey: "🏒",
  handball: "🤾",
  volleyball: "🏐",
  tennis: "🎾",
  hockey: "🏑",
  rugby: "🏉",
  baseball: "⚾",
  american_Football: "🏈",
};

const SPORT_COLORS: Record<string, string> = {
  football: "border-green-300",
  basketball: "border-orange-300",
  ice_hockey: "border-blue-300",
  handball: "border-yellow-300",
  volleyball: "border-purple-300",
  tennis: "border-red-300",
};

// Updated getSportIcon function with better type safety and fallback
const getSportIcon = (sport: string): string => {
  // Return the icon if it exists in mapping, otherwise return a generic sports icon
  return SPORT_ICONS[sport] || "🎯";
};

export const SearchResults = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const setHoveredCoords = useStore((state) => state.setHoveredCoords);
  const selectedLocation = useStore((state) => state.selectedLocation);

  const date = useStore((state) => state.date);
  const distance = useStore((state) => state.distance);
  const userLocation = useStore((state) => state.userLocation);
  const sportTyp = useStore((state) => state.sportTyp);
  const map = useStore((state) => state.map);

  const sportTypeMapping: { [key: string]: string } = {
    Fußball: "football",
    Basketball: "basketball",
    Eishockey: "ice_hockey",
  };

  // Add dimensions state
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  // Add resize listener
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate fixed item height based on viewport
  const itemHeight = useMemo(() => {
    const viewportHeight = dimensions.height - 210; // Reduce header/footer space
    if (dimensions.width >= 2500) {
      return Math.floor(viewportHeight / 5); // 5 cards for 4K screens
    }
    return dimensions.width >= 1024
      ? Math.floor(viewportHeight / 4) // 4 cards for lg screens
      : Math.floor(viewportHeight / 3); // 3 cards for smaller screens
  }, [dimensions]);

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

      const data = await fetchMatches(filters);

      setMatches(data);

      const newMarkers = data
        .filter((match) => match.latitude !== null && match.longitude !== null)
        .map((match) => ({
          id: match.id.toString(),
          position: {
            lat: match.latitude as number,
            lng: match.longitude as number,
          },
          sport: match.sport,
        }));
      useStore.getState().setMarkers(newMarkers);

      setLoading(false);
    };

    loadMatches();
  }, [date, distance, userLocation, sportTyp]);

  const filteredMatches = useMemo(() => {
    if (!selectedLocation.lat || !selectedLocation.lng) {
      return matches;
    }

    return matches.filter(
      (match) =>
        match.latitude === selectedLocation.lat &&
        match.longitude === selectedLocation.lng
    );
  }, [matches, selectedLocation]);

  const handleCardClick = (match: Match) => {
    if (!map || !match.latitude || !match.longitude) return;

    const position = {
      lat: match.latitude,
      lng: match.longitude,
    };

    animateMapToLocation(map, position, () => {});
  };

  // Row renderer for virtualized list
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const match = filteredMatches[index];

    return (
      <motion.div
        key={match.id}
        variants={itemVariants}
        transition={{ duration: 0.5 }}
        onMouseEnter={() => {
          if (match.latitude && match.longitude) {
            setHoveredCoords({
              lat: match.latitude,
              lng: match.longitude,
            });
          }
        }}
        onMouseLeave={() => {
          setHoveredCoords({ lat: null, lng: null });
        }}
        style={style}
      >
        {/* Existing Card component code */}
        <Card
          className={cn(
            "hover:shadow-lg transition-all duration-300 border-l-4",
            "will-change-transform h-[95%] rounded-[12px] cursor-pointer",
            SPORT_COLORS[match.sport] || "bg-gray-50 border-gray-300"
          )}
          onClick={() => handleCardClick(match)}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 h-1/3">
            <CardTitle className="flex flex-row items-center space-x-3">
              <span className="text-2xl">{getSportIcon(match.sport)}</span>
              <span className="text-xl font-semibold">
                {match.home_team}
                <span className="text-muted-foreground mx-2">vs</span>
                {match.away_team}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-4 py-4 border-t h-2/3 ml-1">
            <div className="flex items-center">
              <CalendarDays className="h-6 w-6 mr-3 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-medium text-lg">{match.date_string}</span>
                <span className="text-base">
                  {match.event_time
                    ? `${match.event_time.substring(11, 16)} Uhr`
                    : "Time unavailable"}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-medium">{match.stadium}</span>
                {userLocation?.lat &&
                  userLocation?.lng &&
                  match.latitude &&
                  match.longitude && (
                    <span className="flex items-center">
                      {(
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
                      ).toFixed(1)}{" "}
                      km
                    </span>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
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
        <List
          height={dimensions.height - 80}
          itemCount={filteredMatches.length}
          itemSize={itemHeight}
          width="100%"
          overscanCount={2}
          className="custom-scrollbar-hidden"
        >
          {Row}
        </List>
      </motion.div>
    </div>
  );
};
