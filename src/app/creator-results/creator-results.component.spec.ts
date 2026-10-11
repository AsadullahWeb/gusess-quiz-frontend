import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorResultsComponent } from './creator-results.component';

describe('CreatorResultsComponent', () => {
  let component: CreatorResultsComponent;
  let fixture: ComponentFixture<CreatorResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatorResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatorResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
