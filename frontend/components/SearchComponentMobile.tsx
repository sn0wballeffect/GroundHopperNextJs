"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Search,
  LocateFixed,
  MapPin,
  ArrowUp,
} from "lucide-react";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { FaRunning } from "react-icons/fa";

export const SearchComponentMobile = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isSearchPage = pathname === "/search";

  // Replace local state with global store
  const date = useStore((state) => state.date);
  const setDate = useStore((state) => state.setDate);
  const distance = useStore((state) => state.distance);
  const setDistance = useStore((state) => state.setDistance);
  const sportTyp = useStore((state) => state.sportTyp);
  const setSportTyp = useStore((state) => state.setSportTyp);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const userLocation = useStore((state) => state.userLocation);
  const setUserLocation = useStore((state) => state.setUserLocation);

  const [isLoading, setIsLoading] = useState(false);
  const [showDateSelector, setShowDateSelector] = useState(false);

  // Update handler to use global state
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleButtonClick = () => {
    if (!isSearchPage) {
      router.push("/search");
    }
  };

  const handleGetLocation = () => {
    setIsLoading(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
        setIsLoading(false);
      }
    );
  };

  const handleInputClick = () => {
    setShowDateSelector(true);
  };
  const handleInputClickFalse = () => {
    setShowDateSelector(false);
  };
  const scrollToTop = () => {
    // Only scroll on small devices (max-width: 768px is common breakpoint for mobile)
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 150);
    }
  };

  return (
    <div className="w-[90%] mx-auto min-w-0 flex flex-col">
      <div className="flex flex-col p-3 bg-white rounded-3xl shadow-lg">
        {/* Location section */}
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3">
            <Input
              type="search"
              placeholder={
                userLocation.lat && userLocation.lng
                  ? `${userLocation.lat.toFixed(
                      2
                    )}°N, ${userLocation.lng.toFixed(2)}°E`
                  : "Suchen..."
              }
              className="border-0 shadow-none p-0 focus-visible:ring-0 placeholder:text-muted-foreground px-1 text-lg"
              value={searchQuery}
              onChange={handleInputChange}
              onClick={handleInputClick}
              onBlur={scrollToTop}
            />
          </div>
          <LocateFixed
            className={`h-6 w-6 mr-3 ${
              isLoading
                ? "animate-spin text-gray-400"
                : userLocation.lat && userLocation.lng
                ? "text-red-600"
                : "text-gray-400"
            }`}
            onClick={handleGetLocation}
            role="button"
            aria-label="Get current location"
          />
        </div>

        <AnimatePresence>
          {showDateSelector && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full overflow-hidden flex flex-col items-center "
            >
              <div className="w-[90%] h-[1px] bg-border mb-8 mt-2 mx-auto" />

              {/* Date Range Selectors */}
              <div className="flex justify-center w-full mb-5 space-x-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="flex-1 flex space-x-2 ">
                      <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">Von</span>
                        <span className="text-sm">
                          {date?.from
                            ? format(date.from, "dd.MM.yyyy")
                            : "Datum hinzufügen"}
                        </span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    side="bottom"
                  >
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex-1 flex space-x-2  w-full "
                    >
                      <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-col items-start ">
                        <span className="text-sm font-medium">Bis</span>
                        <span className="text-sm">
                          {date?.to
                            ? format(date.to, "dd.MM.yyyy")
                            : "Datum hinzufügen"}
                        </span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="end"
                    side="bottom"
                  >
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="w-[60%] h-[1px] bg-border mx-auto mb-5" />
              {/* Filters */}
              <div className="flex justify-center items-center w-full mb-5 space-x-4">
                {/* Umkreis Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 w-full "
                    >
                      <MapPin className="h-4 w-4" />
                      <div className="flex flex-col items-start min-w-[4.5rem]">
                        <span className="text-sm font-medium">Umkreis</span>
                        <span className="text-sm">{distance} km</span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-40 p-2"
                    align="start"
                    side="bottom"
                  >
                    <div className="flex flex-col gap-2">
                      {[2, 5, 10, 50].map((km) => (
                        <Button
                          key={km}
                          variant={distance === km ? "default" : "ghost"}
                          className="justify-center"
                          onClick={() => setDistance(km)}
                        >
                          {km} km
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Divider */}

                {/* Sportart Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 w-full"
                    >
                      <FaRunning className="h-4 w-4" />
                      <div className="flex flex-col items-start min-w-[4.5rem]">
                        <span className="text-sm font-medium">Sportart</span>
                        <span className="text-sm">{sportTyp}</span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-40 p-2"
                    align="end"
                    side="bottom"
                  >
                    <div className="flex flex-col gap-2">
                      {["Alle", "Fußball", "Basketball", "Eishockey"].map(
                        (sport) => (
                          <Button
                            key={sport}
                            variant={sportTyp === sport ? "default" : "ghost"}
                            className="justify-center"
                            onClick={() => setSportTyp(sport)}
                          >
                            {sport}
                          </Button>
                        )
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  onClick={handleInputClickFalse}
                  className="hover:bg-gray-100"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
