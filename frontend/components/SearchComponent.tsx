"use client";
import { SlLocationPin } from "react-icons/sl";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";

export const SearchComponent = () => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [distance, setDistance] = React.useState<number>(10);
  const [sportTyp, setSportTyp] = React.useState<string>("Alle");

  return (
    <div className="w-[60%] max-w-6xl mx-auto mb-5 min-w-[750px]">
      <div className="flex items-center gap-2 p-2 bg-white rounded-full shadow-lg">
        <div className="flex-1 px-3 ml-1">
          <div className="text-sm font-medium ml-1">Wohin</div>
          <Input
            type="text"
            placeholder="Standort"
            className="border-0 p-0 focus-visible:ring-0 text-sm placeholder:text-muted-foreground px-1"
          />
        </div>
        <div className="h-8 w-[1px] bg-border" />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="justify-start text-left font-normal px-4"
            >
              <SlLocationPin className="mr-2 h-4 w-4" />
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
                "justify-start text-left font-normal px-4 ",
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
                "justify-start text-left font-normal px-4",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <div>
                <div className="text-sm font-medium">Bis</div>
                {date?.to ? (
                  format(date.to, "dd.MM.yyyy")
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
              className="justify-start text-left font-normal px-4 min-w-[8rem]"
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
                  onClick={() => setSportTyp(sport)}
                >
                  {sport}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <div className="h-8 w-[1px] bg-border" />
        <Button size="icon" className="rounded-full ml-2">
          <Search className="h-6 w-6" />
          <span className="sr-only">Suchen</span>
        </Button>
      </div>
    </div>
  );
};
