import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';

interface Question {
  text: string;

  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };

  correctAnswer: string;
}

interface Quiz {
  quizId: string;
  creatorName: string;
  questions: Question[];
}

interface QuizResult {
  resultId: string;
  friendName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  position?: number;
}

@Component({
  selector: 'app-take-quiz',
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.css']
})
export class TakeQuizComponent implements OnInit {

  quiz: Quiz | null = null;

  friendName: string = '';

  quizStarted: boolean = false;

  quizFinished: boolean = false;

  currentQuestionIndex: number = 0;

  selectedAnswer: string = '';

  answerChecked: boolean = false;

  score: number = 0;

  quizId: string = '';

  // ================================
  // RANKING
  // ================================

  ranking: QuizResult[] = [];

  // ================================
  // CURRENT RESULT
  // ================================

  currentResultId: string = '';

  // ================================
  // SAVED RESULT SCREEN
  // ================================

  showSavedResult: boolean = false;

  savedResult: QuizResult | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService
  ) {}


  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      this.quizId = params['id'];

      if (!this.quizId) {

        alert('Quiz link is invalid.');

        this.router.navigate(['/']);

        return;
      }

      this.loadQuiz();

    });

  }


  // ================================
  // LOAD QUIZ FROM BACKEND
  // ================================

  loadQuiz(): void {

    this.quizService.getQuiz(this.quizId).subscribe({

      next: (quizData: Quiz) => {

        console.log(
          'Quiz loaded from backend:',
          quizData
        );

        this.quiz = quizData;

        // Load current ranking from MongoDB
        this.loadRanking();

      },

      error: (error) => {

        console.error(
          'Load Quiz Error:',
          error
        );

        if (error.status === 404) {

          alert(
            'This quiz could not be found.'
          );

        } else {

          alert(
            'Could not load the quiz. Please make sure the backend server is running.'
          );

        }

        this.router.navigate(['/']);

      }

    });

  }


  // ================================
  // START QUIZ
  // ================================

  startQuiz(): void {

    if (!this.friendName.trim()) {

      alert(
        'Please enter your name.'
      );

      return;
    }

    this.friendName =
      this.friendName.trim();

    this.quizStarted = true;

    this.quizFinished = false;

    this.showSavedResult = false;

    this.currentQuestionIndex = 0;

    this.score = 0;

    this.selectedAnswer = '';

    this.answerChecked = false;

  }


  // ================================
  // SELECT ANSWER
  // ================================

  selectAnswer(answer: string): void {

    if (this.answerChecked) {

      return;

    }

    this.selectedAnswer = answer;

    this.answerChecked = true;


    if (
      this.quiz &&
      this.quiz.questions[
        this.currentQuestionIndex
      ].correctAnswer === answer
    ) {

      this.score++;

    }

  }


  // ================================
  // NEXT QUESTION
  // ================================

  nextQuestion(): void {

    if (!this.quiz) {

      return;

    }


    if (
      this.currentQuestionIndex <
      this.quiz.questions.length - 1
    ) {

      this.currentQuestionIndex++;

      this.selectedAnswer = '';

      this.answerChecked = false;

    } else {

      // Quiz completed

      this.quizFinished = true;

      this.quizStarted = false;

      // Save result to MongoDB

      this.saveResult();

    }

  }


  // ================================
  // PERCENTAGE
  // ================================

  getPercentage(): number {

    if (
      !this.quiz ||
      this.quiz.questions.length === 0
    ) {

      return 0;

    }

    return Math.round(
      (this.score /
        this.quiz.questions.length) *
      100
    );

  }


  // ================================
  // CORRECT ANSWER TEXT
  // ================================

  getCorrectAnswerText(): string {

    if (!this.quiz) {

      return '';

    }

    const question =
      this.quiz.questions[
        this.currentQuestionIndex
      ];

    const correctAnswer =
      question.correctAnswer as keyof typeof question.options;

    return question.options[
      correctAnswer
    ];

  }


  // ================================
  // OPTION COLOR
  // ================================

  getOptionClass(option: string): string {

    if (
      !this.answerChecked ||
      !this.quiz
    ) {

      return '';

    }

    const correctAnswer =
      this.quiz.questions[
        this.currentQuestionIndex
      ].correctAnswer;


    if (option === correctAnswer) {

      return 'correct';

    }


    if (
      option === this.selectedAnswer &&
      option !== correctAnswer
    ) {

      return 'wrong';

    }

    return '';

  }


  // ================================
  // LOAD RANKING FROM MONGODB
  // ================================

  loadRanking(): void {

    if (!this.quizId) {

      return;

    }


    this.quizService
      .getResults(this.quizId)
      .subscribe({

        next: (results: QuizResult[]) => {

          console.log(
            'Ranking loaded from backend:',
            results
          );

          this.ranking = results;

        },

        error: (error) => {

          console.error(
            'Load Ranking Error:',
            error
          );

          this.ranking = [];

        }

      });

  }


  // ================================
  // SAVE RESULT TO MONGODB
  // ================================

  saveResult(): void {

    if (!this.quiz) {

      return;

    }


    const result: QuizResult = {

      resultId:
        this.generateResultId(),

      friendName:
        this.friendName,

      score:
        this.score,

      totalQuestions:
        this.quiz.questions.length,

      percentage:
        this.getPercentage(),

      date:
        new Date().toISOString()

    };


    // Save current result ID

    this.currentResultId =
      result.resultId;


    console.log(
      'Saving result:',
      result
    );


    this.quizService
      .saveResult(
        this.quizId,
        result
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Result saved successfully:',
            response
          );

          // Load all results after saving
          this.loadRanking();

        },

        error: (error) => {

          console.error(
            'Save Result Error:',
            error
          );

          alert(
            'Your result could not be saved. Please make sure the backend server is running.'
          );

        }

      });

  }


  // ================================
  // GENERATE RESULT ID
  // ================================

  generateResultId(): string {

    return (
      Date.now().toString(36) +
      Math.random()
        .toString(36)
        .substring(2, 8)
    ).toUpperCase();

  }


  // ================================
  // CURRENT RANK
  // ================================

  getCurrentRank(): number {

    if (!this.currentResultId) {

      return 0;

    }


    const index =
      this.ranking.findIndex(
        result =>
          result.resultId ===
          this.currentResultId
      );


    if (index === -1) {

      return 0;

    }


    return index + 1;

  }


  // ================================
  // FIND RESULT BY ID
  // ================================

  findSavedResult(): void {

    const resultId =
      this.currentResultId.trim();


    if (!resultId) {

      alert(
        'Please enter your Result ID.'
      );

      return;

    }


    this.quizService
      .getResults(this.quizId)
      .subscribe({

        next: (results: QuizResult[]) => {

          this.ranking = results;


          const result =
            this.ranking.find(
              item =>
                item.resultId === resultId
            );


          if (!result) {

            alert(
              'Result not found. Please check your Result ID.'
            );

            return;

          }


          this.savedResult = result;

          this.friendName =
            result.friendName;

          this.score =
            result.score;

          this.currentResultId =
            result.resultId;

          this.showSavedResult =
            true;

        },

        error: (error) => {

          console.error(
            'Find Result Error:',
            error
          );

          alert(
            'Could not load results.'
          );

        }

      });

  }


  // ================================
  // OPEN SAVED RESULT
  // ================================

  openSavedResult(): void {

    this.showSavedResult = true;

    this.loadRanking();

  }


  // ================================
  // CLOSE SAVED RESULT
  // ================================

  closeSavedResult(): void {

    this.showSavedResult = false;

    this.savedResult = null;

  }


  // ================================
  // PLAY AGAIN
  // ================================

  playAgain(): void {

    this.quizFinished = false;

    this.quizStarted = true;

    this.showSavedResult = false;

    this.currentQuestionIndex = 0;

    this.selectedAnswer = '';

    this.answerChecked = false;

    this.score = 0;

  }


  // ================================
  // HOME
  // ================================

  goHome(): void {

    this.router.navigate(['/']);

  }

}