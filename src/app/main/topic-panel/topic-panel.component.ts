import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CustomHttpClient } from 'app/_services/custom-http.service';

import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { TopicPanelService } from './topic-panel.service';
import { NodeService } from 'app/node/node.service';

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

    topicChoices = [
        'Issue',
        'Risk',
        'Deliverable',
        'Task'
    ];

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
        private _nodeService: NodeService
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
                this.rootNodeChildren = this.rootNode.children || []
                this.selectedTopicType = topicType
                if (this.rootNode) {
                    var rootNodeChild = {name: this.rootNode.name, _id: this.rootNode._id, node_type: this.rootNode.node_type}
                    if (this.rootNodeChildren.indexOf(rootNodeChild) <= -1) {
                        this.rootNodeChildren.unshift(rootNodeChild)
                    }
                    console.log(this.rootNode, this.rootNodeChildren)
                    this.selectedNode = this.rootNode.name
                    this.filtersChanged()
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

    updateTopicsList (nodeID, selectedTopicType) {
        if (this.selectedTopicType != 'Task') {
            this._topicPanelService.getTopicsUnderProject(nodeID, selectedTopicType)
                .subscribe(topics => {
                    this.topics = topics
                })
        }
    }

    filtersChanged () {
        var node = this.rootNodeChildren.filter(i => i.name == this.selectedNode)[0]
        if (node.node_type == 'Team' && this.selectedTopicType == 'Task') {
            // Do Nothing if the selected node is a team + Tasks are selected - since teams dont have tasks
            return
        }

        this.updateTopicsList(node._id, this.selectedTopicType)
    }

}
