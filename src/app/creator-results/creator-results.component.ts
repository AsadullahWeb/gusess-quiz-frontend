import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';

interface CreatorResult {
  resultId: string;
  friendName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  position: number;
}

interface CreatorResultsResponse {
  quizId: string;
  creatorName: string;
  totalParticipants: number;
  results: CreatorResult[];
}

@Component({
  selector: 'app-creator-results',
  templateUrl: './creator-results.component.html',
  styleUrls: ['./creator-results.component.css']
})
export class CreatorResultsComponent implements OnInit {

  quizId: string = '';

  creatorKey: string = '';

  creatorName: string = '';

  results: CreatorResult[] = [];

  totalParticipants: number = 0;

  loading: boolean = true;

  errorMessage: string = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService
  ) {}


  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      this.quizId = params['id'];

      this.creatorKey = params['key'];

      if (!this.quizId || !this.creatorKey) {

        this.errorMessage =
          'Invalid results link.';

        this.loading = false;

        return;

      }

      this.loadResults();

    });

  }


  // ================================
  // LOAD CREATOR RESULTS
  // ================================

  loadResults(): void {

    this.loading = true;

    this.errorMessage = '';


    this.quizService
      .getCreatorResults(
        this.quizId,
        this.creatorKey
      )
      .subscribe({

        next: (response: CreatorResultsResponse) => {

          console.log(
            'Creator Results:',
            response
          );

          this.creatorName =
            response.creatorName;

          this.totalParticipants =
            response.totalParticipants;

          this.results =
            response.results;

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Creator Results Error:',
            error
          );

          this.loading = false;

          if (error.status === 403) {

            this.errorMessage =
              'Access denied. Invalid creator key.';

          } else if (error.status === 404) {

            this.errorMessage =
              'Quiz not found.';

          } else {

            this.errorMessage =
              'Could not load results. Please make sure the backend server is running.';

          }

        }

      });

  }


  // ================================
  // FORMAT DATE
  // ================================

  formatDate(date: string): string {

    return new Date(date).toLocaleString();

  }


  // ================================
  // HOME
  // ================================

  goHome(): void {

    this.router.navigate(['/']);

  }

}