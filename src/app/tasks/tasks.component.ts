import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services';
import { TasksService } from './tasks.service';
import {MatDialog, MatDialogConfig} from '@angular/material';

import { CreateTasksComponent } from './create-tasks.component';
import { EditTaskComponent } from './edit-task.component';
import { NodeService } from '../node/node.service';
import { ScrumboardCardDialogComponent } from '../scrumboard/dialogs/card/card.component'

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit, OnDestroy {
  
  title = 'Tasks';

  constructor(
    private authUser: AuthenticationService,
    private _tasksService: TasksService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private nodeService: NodeService
  ) { }

  nodeID: string;
  nodeType: string;

  assignedTasks: any[] = [];
  displayedColumns: string[] = ['title', 'assignee_name', 'due_date', 'status', 'utils', 'task_list'];
  taskStatusList: any[] = [
    {value: 'NEW', text: 'New'},
    {value: 'IN_PROGRESS', text: 'In Progress'},
    {value: 'COMPLETE', text: 'Complete'}
  ];

  taskStatusMap = {
    'NEW': 'New',
    'IN_PROGRESS': 'In Progress',
    'COMPLETE': 'Complete'
  };

  private nodeSubscription: Subscription;

  ngOnInit () {
    this.nodeSubscription = this.nodeService.node.subscribe(node => {
      if (node) {
        this.nodeType = node.node_type
        this.nodeID = node._id
        this.getAssignedTasks();
      }
    })
  }

  ngOnDestroy () {
    this.nodeSubscription.unsubscribe()
  }

  getUser () {
    return this.authUser.getUser()
  }

  getAssignedTasks () {
    this._tasksService.getAssignedTasks(this.nodeID).subscribe(
      tasks => this.assignedTasks = tasks
    );
  }

  openCreateTasksDialog () {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '350';
    dialogConfig.height = '500';

    const dialogRef = this.dialog.open(CreateTasksComponent, {
      width: '350',
      height: '500',
      data: {nodeID: this.nodeID, nodeType: this.nodeType}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAssignedTasks();
    });
  }

  openEditDialog (task) {
    const dialogRef = this.dialog.open(ScrumboardCardDialogComponent, {
            panelClass: 'scrumboard-card-dialog',
            data      : {
                task: task,
                list: task.task_list,
                nodeID: this.nodeID,
                nodeType: this.nodeType
            }
        });
        
    dialogRef.afterClosed().subscribe(result => {
      this.getAssignedTasks();
    });
  }

  changeTaskStatus (newStatus, task) {
    this._tasksService.updateTaskStatus(this.nodeID, this.nodeType, task._id, newStatus)
      .subscribe(
        resp => console.log('Task Status for ' + task.title + ' updated to ' + resp.status)
      )
  }

  deleteTask (task) {
    this._tasksService.deleteTask(this.nodeID, this.nodeType, task._id)
      .subscribe(
        resp => {
          this.assignedTasks = this.assignedTasks.filter(item => item._id !== task._id)
        }
      )
  }
}
