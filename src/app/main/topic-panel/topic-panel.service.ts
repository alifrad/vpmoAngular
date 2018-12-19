import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomHttpClient } from 'app/_services/custom-http.service';

import { FuseUtils } from '@fuse/utils';

import { appConfig } from 'app/app.config';

import { BehaviorSubject } from 'rxjs/index';

@Injectable()
export class TopicPanelService
{
	selectedTopicType = new BehaviorSubject('Issue');

	private readonly getAssignedTasksUrl: string = appConfig.taskApiUrl + '/list_assigned_tasks/';
    
    constructor(
        private http: CustomHttpClient
    )
    { }

    getTopicsUnderNode(parentNodeID, topicType, assignee) {
    	if (assignee == null) {
    		return this.http.get(appConfig.apiUrl + '/nodes/?nodeType='+topicType+'&parentNodeID='+parentNodeID+'&blanketSearch=True')
    	} else {
    		return this.http.get(appConfig.apiUrl + '/nodes/?nodeType='+topicType+'&parentNodeID='+parentNodeID+'&blanketSearch=True&assignedToUser=True')
    	}
	    
	}

	getTasksUnderNode (nodeID, username) {
		if (username == null) {
			return this.http.get(this.getAssignedTasksUrl+nodeID+'/?blanketSearch=True')
		} else {
			return this.http.get(this.getAssignedTasksUrl+nodeID+'/?blanketSearch=True&search='+username)
		}
		
	}

}
