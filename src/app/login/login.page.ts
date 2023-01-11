import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials = { username: '', password: '' }

  constructor(private auth: AuthService, private router: Router) { }

  async ngOnInit() {  
    this.auth.init().then((data)=> {if(data) this.router.navigate(['/tabs/tab1']);})
  }



  async login() {
    if (await this.auth.login(this.credentials.username, this.credentials.password))
      this.router.navigate(['/tabs/tab1'])
  }

  async createAccount() {
    if (await this.auth.createAccount(this.credentials.username, this.credentials.password))
      this.router.navigate(['/tabs/tab1'])
  }
}