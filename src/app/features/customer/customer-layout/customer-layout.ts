
import { Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [Navbar, Footer],
  templateUrl: './customer-layout.html',
  styleUrls: ['./customer-layout.css']
})
export class CustomerLayout {

}
