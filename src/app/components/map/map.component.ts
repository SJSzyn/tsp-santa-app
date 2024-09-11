import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import { locations } from '../../../assets/locations';
import {ControlsComponent} from './controls/controls.component';

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

  private calculateCenter(locations: [number, number][]): [number, number] {
    let sumLat = 0;
    let sumLng = 0;

    locations.forEach(location => {
      sumLat += location[0];
      sumLng += location[1];
    });

    const avgLat = sumLat / locations.length;
    const avgLng = sumLng / locations.length;

    return [avgLat, avgLng];
  }

  private initMap(): void {
    const center = this.calculateCenter(locations);

    this.map = L.map('map', {
      center: center,
      zoom: 13
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
    return locations;
  }
}
