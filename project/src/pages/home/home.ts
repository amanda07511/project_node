import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController,ActionSheetController, App } from 'ionic-angular';
import { PostData } from '../../providers/post-data';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { Geolocation, Camera, ImagePicker, Transfer } from 'ionic-native';


declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

	@ViewChild('map') mapElement: ElementRef;
  password = '';
  email = '';
  token = '';

  map: any;
  apiKey: any;
  data: any;
  lat: any;
  lng: any;
  img = 'data:image/jpeg;base64,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' ;


  base64Image

  constructor(public nav: NavController, public postData: PostData,  private auth: AuthService, private app: App, public actionSheetCtrl: ActionSheetController) {

    this.token = auth.token;
    this.base64Image = this.img;
    
  }
  
  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap(){
 
    Geolocation.getCurrentPosition().then((position) => {
     
      this.lat  = position.coords.latitude;
      this.lng = position.coords.longitude;

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      //console.log("IM INSIDE THE GEOLOCATION")
      //let latLng = new google.maps.LatLng(-34.9290, 138.6010);

      let mapOptions = {
        center: latLng,
        zoom: 45,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
    }, (err) => {
      console.log(err);
    });
 
  }

  
  addChecking() {
  
  	this.data=this.postData.sendInformation(this.token, this.lat, this.lng, this.base64Image);

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
 
    let content = "Last checking!";          
 
    this.addInfoWindow(marker, content);

    console.log("You push add last checking")
  			 
	}

  addInfoWindow(marker, content){
 
  let infoWindow = new google.maps.InfoWindow({
    content: content
  });
 
  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
  });
 
}

  public logout() {
    this.auth.logout().subscribe(succ => {
       this.app.getRootNav().setRoot(LoginPage);
    });
  }


  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select image',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            this.accessGallery();
          }
        },{
          text: 'Camera',
          handler: () => {
           this.takePhoto();
          }
        }
      ]
    });
    actionSheet.present();
  }

 takePhoto(){

    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
        this.base64Image = 'data:image/jpeg;base64,'+imageData;
    }, (err) => {
        console.log(err);
    });
  }

accessGallery(){

 Camera.getPicture({
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: Camera.DestinationType.DATA_URL
    }).then((imageData) => {
        this.base64Image = 'data:image/jpeg;base64,'+imageData;
    }, (err) => {
        console.log(err);
    });

   
  }  



		
}
