import { Component, OnInit, OnDestroy } from '@angular/core';

import { NodeService } from './node.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../app/_services/global.service';
import { Subscription } from 'rxjs';
import { AlertService } from 'app/_services';

@Component({
  selector: 'app-node-edit',
  templateUrl: './node-edit.component.html',
  styleUrls: ['./node-edit.component.css']
})

export class NodeEditComponent implements OnInit, OnDestroy {
  errorMessage: string;

  
  constructor(
          private _nodeService: NodeService,
          private router: Router,
          private global: GlobalService,
          private route: ActivatedRoute,
          private _alertService: AlertService
        ) {}
  
 

  node: any = {};
  severityList: any[] = [
    {value: '1', text: 'Low'},
    {value: '2', text: 'Medium'},
    {value: '3', text: 'High'}
  ];
  impactList: any[] = [
    {value: '1', text: 'Minor'},
    {value: '2', text: 'Moderate'},
    {value: '3', text: 'High'}
  ];
  probabilityList: any[] = [
    {value: '1', text: 'Low probability'},
    {value: '2', text: 'Medium probability'},
    {value: '3', text: 'High probability'}
  ];

  private nodeSubscription: Subscription;
  editor_modules: any;

  ngOnInit(): void {
    this.nodeSubscription = this._nodeService.node.subscribe(node => {
      if (node) {
        this.node = node
        if (this.node.content == null) {
          this.node.content = ''
        }
      }
    })

    this.editor_modules = {
      toolbar: {
        container: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
  
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
  
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']                                    // remove formatting button
  
        ]
      },
      imageResize: true
    };
    
  }

  ngOnDestroy () {
    this.nodeSubscription.unsubscribe();
  }


  saveContent () {
    console.log('saveContent', this.node)
    this._nodeService.partialUpdateNode(this.node._id, this.node)
      .subscribe(
        node => {this.node = node;
        this._alertService.success("Saved");
        });
  }
  

  

  public editorOptions = {
    theme: 'snow',
    modules: {
        toolbar: {
        container:
        [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']                                    // remove formatting button

        ],
        handlers: {
            "placeholder": function (value) { 
                if (value) {
                    const cursorPosition = this.quill.getSelection().index;
                    this.quill.insertText(cursorPosition, value);
                    this.quill.setSelection(cursorPosition + value.length);
                }
            }
        }
      }
    }
  };
}
