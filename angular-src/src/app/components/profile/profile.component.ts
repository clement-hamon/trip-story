import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StoryService } from '../../services/story.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private user:Object;
  public stories:Array<Object> = [];

  constructor( private authService:AuthService, private storyService:StoryService ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
        this.user = profile.user;
        },
        err => {
          console.log(err);
          return false;
    });
    this.storyService.getAllUserStories().subscribe( data => {
      if(data){
        this.stories = data.stories;
        console.log(this.stories);
      }
    });
  }



}
