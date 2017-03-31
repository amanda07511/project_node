import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the PeopleService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.

*/
@Injectable()
export class LastService {

  data: any;
  lat: any;


  constructor(public http: Http) {
    console.log('Hello PeopleService Provider');
    this.lat =[];
  }

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get('http://checkin-api.dev.cap-liberte.com/checkin')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data =  data;
          resolve(this.data);
        });
    });
  }

  loadLat() {
    if (this.lat) {
      // already loaded data
      return Promise.resolve(this.lat);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get('http://checkin-api.dev.cap-liberte.com/checkin')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.lat =  data.lat;
          console.log("Information of service loadLat "+this.lat);
          resolve(this.lat);
        });
    });
  }

}
