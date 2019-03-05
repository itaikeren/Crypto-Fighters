import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FighterComponent } from './fighter/fighter.component';

const routes: Routes = [
  {path: '', component: FighterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FighterRoutingModule { }
