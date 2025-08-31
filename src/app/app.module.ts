import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from '../material.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { ChatComponent } from './chat/chat/chat.component';
import { HistoryComponent } from './history/history/history.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// services, guards
import { AuthService } from './auth/auth.service';
import { ChatService } from './chat/chat.service';
import { HistoryService } from './history/history.service';
import { AuthGuard } from './auth/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    ChatComponent,
    HistoryComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    // BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    ChatService,
    HistoryService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
