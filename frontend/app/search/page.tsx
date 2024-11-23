import { SearchComponent } from "../../components/SearchComponent";
import { MapProvider } from "../providers/map-provider";
import { MapComponent } from "./_components/map";
import { SearchResults } from "./_components/SearchResults";

export default function SearchPage() {
  return (
    <div className="flex flex-col justify-center h-full w-full ">
      <SearchComponent />
      <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-5 h-[calc(100vh-64px)] overflow-hidden ">
        <div className="col-span-2 overflow-auto custom-scrollbar-hidden">
          <SearchResults />
          <SearchResults />
          <SearchResults />
          <SearchResults />
          <SearchResults />
          <SearchResults />
          <SearchResults />
        </div>
        <div className="col-span-3 hidden md:block h-full ">
          <MapProvider>
            <MapComponent />
          </MapProvider>
        </div>
      </div>
    </div>
  );
}
