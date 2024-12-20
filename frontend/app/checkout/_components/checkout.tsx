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
  Check, // Add Check import
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

const defaultCompletedSections = {
  tickets: false,
  travel: false,
  accommodation: false,
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

  const handleLinkClick = (section: keyof typeof defaultCompletedSections) => {
    if (!selectedMatch) return;

    const currentSections = completedSections[selectedMatch.id] || {
      tickets: false,
      travel: false,
      accommodation: false,
    };

    updateCompletedSections(selectedMatch.id, {
      ...currentSections,
      [section]: true,
    });
  };

  const hasAnyCompleted = (matchId: number) => {
    const sections = completedSections[matchId];
    return sections
      ? Object.values(sections).some((value) => value === true)
      : false;
  };

  const handleMarkAllComplete = (matchId: number) => {
    updateCompletedSections(matchId, {
      tickets: true,
      travel: true,
      accommodation: true,
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

  return (
    <div className="flex justify-center min-h-[calc(100vh-5rem)] bg-background px-6 pb-5">
      <div className="w-full max-w-[1200px] 3xl:max-w-[1400px] flex rounded-xl border bg-card overflow-hidden">
        {/* Left column - Matches list */}
        <div className="flex-1 border-r py-6">
          <h1 className="text-2xl font-bold mb-6 ml-6">Ausgewählte Spiele</h1>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="w-[90%] mx-auto">
              <div className="grid gap-2">
                {sortedMatches.map((match, index) => (
                  <React.Fragment key={match.id}>
                    <Card
                      className={`cursor-pointer transition-colors  hover:bg-accent hover:shadow-lg ${
                        selectedMatch?.id === match.id ? "bg-accent" : ""
                      }`}
                      onClick={() => setSelectedMatch(match)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">
                              {match.home_team} vs {match.away_team}
                            </p>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <MapPin className="mr-1 h-4 w-4" />
                              {match.stadium}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{match.date_string}</p>
                            <p className="text-sm text-muted-foreground">
                              {match.event_time
                                ? match.event_time.split("T")[1].substring(0, 5)
                                : ""}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {index < sortedMatches.length - 1 && (
                      <div className="flex justify-center py-2">
                        <div className="flex flex-col gap-1">
                          <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
                          <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
                          <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Right column - Ticket options and additional services */}
        <div className="w-[400px] p-6">
          {selectedMatch ? (
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="w-[90%] mx-auto space-y-6">
                {/* Ticket Section */}
                <Collapsible open={showTickets} onOpenChange={setShowTickets}>
                  <Card
                    className={`${
                      getMatchCompletedSections(selectedMatch.id).tickets
                        ? "border-green-600"
                        : ""
                    }`}
                  >
                    <CollapsibleTrigger className="w-full">
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
                              className="w-full h-auto p-4 bg-primary hover:bg-primary/90 text-white transition-colors group"
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-4">
                                  {getMatchCompletedSections(selectedMatch.id)
                                    .tickets ? (
                                    <Check className="h-8 w-8" />
                                  ) : (
                                    <Ticket className="h-8 w-8" />
                                  )}
                                  <div className="text-left">
                                    <p className="font-semibold">
                                      Official Ticketshop
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
                  </Card>
                </Collapsible>

                {/* Travel Section */}
                <Collapsible open={showTravel} onOpenChange={setShowTravel}>
                  <Card
                    className={`${
                      getMatchCompletedSections(selectedMatch.id).travel
                        ? "border-green-600"
                        : ""
                    }`}
                  >
                    <CollapsibleTrigger className="w-full">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          {getMatchCompletedSections(selectedMatch.id)
                            .travel ? (
                            <Check className="mr-2 h-5 w-5 text-green-600" />
                          ) : (
                            <Train className="mr-2 h-5 w-5" />
                          )}
                          Travel Options
                        </CardTitle>
                      </CardHeader>
                    </CollapsibleTrigger>
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
                              className="w-full h-auto p-4 bg-primary hover:bg-primary/90 text-white transition-colors group"
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-4">
                                  {getMatchCompletedSections(selectedMatch.id)
                                    .travel ? (
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
                              className="w-full h-auto p-4 bg-primary hover:bg-primary/90 text-white transition-colors group"
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-4">
                                  {getMatchCompletedSections(selectedMatch.id)
                                    .travel ? (
                                    <Check className="h-8 w-8" />
                                  ) : (
                                    <Bus className="h-8 w-8" />
                                  )}
                                  <div className="text-left">
                                    <p className="font-semibold">FlixBus</p>
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
                  </Card>
                </Collapsible>

                {/* Accommodation Section */}
                <Collapsible
                  open={showAccommodation}
                  onOpenChange={setShowAccommodation}
                >
                  <Card
                    className={`${
                      getMatchCompletedSections(selectedMatch.id).accommodation
                        ? "border-green-600"
                        : ""
                    }`}
                  >
                    <CollapsibleTrigger className="w-full">
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
                    <CollapsibleContent>
                      <CardContent>
                        <div className="space-y-4">
                          <Link
                            href="https://www.booking.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleLinkClick("accommodation")}
                          >
                            <Button
                              variant="default"
                              className="w-full h-auto p-4 bg-primary hover:bg-primary/90 text-white transition-colors group"
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-4">
                                  {getMatchCompletedSections(selectedMatch.id)
                                    .accommodation ? (
                                    <Check className="h-8 w-8" />
                                  ) : (
                                    <Hotel className="h-8 w-8" />
                                  )}
                                  <div className="text-left">
                                    <p className="font-semibold">Hotels</p>
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
                            onClick={() => handleLinkClick("accommodation")}
                          >
                            <Button
                              variant="default"
                              className="w-full h-auto p-4 bg-primary hover:bg-primary/90 text-white transition-colors group"
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-4">
                                  {getMatchCompletedSections(selectedMatch.id)
                                    .accommodation ? (
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
                  </Card>
                </Collapsible>

                {/* Add this after the last Collapsible section (Accommodation) */}
                {selectedMatch && hasAnyCompleted(selectedMatch.id) && (
                  <Button
                    onClick={() => handleMarkAllComplete(selectedMatch.id)}
                    className="w-full mt-4"
                  >
                    Fertig
                  </Button>
                )}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Wähle ein Spiel aus, um Tickets zu kaufen
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
