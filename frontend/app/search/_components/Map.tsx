/*Since the map was loaded on client side, 
we need to make this component client rendered as well*/
"use client";

import { useStore } from "@/lib/store";
import { GoogleMap, Marker } from "@react-google-maps/api";

//Map's styling
const defaultMapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px 12px 12px 12px",
};

//K2's coordinates
const defaultMapCenter = { lat: 51.1333, lng: 10.4167 };

//Default zoom level, can be adjusted
const defaultMapZoom = 6;

//Map options
const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "greedy",
  mapId: "c43642982b9e74e2",
  mapTypeControl: false,
  streetViewControl: false,
};

const MapComponent = () => {
  const userLocation = useStore((state) => state.userLocation);

  const markerPosition =
    userLocation.lat && userLocation.lng
      ? { lat: userLocation.lat, lng: userLocation.lng }
      : null;

  return (
    <div className="w-full h-full">
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={defaultMapCenter}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </div>
  );
};

export { MapComponent };
