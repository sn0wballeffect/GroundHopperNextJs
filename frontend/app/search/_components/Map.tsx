/*Since the map was loaded on client side, 
we need to make this component client rendered as well*/
"use client";

import { useStore } from "@/lib/store";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useRef, useEffect, useState, useMemo } from "react"; // Added useMemo

// Map's styling
const defaultMapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
};

// K2's coordinates
const defaultMapCenter = { lat: 51.1333, lng: 10.4167 };

// Map options
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
  if (distance <= 25) return 10;
  if (distance <= 50) return 9;
  if (distance <= 100) return 8;
  if (distance <= 250) return 7;
  if (distance <= 1000) return 6;
  return 3;
};

const MapComponent = () => {
  const userLocation = useStore((state) => state.userLocation);
  const setUserLocation = useStore((state) => state.setUserLocation); // Add this
  const distance = useStore((state) => state.distance);
  const setDistance = useStore((state) => state.setDistance);
  const markers = useStore((state) => state.markers);
  const setSearchQuery = useStore((state) => state.setSearchQuery); // Add this
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [visibleMarkers, setVisibleMarkers] = useState<typeof markers>([]);
  const circleRef = useRef<google.maps.Circle | null>(null);

  const markerPosition = useMemo(
    () =>
      userLocation?.lat && userLocation?.lng
        ? { lat: userLocation.lat, lng: userLocation.lng }
        : null,
    [userLocation?.lat, userLocation?.lng]
  );

  useEffect(() => {
    // Sequentially add markers with a smaller delay for smoothness
    if (markers) {
      setVisibleMarkers([]);
      markers.forEach((marker, index) => {
        setTimeout(() => {
          setVisibleMarkers((prev) => [...prev, marker]);
        }, index * 20); // 100ms delay between markers
      });
    }
  }, [markers]);

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
        editable: true, // Make circle editable
        draggable: true, // Make circle draggable
      });

      // Add radius change listener
      google.maps.event.addListener(circle, "radius_changed", () => {
        const newRadius = circle.getRadius();
        const newDistanceKm = Math.round(newRadius / 1000);
        setDistance(newDistanceKm);
      });

      // Add center change listener
      google.maps.event.addListener(circle, "center_changed", () => {
        const newCenter = circle.getCenter();
        if (newCenter) {
          setUserLocation({
            lat: newCenter.lat(),
            lng: newCenter.lng(),
          });
          setSearchQuery(""); // Clear search query when circle is dragged
        }
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
  }, [
    distance,
    markerPosition,
    map,
    setDistance,
    setUserLocation,
    setSearchQuery,
  ]);

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
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
        {markerPosition && (
          <MarkerF
            position={markerPosition}
            animation={google.maps.Animation.DROP}
            draggable={true}
            onDragEnd={(e) => {
              if (e.latLng) {
                const newPosition = {
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                };
                setUserLocation(newPosition);
                setSearchQuery(""); // Clear search query when marker is dragged

                // Update circle position if it exists
                if (circleRef.current) {
                  circleRef.current.setCenter(e.latLng);
                }
              }
            }}
          />
        )}
        {visibleMarkers.map((marker, index) => (
          <MarkerF
            key={`${marker.id}-${index}`}
            position={marker.position}
            animation={google.maps.Animation.DROP}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export { MapComponent };
