import {Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {SettingsMenuService} from '../../services/settings-menu.service';

@Component({
  selector: 'app-settings-btn',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './settings-btn.component.html',
  styleUrl: './settings-btn.component.scss',
})
export class SettingsBtnComponent {
  constructor(private settingsMenuService: SettingsMenuService) {}
  handleToggleMenu() {
    this.settingsMenuService.toggleIsMenuOpen();
  }
}
