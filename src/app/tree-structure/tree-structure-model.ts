export interface INodeDto
{
    _id:string;
    path:string;
    index:number;
    name:string;
    node_type:string;
    isEditing?:boolean;
    children:Array<INodeDto>;
    beforeUpdateData:any;
}
