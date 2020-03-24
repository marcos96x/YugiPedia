import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private basePathAPI = "https://db.ygoprodeck.com/api/v6/cardinfo.php";
  constructor(private http: HttpClient) { 

  }

  public getCardByName(name) {
    return this.http.get(`${this.basePathAPI}?name=${name}`)
  }

  public getCardsByFilters(params) {
    return this.http.get(`${this.basePathAPI}?${params}`)
  }
  
}