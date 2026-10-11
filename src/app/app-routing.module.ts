import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import {HomeComponent} from './home/home.component';
import { TakeQuizComponent } from './take-quiz/take-quiz.component';
import { CreatorResultsComponent } from './creator-results/creator-results.component';
import { MyQuizzesComponent } from './my-quizzes/my-quizzes.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'create-quiz',
    component: CreateQuizComponent
  },
  
{
  path: 'take-quiz',
  component: TakeQuizComponent
},
{
  path: 'take-quiz/:slug',
  component: TakeQuizComponent
},

  { path: 'creator-results', component: CreatorResultsComponent },
  { path: 'my-quizzes', component: MyQuizzesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
