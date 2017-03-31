import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service';
import { NavController, AlertController, LoadingController, Loading  } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  loading: Loading;
  registerCredentials = {nom: '', prenom: '' , email: '', password: '' };

  constructor(public nav: NavController,  private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {}

  public singup(){
  	
  	this.showLoading();

    this.auth.createAccount(this.registerCredentials).then((result) => {
            this.loading.dismiss();
            console.log(result);
            this.nav.setRoot(TabsPage);
        }, (err) => {
            this.showError("Something went wrong,try again!");
            console.log(err);            
    });
    
  }//sinngup

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


}
