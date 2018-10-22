import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeNavigationComponent } from './node-navigation.component';

describe('NodeNavigationComponent', () => {
  let component: NodeNavigationComponent;
  let fixture: ComponentFixture<NodeNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
