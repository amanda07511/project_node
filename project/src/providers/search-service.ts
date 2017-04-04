import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions  } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the SearchService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SearchService {

  
  data: any;
  items: any;
  url: any;
  item : any; 

  constructor(public http: Http) {
    console.log('Hello SearchService Provider');
    this.item="";
  }

  load(searchTerm) {
    
    
	 console.log('http://localhost:3000/resto/get/'+searchTerm);
    
    return new Promise(resolve => {
      this.http.get('http://localhost:3000/resto/get/'+searchTerm)
        .map(res => res.json())
        .subscribe(data => {
          this.data =  data;
          resolve(this.data);
        });
    });
  }

  loadDetails(Id) {
    
   console.log('http://localhost:3000/resto/getId/'+Id);
    
    return new Promise(resolve => {
      this.http.get('http://localhost:3000/resto/getId/'+Id)
        .map(res => res.json())
        .subscribe(data => {
          this.data =  data;
          resolve(this.data);
        });
    });
  }

  loadAll() {

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get('http://localhost:3000/resto/')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data =  data;
          resolve(this.data);
        });
    });
  }

  loadMy(token) {
    let headers = new Headers();
     headers.append('token', token);
    let options = new RequestOptions({ headers: headers });

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get('http://localhost:3000/resto/get', options,)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data =  data;
          resolve(this.data);
        });
    });
  }



}
