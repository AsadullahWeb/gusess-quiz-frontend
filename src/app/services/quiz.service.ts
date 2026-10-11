import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {


private apiUrl = 'https://favguess-backend.vercel.app/api/quizzes';
private resultApiUrl = 'https://favguess-backend.vercel.app/api/results';


  constructor(private http: HttpClient) {}

  // =========================
  // CREATE QUIZ
  // =========================
  createQuiz(quiz: any): Observable<any> {
    return this.http.post(this.apiUrl, quiz);
  }

  // =========================
  // GET QUIZ
  // =========================
  getQuiz(quizId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${quizId}`);
  }

  // =========================
  // SAVE RESULT
  // =========================
  saveResult(quizId: string, result: any): Observable<any> {
    return this.http.post(
      `${this.resultApiUrl}/${quizId}`,
      result
    );
  }

  // =========================
  // GET ALL RESULTS
  // =========================
  getResults(quizId: string): Observable<any> {
    return this.http.get(
      `${this.resultApiUrl}/${quizId}`
    );
  }

  // =========================
// GET CREATOR RESULTS
// =========================
getCreatorResults(
  quizId: string,
  creatorKey: string
): Observable<any> {

  return this.http.get(
    `${this.apiUrl}/${quizId}/results?creatorKey=${creatorKey}`
  );

}
}