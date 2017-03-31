import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, App , AlertController,  LoadingController, Loading} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Camera, ImagePicker, Transfer } from 'ionic-native';

import { PeopleService } from '../../providers/people-service';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
	
  public people: any;
  registerCredentials = {nom: '',prenom: ''};
  loading: Loading;
  token = '';
  base64Image

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private peopleService: PeopleService, private app: App, private storage: Storage, public actionSheetCtrl: ActionSheetController , private loadingCtrl: LoadingController ) {

    this.storage.get('token').then((value) => {
      this.token = value;
      console.log("Storage: "+this.token);
      this.loadPeople();
    });  
  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  loadPeople(){
      console.log(this.token);
      
       this.peopleService.loadData(this.token).then(data => {
          this.people = data;
          this.base64Image=data['photo'];
       });
   }

   updateUser(){
      this.showLoading();

      this.peopleService.updateUser(this.registerCredentials, this.token, this.base64Image).then((result) => {
              this.loading.dismiss();
          }, (err) => {
              this.showError("Something went wrong,try again!");
              console.log(err);            
      });
   }

   showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

   showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });

    let alert = this.alertCtrl.create({
      title: 'Opps',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
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
