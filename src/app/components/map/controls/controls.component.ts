import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.css'
})
export class ControlsComponent {
  @Output() algorithmToggle = new EventEmitter<{ algo: string, isChecked: boolean }>();

  onAlgorithmChange(event: Event, algo: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.algorithmToggle.emit({ algo, isChecked });
  }
}
