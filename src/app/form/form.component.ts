import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {StorageService} from '../services/storage.service';
import { Router ,NavigationExtras} from '@angular/router';
import { ResultComponent } from '../result/result.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  keyword:string = "";
  categories:string[] = ["All Categories", "Art","Baby","Books","Clothing, Shoes & Accessories","Computers/Tablets & Networking","Health & Beauty", "Music", "Video Games & Consoles"];
  categoryId = new Map();
  category:string = "All Categories";
  new:boolean = false;
  used:boolean = false;
  unspecified:boolean = false;
  localPickUp:boolean = false;
  freeShipping:boolean = false;
  distance:string = "";
  from:string = "current";
  zipCode:string = "";
  currentZipCode:string = "";


  productsInfo:string = "{}";
  selectResult:boolean = true;

  disableSearch:boolean = true;

  keywordErr:boolean = false;
  zipErr:boolean = false;

  hideProgress:boolean=true;

  @ViewChild('result') result;

  constructor(public http:HttpClient, public storage:StorageService, private router:Router) { }

  ngOnInit() {
    this.initCategoryId();
    try {
      this.http.get('http://ip-api.com/json/?fields=zip').subscribe((response)=>{
        this.currentZipCode = response['zip'];
        console.log("zip:"+this.currentZipCode);
      })
    } catch (error) {
      this.currentZipCode = "";
    }
    
  }

  ngDoCheck(): void {
    this.validate();
    
  }

  validate(){
    this.disableSearch = false;
    if(this.currentZipCode=="") this.disableSearch=true;
    if(this.keyword=="") this.disableSearch=true;
    if(this.from=="other"&&this.zipCode=="") this.disableSearch=true;
    if(this.from=="other"&&this.zipCode!=""){
      var patt = /^\d{5}(?:[-\s]\d{4})?$/;
      if(!patt.test(this.zipCode)){
        this.disableSearch=true;
      }
    }
    if(this.keyword!="") this.keywordErr=false;
    if(this.from=="current") this.zipErr=false;
    if(this.from=="other"&&this.zipCode!="") this.zipErr=false;
  }

  initCategoryId(){
    this.categoryId.set("Art",550);
    this.categoryId.set("Baby",2984);
    this.categoryId.set("Books",267);
    this.categoryId.set("Clothing, Shoes & Accessories",11450);
    this.categoryId.set("Computers/Tablets & Networking",58058);
    this.categoryId.set("Health & Beauty",26395);
    this.categoryId.set("Music",11233);
    this.categoryId.set("Video Games & Consoles",1249);
  }

  onClear(){
    this.keyword = "";
    this.category = "All Categories";
    this.new = false;
    this.used = false;
    this.unspecified = false;
    this.localPickUp = false;
    this.freeShipping = false;
    this.distance = "";
    this.from = "current";
    this.zipCode="";
    this.result.update("{}");
    this.selectResult = true;
  }

  onSubmit(){
    this.hideProgress = false;
    this.selectResult=true;
    this.result.update("{}");
    var api = this.buildFindingAPI();
    console.log(api);
    const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
    var url = 'http://csci571-hw8-bocongzh.us-east-2.elasticbeanstalk.com/search';
    var req = {"api":api};
    this.http.post(url,req,httpOptions).subscribe((response:string)=>{
      this.productsInfo = response;
      this.result.update(response);
    })
    //this.selectResult=true;
    setTimeout(()=>{
      this.hideProgress=true;
    },300);
  }

  buildFindingAPI(){
    var api = "http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=BocongZh-hw6-PRD-216e2f149-25c874c3&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=50";
    api += "&keywords=" + this.keyword;
    if(this.category!="All Categories"){
      api += `&categoryId=${this.categoryId.get(this.category)}`;
    }
    var index:number  = 0;
    if(this.from=="current"){
      api += `&buyerPostalCode=${this.currentZipCode}`;
    } else{
      api += `&buyerPostalCode=${this.zipCode}`;
    }
    if(this.distance==""){
      api += `&itemFilter(${index}).name=MaxDistance&itemFilter(${index}).value=10`
    } else {
      api += `&itemFilter(${index}).name=MaxDistance&itemFilter(${index}).value=${this.distance}`;
    }
    index++;
    if(this.new||this.used||this.unspecified){
      api += `&itemFilter(${index}).name=Condition`;
      if(this.new){
        api += `&itemFilter(${index}).value=New`;
      }
      if(this.used){
        api += `&itemFilter(${index}).value=Used`;
      }
      if(this.unspecified){
        api += `&itemFilter(${index}).value=Unspecified`;
      }
      index++;
    }
    if(this.localPickUp){
      api += `&itemFilter(${index}).name=LocalPickupOnly&itemFilter(${index}).value=true`;
      index++;
    }
    if(this.freeShipping){
      api += `&itemFilter(${index}).name=FreeShippingOnly&itemFilter(${index}).value=true`;
      index++;
    }
    api += `&itemFilter(${index}).name=HideDuplicateItems&itemFilter(${index}).value=true`;
    index++;
    api += `&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo`
    return api;
  }

  onClickResult(){
    this.selectResult = true;
    console.log(this.result);
  }

  onClickWishList(){
    this.selectResult = false;
  }

  onBlurKeyword(){
    console.log("blur");
    if(this.keyword=="") this.keywordErr = true;
  }

  onBlurZipcode(){
    if(this.from=="other"&&this.zipCode==""){
      this.zipErr = true;
    }
  }

}
