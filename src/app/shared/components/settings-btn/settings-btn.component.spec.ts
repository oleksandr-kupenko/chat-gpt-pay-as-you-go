import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsBtnComponent } from './settings-btn.component';

describe('SettingsBtnComponent', () => {
  let component: SettingsBtnComponent;
  let fixture: ComponentFixture<SettingsBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsBtnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingsBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
