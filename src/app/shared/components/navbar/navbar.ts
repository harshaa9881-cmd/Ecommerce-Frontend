
import { Component, Input, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {

  @Input() isAdmin: boolean = false;

  get cartCount$() {
  return this.cartService.cartCount$;
}

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    if (!this.isAdmin && this.authService.isLoggedIn()) {

      this.cartService.getCart().subscribe({
        error: (error) => {
          console.error('Unable to load cart count:', error);
        }
      });

    }
  }
}