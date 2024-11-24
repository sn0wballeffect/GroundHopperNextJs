"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, MapPin, ArrowRight, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const SearchResults = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div style={{ perspective: "1000px" }}>
      <motion.div
        className="relative cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Card */}
        <motion.div
          style={{
            backfaceVisibility: "hidden",
            position: isFlipped ? "absolute" : "relative",
          }}
        >
          <Card className="mb-3 shadow-md">
            <CardHeader className="flex flex-row justify-between items-start">
              <CardTitle className="text-lg font-bold">
                Bayern München vs Werden Bremen
              </CardTitle>
              <Badge className={`bg-black hover:bg-black pointer-events-none`}>
                Fußball
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-row items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              <p> 23.11.2024, 19:00Uhr</p>
            </CardContent>
            <CardFooter className="flex flex-row items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <p>Allianz Arena, München</p>
              <div className="h-6 w-[1px] bg-border mx-3" />
              <Navigation className="h-4 w-4 mr-2" />
              <p>5 km entfernt</p>
              <Button className="rounded-full ml-auto h-9 w-9">
                <ArrowRight />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Back Card */}
        <motion.div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: isFlipped ? "relative" : "absolute",
          }}
        >
          <Card className="mb-2 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Detailed information goes here...</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setIsFlipped(false)}>Zurück</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};
