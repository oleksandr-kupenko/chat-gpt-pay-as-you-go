import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {NotifyService} from '../shared/components/notify/notify.service';
import {SettingsMenuService} from '../shared/services/settings-menu.service';
import {NO_KEY_ERROR} from './interceptors.constants';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private notifyService: NotifyService,
    private settingsMenuService: SettingsMenuService,
  ) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          this.notifyService.error(error.error.error.message);
          console.error('An error occurred:', error.error.error.message);
        } else {
          if (error.error.error.message === NO_KEY_ERROR || error.error.error.message.includes('Incorrect API')) {
            this.settingsMenuService.toggleIsMenuOpen(true);
          }
          this.notifyService.error(error.error.error.message);
          console.error(`Backend returned code ${error.status}, ` + `body was: ${JSON.stringify(error.error)}`);
        }

        return throwError(() => error);
      }),
    );
  }
}
