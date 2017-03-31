import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConnectivityService } from '../../providers/connectivity-service';
import { Geolocation } from 'ionic-native';
import { LastService } from '../../providers/last-service';
 
 declare var google;

/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [LastService]
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
 
  map: any;
  mapInitialised: boolean = false;
  apiKey: 'AIzaSyBCN7HDHyOiH7C12WnhwpORf6-d5loHnLc';
  public people: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,  public connectivityService: ConnectivityService , public lastService: LastService ) {
  	this.loadGoogleMaps();
    this.loadPeople();
  }//constructor

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }

  loadGoogleMaps(){

    this.addConnectivityListeners();

  if(typeof google == "undefined" || typeof google.maps == "undefined"){

    console.log("Google maps JavaScript needs to be loaded.");
    this.disableMap();

    if(this.connectivityService.isOnline()){
      console.log("online, loading map");

      //Load the SDK
      window['mapInit'] = () => {
        this.initMap();
        this.enableMap();
      }

      let script = document.createElement("script");
      script.id = "googleMaps";

      if(this.apiKey){
        script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
      } else {
        script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';       
      }

      document.body.appendChild(script);  

    } 
  }
  else {

    if(this.connectivityService.isOnline()){
      console.log("showing map");
      this.initMap();
      this.enableMap();
    }
    else {
      console.log("disabling map");
      this.disableMap();
    }

  }

  }

  initMap(){

    this.mapInitialised = true;

    Geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    });

  }

  disableMap(){
    console.log("disable map");
  }

  enableMap(){
    console.log("enable map");
  }

  addConnectivityListeners(){

    let onOnline = () => {

      setTimeout(() => {
        if(typeof google == "undefined" || typeof google.maps == "undefined"){

          this.loadGoogleMaps();
          
        } else {

          if(!this.mapInitialised){
            this.initMap();
          }

          this.enableMap();
        }
      }, 2000);

    };

    let onOffline = () => {
      this.disableMap();
    };

    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);

  }//addConnectivity

//get last checkings
  loadPeople(){

      this.lastService.loadLat().then(data => {
      this.people = data;
      });

     
       console.log("Information od loadLat "+JSON.stringify(this.people));
     

  }//loadPeople


}
