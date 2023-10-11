import { Injectable } from '@angular/core';
import { Question } from '../model/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor() { }

  createQuestionObjectList(text) {
    var lines = text.split("\n");
    var questionArray: Array<Question> = [];

    var headers = lines[0].split("|");
    for (var i = 1; i < lines.length - 1; i++) {
      var currentline = lines[i].split("|");
      var tempQuestion = new Question(currentline[0], currentline[1], currentline[2], currentline[3], currentline[4], currentline[5], currentline[6],
        currentline[7], currentline[8]);
      questionArray.push(tempQuestion);
    }

    return questionArray
  }

  getQuestionObjectList() {
    var questionArray: Array<Question> = [];
    var questionsJson = localStorage.getItem('questions');
    var parsedJson = JSON.parse(questionsJson);
    for (var i = 0; i < parsedJson.length; i++) {
      var tempQuestion = new Question(parsedJson[i].book, parsedJson[i].chapter, parsedJson[i].verse, parsedJson[i].section, parsedJson[i].type,
        parsedJson[i].isBFlight, parsedJson[i].isUnpublished, parsedJson[i].question, parsedJson[i].answer);
      questionArray.push(tempQuestion);
    }

    return questionArray;
  }
}
