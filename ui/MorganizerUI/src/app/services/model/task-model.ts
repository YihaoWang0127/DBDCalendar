import { endOfToday, startOfToday } from 'date-fns';

export class TaskModel {
  id: any = undefined;
  title: string;
  description: string;
  calendar: {};
  color: string;
  complete = false;
  draggable = true;
  start: Date = startOfToday();
  dueDate: Date = undefined;
  userId: number;
  todoListId: number;
  assigneeList: number[] = [];
}
