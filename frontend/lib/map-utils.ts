// lib/map-utils.ts
export const animateMapToLocation = (
  map: google.maps.Map,
  position: google.maps.LatLngLiteral,
  onAnimationComplete?: () => void
) => {
  map.panTo(position);
  const currentZoom = map.getZoom() || 0;
  const targetZoom = 13;
  const zoomDifference = Math.abs(targetZoom - currentZoom);
  const steps = Math.max(24, Math.min(100, Math.floor(zoomDifference * 12)));

  let count = 0;
  const interval = setInterval(() => {
    count++;
    const progress = count / steps;
    const newZoom = currentZoom + (targetZoom - currentZoom) * progress;

    map.setZoom(newZoom);

    if (count >= steps) {
      clearInterval(interval);
      if (onAnimationComplete) onAnimationComplete();
    }
  }, 16);
};
