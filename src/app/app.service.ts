import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {CHAT_KEY, GPT_MODEL, Message, RequestData, ResponseData} from "./app.interface";

@Injectable({providedIn: "root"})
export class AppService {
  private apiUrl = "https://api.openai.com/v1/chat/completions";

  headers!: HttpHeaders;

  constructor(private http: HttpClient) {}

  setRequestHeaders(openAiApiKey: string) {
    this.headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${openAiApiKey}`);
    console.log(1, this.headers);
  }
  postQuestion(data: RequestData): Observable<ResponseData> {
    const body = {
      model: data.model,
      messages: data.messages,
    };

    return this.http.post<ResponseData>(this.apiUrl, JSON.stringify(body), {headers: this.headers});
  }

  saveKey(apiKey: string) {
    localStorage.setItem(CHAT_KEY, apiKey);
  }

  getKey(): string | null {
    return localStorage.getItem(CHAT_KEY);
  }

  deleteKey() {
    localStorage.removeItem(CHAT_KEY);
  }
}
