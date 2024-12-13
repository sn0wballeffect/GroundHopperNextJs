// lib/map-utils.ts
export const animateMapToLocation = (
  map: google.maps.Map,
  position: google.maps.LatLngLiteral,
  onAnimationComplete?: () => void
) => {
  map.panTo(position);
  const currentZoom = map.getZoom() || 0;
  const targetZoom = 13;

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
    const newZoom = currentZoom + (targetZoom - currentZoom) * easedProgress;

    map.setZoom(newZoom);

    if (frame >= totalFrames) {
      clearInterval(interval);
      map.setZoom(targetZoom); // Ensure we end exactly at target
      if (onAnimationComplete) onAnimationComplete();
    }
  }, 1000 / fps);
};
