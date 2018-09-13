import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeStructureService } from './tree-structure.service';
import { TreeStructureHttpService } from './tree-structure-http.service';
import { TreeComponent, ITreeOptions } from '../../../node_modules/angular-tree-component';
import { ITreeNode } from '../../../node_modules/angular-tree-component/dist/defs/api';
import * as _ from 'lodash';
import { INodeDto } from './tree-structure-model';
import { timeout } from '../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-tree-structure',
  templateUrl: './tree-structure.component.html',
  styleUrls: ['./tree-structure.component.scss']
})
export class TreeStructureComponent implements OnInit {
  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  private saveNewNodeData: { parent, newNode } = null;
  public editValue: string;
  public nodes = [];

  public options: ITreeOptions = {
    idField: '_id',
    displayField: 'name',
    childrenField: 'children',
    //
    allowDrag: true,
  };

  public startAdd = (node: ITreeNode) => {
    this.cancelNewItemIfItNead();
    let newNode = {
      name: '',
      isEditing: true,
      _id: TreeStructureService.newGuid(),
      index: -1,
      node_type: "Project",

    };

    this.saveNewNodeData = { parent: node.data, newNode: newNode };
    this.editValue = "";
    node.data.children.push(<any>newNode);
    this.tree.treeModel.update();
    if (node.isCollapsed) {
      node.toggleExpanded();
    }
    setTimeout(() => {
      let newNodeM = this.tree.treeModel.getNodeById(newNode._id);
      this.tree.treeModel.setFocusedNode(newNodeM);
    }, 111);
  }

  public startEditing = (node) => {
    this.cancelNewItemIfItNead();
    node.data.isEditing = true;
    this.editValue = node.data.name;
  }

  public saveNode = (node) => {
    node.data.name = this.editValue;
    node.data.isEditing = false;
    this.treeStructureService.updateDataFields(node);
    this.tree.treeModel.update();
    if (this.saveNewNodeData)
      this.treeStructureHttpService.addNode(node.data);
    else
      this.treeStructureHttpService.updateNode(node.data);
    this.saveNewNodeData = null;
  }

  public removeNode = (node) => {
    this.cancelNewItemIfItNead();
    this.treeStructureHttpService.deleteNode(node.data._id);
    _.remove(node.parent.data.children, (n: INodeDto) => {
      return node.data._id === n._id;
    });
    this.tree.treeModel.update();
  }

  public cancelNewItemIfItNead = () => {
    if (this.saveNewNodeData) {
      _.remove(this.saveNewNodeData.parent.children, (n: any) => {
        return this.saveNewNodeData.newNode._id === n._id;
      });
      this.saveNewNodeData = null;
      this.tree.treeModel.update();
    }
  }
  public cancelNode = (node) => {
    this.cancelNewItemIfItNead();
    node.data.isEditing = false;
    this.tree.treeModel.update();
  }

  constructor(private treeStructureService: TreeStructureService, private treeStructureHttpService: TreeStructureHttpService) { }

  public onMoveNode($event) {
    let nodeM = this.tree.treeModel.getNodeById($event.node._id);
    this.treeStructureService.updateDataFields(nodeM);
    this.treeStructureHttpService.updateNode($event.node)
  }

  public ngOnInit() {
    this.treeStructureHttpService.getTree('5b8c464900f0fa25849696bc')
      .subscribe(
        (data) => {
          this.nodes = [data];
        },
        (err: any) => console.log('getTree ', err),
        () => console.log('All done getting nodes.')
      );
  }
}
