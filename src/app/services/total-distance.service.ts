import { Injectable } from '@angular/core';
import {DistanceService} from "./distance.service";

@Injectable({
  providedIn: 'root'
})
export class TotalDistanceService {

  constructor(private distanceService: DistanceService) { }

  // Helper method to calculate the total distance of the route
  public calculateTotalDistance(route: [number, number][]): number {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
      totalDistance += this.distanceService.calculateDistance(route[i], route[i + 1]);
    }
    return totalDistance;
  }
}
