import { Component } from '@angular/core';
import { DataServiceService } from '../services/data-service.service';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  progress = 42;
  playing = false
  radio;
  audio: HTMLAudioElement;

  constructor(private dataService: DataServiceService) {}
  

  ngOnInit(){
    this.dataService.playingRadio.subscribe((data) => {this.radio=data;this.playRadio()})
  }

  playRadio(){
    if(this.dataService.playingRadioStringConn!=null){
    this.audio = new Audio(this.dataService.playingRadioStringConn);
    this.audio.play();
    this.playing=true;
    }
  }

  pauseRadio(){
    this.audio.pause();
    this.playing=false;
  }
}
