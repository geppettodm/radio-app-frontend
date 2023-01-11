import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import {Connection} from "./connection"



@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  public conn = this.connection.conn
  ext = 0.25;
  skipNear = 0;
  skipsearch = 0;
  x = 41
  y = 17
  playingRadioStringConn = null;
  query = null;

  randomRadios = new BehaviorSubject(null);
  nearRadios = new BehaviorSubject(null);
  areaRadios = new BehaviorSubject(null);
  nowRadio = new BehaviorSubject(null);
  playingRadio = new BehaviorSubject({ name: "", city: "", conn: null, _id: null });
  recentRadios = new BehaviorSubject(null);
  favourites = [];



  constructor(private http: HttpClient, private storage: StorageService, private router:Router, private auth:AuthService, private connection:Connection) {
    this.auth.header.subscribe((data)=>{
      if(!data){
        this.playingRadio.next({ name: "", city: "", conn: null, _id: null });
        this.playingRadioStringConn = null;
      }
    })
  }

  async init() {
    this.newRandomRadios(5)
    await this.storage.init();
    this.recentRadios.next(await this.storage.get("recentRadios"))

    const coord = await Geolocation.getCurrentPosition();
    this.x = coord.coords.latitude
    this.y = coord.coords.longitude
    this.newNearRadios()
    this.getFavourites()
    this.router.navigate(["/tabs/tab1"])
  }

  redirectViolation(error:HttpErrorResponse){
    if(error.status==401){
      this.auth.logout();      
      this.router.navigate(["/login"])
    } else (console.error(error))
  }

  newRandomRadios(n: number) {    
    this.http.get(this.conn + 'db/random?number=' + n, { headers: this.auth.header.value, observe: 'body', responseType: 'json' }).subscribe(
      (data: []) => { this.randomRadios.next(data)}, 
      (error)=>this.redirectViolation(error));
  }

  newNearRadios() {
    if (this.ext < 0.8) {
      this.http.get(this.conn + 'db/near?x=' + this.x + '&y=' + this.y + '&ext=' + this.ext + '&skip=' + this.skipNear + '&limit=' + 4, { headers: this.auth.header.value, observe: 'body', responseType: 'json' }).subscribe((data: []) => {
        if (data) {
          this.nearRadios.next(data);
          this.skipNear = this.skipNear + 1;
        } else {
          this.ext = 2 * (this.ext)
          this.skipNear = 0;
          this.newNearRadios()
        }
      },
      (error)=>this.redirectViolation(error));
      
    } else return
  }

  async setNowRadio(string: string) {
    this.http.get(this.conn + 'db/radio?id=' + string, { headers: this.auth.header.value, observe: 'body', responseType: 'json' }).subscribe((data) => { this.nowRadio.next(data); this.areaRadio(data) },
    (error)=>this.redirectViolation(error))
  }

  async areaRadio(radio) {
    this.http.get(this.conn + 'db/radios?country=' + radio.country, { headers: this.auth.header.value, observe: 'body', responseType: 'json' }).subscribe((data) => { this.areaRadios.next(data); },
    (error)=>this.redirectViolation(error))
  }

  async newPlayingRadio(id) {
    this.http.get(this.conn + 'db/radio?id=' + id, { headers: this.auth.header.value, observe: 'body', responseType: 'json' }).subscribe((data) => { this.setPlayingRadio(data) },
    (error)=>this.redirectViolation(error))
  }

  async setPlayingRadio(radio) {    
    if (radio.conn) {
      let url = await this.http.get(this.conn + 'db/url?string=' + "http://radio.garden/api/ara/content/listen/" + radio.conn + "/channel.mp3", { headers: this.auth.header.value, observe: 'body', responseType: 'json' }).toPromise().catch((error)=>{this.redirectViolation(error); return})
      
      this.playingRadioStringConn = url;
      this.playingRadio.next(radio);

      let rec = await this.storage.get("recentRadios");
      if (rec) {
        if (!(rec.includes(radio._id))) {
          while(rec.length>12){rec.shift()}
          rec.push(radio._id)
          this.storage.set("recentRadios", rec)
        }
      } else {
        this.storage.set("recentRadios", [radio._id])
      }
      this.recentRadios.next(await this.storage.get("recentRadios"))
    }
    else return null
  }

  async searchRadios(string?: string) {
    const limit = 15;
    if (string) {
      this.query = string;
      this.skipsearch = 0;
      return this.http.get(this.conn + "db/query?&limit=" + limit + "&string=" + this.query, { headers: this.auth.header.value, observe: 'body', responseType: 'json' }).toPromise().catch((error)=>{this.redirectViolation(error); return})
    } else {
      this.skipsearch = this.skipsearch + 1;
      return this.http.get(this.conn + 'db/query?string=' + this.query + "&limit=" + limit + "&skip=" + this.skipsearch, { headers: this.auth.header.value, observe: 'body', responseType: 'json' }).toPromise().catch((error)=>{this.redirectViolation(error); return})
    }
  }

  async getRadio(id: string):Promise<any> {
    return this.http.get(this.conn + 'db/radio?id=' + id, { headers: this.auth.header.value,observe: 'body', responseType: 'json' }).toPromise().catch((error)=>{this.redirectViolation(error); return})
  }

  async getFavourites(){
    this.http.get(this.conn + 'db/favourites', { headers: this.auth.header.value,observe: 'body', responseType: 'json' }).subscribe((data:[])=>{this.favourites=data}, (error)=>{this.redirectViolation(error)})
  }

  async addFavourite(id: string) {
    this.favourites.push(await this.getRadio(id))
    return this.http.post(this.conn + 'db/add-favourite', {id:id}, { headers: this.auth.header.value,observe: 'body', responseType: 'json' }).toPromise().catch((error)=>{this.redirectViolation(error)})
  }

  async removeFavourite(id: string) {
    this.favourites = this.favourites.filter((radio)=>radio._id!=id)
    return this.http.post(this.conn + 'db/remove-favourite', {id:id}, { headers: this.auth.header.value,observe: 'body', responseType: 'json' }).toPromise().catch((error)=>{this.redirectViolation(error)})
  }

}
