import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { promise } from 'protractor';


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  
  conn = "http://127.0.0.1:3000/"
  ext = 0.25;
  skipNear = 0;
  skipsearch = 0;
  x = 41
  y =17
  playingRadioStringConn = null;
  query = null;

  favouriteRadios = new BehaviorSubject(null);
  randomRadios = new BehaviorSubject(null);
  nearRadios = new BehaviorSubject(null);
  areaRadios = new BehaviorSubject(null);
  nowRadio = new BehaviorSubject(null);
  playingRadio = new BehaviorSubject({name:"",city:"",conn:null});



  constructor(private http: HttpClient) {
    this.init();
  }

  async init() {
    this.newRandomRadios(5)
    
    const coord = await Geolocation.getCurrentPosition();
    this.x = coord.coords.latitude
    this.y=  coord.coords.longitude
    this.newNearRadios()
  }

  newRandomRadios(n: number) {
    this.http.get(this.conn + 'db/random?number=' + n, { observe: 'body', responseType: 'json' }).subscribe((data: []) => { this.randomRadios.next(data) })
  }

  newNearRadios() {
    if(this.ext<0.8){
      this.http.get(this.conn + 'db/near?x=' + this.x + '&y=' + this.y + '&ext=' + this.ext + '&skip=' + this.skipNear + '&limit=' + 4, { observe: 'body', responseType: 'json' }).subscribe((data: []) => {
        if(data){
          this.nearRadios.next(data);
          this.skipNear = this.skipNear+1;
        } else{
          this.ext = 2*(this.ext) 
          this.skipNear = 0;
          this.newNearRadios()
        }
      })
    } else return
  }

  async setNowRadio(string:string){
    this.http.get(this.conn + 'db/radio?id=' + string, { observe: 'body', responseType: 'json' }).subscribe((data) => {this.nowRadio.next(data); this.areaRadio(data)})
  }

  async areaRadio(radio){
    this.http.get(this.conn + 'db/radios?country=' + radio.country, { observe: 'body', responseType: 'json' }).subscribe((data) => {this.areaRadios.next(data);})
  }

  async newPlayingRadio(id){
    this.http.get(this.conn + 'db/radio?id=' + id, { observe: 'body', responseType: 'json' }).subscribe((data) => {this.setPlayingRadio(data)})
  }

  async setPlayingRadio(radio){
    if(radio.conn){
    let url = await this.http.get(this.conn+'db/url?string='+"http://radio.garden/api/ara/content/listen/"+radio.conn+"/channel.mp3", { observe: 'body', responseType: 'json' }).toPromise()
    this.playingRadioStringConn = url;
    this.playingRadio.next(radio);
  }
    else return null
  }

  async searchRadios(string?:string){
    const limit = 15;
    if(string){
      this.query = string;
      this.skipsearch = 0;
      return this.http.get(this.conn + "db/query?&limit=" + limit +"&string=" + this.query, { observe: 'body', responseType: 'json' }).toPromise()
    } else {
      this.skipsearch = this.skipsearch + 1;
      return this.http.get(this.conn + 'db/query?string=' + this.query + "&limit=" + limit + "&skip=" + this.skipsearch, { observe: 'body', responseType: 'json' }).toPromise()
    }
}

}
