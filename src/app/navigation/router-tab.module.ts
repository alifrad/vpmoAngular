import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { RouterTab, RouterTabComponent, RouterTabItem } from './router-tab.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		MatTabsModule
	],
	declarations: [
		RouterTabComponent,
		RouterTabItem,
		RouterTab
	],
	exports: [
		RouterTabComponent,
		RouterTabItem,
		RouterTab
	]
})
export class RouterTabModule { }