import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataServiceService } from '../services/data-service.service';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  progress = 42;
  public playing = false
  public radio;
  audio: HTMLAudioElement;

  constructor(private dataService: DataServiceService, private router: Router) { }


  ngOnInit() {
    this.dataService.playingRadio.subscribe((data) => {
      if (data._id) {
        this.radio = data;
        this.playRadio()
      } else {
        if (this.audio) {
          this.audio.pause();
          this.audio = null
        }
      }
    })
  }

  playRadio() {
    if (this.dataService.playingRadioStringConn != null) {
      if (this.audio) {
        this.audio.pause();
        this.audio = null
      }
      this.audio = new Audio(this.dataService.playingRadioStringConn);
      this.audio.play();
      this.playing = true;
    }
  }

  pauseRadio() {
    this.audio.pause();  
    this.playing = false;
  }

  toRadio(_id) {
    this.router.navigate(['/radio', _id]);
  }
}
