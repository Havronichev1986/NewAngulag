import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User as Person } from './models/person';

@Injectable()
export class HttpService {
  [x: string]: any;
  params: HttpParams | undefined;
  private url = 'http://localhost:8080/db/persons';
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<Array<Person>>(this.url);
  }

  createUser(user: Array<Person>) {
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Person>(this.url, JSON.stringify(user), {
      headers: myHeaders,
    });
  }
  updateUser(user: Person) {
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<Person>(this.url, JSON.stringify(user), {
      headers: myHeaders,
    });
  }
  deleteUser(id: number) {
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    // this.params = new HttpParams();
    // this.params.append('id', id);
    return this.http.delete<Person>(this.url, {
      headers: myHeaders,
      body: JSON.stringify(id),
    });
  }
}
