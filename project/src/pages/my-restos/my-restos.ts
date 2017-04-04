import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { SearchService } from '../../providers/search-service';
import { NewRestoPage } from '../new-resto/new-resto';

@Component({
  selector: 'page-my-restos',
  templateUrl: 'my-restos.html'
})
export class MyRestosPage {

  public one = false;
  token = '';
  restos: any;

  constructor(public navCtrl: NavController, public searchService: SearchService, public navParams: NavParams, public storage: Storage) {
  	this.storage.get('token').then((value) => {
      this.token = value;
      this.loadResto();
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyRestosPage');
  }

  loadResto(){
       this.searchService.loadMy(this.token).then(data => {
          this.restos = data;
          if(this.restos.length==0){
            this.restos= null;
            this.one = true; 
          }

       });
   }

   newResto(){
     this.navCtrl.push(NewRestoPage);
   }

}
