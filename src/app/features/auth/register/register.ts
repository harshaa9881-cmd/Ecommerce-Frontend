
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../models/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  registerData: RegisterRequest = {
    fullName: '',
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onRegister(): void {

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registerData).subscribe({

      next: (response) => {

        this.successMessage = response.message;
        this.isLoading = false;

        this.router.navigate(['/login']);
      },

      error: (error) => {

        this.isLoading = false;

        this.errorMessage =
          error.error?.message || 'Registration failed. Please try again.';
      }

    });
  }
}
