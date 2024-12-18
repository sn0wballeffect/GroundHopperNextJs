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
import { format, addDays, subDays } from "date-fns";
import { CalendarIcon, Search, LocateFixed, MapPin } from "lucide-react";
import React, { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { searchCities } from "@/lib/api";
import { City } from "@/lib/types";
import { Command, CommandList, CommandItem } from "./ui/command";
import { debounce } from "lodash";
import { DateRange } from "react-day-picker";

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
  const [cities, setCities] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setCities([]);
        return;
      }
      setIsSearching(true);
      const results = await searchCities(query);
      setCities(results);
      setIsSearching(false);
    }, 200),
    [setCities, setIsSearching]
  );

  // Update handler to use global state
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleCitySelect = (city: City) => {
    setSearchQuery(city.name);
    setUserLocation({
      lat: city.latitude,
      lng: city.longitude,
    });
    setCities([]);
  };

  const handleButtonClick = () => {
    if (!isSearchPage) {
      router.push("/search");
    }
  };

  const handleGetLocation = () => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      // Remove location
      setUserLocation({ lat: null, lng: null });
      setSearchQuery("");
      return;
    }

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
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && cities.length > 0) {
      handleCitySelect(cities[0]);
    }
  };

  const localDistance = useStore((state) => state.localDistance);
  const setLocalDistance = useStore((state) => state.setLocalDistance);

  const debouncedSetDistance = useCallback(
    debounce((value: number) => {
      setDistance(value);
    }, 300),
    [setDistance]
  );

  const handleDistanceChange = (value: number) => {
    setLocalDistance(value);
    debouncedSetDistance(value);
  };

  const [localDate, setLocalDate] = useState(date);

  const debouncedSetDate = useCallback(
    debounce((newDate: DateRange | undefined) => {
      setDate(newDate);
    }, 300),
    []
  );

  return (
    <div className="w-[60%] mb-5 min-w-[750px] mx-auto">
      <div className="flex items-center gap-2 p-3 bg-white rounded-full shadow-lg">
        <div className="relative flex-1 px-3 ml-1">
          <div className="text-sm font-medium ml-1">Ort</div>
          <Input
            type="text"
            placeholder="Ort suchen..."
            className="border-0 shadow-none p-0 focus-visible:ring-0 text-sm placeholder:text-muted-foreground px-1"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          {cities.length > 0 && (
            <div className="absolute w-full z-50 bg-white rounded-md shadow-xl mt-1">
              <Command>
                <CommandList>
                  {cities.map((city) => (
                    <CommandItem
                      key={city.id}
                      onSelect={() => handleCitySelect(city)}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <MapPin className="h-4 w-4" />
                      <span>{city.name}</span>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </div>
          )}
          {isSearching && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <span className="animate-spin">⌛</span>
            </div>
          )}
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
          aria-label="Toggle location"
        />
        <div className="h-8 w-[1px] bg-border " />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="justify-start text-left font-normal px-4 flex-[0.5]"
              title="Scrollen um Radius anzupassen"
              onWheel={(e) => {
                e.preventDefault();
                const step = 5;
                const minDistance = 5;
                const maxDistance = 2000;

                let newDistance;
                if (e.deltaY < 0) {
                  // Scrolling up - increase radius
                  newDistance = Math.min(maxDistance, localDistance + step);
                } else {
                  // Scrolling down - decrease radius
                  newDistance = Math.max(minDistance, localDistance - step);
                }

                handleDistanceChange(newDistance);
              }}
            >
              <MapPin className="h-4 w-4" />
              <div>
                <div className="text-sm font-medium">Umkreis</div>
                <span className="text-sm">{localDistance} km</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2" align="start">
            <div className="flex flex-col gap-2">
              {[10, 25, 50, 200].map((km) => (
                <Button
                  key={km}
                  variant={localDistance === km ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => {
                    handleDistanceChange(km);
                  }}
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
              title="Scrollen um Datum anzupassen"
              className={cn(
                "justify-start text-left font-normal px-4 min-w-[8rem] flex-[0.5]",
                !localDate && "text-muted-foreground"
              )}
              onWheel={(e) => {
                e.preventDefault();
                if (!localDate?.from) return;

                const newFrom =
                  e.deltaY < 0
                    ? addDays(localDate.from, 1)
                    : subDays(localDate.from, 1);

                // Only update if new date doesn't exceed 'to' date
                if (localDate.to && newFrom > localDate.to) return;

                const newDate = { ...localDate, from: newFrom };
                setLocalDate(newDate);
                debouncedSetDate(newDate);
              }}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <div>
                <div className="text-sm font-medium">Von</div>
                {localDate?.from ? (
                  format(localDate.from, "dd.MM.yyyy")
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
              title="Scrollen um Datum anzupassen"
              className={cn(
                "justify-start text-left font-normal px-4 min-w-[8rem] flex-[0.5]",
                !localDate && "text-muted-foreground"
              )}
              onWheel={(e) => {
                e.preventDefault();
                if (!localDate?.to) return;

                const newTo =
                  e.deltaY < 0
                    ? addDays(localDate.to, 1)
                    : subDays(localDate.to, 1);

                // Only update if new date doesn't precede 'from' date
                if (localDate.from && newTo < localDate.from) return;

                const newDate = { ...localDate, to: newTo };
                setLocalDate(newDate);
                debouncedSetDate(newDate);
              }}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <div>
                <div className="text-sm font-medium">Bis</div>
                {localDate?.to ? (
                  format(localDate.to, "dd.MM.yyyy")
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
