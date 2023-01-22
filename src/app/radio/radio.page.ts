import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataServiceService } from '../services/data-service.service';
import { TabsPage } from '../tabs/tabs.page';



@Component({
  selector: 'app-radio',
  templateUrl: 'radio.page.html',
  styleUrls: ['radio.page.scss'],
})
export class RadioPage {
  radio = null;
  area = [];
  showPlay = true;
  showFav = false;



  constructor(private activatedRoute: ActivatedRoute, private dataService: DataServiceService, private router: Router) {
    this.setShowFav();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => { this.dataService.setNowRadio(params['radio']) })
    this.dataService.nowRadio.subscribe(data => { this.radio = data; this.setShowplay(); this.setShowFav(); })
    this.dataService.areaRadios.subscribe(data => this.area = data)
  }

  setShowplay() {   
      if (this.radio?._id === this.dataService.playingRadio.value._id) {
        this.showPlay = false;
      } else this.showPlay = true;
  }

  setShowFav() {   
    if(this.dataService.favourites.find(item => item._id === this.radio?._id)){
      this.showFav = true;
    }
  }

  setFav(){    
    if(this.showFav){
      this.dataService.removeFavourite(this.radio._id)
      this.showFav = false;
    } else {
      this.dataService.addFavourite(this.radio._id)
      this.showFav = true;
    }
  }

  redirect(_id) {
    this.router.navigate(['/radio', _id]);
  }

  play(id) {
    this.dataService.newPlayingRadio(id)
    this.router.navigate(['tabs/tab1'])
  }

}
