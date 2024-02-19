import {Injectable} from '@angular/core';
import {API_KEY, CONFIG, Config, State} from './app.interface';
import {BehaviorSubject, Observable, of} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AppService {
  private apiKey$$ = new BehaviorSubject<string | null>(null);
  private state$$ = new BehaviorSubject<State | null>(null);

  public getApiKey$ = this.apiKey$$.asObservable();
  public getState$ = this.state$$.asObservable();

  setKey(apiKey: string) {
    this.apiKey$$.next(apiKey);
  }

  saveKey(apiKey: string) {
    localStorage.setItem(API_KEY, apiKey);
    this.setKey(apiKey);
  }

  public initKey() {
    const savedKey = localStorage.getItem(API_KEY);
    this.apiKey$$.next(savedKey);
  }

  public getKey() {
    return this.apiKey$$.value;
  }

  public deleteKey() {
    localStorage.removeItem(API_KEY);
    this.apiKey$$.next('');
  }

  public initState() {
    const savedState = localStorage.getItem(API_KEY);
    if (savedState) {
    } else {
      this.state$$.next(new State());
    }
  }

  public saveChats(config: Config) {
    console.log('DATA', config);
    localStorage.setItem(CONFIG, JSON.stringify(config));
    return of({test: '123'});
  }

  public initConfig(): Observable<Config | null> {
    const configStr = localStorage.getItem(CONFIG);
    if (configStr) {
      const config = JSON.parse(configStr) as Config | null;
      return of(config);
    }
    return of(null);
  }
}
