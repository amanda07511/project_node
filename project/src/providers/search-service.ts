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
  url = "http://localhost:3000/";
  item : any; 

  constructor(public http: Http) {
    console.log('Hello SearchService Provider');
    this.item="";
  }

  load(searchTerm) {
    
    
	 console.log(this.url+'resto/get/'+searchTerm);
    
    return new Promise(resolve => {
      this.http.get(this.url+'resto/get/'+searchTerm)
        .map(res => res.json())
        .subscribe(data => {
          this.data =  data;
          resolve(this.data);
        });
    });
  }

  loadDetails(Id) {
    
   console.log(this.url+'resto/getId/'+Id);
    
    return new Promise(resolve => {
      this.http.get(this.url+'resto/getId/'+Id)
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
      this.http.get(this.url+'resto/')
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
      this.http.get(this.url+'resto/get', options,)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data =  data;
          resolve(this.data);
        });
    });
  }

  createResto(token,details,lat,lng,img){
    let headers = new Headers();
      headers.append('token',token);
      headers.append('Content-Type','application/x-www-form-urlencoded');
     let options = new RequestOptions({ headers: headers });

     let body = 'nom='+details.nom+'&type='+details.type+'&lat='+lat+'&lng='+lng+'&img='+img;
    
      return new Promise((resolve, reject) => {
         
        this.http.post(this.url+'resto/create', body ,options)
          .subscribe(res => {
            let data = res.json();
            resolve(data);
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
 
    });
  }

}
