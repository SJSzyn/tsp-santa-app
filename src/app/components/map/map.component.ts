import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import { locations } from '../../../assets/locations';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {
  private map: any;

  ngOnInit(): void {
    this.initMap();
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

    locations.forEach((location) => {
      L.marker([location[0], location[1]]).addTo(this.map);
    });
  }

}
