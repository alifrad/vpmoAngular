import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NodeService } from '../node/node.service';
import { Subscription ,  Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss']
})
export class ProjectDashboardComponent implements OnInit, OnDestroy {

	node: any;
  currentUsername: string;
  overdueCountMine: number = 0;
  overdueCount: number = 0;
  dueCountMine: number = 0;
  dueCount: number = 0;

	_unsubscribeAll: Subject<any>;

  constructor(
  	private nodeService: NodeService,
    private authService: AuthenticationService,
    private router: Router
  ) {
  	this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
  	const node = this.nodeService.node

    const user = this.authService.user

    const combined = combineLatest(node, user)
    combined
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(([node, user]) => {
        if (node !== null && node.tasks_due != undefined && user) {
          this.node = node
          this.currentUsername = user.username
          this.setTaskCount()
        }
      })
  }

  ngOnDestroy () {
  	this._unsubscribeAll.next()
  	this._unsubscribeAll.complete()
  }

  setTaskCount() {
    // Resetting counts before update
    this.dueCountMine = 0
    this.dueCount = 0
    this.overdueCountMine = 0
    this.overdueCount = 0
    
    for (var dueTask = 0; dueTask < this.node.tasks_due.length; dueTask++) {
      if (this.node.tasks_due[dueTask].assignee__username == this.currentUsername) {
        this.dueCountMine += 1
      } else {
        this.dueCount += 1
      }
    }

    for (var overdueTask = 0; overdueTask < this.node.tasks_overdue.length; overdueTask++) {
      if (this.node.tasks_overdue[overdueTask].assignee__username == this.currentUsername) {
        this.overdueCountMine += 1
      } else {
        this.overdueCount += 1
      }
    }
  }

  goToScrumboard () {
    this.router.navigate(['node/'+this.node.node_type+'/'+this.node._id+'/board'])
  }

  goToTopic (topicType) {
    this.router.navigate(['node/'+this.node.node_type+'/'+this.node._id+'/'+topicType])
  }

}
