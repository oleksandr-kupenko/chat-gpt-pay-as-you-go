import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, RouterOutlet} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {routes} from './app.routes';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {API_URL} from '../config';
import {ErrorInterceptor} from './interceptors/error.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    RouterOutlet,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSidenavModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    {
      provide: 'API_URL',
      useValue: API_URL,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
  }
}
