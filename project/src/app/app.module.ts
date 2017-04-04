import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SearchPage } from '../pages/search/search';
import { ProfilePage } from '../pages/profile/profile';
import { RestoPage } from '../pages/resto/resto';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { NotePage } from '../pages/note/note';
import { MyRestosPage } from '../pages/my-restos/my-restos';
import { NewRestoPage } from '../pages/new-resto/new-resto';
import { AutocompletePage } from '../pages/autocomplete/autocomplete';

import { AuthService } from '../providers/auth-service';
import { Note } from '../providers/note';
import { SearchService } from '../providers/search-service';
import { PeopleService } from '../providers/people-service';
import { ConnectivityService } from '../providers/connectivity-service';


import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Http, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';

function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}


@NgModule({
  declarations: [
    MyApp,
    SearchPage,
    SignupPage,
    LoginPage,
    ProfilePage,
    RestoPage,
    MyRestosPage,
    NotePage,
    NewRestoPage,
    AutocompletePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SearchPage,
    LoginPage,
    SignupPage,
    ProfilePage,
    RestoPage,
    MyRestosPage,
    NotePage,
    NewRestoPage,
    AutocompletePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage,  ConnectivityService, SearchService,  AuthService, Note , PeopleService, 
      {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
      }]
})
export class AppModule {}
