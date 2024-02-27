import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewModelModalComponent } from './add-new-model-modal.component';

describe('AddNewModelModalComponent', () => {
  let component: AddNewModelModalComponent;
  let fixture: ComponentFixture<AddNewModelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewModelModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewModelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
