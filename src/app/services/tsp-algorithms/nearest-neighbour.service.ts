import { Injectable } from '@angular/core';
import {locations} from '../../../assets/locations';

@Injectable({
  providedIn: 'root'
})
export class NearestNeighbourService {

  constructor() { }

  // Nearest Neighbour Algorithm Implementation
  calculateNearestNeighbourRoute(locations: [number, number][]): [number, number][] {
    const unvisited = [...locations];
    const route = [];
    let currentLocation = unvisited.shift(); // Start from the first location

    if (currentLocation) {
      route.push(currentLocation);
    }

    while (unvisited.length > 0) {
      let nearest = unvisited[0];
      let nearestDistance = this.calculateDistance(currentLocation!, nearest);

      for (let i = 1; i < unvisited.length; i++) {
        const distance = this.calculateDistance(currentLocation!, unvisited[i]);
        if (distance < nearestDistance) {
          nearest = unvisited[i];
          nearestDistance = distance;
        }
      }

      route.push(nearest);
      currentLocation = nearest;
      unvisited.splice(unvisited.indexOf(nearest), 1); // Remove visited location
    }

    return route; // Return the calculated route
  }

  // Helper method to calculate the distance between two coordinates
  private calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    const R = 6371e3;
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
