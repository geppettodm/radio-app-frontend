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

  constructor(private router: Router, private auth:AuthService) {}


  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
