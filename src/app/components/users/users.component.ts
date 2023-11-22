import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  allUsers: any = [];
  users: any = [];
  filteredUser: any = [];
  selectedGender: any = 'all';
  selectedDomain: any = 'all';
  selectedAvailability: any = 'all';
  searchText: string = '';
  pageSize: number = 20;
  currentPage: number = 1;
  disableNextButton: boolean = false;
  selectTeam: boolean = false;
  team: any = [{ "id": 1, "first_name": "Anet", "last_name": "Doe", "email": "adoe0@comcast.net", "gender": "Female", "avatar": "https://robohash.org/sintessequaerat.png?size=50x50&set=set1", "domain": "Sales", "available": false }];

  constructor(
    private _usersService: UsersService,
    private renderer: Renderer2,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this._usersService.getUsers().subscribe((data) => {
      this.allUsers = data;
      this.filterUsers();
    })
  }

  filterUsers() {
    this.filteredUser = this.allUsers.filter((user: any) =>
      (this.selectedGender === 'all' || user.gender.toLowerCase() === this.selectedGender.toLowerCase()) &&
      (this.selectedAvailability === 'all' || (user.available && this.selectedAvailability === 'yes') || (!user.available && this.selectedAvailability === 'no')) &&
      (this.searchText ?
        (user.first_name.toLowerCase().includes(this.getFirstNameSearchTerm().toLowerCase()) && user.last_name.toLowerCase().includes(this.getLastNameSearchTerm().toLowerCase()))
        : true)
    );

    if (this.team.length > 0) {
      const teamDomains = new Set(this.team.map((teamUser: any) => teamUser.domain.toLowerCase()));
      this.filteredUser = this.filteredUser.filter((user: any) => !teamDomains.has(user.domain.toLowerCase()));
      this.filteredUser = this.filteredUser.concat(this.team);
      this.filteredUser.reverse();
    }

    if (this.selectedDomain !== 'all') {
      this.filteredUser = this.filteredUser.filter((user: any) => user.domain.toLowerCase() === this.selectedDomain.toLowerCase());
    }

    this.currentPage = 1;
    this.updatePage();
  }

  private getFirstNameSearchTerm(): string {
    return this.searchText.split(' ')[0] || '';
  }

  private getLastNameSearchTerm(): string {
    return this.searchText.split(' ')[1] || '';
  }

  private updatePage() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.users = this.filteredUser.slice(startIndex, endIndex, this.filteredUser, this.users);
    const remainingUsers = this.filteredUser.length - endIndex;
    this.disableNextButton = remainingUsers <= 0;
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.updatePage();
  }

  clearFilters() {
    this.selectedGender = 'all';
    this.selectedDomain = 'all';
    this.selectedAvailability = 'all';
    this.searchText = '';
    this.filterUsers();
  }

  addToTeam(user: any) {
    if (this.selectTeam) {
      const existingUserIndex = this.team.findIndex((teamUser: any) => teamUser.id === user.id);
      if (existingUserIndex !== -1) {
        this.team.splice(existingUserIndex, 1);
        user.isSelected = false;
      } else {
        this.team.push(user);
        user.isSelected = true;
      }
    }
    this.filterUsers();
  }

  createTeam() {
    this.selectTeam = true;
  }

  cancel() {
    this.selectTeam = false;
    this.allUsers.forEach((user: any) => {
      if (user.hasOwnProperty('isSelected')) {
        delete user.isSelected;
      }
    })
    this.team = [];
  }

  save() {
    this._usersService.setTeam(this.team);
    this.cancel();
    this.router.navigate(['/team'])
  }
}