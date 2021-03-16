import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
})
export class LeftPanelComponent implements OnInit {
  profiles = [];
  calendars = [];
  constructor() {
    this.fetchProfiles();
  }
  fetchProfiles() {
    this.profiles.push({ name: 'Sharad', color: 'red', value: '' });
    this.profiles.push({ name: 'Satyen', color: 'yellow', value: '' });
    this.profiles.push({ name: 'Dhananjay', color: 'green', value: '' });
    this.profiles.push({ name: 'Asmi', color: 'black', value: '' });
    this.profiles.push({ name: 'Khushboo', color: 'purple', value: '' });
    this.calendars.push({ name: 'Work', color: 'red', value: '' });
    this.calendars.push({ name: 'Personal', color: 'red', value: '' });
    this.calendars.push({ name: 'Gym', color: 'red', value: '' });
    this.calendars.push({ name: 'College', color: 'red', value: '' });
    this.calendars.push({ name: 'Home', color: 'red', value: '' });
    this.calendars.push({ name: 'Market', color: 'red', value: '' });
  }

  ngOnInit(): void {}
}
