import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/index';

@Injectable()
export class LoadingService {
  public onLoadStarted = new BehaviorSubject(null);

  public taskFinished(taskID) {
    this.onLoadStarted.next(taskID)
  }

  private generateUUID () { // Public Domain/MIT
	    var d = new Date().getTime();
	    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
	        d += performance.now(); //use high-precision timer if available
	    }
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	        var r = (d + Math.random() * 16) % 16 | 0;
	        d = Math.floor(d / 16);
	        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	    });
	}

  public startTask() {
  	var taskID = this.generateUUID()
    this.onLoadStarted.next(taskID)
    return taskID
  }

  public clearTasks () {
  	this.onLoadStarted.next('CLEAR')
  }
}