import {Injectable} from '@angular/core';
import {LEVEL_CONSTANTS} from './notifi.interface';
import {MatSnackBar, MatSnackBarConfig, MatSnackBarRef} from '@angular/material/snack-bar';
import {NotifyComponent} from './notify.component';

const DEFAULT_ERROR_TRANSLATION_KEY = 'Server is not respond, please, try again later'; // 'ERROR.DEFAULT';
@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  constructor(private mdSnackbar: MatSnackBar) {}

  success(translation: string, duration?: number, cssClass?: string): MatSnackBarRef<any> {
    return this.show(LEVEL_CONSTANTS.SUCCESS, translation, duration, cssClass);
  }

  info(translation: string, duration?: number, cssClass?: string): MatSnackBarRef<any> {
    return this.show(LEVEL_CONSTANTS.INFO, translation, duration, cssClass);
  }

  warning(translation: string, duration?: number, cssClass?: string): MatSnackBarRef<any> {
    return this.show(LEVEL_CONSTANTS.WARNING, translation, duration, cssClass);
  }

  error(
    translation: string = DEFAULT_ERROR_TRANSLATION_KEY,
    duration?: number,
    cssClass?: string,
  ): MatSnackBarRef<any> {
    return this.show(LEVEL_CONSTANTS.ERROR, translation, duration, cssClass);
  }

  private show(
    level: LEVEL_CONSTANTS,
    translation: string, // TranslationObject,
    duration?: number,
    cssClass?: string,
  ): MatSnackBarRef<any> {
    const config = new MatSnackBarConfig();
    config.duration = duration || 5000;
    const extraClasses = ['snackbar'];
    if (cssClass) {
      extraClasses.push(cssClass);
    }
    let status;
    switch (level) {
      case LEVEL_CONSTANTS.SUCCESS:
        status = LEVEL_CONSTANTS.SUCCESS;
        extraClasses.push('snackbar-success');
        break;
      case LEVEL_CONSTANTS.INFO:
        status = LEVEL_CONSTANTS.INFO;
        extraClasses.push('snackbar-info');
        break;
      case LEVEL_CONSTANTS.WARNING:
        status = LEVEL_CONSTANTS.WARNING;
        extraClasses.push('snackbar-warning');
        break;
      case LEVEL_CONSTANTS.ERROR:
        status = LEVEL_CONSTANTS.ERROR;
        extraClasses.push('snackbar-error');
        break;
    }
    config.panelClass = extraClasses;
    config.data = {status};
    const snackBarRef: MatSnackBarRef<NotifyComponent> = this.mdSnackbar.openFromComponent(NotifyComponent, config);
    snackBarRef.instance.message = translation; // can be wrapped by translation service
    snackBarRef.instance.mdSnackBarRef = snackBarRef;
    return snackBarRef;
  }
}
