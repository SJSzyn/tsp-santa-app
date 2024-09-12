import { Injectable } from '@angular/core';
import {DistanceService} from "../distance.service";
import {TotalDistanceService} from "../total-distance.service";

@Injectable({
  providedIn: 'root'
})
export class GeneticService {

  private populationSize = 100;
  private mutationRate = 0.01;
  private generations = 100;

  constructor(private distanceService: DistanceService,
              private totalDistanceService: TotalDistanceService) { }

  // Main method to calculate the route using the Genetic Algorithm
  calculateGeneticRoute(locations: [number, number][]): [number, number][] {
    const startTime = performance.now(); // Start time for performance measurement
    let distanceCalculations = 0; // Count the number of distance calculations
    const numLocations = locations.length; // Number of locations

    // Initialize population
    let population = this.initializePopulation(locations);
    let bestRoute = population[0];
    let bestDistance = this.totalDistanceService.calculateTotalDistance(bestRoute);
    distanceCalculations += numLocations; // Initial distance calculations for best route

    for (let generation = 0; generation < this.generations; generation++) {
      const matingPool = this.createMatingPool(population, distanceCalculations);

      // Ensure the mating pool is populated
      if (matingPool.length === 0) {
        console.error('Mating pool is empty. Exiting.');
        return bestRoute;
      }

      population = this.evolvePopulation(matingPool, distanceCalculations);

      const currentBestRoute = this.getBestRoute(population, distanceCalculations);
      const currentBestDistance = this.totalDistanceService.calculateTotalDistance(currentBestRoute);
      distanceCalculations += numLocations; // Update distance calculations for each generation's best route

      if (currentBestDistance < bestDistance) {
        bestRoute = currentBestRoute;
        bestDistance = currentBestDistance;
      }
    }

    const endTime = performance.now(); // End time for performance measurement
    const timeTaken = endTime - startTime; // Calculate the time taken

    // Log information
    console.log('Total number of distance calculations:', distanceCalculations);
    console.log('Time taken:', timeTaken.toFixed(2), "ms");
    console.log('Nodes used:', numLocations);

    // Ensure the route returns to the starting point
    if (bestRoute.length > 0 && bestRoute[0] !== bestRoute[bestRoute.length - 1]) {
      bestRoute.push(bestRoute[0]); // Append the starting node to the end of the route
    }

    return bestRoute;
  }

  // Initialize population with random routes
  private initializePopulation(locations: [number, number][]): [number, number][][] {
    const population: [number, number][][] = [];
    for (let i = 0; i < this.populationSize; i++) {
      const shuffledLocations = this.shuffle([...locations]);
      population.push(shuffledLocations);
    }
    return population;
  }

  // Shuffle locations to generate random routes
  private shuffle(array: [number, number][]): [number, number][] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Create a mating pool based on fitness (distance)
  private createMatingPool(population: [number, number][][], distanceCalculations: number): [number, number][][] {
    const fitnessScores = population.map(route => 1 / this.totalDistanceService.calculateTotalDistance(route));
    distanceCalculations += population.length; // Update distance calculations for the population
    const totalFitness = fitnessScores.reduce((acc, score) => acc + score, 0);

    const matingPool: [number, number][][] = [];

    for (const route of population) {
      const normalizedFitness = (1 / this.totalDistanceService.calculateTotalDistance(route)) / totalFitness;
      const selectionProbability = normalizedFitness * this.populationSize;
      for (let i = 0; i < selectionProbability; i++) {
        matingPool.push(route);
      }
    }

    return matingPool;
  }

  // Evolve population by performing crossover and mutation
  private evolvePopulation(matingPool: [number, number][][], distanceCalculations: number): [number, number][][] {
    const newPopulation: [number, number][][] = [];

    for (let i = 0; i < this.populationSize; i++) {
      const parent1 = this.selectFromMatingPool(matingPool);
      const parent2 = this.selectFromMatingPool(matingPool);

      // Ensure both parents are selected
      if (!parent1 || !parent2) {
        console.error('Failed to select parents from the mating pool.');
        continue;
      }

      const child = this.crossover(parent1, parent2);
      this.mutate(child);
      newPopulation.push(child);
    }

    return newPopulation;
  }

  // Select a route from the mating pool
  private selectFromMatingPool(matingPool: [number, number][][]): [number, number][] {
    const randomIndex = Math.floor(Math.random() * matingPool.length);
    return matingPool[randomIndex];
  }

  // Perform crossover between two parents to generate a child route
  private crossover(parent1: [number, number][], parent2: [number, number][]): [number, number][] {
    const start = Math.floor(Math.random() * parent1.length);
    const end = Math.floor(Math.random() * parent1.length);

    const childPart = parent1.slice(Math.min(start, end), Math.max(start, end));
    const remaining = parent2.filter(city => !childPart.includes(city));

    return [...childPart, ...remaining];
  }

  // Mutate the child by swapping two locations based on mutation rate
  private mutate(route: [number, number][]): void {
    for (let i = 0; i < route.length; i++) {
      if (Math.random() < this.mutationRate) {
        const j = Math.floor(Math.random() * route.length);
        [route[i], route[j]] = [route[j], route[i]]; // Swap two locations
      }
    }
  }

  // Get the best route from the population based on distance
  private getBestRoute(population: [number, number][][], distanceCalculations: number): [number, number][] {
    let bestRoute = population[0];
    let bestDistance = this.totalDistanceService.calculateTotalDistance(bestRoute);
    distanceCalculations++; // Increment for each best route calculation

    for (const route of population) {
      const distance = this.totalDistanceService.calculateTotalDistance(route);
      distanceCalculations++; // Increment for each route evaluation
      if (distance < bestDistance) {
        bestRoute = route;
        bestDistance = distance;
      }
    }

    return bestRoute;
  }
}
