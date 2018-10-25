import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeStructureComponent } from './tree-structure.component';
import { RouterModule } from '@angular/router';
import { TreeStructureService } from './tree-structure.service';
import { TreeStructureHttpService } from './tree-structure-http.service';
import { TreeModule } from 'angular-tree-component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';
import { AuthGuard } from '../_guards/auth.guard';

const routes = [
  {
    // path: 'team/tree',
    path: 'tree/:type/:id',
    component: TreeStructureComponent,
    canActivate: [ AuthGuard ],
    
  }
];

@NgModule({
  imports: [
    TreeModule.forRoot(),
    CommonModule,
    RouterModule.forChild(routes),
    TreeModule,
    FormsModule,
    MatIconModule,
  ],
  exports: [
    TreeStructureComponent,
  ],
  declarations: [
    TreeStructureComponent,
  ],
  providers: [
    TreeStructureService, 
    TreeStructureHttpService,
  ]
})
export class TreeStructureModule { }
