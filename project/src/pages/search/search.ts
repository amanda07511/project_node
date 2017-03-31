import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, App  } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { JwtHelper } from 'angular2-jwt';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/debounceTime'

import { SearchService } from '../../providers/search-service';
import { AuthService } from '../../providers/auth-service';
import { RestoPage } from '../resto/resto';
import { LoginPage } from '../login/login';

/*
  Generated class for the Search page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  
  public one = false;
  public all = false;

  searchTerm: string = '';
  people: any;
  items: any;
  searchControl: FormControl;
  searching: any = false;
  token = '';

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App, private auth: AuthService, public searchService: SearchService , public toastCtrl: ToastController, public storage: Storage) {
  	
    this.loadPeople();
    
    /*this.storage.get('token').then((value) => {
      this.token = value;
      console.log(value);
      console.log(this.jwtHelper.decodeToken(value).nom);
    });*/
    
    this.searchControl = new FormControl();
    
    //this.items.user.picture ="assets/img/user.jpg";
  }

  ionViewDidLoad() {
    
    this.setFilteredItems();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
 
            this.searching = false;
            this.setFilteredItems();
            
     });
  }

    onSearchInput(ev: any){
        this.searching = true;
        this.searchTerm = ev.target.value;

    }

  setFilteredItems() {
  	this.items=null;
 	  
     if(this.searchTerm!=''){
        this.searchService.load(this.searchTerm).then(data => {
          this.items = data;
          if(data['status']==500){
            this.items = null;
            this.presentToast()
          }
        });
        this.one = true;
        this.all = false;

     }else{
        this.one = false;
        this.all = true;  
     }
    
   }
   loadPeople(){
       this.searchService.loadAll().then(data => {
          this.people = data;
       });
   }

   presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Theres not coincidences',
      duration: 1000,
      position: 'middle'
    });
    toast.present();
  }

  openNavDetailsPage(id) {
    this.navCtrl.push(RestoPage, { idResto: id });
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
       this.app.getRootNav().setRoot(LoginPage);
    });
  }

}
