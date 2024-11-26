import { SearchComponentMobile } from "@/components/SearchComponentMobile";
import { SearchComponent } from "../../components/SearchComponent";

import AnimatedText from "./_components/animatedText";

export default function HomePage() {
  return (
    <div className="relative h-[100lvh] w-full min-h-[100lvh]">
      <div className="absolute top-[5%] w-full px-4 sm:px-6 md:px-8">
        <AnimatedText />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full -mt-5">
        {/* Hide on medium and smaller screens */}
        <div className="hidden md:block">
          <SearchComponent />
        </div>
        <div className="block md:hidden">
          <SearchComponentMobile />
        </div>
      </div>
    </div>
  );
}
