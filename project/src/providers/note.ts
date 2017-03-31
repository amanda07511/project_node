import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Note provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Note {

  data: any;

  constructor(public http: Http) {
    console.log('Hello Note Provider');
  }

  loadNotes(Id) {
  	console.log('http://localhost:3000/notes/getId/'+Id);

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get('http://localhost:3000/notes/get/'+Id)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data =  data;
          resolve(this.data);
        });
    });
  }

  createNote(token,note,message,idResto){
    let headers = new Headers();
      headers.append('token',token);
      headers.append('Content-Type','application/x-www-form-urlencoded');
     let options = new RequestOptions({ headers: headers });

     let body = 'note='+note+'&message='+message+'&resto='+idResto;
    
      return new Promise((resolve, reject) => {
         
        this.http.post('http://localhost:3000/notes/suma', body ,options)
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
