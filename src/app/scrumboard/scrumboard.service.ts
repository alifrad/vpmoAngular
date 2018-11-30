import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    addCard(listId, newCard): void //Promise<any>
    {

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
                    this.lists = response
                    this.onListsChanged.next(response)
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
    removeCard(cardId, listId?): void
    {

    }

    /**
     * Update card
     *
     * @param newCard
     */
    updateCard(newCard): void
    {

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
