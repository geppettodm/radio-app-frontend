import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.page.html',
  styleUrls: ['./radio.page.scss'],
})
export class RadioPage implements OnInit {
  radio=null;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    //const title = this.activatedRoute.snapshot.paramMap.get('title');
    //const decodedTitle = decodeURIComponent(title);
    //this.data = albums[decodedTitle];
  }

}
