import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeStructureComponent } from './tree-structure.component';
import { RouterModule } from '@angular/router';
import { TreeStructureService } from './tree-structure.service';
import { TreeStructureHttpService } from './tree-structure-http.service';
import { TreeModule } from 'angular-tree-component';
import { FormsModule } from '@angular/forms';

const routes = [
  {
    path: 'tree',
    component: TreeStructureComponent
  }
];

@NgModule({
  imports: [
    TreeModule.forRoot(),
    CommonModule,
    RouterModule.forChild(routes),
    TreeModule,
    FormsModule,
  ],
  exports: [
    TreeStructureComponent,
  ],
  declarations: [TreeStructureComponent],
  providers: [TreeStructureService, TreeStructureHttpService]
})
export class TreeStructureModule { }
