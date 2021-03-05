import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  loggedInUser: any;
  loggedInUserChange: Subject<any> = new Subject();

  data = {};
  constructor() {
    this.loggedInUserChange.subscribe((value) => {
      this.loggedInUser = value;
    });
  }
  getProperty(key: string) {
    if (this.data[key]) {
      return this.data[key];
    } else {
      return null;
    }
  }
  setProperty(key: string, value: any) {
    this.data[key] = value;
  }
  setLoggedInUserDetails(value) {
    this.loggedInUserChange.next(value);
  }
  removeUserInfo() {
    this.loggedInUserChange.unsubscribe();
  }
}
