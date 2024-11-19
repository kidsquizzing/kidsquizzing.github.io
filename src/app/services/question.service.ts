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
    if (questionsJson == null) return [];
    var parsedJson = JSON.parse(questionsJson);
    for (var i = 0; i < parsedJson.length; i++) {
      var tempQuestion = new Question(parsedJson[i].book, parsedJson[i].chapter, parsedJson[i].verse, parsedJson[i].section, parsedJson[i].type,
        parsedJson[i].isBFlight, parsedJson[i].isUnpublished, parsedJson[i].question, parsedJson[i].answer);
      questionArray.push(tempQuestion);
    }

    return questionArray;
  }

  getQuestionObjectListAsCSV() {
    var stringCSVArray: Array<string> = [];
    var questionsJson = localStorage.getItem('questions');
    if (questionsJson == null) {
      alert("Failed to read questions from local storage");
      return [];
    } 
    var parsedJson = JSON.parse(questionsJson);

    var headerLine = "Book|Chapter|Verse|Section|Type|isBFlight|isUnpublished|Question|Answer";
    stringCSVArray.push(headerLine + "\n");

    for (var i = 0; i < parsedJson.length; i++) {
      var tempLine = parsedJson[i].book + '|' + parsedJson[i].chapter + '|' + parsedJson[i].verse + '|' + parsedJson[i].section + '|' + parsedJson[i].type + '|' + 
      parsedJson[i].isBFlight + '|' +  parsedJson[i].isUnpublished + '|' +  parsedJson[i].question + '|' +  parsedJson[i].answer + '\n';

        stringCSVArray.push(tempLine);
    }

    if (stringCSVArray.length > 1) {
      return stringCSVArray;
    }
    else {
      alert("Failed to create file.");
      return [];
    }
  }

  getQuestionObjectListAsStrictText() {
    var stringCSVArray: Array<string> = [];
    var questionsJson = localStorage.getItem('questions');
    if (questionsJson == null) {
      alert("Failed to read questions from local storage");
      return [];
    } 
    var parsedJson = JSON.parse(questionsJson);

    var headerLine = '"Book|Chapter|Verse|Section|Type|isBFlight|isUnpublished|Question|Answer\\n" +' + "\n";
    stringCSVArray.push(headerLine);

    for (var i = 0; i < parsedJson.length; i++) {
      let tempQuestion: string = parsedJson[i].question;
      let escapedQuestion: string = tempQuestion.replaceAll('"', '\\"');

      let escapedAnswer: string = '';
      if (parsedJson[i].type != 'FTV') {
        let tempAnswer: string = parsedJson[i].answer;
        let removeCarriageReturn = tempAnswer.replaceAll('\r', '');
        escapedAnswer = removeCarriageReturn.replaceAll('"', '\\"');
      }
    
      var tempLine = '"' + parsedJson[i].book + '|' + parsedJson[i].chapter + '|' + parsedJson[i].verse + '|' + parsedJson[i].section + '|' + parsedJson[i].type + '|' + 
        parsedJson[i].isBFlight + '|' +  parsedJson[i].isUnpublished + '|' +  escapedQuestion + '|' + escapedAnswer + '\\n" +' + "\n";

        stringCSVArray.push(tempLine);
    }

    if (stringCSVArray.length > 1) {
      return stringCSVArray;
    }
    else {
      alert("Failed to create file.");
      return [];
    }
  }
}
