import { Component } from '@angular/core';
import { NavController, NavParams, AlertController  } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Note } from '../../providers/note';

@Component({
  selector: 'page-note',
  templateUrl: 'note.html'
})
export class NotePage {

  public one = false;
  token = '';
  notes: any;

  constructor(public navCtrl: NavController, public navParams: NavParams , public notesService: Note, public storage: Storage, public alertCtrl: AlertController) {

  	this.storage.get('token').then((value) => {
      this.token = value;
      this.loadNotes()
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotePage');
  }

  loadNotes(){
       this.notesService.loadMyNotes(this.token).then(data => {
          this.notes = data;
          if(this.notes.length==0){
            this.notes= null;
            this.one = true; 
          }
       });
   }

  deleteNote(id){
    this.notesService.deleteNote(this.token, id).then(data => {
        console.log(data["status"]==200);
        if(data["response"]=="Note was correctly deleted"){
          this.notes = null;
          this.loadNotes();
          this.showAlert()
        }

     });  
     
  }

  showConfirm(id) {
    let confirm = this.alertCtrl.create({
      title: 'Warning',
      message: 'Do you really want to delete this note?',
      buttons: [
        {
          text: 'Accept',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            this.deleteNote(id);
          }
        }
      ]
    });
    confirm.present();
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Success!',
      subTitle: 'Your note was succesfully deleted',
      buttons: ['OK']
    });
    alert.present();
  }


}
