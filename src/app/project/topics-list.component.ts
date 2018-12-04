import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { ProjectService } from './project.service';
import { Router } from '@angular/router';
import { ChatService } from '../chat/chat.service';
import { Subscription } from 'rxjs/Subscription';

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

  constructor(
  	private projectService: ProjectService,
  	private router: Router,
    private chatService: ChatService
  ) { }

  ngOnInit() {
  	this.projectService.getTopicsUnderProject(this.parentNodeID, this.topicType)
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
