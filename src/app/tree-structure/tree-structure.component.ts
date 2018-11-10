import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeStructureService } from './tree-structure.service';
import { TreeStructureHttpService } from './tree-structure-http.service';
import { TreeComponent, ITreeOptions } from '../../../node_modules/angular-tree-component';
import { ITreeNode } from '../../../node_modules/angular-tree-component/dist/defs/api';
import * as _ from 'lodash';
import { IVisualNodeData } from './tree-structure-model';
import { timeout } from '../../../node_modules/rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalService } from '../_services/global.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CreateNodeComponent } from './create-node.component';

@Component({
  selector: 'app-tree-structure',
  templateUrl: './tree-structure.component.html',
  styleUrls: ['./tree-structure.component.scss']
})
export class TreeStructureComponent implements OnInit {
  treeRoot: any;
  nodeType: any;
  nodeID: any;

  @ViewChild(TreeComponent)
  private tree: TreeComponent;
  // user the object for cancel or save created node
  private saveNewNodeData: { parent, newNode } = null;
  // for editing visual tree
  public newNodeName: string;
  private renamingNode: any = null;
  // array of tree nodes
  public nodes = [];

  // set options for tree
  public options: ITreeOptions = {
    idField: '_id',
    displayField: 'name',
    childrenField: 'children',
    //
    allowDrag: true,
    allowDrop: (element, to: { parent: ITreeNode, index }): boolean => {
      return !to.parent.data.virtual;
    },
  };

  // user start add new node
  public startAdd = (parentNodeForAdding: ITreeNode) => {
    const dialogRef = this.dialog.open(CreateNodeComponent, {
      width: '350',
      data: {parentNode: parentNodeForAdding}
    })

    dialogRef.componentInstance.onCreate.subscribe(createdNode => {
      this.ngOnInit();
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog Closed')
    })
  }

  // user start edit node
  public startRenaming = (node) => {
    // prevent situation when user start edit this node before cancel previous node
    this.resetRenameAttrs();
    this.renamingNode = node;
    node.data.isRenaming = true;
    this.newNodeName = node.data.name;
  }

  resetRenameAttrs () {
    if (this.renamingNode) {
      this.renamingNode.data.isRenaming = false;
      this.renamingNode = null;
    }
  }

  // cancel editing node
  public cancelRenameNode = (node) => {
    this.resetRenameAttrs()
    this.tree.treeModel.update();
  }

  renameNode (node) {
    node.data.name = this.newNodeName
    node.data.isRenaming = false
    this.tree.treeModel.update();

    var updateData = { name: this.newNodeName }
    this.treeStructureHttpService.updateNode(this.renamingNode.data._id, this.renamingNode.data.node_type, updateData)
      .subscribe(response => {
        console.log('Node Rename successful')
      })
    this.cancelRenameNode(node)
  }

  constructor(
        private treeStructureService: TreeStructureService, 
        private treeStructureHttpService: TreeStructureHttpService,
        private router: Router,
        private route: ActivatedRoute,
        private globalService: GlobalService,
        private dialog: MatDialog
        ) { 

        }

  // IMPORTANT update is needed
  public onMoveNode($event) {
    console.log('On Move', $event.node)
    const movedNode: ITreeNode = this.tree.treeModel.getNodeById($event.node._id);
    const updatedList: IVisualNodeData[] = this.treeStructureService.updateModel(movedNode, this.tree.treeModel);
    const updatedListDto = this.treeStructureService.converVisualNodeToDtoList(updatedList, false);
    // this line should change to accomodate the changes to structure when the top node is a project
    this.treeStructureHttpService.updateNodeList(updatedListDto, this.getTopNode());
  }

  getTopNode(): string {
    // this.treeRoot = JSON.parse(localStorage.getItem('node'));
    console.log('Top Node', this.nodeID)
    return this.nodeID;
  }

  public viewDetail = (node) => {
    const nodeType = node.data.node_type;
    const nodeId = node.data._id;
    const nodeName = node.data.name;
    console.log('Opening Node', node);
    localStorage.setItem('nodeID', nodeId);
    localStorage.setItem('nodeType', nodeType);
    /*
    this.globalService.node = JSON.stringify({ _id: nodeId, name: nodeName });
    
    if (nodeType === 'Team') {
      this.globalService.team = JSON.stringify({ _id: nodeId, name: nodeName });
      // localStorage.setItem('teamID', nodeId);
    } else if (nodeType === 'Project') {
      this.globalService.project = JSON.stringify({ _id: nodeId, name: nodeName });
    } else {
      this.globalService.topic = JSON.stringify({ _id: nodeId, name: nodeName });
    }
    */

    // this.router.navigate(['node/details']);
    console.log('node/' + nodeType + '/' + nodeId);
    this.router.navigate(['node/' + nodeType + '/' + nodeId]);
  }

  getTree(nodeType, nodeId) {
    this.treeStructureHttpService.getTree(nodeType, nodeId)
      .subscribe(
        (data) => {
          this.nodes = this.treeStructureService.preUploadData(data);
          // need time in order create dom for tree
          setTimeout(() => {
            this.tree.treeModel.expandAll();
          }, 111);
        },
        (err: any) => console.log('getTree ', err),
        () => console.log('All done getting nodes.')
      );
  }
  

  public ngOnInit() {
    this.route.params.subscribe(
      params => { 
        this.getTree(params['type'], params['id']);
        this.nodeType = params['type']
        this.nodeID = params['id']
      }
    );
  }
}
