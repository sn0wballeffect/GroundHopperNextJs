import { SearchComponent } from "../../components/SearchComponent";

export default function SearchPage() {
  return (
    <div className="flex flex-col justify-center h-full w-full ">
      <SearchComponent />
      <div className="grid grid-cols-1 p-1 md:grid-cols-5 h-[calc(100vh-64px)] overflow-hidden">
        <div className="col-span-2 overflow-auto">
          HAAAAAAAAAAAAAAAAAAALLLLLLLLLLLLLLLLLLLOOOOOOOOOOO
        </div>
        <div className="col-span-3 hidden md:block h-full mt-1 pb-1">
          HAAAAAAAAAAAAAAAAAAAAAAAAAAALLLLLLLLLLLLLLLLLLLLLLLLLOOOOOOOOO
        </div>
      </div>
    </div>
  );
}
