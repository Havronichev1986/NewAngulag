import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from './models/person';
import { HttpService as UserService } from './http.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgTemplateOutlet],
  templateUrl: './app.component.html',
  styles:
    'td, th{padding:3px;min-width:180px;max-width:280px;} input {width:100%}',
  providers: [UserService],
})
export class AppComponent implements OnInit {
  //типы шаблонов
  @ViewChild('readOnlyTemplate', { static: false }) readOnlyTamplate:
    | TemplateRef<any>
    | undefined;
  @ViewChild('editTemplate', { static: false }) editTemplate:
    | TemplateRef<any>
    | undefined;

  editedUser: User | null = null;
  users: Array<User>;
  isNewRecord: boolean = false;
  statusMessage: string = '';

  constructor(private serv: UserService) {
    this.users = new Array<User>();
  }

  ngOnInit() {
    this.loadUsers();
  }

  //загрузка пользователей
  private loadUsers() {
    this.serv.getUsers().subscribe((data: Array<User>) => {
      this.users = data;
    });
  }

  //добовление пользователя
  addUser() {
    this.editedUser = new User(0, '', 0);
    this.users.push(this.editedUser);
    this.isNewRecord = true;
  }

  editUser(user: User) {
    this.editedUser = new User(user.id, user.name, user.age);
  }
  //загружаеим один из двух шаблонов
  loadTemplate(user: User) {
    if (this.editedUser && this.editedUser.id === user.id) {
      return this.editTemplate;
    } else {
      return this.readOnlyTamplate;
    }
  }
  //сохраняем пользователя
  saveUser() {
    if (this.isNewRecord) {
      //добовляем пользователя
      this.serv.createUser(Array.of(this.editedUser as User)).subscribe((_) => {
        (this.statusMessage = 'Данные успешно добавлены'), this.loadUsers();
      });
      this.isNewRecord = false;
      this.editedUser = null;
    } else {
      //изменения пользователя
      this.serv.updateUser(this.editedUser as User).subscribe((_) => {
        (this.statusMessage = 'Данные успешно обновлены'), this.loadUsers();
      });
      this.editedUser = null;
    }
  }
  //отмена редактирования
  cancel() {
    //если отмена при редактировании, удаляем последнюю запись
    if (this.isNewRecord) {
      this.users.pop();
      this.isNewRecord = false;
    }
    this.editedUser = null;
  }
  //удаление пользователя
  deleteUser(user: User) {
    this.serv.deleteUser(user.id).subscribe((_) => {
      (this.statusMessage = 'Данные успешно удалены'), this.loadUsers();
    });
  }
}
