import { Component, OnInit } from '@angular/core';
import {StorageService} from '../services/storage.service';
import { createInjectable } from '@angular/compiler/src/core';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  list:any[]=[];
  displayItems:any[]=[];

  titles:string[]=["#","Image","Title","Price","Shipping","Seller","Wish List"];

  constructor(public storage:StorageService) {
    //storage.clearAll();
    this.list = storage.getAllItems();
  }

  ngOnInit() {
    console.log(this.list);
  }

  ngDoCheck(): void {
    this.list = this.storage.getAllItems();
    this.createTable();
    
  }

  createTable(){
    this.displayItems = [];
    for(var i = 0; i < this.list.length; i++){
      var tmp =[];
      var jsonObj = JSON.parse(this.list[i]);
      tmp.push(jsonObj.img);
      tmp.push(jsonObj.title);
      tmp.push(jsonObj.price);
      tmp.push(jsonObj.ship);
      tmp.push(jsonObj.seller);
      this.displayItems.push(tmp);
    }
  }

  onClickWishList(data){

  }

}
