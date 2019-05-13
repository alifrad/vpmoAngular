import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLinkActive, Router, NavigationStart } from '@angular/router';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import 'rxjs/add/operator/filter';


declare var $: any;

@Component({
  selector: 'app-node-container',
  templateUrl: './node-container.component.html',
  styleUrls: ['./node-container.component.less'],
  host: {
    '[class.p-24]': "contentType != 'chat'"
  }
})
export class NodeContainerComponent implements OnInit, OnDestroy {

  contentType: any;
  nodeID: any;
  nodeType: any;
  path: string;
  navLinks: [
    {path:'details', label:'Details'},

    {path:'teamDashboard', label:'Dashboard'},
    {path:'tree', label:'Tree'}
  ];
  _unsubscribeAll = new Subject<any>();
 
  @ViewChild('navContainer') navContainer;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit () {
    var currentUrlParams = this.router.url.split("/")
    this.contentType = currentUrlParams[currentUrlParams.length-1]

    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        this.nodeID = params['id']
        this.nodeType = params['type']
        this.path = 'node/' +  this.nodeType + '/' + this.nodeID + '/';
      })

    this.router.events
      .filter(event => event instanceof NavigationStart)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((event:NavigationStart) => {
        var routeParams = event.url.split("/")
        this.contentType = routeParams[routeParams.length-1]
      })
  }

  scrollNav(count) {
    console.log(this.navContainer)
    if (this.navContainer) {
      if (this.navContainer != undefined) {
        var that = this;
        this.navContainer.nativeElement.scrollLeft += count
      }
    }
  }

  ngOnDestroy () {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
