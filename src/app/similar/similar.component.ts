import { Component, OnInit, Input } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-similar',
  templateUrl: './similar.component.html',
  styleUrls: ['./similar.component.css']
})
export class SimilarComponent implements OnInit {

  @Input() itemId:string;
  errorInfo:string="";

  items:any[];
  displayItems:any[];
  orderItems:any[];

  show:string = "Show More";

  orderType:string = "Default";
  orderSeq:string = "Ascending";

  constructor(public http:HttpClient) { }

  ngOnInit() {
    var api = `http://svcs.ebay.com/MerchandisingService?OPERATION-NAME=getSimilarItems&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0&CONSUMER-ID=BocongZh-hw6-PRD-216e2f149-25c874c3&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&itemId=${this.itemId}&maxResults=20`;
      const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
      var url = 'http://csci571-hw8-bocongzh.us-east-2.elasticbeanstalk.com/similar';
      var req = {"api":api};
      this.http.post(url,req,httpOptions).subscribe((response:string)=>{
        var jsonObj = JSON.parse(response);
        this.initTable(jsonObj);
        
      })
  }

  initTable(jsonObj){
    if(jsonObj.getSimilarItemsResponse.ack!="Success"){
      this.errorInfo = "No Records."
    } else {
      var items = jsonObj.getSimilarItemsResponse.itemRecommendations.item;
      if(items==undefined||items.length==0){
        this.errorInfo = "No Records."
      }else{
        this.items = [];
        this.displayItems = [];
        this.orderItems = [];
        for(var i = 0; i < items.length; i++){
          var tmp = [];
          tmp.push(items[i].imageURL);
          tmp.push(items[i].title);
          tmp.push(items[i].viewItemURL);
          tmp.push(items[i].buyItNowPrice.__value__);
          tmp.push(items[i].shippingCost.__value__);
          tmp.push(this.getLeftDay(items[i].timeLeft));
          this.items.push(tmp);
        }
        console.log(this.items);
        for(var i = 0; i < items.length; i++){
          this.orderItems.push(this.items[i]);
        }
        for(var i = 0; i < 5; i++){
          if(i<this.items.length){
            this.displayItems.push(this.items[i]);
          }
        }
      }
    }
  }

  getLeftDay(dayLeft:string){
    var start = dayLeft.indexOf('P')+1;
    var end = dayLeft.indexOf('D');
    var day = dayLeft.substring(start,end);
    return day;
  }

  onClickShow(){
    if(this.show=="Show Less"){
      this.show = "Show More";
      this.getLessDisplayItems()
    } else {
      this.show = "Show Less";
      this.getMoreDisplayItems();
      
    }
  }
  

  onChangeOrderType(){
    console.log(this.orderType);
    if(this.orderType == "Default"){
      for(var i=0; i < this.items.length; i++){
        this.orderItems[i] = this.items[i];
      }
    } else if(this.orderType=="Product Name"){
      this.order(1, this.orderSeq);
    } else if(this.orderType=="Price"){
      this.order(3, this.orderSeq);
    } else if(this.orderType=="Shipping Cost"){
      this.order(4, this.orderSeq);
    } else {
      this.order(5,this.orderSeq);
    }
    this.getLessDisplayItems();
    this.show = "Show More";
  }

  onChangeOrderSeq(){
    this.reverse();
    this.getLessDisplayItems();
    this.show = "Show More";
  }

  getLessDisplayItems(){
    this.displayItems = [];
      for(var i = 0; i < 5; i++){
        if(i<this.orderItems.length){
          this.displayItems.push(this.orderItems[i]);
        }
      }
  }

  getMoreDisplayItems(){
    this.displayItems = [];
    this.displayItems = this.orderItems;
  }

  order(index, seq){
    for(var i = 0; i < this.orderItems.length-1; i++){
      for(var j = 0; j < this.orderItems.length-1-i; j++){
        if(index==1){
          if(this.orderItems[j][index] > this.orderItems[j+1][index]){
            var tmp = this.orderItems[j];
            this.orderItems[j] = this.orderItems[j+1];
            this.orderItems[j+1] = tmp;
          }
        }else {
          if(this.orderItems[j][index] - this.orderItems[j+1][index] > 0){
            var tmp = this.orderItems[j];
            this.orderItems[j] = this.orderItems[j+1];
            this.orderItems[j+1] = tmp;
          }
        }
        
      }
    }
    if(seq=="Descending"){
      this.reverse();
    }
  }

  reverse(){
    console.log('reverse');
    var length = this.orderItems.length;
    for(var i = 0; i < length/2; i++){
      var tmp = this.orderItems[i];
      this.orderItems[i] = this.orderItems[length-1-i];
      this.orderItems[length-1-i] = tmp;
    }
  }


}
