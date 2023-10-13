import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialCovered } from '../model/materialCovered';
import { Question } from '../model/question';
import { Quiz } from '../model/quiz';
import { QuizQuestion } from '../model/quizQuestion';
import { SectionCovered } from '../model/sectionCovered';
import { QuestionService } from '../services/question.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})

export class PrintComponent implements OnInit {
  public questionArray: Array<Question> = [];
  public filteredQuestionArray: Array<Question> = [];
  public materialToIncludeArray: Array<MaterialCovered> = [];
  public sectionsToIncludeArray: Array<SectionCovered> = [];
  public quizzesArray: Array<Quiz> = [];
  public numberOfPrintPages: number = 0;
  public selectedFlight: string = 'A Flight';
  public useAllMaterial: boolean = false;
  public useStandardFormat: boolean = true;

  constructor(private questionService: QuestionService, private router: Router, private storageService: StorageService) { }

  ngOnInit(): void {
    this.questionArray = this.questionService.getQuestionObjectList();
    this.filteredQuestionArray = [];
    this.materialToIncludeArray = this.storageService.getMaterialsList();
    this.sectionsToIncludeArray = this.storageService.getSectionList();
    this.numberOfPrintPages = this.storageService.getNumberOfPrintPages();
    this.selectedFlight = this.storageService.getSelectedFlight();
    this.useAllMaterial = this.storageService.getUseAllMaterial();

    localStorage.removeItem('printMats');
    localStorage.removeItem('printSections');
    localStorage.removeItem('printPages');
    localStorage.removeItem('selectedFlight');
    localStorage.removeItem('useAllMaterial');

    if (this.materialToIncludeArray.length < 1 && this.sectionsToIncludeArray.length < 1 && this.useAllMaterial == false) {
      alert("Please select some material before trying to print");
      this.router.navigate(['']);
    }

    this.filterQuestions();
    this.generateQuizzes();
  }
  
  filterQuestions() {
    if (this.useAllMaterial == true) {
      this.filteredQuestionArray = this.questionArray;
      console.log("Used all materials checkbox");
    }
    else {
      if(this.sectionsToIncludeArray.length > 0 && this.materialToIncludeArray.length > 0)
      {
        var tempArray = [];
        this.sectionsToIncludeArray.forEach(section => {
          var sectionPart = this.questionArray.filter(x => x.section == section.section);
          sectionPart.forEach(x => {tempArray.push(x)});
        })
        this.materialToIncludeArray.forEach(material => {
          var materialPart = tempArray.filter(x => x.book == material.book && x.chapter == material.chapter);
          materialPart.forEach(x => {this.filteredQuestionArray.push(x)});
        })
        console.log("Filtered by Section and Material");
      }
      else if(this.sectionsToIncludeArray.length > 0) {
        this.sectionsToIncludeArray.forEach(section => {
          var sectionPart = this.questionArray.filter(x => x.section == section.section);
          sectionPart.forEach(x => {this.filteredQuestionArray.push(x)});
        })
        console.log("Filtered by Section");
      }
      else if(this.materialToIncludeArray.length > 0) {
        this.materialToIncludeArray.forEach(material => {
          var materialPart = this.questionArray.filter(x => x.book == material.book && x.chapter == material.chapter);
          materialPart.forEach(x => {this.filteredQuestionArray.push(x)});
        })
        console.log("Filtered by Material");
      }
    }
    
    if (this.selectedFlight.includes('B Flight')) {
      var bFlightArray = this.filteredQuestionArray.filter(x => x.isBFlight == true);
      this.filteredQuestionArray = bFlightArray;
      console.log("Filtered by B Flight");
    }
  }

  generateQuizzes() {
    console.log(this.filteredQuestionArray);
    var generalQuestionsArray = [];
    var finishTheVerseArray = [];
    var memoryQuoteArray = [];
    var accordingToArray = [];
    var situationQuestionArray = [];

    generalQuestionsArray = this.filteredQuestionArray.filter(x => x.type == "General");
    finishTheVerseArray = this.filteredQuestionArray.filter(x => x.type == "FTV");
    memoryQuoteArray = this.filteredQuestionArray.filter(x => x.type == "MQ");
    accordingToArray = this.filteredQuestionArray.filter(x => x.type == "AT");
    situationQuestionArray = this.filteredQuestionArray.filter(x => x.type == "SQ");

    finishTheVerseArray = this.reformatFinishTheVerse(finishTheVerseArray);

    for (var i = 0; i < this.numberOfPrintPages; i++) {
      var tempQuiz: Quiz;
      var quizQuestionArray: Array<QuizQuestion> = [];
      var generalRandomsCount = 0;
      var finishTheVerseRandomsCount = 0;

      if (this.useStandardFormat) {
        if (this.selectedFlight.includes('B Flight')) {

          //B flight
          if (generalQuestionsArray.length < 22) {
            alert("B Flight quizzes need at least 22 General Questions in order to be generated");
            this.router.navigate(['']);
            return;
          }
          if (finishTheVerseArray.length < 8) {
            alert("B Flight quizzes need at least 8 Finish the Verse in order to be generated");
            this.router.navigate(['']);
            return;           
          }

          //General
          var genQuestionSlots = [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 16, 17, 19, 20];
          //FTV
          var otherSlots = [4, 8, 12, 18];

          var generalRandoms = this.getRandoms(22, generalQuestionsArray.length);
          var finishTheVerseRandoms = this.getRandoms(8, finishTheVerseArray.length);   

          for (var j = 1; j < 21; j++) { 
            var tempQuizQuestion: QuizQuestion;
            if (genQuestionSlots.includes(j)) {
              tempQuizQuestion = new QuizQuestion(generalQuestionsArray[generalRandoms[generalRandomsCount]], j.toString() + '.');
              quizQuestionArray.push(tempQuizQuestion);
              generalRandomsCount += 1;
            }
            if (otherSlots.includes(j)) {
              tempQuizQuestion = new QuizQuestion(finishTheVerseArray[finishTheVerseRandoms[finishTheVerseRandomsCount]], j.toString() + '.');
              quizQuestionArray.push(tempQuizQuestion);
              finishTheVerseRandomsCount += 1;
            }                   
          }
          
          for (var k = 0; k < 4; k++) {
            tempQuizQuestion = new QuizQuestion(generalQuestionsArray[generalRandoms[generalRandomsCount]], '*');
            generalRandomsCount += 1;
            quizQuestionArray.push(tempQuizQuestion);
          }

          for (var m = 0; m < 4; m++) {
            tempQuizQuestion = new QuizQuestion(finishTheVerseArray[finishTheVerseRandoms[finishTheVerseRandomsCount]], '*');
            finishTheVerseRandomsCount += 1;
            quizQuestionArray.push(tempQuizQuestion);
          }
        }
        else {

          //A flight
          var generalRandomsCount = 0;
          var finishTheVerseRandomsCount = 0;
          var situationQuestionsRandomsCount = 0;
          var quoteRandomsCount = 0;
          var accordingToRandomsCount = 0;

          var generalRandoms = this.getRandoms(20, generalQuestionsArray.length);
          var finishTheVerseRandoms = this.getRandoms(4, finishTheVerseArray.length);
          var situationQuestionsRandoms = this.getRandoms(3, situationQuestionArray.length);
          var quoteRandoms = this.getRandoms(4, memoryQuoteArray.length);
          var accordingToRandoms  = this.getRandoms(3, accordingToArray.length);
          var whatToPick = 0;

          //SQ, AT, and General
          var genQuestionSlots = [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 16, 17, 19, 20];
          //MQ and FTV
          var otherSlots = [4, 8, 12, 18];

          var weighted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

          for (var n = 0; n < 21; n++) {

            //SQ, AT, and General
            if (genQuestionSlots.includes(n)) {
              whatToPick = Math.floor(Math.random() * (12 - 1 + 1) + 1);
              if (generalRandomsCount < 14 && weighted.includes(whatToPick)) {
                tempQuizQuestion = new QuizQuestion(generalQuestionsArray[generalRandoms[generalRandomsCount]], n.toString() + '.');
                quizQuestionArray.push(tempQuizQuestion);
                generalRandomsCount++;
              }
              else if (situationQuestionsRandomsCount < 2 && whatToPick == 11 && n != 1 && n != 20) {
                tempQuizQuestion = new QuizQuestion(situationQuestionArray[situationQuestionsRandoms[situationQuestionsRandomsCount]], n.toString() + '.');
                quizQuestionArray.push(tempQuizQuestion);
                situationQuestionsRandomsCount++;
              }
              else if (accordingToRandomsCount < 2 && whatToPick == 12 && n != 1 && n != 20) {
                tempQuizQuestion = new QuizQuestion(accordingToArray[accordingToRandoms[accordingToRandomsCount]], n.toString() + '.');
                quizQuestionArray.push(tempQuizQuestion);
                accordingToRandomsCount++;
              }
              else if (n == 1 || n == 20) {
                tempQuizQuestion = new QuizQuestion(generalQuestionsArray[generalRandoms[generalRandomsCount]], n.toString() + '.');
                quizQuestionArray.push(tempQuizQuestion);
                generalRandomsCount++;
              }
              else {
                if (generalRandomsCount < 14) {
                  tempQuizQuestion = new QuizQuestion(generalQuestionsArray[generalRandoms[generalRandomsCount]], n.toString() + '.');
                  quizQuestionArray.push(tempQuizQuestion);
                  generalRandomsCount++;
                }
                else if (situationQuestionsRandomsCount < 1) {
                  tempQuizQuestion = new QuizQuestion(situationQuestionArray[situationQuestionsRandoms[situationQuestionsRandomsCount]], n.toString() + '.');
                  quizQuestionArray.push(tempQuizQuestion);
                  situationQuestionsRandomsCount++;
                }
                else if (accordingToRandomsCount < 1) {
                  tempQuizQuestion = new QuizQuestion(accordingToArray[accordingToRandoms[accordingToRandomsCount]], n.toString() + '.');
                  quizQuestionArray.push(tempQuizQuestion);
                  accordingToRandomsCount++;
                }
              }    
            }

            //MQ and FTV
            if (otherSlots.includes(n)) {
              whatToPick = Math.floor(Math.random() * (2 - 1 + 1) + 1);
              if (finishTheVerseRandomsCount < 2 && whatToPick == 1) {
                tempQuizQuestion = new QuizQuestion(finishTheVerseArray[finishTheVerseRandoms[finishTheVerseRandomsCount]], n.toString() + '.');
                quizQuestionArray.push(tempQuizQuestion);
                finishTheVerseRandomsCount += 1;
              }
              else if (quoteRandomsCount < 2 && whatToPick == 2) {
                tempQuizQuestion = new QuizQuestion(memoryQuoteArray[quoteRandoms[quoteRandomsCount]], n.toString() + '.');
                quizQuestionArray.push(tempQuizQuestion);
                quoteRandomsCount += 1;
              }
              else {
                if (quoteRandomsCount < 2) {
                  tempQuizQuestion = new QuizQuestion(memoryQuoteArray[quoteRandoms[quoteRandomsCount]], n.toString() + '.');
                  quizQuestionArray.push(tempQuizQuestion);
                  quoteRandomsCount += 1;
                }
                else if (finishTheVerseRandomsCount < 2) {
                  tempQuizQuestion = new QuizQuestion(finishTheVerseArray[finishTheVerseRandoms[finishTheVerseRandomsCount]], n.toString() + '.');
                  quizQuestionArray.push(tempQuizQuestion);
                  finishTheVerseRandomsCount += 1;
                }
              }
            }          
          }

          //extras
          for (var o = 0; o < 4; o++) {
            tempQuizQuestion = new QuizQuestion(generalQuestionsArray[generalRandoms[generalRandomsCount]], '*');
            generalRandomsCount += 1;
            quizQuestionArray.push(tempQuizQuestion);
          }

          tempQuizQuestion = new QuizQuestion(situationQuestionArray[situationQuestionsRandoms[situationQuestionsRandomsCount]], '*');
          quizQuestionArray.push(tempQuizQuestion);
          situationQuestionsRandomsCount++;

          tempQuizQuestion = new QuizQuestion(accordingToArray[accordingToRandoms[accordingToRandomsCount]],'*');
          quizQuestionArray.push(tempQuizQuestion);
          accordingToRandomsCount++;

          for (var p = 0; p < 2; p++) {
            tempQuizQuestion = new QuizQuestion(finishTheVerseArray[finishTheVerseRandoms[finishTheVerseRandomsCount]], '*');
            finishTheVerseRandomsCount += 1;
            quizQuestionArray.push(tempQuizQuestion);
          }

          for (var q = 0; q < 2; q++) {
            tempQuizQuestion = new QuizQuestion(memoryQuoteArray[quoteRandoms[quoteRandomsCount]], '*');
            quizQuestionArray.push(tempQuizQuestion);
            quoteRandomsCount += 1;
          }
        }
      }
      tempQuiz = new Quiz(quizQuestionArray, 'Quiz ' + (i + 1));
      this.quizzesArray.push(tempQuiz);
      console.log(quizQuestionArray);
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

  reformatFinishTheVerse (passedArray: Array<Question>) {
    var returnArray = [];

    passedArray.forEach(x => {
      var temp = x.question.split(' ');
      var replaceArray = [];
      for (var i = 0; i < temp.length; i++) {
        if (i == 5) {
          replaceArray.push('  ...  ');
        }
        replaceArray.push(temp[i]);
      }
      var tempString = replaceArray.join(' ');
      x.question = tempString;
      returnArray.push(x);
    });

    return returnArray;
  }
}
