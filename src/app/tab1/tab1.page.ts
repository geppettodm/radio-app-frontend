import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataServiceService } from '../services/data-service.service';
import { StorageService } from '../services/storage.service';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  constructor(private router: Router, private dataService: DataServiceService, private storage: StorageService) {
  }

  caricamento = {
    name: "...in caricamento",
    image: "",
    buffering: true
  }

  nothing = {
    name: "",
    image: "assets/icon/empty.png",
    buffering: true
  }

  data = [
    {
      id: 0,
      title: 'Ascoltate di recente',
      radios: []
    },
    {
      id: 1,
      title: 'Potrebbero piacerti',
      radios: []
    },
    {
      id: 2,
      title: 'Vicino a te',
      radios: [],
      round: null
    }
  ];

  opts = {
    slidesPerView: 2.4,
    slidesOffsetBefore: 20,
    spaceBetween: 20,
    freeMode: true
  };

  async ngOnInit() {
    this.data[0].radios = [this.nothing, this.nothing, this.nothing]
    this.data[1].radios = [this.caricamento, this.caricamento, this.caricamento]
    this.data[2].radios = [this.caricamento, this.caricamento, this.caricamento]

    this.dataService.randomRadios.subscribe((data: []) => this.refreshRand(data))
    this.dataService.nearRadios.subscribe((data: []) => this.refreshNear(data))
    this.dataService.playingRadio.subscribe((data)=>this.chargeStoredRadios())

    await this.storage.init();
    this.chargeStoredRadios();

  }


  async chargeStoredRadios() {
    let storageRadios = await this.storage.get("recentRadios")

    if (storageRadios) {   
      storageRadios = storageRadios.reverse(); 
      for (let i=0; i < storageRadios.length; i++) {
        storageRadios[i] = await this.dataService.getRadio(storageRadios[i]);
        }
      
      if (storageRadios.length < 4) {
        for (let i = storageRadios.length - 1; i < 3; i++) {
          storageRadios.push(this.nothing)
        }
      }
      this.data[0].radios = storageRadios;
    }
  }


  refreshRand(data: []) {
    if (data) {
      if (this.data[1].radios[0].buffering) {
        this.data[1].radios = data
      } else {
        this.data[1].radios = this.data[1].radios.concat(data)
      }
    }
  }

  refreshNear(data: []) {
    if (data) {
      if (this.data[2].radios[0].buffering) {
        this.data[2].radios = data
      } else {
        data.forEach((radio) => {
          if (!(this.data[2].radios.includes(radio))) {
            this.data[2].radios.push(radio)
          }
        })
      }
    }
  }

  openAlbum(radio) {
    this.router.navigate(['/radio', radio._id]);
  }

  endSlide(data) {

    if (data.id === 1) {
      this.dataService.newRandomRadios(1);
    }

    if (data.id === 2)
      this.dataService.newNearRadios();
  }
}
