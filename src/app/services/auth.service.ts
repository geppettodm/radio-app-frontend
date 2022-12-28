import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Connection } from './connection';
import { DataServiceService } from './data-service.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  header: BehaviorSubject<HttpHeaders> = new BehaviorSubject(null);
  conn = this.connection.conn;

  constructor(private connection: Connection, private http:HttpClient, private storage: StorageService) {
    this.init();
   }


   async init(){
    await this.storage.init();
    const token = await this.storage.get("token")
    if(token!= null){
    this.header.next(new HttpHeaders({accesstoken: token}))
    }
   }

     login(username:string, password:string){
      this.http.post(this.conn+ "login", {username:username, password:password}, {observe: 'body', responseType: 'json'})
      .toPromise().then((data:any)=>{
          this.storage.set("token", data.accessToken); 
          this.header.next(new HttpHeaders({accesstoken: data.accessToken})) 
     })
        }

   createAccount(username:string, password:string){
      this.http.post(this.conn+ "newuser", {username:username, password:password}, {observe: 'body', responseType: 'json'})
      .toPromise().then((data:any)=>{
          this.storage.set("token", data.accessToken);
          this.header.next(new HttpHeaders({accesstoken: data.accessToken})) 
          })
        }

    logout(){
      this.header.next(null);
      return this.storage.remove("token");
    }




}
