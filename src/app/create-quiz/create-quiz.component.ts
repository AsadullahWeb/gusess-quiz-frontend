import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.css']
})
export class CreateQuizComponent {

  creatorName: string = '';
  quizCreated: boolean = false;
  shareLink: string = '';
  isGenerating = false;

  creatorResultsLink: string = '';

  questions: Question[] = [

    {
      text: 'What is my favorite food?',
      options: {
        A: 'Pizza',
        B: 'Biryani',
        C: 'Burger',
        D: 'Karahi'
      },
      correctAnswer: 'A'
    },

    {
      text: 'What is my favorite color?',
      options: {
        A: 'Black',
        B: 'Blue',
        C: 'Red',
        D: 'White'
      },
      correctAnswer: 'A'
    },

    {
      text: 'What is my favorite hobby?',
      options: {
        A: 'Reading',
        B: 'Gaming',
        C: 'Traveling',
        D: 'Watching Movies'
      },
      correctAnswer: 'A'
    },

    {
      text: 'What is my favorite season?',
      options: {
        A: 'Summer',
        B: 'Winter',
        C: 'Spring',
        D: 'Autumn'
      },
      correctAnswer: 'B'
    },

    {
      text: 'What is my favorite drink?',
      options: {
        A: 'Tea',
        B: 'Coffee',
        C: 'Juice',
        D: 'Cold Drink'
      },
      correctAnswer: 'A'
    },

    {
      text: 'What is my favorite place?',
      options: {
        A: 'Beach',
        B: 'Mountains',
        C: 'City',
        D: 'Village'
      },
      correctAnswer: 'B'
    },

    {
      text: 'What is my favorite movie genre?',
      options: {
        A: 'Action',
        B: 'Comedy',
        C: 'Horror',
        D: 'Romance'
      },
      correctAnswer: 'A'
    },

    {
      text: 'What is my favorite animal?',
      options: {
        A: 'Cat',
        B: 'Dog',
        C: 'Horse',
        D: 'Rabbit'
      },
      correctAnswer: 'A'
    },

    {
      text: 'What is my favorite type of music?',
      options: {
        A: 'Pop',
        B: 'Rock',
        C: 'Classical',
        D: 'Other'
      },
      correctAnswer: 'A'
    },

    {
      text: 'What do I enjoy doing most?',
      options: {
        A: 'Spending time with friends',
        B: 'Playing games',
        C: 'Watching movies',
        D: 'Traveling'
      },
      correctAnswer: 'A'
    }

  ];

  constructor(
    private router: Router,
    private quizService: QuizService
  ) {}

  saveQuiz(): void {

    // Check creator name
    if (!this.creatorName.trim()) {
      alert('Please enter your name.');
      return;
    }

    // Check all questions
    for (let i = 0; i < this.questions.length; i++) {

      const question = this.questions[i];

      if (!question.text.trim()) {
        alert(`Please enter Question ${i + 1}.`);
        return;
      }

      if (
        !question.options.A.trim() ||
        !question.options.B.trim() ||
        !question.options.C.trim() ||
        !question.options.D.trim()
      ) {
        alert(`Please fill all 4 options for Question ${i + 1}.`);
        return;
      }

      if (!question.correctAnswer) {
        alert(`Please select the correct answer for Question ${i + 1}.`);
        return;
      }
    }
this.isGenerating = true;
    // Create unique quiz ID
    const quizId = Date.now().toString();

    // Create creator key
    const creatorKey =
      Date.now().toString(36) +
      Math.random().toString(36).substring(2, 10);
      

    // Data that will be sent to backend
    const quiz = {
      quizId: quizId,
      creatorName: this.creatorName.trim(),
      questions: this.questions,
      creatorKey: creatorKey
    };

    // Send quiz to backend
    this.quizService.createQuiz(quiz).subscribe({

    next: (response) => {

      // change
 
const currentUrl = window.location.origin;

const creatorSlug = this.creatorName
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const quizSlug = `what-do-you-know-about-${creatorSlug || 'friend'}`;

this.shareLink =
  `${currentUrl}/take-quiz/${quizSlug}?id=${quizId}`;
// #change

  this.creatorResultsLink =
    `${currentUrl}/creator-results?id=${quizId}&key=${creatorKey}`;

  // Save creator's quiz information in browser
  const savedQuizzes = JSON.parse(
    localStorage.getItem('favGuessMyQuizzes') || '[]'
  );

  savedQuizzes.push({
    quizId: quizId,
    creatorName: this.creatorName.trim(),
    creatorKey: creatorKey,
    creatorResultsLink: this.creatorResultsLink,
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(
    'favGuessMyQuizzes',
    JSON.stringify(savedQuizzes)
  );

  this.quizCreated = true;

  this.isGenerating = false;

  alert('Your quiz has been created successfully!');
},

      error: (error) => {
        this.isGenerating = false;

        console.error('Create Quiz Error:', error);

        if (error.error && error.error.message) {
          alert(error.error.message);
        } else {
          alert(
            'Could not create quiz. Please make sure the backend server is running.'
          );
        }

      }

    });
  }

  copyLink(): void {

    navigator.clipboard.writeText(this.shareLink)
      .then(() => {

        alert('Quiz link copied successfully!');

      })
      .catch(() => {

        alert('Could not copy the link. Please copy it manually.');

      });
  }

  goToCreatorResults(): void {
  window.location.href = this.creatorResultsLink;
}

  createAnotherQuiz(): void {

    this.quizCreated = false;
    this.shareLink = '';
    this.creatorName = '';

  }

  goHome(): void {

    this.router.navigate(['/']);

  }

}