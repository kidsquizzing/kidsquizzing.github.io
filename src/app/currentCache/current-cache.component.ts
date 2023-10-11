import { Component, OnInit } from '@angular/core';
import { Question } from '../model/question';
import { defaultQuestionsTextBlob } from '../model/defaultQuestionsTextBlob';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-current-cache',
  templateUrl: './current-cache.component.html',
})

export class CurrentCacheComponent implements OnInit {
  public questionArray: Array<Question> = new Array();
  public hasData: boolean = false;

  constructor(private questionService: QuestionService) {
  }

  ngOnInit(): void {
    this.questionArray = this.questionService.getQuestionObjectList();
  }  

  clearStandardCache() {
    localStorage.removeItem('questions');
    this.questionArray = new Array();
  }
} 

