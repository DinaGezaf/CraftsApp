import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Core/Service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<any>
  ) {
    this.form = this.fb.group(
      {
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validator: this.matchingPasswords }
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { username, password } = this.form.value;
      this.authService.register(username, password).subscribe(
        (response) => {
          this.dialogRef.close();
          this.router.navigate(['/']);
        },
        (error) => {
          console.log(error);
        }
      );
    }
    
  }

  matchingPasswords(group: FormGroup): null | { matching: boolean } {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { matching: true };
  }
}
