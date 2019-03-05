import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FighterRoutingModule } from './fighter-routing.module';
import { FighterComponent } from './fighter/fighter.component';
import { Web3Service } from '../providers/web3.service';

@NgModule({
  imports: [
    CommonModule,
    FighterRoutingModule,
    FormsModule
  ],
  providers: [Web3Service],
  declarations: [FighterComponent]
})
export class FighterModule { }
