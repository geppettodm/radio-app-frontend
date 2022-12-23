import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataServiceService } from '../services/data-service.service';



@Component({
  selector: 'app-radio',
  templateUrl: 'radio.page.html',
  styleUrls: ['radio.page.scss'],
})
export class RadioPage {
  radio= null;
  area = [];



  constructor(private activatedRoute: ActivatedRoute, private dataService: DataServiceService, private router: Router) {
   }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {this.dataService.setNowRadio(params['radio'])})
    this.dataService.nowRadio.subscribe(data => this.radio=data)
    this.dataService.areaRadios.subscribe(data=>this.area=data)
  }


  redirect(_id) {
    this.router.navigate(['/radio', _id]);
  }

  play(id){
    this.dataService.newPlayingRadio(id)
    this.router.navigate(['tabs/tab1'])
  }

}
