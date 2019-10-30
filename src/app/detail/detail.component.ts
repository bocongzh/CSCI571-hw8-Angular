import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TypeModifier } from '@angular/compiler/src/output/output_ast';
import { PathLocationStrategy } from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  @Input() result:any;

  shopcart:string = "add_shopping_cart";

  data:string = "{}";
  sellerInfo:any;
  shippingInfo:any;
  returnAccept:string;
  storeInfo:any;

  title:string = "";
  itemId:string = "";
  
  productItems:any[] = [];
  shippingItems:any[] = [];
  sellerItems:any[] = [];

  images:string[] = [];

  tab:string = "Product"

  sellerTitle:string;

  facebookShare:string = "";
  viewItemURL:string = "";

  constructor(public http:HttpClient) { }

  ngOnInit() {
    
  }

  update(data, shippingInfo, sellerInfo, storeInfo, returnAccept, viewItemURL){
    this.data = data;
    if(shippingInfo!=undefined){
      this.shippingInfo = shippingInfo[0];
    }
    if(sellerInfo!=undefined){
      this.sellerInfo = sellerInfo[0];
    }
    if(returnAccept!=undefined){
      this.returnAccept = returnAccept[0];
    }
    if(storeInfo!=undefined){
      this.storeInfo = storeInfo[0];
    }
    if(viewItemURL!=undefined){
      this.viewItemURL = viewItemURL[0];
    }
    
  }

  ngDoCheck(){
    this.updateTable();
  }

  onClickTab(tab){
    this.tab = tab;
  }

  onClickList(){
    this.result.showResult();
  }

  updateTable(){
    this.productItems = [];
    this.shippingItems = [];
    this.sellerItems = [];
    this.images = [];
    var jsonObj = JSON.parse(this.data);
    var item = jsonObj.Item;
    if(item!=undefined){
      this.getProductInfo(item);
      this.getShippingInfo(item);
      this.getSellerInfo();

    }
  }

  getShippingInfo(item){
    var cost = this.shippingInfo.shippingServiceCost;
    if(cost!=undefined){
      var tmp = ["Shipping Cost"];
      if(cost[0].__value__=="0.0"){
        tmp.push("Free Shipping");
      } else {
        tmp.push("$"+cost[0].__value__);
      }
      this.shippingItems.push(tmp);
    }

    var location = this.shippingInfo.shipToLocations;
    if(location!=undefined){
      var tmp = ["Shipping Locations"];
      tmp.push(location[0]);
      this.shippingItems.push(tmp);
    }

    var handleTime = this.shippingInfo.handlingTime;
    if(handleTime!=undefined){
      var tmp = ["Handling Time"];
      if(handleTime[0]=="0"||handleTime[0]=="1"){
        tmp.push(handleTime[0]+" Day");
      }else{
        tmp.push(handleTime[0]+" Days");
      }
      this.shippingItems.push(tmp);
    }

    var expeditedShipping = this.shippingInfo.expeditedShipping;
    if(expeditedShipping!=undefined){
      var tmp = ["Expedited Shipping"];
      tmp.push(expeditedShipping[0]);
      this.shippingItems.push(tmp);
    }

    var oneDayShipping = this.shippingInfo.oneDayShippingAvailable;
    if(oneDayShipping!=undefined){
      var tmp = ["One Day Shipping"];
      tmp.push(oneDayShipping[0]);
      this.shippingItems.push(tmp);
    }

    if(this.returnAccept!=undefined){
      var tmp = ["Return Accepted"];
      tmp.push(this.returnAccept);
      this.shippingItems.push(tmp);
    }
    
  }

  getSellerInfo(){
    var feedback = this.sellerInfo.feedbackScore;
    var score;
    if(feedback!=undefined){
      var tmp = ["Feedback Score"];
      tmp.push(feedback[0]);
      score = feedback[0];
      this.sellerItems.push(tmp);
    }

    var popularity = this.sellerInfo.positiveFeedbackPercent;
    if(popularity!=undefined){
      var tmp = ["Popularity"];
      tmp.push(popularity[0]);
      this.sellerItems.push(tmp);
    }

    if(score!=undefined){
      var tmp = ["Feedback Rating Star"];
      if(0<=score&&score<=9){tmp.push("material-icons");} 
      else if(10<=score&&score<=49){tmp.push("material-icons yellow");}
      else if(50<=score&&score<=99){tmp.push("material-icons blue");}
      else if(100<=score&&score<=499){tmp.push("material-icons turquoise");}
      else if(500<=score&&score<=999){tmp.push("material-icons purple");}
      else if(1000<=score&&score<=4999){tmp.push("material-icons red");}
      else if(5000<=score&&score<=9999){tmp.push("material-icons green");}
      else if(10000<=score&&score<=24999){tmp.push("material-icons yellow");}
      else if(25000<=score&&score<=49999){tmp.push("material-icons turquoise");}
      else if(50000<=score&&score<=99999){tmp.push("material-icons purple");}
      else if(100000<=score&&score<=499000){tmp.push("material-icons red");}
      else if(500000<=score&&score<=999000){tmp.push("material-icons green");}
      else {tmp.push("material-icons silver");}

      if(score>=10000){
        tmp.push("stars");
      } else {
        tmp.push("star_border");
      }
      this.sellerItems.push(tmp);
    }

    var topRated = this.sellerInfo.topRatedSeller;
    if(topRated!=undefined){
      var tmp = ["Top Rated"];
      tmp.push(topRated[0]);
      this.sellerItems.push(tmp);
    }

    if(this.storeInfo!=undefined){
      var storeName = this.storeInfo.storeName;
      if(storeName!=undefined){
        var tmp = ["Store Name"];
        tmp.push(storeName[0]);
        this.sellerItems.push(tmp);
        this.sellerTitle = storeName[0].replace(' ','');
        console.log(storeName);
        console.log(this.sellerTitle);
      }
      var storeURL = this.storeInfo.storeURL;
      if(storeURL!=undefined){
        var tmp = ["Buy Product At"];
        tmp.push(storeURL[0]);
        this.sellerItems.push(tmp);
      }
    }
  }

  getProductInfo(item){
    this.title = item.Title;
    this.itemId = item.ItemID;
    var imgs = item.PictureURL;
    if(imgs!=undefined){
      for(var i = 0; i < imgs.length; i++){
        this.images.push(imgs[i]);
      }
    }

    var subtitle = item.Subtitle;
    if(subtitle!=undefined){
      var tmp = [];
      tmp.push("Subtitle");
      tmp.push(subtitle);
      this.productItems.push(tmp);
    }

    var price = item.CurrentPrice;
    if(price!=undefined){
      var tmp = [];
      tmp.push("Price");
      tmp.push("$"+price.Value);
      this.productItems.push(tmp);
    }

    var location = item.Location;
    if(location!=undefined){
      var tmp = [];
      tmp.push("Location");
      tmp.push(location);
      this.productItems.push(tmp);
    }

    var returnPolicy = item.ReturnPolicy;
    if(returnPolicy!=undefined){
      var tmp = [];
      tmp.push("Return Policy");
      var info = returnPolicy.ReturnsAccepted;
      if(returnPolicy.ReturnsWithin!=undefined){
        info += " " + returnPolicy.ReturnsWithin;
      }
      tmp.push(info);
      this.productItems.push(tmp);
    }

    var itemSpecs = item.ItemSpecifics;
    if(itemSpecs!=undefined){
      var list = itemSpecs.NameValueList;
      if(list!=undefined){
        for(var i = 0; i < list.length; i++){
          var tmp = [];
          tmp.push(list[i].Name);
          tmp.push(list[i].Value);
          this.productItems.push(tmp);
        }
      }
    }
    this.facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${this.viewItemURL}&quote=Buy ${this.title} at $${price.Value} from link below.`;
  }

  onClickShare(){
    console.log(this.facebookShare);
  }

  onClickCart(){
    if(this.shopcart=="add_shopping_cart"){
      this.shopcart="remove_shopping_cart";
    } else {
      this.shopcart="add_shopping_cart";
    }
  }

}
