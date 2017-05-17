import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the PeopleService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.

*/
@Injectable()
export class PeopleService {

  data: any;

  constructor(public http: Http) {
    console.log('Hello PeopleService Provider');
  }

  loadData(token) {
     console.log('LoadData'+token)
    let headers = new Headers();
     headers.append('token', token);
    let options = new RequestOptions({ headers: headers });
    
    
    return new Promise(resolve => {
      this.http.get('http://192.168.43.105:3000/user/get', options, )
        .map(res => res.json())
        .subscribe(data => {
          this.data =  data;
          resolve(this.data);
        });
    });
  }

  public updateUser(details, token, img){

     let headers = new Headers();
     headers.append('Content-Type','application/x-www-form-urlencoded');
     headers.append('token', token);
     let options = new RequestOptions({ headers: headers });

     let body = 'nom='+ details.nom+
                '&prenom='+details.prenom+
                '&photo=' +img;

     console.log(headers);
     console.log(body);
     return new Promise((resolve, reject) => {
        console.log(details);
        this.http.post('http://192.168.43.105:3000/user/update', body , options )
          .subscribe(res => {
            let data = res.json();
            resolve(data);
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
    });
 
  }//createAccount

}



