import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { DataServiceService } from '../services/data-service.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  favourites = [];

  constructor(private router: Router, private auth:AuthService, private dataService: DataServiceService) {
    this.favourites = this.dataService.favourites;
  }

  toRadio(id){
    this.router.navigate(['/radio', id]);
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
