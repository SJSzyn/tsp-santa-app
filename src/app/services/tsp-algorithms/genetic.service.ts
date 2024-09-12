import { Injectable } from '@angular/core';
import {DistanceService} from "../distance.service";
import {TotalDistanceService} from "../total-distance.service";

@Injectable({
  providedIn: 'root'
})
export class GeneticService {

  private populationSize = 100;
  private mutationRate = 0.01;
  private generations = 10000;

  constructor(private distanceService: DistanceService,
              private totalDistanceService: TotalDistanceService) {
  }

  calculateGeneticRoute(locations: [number, number][]): [number, number][] {
    const startTime = performance.now();
    const numLocations = locations.length;

    // Initialize population and best route
    let population = this.initializePopulation(locations);
    let bestRoute = this.getBestRoute(population);
    let bestDistance = this.totalDistanceService.calculateTotalDistance(bestRoute);

    for (let generation = 0; generation < this.generations; generation++) {
      const matingPool = this.createMatingPool(population);

      population = this.evolvePopulation(matingPool);

      const currentBestRoute = this.getBestRoute(population);
      const currentBestDistance = this.totalDistanceService.calculateTotalDistance(currentBestRoute);

      if (currentBestDistance < bestDistance) {
        bestRoute = currentBestRoute;
        bestDistance = currentBestDistance;
      }
    }

    console.log('Time taken:', (performance.now() - startTime).toFixed(2), "ms");
    console.log('Nodes used:', numLocations);

    // Return to starting point
    if (bestRoute.length > 0 && bestRoute[0] !== bestRoute[bestRoute.length - 1]) {
      bestRoute.push(bestRoute[0]);
    }

    return bestRoute;
  }

  private initializePopulation(locations: [number, number][]): [number, number][][] {
    return Array.from({length: this.populationSize}, () => this.shuffle([...locations]));
  }

  private shuffle(array: [number, number][]): [number, number][] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private createMatingPool(population: [number, number][][]): [number, number][][] {
    const fitnessScores = population.map(route => 1 / this.totalDistanceService.calculateTotalDistance(route));
    const totalFitness = fitnessScores.reduce((acc, score) => acc + score, 0);

    return population.flatMap((route, i) =>
      Array(Math.floor((fitnessScores[i] / totalFitness) * this.populationSize)).fill(route)
    );
  }

  private evolvePopulation(matingPool: [number, number][][]): [number, number][][] {
    return Array.from({length: this.populationSize}, () => {
      const parent1 = this.selectFromMatingPool(matingPool);
      const parent2 = this.selectFromMatingPool(matingPool);
      const child = this.crossover(parent1, parent2);
      this.mutate(child);
      return child;
    });
  }

  private selectFromMatingPool(matingPool: [number, number][][]): [number, number][] {
    return matingPool[Math.floor(Math.random() * matingPool.length)];
  }

  private crossover(parent1: [number, number][], parent2: [number, number][]): [number, number][] {
    const [start, end] = [Math.floor(Math.random() * parent1.length), Math.floor(Math.random() * parent1.length)].sort();
    const childPart = parent1.slice(start, end);
    return [...childPart, ...parent2.filter(city => !childPart.includes(city))];
  }

  private mutate(route: [number, number][]): void {
    route.forEach((_, i) => {
      if (Math.random() < this.mutationRate) {
        const j = Math.floor(Math.random() * route.length);
        [route[i], route[j]] = [route[j], route[i]];
      }
    });
  }

  private getBestRoute(population: [number, number][][]): [number, number][] {
    return population.reduce((bestRoute, currentRoute) =>
      this.totalDistanceService.calculateTotalDistance(currentRoute) <
      this.totalDistanceService.calculateTotalDistance(bestRoute) ? currentRoute : bestRoute
    );
  }
}
