import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { Transfer } from 'ionic-native';
import 'rxjs/add/operator/map';

/*
  Generated class for the PostData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PostData {

  data: any;

  constructor(public http: Http, public alertCtrl: AlertController) {
    console.log('Hello PostData Provider');
  }

  sendInformation(token: any, lati: any, long: any, img: any){


  	let headers = new Headers({
		'Authorization': 'Bearer {{'+token+'}}'
		});
	let options = new RequestOptions({
		headers: headers
	});
	let body = JSON.stringify({
		lat: lati,
		lng: long,
		image: img
	});

  	return this.http.post('http://checkin-api.dev.cap-liberte.com/checkin', body, options)
	.map(res => res.json())
	.subscribe(success => {
	    let alert = this.alertCtrl.create({
	      title: 'Success',
	      subTitle: 'Send Information success! checking id: '+success.id,
	      buttons: ['OK']
	    });
	    alert.present();

	}, error => {
	    // An error happened
	    console.log("Something happened! :( "+error);
	}, () => {
	    console.log('Authentication Complete')
	});
  	


  }//Send

 
  	

}//PostData
