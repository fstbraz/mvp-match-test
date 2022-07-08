import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  name = 'John Doe';
  initials$ = new BehaviorSubject('');

  ngOnInit() {
    const initials = this.calculateInitials(this.name);
    this.initials$.next(initials);
  }

  calculateInitials(name: any) {
    let initials;
    const fullName = name.split(' ');

    if (fullName.length > 1) {
      initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
    } else {
      initials = fullName[0].charAt(0);
    }

    return initials.toUpperCase();
  }
}
