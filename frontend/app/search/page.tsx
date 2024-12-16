import { SearchComponentMobile } from "@/components/SearchComponentMobile";
import { SearchComponent } from "../../components/SearchComponent";
import { MapProvider } from "../providers/map-provider";
import { SearchResults } from "./_components/SearchResults";
import { MapComponent } from "./_components/Map";

export default function SearchPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="hidden md:block mt-5 xl:mt-0">
        <SearchComponent />
      </div>
      <div className="block md:hidden mt-5">
        <SearchComponentMobile />
      </div>
      <div className="grid flex-1 grid-cols-1 gap-2 p-2 md:grid-cols-5 overflow-hidden">
        <div className="col-span-2 h-full overflow-y-auto custom-scrollbar-hidden">
          <SearchResults />
        </div>
        <div className="col-span-3 hidden md:block h-full">
          <MapProvider>
            <MapComponent />
          </MapProvider>
        </div>
      </div>
    </div>
  );
}
