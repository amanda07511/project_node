import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {
 
  //data: String;
  access: string;
  token: string;
  post: any;
  img = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAFwAXAMBIgACEQEDEQH/xAAaAAEBAQEBAQEAAAAAAAAAAAAABgQFAQID/8QAMRAAAgEEAAMFBAsAAAAAAAAAAAECAwQFERIhMRMiUVJxQWGRoQYUFTIzQnKBwdHh/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAIDAf/EABkRAQEAAwEAAAAAAAAAAAAAAAABAhExEv/aAAwDAQACEQMRAD8AuQAaMgAAAD2EJT+5GUv0rYHgPqdOdP8AEhKO/MtHyAAAAAAAAAANmIpqrkKMZLaTcvggOpisVCFNVrqClUktqMlyj/p14xUVqKSXgj0GbV8VaUK1N06sVKL6pk1lcc7OSnT3KjJ8t/lfgVBnyFJVbKvBrrBteq6HZdOWbR4ALZgAAAAAb8HKMcjDietppepgOr9HXH65NSS32e036o5eOzqjABDQMuTn2ePryT0+BpfvyNRlycISsa/aR2owbXqlyAkQAaMgAAAAAPulUnRqKpSk4zj0aPgAWlCp2lGnPzRTP0MOF4vs2jxb9ut+G3o3GbUJ/O31R1ZWkWlTWuLXVvqUBH5BNX1xxb32j6+p2JyZwAWgAAAJNvSW2epOTSS229JFTjcfTs6SbSdZrvS8PcjlunZNuJb4i7r6bgqcfGfL5HTtcHQptSrzdVr2dEdYE7X5jxJRSSSSXRI9AOOhkvrCjeR764Z65TXVGsAS11ibq3bcY9rDzQ/owFwZbuwt7qL7WC4vOuTRXpNxSINF9aVLOu6c+afOMkuTRnKQ2YeHHkqCa3pt/BFYTP0fW8ivdB/wUxFXjwABxQAAAAAAADnZ6jGpYSm13qbTT+RMFblUnjrjfkZJFTiMuv/Z';


  constructor(public http: Http, public storage: Storage) {
    //Load token if exists
        this.storage.get('token').then((value) => {
            this.token = value;
           
        });  
  }

  public login(credentials) {
     let headers = new Headers();
     headers.append('Content-Type','application/x-www-form-urlencoded');
     let options = new RequestOptions({ headers: headers });

     let body = 'email='+ credentials.email+'&password='+credentials.password;


    
      return new Promise((resolve, reject) => {
         console.log(credentials);
        this.http.post('http://localhost:3000/user/login', body ,options)
          .subscribe(res => {
            let data = res.json();
            if(data.status==500)
              reject();
            this.token = data.token;
            this.storage.set('token', data.token);
            resolve(data);
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
 
    });

  }//login

  public createAccount(details){

     let headers = new Headers();
     headers.append('Content-Type','application/x-www-form-urlencoded');
     let options = new RequestOptions({ headers: headers });

     let body = 'nom='+ details.nom+
                '&prenom='+details.prenom+
                '&email='+ details.email+
                '&password='+details.password+
                '&photo=' + this.img;


     return new Promise((resolve, reject) => {
        console.log(details);
        this.http.post('http://localhost:3000/user/signup', body , options )
          .subscribe(res => {
            let data = res.json();
            this.token = data.token;
            this.storage.set('token', data.token);
            resolve(data);
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
    });
 
  }//createAccount

  public logout() {
    return Observable.create(observer => {
      this.storage.set('token', '');
      observer.next(true);
      observer.complete();
    });
  }//Logout

}
