import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';

import {FormsModule} from '@angular/forms';
import { ResultComponent } from './result/result.component';
import { WishlistComponent } from './wishlist/wishlist.component'

import {StorageService} from './services/storage.service'

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTooltipModule} from '@angular/material/tooltip';

import 'hammerjs';
import { TitlePipe } from './title.pipe';
import { DetailComponent } from './detail/detail.component';

import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { PhototabComponent } from './phototab/phototab.component';
import { SimilarComponent } from './similar/similar.component'; 

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    ResultComponent,
    WishlistComponent,
    TitlePipe,
    DetailComponent,
    PhototabComponent,
    SimilarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    RoundProgressModule

  ],
  providers: [StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
