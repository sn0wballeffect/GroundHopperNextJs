"use client";

import { useStore } from "@/lib/store";
import { GoogleMap } from "@react-google-maps/api";
import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { useMapStore } from "@/hooks/useMapStore";
import {
  MAP_CONTAINER_STYLE,
  MAP_CENTER,
  MAP_OPTIONS,
  CIRCLE_OPTIONS,
  getMarkerColor,
  getGlyphForSport,
  getZoomLevel,
} from "@/constants/map-constants";
import { animateMapToLocation } from "@/lib/map-utils";

const DROP_ANIMATION = {
  animationName: "markerDrop",
  animationDuration: "0.5s",
  animationTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  transformOrigin: "bottom center",
  "@keyframes markerDrop": {
    "0%": { transform: "translateY(-200px)" },
    "100%": { transform: "translateY(0)" },
  },
};

const HOVER_ANIMATION = {
  transition: "transform 0.2s ease-out, filter 0.2s ease-out",
  filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.7))",
  transform: "scale(1.8)",
};

const MapComponent = () => {
  const {
    userLocation,
    setUserLocation,
    distance,
    setDistance,
    markers,
    setSearchQuery,
    hoveredCoords,
    setMap,
  } = useMapStore();
  const [map, setMapState] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );
  const animationTimeoutRef = useRef<NodeJS.Timeout[]>([]);
  const markerPosition = useMemo(
    () =>
      userLocation?.lat && userLocation?.lng
        ? { lat: userLocation.lat, lng: userLocation.lng }
        : null,
    [userLocation?.lat, userLocation?.lng]
  );
  const zoomLevel = useMemo(
    () => (markerPosition ? getZoomLevel(distance) : 6),
    [markerPosition, distance]
  );

  // Memoize map options
  const mapOptions = useMemo(
    () => ({
      ...MAP_OPTIONS,
    }),
    []
  );

  // Memoize circle options
  const circleOptions = useMemo(
    () => ({
      ...CIRCLE_OPTIONS,
      editable: true,
      draggable: true,
    }),
    []
  );

  // Memoize marker creation function
  const createAdvancedMarker = useCallback(
    (
      marker: {
        sport: string;
        position: google.maps.LatLngLiteral;
        id: string;
      },
      map: google.maps.Map,
      shouldAnimate: boolean
    ) => {
      const sport = marker.sport as keyof typeof getMarkerColor;
      const pinElement = new google.maps.marker.PinElement({
        background: getMarkerColor(sport),
        borderColor: "#000000",
        scale: 1.2,
        glyph: getGlyphForSport(marker.sport as keyof typeof getMarkerColor),
        glyphColor: "rgba(0, 0, 0, 0.8)",
      });

      // Only apply animation if it's a new marker
      if (shouldAnimate) {
        const element = pinElement.element;
        Object.assign(element.style, {
          animation: `${DROP_ANIMATION.animationDuration} ${DROP_ANIMATION.animationTimingFunction} markerDrop`,
          transformOrigin: DROP_ANIMATION.transformOrigin,
        });
      }

      // Add keyframes to document if not already present
      if (!document.querySelector("#markerDropKeyframes")) {
        const style = document.createElement("style");
        style.id = "markerDropKeyframes";
        style.textContent = `
          @keyframes markerDrop {
            from { transform: translateY(-200px); }
            to { transform: translateY(0); }
          }
        `;
        document.head.appendChild(style);
      }

      return new google.maps.marker.AdvancedMarkerElement({
        position: marker.position,
        content: pinElement.element,
        map,
      });
    },
    []
  );

  // Memoize click handler
  const handleMarkerClick = useCallback(
    (
      marker: google.maps.marker.AdvancedMarkerElement,
      map: google.maps.Map
    ) => {
      if (marker.position) {
        useStore.getState().setSelectedLocation({
          lat:
            typeof marker.position?.lat === "function"
              ? marker.position.lat()
              : marker.position?.lat || null,
          lng:
            typeof marker.position?.lng === "function"
              ? marker.position.lng()
              : marker.position?.lng || null,
        });
        animateMapToLocation(map, {
          lat:
            typeof marker.position.lat === "function"
              ? marker.position.lat()
              : marker.position.lat || 0,
          lng:
            typeof marker.position.lng === "function"
              ? marker.position.lng()
              : marker.position.lng || 0,
        });
      }
    },
    []
  );

  // Optimize marker effect with batched updates
  useEffect(() => {
    if (!map || !window.google) return;

    const batchUpdate = async () => {
      // Clear existing markers and timeouts
      markersRef.current.forEach((marker) => (marker.map = null));
      markersRef.current = [];
      animationTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
      animationTimeoutRef.current = [];

      // Create new markers with animation
      const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
      for (let i = 0; i < markers.length; i++) {
        const timeout = setTimeout(async () => {
          const advancedMarker = createAdvancedMarker(markers[i], map, true);
          advancedMarker.addListener("click", () =>
            handleMarkerClick(advancedMarker, map)
          );
          newMarkers.push(advancedMarker);
        }, i * 20);
        animationTimeoutRef.current.push(timeout);
      }
      markersRef.current = newMarkers;
    };

    batchUpdate();

    // Cleanup function
    return () => {
      markersRef.current.forEach((marker) => (marker.map = null));
      animationTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, [map, markers, handleMarkerClick]);

  // Second effect to handle hover state changes
  useEffect(() => {
    if (!map || !window.google || !markersRef.current.length) return;

    markersRef.current.forEach((marker, index) => {
      const originalMarker = markers[index];
      const isHovered =
        hoveredCoords.lat === originalMarker.position.lat &&
        hoveredCoords.lng === originalMarker.position.lng;

      const sport = originalMarker.sport as keyof typeof getMarkerColor;
      const pinElement = new google.maps.marker.PinElement({
        background: getMarkerColor(sport),
        borderColor: isHovered ? "#FFFFFF" : "#000000",
        scale: 1.2,
        glyph: getGlyphForSport(
          originalMarker.sport as keyof typeof getMarkerColor
        ),
        glyphColor: isHovered ? "#FFFFFF" : "rgba(0, 0, 0, 0.8)",
      });

      // Apply hover effects
      const element = pinElement.element;
      Object.assign(element.style, {
        transition: HOVER_ANIMATION.transition,
        ...(isHovered && {
          filter: HOVER_ANIMATION.filter,
          transform: HOVER_ANIMATION.transform,
        }),
      });

      marker.content = pinElement.element;
      marker.zIndex = isHovered ? 1000 : 1;
    });
  }, [hoveredCoords, markers, map]);

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
    circleOptions,
  ]);

  // Initial user marker creation
  useEffect(() => {
    if (!map || !window.google || !markerPosition) {
      if (userMarkerRef.current) {
        userMarkerRef.current.map = null;
        userMarkerRef.current = null;
      }
      return;
    }

    const userPinElement = new google.maps.marker.PinElement({
      scale: 1.3,
      glyph: "🏃",
      glyphColor: "#ffffff",
      borderColor: "#000000",
    });

    const userMarker = new google.maps.marker.AdvancedMarkerElement({
      position: markerPosition,
      map,
      content: userPinElement.element,
      gmpDraggable: true,
      zIndex: 100,
    });

    userMarkerRef.current = userMarker;

    userMarker.addListener("dragend", () => {
      const position = userMarker.position;
      if (position) {
        const newPosition = {
          lat:
            typeof position.lat === "function" ? position.lat() : position.lat,
          lng:
            typeof position.lng === "function" ? position.lng() : position.lng,
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

    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.map = null;
        userMarkerRef.current = null;
      }
    };
  }, [map, markerPosition, setUserLocation, setSearchQuery]); // Added missing dependencies

  // 2. Handle position updates
  useEffect(() => {
    if (!userMarkerRef.current) return;

    if (!markerPosition) {
      userMarkerRef.current.map = null;
      userMarkerRef.current = null;
      return;
    }

    userMarkerRef.current.position = markerPosition;
  }, [markerPosition]);

  // Add click handler to map to clear selection
  useEffect(() => {
    if (!map) return;

    const clickListener = map.addListener("click", () => {
      useStore.getState().setSelectedLocation({ lat: null, lng: null });
    });

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [map]);

  // Memoize map callbacks
  const onMapLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      setMapState(mapInstance);
      setMap(mapInstance);
    },
    [setMap]
  );

  useEffect(() => {
    return () => {
      setMap(null);
    };
  }, [setMap]);

  return (
    <div className="w-full h-full">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={markerPosition || MAP_CENTER}
        zoom={zoomLevel}
        options={mapOptions}
        onLoad={onMapLoad}
      />
    </div>
  );
};

export { MapComponent };
