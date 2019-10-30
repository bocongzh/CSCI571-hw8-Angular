import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  set(key:string, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  get(key:string){
    return JSON.parse(localStorage.getItem(key));
  }

  getAllItems(){
    var tmp = [];
    for(var i = 0; i < localStorage.length; i++){
      tmp.push(localStorage.getItem(localStorage.key(i)));
    }
    return tmp;
  }

  clearAll(){
    localStorage.clear();
  }

  
}
