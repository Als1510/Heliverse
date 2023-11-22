import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  usersUrl = 'assets/heliverse_mock_data.json';
  team = new BehaviorSubject<any>([]);

  constructor(
    private _http: HttpClient
  ) { }

  getUsers() {
    return this._http.get(this.usersUrl);
  }

  setTeam(user: any) {
    this.team.next(user);
  }
}
