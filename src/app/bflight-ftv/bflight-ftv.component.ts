import { Component, OnInit } from '@angular/core';
import { Question } from '../model/question';
import { defaultQuestionsTextBlob } from '../model/defaultQuestionsTextBlob';
import { QuestionService } from '../services/question.service';
import { Quiz } from '../model/quiz';
import { QuizQuestion } from '../model/quizQuestion';

@Component({
  selector: 'app-bflight-ftv',
  templateUrl: './bflight-ftv.component.html',
  styleUrls: ['./bflight-ftv.component.css']
})

export class BFlightFTVComponent implements OnInit {
  public questionArray: Array<Question> = new Array();
  public bFlightArray: Array<Question> = new Array();
  public finishTheVerseArray: Array<Question> = new Array();
  public hasData: boolean = false;
  public quizzesArray: Array<Quiz> = [];


  constructor(private questionService: QuestionService) {
  }
 
  ngOnInit(): void {
    this.questionArray = this.questionService.getQuestionObjectList();
    this.bFlightArray = this.questionArray.filter(x => x.isBFlight == true);
    this.finishTheVerseArray =  this.bFlightArray.filter(x => x.type == "FTV");

    var tempQuiz: Quiz;
    var quizQuestionArray: Array<QuizQuestion> = [];
    var finishTheVerseRandomsCount = 0;

    for (var i = 0; i < 10; i++) {
      finishTheVerseRandomsCount = 0;
      var tempQuizQuestion: QuizQuestion;
      quizQuestionArray = [];
      var finishTheVerseRandoms = this.getRandoms(26, this.finishTheVerseArray.length);

      for (var n = 1; n < 16; n++) {
        tempQuizQuestion = new QuizQuestion(this.finishTheVerseArray[finishTheVerseRandoms[finishTheVerseRandomsCount]], n.toString() + '.');
        quizQuestionArray.push(tempQuizQuestion);
        finishTheVerseRandomsCount++;
      }

      tempQuiz = new Quiz(quizQuestionArray, 'Quiz ' + (i + 1));
      this.quizzesArray.push(tempQuiz);
    }
    
  }

  getRandoms(fetchCount: number, maxValue: number) {
    var returnArray = [];

    for (var i = 0; i < fetchCount; i++) {
      const rand = Math.floor(Math.random() * (maxValue - 0) + 0);
      if (returnArray.includes(rand)) {
        i--;
      }
      else {
        returnArray.push(rand);
      }
    }

    return returnArray;
  }
} 

