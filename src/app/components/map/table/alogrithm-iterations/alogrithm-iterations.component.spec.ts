import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlogrithmIterationsComponent } from './alogrithm-iterations.component';

describe('AlogrithmIterationsComponent', () => {
  let component: AlogrithmIterationsComponent;
  let fixture: ComponentFixture<AlogrithmIterationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlogrithmIterationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlogrithmIterationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
