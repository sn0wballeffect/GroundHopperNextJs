"use client";

import * as React from "react";
import {
  MapPin,
  Ticket,
  Train,
  Hotel,
  ExternalLink,
  Bus,
  Badge,
  Home,
  Check,
  X,
  Trash2, // Add this import
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSavedMatchesStore } from "@/lib/savedMatchesStore";
import { Match } from "@/lib/types";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const defaultCompletedSections = {
  tickets: false,
  travel: false,
  accommodation: false,
};

// Update the card variants for smoother animations
const cardVariants = {
  initial: { scale: 0.96, opacity: 0, y: 5 },
  animate: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  hover: {
    scale: 1.01,
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    transition: { duration: 0.3 },
  },
  exit: {
    scale: 0.96,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const cardContentVariants = {
  initial: { y: 5, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    y: -5,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const checkmarkVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1, rotate: 360 },
  exit: { scale: 0, opacity: 0 },
};

const sectionVariants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.2 },
    },
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.3, delay: 0.1 },
    },
  },
};

export default function CheckoutPage() {
  const savedMatches = useSavedMatchesStore((state) => state.savedMatches);
  const completedSections = useSavedMatchesStore(
    (state) => state.completedSections
  );
  const updateCompletedSections = useSavedMatchesStore(
    (state) => state.updateCompletedSections
  );
  const [selectedMatch, setSelectedMatch] = React.useState<Match | null>(null);
  const [showTravel, setShowTravel] = React.useState(false);
  const [showAccommodation, setShowAccommodation] = React.useState(false);
  const [showTickets, setShowTickets] = React.useState(true);
  const removeSavedMatch = useSavedMatchesStore(
    (state) => state.removeSavedMatch
  );
  const [isAutoDeselecting, setIsAutoDeselecting] = React.useState(false);

  React.useEffect(() => {
    // Reset collapsible states and show tickets when match changes
    if (selectedMatch) {
      setShowTickets(true);
      setShowTravel(false);
      setShowAccommodation(false);
    }
  }, [selectedMatch]);

  // Add this function to determine the next section
  const getNextSection = (
    currentSection: keyof typeof defaultCompletedSections
  ) => {
    const sections = ["tickets", "travel", "accommodation"] as const;
    const currentIndex = sections.indexOf(currentSection);
    return sections[currentIndex + 1];
  };

  // Update the handleLinkClick function
  const handleLinkClick = (section: keyof typeof defaultCompletedSections) => {
    if (!selectedMatch) return;

    const currentSections = completedSections[selectedMatch.id] || {
      tickets: false,
      travel: false,
      accommodation: false,
    };

    const updatedSections = {
      ...currentSections,
      [section]: true,
    };

    updateCompletedSections(selectedMatch.id, updatedSections);

    // Close current section and open next section
    switch (section) {
      case "tickets":
        setShowTickets(false);
        setShowTravel(true);
        break;
      case "travel":
        setShowTravel(false);
        setShowAccommodation(true);
        break;
      case "accommodation":
        setShowAccommodation(false);
        // Check if all sections are now complete
        if (Object.values(updatedSections).every((value) => value)) {
          setIsAutoDeselecting(true);
          setSelectedMatch(null);
        }
        break;
    }
  };

  const handleMarkAllComplete = (matchId: number) => {
    updateCompletedSections(matchId, {
      tickets: true,
      travel: true,
      accommodation: true,
    });
  };

  const closeAllCollapsibles = () => {
    setShowTickets(false);
    setShowTravel(false);
    setShowAccommodation(false);
  };

  // Add this helper function at the top of the component
  const isMatchFullyCompleted = (matchId: number) => {
    const sections = completedSections[matchId];
    return sections
      ? Object.values(sections).every((value) => value === true)
      : false;
  };

  // Add this new handler function after handleLinkClick
  const handleUnmarkSection = (
    matchId: number,
    section: keyof typeof defaultCompletedSections
  ) => {
    const currentSections = completedSections[matchId] || {
      tickets: false,
      travel: false,
      accommodation: false,
    };

    updateCompletedSections(matchId, {
      ...currentSections,
      [section]: false,
    });
  };

  // Update the Card components to use the per-match completion status:
  const getMatchCompletedSections = (matchId: number) => {
    return (
      completedSections[matchId] || {
        tickets: false,
        travel: false,
        accommodation: false,
      }
    );
  };

  // Sort matches by date and time
  const sortedMatches = React.useMemo(() => {
    return [...savedMatches].sort((a, b) => {
      // Compare dates first
      const dateA = a.event_date ? new Date(a.event_date) : new Date(0);
      const dateB = b.event_date ? new Date(b.event_date) : new Date(0);

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }

      // If dates are equal, compare times
      const timeA = a.event_time || "";
      const timeB = b.event_time || "";
      return timeA.localeCompare(timeB);
    });
  }, [savedMatches]);

  // Add near other state management functions:
  const resetAllMatches = useSavedMatchesStore((state) => state.resetMatches); // Add this to your store if not exists

  // Add this helper function after other helper functions
  const areAllMatchesCompleted = (matches: Match[]) => {
    return matches.every((match) => isMatchFullyCompleted(match.id));
  };

  return (
    // Main container adjustments
    <div
      className="flex justify-center max-h-[calc(100vh-5rem)] min-h-[calc(100vh-5rem)] 
      bg-gradient-to-br from-background via-background to-primary/5 px-6 pb-5"
    >
      <div
        className="w-full max-w-[1200px] 3xl:max-w-[1400px] flex rounded-2xl 
        border bg-card/95 backdrop-blur-md overflow-hidden my-5 
        shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)]"
      >
        {/* Left column - Make it full height */}
        <div className="flex-1 border-r h-full flex flex-col bg-gradient-to-b from-background to-card">
          {" "}
          {/* Added h-full and flex flex-col */}
          <h1 className="text-2xl font-bold py-6 px-6 border-b bg-background/50">
            Ausgewählte Spiele
          </h1>
          <ScrollArea className="flex-1">
            {" "}
            {/* Changed to flex-1 */}
            <div className="w-[90%] mx-auto my-2">
              <div className="grid gap-2">
                {sortedMatches.map((match, index) => (
                  <React.Fragment key={match.id}>
                    <motion.div
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      exit="exit"
                      layout
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-300
                          border-l-[6px] rounded-xl
                          hover:bg-accent/30 
                          ${
                            selectedMatch?.id === match.id
                              ? "bg-accent/40 shadow-lg"
                              : ""
                          }
                          ${
                            isMatchFullyCompleted(match.id)
                              ? "border-l-primary"
                              : "border-l-muted"
                          }`}
                        onClick={() => {
                          setIsAutoDeselecting(false);
                          setSelectedMatch(match);
                        }}
                      >
                        <motion.div variants={cardContentVariants}>
                          <CardContent className="py-2 md:py-4 px-4 md:px-6">
                            <div className="flex items-center justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <AnimatePresence>
                                    {isMatchFullyCompleted(match.id) && (
                                      <motion.div
                                        variants={checkmarkVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                      >
                                        <Check className="h-4 w-4 text-green-600" />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                  <p className="font-semibold text-base md:text-lg">
                                    {match.home_team}
                                    <span className="text-muted-foreground mx-1 md:mx-2">
                                      vs
                                    </span>
                                    {match.away_team}
                                  </p>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  <span>{match.stadium}</span>
                                </div>
                              </div>
                              <div className="text-right flex items-start gap-2">
                                <div>
                                  <p className="font-medium text-base md:text-lg">
                                    {match.date_string}
                                  </p>
                                  <p className="text-sm md:text-base text-muted-foreground">
                                    {match.event_time
                                      ? `${match.event_time
                                          .split("T")[1]
                                          .substring(0, 5)} Uhr`
                                      : ""}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeSavedMatch(match.id);
                                    if (selectedMatch?.id === match.id) {
                                      setSelectedMatch(null);
                                    }
                                  }}
                                  className="p-1.5 rounded-full hover:bg-accent/80 text-muted-foreground hover:text-destructive transition-colors"
                                  aria-label="Remove match"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </CardContent>
                        </motion.div>
                      </Card>
                    </motion.div>
                    {index < sortedMatches.length - 1 && (
                      <motion.div
                        className="flex justify-center py-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex flex-col gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/30"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                        </div>
                      </motion.div>
                    )}
                  </React.Fragment>
                ))}

                {/* Add completion button here */}
                {savedMatches.length > 0 &&
                  areAllMatchesCompleted(savedMatches) && (
                    <div className="flex justify-center mt-8 mb-4">
                      <Button
                        variant="default"
                        size="lg"
                        onClick={() => {
                          resetAllMatches();
                          updateCompletedSections(0, defaultCompletedSections);
                          setSelectedMatch(null); // Clear selected match
                          closeAllCollapsibles();
                        }}
                        className="px-8 py-4 text-base font-medium
                          bg-gradient-to-r from-primary to-primary/90
                          hover:from-primary/90 hover:to-primary
                          text-primary-foreground
                          shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)]
                          rounded-xl transition-all duration-300 
                          hover:scale-105 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]"
                      >
                        🎉 Großartige Auswahl!
                      </Button>
                    </div>
                  )}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Right column - Make it full height */}
        <div className="w-[400px] h-full flex flex-col ">
          {" "}
          {/* Added h-full and flex flex-col */}
          {selectedMatch ? (
            <ScrollArea className="flex-1 p-6">
              {" "}
              {/* Changed to flex-1 and added padding */}
              <div className="w-[90%] mx-auto space-y-6">
                {/* Ticket Section */}
                <Collapsible open={showTickets} onOpenChange={setShowTickets}>
                  <Card
                    className={`transition-all duration-300
                      ${
                        getMatchCompletedSections(selectedMatch.id).tickets
                          ? "border-primary"
                          : "hover:border-primary/50"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <CollapsibleTrigger className="flex-1">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            {getMatchCompletedSections(selectedMatch.id)
                              .tickets ? (
                              <Check className="mr-2 h-5 w-5 text-green-600" />
                            ) : (
                              <Ticket className="mr-2 h-5 w-5" />
                            )}
                            Tickets
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      {getMatchCompletedSections(selectedMatch.id).tickets && (
                        <div className="pr-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnmarkSection(selectedMatch.id, "tickets");
                            }}
                            className="p-1 rounded-full hover:bg-accent text-muted-foreground"
                            aria-label="Unmark tickets section"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                    <AnimatePresence mode="wait">
                      {showTickets && (
                        <motion.div
                          variants={sectionVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                        >
                          <CollapsibleContent>
                            <CardContent>
                              <div className="space-y-4">
                                <Link
                                  href="https://www.google.com"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => handleLinkClick("tickets")}
                                >
                                  <Button
                                    variant="default"
                                    className="w-full h-auto p-4 
                                      bg-gradient-to-r from-primary to-primary/90
                                      hover:from-primary/90 hover:to-primary
                                      text-primary-foreground
                                      transition-all duration-200 
                                      hover:scale-[1.02]
                                      hover:opacity-90
                                      rounded-xl"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center space-x-4">
                                        {getMatchCompletedSections(
                                          selectedMatch.id
                                        ).tickets ? (
                                          <Check className="h-8 w-8" />
                                        ) : (
                                          <Ticket className="h-8 w-8" />
                                        )}
                                        <div className="text-left">
                                          <p className="font-semibold">
                                            Offizieller Ticketshop
                                          </p>
                                        </div>
                                      </div>
                                      <ExternalLink className="h-4 w-4" />
                                    </div>
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </Collapsible>

                {/* Travel Section */}
                <Collapsible open={showTravel} onOpenChange={setShowTravel}>
                  <Card
                    className={`transition-all duration-300
                      ${
                        getMatchCompletedSections(selectedMatch.id).travel
                          ? "border-primary"
                          : "hover:border-primary/50"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <CollapsibleTrigger className="flex-1">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            {getMatchCompletedSections(selectedMatch.id)
                              .travel ? (
                              <Check className="mr-2 h-5 w-5 text-green-600" />
                            ) : (
                              <Train className="mr-2 h-5 w-5" />
                            )}
                            Reiseoptionen
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      {getMatchCompletedSections(selectedMatch.id).travel && (
                        <div className="pr-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnmarkSection(selectedMatch.id, "travel");
                            }}
                            className="p-1 rounded-full hover:bg-accent text-muted-foreground"
                            aria-label="Unmark travel section"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                    <AnimatePresence mode="wait">
                      {showTravel && (
                        <motion.div
                          variants={sectionVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                        >
                          <CollapsibleContent>
                            <CardContent>
                              <div className="space-y-4">
                                <Link
                                  href="https://www.bahn.de"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => handleLinkClick("travel")}
                                >
                                  <Button
                                    variant="default"
                                    className="w-full h-auto p-4 
                                      bg-gradient-to-r from-primary to-primary/90
                                      hover:from-primary/90 hover:to-primary
                                      text-primary-foreground
                                      transition-all duration-200 
                                      hover:scale-[1.02]
                                      hover:opacity-90
                                      rounded-xl"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center space-x-4">
                                        {getMatchCompletedSections(
                                          selectedMatch.id
                                        ).travel ? (
                                          <Check className="h-8 w-8" />
                                        ) : (
                                          <Train className="h-8 w-8" />
                                        )}
                                        <div className="text-left">
                                          <p className="font-semibold">
                                            Deutsche Bahn
                                          </p>
                                        </div>
                                      </div>
                                      <ExternalLink className="h-4 w-4" />
                                    </div>
                                  </Button>
                                </Link>
                                <div className="my-2"></div>
                                <Link
                                  href="https://www.flixbus.de"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => handleLinkClick("travel")}
                                >
                                  <Button
                                    variant="default"
                                    className="w-full h-auto p-4 
                                      bg-gradient-to-r from-primary to-primary/90
                                      hover:from-primary/90 hover:to-primary
                                      text-primary-foreground
                                      transition-all duration-200 
                                      hover:scale-[1.02]
                                      hover:opacity-90
                                      rounded-xl"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center space-x-4">
                                        {getMatchCompletedSections(
                                          selectedMatch.id
                                        ).travel ? (
                                          <Check className="h-8 w-8" />
                                        ) : (
                                          <Bus className="h-8 w-8" />
                                        )}
                                        <div className="text-left">
                                          <p className="font-semibold">
                                            FlixBus
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <ExternalLink className="h-4 w-4" />
                                      </div>
                                    </div>
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </Collapsible>

                {/* Accommodation Section */}
                <Collapsible
                  open={showAccommodation}
                  onOpenChange={setShowAccommodation}
                >
                  <Card
                    className={`transition-all duration-300
                      ${
                        getMatchCompletedSections(selectedMatch.id)
                          .accommodation
                          ? "border-primary"
                          : "hover:border-primary/50"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <CollapsibleTrigger className="flex-1">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            {getMatchCompletedSections(selectedMatch.id)
                              .accommodation ? (
                              <Check className="mr-2 h-5 w-5 text-green-600" />
                            ) : (
                              <Hotel className="mr-2 h-5 w-5" />
                            )}
                            Unterkunft
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      {getMatchCompletedSections(selectedMatch.id)
                        .accommodation && (
                        <div className="pr-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnmarkSection(
                                selectedMatch.id,
                                "accommodation"
                              );
                            }}
                            className="p-1 rounded-full hover:bg-accent text-muted-foreground"
                            aria-label="Unmark accommodation section"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                    <AnimatePresence mode="wait">
                      {showAccommodation && (
                        <motion.div
                          variants={sectionVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                        >
                          <CollapsibleContent>
                            <CardContent>
                              <div className="space-y-4">
                                <Link
                                  href="https://www.booking.com"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() =>
                                    handleLinkClick("accommodation")
                                  }
                                >
                                  <Button
                                    variant="default"
                                    className="w-full h-auto p-4 
                                      bg-gradient-to-r from-primary to-primary/90
                                      hover:from-primary/90 hover:to-primary
                                      text-primary-foreground
                                      transition-all duration-200 
                                      hover:opacity-90
                                      hover:scale-[1.02]

                                      rounded-xl"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center space-x-4">
                                        {getMatchCompletedSections(
                                          selectedMatch.id
                                        ).accommodation ? (
                                          <Check className="h-8 w-8" />
                                        ) : (
                                          <Hotel className="h-8 w-8" />
                                        )}
                                        <div className="text-left">
                                          <p className="font-semibold">
                                            Hotels
                                          </p>
                                        </div>
                                      </div>
                                      <ExternalLink className="h-4 w-4" />
                                    </div>
                                  </Button>
                                </Link>
                                <div className="border-t border-border"></div>
                                <Link
                                  href="https://www.airbnb.com"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() =>
                                    handleLinkClick("accommodation")
                                  }
                                >
                                  <Button
                                    variant="default"
                                    className="w-full h-auto p-4 
                                      bg-gradient-to-r from-primary to-primary/90
                                      hover:from-primary/90 hover:to-primary
                                      text-primary-foreground
                                      transition-all duration-200 
                                      hover:scale-[1.02]
                                      hover:opacity-90
                                      rounded-xl"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center space-x-4">
                                        {getMatchCompletedSections(
                                          selectedMatch.id
                                        ).accommodation ? (
                                          <Check className="h-8 w-8" />
                                        ) : (
                                          <Home className="h-8 w-8" />
                                        )}
                                        <div className="text-left">
                                          <p className="font-semibold">
                                            Ferienwohnungen
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <ExternalLink className="h-4 w-4" />
                                      </div>
                                    </div>
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </Collapsible>

                {/* Add this after the last Collapsible section (Accommodation) */}
                {selectedMatch && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      onClick={() => {
                        handleMarkAllComplete(selectedMatch.id);
                        closeAllCollapsibles();
                        setIsAutoDeselecting(true);
                        setSelectedMatch(null);
                      }}
                      className="w-full mt-4 transition-colors duration-200 hover:opacity-90 hover:scale-[1.02]"
                    >
                      Fertig
                    </Button>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground p-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-accent-foreground/60" />
                </div>
                <p className="text-lg font-medium">
                  Wähle ein Spiel aus, um Tickets zu kaufen
                </p>
                <p className="text-sm text-muted-foreground">
                  Plane deine perfekte Reise zum Spiel
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
