import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { zip } from 'rxjs';
import {StorageService} from '../services/storage.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  titles:string[] = ["#","Image","Title","Price","Shipping","Zip","Seller","Wish List"];

  data:string = "{}";
  jsonObj:any;

  items:any[]=[];

  success:boolean = false;
  errorInfo:string = "";

  icon:string = "add_shopping_cart";

  displayItems:any[]=[];
  pages:number[]=[1];
  selectPage:number=1;

  showDetail:boolean=false;

  selectedId:number=-1;

  @ViewChild('detail') detail;

  constructor(public storage: StorageService, public http:HttpClient) {
    console.log('construct');
  }

  update(data:string){
    this.data = data;
    this.selectPage = 1;
    this.showDetail=false;
    this.errorInfo='';
    this.selectedId=-1;
  }

  ngDoCheck() {
    this.updateTable();
  }

  ngOnInit() {
    console.log('init');
  }

  updateTable(){
    this.items = [];
    this.jsonObj = JSON.parse(this.data);
    if(this.jsonObj.findItemsAdvancedResponse!=undefined){
      this.success = this.jsonObj.findItemsAdvancedResponse[0].ack[0]=='Success';
      if(this.success){
        var items = this.jsonObj.findItemsAdvancedResponse[0].searchResult[0].item;
        if(items==undefined||items.length==0){
          this.errorInfo = "No Records.";
        } else {
          this.parseData(items);
          this.createDisplayItems();
        }
      } else{
        this.errorInfo = this.jsonObj.findItemsAdvancedResponse[0].errorMessage[0].error[0].message[0];
      }
    }
  }

  createDisplayItems(){
    var pages = this.items.length/10+1;
    this.pages = [1];
    for(var i = 2; i < pages; i++){
      this.pages.push(i);
    }
    this.displayItems = [];
    for(var i = 0; i < 10; i++){
      var index = (this.selectPage-1)*10+i;
      if(index < this.items.length){
        this.displayItems.push(this.items[index])
      }
    }
  }

  parseData(items){
    for(var i = 0; i < items.length; i++){
      var itemInfo:any[] = [];
      var currentItem = items[i];
      itemInfo.push(i+1);
      var image = currentItem.galleryURL;
      if(image==undefined){
        itemInfo.push("N/A");
      }else{
        itemInfo.push(image[0]);
      }
      itemInfo.push(currentItem.title[0]);
      itemInfo.push("$"+currentItem.sellingStatus[0].currentPrice[0].__value__);
      var shipping = currentItem.shippingInfo;
      if(shipping==undefined){
        itemInfo.push("N/A");
      } else {
        var shippingCostInfo = shipping[0].shippingServiceCost;
        if(shippingCostInfo==undefined){
          itemInfo.push("N/A");
        }else{
          var shipCost = shippingCostInfo[0].__value__;
          if(shipCost==undefined){
            itemInfo.push("N/A");
          } else if(shipCost=="0.0") {
            itemInfo.push("Free Shipping");
          } else {
            itemInfo.push("$"+shipCost);
          }
        }
      }
      var zipCode = currentItem.postalCode;
      if(zipCode==undefined){
        itemInfo.push("N/A");
      } else {
        itemInfo.push(zipCode);
      }
      var sellerInfo = currentItem.sellerInfo;
      if(sellerInfo==undefined){
        itemInfo.push("N/A");
      } else {
        var sellerName = sellerInfo[0].sellerUserName;
        if(sellerName==undefined){
          itemInfo.push("N/A");
        }else {
          itemInfo.push(sellerName[0]);
        }
      }
 
      this.items.push(itemInfo);
    }
  }

  onClickWishList(data){
    var index = data[0];
    var item = this.jsonObj.findItemsAdvancedResponse[0].searchResult[0].item[index-1];
    var itemId = item.itemId[0];
    var storageInfo = {
      img:data[1],
      title:data[2],
      price:data[3],
      ship:data[4],
      seller:data[6]
    }
    this.storage.set(itemId,storageInfo);
  }


  onClickPage(item){
    this.selectPage = item;
  }

  onClickPrevious(){
    this.selectPage--;
  }

  onClickNext(){
    this.selectPage++;
  }

  onClickTitle(data){
    this.selectedId = data[0];
    var item = this.jsonObj.findItemsAdvancedResponse[0].searchResult[0].item[data[0]-1];
    console.log(item);
    var itemId = item.itemId[0];
    var shippingInfo = item.shippingInfo;
    var sellerInfo = item.sellerInfo;
    var returnAccept = item.returnsAccepted;
    var storeInfo = item.storeInfo;
    var viewItemURL = item.viewItemURL;
    //var api = `http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=BocongZh-hw6-PRD-216e2f149-25c874c3&siteid=0&version=967&itemID=${itemId}&IncludeSelector=Description,Details,ItemSpecifics`;
    //const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
    // var url = 'http://localhost:8081/details'
    // var req = {"api":api};
    // this.http.post(url,req,httpOptions).subscribe((response:string)=>{
    //   this.detail.update(response, shippingInfo, sellerInfo, storeInfo, returnAccept);
    // })
    var url = `http://csci571-hw8-bocongzh.us-east-2.elasticbeanstalk.com/getDetails?itemId=${itemId}`;
    this.http.get(url).subscribe((response:string)=>{
      this.detail.update(response, shippingInfo, sellerInfo, storeInfo, returnAccept, viewItemURL);
    })
    
    this.showDetail = true;
  }

  showResult(){
    this.showDetail = false;
  }

  onClickDetail(){
    var item = this.jsonObj.findItemsAdvancedResponse[0].searchResult[0].item[this.selectedId-1];
    var itemId = item.itemId[0];
    var shippingInfo = item.shippingInfo;
    var sellerInfo = item.sellerInfo;
    var returnAccept = item.returnsAccepted;
    var storeInfo = item.storeInfo;
    var viewItemURL = item.viewItemURL;
    var url = `http://csci571-hw8-bocongzh.us-east-2.elasticbeanstalk.com/getDetails?itemId=${itemId}`;
    this.http.get(url).subscribe((response:string)=>{
      this.detail.update(response, shippingInfo, sellerInfo, storeInfo, returnAccept, viewItemURL);
    })
    
    this.showDetail = true;
  }

}
