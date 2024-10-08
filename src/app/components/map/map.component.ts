import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import { locations } from '../../../assets/locations';
import {ControlsComponent} from './controls/controls.component';
import {NearestNeighbourService} from '../../services/tsp-algorithms/nearest-neighbour.service';
import {TwoOptService} from '../../services/tsp-algorithms/two-opt.service';
import {GreedyService} from '../../services/tsp-algorithms/greedy.service';
import {AntColonyService} from '../../services/tsp-algorithms/ant-colony.service';
import {GeneticService} from '../../services/tsp-algorithms/genetic.service';
import {small} from '../../../assets/small';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    ControlsComponent
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {
  private map: any;
  private routeLayer: any = null;
  private markerLayer: any = null;

  constructor(private nearestNeighbourService: NearestNeighbourService,
              private twoOptService: TwoOptService,
              private greedyService: GreedyService,
              private antColonyService: AntColonyService,
              private geneticService: GeneticService) {}

  ngOnInit(): void {
    this.initMap();
  }

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

  private calculateTotalDistance(route: [number, number][]): number {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
      totalDistance += this.calculateDistance(route[i], route[i + 1]);
    }
    return totalDistance;
  }

  private calculateCenter(small: [number, number][]): [number, number] {
    let sumLat = 0;
    let sumLng = 0;

    small.forEach(location => {
      sumLat += location[0];
      sumLng += location[1];
    });

    const avgLat = sumLat / small.length;
    const avgLng = sumLng / small.length;

    return [avgLat, avgLng];
  }

  private initMap(): void {
    const center = this.calculateCenter(small);

    this.map = L.map('map', {
      center: center,
      zoom: 10
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);
  }

  private addMarkers(route: [number, number][]): void {
    let cumulativeDistance = 0;

    if (this.markerLayer) {
      this.map.removeLayer(this.markerLayer);
    }

    this.markerLayer = L.layerGroup();

    for (let i = 0; i < route.length; i++) {
      if (i > 0) {
        const segmentDistance = this.calculateDistance(route[i - 1], route[i]);
        cumulativeDistance += segmentDistance;
      }

      const marker = L.marker([route[i][0], route[i][1]])
        .bindPopup(`Distance: ${(cumulativeDistance / 1000).toFixed(2)} km`);

      this.markerLayer.addLayer(marker);
    }

    this.markerLayer.addTo(this.map);
  }

  onAlgorithmToggle(event: { algo: string, isChecked: boolean }): void {
    if (event.isChecked) {
      this.showRoute(event.algo);
    } else {
      this.clearRoute();
    }
  }

  private showRoute(algo: string): void {
    let routeCoordinates: [number, number][] = [];

    switch (algo) {
      case 'basic':
        routeCoordinates = this.getDummyRoute();
        break;
      case 'nearest-neighbour':
        routeCoordinates = this.nearestNeighbourService.calculateNearestNeighbourRoute(small); // Call Nearest Neighbour Algorithm
        break;
      case 'two-opt':
        routeCoordinates = this.twoOptService.calculateTwoOptRoute(small); // Use 2-Opt
        break;
      case 'greedy':
        routeCoordinates = this.greedyService.calculateGreedyRoute(small); // Use Greedy Algorithm
        break;
      case 'ant-colony':
        routeCoordinates = this.antColonyService.calculateAntColonyRoute(small); // Use Greedy Algorithm
        break;
      case 'genetic':
        routeCoordinates = this.geneticService.calculateGeneticRoute(small); // Use Greedy Algorithm
        break;
    }

    this.clearRoute();

    this.routeLayer = L.polyline(routeCoordinates, { color: 'blue' }).addTo(this.map);

    this.addMarkers(routeCoordinates);

    const totalDistance = this.calculateTotalDistance(routeCoordinates);
    console.log(`Total Distance: ${(totalDistance / 1000).toFixed(2)} km`);
  }

  private clearRoute(): void {
    if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
      this.routeLayer = null;
    }

    if (this.markerLayer) {
      this.map.removeLayer(this.markerLayer);
      this.markerLayer = null;
    }
  }

  private getDummyRoute(): [number, number][] {
    return small;
  }



}
