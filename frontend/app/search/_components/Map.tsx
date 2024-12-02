/*Since the map was loaded on client side, 
we need to make this component client rendered as well*/
"use client";

import { useStore } from "@/lib/store";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useRef, useEffect, useState } from "react";
import stadiumData from "@/data/stadium_data.json";

//Map's styling
const defaultMapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px 12px 12px 12px",
};

//K2's coordinates
const defaultMapCenter = { lat: 51.1333, lng: 10.4167 };

//Map options
const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "greedy",
  mapId: "c43642982b9e74e2",
  mapTypeControl: false,
  streetViewControl: false,
  minZoom: 3,
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
  if (distance <= 2) return 13;
  if (distance <= 5) return 12;
  if (distance <= 10) return 11;
  if (distance <= 50) return 9;
  if (distance <= 500) return 6;
  return 3;
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
        zoom={markerPosition ? getZoomLevel(distance) : 6}
        options={defaultMapOptions}
        onLoad={onLoad}
      >
        {markerPosition && <Marker position={markerPosition} />}
        {stadiumData.slice(0, 50).map((stadium, index) => {
          const stadiumName = Object.keys(stadium)[0];
          const coordinates = stadium[stadiumName].Coordinates;
          const link = stadium.Link;
          return (
            <Marker
              key={index}
              position={{ lat: coordinates[0], lng: coordinates[1] }}
              title={stadiumName}
              onClick={() => window.open(link, "_blank")}
            />
          );
        })}
      </GoogleMap>
    </div>
  );
};

export { MapComponent };
