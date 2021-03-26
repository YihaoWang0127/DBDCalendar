import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { StoreService } from 'src/app/services/store.service';
import { ProfileModel } from 'src/app/services/model/profile-model';
import { MyCalendarModel } from 'src/app/services/model/mycalendar-model';
import { MyCalendarService } from 'src/app/services/mycalendar.service';
import { Subject } from 'rxjs';

export interface MyCalendars {
  name: string;
  color: string;
  value: string;
};

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
})
export class LeftPanelComponent implements OnInit {

  @Output() emitSelectedProfiles = new EventEmitter();
  @Output() emitSelectedCalendars = new EventEmitter();

  profiles: ProfileModel[] = [];
  mycalendars: MyCalendarModel[] = [];
  calendarTitle: string;

  constructor(
    private profileService: ProfileService,
    private storeService: StoreService,
    private calendarService: MyCalendarService,
  ) {
    this.profileService.addProfileEvent.subscribe((profile)=>{
      this.profiles.push(profile);
      console.log('profile://-->'+profile)
    })
  }

  fetchProfiles() {
    this.profileService
      .getAllProfile(this.storeService.loggedInUser?.id)
      .subscribe(
        (response) => {
          // this.loading = false;
          if (response) {
            console.log(response);
            this.profiles = response;
          }
        },
        (error) => {
          // this.loading = false;
          //TODO:Handle API error
        }
      );
  }

  fetchCalendars() {
    this.calendarService
      .getAllCalendars(this.storeService.loggedInUser?.id)
      .subscribe(
        (response) => {
          if (response) {
            console.log(response);
            this.mycalendars = response;
          }
        },
        (error) => {
          // this.loading = false;
          //TODO:Handle API error
        }
      );
  }

  ngOnInit(): void {
    this.fetchProfiles();
    this.fetchCalendars();
    this.sendSelectedCalendars();
    this.sendSelectedProfiles();
  }

  addNewCalendar() {
    let letters = '0123456789ABCDEF';
    let randomcolor = '#';
    for (var i = 0; i < 6; i++) {
      randomcolor += letters[Math.floor(Math.random() * 16)];
    }
    let newcalendar = new MyCalendarModel();
    newcalendar.userId = this.storeService.loggedInUser?.id;
    newcalendar.color = randomcolor;
    newcalendar.name = this.calendarTitle;
    this.calendarService.addCalendar(newcalendar).subscribe(
      (response) => {
        if (response) {
          console.log('New Calendar Created');
          this.fetchCalendars();
        }
      },
      (error) => {
        console.log('Something went wrong');
        // window.alert('#TODO: Something went wrong.');
      }
    );
    this.calendarTitle  =  '';
  }

  deleteCalendar(calendarToDelete: number) {
    this.calendarService.deleteCalendarFromList(calendarToDelete).subscribe(
      () => {
        console.log('Calendar Deleted');
        this.fetchCalendars();
      },
      (error) => {
        console.log('Something went wrong');
        // window.alert('#TODO: Something went wrong.');
      }
    );
  }

  sendSelectedProfiles(){
    let selectedProfiles = [];
    selectedProfiles = this.profiles
      .filter((profile) => profile.selected)
      .map((profile) => profile.profileId);
    this.emitSelectedProfiles.emit(selectedProfiles);
  }

  sendSelectedCalendars(){
    let selectedCalendars = [];
    console.log("Inside ");
    console.log(this.mycalendars);
    selectedCalendars = this.mycalendars.filter((calendar) => calendar.selected).map((calendar) => calendar.calendarId);
    this.emitSelectedCalendars.emit(selectedCalendars);
  }
}
