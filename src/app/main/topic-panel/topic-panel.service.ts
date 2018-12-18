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
    
    constructor(
        private http: CustomHttpClient
    )
    { }

    getTopicsUnderProject(parentNodeID, topicType) {
	    return this.http.get(appConfig.apiUrl + '/nodes/?nodeType='+topicType+'&parentNodeID='+parentNodeID+'&blanketSearch=True')
	}

}
