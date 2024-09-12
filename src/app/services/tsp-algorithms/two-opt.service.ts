import { Injectable } from '@angular/core';
import {TotalDistanceService} from "../total-distance.service";

@Injectable({
  providedIn: 'root'
})
export class TwoOptService {

  constructor(private totalDistanceService: TotalDistanceService) { }

  calculateTwoOptRoute(small: [number, number][]): [number, number][] {
    let route = [...small];
    let improved = true;
    let swapCount = 0;
    let numberOfNodes = small.length;

    // Start time for performance measurement
    const startTime = performance.now();

    // Run the 2-opt algorithm until no improvements can be made
    while (improved) {
      improved = false;

      for (let i = 1; i < route.length - 1; i++) {
        for (let k = i + 1; k < route.length; k++) {
          const newRoute = this.twoOptSwap(route, i, k);

          if (this.totalDistanceService.calculateTotalDistance(newRoute) < this.totalDistanceService.calculateTotalDistance(route)) {
            route = newRoute;
            improved = true;
            swapCount++;
          }
        }
      }
    }

    // Append the starting node at the end to ensure a full loop (return to the original point)
    route.push(route[0]);
    this.logPerformance(swapCount, startTime, small.length);
    return route;
  }

  // Swap the nodes between i and k in the route
  private twoOptSwap(route: [number, number][], i: number, k: number): [number, number][] {
    const newRoute = route.slice(0, i);
    const reversedSegment = route.slice(i, k + 1).reverse();
    return newRoute.concat(reversedSegment, route.slice(k + 1));
  }

  private logPerformance(swapCount: number, startTime: number, nodeCount: number): void {
    const timeTaken = performance.now() - startTime;
    console.log(`Total swaps: ${swapCount}, Time: ${timeTaken.toFixed(2)} ms, Nodes: ${nodeCount}`);
  }

}
