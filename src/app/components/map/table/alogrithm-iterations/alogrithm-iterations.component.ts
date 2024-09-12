import {Component, Input, OnChanges} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-alogrithm-iterations',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './alogrithm-iterations.component.html',
  styleUrl: './alogrithm-iterations.component.css'
})
export class AlogrithmIterationsComponent implements OnChanges{
  @Input() iterations: { route: [number, number][], distance: number }[] = [];
  fastestIterationIndex: number = -1;

  ngOnChanges(): void {
    this.findFastestIteration();
  }

  private findFastestIteration(): void {
    if (this.iterations.length > 0) {
      this.fastestIterationIndex = this.iterations
        .map(iteration => iteration.distance)
        .reduce((minIndex, distance, index, array) => distance < array[minIndex] ? index : minIndex, 0);
    }
  }
}
