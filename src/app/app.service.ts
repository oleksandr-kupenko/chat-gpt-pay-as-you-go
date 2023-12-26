import {Injectable} from "@angular/core";
import {CHAT_KEY, GPT_MODEL, Message, RequestData, ResponseData} from "./app.interface";
import {BehaviorSubject} from "rxjs";

@Injectable({providedIn: "root"})
export class AppService {
  private apiKey$$ = new BehaviorSubject<string | null>(null);

  public getApiKey$ = this.apiKey$$.asObservable();

  saveKey(apiKey: string) {
    this.apiKey$$.next(apiKey);
    localStorage.setItem(CHAT_KEY, apiKey);
  }

  public initKey() {
    const savedKey = localStorage.getItem(CHAT_KEY);
    this.apiKey$$.next(savedKey);
  }

  public getKey() {
    return this.apiKey$$.value;
  }

  deleteKey() {
    localStorage.removeItem(CHAT_KEY);
    this.apiKey$$.next("");
  }
}
