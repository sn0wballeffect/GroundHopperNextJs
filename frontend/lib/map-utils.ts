// lib/map-utils.ts
export const animateMapToLocation = (
  map: google.maps.Map,
  position: google.maps.LatLngLiteral,
  onAnimationComplete?: () => void
) => {
  map.panTo(position);

  // Handle animation completion after default animation duration (approximately 350ms)
  if (onAnimationComplete) {
    setTimeout(onAnimationComplete, 350);
  }
};
