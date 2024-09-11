import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneticService {

  private populationSize = 100;
  private mutationRate = 0.01;
  private generations = 100;

  constructor() {}

  // Main method to calculate the route using the Genetic Algorithm
  calculateGeneticRoute(locations: [number, number][]): [number, number][] {
    let population = this.initializePopulation(locations);
    let bestRoute = population[0];
    let bestDistance = this.calculateTotalDistance(bestRoute);

    for (let generation = 0; generation < this.generations; generation++) {
      const matingPool = this.createMatingPool(population);

      // Ensure the mating pool is populated
      if (matingPool.length === 0) {
        console.error('Mating pool is empty. Exiting.');
        return bestRoute;
      }

      population = this.evolvePopulation(matingPool);

      const currentBestRoute = this.getBestRoute(population);
      const currentBestDistance = this.calculateTotalDistance(currentBestRoute);

      if (currentBestDistance < bestDistance) {
        bestRoute = currentBestRoute;
        bestDistance = currentBestDistance;
      }
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
  private createMatingPool(population: [number, number][][]): [number, number][][] {
    const fitnessScores = population.map(route => 1 / this.calculateTotalDistance(route));
    const totalFitness = fitnessScores.reduce((acc, score) => acc + score, 0);

    const matingPool: [number, number][][] = [];

    for (const route of population) {
      const normalizedFitness = (1 / this.calculateTotalDistance(route)) / totalFitness;
      const selectionProbability = normalizedFitness * this.populationSize;
      for (let i = 0; i < selectionProbability; i++) {
        matingPool.push(route);
      }
    }

    return matingPool;
  }

  // Evolve population by performing crossover and mutation
  private evolvePopulation(matingPool: [number, number][][]): [number, number][][] {
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
  private getBestRoute(population: [number, number][][]): [number, number][] {
    let bestRoute = population[0];
    let bestDistance = this.calculateTotalDistance(bestRoute);

    for (const route of population) {
      const distance = this.calculateTotalDistance(route);
      if (distance < bestDistance) {
        bestRoute = route;
        bestDistance = distance;
      }
    }

    return bestRoute;
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
