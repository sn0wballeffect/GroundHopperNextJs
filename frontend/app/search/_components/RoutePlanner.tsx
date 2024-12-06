"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  MapPin,
  X,
  ChevronUp,
  ChevronDown,
  Route,
  ChevronRight,
} from "lucide-react";
import { useRouteStore } from "@/lib/routeStore";

interface RouteItem {
  id: string;
  title: string;
  date: string;
  location: string;
  distance: string;
}

export const RoutePlanner = () => {
  const { routes, isVisible, toggleVisibility, removeRoute } = useRouteStore();

  if (routes.length === 0) return null;

  return (
    <>
      <AnimatePresence>
        {!isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Button
                size="icon"
                className="rounded-full bg-primary text-primary-foreground h-10 w-10"
                onClick={toggleVisibility}
              >
                <Route className="h-6 w-6" />
                <span className="sr-only">Show Route Planner</span>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: isVisible ? 0 : -100 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 z-50 bg-background/80 border-b w-[80%] mx-auto rounded-md overflow-hidden"
        >
          <div className="container mx-auto p-4 relative">
            {isVisible && (
              <div
                className="flex flex-wrap items-start gap-4 custom-scrollbar-hidden"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {routes.map((route, index) => (
                  <div key={route.id} className="flex items-center">
                    <CompactRouteCard
                      route={route}
                      onRemove={() => removeRoute(route.id)}
                    />
                    {index < routes.length - 1 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0 mx-2"
                      >
                        {/* Show down arrow if next item will be on new row */}
                        {(index + 1) % 3 === 0 ? (
                          <ChevronDown className="h-6 w-6 text-primary" />
                        ) : (
                          <ChevronRight className="h-6 w-6 text-primary" />
                        )}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVisibility}
              className="flex mx-auto -mb-3 mt-1"
            >
              {isVisible ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

const CompactRouteCard = ({
  route,
  onRemove,
}: {
  route: RouteItem;
  onRemove: () => void;
}) => {
  return (
    <Card className="shadow-sm flex-shrink-0 min-w-[200px]">
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{route.title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-2" />
          <span className="mr-4">{route.date}</span>
          <MapPin className="h-4 w-4 mr-2" />
          <span>{route.location}</span>
        </div>
      </CardContent>
    </Card>
  );
};
