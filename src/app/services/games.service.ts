import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Game {
  appid: number;
  name: string;
  developer: string;
  publisher: string;
  score_rank: string;
  positive: number;
  negative: number;
  userscore: number;
  owners: string;
  average_forever: number;
  average_2weeks: number;
  median_forever: number;
  median_2weeks: number;
  price: number;
  initialprice: number;
  discount: number;
  ccu: number;
}

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  private apiUrl = 'https://exrvkfrct8.execute-api.us-east-2.amazonaws.com/Prod'; // reemplaza con tu endpoint

  constructor(private http: HttpClient) { }

  getGames(limit: number = 50, lastKey?: string): Observable<any> {
    let params = new HttpParams().set('limit', limit.toString());
    if (lastKey) {
      params = params.set('lastKey', lastKey);
    }
    return this.http.get<any>(`${this.apiUrl}/games`, { params })
    .pipe(tap(res => console.log('API Response:', res)));
  }

  getGameById(id: string): Observable<any> {
    const search = id.toLowerCase();
    return this.http.get<any>(`${this.apiUrl}/games/${search}`);
  }
}