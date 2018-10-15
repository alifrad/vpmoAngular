// for visual tree
export interface IVisualNodeData {
    _id: string;
    path: string;
    // position of node in parent node
    index: number;
    name: string;
    node_type: string;
    // flag of visual editing 
    isEditing?: boolean;
    children: Array<IVisualNodeData>;
    // need for trace changes when node is moved
    beforeUpdateData: any;
    parent: any;
}

// for get\put api request
export interface INodeDto {
    _id: string;
    path: string;
    // position of node in parent node
    index: number;
    name: string;
    node_type: string;
    children: Array<INodeDto>;
    parent: any;
}

