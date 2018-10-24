import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeStructureService } from './tree-structure.service';
import { TreeStructureHttpService } from './tree-structure-http.service';
import { TreeComponent, ITreeOptions } from '../../../node_modules/angular-tree-component';
import { ITreeNode } from '../../../node_modules/angular-tree-component/dist/defs/api';
import * as _ from 'lodash';
import { IVisualNodeData } from './tree-structure-model';
import { timeout } from '../../../node_modules/rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalService } from '../_services/global.service';

@Component({
  selector: 'app-tree-structure',
  templateUrl: './tree-structure.component.html',
  styleUrls: ['./tree-structure.component.scss']
})
export class TreeStructureComponent implements OnInit {
  treeRoot: any;
  nodeType: any;
  node: any;
  team: any;
  project: any;
  topic: any;
  @ViewChild(TreeComponent)
  private tree: TreeComponent;
  // user the object for cancel or save created node
  private saveNewNodeData: { parent, newNode } = null;
  // for editing visual tree
  public editValue: string;
  private editedNode: any = null;
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
    this.cancelEditing();
    const newNode = {
      name: '',
      isEditing: true,
      // tempory node it will be replaced after post request to server 
      _id: TreeStructureService.newGuid(),
      index: -1,
      node_type: 'Project',
    };

    this.saveNewNodeData = { parent: parentNodeForAdding.data, newNode: newNode };
    this.editValue = '';
    if (!parentNodeForAdding.data.children) {
      parentNodeForAdding.data.children = [];
    }
    parentNodeForAdding.data.children.push(<any>newNode);
    this.tree.treeModel.update();

    // set focus on the create element
    // fix  issue with tree if parent node doesn't have children then don't expand Node
    parentNodeForAdding = this.tree.treeModel.getNodeById(parentNodeForAdding.data._id);
    if (parentNodeForAdding.isCollapsed) {
      parentNodeForAdding.toggleExpanded();
      this.tree.treeModel.update();
    }
    // tslint:disable-next-line:prefer-const
    let newNodeM = this.tree.treeModel.getNodeById(newNode._id);
    newNodeM.data.beforeUpdateData = {
      index: newNodeM.index,
      parentId: newNodeM.parent.data._id
    };
    this.tree.treeModel.setFocusedNode(newNodeM);

  }

  // user start edit node
  public startEditing = (node) => {
    // prevent situation when user start edit this node before cancel previous node
    this.cancelEditing();
    this.editedNode = node;
    node.data.isEditing = true;
    this.editValue = node.data.name;
  }

  // save new or edited node
  public saveNode = (node) => {
    node.data.name = this.editValue;
    node.data.isEditing = false;
    this.treeStructureService.updateDataFields(node);
    this.tree.treeModel.update();
    if (this.saveNewNodeData) {
      this.treeStructureService.saveNewNode(node.data, this.tree.treeModel);
    }
    else {
      this.treeStructureService.updateNode(node.data);
    }
    this.saveNewNodeData = null;
    this.editedNode = null;
  }

  // delete node
  public removeNode = (node) => {
    // prevent situation when user start remove this node before cancel previous node
    this.cancelEditing();
    this.treeStructureHttpService.deleteNode(node.data._id);
    _.remove(node.parent.data.children, (n: IVisualNodeData) => {
      return node.data._id === n._id;
    });
    this.tree.treeModel.update();
  }

  // prevent situation when user start edit this node before cancel previous node
  public cancelEditing = () => {
    if (this.saveNewNodeData) {
      _.remove(this.saveNewNodeData.parent.children, (n: any) => {
        return this.saveNewNodeData.newNode._id === n._id;
      });
      this.saveNewNodeData = null;
      this.tree.treeModel.update();
    }

    if (this.editedNode) {
      // set flag of visual editing tree to false
      this.editedNode.data.isEditing = false;
      this.editedNode = null;
    }
  }

  // cancel editing node
  public cancelNode = (node) => {
    this.cancelEditing();
    this.tree.treeModel.update();
  }

  constructor(
        private treeStructureService: TreeStructureService, 
        private treeStructureHttpService: TreeStructureHttpService,
        private router: Router,
        private globalService: GlobalService,
        ) { 
          globalService.teamValue.subscribe(
            (nextValue) => {
              this.team = nextValue;
          });
          globalService.projectValue.subscribe(
            (nextValue) => {
              this.project = nextValue;
          });
          globalService.topicValue.subscribe(
            (nextValue) => {
              this.topic = nextValue;
          });
          globalService.nodeValue.subscribe(
            (nextValue) => {
              this.node = nextValue;
          });
        }

  // IMPORTANT update is needed
  public onMoveNode($event) {
    const movedNode: ITreeNode = this.tree.treeModel.getNodeById($event.node._id);
    const updatedList: IVisualNodeData[] = this.treeStructureService.updateModel(movedNode, this.tree.treeModel);
    const updatedListDto = this.treeStructureService.converVisualNodeToDtoList(updatedList, false);
    // this line should change to accomodate the changes to structure when the top node is a project
    this.treeStructureHttpService.updateNodeList(updatedListDto, this.getTeam());
  }


  getTeam(): string {
    try{
        this.treeRoot = JSON.parse(this.node)._id;
    }
    catch (err) {
        console.log('Error: ' + err);
        return ('Error: ' + err);
    }
    console.log('team: ' +  this.treeRoot);
    return this.treeRoot;
  }


  getTopNode(): string {
    this.treeRoot = JSON.parse(localStorage.getItem('node'));
    return this.treeRoot._id;
    /*
    if (this.getNodeType() === 'Team'){
      try{
        this.treeRoot = (localStorage.getItem('teamID'));
      }
      catch (err) {
          console.log('Error: ' + err);
          return ('Error: ' + err);
      }
      console.log('team: ' +  this.treeRoot);
      return this.treeRoot;
    } else if (this.getNodeType() === 'Project'){
      try{
        this.treeRoot = (localStorage.getItem('projectID'));
      }
      catch (err) {
          console.log('Error: ' + err);
          return ('Error: ' + err);
      }
      console.log('project: ' +  this.treeRoot);
      return this.treeRoot;
    } 
    */
  }

  getNodeType(): string {
    try{
        this.nodeType = (localStorage.getItem('nodeType'));
        return this.nodeType;
    }
    catch (err) {
        console.log('Error: ' + err);
        return ('');
    }
  }

  public viewDetail = (node) => {
    const nodeType = node.data.node_type;
    const nodeId = node.data._id;
    const nodeName = node.data.name;
    console.log('Opening Node', node);
    // localStorage.setItem('nodeID', nodeId);
    localStorage.setItem('nodeType', nodeType);
    this.globalService.node = JSON.stringify({ _id: nodeId, name: nodeName });
    
    if (nodeType === 'Team') {
      this.globalService.team = JSON.stringify({ _id: nodeId, name: nodeName });
      // localStorage.setItem('teamID', nodeId);
    } else if (nodeType === 'Project') {
      this.globalService.project = JSON.stringify({ _id: nodeId, name: nodeName });
    } else {
      this.globalService.topic = JSON.stringify({ _id: nodeId, name: nodeName });
    }

    this.router.navigate(['node/details']);
    /*
    if (nodeType === 'Team'){

    } else if (nodeType === 'Project') {
      localStorage.setItem('projectID', nodeId);
      this.ngOnInit();
      this.router.navigate(['node/details']);
      
    } else {
      localStorage.setItem('topicID', nodeId);
      this.router.navigate(['node/details']);
    }
    */
  }


  public ngOnInit() {
    
    this.treeStructureHttpService.getTree(this.getNodeType(), this.getTopNode())
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
}
