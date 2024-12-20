"use client";

import * as React from "react";
import { ChevronRight, MapPin, Ticket, Train, Hotel } from "lucide-react";
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

export default function CheckoutPage() {
  const savedMatches = useSavedMatchesStore((state) => state.savedMatches);
  const [selectedMatch, setSelectedMatch] = React.useState<Match | null>(null);
  const [showTravel, setShowTravel] = React.useState(false);
  const [showAccommodation, setShowAccommodation] = React.useState(false);

  return (
    <div className="flex justify-center min-h-screen bg-background">
      <div className="w-full max-w-[1200px] flex rounded-xl border bg-card overflow-hidden">
        {/* Left column - Matches list */}
        <div className="flex-1 border-r p-6">
          <h1 className="text-2xl font-bold mb-6">Ausgewählte Spiele</h1>
          <div className="grid gap-2">
            {savedMatches.map((match, index) => (
              <React.Fragment key={match.id}>
                <Card
                  className={`cursor-pointer transition-colors hover:bg-accent ${
                    selectedMatch?.id === match.id ? "border-primary" : ""
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
                {index < savedMatches.length - 1 && (
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

        {/* Right column - Ticket options and additional services */}
        <div className="w-[400px] p-6">
          {selectedMatch ? (
            <ScrollArea className="h-[calc(100vh-2rem)]">
              <div className="space-y-6">
                {/* Ticket Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Ticket className="mr-2 h-5 w-5" />
                      Tickets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button className="w-full justify-between">
                        Haupttribüne
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button className="w-full justify-between">
                        Gegentribüne
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button className="w-full justify-between">
                        Kurve
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Travel Section */}
                <Collapsible open={showTravel} onOpenChange={setShowTravel}>
                  <Card>
                    <CardHeader>
                      <CollapsibleTrigger className="w-full">
                        <CardTitle className="flex items-center">
                          <Train className="mr-2 h-5 w-5" />
                          Anreise
                        </CardTitle>
                      </CollapsibleTrigger>
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent>
                        <div className="space-y-4">
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            Bahn
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            Bus
                            <ChevronRight className="h-4 w-4" />
                          </Button>
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
                  <Card>
                    <CardHeader>
                      <CollapsibleTrigger className="w-full">
                        <CardTitle className="flex items-center">
                          <Hotel className="mr-2 h-5 w-5" />
                          Unterkunft
                        </CardTitle>
                      </CollapsibleTrigger>
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent>
                        <div className="space-y-4">
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            Hotels
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            Ferienwohnungen
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
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
