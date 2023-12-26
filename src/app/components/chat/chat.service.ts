import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RequestData, ResponseData} from "../../app.interface";
import {Observable} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  constructor(
    private http: HttpClient,
    @Inject("API_URL") private API_URL: string,
  ) {}

  postQuestion(data: RequestData): Observable<ResponseData> {
    const body = {
      model: data.model,
      messages: data.messages,
    };

    return this.http.post<ResponseData>(this.API_URL, JSON.stringify(body));
  }
}
