import { Component, OnInit } from '@angular/core';
import { Question } from '../model/question';
import { defaultQuestionsTextBlob } from '../model/defaultQuestionsTextBlob';
import { QuestionService } from '../services/question.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-current-cache',
  templateUrl: './current-cache.component.html',
})

export class CurrentCacheComponent implements OnInit {
  public questionArray: Array<Question> = new Array();
  public hasData: boolean = false;
  public defaultTextBlob: defaultQuestionsTextBlob = new defaultQuestionsTextBlob();

  constructor(private questionService: QuestionService) {
  }
 
  ngOnInit(): void {
    this.questionArray = this.questionService.getQuestionObjectList();
  }  

  clearStandardCache() {
    localStorage.removeItem('questions');
    this.questionArray = new Array();
  }

  reloadStandardCache() {
    this.questionArray = this.questionService.createQuestionObjectList(this.defaultTextBlob.questionBlob);
    localStorage.setItem('questions', JSON.stringify(this.questionArray));
    this.questionArray = this.questionService.getQuestionObjectList();
  }

  downloadQuestions() {
    let tempStrings = this.questionService.getQuestionObjectListAsCSV();
    let tempBlob = new Blob(tempStrings, { type: "text/plain" });

    var link = document.createElement('a');
    var date = formatDate(new Date(), 'yyyy_MM_dd__hh_mm', 'en-US');
    var fileName = "Quiz_Questions_Cache_Download_" + date + ".csv";
    link.href = window.URL.createObjectURL(tempBlob);
    link.download = fileName;
    link.click();
    alert(`File should have downloaded to wherever you have your browser pointed at for your defult downloads. ` +
          `File is named ${fileName}`);
  }

  downloadQuestionsAsStrictText() {
    let tempStrings = this.questionService.getQuestionObjectListAsStrictText();
    let tempBlob = new Blob(tempStrings, { type: "text/plain" });

    var link = document.createElement('a');
    var date = formatDate(new Date(), 'yyyy_MM_dd__hh_mm', 'en-US');
    var fileName = "Quiz_Questions_TextBlob_Download_" + date + ".txt";
    link.href = window.URL.createObjectURL(tempBlob);
    link.download = fileName;
    link.click();
    alert(`File should have downloaded to wherever you have your browser pointed at for your defult downloads. ` +
          `File is named ${fileName}`);
  }
} 

