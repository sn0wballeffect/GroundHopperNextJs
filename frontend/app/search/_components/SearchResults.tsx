"use client";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  MapPin,
  Trophy,
  Ticket,
  Map,
  Users,
  Info,
  Building2,
  Star,
  Timer,
} from "lucide-react";
import { fetchMatches } from "@/lib/api";
import { Match } from "@/lib/types";
import { useStore } from "@/lib/store";
import { getDistance } from "geolib";
import { cn } from "@/lib/utils";
import { animateMapToLocation } from "@/lib/map-utils";
import { Button } from "@/components/ui/button";

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
      <div style={style} className="will-change-transform">
        <Card
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
          onClick={() => handleCardClick(match, index)}
          className={cn(
            "grid grid-rows-[auto,1fr,auto] h-[95%] cursor-pointer border-l-4 rounded-[12px] transition-shadow hover:shadow-lg",
            SPORT_COLORS[match.sport] || "border-gray-300"
          )}
        >
          <CardHeader className="py-4 px-6">
            <CardTitle className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getSportIcon(match.sport)}</span>
                <span className="text-xl font-semibold">
                  {match.home_team}
                  <span className="text-muted-foreground mx-2">vs</span>
                  {match.away_team}
                </span>
              </div>
              {userLocation?.lat &&
                userLocation?.lng &&
                match.latitude &&
                match.longitude && (
                  <div className="flex items-center text-muted-foreground">
                    <Map className="h-4 w-4 mr-2" />
                    <span className="text-sm">
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
                  </div>
                )}
            </CardTitle>
          </CardHeader>

          <CardContent className="border-t border-b py-4 px-6 overflow-hidden">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start ml-1">
                <CalendarDays className="h-6 w-6 mr-3 text-muted-foreground shrink-0" />
                <div className="flex flex-col">
                  <span className="font-medium text-lg">
                    {match.date_string}
                  </span>
                  <span className="text-base">
                    {match.event_time
                      ? `${match.event_time.substring(11, 16)} Uhr`
                      : "Time unavailable"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add navigation/ticket action here
                  }}
                >
                  <Ticket className="h-4 w-4" />
                  Kaufe Tickets
                </Button>
              </div>
            </div>
          </CardContent>

          {/* Expanded content - with proper hiding */}
          <div
            className={cn(
              "transform-gpu overflow-hidden isolate relative bg-gradient-to-b from-background/90 to-background/80 backdrop-blur-sm",
              isExpanded
                ? "transition-[height,opacity,transform] duration-300 h-[190px] opacity-100"
                : "h-0 opacity-0"
            )}
            style={{
              willChange: "transform, opacity, height",
              transform: isExpanded ? "translateY(0)" : "translateY(-20px)",
              transformOrigin: "top",
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div className="transform-gpu absolute inset-x-0 p-6 ml-2">
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex items-start space-x-3">
                  <Trophy className="h-5 w-5 text-amber-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Wettbewerb
                    </span>
                    <span className="font-medium">
                      {match.league || "League not specified"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-blue-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Stadion
                    </span>
                    <span className="font-medium">{match.stadium}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-green-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Kapazität
                    </span>
                    <span className="font-medium">50000</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Timer className="h-5 w-5 text-purple-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Gates Open
                    </span>
                    <span className="font-medium">
                      {"90 minutes before kickoff"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
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
  const listRef = useRef<List>(null);

  const handleCardClick = (match: Match, index: number) => {
    if (!map || !match.latitude || !match.longitude) return;

    // If another item was expanded, reset after index 0 to ensure sizing is recalculated
    animateMapToLocation(
      map,
      { lat: match.latitude, lng: match.longitude },
      () => {}
    );
    if (expandedId !== null) {
      requestAnimationFrame(() => {
        listRef.current?.resetAfterIndex(0);
      });
    }

    setExpandedId(expandedId === match.id ? null : match.id);

    // Recalculate sizes after expansion state change
    requestAnimationFrame(() => {
      listRef.current?.resetAfterIndex(index);
    });
  };

  // Determine item size
  const getItemSize = useCallback(
    (index: number) => {
      const baseItemHeight = 180;
      const match = filteredMatches[index];

      // If expanded, return a larger size
      if (match && expandedId === match.id) {
        // Adjust as needed if your expanded content is taller
        return baseItemHeight + 180;
      }
      return baseItemHeight;
    },
    [expandedId, filteredMatches]
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (filteredMatches.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">No matches found.</div>
    );
  }

  return (
    <div className="w-full h-full flex-1 overflow-hidden">
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            height={height}
            width={width}
            itemCount={filteredMatches.length}
            itemSize={getItemSize}
            itemData={{
              filteredMatches,
              expandedId,
              setHoveredCoords,
              handleCardClick,
              userLocation,
            }}
            estimatedItemSize={180}
            overscanCount={5}
            className="custom-scrollbar-hidden"
            itemKey={(index) => filteredMatches[index].id}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};
