import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class Connection {
    conn: string = "http://127.0.0.1:3000/";
  }