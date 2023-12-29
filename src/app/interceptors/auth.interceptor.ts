import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import {Inject, Injectable} from "@angular/core";
import {map, Observable, throwError} from "rxjs";
import {AppService} from "../app.service";
import {NO_KEY_ERROR} from "./interceptors.constants";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private appService: AppService,
    @Inject("API_URL") private API_URL: string,
  ) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiKey = this.appService.getKey();
    if (!request.url.includes(this.API_URL)) {
      return next.handle(request.clone());
    }
    if (apiKey) {
      const modifiedRequest = request.clone({
        setHeaders: {
          "Content-Type": `application/json`,
          Authorization: `Bearer ${this.appService.getKey()}`,
        },
      });
      return next.handle(modifiedRequest);
    } else {
      const unauthorizedError = new HttpErrorResponse({
        error: {error: {message: NO_KEY_ERROR}},
        status: 403,
        statusText: NO_KEY_ERROR,
      });
      return throwError(() => unauthorizedError);
    }
  }
}
