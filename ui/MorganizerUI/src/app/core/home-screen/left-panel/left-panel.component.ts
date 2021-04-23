import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { StoreService } from 'src/app/services/store.service';
import { ProfileModel } from 'src/app/services/model/profile-model';
import { MyCalendarModel } from 'src/app/services/model/mycalendar-model';
import { MyCalendarService } from 'src/app/services/mycalendar.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AddProfileComponent } from 'src/app/add-profile/add-profile.component';
import { ConfirmationDialogService } from 'src/app/core/confirmation-dialog/confirmation-dialog.service';

export interface MyCalendars {
  name: string;
  color: string;
  value: string;
}

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
  providers: [ConfirmationDialogService],
})
export class LeftPanelComponent implements OnInit {
  @Output() emitSelectedProfiles = new EventEmitter();
  @Output() emitSelectedCalendars = new EventEmitter();
  @Output() triggerCalendarUpdate = new EventEmitter();

  profiles: ProfileModel[] = [];
  mycalendars: MyCalendarModel[] = [];
  calendarTitle: string;
  editField: string;
  defaultProfileId: number;
  defaultCalendarId: number;
  colorPalette: Array<string> = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    //     '#03a9f4',
    //     '#00bcd4',
    '#009688',
    '#4caf50',
    //     '#8bc34a',
    //     '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
    '#795548',
    '#607d8b',
  ];

  constructor(
    private profileService: ProfileService,
    private storeService: StoreService,
    private calendarService: MyCalendarService,
    private dialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.profileService.addProfileEvent.subscribe((profile) => {
      this.profiles = this.profiles.filter(
        (profileModel) => profileModel.profileId != profile.profileId
      );
      this.profiles.push(profile);
      this.sortProfiles();
    });
  }

  sortProfiles() {
    this.profiles.sort(profileSort(this.defaultProfileId));
    function profileSort(defaultProfileId) {
      return function (a, b) {
        if (a.profileId == defaultProfileId) {
          return -1;
        }
        if (b.profileId == defaultProfileId) {
          return 1;
        }
        if (a.name == b.name) {
          return 0;
        }
        if (a.name > b.name) {
          return 1;
        } else {
          return -1;
        }
      };
    }
  }

  sortCalendars() {
    this.mycalendars.sort(calendarSort(this.defaultCalendarId));
    function calendarSort(defaultCalendarId) {
      return function (a, b) {
        if (a.calendarId == defaultCalendarId) {
          return -1;
        }
        if (b.calendarId == defaultCalendarId) {
          return 1;
        }
        if (a.name == b.name) {
          return 0;
        }
        if (a.name > b.name) {
          return 1;
        } else {
          return -1;
        }
      };
    }
  }

  fetchProfiles() {
    this.profileService
      .getAllProfile(this.storeService.loggedInUser?.id)
      .subscribe(
        (response) => {
          // this.loading = false;
          if (response) {
            this.profiles = response;
            this.sortProfiles();
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
            this.sortCalendars();
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
    this.defaultProfileId = this.storeService.loggedInUser?.defaultProfileId;
    this.defaultCalendarId = this.storeService.loggedInUser?.defaultCalendarId;
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

  deleteCalendar(calendarToDelete: any) {
    this.confirmationDialogService
      .confirm(
        'Are you sure you want to remove ' +
          calendarToDelete.name.bold() +
          ' calendar?',
        'You will no longer have access to this calendar and its events.',
        'Remove Calendar',
        'Cancel'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.calendarService
            .deleteCalendarFromList(calendarToDelete.calendarId)
            .subscribe(
              () => {
                this.fetchCalendars();
              },
              (error) => {
                console.log('Something went wrong');
                // window.alert('#TODO: Something went wrong.');
              }
            );
        }
      })
      .catch(() => {});
  }

  deleteProfile(profileToDelete: any) {
    this.confirmationDialogService
      .confirm(
        'Are you sure you want to remove ' +
          profileToDelete.name.bold() +
          "'s profile?",
        'You will no longer have access to this profile and its events.',
        'Remove Profile',
        'Cancel'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.profileService
            .deleteProfile(profileToDelete.profileId)
            .subscribe(
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
      })
      .catch(() => {});
  }

  updateProfile(profile, fetchEvents = false) {
    this.profileService.addProfile(profile).subscribe(
      (response) => {
        this.sendSelectedProfiles();
        if (fetchEvents) {
          this.triggerCalendarUpdate.emit(null);
        }
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

  updateCalendar(calendar, fetchEvents = false) {
    this.calendarService.addCalendar(calendar).subscribe(
      (response) => {
        this.sendSelectedCalendars();
        if (fetchEvents) {
          this.triggerCalendarUpdate.emit(null);
        }
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
  // updateCalendarColor(calendar) {
  //   this.updateCalendar(calendar);
  //   this.triggerCalendarUpdate.emit(null);
  // }

  // updateProfileColor(profile) {
  //   this.updateProfile(profile);
  //   this.triggerCalendarUpdate.emit(null);
  // }

  addProfile() {
    // this.storeService.createProfileEmitter.next(true);
    let profileModel = new ProfileModel();
    // eventModel.color = { primary: '', secondary: '' };
    profileModel.userId = this.storeService.loggedInUser?.id;
    let dialogRef = this.dialog.open(AddProfileComponent, {
      data: profileModel,
      width: '600px',
      height: '65%',
    });
  }

  editProfile(profile) {
    let profileModel = new ProfileModel();
    profileModel = { ...profile };
    profileModel.userId = this.storeService.loggedInUser?.id;
    let dialogRef = this.dialog.open(AddProfileComponent, {
      data: profileModel,
      width: '600px',
      height: '65%',
    });
  }

  renameCalendar(calendar: MyCalendarModel, property: string, event: any) {
    let newCalendar = new MyCalendarModel();
    const editField = event.target.textContent;
    newCalendar = { ...calendar };
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
