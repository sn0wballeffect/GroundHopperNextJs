import { MapProvider } from "../providers/map-provider";
import { MapComponent } from "./_components/Map";
import { SearchComponentMobile } from "./_components/SearchComponentMobile";
import { SearchResults } from "./_components/SearchResults";

export default function SearchPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="sticky top-0 z-30 bg-background shadow-md">
        <SearchComponentMobile />
      </div>
      <div className="mt-2 ">
        <SearchResults />
        <SearchResults />
        <SearchResults />
        <SearchResults />
        <SearchResults />
        <SearchResults />
        <SearchResults />
      </div>
    </div>
  );
}
