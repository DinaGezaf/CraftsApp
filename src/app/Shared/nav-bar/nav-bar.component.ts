import { CartService } from 'src/app/Core/Service/cart.service';
import { AuthService } from 'src/app/Core/Service/auth.service';
import { RegisterComponent } from './../../Components/register/register.component';
import { LoginComponent } from '../../Components/login/login.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AttentionsComponent } from '../attentions/attentions.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  isLoggedIn!: boolean;
  cartCount = 0;

  logged!: boolean;
  constructor(
    private dialog: MatDialog,
    public authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    console.log(this.cartCount);
  }
  ngOnInit(): void {
    this.cartService.cartCount$.subscribe((count) => (this.cartCount = count));

    this.authService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        localStorage.setItem('user', 'logged in');
      } else {
        localStorage.removeItem('user');
      }
    });
  }
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  openLogin() {
    this.dialog.open(LoginComponent, {
      width: '850px',
      height: '450px',
    });
  }
  openRegister() {
    this.dialog.open(RegisterComponent, {
      width: '400px',
      height: '450px',
    });
  }

  onCartClick(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/cart']);
    } else {
      const dialogRef = this.dialog.open(AttentionsComponent, {
        width: '300px',
        data: { message: 'Please log in to access your cart.' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
    }
  }
}
