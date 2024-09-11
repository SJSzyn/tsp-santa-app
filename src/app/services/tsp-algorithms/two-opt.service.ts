import { Injectable } from '@angular/core';
import {locations} from '../../../assets/locations';

@Injectable({
  providedIn: 'root'
})
export class TwoOptService {

  constructor() { }

  // 2-Opt Algorithm Implementation
  calculateTwoOptRoute(locations: [number, number][]): [number, number][] {
    let route = [...locations]; // Copy the initial route
    let improved = true;

    while (improved) {
      improved = false;

      for (let i = 1; i < route.length - 1; i++) {
        for (let k = i + 1; k < route.length; k++) {
          const newRoute = this.twoOptSwap(route, i, k);

          if (this.calculateTotalDistance(newRoute) < this.calculateTotalDistance(route)) {
            route = newRoute;
            improved = true;
          }
        }
      }
    }

    return route; // Return the optimized route
  }

  // Swap the nodes between i and k in the route
  private twoOptSwap(route: [number, number][], i: number, k: number): [number, number][] {
    const newRoute = route.slice(0, i);
    const reversedSegment = route.slice(i, k + 1).reverse();
    return newRoute.concat(reversedSegment, route.slice(k + 1));
  }

  // Helper method to calculate the total distance of the route
  private calculateTotalDistance(route: [number, number][]): number {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
      totalDistance += this.calculateDistance(route[i], route[i + 1]);
    }
    return totalDistance;
  }

  // Helper method to calculate the distance between two coordinates
  private calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    const R = 6371e3; // Earth's radius in meters
    const lat1 = this.toRadians(coord1[0]);
    const lat2 = this.toRadians(coord2[0]);
    const deltaLat = this.toRadians(coord2[0] - coord1[0]);
    const deltaLng = this.toRadians(coord2[1] - coord1[1]);

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
