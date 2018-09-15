import { Injectable } from '@angular/core';
import { INodeDto } from './tree-structure-model';
import { ITreeNode } from '../../../node_modules/angular-tree-component/dist/defs/api';
import { TreeModel } from '../../../node_modules/angular-tree-component';
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class TreeStructureService {
  public preUploadData(data: any): any {
    this.addBeforeUpdateData(data, null);
    let newData = [data];
    return newData
  }

  private addBeforeUpdateData = (node: INodeDto, parentId) => {
    node.beforeUpdateData = {
      index: node.index,
      parentId: parentId,
    }
    for (const childNode of node.children) {
      this.addBeforeUpdateData(childNode, node._id);
    }
  }

  private getPath(node): string {
    if (node == null)
      return "";
    if (node.parent == null || node.parent.data.virtual)
      return node.data._id;
    const res = this.getPath(node.parent) + ", " + node.data._id;
    return res;
  }

  public updateDataFields(node: ITreeNode): void {
    let data: INodeDto = node.data;
    data.path = this.getPath(node.parent);
    if ('isEditing' in data)
      delete data.isEditing;
    node.data.index = node.parent.data.children.map((e: INodeDto) => { return e._id; }).indexOf(data._id);
  }

  public updateModel = (node: ITreeNode, treeModel: TreeModel): INodeDto[] => {
    //change parent
    //  index of children in preview parent (under moved element)
    //  index of children in new parent (under moved element)
    //  change PATH  MOVED element
    //  change PATH all children MOVED element

    let listUpdatedElement: Array<string> = [];
    if (node.data.beforeUpdateData.parentId != node.parent.data._id) {
      let oldParentNode = treeModel.getNodeById(node.data.beforeUpdateData.parentId);
      this.updateCildrenIndex(oldParentNode.data.children, node.data.beforeUpdateData.index, listUpdatedElement, treeModel);
      this.updatePathWithChildren(node, listUpdatedElement)
      node.data.beforeUpdateData.parentId = node.parent.data._id;
    }
    //
    this.updateCildrenIndex(node.parent.data.children, 0, listUpdatedElement, treeModel);
    //
    let idChangedNodeList = _.uniqBy(listUpdatedElement, function (e) {
      return e;
    });

    let changedNode: INodeDto[] = [];
    for (const nodeId of idChangedNodeList) {
      let x = treeModel.getNodeById(nodeId);
      changedNode.push(x.data);
    }
    console.log(changedNode);
    return changedNode;
  }

  private updateCildrenIndex(children: Array<INodeDto>, fromIndex: number, listUpdatedElement: Array<string>, treeModel: TreeModel): void {
    for (let index = fromIndex; index < children.length; index++) {
      const child = children[index];
      let childIndex = treeModel.getNodeById(child._id).index;
      child.beforeUpdateData.index = childIndex;
      if (child.index != childIndex) {
        child.index = childIndex;
        listUpdatedElement.push(child._id);
      }
    }
  }

  private updatePathWithChildren(node: ITreeNode, listUpdatedElement: Array<string>): void {
    node.data.path = this.getPath(node.parent);
    listUpdatedElement.push(node.data._id);
    node.children.forEach(child => {
      this.updatePathWithChildren(child, listUpdatedElement);
    });
  }

  public static newGuid() {
    return 'xxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  constructor() { }
}
