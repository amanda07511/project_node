import { Component,  ElementRef, ViewChild } from '@angular/core';
import { Platform, NavController, NavParams , ModalController, ViewController } from 'ionic-angular';
import { LastService } from '../../providers/last-service';
import { Geolocation, GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, CameraPosition, GoogleMapsMarkerOptions, GoogleMapsMarker } from 'ionic-native';

/*
  Generated class for the Last page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
  declare var google;

@Component({
  selector: 'page-last',
  templateUrl: 'last.html',
  providers: [LastService]
})

export class LastPage {

 
  public people: any;
  coor = {lat: '', lng: ''};
  constructor(public nav: NavController, public navParams: NavParams, public lastService: LastService, public modalCtrl: ModalController ){
    this.loadPeople();
  }


  
  //get last checkings
  loadPeople(){
      this.lastService.load().then(data => {
      this.people = data;
      });
  }//loadPeople

  

  getLatLng(lat, lng) {

   console.log("lat: "+lat+" lng: "+lng);
   this.coor.lat=lat;
   this.coor.lng=lng;

   //let modal = this.modalCtrl.create(ModalContentPage,this.coor);
   //modal.present();
   
  } 

  presentProfileModal(lati, lng) {
   let profileModal = this.modalCtrl.create(Profile, { lat: lati, lng: lng });
   profileModal.present();
 }
  
}//LastPage

@Component({
  selector: 'page-modal',
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>
      Localisation
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <span ion-text color="primary" showWhen="ios">Back</span>
        <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
 <ion-card>
    <div #map id="map"></div> 
 </ion-card>
</ion-content>
`
})

export class Profile {
 @ViewChild('map') mapElement: ElementRef;

 map: any;
 lat: any;
 lng: any;

 constructor(public params: NavParams, public viewCtrl: ViewController,public platform: Platform  ) {
    console.log('lat', params.get('lat'));
    console.log('lng', params.get('lng'));
    this.lat = params.get('lat');
    this.lng = params.get('lng');  
  
 }
 

ionViewDidLoad() {
    this.loadMap();
  }

  loadMap(){
 
    Geolocation.getCurrentPosition().then((position) => {
     
      

      let latLng = new google.maps.LatLng(this.lat,this.lng);
      //console.log("IM INSIDE THE GEOLOCATION")
      //let latLng = new google.maps.LatLng(-34.9290, 138.6010);

      let mapOptions = {
        center: latLng,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
       
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });

      let infoWindow = new google.maps.InfoWindow({
        content: "Im here"
      });

      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
      });


    }, (err) => {
      console.log(err);
    });


 
  }
 

 dismiss() {
    this.viewCtrl.dismiss();
  }//dismiss

}




