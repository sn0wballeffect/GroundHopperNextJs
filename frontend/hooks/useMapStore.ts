import { useStore } from "@/lib/store";

export const useMapStore = () => {
  const userLocation = useStore((state) => state.userLocation);
  const setUserLocation = useStore((state) => state.setUserLocation);
  const distance = useStore((state) => state.distance);
  const setDistance = useStore((state) => state.setDistance);
  const markers = useStore((state) => state.markers);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const hoveredCoords = useStore((state) => state.hoveredCoords);
  const setMap = useStore((state) => state.setMap);
  const selectedLocation = useStore((state) => state.selectedLocation);
  const setSelectedLocation = useStore((state) => state.setSelectedLocation);

  return {
    userLocation,
    setUserLocation,
    distance,
    setDistance,
    markers,
    setSearchQuery,
    hoveredCoords,
    setMap,
    setSelectedLocation,
    selectedLocation,
  };
};
