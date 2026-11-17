import { Component } from '@angular/core';
import { RouterLink,RouterOutlet } from '@angular/router';

import { Navbar } from '../../../../shared/components/navbar/navbar';
import { Footer } from '../../../../shared/components/footer/footer';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [Navbar, Footer, RouterLink, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

}