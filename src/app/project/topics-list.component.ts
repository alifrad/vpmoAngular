import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { ProjectService } from './project.service';
import { Router } from '@angular/router';
import { ChatService } from '../chat/chat.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'topics-list',
  templateUrl: './topics-list.component.html',
  styleUrls: ['./topics-list.component.scss']
})
export class TopicsListComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  parentNodeID: string;

  @Input()
  parentNodeType: string;

  @Input()
  topicType: string;

  topics: any[] = [];
  displayedColumns: any[] = [];
  unreadMessages: any;
  unreadMessagesSubscription: Subscription;

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

  constructor(
  	private projectService: ProjectService,
  	private router: Router,
    private chatService: ChatService
  ) { }

  ngOnInit() {
  	this.projectService.getTopicsUnderProject(this.parentNodeID, this.topicType)
      .pipe(delay(1000))
  		.subscribe(response => {
  			this.topics = response
  		})

    this.unreadMessagesSubscription = this.chatService.unreadMessageTracker
      .subscribe(unreadMessages => this.unreadMessages = unreadMessages)
  }

  ngOnChanges (changes) {
  	if (changes['topicType'] != undefined) {
  		this.setDisplayedColumns(changes['topicType'].currentValue)
  	}
  }

  ngOnDestroy () {
    this.unreadMessagesSubscription.unsubscribe()
  }

  setDisplayedColumns (topicType) {
  	// Setting columns common to all topic types
    this.displayedColumns = ['name', 'description', 'status', 'assignee', 'due_date', 'created_at',
                            'unreadMessages']
    if (topicType == 'Issue') {
      this.displayedColumns.push('severity')
    } else if (topicType == 'Risk') {
      this.displayedColumns = this.displayedColumns.concat(['impact', 'probability'])
    }
  }

  navigateBack () {
  	this.router.navigate(['node/'+this.parentNodeType+'/'+this.parentNodeID+'/dashboard'])
  }

}
