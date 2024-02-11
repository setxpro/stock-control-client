import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { CardModule  } from 'primeng/card'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { ToastModule } from 'primeng/toast'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './modules/home/home.component';
import {CookieService} from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: // Components que pertenceram a esse módulo...
  [
    AppComponent,
    HomeComponent
  ],
  imports: // Importação de outros modulos ou modulos do próprio angular...
  [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule, // Para trabalhar com requisições HTTP
    // PRIME NG
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
  ],
  providers: // Serviços para prover dentro do múdulo.
  [CookieService, MessageService], // Cookie
  bootstrap: [AppComponent], // Apenas para o app.module
  // exports: []// caso eu queira exportar algum component
})
export class AppModule { }
