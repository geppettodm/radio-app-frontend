import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class Connection {
    conn: string = "http://192.168.0.1:3000/";
  }