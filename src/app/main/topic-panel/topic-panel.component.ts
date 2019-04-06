import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CustomHttpClient } from 'app/_services/custom-http.service';

import { Subject, combineLatest, zip } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { TopicPanelService } from './topic-panel.service';
import { NodeService } from 'app/node/node.service';
import { ChatService } from 'app/chat/chat.service';
import { AuthenticationService } from 'app/_services/authentication.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import { ScrumboardCardDialogComponent } from 'app/scrumboard/dialogs/card/card.component'

@Component({
    selector     : 'topic-panel',
    templateUrl  : './topic-panel.component.html',
    styleUrls    : ['./topic-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TopicPanelComponent implements OnInit, AfterViewInit, OnDestroy
{
    sidebarFolded: any;

    @ViewChildren(FusePerfectScrollbarDirective)
    private _fusePerfectScrollbarDirectives: QueryList<FusePerfectScrollbarDirective>;

    // Private
    private _topicViewScrollbar: FusePerfectScrollbarDirective;
    private _unsubscribeAll: Subject<any>;

    rootNode: any = null;
    rootNodeChildren: any = null;
    selectedTopicType: string;
    selectedNode: string;
    topics = [];
    unreadMessages: any;
    user: any;
    assignedToMe: boolean = false;

    topicChoices = [
        'Issue',
        'Risk',
        'Deliverable',
        'Task'
    ];
    displayedColumns: any;

    STATUS_MAP: any = {
        1: 'Open',
        0: 'Closed'
    }

    SEVERITY_MAP: any = {
        1: 'Low',
        2: 'Medium',
        3: 'High'
    }

    IMPACT_MAP: any = {
        1: 'Minor',
        2: "Moderate",
        3: 'High'
    }

    PROBABILITY_MAP: any = {
        1: 'Low Probability',
        2: 'Medium Probability',
        3: 'High Probability'
    }

    /**
     * Constructor
     *
     * @param {TopicPanelService} _topicPanelService
     * @param {HttpClient} _httpClient
     * @param {FuseSidebarService} _fuseSidebarService
     */
    constructor(
        private _topicPanelService: TopicPanelService,
        private http: CustomHttpClient,
        private _fuseSidebarService: FuseSidebarService,
        private _nodeService: NodeService,
        private _chatService: ChatService,
        private _authService: AuthenticationService,
        private dialog: MatDialog
    )
    {
        // Set the defaults
        this.sidebarFolded = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to the foldedChanged observable
        const folded = this._fuseSidebarService.getSidebar('topicPanel').openedChanged

        const rootNode = this._nodeService.node
        const selectedTopicType = this._topicPanelService.selectedTopicType

        const combined = combineLatest(folded, rootNode, selectedTopicType)
        combined
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(([folded, node, topicType]) => {
                this.sidebarFolded = folded
                this.rootNode = JSON.parse(JSON.stringify(node))
                this.selectedTopicType = topicType
                if (this.rootNode) {
                    this.rootNodeChildren = this.rootNode.children
                    var rootNodeChild = {name: this.rootNode.name, _id: this.rootNode._id, node_type: this.rootNode.node_type}
                    if (this.rootNodeChildren.indexOf(rootNodeChild) <= -1) {
                        this.rootNodeChildren.unshift(rootNodeChild)
                    }
                    this.selectedNode = this.rootNode.name
                    this.filtersChanged()
                }
                this.setDisplayedColumns()
            })

        this._chatService.unreadMessageTracker
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(unreadMessages => {
                this.unreadMessages = unreadMessages
            })

        this._authService.user
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                if (user) {
                    this.user = user
                }
            })
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        this._topicViewScrollbar = this._fusePerfectScrollbarDirectives.find((directive) => {
            return directive.elementRef.nativeElement.id === 'topics';
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fold the temporarily unfolded sidebar back
     */
    foldSidebarTemporarily(): void
    {
        this._fuseSidebarService.getSidebar('topicPanel').foldTemporarily();
    }

    /**
     * Unfold the sidebar temporarily
     */
    unfoldSidebarTemporarily(): void
    {
        this._fuseSidebarService.getSidebar('topicPanel').unfoldTemporarily();
    }

    /**
     * Toggle sidebar opened status
     */
    toggleSidebarOpen(): void
    {
        this._fuseSidebarService.getSidebar('topicPanel').toggleOpen();
    }

    openEditDialog (task) {
        var node = this.rootNodeChildren.filter(i => i.name == this.selectedNode)[0]
        const dialogRef = this.dialog.open(ScrumboardCardDialogComponent, {
                panelClass: 'scrumboard-card-dialog',
                data      : {
                    task: task,
                    list: task.task_list,
                    nodeID: node._id,
                    nodeType: node.node_type
                }
            });
            
        dialogRef.afterClosed().subscribe(result => {
            this.filtersChanged();
        });
    }

    setDisplayedColumns () {
        if (this.selectedTopicType != 'Task') {
            // Setting columns common to all topic types
            this.displayedColumns = ['name', 'description', 'status', 'assignee', 'due_date', 'created_at',
                                    'unreadMessages']
            if (this.selectedTopicType == 'Issue') {
                this.displayedColumns.push('severity')
            } else if (this.selectedTopicType == 'Risk') {
                this.displayedColumns = this.displayedColumns.concat(['impact', 'probability'])
            }
        } else {
            this.displayedColumns = ['title', 'content', 'assignee', 'status', 'due_date', 'created_at']
        }
    }

    updateTopicsList (nodeID, selectedTopicType) {
        if (this.selectedTopicType != 'Task') {
            if (!this.assignedToMe){
                var topics = this._topicPanelService.getTopicsUnderNode(nodeID, selectedTopicType, null)
            } else {
                var topics = this._topicPanelService.getTopicsUnderNode(nodeID, selectedTopicType, this.user.username)
            }
            topics
                .pipe(delay(500))
                .subscribe(topics => {
                    this.topics = topics
                })
        } else {
            if (!this.assignedToMe) {
                var tasks = this._topicPanelService.getTasksUnderNode(nodeID, null)
            } else {
                var tasks = this._topicPanelService.getTasksUnderNode(nodeID, this.user.username)
            }
            tasks
                .pipe(delay(500))
                .subscribe(topics => {
                    this.topics = topics
                })
        }
    }

    filtersChanged () {
        var node = this.rootNodeChildren.filter(i => i.name == this.selectedNode)[0]
        this.setDisplayedColumns();
        this.topics = [];
        // if (node.node_type == 'Team' && this.selectedTopicType == 'Task') {
        //     // Do Nothing if the selected node is a team + Tasks are selected - since teams dont have tasks
        //     return
        // }

        this.updateTopicsList(node._id, this.selectedTopicType)
    }

}
