import { Component, OnInit, Input } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-phototab',
  templateUrl: './phototab.component.html',
  styleUrls: ['./phototab.component.css']
})
export class PhototabComponent implements OnInit {

  @Input() title:string;
  jsonObj:any;
  photos:string[];

  constructor(public http:HttpClient,) { }

  ngOnInit() {
    var api = `https://www.googleapis.com/customsearch/v1?q=${this.title}&cx=007694279671496478343:5rcbpkporxe&imgSize=huge&imgType=news&num=8&searchType=image&key=AIzaSyBCGbeoVdkCeihInnkJYH_5UgVMxZmHg0o`;
    var url = 'http://csci571-hw8-bocongzh.us-east-2.elasticbeanstalk.com/photos';
    var req = {"api":api};
    const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
    this.http.post(url,req,httpOptions).subscribe((response:string)=>{
      this.jsonObj = JSON.parse(response);
    })
    this.initView();
  }

  ngDoCheck(): void {
    this.initView();
    
  }

  initView(){
    if(this.jsonObj!=undefined){
      this.photos = [];
      var items = this.jsonObj.items;
      if(items!=undefined){
        for(var i = 0; i < items.length; i++){
          var link = items[i].link;
          if(link!=undefined){
            this.photos.push(link);
          }
        }
      }
      for(var i = this.photos.length; i<8; i++){
        this.photos.push("assets/no.png");
      }
    }
  }

}
