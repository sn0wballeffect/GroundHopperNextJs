/*Since the map was loaded on client side, 
we need to make this component client rendered as well*/
"use client";

import { useStore } from "@/lib/store";
import { GoogleMap } from "@react-google-maps/api";
import { useRef, useEffect, useState, useMemo } from "react";

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
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.1,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 1,
};

const SPORT_COLORS = {
  football: "#4ade80", // green-400
  basketball: "#fb923c", // orange-400
  ice_hockey: "#60a5fa", // blue-400
  handball: "#facc15", // yellow-400
  volleyball: "#c084fc", // purple-400
  tennis: "#f87171", // red-400
};

const SPORT_ICONS = {
  football: "⚽",
  basketball: "🏀",
  ice_hockey: "🏒",
  handball: "🤾",
  volleyball: "🏐",
  tennis: "🎾",
};

const getMarkerColor = (sport: keyof typeof SPORT_COLORS): string => {
  return SPORT_COLORS[sport] || "#d1d5db"; // gray-300 as default
};

const getGlyphForSport = (sport: keyof typeof SPORT_ICONS): string => {
  return SPORT_ICONS[sport] || "🎯";
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
  const setUserLocation = useStore((state) => state.setUserLocation);
  const distance = useStore((state) => state.distance);
  const setDistance = useStore((state) => state.setDistance);
  const markers = useStore((state) => state.markers);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );

  const markerPosition = useMemo(
    () =>
      userLocation?.lat && userLocation?.lng
        ? { lat: userLocation.lat, lng: userLocation.lng }
        : null,
    [userLocation?.lat, userLocation?.lng]
  );

  // Handle markers update
  useEffect(() => {
    if (!map || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => (marker.map = null));
    markersRef.current = [];

    // Create new advanced markers

    const newMarkers = markers.map((marker) => {
      const sport = marker.sport as keyof typeof SPORT_COLORS;
      const pinElement = new google.maps.marker.PinElement({
        background: getMarkerColor(sport),
        borderColor: "#000000",
        scale: 1.2,
        glyph: getGlyphForSport(marker.sport as keyof typeof SPORT_ICONS),
        glyphColor: "rgba(0, 0, 0, 0.8)", // Add contrast
      });

      const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: marker.position,
        title: marker.id,
        content: pinElement.element,
      });
      return advancedMarker;
    });

    markersRef.current = newMarkers;

    return () => {
      markersRef.current.forEach((marker) => (marker.map = null));
    };
  }, [markers, map]);

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
        {markerPosition && window.google ? (
          <div
            ref={(el) => {
              if (el && window.google) {
                // Clean up previous marker
                if (userMarkerRef.current) {
                  userMarkerRef.current.map = null;
                }

                // Create new marker
                const userPinElement = new google.maps.marker.PinElement({
                  scale: 1.3,
                  glyph: "🏃", // User icon
                  glyphColor: "#ffffff",
                });

                const userMarker = new google.maps.marker.AdvancedMarkerElement(
                  {
                    position: markerPosition,
                    map,
                    content: userPinElement.element,
                    gmpDraggable: true,
                    zIndex: 100,
                  }
                );

                // Store reference to marker
                userMarkerRef.current = userMarker;

                userMarker.addListener("dragend", () => {
                  const position = userMarker.position;
                  if (position) {
                    const newPosition = {
                      lat:
                        typeof position.lat === "function"
                          ? position.lat()
                          : position.lat,
                      lng:
                        typeof position.lng === "function"
                          ? position.lng()
                          : position.lng,
                    };
                    setUserLocation(newPosition);
                    setSearchQuery("");
                    if (circleRef.current) {
                      circleRef.current.setCenter(
                        new google.maps.LatLng(newPosition.lat, newPosition.lng)
                      );
                    }
                  }
                });
              }
            }}
          />
        ) : (
          // Cleanup when markerPosition is null
          userMarkerRef.current?.map && (userMarkerRef.current.map = null)
        )}
      </GoogleMap>
    </div>
  );
};

export { MapComponent };
