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
      map: google.maps.Map
    ) => {
      const sport = marker.sport as keyof typeof getMarkerColor;
      const pinElement = new google.maps.marker.PinElement({
        background: getMarkerColor(sport),
        borderColor: "#000000",
        scale: 1.2,
        glyph: getGlyphForSport(marker.sport as keyof typeof getMarkerColor),
        glyphColor: "rgba(0, 0, 0, 0.8)",
      });

      return new google.maps.marker.AdvancedMarkerElement({
        position: marker.position,
        title: marker.id,
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
        map.panTo(marker.position);
      }
      const currentZoom = map.getZoom() || 0;
      const targetZoom = 13;

      // Use requestAnimationFrame for smoother animation
      const animate = (startTime: number) => {
        const progress = Math.min(1, (performance.now() - startTime) / 500);
        const newZoom = currentZoom + (targetZoom - currentZoom) * progress;
        map.setZoom(newZoom);

        if (progress < 1) {
          requestAnimationFrame(() => animate(startTime));
        } else {
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
        }
      };

      requestAnimationFrame((timestamp) => animate(timestamp));
    },
    []
  );

  // Optimize marker effect with batched updates
  useEffect(() => {
    if (!map || !window.google) return;

    const batchUpdate = () => {
      // Clear existing markers in batch
      markersRef.current.forEach((marker) => (marker.map = null));
      markersRef.current = [];

      // Create new markers in batch
      const newMarkers = markers.map((marker) => {
        const advancedMarker = createAdvancedMarker(marker, map);
        advancedMarker.addListener("click", () =>
          handleMarkerClick(advancedMarker, map)
        );
        return advancedMarker;
      });

      markersRef.current = newMarkers;
    };

    requestAnimationFrame(batchUpdate);

    return () => {
      markersRef.current.forEach((marker) => (marker.map = null));
      markersRef.current = [];
    };
  }, [markers, map, createAdvancedMarker, handleMarkerClick]);

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
