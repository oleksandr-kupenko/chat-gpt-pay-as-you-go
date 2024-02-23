import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableFieldInputComponent } from './editable-field-input.component';

describe('EditableFieldInputComponent', () => {
  let component: EditableFieldInputComponent;
  let fixture: ComponentFixture<EditableFieldInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditableFieldInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditableFieldInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
