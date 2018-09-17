import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeStructureService } from './tree-structure.service';
import { TreeStructureHttpService } from './tree-structure-http.service';
import { TreeComponent, ITreeOptions } from '../../../node_modules/angular-tree-component';
import { ITreeNode } from '../../../node_modules/angular-tree-component/dist/defs/api';
import * as _ from 'lodash';
import { IVisualNodeData } from './tree-structure-model';
import { timeout } from '../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-tree-structure',
  templateUrl: './tree-structure.component.html',
  styleUrls: ['./tree-structure.component.scss']
})
export class TreeStructureComponent implements OnInit {
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
  };

  // user start add new node
  public startAdd = (parentNodeForAdding: ITreeNode) => {
    this.cancelEditing();
    let newNode = {
      name: '',
      isEditing: true,
      // _id: TreeStructureService.newGuid(),
      index: -1,
      node_type: 'Project',
    };

    this.saveNewNodeData = { parent: parentNodeForAdding.data, newNode: newNode };
    this.editValue = '';
    parentNodeForAdding.data.children.push(<any>newNode);
    this.tree.treeModel.update();

    // set focus on the create element
    // fix  issue with tree if parent node doesn't have children then don't expand Node
    parentNodeForAdding = this.tree.treeModel.getNodeById(parentNodeForAdding.data._id);
    if (parentNodeForAdding.isCollapsed) {
      parentNodeForAdding.toggleExpanded();
      this.tree.treeModel.update();
    }
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
    let dto = this.treeStructureService.converVisualNodeToDto(node.data, false);
    if (this.saveNewNodeData) {
      this.treeStructureHttpService.addNode(dto);
    }
    else {
      this.treeStructureHttpService.updateNode(dto);
    }
    this.saveNewNodeData = null;
    this.editedNode = null;
  }

  //delete node
  public removeNode = (node) => {
    // prevent situation when user start remove this node before cancel previous node
    this.cancelEditing();
    this.treeStructureHttpService.deleteNode(node.data._id);
    _.remove(node.parent.data.children, (n: IVisualNodeData) => {
      return node.data._id === n._id;
    });
    this.tree.treeModel.
    ();
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

  constructor(private treeStructureService: TreeStructureService, private treeStructureHttpService: TreeStructureHttpService) { }

  public onMoveNode($event) {
    let movedNode: ITreeNode = this.tree.treeModel.getNodeById($event.node._id);
    let updatedList: IVisualNodeData[] = this.treeStructureService.updateModel(movedNode, this.tree.treeModel);
    let updatedListDto = this.treeStructureService.converVisualNodeToDtoList(updatedList, false);
    this.treeStructureHttpService.updateNodeList(updatedListDto, '5b8c464900f0fa25849696bc');
  }

  public ngOnInit() {
    this.treeStructureHttpService.getTree('5b8c464900f0fa25849696bc')
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
