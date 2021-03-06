import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TreeStructureService } from './tree-structure.service';
import { TreeStructureHttpService } from './tree-structure-http.service';
import { TreeComponent, ITreeOptions } from '../../../node_modules/angular-tree-component';
import { ITreeNode } from '../../../node_modules/angular-tree-component/dist/defs/api';
import * as _ from 'lodash';
import { IVisualNodeData } from './tree-structure-model';
import { timeout } from '../../../node_modules/rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, Subject } from 'rxjs';
import { GlobalService } from '../_services/global.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CreateNodeComponent } from './create-node.component';
import { NodeService } from '../node/node.service';
import { AuthenticationService } from '../_services/authentication.service';
import { ChatService } from '../chat/chat.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tree-structure',
  templateUrl: './tree-structure.component.html',
  styleUrls: ['./tree-structure.component.scss']
})
export class TreeStructureComponent implements OnInit, OnDestroy {
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
  // array of nodes that are favorited by the user
  private favoriteNodeIds: any[] = [];
  // mapping of {node.name: unreadMessageCount}
  private unreadMessages: any = {};

  _unsubscribeAll: Subject<any>;

  // set options for tree
  public options: ITreeOptions = {
    idField: '_id',
    displayField: 'name',
    childrenField: 'children',
    //
    allowDrag: true,
    allowDrop: (element, to: { parent: ITreeNode, index }): boolean => {
      // Disabling dropping into topic nodes
      if (to.parent.data.node_type == 'Topic') {
        return false
      } else {
        return true
      }
      // return !to.parent.data.virtual;
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
    this._treeStructureHttpService.updateNode(this.renamingNode.data._id, this.renamingNode.data.node_type, updateData)
      .subscribe(response => {
        console.log('Node Rename successful')
      })
    this.cancelRenameNode(node)
  }

  constructor(
    private _treeStructureService: TreeStructureService, 
    private _treeStructureHttpService: TreeStructureHttpService,
    private _router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private _nodeService: NodeService,
    private _authService: AuthenticationService,
    private _chatService: ChatService
  ) {
    this._unsubscribeAll = new Subject();
  }

  // IMPORTANT update is needed
  public onMoveNode($event) {
    // Cancel the event if the node is being moved into a topic
    if ($event.to.parent.node_type != 'Topic') {
      console.log('On Move', $event)
      const movedNode: ITreeNode = this.tree.treeModel.getNodeById($event.node._id);
      const updatedList: IVisualNodeData[] = this._treeStructureService.updateModel(movedNode, this.tree.treeModel);
      const updatedListDto = this._treeStructureService.converVisualNodeToDtoList(updatedList, false);
      // this line should change to accomodate the changes to structure when the top node is a project
      this._treeStructureHttpService.updateNodeList(updatedListDto, this.getTopNode());
    }
  }

  getTopNode(): string {
    // this.treeRoot = JSON.parse(localStorage.getItem('node'));
    console.log('Top Node', this.nodeID)
    return this.nodeID;
  }

  public viewDetail = (node) => {
    const nodeType = node.data.node_type;
    const nodeId = node.data._id;
    
    console.log('Opening Node', node);
    // localStorage.setItem('nodeID', nodeId);
    // localStorage.setItem('nodeType', nodeType);

    console.log('node/' + nodeType + '/' + nodeId);
    if (nodeType == 'Topic') {
      this._router.navigate(['node/' + nodeType + '/' + nodeId + '/details']);
    } else {
      this._router.navigate(['node/' + nodeType + '/' + nodeId + '/tree']);
      this.ngOnInit();
    }
  }

  viewChat(node) {
    const nodeType = node.data.node_type;
    const nodeId = node.data._id;

    // localStorage.setItem('nodeID', nodeId);
    // localStorage.setItem('nodeType', nodeType);
    
    this._router.navigate(['node/' + nodeType + '/' + nodeId + '/chat']);
  }

  toggleFavorite (nodeID) {
    if (this.favoriteNodeIds.indexOf(nodeID) >= 0) {
      this._nodeService.unfavoriteNode(nodeID)
        .subscribe(val => {
          this._authService.favoriteNodes.next(val)
        })
    } else {
      this._nodeService.favoriteNode(nodeID)
        .subscribe(val => {
          this._authService.favoriteNodes.next(val)
        })
    }
  }

  ngOnInit () {
    console.log('TreeStructure Init')

    this._nodeService.getNodeTree();
    
    this._nodeService.node
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(node => {
        if (node !== null) {
          this.nodes = this._treeStructureService.preUploadData(node.tree);
          // need time in order create dom for tree
          setTimeout(() => {
            this.tree.treeModel.expandAll();
          }, 111);
          this.nodeID = node._id
        }
      })
    

    

    this._authService.favoriteNodes
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(favoriteNodes => {
        this.favoriteNodeIds = favoriteNodes.map(i => i._id)
      })

    this._chatService.unreadMessageTracker
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(unreadMessages => {
        this.unreadMessages = unreadMessages
      })
  }

  ngOnDestroy () {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
