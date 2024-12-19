import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { NavUser } from "./sidebarUser";

export function AppSidebar() {
  // You can either define the user object here
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
      <SidebarContent>Sortierung</SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
