import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LuArrowRight } from "react-icons/lu";

export const SearchResults = () => {
  return (
    <div>
      <Card className="mb-3 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            Bayern München vs Werden Bremen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>🕒 23.11.2024, 19:00Uhr</p>
        </CardContent>
        <CardFooter className="flex flex-row justify-between ml-1">
          <p>📍 5 km entfernt</p>
          <Button size="icon" className="rounded-full ml-2 ">
            <LuArrowRight />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
