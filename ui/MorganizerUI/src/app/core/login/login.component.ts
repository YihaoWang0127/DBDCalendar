import { Component, Injectable, OnInit, Input } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { flipAnimation, headShakeAnimation } from 'angular-animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [headShakeAnimation(), flipAnimation()],
})
export class LoginComponent implements OnInit {
  @Input() clickedSignUp: string;
  loginFailed = false;
  viewRendered = false;
  errorMessage: any;
  loginForm: FormGroup;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }
  createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {}
  ngAfterContentInit() {
    this.viewRendered = true;
  }
  login() {
    this.loginFailed = false;
    this.loginService
      .validateCredentials(
        this.loginForm.get('username').value,
        this.loginForm.get('password').value
      )
      .subscribe(
        (response) => {
          this.router.navigateByUrl('home');
        },
        (error) => {
          this.loginFailed = true;
          console.log(error);
          this.errorMessage = error.error;
        }
      );
  }

  goToRegister() {
    // this.clickedSignUp = 'true';
    this.router.navigateByUrl('register');
  }
  animDone(event) {
    this.loginFailed = false;
  }
}
