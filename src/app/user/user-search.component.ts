import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'user-search',
  templateUrl: './user-search.component.html',
})


export class UserSearchComponent implements OnInit {
	title = 'User Search';

	@Input() searchUrl: string;
	@Input() preselectedUser: any;

	constructor(
		private _userService: UserService
	){ }

	@Output () userSelected = new EventEmitter()

	filteredAssignableUsers: any = [];
	selectedUser: any;

	ngOnInit () {
		console.log('SearchUser', this.preselectedUser)
		if (this.preselectedUser) {
			this.selectedUser = this.preselectedUser
			this.filterUsers(this.selectedUser)
		}
	}

	filterUsers (e) {
		console.log(e, this.selectedUser)
		var that = this

		if (e.length < 3) {
			this.filteredAssignableUsers = []
			this.userSelected.emit({
				selectedUser: e,
				filteredUsers: this.filteredAssignableUsers
			})
		}
		
		this._userService.searchUsers(this.searchUrl, e)
			.subscribe(assignableUsers => {
				that.filteredAssignableUsers = assignableUsers
				that.userSelected.emit({
					selectedUser: e,
					filteredUsers: that.filteredAssignableUsers
				})
			});
	}
}