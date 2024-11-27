/*Since the map was loaded on client side, 
we need to make this component client rendered as well*/
"use client";

import { useStore } from "@/lib/store";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useRef, useEffect, useState } from "react";

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

const circleOptions = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 1,
  fillColor: "#FF0000",
  fillOpacity: 0.1,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 1,
};

const getZoomLevel = (distance: number): number => {
  // These values are approximated for Google Maps
  if (distance <= 2) return 13; // 2km
  if (distance <= 5) return 12; // 5km
  if (distance <= 10) return 11; // 10km
  if (distance <= 50) return 9; // 50km
  return 6; // default zoom
};

const MapComponent = () => {
  const userLocation = useStore((state) => state.userLocation);
  const distance = useStore((state) => state.distance);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);

  const markerPosition =
    userLocation.lat && userLocation.lng
      ? { lat: userLocation.lat, lng: userLocation.lng }
      : null;

  useEffect(() => {
    // Cleanup previous circle
    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }

    // Create new circle if we have a position and map
    if (markerPosition && map) {
      const circle = new google.maps.Circle({
        map,
        center: markerPosition,
        radius: distance * 1000,
        ...circleOptions,
      });
      circleRef.current = circle;
    }

    // Cleanup on unmount
    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
    };
  }, [distance, markerPosition, map]);

  const onLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  return (
    <div className="w-full h-full">
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={markerPosition || defaultMapCenter}
        zoom={getZoomLevel(distance)}
        options={defaultMapOptions}
        onLoad={onLoad}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </div>
  );
};

export { MapComponent };
