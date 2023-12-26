import {TestBed} from '@angular/core/testing';

import {SettingsMenuService} from '../../services/settings-menu.service';

describe('SettingsBtnService', () => {
  let service: SettingsMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
