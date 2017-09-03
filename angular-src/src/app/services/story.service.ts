import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class StoryService {
  user: any;

  constructor(private http:Http) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  saveStory(story){
    // build the http request to the server
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    story.author = this.user.id;
    // send the post request and return the result json
    return this.http.post('http://localhost:3000/stories',story, {headers: headers} ).map(res => res.json());
  }

  getAllUserStories(){
    // build the http request to the server
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // send the post request and return the result json
    return this.http.get('http://localhost:3000/users/'+ this.user.id +'/stories', {headers: headers} ).map(res => res.json());
  }

}
