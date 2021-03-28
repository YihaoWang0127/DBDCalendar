import {
  Component,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { getTime } from 'date-fns';
import { TodoListService } from 'src/app/services/todo-list.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
  animations: [
    trigger('todoInOutAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(150%)' }),
        animate('0.5s'),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(200%)' }),
        animate('1s ease-in'),
      ]),
    ]),
  ],
})
export class EditTaskComponent implements OnInit {

  public enableMeridian = true;
  public defaultTime = [new Date().getHours, 0];
  
  selectedCalendar = new FormControl();
  @Input() data;
  @Input() taskIndex;
  @Output() closeEmitter = new EventEmitter();

  calendarList = [];

  assigneeList = [
    { name: 'Sharad', id: 1 },
    { name: 'Satyen', id: 2 },
    { name: 'Dhananjay', id: 3 },
    { name: 'Asmi', id: 4 },
    { name: 'Khushboo', id: 5 },
  ];

  constructor(private taskService: TodoListService) {}

  ngOnInit(): void {
    this.getCalendarList();
  }
  closeEditMode() {
    this.closeEmitter.emit(null);
  }

  getCalendarList() {
    this.calendarList.push({
      name: 'Personal',
      id: '1',
      color: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
    });
    this.calendarList.push({
      name: 'Work',
      id: '2',
      color: {
        primary: '#1e91DF',
        secondary: '#D1E8FF',
      },
    });
    this.calendarList.push({
      name: 'College',
      id: '3',
      color: {
        primary: '#1e90DF',
        secondary: '#D1E8CF',
      },
    });
    if (this.data[this.taskIndex].calendar?.length > 0) {
      this.selectedCalendar.setValue(this.data[this.taskIndex].calendar);
    }
  }
  removeTask() {
    this.taskService.deleteTask(this.data[this.taskIndex].id).subscribe(
      () => {},
      (error) => {
        console.log(error);
      }
    );
    this.data.splice(this.taskIndex, 1);
    this.closeEmitter.emit('remove');
  }
  updateSelectedCalendar() {
    this.data[this.taskIndex].calendar = this.selectedCalendar.value;
    this.data[this.taskIndex].color = this.selectedCalendar.value.color.primary;
  }
  selectSavedValues(c1: any, c2: any) {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
