import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { LoginPage } from '../pages/login/login';
import { SearchPage } from '../pages/search/search';
import { ProfilePage } from '../pages/profile/profile';
import { MyRestosPage } from '../pages/my-restos/my-restos';
import { NotePage } from '../pages/note/note';




@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  
  rootPage = LoginPage;

  pages: Array<{title: string, icon: string ,component: any}>;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    this.pages = [
      { title: 'Home', icon: 'home', component: SearchPage },
      { title: 'Account', icon: 'md-create', component: ProfilePage },
      { title: 'My Restaurants', icon: 'ios-restaurant', component: MyRestosPage },
      { title: 'My Notes', icon: 'ios-chatbubbles', component: NotePage }
    ];

  }

   openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
