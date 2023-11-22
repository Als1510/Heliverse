import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  users: any = [];

  constructor(private router: Router,
    private userService: UsersService) {
  }

  ngOnInit(): void {
    this.userService.team.subscribe((data) => {
      this.users = data;
    })
  }

  back() {
    this.router.navigate(['/users']);
  }

}
