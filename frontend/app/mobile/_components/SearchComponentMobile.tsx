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
import { CalendarIcon, Search, LocateFixed, MapPin } from "lucide-react";
import React, { useState } from "react";
import { useStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserLocation {
  lat: number | null;
  lng: number | null;
}

export const SearchComponentMobile = () => {
  const [open, setOpen] = React.useState(false);

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
    <div className="w-[90%] mx-auto m-4">
      <div className="flex items-center gap-2 p-4 bg-white rounded-full shadow-lg">
        <div className="flex-1 ml-1">
          <div className="flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-4" />
            <Input
              type="text"
              placeholder={
                userLocation.lat && userLocation.lng
                  ? `${userLocation.lat.toFixed(
                      2
                    )}°N, ${userLocation.lng.toFixed(2)}°E`
                  : "Suchen..."
              }
              className="border-0 shadow-none p-0 focus-visible:ring-0 text-sm placeholder:text-muted-foreground px-1"
              value={searchQuery}
              onChange={handleInputChange}
            />
          </div>
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
    </div>
  );
};
