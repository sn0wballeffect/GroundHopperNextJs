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
import { useStore } from "@/lib/store";
import { Trash2, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar() {
  const { setOpen, open } = useSidebar(); // Add open state
  const savedMatches = useStore((state) => state.savedMatches);
  const removeSavedMatch = useStore((state) => state.removeSavedMatch);

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
    name: "John Doe",
    email: "john@example.com",
    avatar: "/path/to/avatar.jpg",
  };

  return (
    <Sidebar side="right">
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Spiele</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {savedMatches.map((match, index) => (
                <div key={match.id}>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="flex items-center justify-between w-full">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {match.home_team} vs {match.away_team}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {match.date_string}
                        </div>
                      </div>
                      <span
                        role="button"
                        className="ml-2 text-muted-foreground hover:text-destructive cursor-pointer"
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
      <SidebarFooter />
    </Sidebar>
  );
}
