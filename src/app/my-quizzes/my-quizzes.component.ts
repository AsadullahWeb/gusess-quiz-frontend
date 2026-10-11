import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface SavedQuiz {
  quizId: string;
  creatorName: string;
  creatorKey: string;
  creatorResultsLink: string;
  createdAt: string;
}

@Component({
  selector: 'app-my-quizzes',
  templateUrl: './my-quizzes.component.html',
  styleUrls: ['./my-quizzes.component.css']
})
export class MyQuizzesComponent implements OnInit {

  quizzes: SavedQuiz[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    const savedQuizzes = localStorage.getItem('favGuessMyQuizzes');

    if (savedQuizzes) {
      this.quizzes = JSON.parse(savedQuizzes);
    }
  }

  viewResults(quiz: SavedQuiz): void {
    this.router.navigate(['/creator-results'], {
      queryParams: {
        id: quiz.quizId,
        key: quiz.creatorKey
      }
    });
  }

  takeQuiz(quiz: SavedQuiz): void {
    this.router.navigate(['/take-quiz'], {
      queryParams: {
        id: quiz.quizId
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}