import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeStructureComponent } from './tree-structure.component';
import { CreateNodeComponent } from './create-node.component';
import { RouterModule } from '@angular/router';
import { TreeStructureService } from './tree-structure.service';
import { TreeStructureHttpService } from './tree-structure-http.service';
import { TreeModule } from 'angular-tree-component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule, MatFormFieldModule,
          MatInputModule, MatButtonModule, MatTooltipModule,
          MatDatepickerModule, MatNativeDateModule, MatSelectModule,
          MatAutocompleteModule, MatProgressSpinnerModule, MatDividerModule } from '@angular/material';
import { AuthGuard } from '../_guards/auth.guard';
import { NodepageComponent } from 'app/node/nodepage.component';

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
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  exports: [
    TreeStructureComponent,
    CreateNodeComponent
  ],
  declarations: [
    TreeStructureComponent,
    CreateNodeComponent,
    
  ],
  providers: [
    TreeStructureService, 
    TreeStructureHttpService,
  ],
  bootstrap: [TreeStructureComponent],
  entryComponents: [CreateNodeComponent]
})
export class TreeStructureModule { }
