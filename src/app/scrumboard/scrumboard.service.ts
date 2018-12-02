import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { CustomHttpClient } from '../_services/custom-http.service';
import { appConfig } from '../app.config';
import { NodeService } from '../node/node.service';


@Injectable()
export class ScrumboardService
{
    lists: any[];
    routeParams: any;
    node: any;

    private apiUrl: string = `${appConfig.taskApiUrl}`;
    private projectListsUrl: string = this.apiUrl + '/project_scrumboard_task_list';
    private addEditDeleteListUrl: string = this.apiUrl + '/scrumboard_task_list/';
    private createDeleteUpdateTaskUrl: string = this.apiUrl + '/delete_update_create_task/';
    private taskReorderUrl: string = this.apiUrl + '/reorder_tasks/';
    private presignedUrlGetUrl: string = `${appConfig.docApiUrl}` + '/task_documents_management/';
    private createTaskDocumentUrl: string = `${appConfig.docApiUrl}` + '/create_task_document/';
    private taskDocumentDeleteUrl: string = `${appConfig.docApiUrl}` + '/delete_task_document/';

    onListsChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private http: CustomHttpClient,
        private nodeService: NodeService
    )
    {
        this.onListsChanged = new BehaviorSubject([])

        this.nodeService.node.subscribe(node => {
            if (node !== null && node.node_type == 'Project') {
                this.node = node
                this.getLists(node._id)
            }
        })
    }


    /** Get Lists for project **/
    getLists (projectId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.projectListsUrl + '/' + projectId + '/')
                .subscribe(response => {
                    this.lists = response
                    this.onListsChanged.next(response)
                    resolve(this.lists)
                }, reject)
        })
    }


    /**
     * Add card
     *
     * @param listId
     * @param newCard
     * @returns {Promise<any>}
     */
    addCard(newCard, listId): Promise<any>
    {
        newCard.node = this.node._id
        return new Promise((resolve, reject) => {
            console.log(this.node)
            this.http.post(this.createDeleteUpdateTaskUrl+'?nodeType='+this.node.node_type+'&nodeID='+this.node._id, newCard)
                .subscribe(response => {
                    var lists = this.onListsChanged.value;
                    var list = lists.indexOf(lists.filter(list => list._id == listId)[0])
                    lists[list].tasks.push(response)
                    console.log(lists, list)
                    this.lists = lists
                    this.onListsChanged.next(lists)
                })
        })
    }

    /**
     * Add list
     *
     * @param newList
     * @returns {Promise<any>}
     */
    addList(newListName, listIndex): Promise<any>
    {
        return new Promise((resolve, reject) => {
            var data = {
                title: newListName,
                index: listIndex,
                project_id: this.node._id
            }
            this.http.post(this.addEditDeleteListUrl, data)
                .subscribe(response => {
                    this.onListsChanged.next(this.onListsChanged.value.concat(response));
                    this.lists.push(response)
                    resolve(this.lists)
                }, reject)
        })
    }

    listChanged (listId, listEditData): Observable<any> {
        return this.http.patch(this.addEditDeleteListUrl+'?project_id='+this.node._id+'&task_list='+listId, listEditData)
    }

    updateTaskListsIndexes (lists): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.put(this.projectListsUrl + '/' + this.node._id + '/', lists)
                .subscribe(response => {
                    /*
                    this.lists = response
                    this.onListsChanged.next(response)
                    */
                    resolve(this.lists)
                }, reject)
        })
    }

    updateTaskIndexes(list): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.put(this.taskReorderUrl+'/'+list._id+'/', list.tasks)
                .subscribe(response => {
                    resolve(this.lists)
                }, reject)
        })
    }

    /**
     * Remove list
     *
     * @param listId
     * @returns {Promise<any>}
     */
    removeList(listId): Promise<any>
    {
        // TODO: Add a check here that checks if there are any tasks in list

        return new Promise((resolve, reject) => {
            var data = {
                _id: listId
            }
            this.http.request('delete', this.addEditDeleteListUrl+'?project_id='+this.node._id, data)
                .subscribe(response => {
                    var lists = this.onListsChanged.value
                    var list = lists.indexOf(lists.filter(list => list._id == listId)[0])
                    lists.splice(list, 1)
                    this.onListsChanged.next(lists)
                    this.lists = lists
                    resolve(this.lists)
                }, reject)
        })
    }

    /**
     * Remove card
     *
     * @param cardId
     * @param listId
     */
    removeCard(cardId, listId): void
    {
        var data = {
            _id: cardId
        }
        this.http.request('delete', this.createDeleteUpdateTaskUrl+'?nodeType=Project'+'&nodeID='+this.node._id, data)
            .subscribe(response => {
                var lists = this.onListsChanged.value
                var list = lists.find(list => list._id == listId)
                var index = lists.indexOf(list)
                list.tasks.splice(list.tasks.indexOf(list.tasks.find(task => task._id == cardId)), 1)
                lists[index] = list

                this.onListsChanged.next(lists)
                this.lists = lists
            })
    }

    /**
     * Update card
     *
     * @param newCard
     */
    updateCard(newCard, listId): Promise<any>
    {
        var data = {
            _id: newCard._id,
            assignee: newCard.assignee,
            title: newCard.title,
            status: newCard.status,
            content: newCard.content,
            due_date: newCard.due_date
        }
        return new Promise((resolve, reject) => {
            this.http.put(this.createDeleteUpdateTaskUrl+'?nodeType=Project'+'&nodeID='+this.node._id, data)
            .subscribe(response => {
                var lists = this.onListsChanged.value
                var list = lists.find(list => list._id == listId)
                var index = lists.indexOf(list)
                list.tasks[list.tasks.indexOf(list.tasks.find(task => task._id == newCard._id))] = newCard
                lists[index] = list

                this.onListsChanged.next(lists)
                this.lists = lists
                resolve(this.lists)
            }, reject)
        })
    }

    getPresignedS3Url (taskId, fileName): Observable<any> {
        var data = { fileName: fileName }
        return this.http.post(this.presignedUrlGetUrl + taskId + '/', data)
    }

    uploadS3Document (presignedUrl, file, contentType): Observable<any> {
        const s3Headers = new HttpHeaders({
            'Content-Type': contentType,
        })
        return this.http.customPut(presignedUrl, file, {headers: s3Headers, reportProgress: true})
    }

    createTaskDocument (taskId, fileName): Observable<any> {
        var data = { fileName: fileName }
        return this.http.post(this.createTaskDocumentUrl + taskId + '/', data)
    }

    deleteTaskDocument (taskId, docId): Observable<any> {
        return this.http.delete(this.taskDocumentDeleteUrl+taskId+'/'+docId+'/')
    }
}

@Injectable()
export class BoardResolve
{
    /**
     * Constructor
     *
     * @param {ScrumboardService} _scrumboardService
     */
    constructor(
        private _scrumboardService: ScrumboardService
    )
    {
    }
}
