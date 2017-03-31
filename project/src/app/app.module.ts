import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SearchPage } from '../pages/search/search';
import { ProfilePage } from '../pages/profile/profile';
import { RestoPage } from '../pages/resto/resto';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';


import { AuthService } from '../providers/auth-service';
import { Note } from '../providers/note';
import { SearchService } from '../providers/search-service';
import { PeopleService } from '../providers/people-service';
import { PostData } from '../providers/post-data';
import { ConnectivityService } from '../providers/connectivity-service';



import { LastPage } from '../pages/last/last';
import { Profile} from '../pages/last/last';
import { MapPage } from '../pages/map/map';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Http, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';

function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}




@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    LastPage,
    MapPage,
    SearchPage,
    SignupPage,
    LoginPage,
    Profile,
    ProfilePage,
    RestoPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    LastPage,
    MapPage,
    SearchPage,
    LoginPage,
    SignupPage,
    Profile,
    ProfilePage,
    RestoPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage,  ConnectivityService, SearchService, PostData, AuthService, Note , PeopleService, 
      {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
      }]
})
export class AppModule {}
