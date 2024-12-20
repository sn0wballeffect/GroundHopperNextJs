"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const BREADCRUMB_HIERARCHY = [
  { path: "/", label: "Home" },
  { path: "/search", label: "Suche" },
  { path: "/checkout", label: "Checkout" },
];

export function NavBar() {
  const pathname = usePathname();

  // Find current page depth in hierarchy
  const currentIndex = BREADCRUMB_HIERARCHY.findIndex(
    (item) => pathname.startsWith(item.path) && item.path !== "/"
  );

  // Generate breadcrumbs based on hierarchy
  const breadcrumbs = BREADCRUMB_HIERARCHY.slice(0, currentIndex + 1).map(
    (item, index) => {
      const isLast = index === currentIndex;

      return (
        <BreadcrumbItem key={item.path}>
          {isLast ? (
            <BreadcrumbPage>{item.label}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={item.path}>{item.label}</Link>
            </BreadcrumbLink>
          )}
          {!isLast && <BreadcrumbSeparator />}
        </BreadcrumbItem>
      );
    }
  );

  return (
    <header className="flex items-center justify-between p-3 bg-transparent w-full">
      <Breadcrumb>
        <BreadcrumbList>{breadcrumbs}</BreadcrumbList>
      </Breadcrumb>
      <SidebarTrigger className="rotate-180" />
    </header>
  );
}
