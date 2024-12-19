"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { NavUser } from "./sidebarUser";
import { useSavedMatchesStore } from "@/lib/savedMatchesStore";
import { Trash2, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";

export function AppSidebar() {
  const { setOpen } = useSidebar(); // Add open state
  const savedMatches = useSavedMatchesStore((state) => state.savedMatches);
  const removeSavedMatch = useSavedMatchesStore(
    (state) => state.removeSavedMatch
  );

  // Track previous match count
  const [prevMatchCount, setPrevMatchCount] = useState(savedMatches.length);

  // Only open when new matches are added
  useEffect(() => {
    if (savedMatches.length > prevMatchCount) {
      setOpen(true);
    }
    setPrevMatchCount(savedMatches.length);
  }, [savedMatches.length, setOpen]);

  const user = {
    name: "Mosen",
    email: "ulrichfischer@max-planck.de",
    avatar: "/path/to/avatar.jpg",
  };

  return (
    <Sidebar side="right">
      <SidebarHeader className="mt-1">
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className="custom-scrollbar-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Spiele</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {savedMatches.map((match, index) => (
                <div key={match.id}>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="flex items-center justify-between w-full py-8">
                      <div className="flex-1 min-w-0 mr-2">
                        <div className="font-medium truncate mb-1">
                          {match.home_team} vs {match.away_team}
                        </div>
                        <div className="flex flex-col text-xs text-muted-foreground space-y-0.5">
                          <div className="truncate">{match.date_string}</div>
                          <div className="truncate">
                            {match.event_time
                              ? match.event_time.split("T")[1].substring(0, 5)
                              : ""}
                          </div>
                        </div>
                      </div>
                      <span
                        role="button"
                        className="flex-shrink-0 text-muted-foreground hover:text-destructive cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSavedMatch(match.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {index < savedMatches.length - 1 && (
                    <div className="relative my-3 px-4">
                      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 
                                      bg-background rounded-full border border-primary/20 flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-primary/40 rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {savedMatches.length === 0 && (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  Keine Spiele hinzugefügt
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {savedMatches.length > 0 && (
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
          >
            <Ticket className="h-4 w-4" />
            Tickets bestellen
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
