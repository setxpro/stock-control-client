import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'stock-control';

  constructor(private primeNgConfig: PrimeNGConfig) {}

  ngOnInit(): void {
    // Animations and buttons
    this.primeNgConfig.ripple = true;
  }
}
