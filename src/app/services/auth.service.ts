import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Connection } from './connection';
import { DataServiceService } from './data-service.service';
import { StorageService } from './storage.service';
import { ToastController } from "@ionic/angular";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  header: BehaviorSubject<HttpHeaders> = new BehaviorSubject(null);
  conn = this.connection.conn;

  constructor(private connection: Connection, private http: HttpClient, private storage: StorageService, private toastController: ToastController, private router: Router) {
    this.init();
  }


  async init(): Promise<boolean> {
    await this.storage.init();
    const token = await this.storage.get("token")
    if (token != null) {
      this.header.next(new HttpHeaders({ accesstoken: token }))
      return true;
    } else return false;
  }

  async login(username: string, password: string):Promise<boolean> {
      return this.http.post(this.conn + "db/login", { username: username, password: password }, { observe: 'body', responseType: 'json' })
      .toPromise().then((data: any) => {
        this.storage.set("token", data.accessToken);
        this.header.next(new HttpHeaders({ accesstoken: data.accessToken }));
        return true;
      }, async (error) => {
        const toast = await this.toastController.create({
          message: error.error,
          duration: 2000,
          position: 'bottom',
        });
        await toast.present();
        return false;
      });
  }

  async createAccount(username: string, password: string):Promise<boolean> {
      return this.http.post(this.conn + "db/newuser", { username: username, password: password }, { observe: 'body', responseType: 'json' })
        .toPromise().then((data: any) => {
          this.storage.set("token", data.accessToken);
          this.header.next(new HttpHeaders({ accesstoken: data.accessToken }))
          return true;
        }, async (error)=>{
          const toast = await this.toastController.create({
            message: error.error,
            duration: 2000,
            position: 'bottom',
          })
          await toast.present();
          return false
        })
        return false
  }

  logout() {
    this.header.next(null);
    return this.storage.remove("token");
  }




}
