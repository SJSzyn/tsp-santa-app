function haversineDistance(coord1: number[], coord2: number[]): number {
  const R = 6371; // Radius of Earth in kilometers
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(coord2[1] - coord1[1]);
  const dLon = toRad(coord2[0] - coord1[0]);
  const lat1 = toRad(coord1[1]);
  const lat2 = toRad(coord2[1]);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function twoOpt(route: number[][]): number[][] {
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 1; i < route.length - 2; i++) {
      for (let j = i + 1; j < route.length - 1; j++) {
        const currentDist = haversineDistance(route[i - 1], route[i]) + haversineDistance(route[j], route[j + 1]);
        const newDist = haversineDistance(route[i - 1], route[j]) + haversineDistance(route[i], route[j + 1]);
        if (newDist < currentDist) {
          route = route.slice(0, i).concat(route.slice(i, j + 1).reverse(), route.slice(j + 1));
          improved = true;
        }
      }
    }
  }
  return route;
}

// Example usage with coordinates (longitude, latitude)
const coordinates = [
  [-73.935242, 40.730610], // New York
  [-118.243683, 34.052235], // Los Angeles
  [-87.629799, 41.878113], // Chicago
  [-0.127758, 51.507351], // London
  [2.352222, 48.856613], // Paris
];

const optimizedRoute = twoOpt(coordinates);
console.log(optimizedRoute);
