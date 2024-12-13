/*Since the map was loaded on client side, 
we need to make this component client rendered as well*/
"use client";

import { useStore } from "@/lib/store";
import { GoogleMap } from "@react-google-maps/api";
import { useRef, useEffect, useState, useMemo } from "react";
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
    setSelectedLocation,
  } = useMapStore();
  const [map, setMapState] = useState<google.maps.Map | null>(null);
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
  const zoomLevel = useMemo(
    () => (markerPosition ? getZoomLevel(distance) : 6),
    [markerPosition, distance]
  );
  // First effect to handle initial marker creation
  useEffect(() => {
    if (!map || !window.google) {
      return;
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];

    // Create new advanced markers
    const newMarkers = markers.map((marker) => {
      const sport = marker.sport as keyof typeof getMarkerColor;

      const pinElement = new google.maps.marker.PinElement({
        background: getMarkerColor(sport),
        borderColor: "#000000",
        scale: 1.2,
        glyph: getGlyphForSport(marker.sport as keyof typeof getMarkerColor),
        glyphColor: "rgba(0, 0, 0, 0.8)",
      });

      const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
        position: marker.position,
        title: marker.id,
        content: pinElement.element,
      });

      // Explicitly set the map
      advancedMarker.map = map;

      // Add click handler
      advancedMarker.addListener("click", () => {
        map.panTo(marker.position); // Use panTo instead of setCenter for smooth movement

        // Smooth zoom animation
        const currentZoom = map.getZoom() || 0;
        const targetZoom = 13;
        const zoomDifference = Math.abs(targetZoom - currentZoom);
        const steps = Math.max(
          24,
          Math.min(100, Math.floor(zoomDifference * 12))
        ); // Number of animation steps

        let count = 0;
        const interval = setInterval(() => {
          count++;
          const progress = count / steps;
          const newZoom = currentZoom + (targetZoom - currentZoom) * progress;

          map.setZoom(newZoom);

          if (count >= steps) {
            clearInterval(interval);
            // Set the selected location after animation completes
            useStore.getState().setSelectedLocation(marker.position);
          }
        }, 16); // ~60fps animation
      });

      return advancedMarker;
    });

    markersRef.current = newMarkers;
    console.log("Markers created:", newMarkers.length); // Debug log

    return () => {
      markersRef.current.forEach((marker) => {
        marker.map = null;
      });
      markersRef.current = [];
    };
  }, [markers, map]); // Remove hoveredCoords from dependencies

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
        borderColor: "#000000",
        scale: isHovered ? 1.5 : 1.2,
        glyph: getGlyphForSport(
          originalMarker.sport as keyof typeof getMarkerColor
        ),
        glyphColor: "rgba(0, 0, 0, 0.8)",
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
        ...CIRCLE_OPTIONS,
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

    const dragListener = map.addListener("dragstart", () => {
      useStore.getState().setSelectedLocation({ lat: null, lng: null });
    });

    const clickListener = map.addListener("click", () => {
      useStore.getState().setSelectedLocation({ lat: null, lng: null });
    });

    return () => {
      google.maps.event.removeListener(dragListener);
      google.maps.event.removeListener(clickListener);
    };
  }, [map]);

  // First ensure map is properly set in store
  const onLoad = (mapInstance: google.maps.Map) => {
    setMapState(mapInstance); // Add this line
    setMap(mapInstance);
  };

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
        zoom={markerPosition ? getZoomLevel(distance) : 6}
        options={MAP_OPTIONS}
        onLoad={onLoad}
      />
    </div>
  );
};

export { MapComponent };
