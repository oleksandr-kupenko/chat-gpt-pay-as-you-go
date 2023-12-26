import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {LEVEL_CONSTANTS} from './notifi.interface';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-notify',
  standalone: true,
  imports: [MatTooltipModule],
  templateUrl: './notify.component.html',
  styleUrl: './notify.component.scss',
})
export class NotifyComponent {
  LEVEL_CONSTANTS = LEVEL_CONSTANTS;
  message = '';
  mdSnackBarRef!: MatSnackBarRef<NotifyComponent>;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: {status: LEVEL_CONSTANTS}) {}

  close() {
    if (this.mdSnackBarRef) {
      this.mdSnackBarRef.dismiss();
    }
  }
}
