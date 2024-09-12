import { Injectable } from '@angular/core';
import {DistanceService} from "../distance.service";

@Injectable({
  providedIn: 'root'
})
export class GreedyService {

  constructor(private distanceService: DistanceService) { }

  // Greedy Algorithm Implementation for TSP
  calculateGreedyRoute(locations: [number, number][]): [number, number][] {
    const startTime = performance.now(); // Start time for performance measurement
    const unvisited = [...locations];
    const route = [];
    let currentLocation = unvisited.shift(); // Start from the first location
    let distanceCalculations = 0; // Count the number of distance calculations
    const numberOfNodes = locations.length; // Number of nodes in the input

    // Keep track of the starting location to return to it at the end
    const startingLocation = currentLocation;

    if (currentLocation) {
      route.push(currentLocation);
    }

    while (unvisited.length > 0) {
      let nearest = unvisited[0];
      let nearestDistance = this.distanceService.calculateDistance(currentLocation!, nearest);
      distanceCalculations++; // Increment for the first calculation

      for (let i = 1; i < unvisited.length; i++) {
        const distance = this.distanceService.calculateDistance(currentLocation!, unvisited[i]);
        distanceCalculations++; // Increment for each distance calculation
        if (distance < nearestDistance) {
          nearest = unvisited[i];
          nearestDistance = distance;
        }
      }

      route.push(nearest);
      currentLocation = nearest;
      unvisited.splice(unvisited.indexOf(nearest), 1); // Remove visited location
    }

    // Return to the starting location to complete the cycle
    if (startingLocation) {
      route.push(startingLocation);
    }

    const endTime = performance.now(); // End time for performance measurement
    const timeTaken = endTime - startTime; // Calculate the time taken

    // Log information
    console.log('Total number of distance calculations:', distanceCalculations);
    console.log('Time taken:', timeTaken.toFixed(2), "ms");
    console.log('Nodes used:', numberOfNodes);

    return route; // Return the greedy calculated route
  }

}
