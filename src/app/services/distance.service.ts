import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DistanceService {

  constructor() { }

  // Method to calculate the distance between two coordinates
  calculateDistance(coord1: [number, number], coord2: [number, number]): number {
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

  // Helper method to convert degrees to radians
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
