import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: String;
  password: String;

  constructor(private authService: AuthService,
              private flashMessagesService: FlashMessagesService,
              private router:Router) { }

  ngOnInit() {
  }

  onLoginSubmit(){
    const user = {username: this.username,
                  password: this.password};

    this.authService.authenticateUser(user).subscribe(data => {
      if(data.success) {

        this.authService.storeUserData(data.token, data.user);
        this.flashMessagesService.show('User logged in',{cssClass:'alert-success', timeout:3000});
        this.router.navigate(['dashboard']);

      } else {

        this.flashMessagesService.show(data.msg,{cssClass:'alert-danger', timeout:5000});
        this.clearData();
        this.router.navigate(['login']);

      }
    });
  }

  clearData() {
    this.username = null;
    this.password = null;
  }

}
