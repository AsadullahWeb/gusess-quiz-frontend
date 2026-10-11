import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { FormsModule } from '@angular/forms';
import { TakeQuizComponent } from './take-quiz/take-quiz.component';
import { HttpClientModule } from '@angular/common/http';
import { CreatorResultsComponent } from './creator-results/creator-results.component';
import { MyQuizzesComponent } from './my-quizzes/my-quizzes.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    CreateQuizComponent,
    TakeQuizComponent,
    CreatorResultsComponent,
    MyQuizzesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
