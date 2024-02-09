import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Chat, GPT_MODEL, RequestData, ResponseData} from '../../app.interface';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private http: HttpClient,
    @Inject('API_URL') private API_URL: string,
  ) {}

  postQuestion(data: RequestData): Observable<ResponseData> {
    console.log('DATA', data);
    //return of();
    return this.http.post<ResponseData>(this.API_URL, JSON.stringify(data));
  }
}
