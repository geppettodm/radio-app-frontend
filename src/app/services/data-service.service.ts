import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {


  constructor(private http:HttpClient) {
    this.init();
   }

  async init(){
    
  }

  getAll(){
    return this.http.get('http://127.0.0.1:3000/db/random',{observe:'body', responseType:'json'})
  }
}
