import { Component, OnInit } from '@angular/core';
import { Question } from '../model/question';
import { defaultQuestionsTextBlob } from '../model/defaultQuestionsTextBlob';
import { QuestionService } from '../services/question.service';
import { Quiz } from '../model/quiz';
import { QuizQuestion } from '../model/quizQuestion';

@Component({
  selector: 'app-aflight-ftv',
  templateUrl: './aflight-ftv.component.html',
  styleUrls: ['./aflight-ftv.component.css']
})

export class AFlightFTVComponent implements OnInit {
  public questionArray: Array<Question> = new Array();
  public finishTheVerseArray: Array<Question> = new Array();
  public memoryQuoteArray: Array<Question> = new Array();
  public hasData: boolean = false;
  public quizzesArray: Array<Quiz> = [];

  constructor(private questionService: QuestionService) {
  }
 
  ngOnInit(): void {
    this.questionArray = this.questionService.getQuestionObjectList();
    this.finishTheVerseArray =  this.questionArray.filter(x => x.type == "FTV");
    var tempArray = this.questionArray.filter(x => x.type == "FTV");
    this.memoryQuoteArray = this.reformatToMemoryQuote(tempArray);

    var tempQuiz: Quiz;
    var quizQuestionArray: Array<QuizQuestion> = [];
    var finishTheVerseRandomsCount = 0;
    var quoteRandomsCount = 0;

    for (var i = 0; i < 10; i++) {
      finishTheVerseRandomsCount = 0;
      quoteRandomsCount = 0;
      var tempQuizQuestion: QuizQuestion;
      quizQuestionArray = [];
      var finishTheVerseRandoms = this.getRandoms(this.finishTheVerseArray.length, this.finishTheVerseArray.length);
      var quoteRandoms = this.getRandoms(this.memoryQuoteArray.length, this.memoryQuoteArray.length);
      var whatToPick = 0;

      for (var n = 1; n < 16; n++) {
        whatToPick = Math.floor(Math.random() * (2 - 1 + 1) + 1);
        if (finishTheVerseRandomsCount < 11 && whatToPick == 1) {
          tempQuizQuestion = new QuizQuestion(this.finishTheVerseArray[finishTheVerseRandoms[finishTheVerseRandomsCount]], n.toString() + '.');
          quizQuestionArray.push(tempQuizQuestion);
          finishTheVerseRandomsCount += 1;
        }
        else if (quoteRandomsCount < 6 && whatToPick == 2) {
          tempQuizQuestion = new QuizQuestion(this.memoryQuoteArray[quoteRandoms[quoteRandomsCount]], n.toString() + '.');
          quizQuestionArray.push(tempQuizQuestion);
          quoteRandomsCount += 1;
        }
        else {
          if (finishTheVerseRandomsCount < 11) {
            tempQuizQuestion = new QuizQuestion(this.finishTheVerseArray[finishTheVerseRandoms[finishTheVerseRandomsCount]], n.toString() + '.');
            quizQuestionArray.push(tempQuizQuestion);
            finishTheVerseRandomsCount += 1;
          }
          else if (quoteRandomsCount < 6) {
            tempQuizQuestion = new QuizQuestion(this.memoryQuoteArray[quoteRandoms[quoteRandomsCount]], n.toString() + '.');
            quizQuestionArray.push(tempQuizQuestion);
            quoteRandomsCount += 1;
          }        
        }
      }

      tempQuiz = new Quiz(quizQuestionArray, 'Quiz ' + (i + 1));
      this.quizzesArray.push(tempQuiz);
    }  
  }

  reformatToMemoryQuote(passedArray: Array<Question>) {
    var returnArray = [];

    passedArray.forEach(x => {
      var temp = new Question(x.book, x.chapter, x.verse, x.section, "MQ", false, false,
      "Quote " + x.book + " " + x.chapter + ":" + x.verse + "?", x.question);   
      returnArray.push(temp);
    });

    return returnArray;
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

