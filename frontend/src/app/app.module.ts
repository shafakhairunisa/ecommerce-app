import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService
  ],
  // No bootstrap for standalone
})
export class AppModule { } 