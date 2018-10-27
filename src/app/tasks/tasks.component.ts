import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { TasksService } from './tasks.service';
import {MatDialog, MatDialogConfig} from '@angular/material';

import { CreateTasksComponent } from './create-tasks.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {
  
  title = 'Tasks';

  constructor(
    private authUser: AuthenticationService,
    private _tasksService: TasksService,
    private dialog: MatDialog,
  ) { }

  nodeID: string;
  nodeType: string;
  currentUser: any;

  assignedTasks: any[] = [];
  displayedColumns: string[] = ['title', 'status'];
  taskStatusList: any[] = [
    {value: 'NEW', text: 'New'},
    {value: 'IN_PROGRESS', text: 'In Progress'},
    {value: 'COMPLETE', text: 'Complete'}
  ];

  ngOnInit () {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))

    this.nodeID = JSON.parse(localStorage.getItem('node'))._id;
    this.nodeType = localStorage.getItem('nodeType');

  	this.getAssignedTasks()
  }

  getAssignedTasks () {
    this._tasksService.getAssignedTasks(this.nodeID).subscribe(
      tasks => this.assignedTasks = tasks
    )
  }

  openCreateTasksDialog () {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '350';
    dialogConfig.height = '500';

    const dialogRef = this.dialog.open(CreateTasksComponent, dialogConfig);
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

}
