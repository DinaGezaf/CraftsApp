import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Core/Service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoggedIn: boolean = true;
  user: any;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<any>,
    private snackBar:MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    const username = this.username?.value;
    const password = this.password?.value;
    this.authService.login(username, password).subscribe(
      () => {
        this.dialogRef.close();
        this.isLoggedIn = this.authService.LoggedIn();
        this.router.navigate(['/']);
        this.user = localStorage.getItem('username');
        const config = new MatSnackBarConfig();
        config.duration = 3000;
        config.verticalPosition = 'top';
        this.snackBar.open('Welcome ' + this.user, '', config);
      },
      (error) => console.error(error)
    );
  }
}
