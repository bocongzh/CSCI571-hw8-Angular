import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultComponent } from './result/result.component';
import { WishlistComponent } from './wishlist/wishlist.component'

const routes: Routes = [
  {path:'result', component:ResultComponent},
  {path:'wishlist', component:WishlistComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
