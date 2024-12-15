"use client";
import { VariableSizeList as List } from "react-window";
import { motion } from "framer-motion";
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin } from "lucide-react";
import { fetchMatches } from "@/lib/api";
import { Match } from "@/lib/types";
import { useStore } from "@/lib/store";
import { getDistance } from "geolib";
import { cn } from "@/lib/utils";
import { animateMapToLocation } from "@/lib/map-utils";

// Motion variants
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

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Sport icons
const SPORT_ICONS: Record<string, string> = {
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

const getSportIcon = (sport: string): string => {
  return SPORT_ICONS[sport] || "🎯";
};

// Memoized Row Component
const Row = React.memo(
  ({
    index,
    style,
    data,
  }: {
    index: number;
    style: React.CSSProperties;
    data: any;
  }) => {
    const {
      filteredMatches,
      expandedId,
      setHoveredCoords,
      handleCardClick,
      userLocation,
    } = data;
    const match: Match = filteredMatches[index];
    const isExpanded = expandedId === match.id;

    return (
      <motion.div
        key={match.id}
        style={style}
        variants={itemVariants}
        transition={{ duration: 0.2 }}
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
      >
        <Card
          className={cn(
            "hover:shadow-lg transition-all duration-300 border-l-4 will-change-transform rounded-[12px] cursor-pointer overflow-hidden h-[95%] flex flex-col",
            SPORT_COLORS[match.sport] || "border-gray-300"
          )}
          onClick={() => handleCardClick(match, index)}
        >
          <CardHeader
            className={cn(
              "flex flex-row items-center justify-between pb-2 h-1/3"
            )}
          >
            <CardTitle className="flex flex-row items-center space-x-3">
              <span className="text-2xl">{getSportIcon(match.sport)}</span>
              <span className="text-xl font-semibold">
                {match.home_team}
                <span className="text-muted-foreground mx-2">vs</span>
                {match.away_team}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent
            className={cn("grid grid-cols-2 gap-4 py-4 border-t ml-1 h-2/3")}
          >
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

          {/* Expanded Content */}
          {isExpanded && (
            <div className="p-4 border-t bg-muted/50">
              <p>Additional match details here...</p>
            </div>
          )}
        </Card>
      </motion.div>
    );
  }
);

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

  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

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

  const baseItemHeight = useMemo(() => {
    const viewportHeight = dimensions.height - 210;

    // Define breakpoints for different screen sizes
    if (dimensions.width >= 2500) {
      return Math.floor(viewportHeight / 6); // 6 items per column for ultra-wide
    }
    if (dimensions.width >= 1920) {
      return Math.floor(viewportHeight / 4); // 5 items for wide screens
    }
    return Math.floor(viewportHeight / 3); // 3 items for smaller screens
  }, [dimensions.height, dimensions.width]);

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

  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Reference to the List so we can update item sizes on expansion
  const listRef = useRef<List>(null);

  const getItemSize = useCallback(
    (index: number) => {
      // If this item is expanded, increase its size
      const match = filteredMatches[index];
      if (match && expandedId === match.id) {
        // Add extra height for expanded content
        return baseItemHeight * 1.5; // Adjust as needed
      }
      return baseItemHeight;
    },
    [baseItemHeight, expandedId, filteredMatches]
  );

  const handleCardClick = (match: Match, index: number) => {
    if (!map || !match.latitude || !match.longitude) return;

    const position = { lat: match.latitude, lng: match.longitude };
    animateMapToLocation(map, position, () => {});

    const newExpandedId = expandedId === match.id ? null : match.id;
    setExpandedId(newExpandedId);

    // After changing expandedId, update the item size
    // resetAfterIndex ensures the list recalculates item positions
    requestAnimationFrame(() => {
      listRef.current?.resetAfterIndex(index);
    });
  };

  // Add effect to handle dimension changes
  useEffect(() => {
    if (listRef.current) {
      // Reset all measurements in the List
      listRef.current.resetAfterIndex(0);
    }
  }, [dimensions, baseItemHeight]);

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
          ref={listRef}
          height={dimensions.height - 80}
          itemCount={filteredMatches.length}
          itemSize={getItemSize}
          width="100%"
          overscanCount={2}
          className="custom-scrollbar-hidden"
          itemKey={(index) => filteredMatches[index].id}
          itemData={{
            filteredMatches,
            expandedId,
            setHoveredCoords,
            handleCardClick,
            userLocation,
          }}
          // VariableSizeList requires this for dynamic heights
          estimatedItemSize={baseItemHeight}
        >
          {Row}
        </List>
      </motion.div>
    </div>
  );
};
