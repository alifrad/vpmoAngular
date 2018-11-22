import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../_services/global.service';
import { NodeService } from './node.service';
import { LoadingService } from '../_services/loading.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-nodepage',
  templateUrl: './nodepage.component.html',
  styleUrls: ['./nodepage.component.less']
})
export class NodepageComponent implements OnInit {
  errorMessage: string;
  node: any;
  isFavorite: boolean = false;
  selectedIndex: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private _nodeService: NodeService,
    private loadingService: LoadingService,
    private authService: AuthenticationService
  ) { }  

  ngOnInit() {
    this._nodeService.node.subscribe(value => {
      if (value !== null) {
          this.node = value
          this.authService.favoriteNodes.subscribe(favoriteNodes => {
            if (favoriteNodes.filter(i => i._id == this.node._id).length  == 0) {
              this.isFavorite = false
            } else {
              this.isFavorite = true
            }
          })
      }
    })

    this.route.params.subscribe(
      params => {
        this._nodeService.getNodeDetails(params['id'])
      }
    );
  }

  toggleFavorite () {
    if (this.isFavorite) {
      this._nodeService.unfavoriteNode(this.node._id)
        .subscribe(val => {
          this.authService.favoriteNodes.next(val)
        })
    } else {
      this._nodeService.favoriteNode(this.node._id)
        .subscribe(val => {
          this.authService.favoriteNodes.next(val)
        })
    }
  }

  onTabChanged (e) {
    this.selectedIndex = e.index
  }

  showContent () {
    if (this.node.node_type == 'Topic') {
      return this.selectedIndex == 0 || this.selectedIndex == undefined || this.selectedIndex == null
    } else {
      return this.selectedIndex == 1
    }
  }

}
