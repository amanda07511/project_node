import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Geocoder, GeocoderRequest } from 'ionic-native';
import { Storage } from '@ionic/storage';

import { SearchService } from '../../providers/search-service';
import { Note } from '../../providers/note';

declare var google;

@Component({
  selector: 'page-resto',
  templateUrl: 'resto.html'
})
export class RestoPage {

  public one = false;

  testRadioOpen: boolean;
  items: any;
  notes: any;
  newNote;
  message;
	id;
  token = '';


  constructor(public navCtrl: NavController, public navParams: NavParams , public searchService: SearchService, public notesService: Note , public alertCtrl: AlertController, public storage: Storage ) {
  	this.id = navParams.data.idResto;
    this.loadResto();
    this.loadNotes();

    this.storage.get('token').then((value) => {
      this.token = value;
    });

  }

  loadResto(){
       this.searchService.loadDetails(this.id).then(data => {
          this.items = data;
       });
   }

   loadNotes(){
       this.notesService.loadNotes(this.id).then(data => {
          this.notes = data;
          console.log(data);
          if(this.notes.length==0){
            this.notes= null;
            this.one = true; 
          }
       });
   }

   createNoTe(){
      this.notesService.createNote(this.token,this.newNote,this.message,this.id).then((result) => {
            console.log(result);
        }, (err) => {
            console.log(err);
        });
   }

   getDirection(){
     let location = new google.maps.LatLng (13123.3,-243.98);
     let req: GeocoderRequest = { position: location }
        Geocoder.geocode(req).then((results)=>{
          console.log(results)
     });
   }

   showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Opinion',
      message: "Give us your opinion of this restaurante",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
            this.newNote = null;
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.message = data.title;
            console.log(data.title);
            this.createNoTe();
          }
        }
      ]
    });
    prompt.present();
  }

  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Note');

    alert.addInput({
      type: 'radio',
      label: '1.0',
      value: '1.0',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: '2.0',
      value: '2.0'
    });

    alert.addInput({
      type: 'radio',
      label: '3.0',
      value: '3.0'
    });

    alert.addInput({
      type: 'radio',
      label: '4.0',
      value: '4.0'
    });

    alert.addInput({
      type: 'radio',
      label: '5.0',
      value: '5.0'
    });

    alert.addInput({
      type: 'radio',
      label: '6.0',
      value: '6.0'
    });

    alert.addInput({
      type: 'radio',
      label: '7.0',
      value: '7.0'
    });

    alert.addInput({
      type: 'radio',
      label: '8.0',
      value: '8.0'
    });

    alert.addInput({
      type: 'radio',
      label: '9.0',
      value: '9.0'
    });

    alert.addInput({
      type: 'radio',
      label: '10.0',
      value: '10.0'
    });



    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.testRadioOpen = false;
        this.newNote = data;
        this.showPrompt()
      }
    });
    alert.present();
  }

}
