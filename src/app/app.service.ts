import {Injectable} from '@angular/core';
import {CHAT_KEY, GPT_MODEL, Message, RequestData, ResponseData, State, STATE_KEY} from './app.interface';
import {BehaviorSubject} from 'rxjs';

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
    localStorage.setItem(CHAT_KEY, apiKey);
    this.setKey(apiKey);
  }

  public initKey() {
    const savedKey = localStorage.getItem(CHAT_KEY);
    this.apiKey$$.next(savedKey);
  }

  public getKey() {
    return this.apiKey$$.value;
  }

  public deleteKey() {
    localStorage.removeItem(CHAT_KEY);
    this.apiKey$$.next('');
  }

  public initState() {
    const savedState = localStorage.getItem(STATE_KEY);
    if (savedState) {
    } else {
      this.state$$.next(new State());
    }
  }

  public saveConfig(state: State) {
    this.state$$.next(state);
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }
}
