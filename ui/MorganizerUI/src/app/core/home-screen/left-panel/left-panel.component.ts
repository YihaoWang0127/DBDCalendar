import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { StoreService } from 'src/app/services/store.service';
import { ProfileModel } from 'src/app/services/model/profile-model';
import { MyCalendarModel } from 'src/app/services/model/mycalendar-model';
import { MyCalendarService } from 'src/app/services/mycalendar.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AddProfileComponent } from 'src/app/add-profile/add-profile.component';

export interface MyCalendars {
  name: string;
  color: string;
  value: string;
}

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
})
export class LeftPanelComponent implements OnInit {
  @Output() emitSelectedProfiles = new EventEmitter();
  @Output() emitSelectedCalendars = new EventEmitter();
  @Output() triggerCalendarUpdate = new EventEmitter();

  profiles: ProfileModel[] = [];
  mycalendars: MyCalendarModel[] = [];
  calendarTitle: string;
  editField: string;

  constructor(
    private profileService: ProfileService,
    private storeService: StoreService,
    private calendarService: MyCalendarService,
    private dialog: MatDialog
  ) {
    this.profileService.addProfileEvent.subscribe((profile) => {
      this.profiles = this.profiles.filter((profileModel)=>profileModel.profileId != profile.profileId);
      this.profiles.push(profile);
      this.profiles.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
  }

  fetchProfiles() {
    this.profileService
      .getAllProfile(this.storeService.loggedInUser?.id)
      .subscribe(
        (response) => {
          // this.loading = false;
          if (response) {
            this.profiles = response;
            this.profiles.sort((a, b) => (a.name > b.name ? 1 : -1));
            this.sendSelectedProfiles();
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
            this.mycalendars = response;
            this.mycalendars.sort((a, b) => (a.name > b.name ? 1 : -1));
            this.sendSelectedCalendars();
          }
        },
        (error) => {
          // this.loading = false;
          //TODO:Handle API error
        }
      );

    //TODO:find and store default calendar in store service
  }

  ngOnInit(): void {
    this.fetchProfiles();
    this.fetchCalendars();
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
          this.fetchCalendars();
        }
      },
      (error) => {
        console.log('Something went wrong');
        // window.alert('#TODO: Something went wrong.');
      }
    );
    this.calendarTitle = '';
  }

  deleteCalendar(calendarToDelete: number) {
    this.calendarService.deleteCalendarFromList(calendarToDelete).subscribe(
      () => {
        this.fetchCalendars();
      },
      (error) => {
        console.log('Something went wrong');
        // window.alert('#TODO: Something went wrong.');
      }
    );
  }

  deleteProfile(profileToDelete: number) {
    this.profileService.deleteProfile(profileToDelete).subscribe(
      () => {
        this.fetchProfiles();
        this.triggerCalendarUpdate.emit(null);
      },
      (error) => {
        console.log('Could not delete profile:: ' + error);
        //TODO: window.alert
      }
    );
  }

  updateProfile(profile) {
    this.profileService.addProfile(profile).subscribe(
      (response) => {
        this.sendSelectedProfiles();
      },
      (error) => {
        //TODO:Handle API error
      }
    );
  }

  sendSelectedProfiles() {
    let selectedProfiles = [];
    selectedProfiles = this.profiles
      .filter((profile) => profile.selected)
      .map((profile) => profile.profileId);
    this.emitSelectedProfiles.emit(selectedProfiles);
  }

  updateCalendar(calendar) {
    this.calendarService.addCalendar(calendar).subscribe(
      (response) => {
        this.sendSelectedCalendars();
      },
      (error) => {
        //TODO:Handle API error
      }
    );
  }

  sendSelectedCalendars() {
    let selectedCalendars = [];
    selectedCalendars = this.mycalendars
      .filter((calendar) => calendar.selected)
      .map((calendar) => calendar.calendarId);
    this.emitSelectedCalendars.emit(selectedCalendars);
  }
  addEvent() {
    this.storeService.createEventEmitter.next(true);
  }
  updateCalendarColor(calendar) {
    this.updateCalendar(calendar);
    this.triggerCalendarUpdate.emit(null);
  }

  updateProfileColor(profile) {
    this.updateProfile(profile);
    this.triggerCalendarUpdate.emit(null);
  }

  addProfile(){
    console.log("Inside add profile");
    // this.storeService.createProfileEmitter.next(true);
    let profileModel = new ProfileModel();
    // eventModel.color = { primary: '', secondary: '' };
    profileModel.userId = this.storeService.loggedInUser?.id;
    let dialogRef = this.dialog.open(AddProfileComponent, {
      data: profileModel,
      width: '600px',
      height: '60%',
    });
  }

  editProfile(profile){
    let profileModel = new ProfileModel();
    profileModel = {...profile};
    console.log("Inside edit profile");
    profileModel.userId = this.storeService.loggedInUser?.id;
    let dialogRef = this.dialog.open(AddProfileComponent, {
      data: profileModel,
      width: '600px',
      height: '60%',
    });
  }


  renameCalendar(calendar:MyCalendarModel, property: string, event: any) {
    let newCalendar = new MyCalendarModel();
    const editField = event.target.textContent;
    newCalendar = {...calendar};
    newCalendar.name = editField;
    newCalendar.userId = this.storeService.loggedInUser?.id;
    this.calendarService.addCalendar(newCalendar).subscribe(
      (response) => {
        if (response) {
          this.fetchCalendars();
        }
      },
      (error) => {
        console.log('Something went wrong');
      }
    );

  }

  changeValue(property: string, event: any) {
    this.editField = event.target.textContent;
  }
}
