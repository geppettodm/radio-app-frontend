import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataServiceService } from '../services/data-service.service';
import { StreamingMedia, StreamingAudioOptions } from '@ionic-native/streaming-media/ngx';


@Component({
  selector: 'app-radio',
  templateUrl: 'radio.page.html',
  styleUrls: ['radio.page.scss'],
})
export class RadioPage {
  radio= null;
  area = [];

  options:StreamingAudioOptions = {
    initFullscreen: false, // true is default. iOS only.
    successCallback: function() {
      console.log("Player closed without error.");
    },
    errorCallback: function(errMsg) {
      console.log("Error! " + errMsg);
    }
  };

  constructor(private activatedRoute: ActivatedRoute, private dataService: DataServiceService, private router: Router, private streamingMedia: StreamingMedia) {
   }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {this.dataService.setNowRadio(params['radio'])})
    this.dataService.nowRadio.subscribe(data => this.radio=data)
    this.dataService.areaRadios.subscribe(data=>this.area=data)
  }


  redirect(_id) {
    this.router.navigate(['/radio', _id]);
  }

  play(string){
    this.streamingMedia.playAudio("http://radio.garden/api/ara/content/listen/"+string+"/channel.mp3", this.options);
  }

}
