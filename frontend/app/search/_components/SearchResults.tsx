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
import { LuArrowRight } from "react-icons/lu";

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
          <Card className="mb-2 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Bayern München vs Werden Bremen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>🕒 23.11.2024, 19:00Uhr</p>
            </CardContent>
            <CardFooter className="flex flex-row justify-between ml-1">
              <p>📍 5 km entfernt</p>
              <Button size="icon" className="rounded-full">
                <LuArrowRight />
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
              <Button onClick={() => setIsFlipped(false)}>Back</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};
