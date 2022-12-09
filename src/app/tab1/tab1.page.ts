import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {DataServiceService} from '../services/data-service.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  constructor(private router: Router, private dataService: DataServiceService) {}

  caricamento = {
    name:"...in caricamento",
    image:""
  }

  data = [
    {
      title: 'Ascoltate di recente',
      radios: [this.caricamento, this.caricamento,this.caricamento,this.caricamento, this.caricamento]
    },
    {
      title: 'Potrebbero piacerti',
      radios: [this.caricamento, this.caricamento,this.caricamento,this.caricamento, this.caricamento]
    },
    {
      title: 'Vicino a te',
      radios: [this.caricamento, this.caricamento,this.caricamento,this.caricamento, this.caricamento]
    }
  ];

  opts = {
    slidesPerView: 2.4,
    slidesOffsetBefore: 20,
    spaceBetween: 20,
    freeMode: true
  };

  async ngOnInit(){
    this.dataService.getAll().subscribe((data:[])=> this.data[1].radios = data)
  }

  openAlbum(radio) {
    this.router.navigateByUrl(`/tabs/tab1/${radio.name}`);
  }

  endSlide(data){
    if(data.title==="Potrebbero piacerti"){
      console.log("ciao")
      this.dataService.getAll().subscribe((data:[])=> this.data[1].radios.concat(data))
    }
  }
}
