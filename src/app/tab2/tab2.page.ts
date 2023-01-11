import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataServiceService } from '../services/data-service.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  results = [];
  

  constructor(private dataService:DataServiceService, private router: Router, private auth:AuthService) {}


  search(event?){
    if(event){
    const query = event.target.value.toLowerCase();
    this.dataService.searchRadios(query).then((data:[])=>{this.results = data;});
    } else {
      this.dataService.searchRadios().then((data:[])=>{this.results = this.results.concat(data)});
    }
  }

  onIonInfinite(event){
    this.search();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  toRadio(id){
    this.router.navigate(['/radio', id]);
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
