"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Search, LocateFixed, MapPin } from "lucide-react";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

export const SearchComponent = () => {
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

  return (
    <div className="w-[60%] mb-5 min-w-[750px] mx-auto">
      <div className="flex items-center gap-2 p-3 bg-white rounded-full shadow-lg">
        <div className="flex-1 px-3 ml-1">
          <div className="text-sm font-medium ml-1">Standort</div>
          <Input
            type="text"
            placeholder={
              userLocation.lat && userLocation.lng
                ? `${userLocation.lat.toFixed(2)}°N, ${userLocation.lng.toFixed(
                    2
                  )}°E`
                : "Suchen..."
            }
            className="border-0 shadow-none p-0 focus-visible:ring-0 text-sm placeholder:text-muted-foreground px-1"
            value={searchQuery}
            onChange={handleInputChange}
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
        <div className="h-8 w-[1px] bg-border " />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="justify-start text-left font-normal px-4 flex-[0.5]"
            >
              <MapPin className="h-4 w-4" />
              <div>
                <div className="text-sm font-medium">Umkreis</div>
                <span className="text-sm">{distance} km</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2" align="start">
            <div className="flex flex-col gap-2">
              {[2, 5, 10, 50].map((km) => (
                <Button
                  key={km}
                  variant={distance === km ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setDistance(km)}
                >
                  {km} km
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <div className="h-8 w-[1px] bg-border" />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "justify-start text-left font-normal px-4 min-w-[8rem] flex-[0.5]",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <div>
                <div className="text-sm font-medium ">Von</div>
                {date?.from ? (
                  format(date.from, "dd.MM.yyyy")
                ) : (
                  <span className="text-sm">Datum hinzufügen</span>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <div className="h-8 w-[1px] bg-border" />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "justify-start text-left font-normal px-4 min-w-[8rem] flex-[0.5]",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <div>
                <div className="text-sm font-medium">Bis</div>
                {date?.to ? (
                  format(date.to, "dd.MM.yyyy")
                ) : (
                  <span className="text-sm ">Datum hinzufügen</span>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <div className="h-8 w-[1px] bg-border" />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="justify-start text-left font-normal min-w-[5rem] flex-[0.5]"
            >
              <div>
                <div className="text-sm font-medium">Sportart</div>
                <span className="text-sm">{sportTyp}</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2" align="start">
            <div className="flex flex-col gap-2">
              {["Alle", "Fußball", "Basketball", "Eishockey"].map((sport) => (
                <Button
                  key={sport}
                  variant={sportTyp === sport ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => {
                    setSportTyp(sport);
                  }}
                >
                  {sport}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Button
          size="icon"
          className="rounded-full ml-2"
          onClick={handleButtonClick}
        >
          <Search className="h-6 w-6" />
          <span className="sr-only">Suchen</span>
        </Button>
      </div>
    </div>
  );
};
