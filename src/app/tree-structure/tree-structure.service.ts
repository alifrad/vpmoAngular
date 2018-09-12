import { Injectable } from '@angular/core';
import { INodeDto } from './tree-structure-model';
import { ITreeNode } from '../../../node_modules/angular-tree-component/dist/defs/api';

@Injectable({
  providedIn: 'root'
})
export class TreeStructureService {
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

  public static newGuid() {
    return 'xxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  constructor() { }
}
