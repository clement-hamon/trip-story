import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name:String;
  username:String;
  password:String;
  email:String;

  constructor( private validateService: ValidateService,
               private flashMessagesService:FlashMessagesService,
               private authService:AuthService,
               private router: Router) { }

  onRegisterSubmit(){
    const user = {
      name: this.name,
      username: this.username,
      password: this.password,
      email:this.email
    }
    if(!this.validateService.validateRegistration(user)){
      this.flashMessagesService.show('Please fill in all the fields',{cssClass:'alert-danger', timeout:3000});
      return false;
    }
    if(!this.validateService.validateEmail(user.email)){
      this.flashMessagesService.show('Please enter a correct email address',{cssClass:'alert-danger', timeout:3000});
      return false;
    }
    this.authService.registerUser(user).subscribe(data => {
      if(data){
        this.flashMessagesService.show('Successfully registered',{cssClass:'alert-success', timeout:3000});
        this.router.navigate(['/login']);
      } else {
        this.flashMessagesService.show('Something went wrong',{cssClass:'alert-danger', timeout:3000});
        this.router.navigate(['/register']);
      }
    })
  }

  ngOnInit() {
  }

}
