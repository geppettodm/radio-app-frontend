import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials = {username:'', password: ''}

  constructor(private auth: AuthService, private router:Router) { }

  ngOnInit() {
  }

  async login(){
    try{
    this.auth.login(this.credentials.username, this.credentials.password)
    this.router.navigate(['/tabs/tab1'])
    } catch(error){
      console.log(error);
    }
    
  }

  async createAccount(){
    try{
      this.auth.createAccount(this.credentials.username, this.credentials.password)
      this.router.navigate(['/tabs/tab1'])
      } catch(error){
        console.log(error);
      }
  }



}
