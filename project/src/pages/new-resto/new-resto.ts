import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { AutocompletePage } from '../autocomplete/autocomplete';
import { Camera, ImagePicker, Transfer } from 'ionic-native';
import { SearchService } from '../../providers/search-service';
import { Storage } from '@ionic/storage';
import { MyRestosPage } from '../my-restos/my-restos';

declare var google:any;

@Component({
  selector: 'page-new-resto',
  templateUrl: 'new-resto.html'
})
export class NewRestoPage {

  registerCredentials = {nom: '', type: '' , address:'' };
  placesService:any;
  placedetails: any;
  map: any;
  markers = [];
  img = "data:image/jpeg;base64,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";
  base64Image
  lat: any;
  lng: any;
  token = '';

  constructor(public navCtrl: NavController, public storage: Storage,public searchService: SearchService, public navParams: NavParams , private modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController) {
  	this.base64Image = this.img;
    this.storage.get('token').then((value) => {
      this.token = value;
    });
  
  }

  ngOnInit() {
        this.initMap();
        this.initPlacedetails();
  }

  showModal() {
        
        // show modal|
        let modal = this.modalCtrl.create(AutocompletePage);
        modal.onDidDismiss(data => {
            console.log('page > modal dismissed > data > ', data);
            if(data){
                this.registerCredentials.address = data.description;
                // get details
                this.getPlaceDetail(data.place_id);
                
            }                
        })
        modal.present();
    }

    private reset() {
        this.initPlacedetails();
        this.registerCredentials.address = '';
    }

    private getPlaceDetail(place_id:string):void {
        var self = this;
        var request = {
            placeId: place_id
        };
        this.placesService = new google.maps.places.PlacesService(this.map);
        this.placesService.getDetails(request, callback);
        function callback(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log('page > getPlaceDetail > place > ', place);
                // set full address
                self.placedetails.address = place.formatted_address;
                self.placedetails.lat = place.geometry.location.lat();
                self.placedetails.lng = place.geometry.location.lng();

                this.lat= place.geometry.location.lat();
                this.lng= place.geometry.location.lng();
                            
                // set place in map
                self.map.setCenter(place.geometry.location);
                self.createMapMarker(place);
                
                console.log('page > getPlaceDetail > details > ', self.placedetails);
            }else{
                console.log('page > getPlaceDetail > status > ', status);
            }
        }
    }

    private initMap() {
        var point = {lat: -34.603684, lng: -58.381559}; 
        let divMap = (<HTMLInputElement>document.getElementById('map'));
        this.map = new google.maps.Map(divMap, {
            center: point,
            zoom: 15,
            disableDefaultUI: true,
            draggable: false,
            zoomControl: true
        });
    }

    private createMapMarker(place:any):void {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: this.map,
          position: placeLoc
        });    
        this.markers.push(marker);
    }

    private initPlacedetails() {
        this.placedetails = {
            address: '',
            lat: '',
            lng: ''  
        };        
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

  createResto(){
      this.searchService.createResto(this.token, this.registerCredentials, this.lat, this.lng, this.base64Image).then((result) => {
            this.navCtrl.setRoot(MyRestosPage);
        }, (err) => {
            console.log(err);
        });
   }     


}
