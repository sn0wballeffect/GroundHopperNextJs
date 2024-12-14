// lib/map-utils.ts
export const animateMapToLocation = (
  map: google.maps.Map,
  position: google.maps.LatLngLiteral,
  onAnimationComplete?: () => void
) => {
  const startPos = map.getCenter()?.toJSON() || position;

  // Fixed duration in milliseconds
  const duration = 1000;
  const fps = 30;
  const totalFrames = Math.floor(duration / (1000 / fps));

  let frame = 0;

  const easeInOutQuad = (t: number): number => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  const interval = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    const easedProgress = easeInOutQuad(progress);

    // Interpolate between start and end positions
    const lat = startPos.lat + (position.lat - startPos.lat) * easedProgress;
    const lng = startPos.lng + (position.lng - startPos.lng) * easedProgress;

    map.panTo({ lat, lng });

    if (frame >= totalFrames) {
      clearInterval(interval);
      map.panTo(position); // Ensure we end exactly at target position
      if (onAnimationComplete) onAnimationComplete();
    }
  }, 1000 / fps);
};
