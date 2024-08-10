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
  public newSectionArray: Array<SectionCovered> = [];
  public oldSectionArray: Array<SectionCovered> = [];
  public quizzesArray: Array<Quiz> = [];
  public numberOfPrintPages: number = 0;
  public selectedFlight: string = 'A Flight';
  public useAllMaterial: boolean = false;
  public useStandardFormat: boolean = true;
  public useOldAndNewDistribution: boolean = false;

  constructor(private questionService: QuestionService, private router: Router, private storageService: StorageService) { }

  ngOnInit(): void {
    this.questionArray = this.questionService.getQuestionObjectList();
    this.filteredQuestionArray = [];
    this.materialToIncludeArray = this.storageService.getMaterialsList();
    this.sectionsToIncludeArray = this.storageService.getSectionList();
    this.numberOfPrintPages = this.storageService.getNumberOfPrintPages();
    this.selectedFlight = this.storageService.getSelectedFlight();
    this.useAllMaterial = this.storageService.getUseAllMaterial();
    this.newSectionArray = this.storageService.getNewSectionList();
    this.oldSectionArray = this.storageService.getOldSectionList();

    localStorage.removeItem('printMats');
    localStorage.removeItem('printSections');
    localStorage.removeItem('printPages');
    localStorage.removeItem('selectedFlight');
    localStorage.removeItem('useAllMaterial');
    localStorage.removeItem('printNewSections');
    localStorage.removeItem('printOldSections');

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

    if (this.newSectionArray.length > 0 && this.oldSectionArray.length > 0 && this.useAllMaterial) {
      var oldSectionsList = [];
      var newSectionsList = [];
      this.oldSectionArray.forEach((item) => {
        oldSectionsList.push(item.section);
      })
      this.newSectionArray.forEach((item) => {
        newSectionsList.push(item.section);
      })

      this.filteredQuestionArray.forEach((item) => {
        if (oldSectionsList.includes(item.section)) {
          item.isNew = false;
        }
      })

      this.useOldAndNewDistribution = true;
      console.log("Filtered by Old and New Sections");
    } 
  }

  generateQuizzes() {
    var generalQuestionsArray = [];
    var generalUnpublishedQuestionsArray = [];
    var generalOldQuestionArray = [];
    var generalNewQuestionArray = [];
    var generalUnpublishedOldQuestionArray = [];
    var generalUnpublishedNewQuestionArray = [];
    var finishTheVerseArray = [];
    var memoryQuoteArray = [];
    var accordingToArray = [];
    var situationQuestionArray = [];

    generalQuestionsArray = this.filteredQuestionArray.filter(x => x.type == "General" && x.isUnpublished == false);
    generalUnpublishedQuestionsArray = this.filteredQuestionArray.filter(x => x.type == "General" && x.isUnpublished == true);
    generalNewQuestionArray = this.filteredQuestionArray.filter(x => x.type == "General" && x.isUnpublished == false && x.isNew == true);
    generalOldQuestionArray = this.filteredQuestionArray.filter(x => x.type == "General" && x.isUnpublished == false && x.isNew == false);
    generalUnpublishedNewQuestionArray = this.filteredQuestionArray.filter(x => x.type == "General" && x.isUnpublished == true && x.isNew == true);
    generalUnpublishedOldQuestionArray = this.filteredQuestionArray.filter(x => x.type == "General" && x.isUnpublished == true && x.isNew == false);
    memoryQuoteArray = this.reformatToMemoryQuote(this.filteredQuestionArray.filter(x => x.type == "FTV"));
    finishTheVerseArray = this.reformatFinishTheVerse(this.filteredQuestionArray.filter(x => x.type == "FTV"));
    accordingToArray = this.filteredQuestionArray.filter(x => x.type == "AT");
    situationQuestionArray = this.filteredQuestionArray.filter(x => x.type == "SQ");

    for (var i = 0; i < this.numberOfPrintPages; i++) {
      var tempQuiz: Quiz;
      var quizQuestionArray: Array<QuizQuestion> = [];
      var generalRandomsCount = 0;
      var finishTheVerseRandomsCount = 0;

      if (this.useStandardFormat) {
        if (this.useOldAndNewDistribution) {
          if (this.selectedFlight.includes('B Flight')) {

            //B flight
            //General
            var genQuestionSlots = [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 16, 17, 19, 20];
            //FTV
            var otherSlots = [4, 8, 12, 18];
  
            var generalOldRandoms = this.getRandoms(11, generalOldQuestionArray.length);
            var generalNewRandoms = this.getRandoms(11, generalNewQuestionArray.length);
            var finishTheVerseRandoms = this.getRandoms(8, finishTheVerseArray.length);   
            
            var oldCount = 0;
            var newCount = 0;
            var oldOrNew = 0;

            for (var j = 1; j < 21; j++) { 
              oldOrNew = Math.floor(Math.random() * (2 - 1 + 1) + 1);
              var tempQuizQuestion: QuizQuestion;
              if (genQuestionSlots.includes(j)) {
                if (oldOrNew == 1 && newCount < 11) {
                  tempQuizQuestion = new QuizQuestion(generalNewQuestionArray[generalNewRandoms[newCount]], j.toString() + '.');
                  quizQuestionArray.push(tempQuizQuestion);
                  newCount += 1;
                }
                else if (oldOrNew == 2 && oldCount < 11) {
                  tempQuizQuestion = new QuizQuestion(generalOldQuestionArray[generalOldRandoms[oldCount]], j.toString() + '.');
                  quizQuestionArray.push(tempQuizQuestion);
                  oldCount += 1;
                }
                else if (newCount < 11) {
                  tempQuizQuestion = new QuizQuestion(generalNewQuestionArray[generalNewRandoms[newCount]], j.toString() + '.');
                  quizQuestionArray.push(tempQuizQuestion);
                  newCount += 1;
                }
                else if (oldCount < 11) {
                  tempQuizQuestion = new QuizQuestion(generalOldQuestionArray[generalOldQuestionArray[oldCount]], j.toString() + '.');
                  quizQuestionArray.push(tempQuizQuestion);
                  oldCount += 1;
                }
              }
              if (otherSlots.includes(j)) {
                tempQuizQuestion = new QuizQuestion(finishTheVerseArray[finishTheVerseRandoms[finishTheVerseRandomsCount]], j.toString() + '.');
                quizQuestionArray.push(tempQuizQuestion);
                finishTheVerseRandomsCount += 1;
              }                   
            }
            
            for (var k = newCount; k < 11; k++) {
              tempQuizQuestion = new QuizQuestion(generalNewQuestionArray[generalNewRandoms[newCount]], '*');
              quizQuestionArray.push(tempQuizQuestion);
              newCount += 1;
            }

            for (var l = oldCount; l < 11; l++) {
              tempQuizQuestion = new QuizQuestion(generalOldQuestionArray[generalOldRandoms[oldCount]], '*');
              quizQuestionArray.push(tempQuizQuestion);
              oldCount += 1;
            }
  
            for (var m = 0; m < 4; m++) {
              tempQuizQuestion = new QuizQuestion(finishTheVerseArray[finishTheVerseRandoms[finishTheVerseRandomsCount]], '*');
              finishTheVerseRandomsCount += 1;
              quizQuestionArray.push(tempQuizQuestion);
            }
          }
          else {           
            //A flight
            var generalNewRandomsCount = 0;
            var generalOldRandomsCount = 0;
            var unpublishedRandomsCount = 0;
            //var unpublishedNewRandomsCount = 0;
            var finishTheVerseRandomsCount = 0;
            var situationQuestionsRandomsCount = 0;
            var quoteRandomsCount = 0;
            var accordingToRandomsCount = 0;

            var generalOldRandoms = this.getRandoms(25, generalOldQuestionArray.length);
            var generalNewRandoms = this.getRandoms(25, generalNewQuestionArray.length);

            var generalUnpublishedRandoms = [];
            if (generalUnpublishedQuestionsArray.length > 0) {
              generalUnpublishedRandoms = this.getRandoms(3, generalUnpublishedQuestionsArray.length);
            }

            //var generalUnpublishedOldRandoms = [];
            //if (generalUnpublishedNewQuestionArray.length > 0) {
            //  generalUnpublishedOldRandoms = this.getRandoms(2, generalUnpublishedOldQuestionArray.length);
            //}

            var finishTheVerseRandoms = this.getRandoms(4, finishTheVerseArray.length);
            var situationQuestionsRandoms = this.getRandoms(3, situationQuestionArray.length);
            var quoteRandoms = this.getRandoms(4, memoryQuoteArray.length);
            var accordingToRandoms  = this.getRandoms(3, accordingToArray.length);
            var whatToPick = 0;
            var oldOrNew = 0;
  
            //SQ, AT, and General
            var genQuestionSlots = [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 16, 17, 19, 20];
            //MQ and FTV
            var otherSlots = [4, 8, 12, 18];
  
            var weighted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
            for (var n = 1; n < 21; n++) {
  
              //SQ, AT, and General
              if (genQuestionSlots.includes(n)) {
                whatToPick = Math.floor(Math.random() * (13 - 1 + 1) + 1);
                oldOrNew = Math.floor(Math.random() * (2 - 1 + 1) + 1);
                if (n == 1 || n == 20) {
                  tempQuizQuestion = new QuizQuestion(generalNewQuestionArray[generalNewRandoms[generalNewRandomsCount]], n.toString() + '.');
                  quizQuestionArray.push(tempQuizQuestion);
                  generalNewRandomsCount++;
                } 
                else {
                  if (generalNewRandomsCount < 9 && weighted.includes(whatToPick) && oldOrNew == 1) {
                    tempQuizQuestion = new QuizQuestion(generalNewQuestionArray[generalNewRandoms[generalNewRandomsCount]], n.toString() + '.');
                    quizQuestionArray.push(tempQuizQuestion);
                    generalNewRandomsCount++;
                  }
                  else if (generalOldRandomsCount < 9 && weighted.includes(whatToPick) && oldOrNew == 2) {
                    tempQuizQuestion = new QuizQuestion(generalOldQuestionArray[generalOldRandoms[generalOldRandomsCount]], n.toString() + '.');
                    quizQuestionArray.push(tempQuizQuestion);
                    generalOldRandomsCount++;
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
                  else if (unpublishedRandomsCount < 2 && whatToPick == 13 && n != 1 && n != 20 && generalUnpublishedQuestionsArray.length > 0) {
                    tempQuizQuestion = new QuizQuestion(generalUnpublishedQuestionsArray[generalUnpublishedRandoms[unpublishedRandomsCount]], n.toString() + '.');
                    quizQuestionArray.push(tempQuizQuestion);
                    unpublishedRandomsCount++;
                  }
                  else {
                    if (generalNewRandomsCount < 7) {
                      tempQuizQuestion = new QuizQuestion(generalNewQuestionArray[generalNewRandoms[generalNewRandomsCount]], n.toString() + '.');
                      quizQuestionArray.push(tempQuizQuestion);
                      generalNewRandomsCount++;
                    }
                    else if (generalOldRandomsCount < 7) {
                      tempQuizQuestion = new QuizQuestion(generalOldQuestionArray[generalOldRandoms[generalOldRandomsCount]], n.toString() + '.');
                      quizQuestionArray.push(tempQuizQuestion);
                      generalOldRandomsCount++;
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
                    else {
                      tempQuizQuestion = new QuizQuestion(generalNewQuestionArray[generalNewRandoms[generalNewRandomsCount]], n.toString() + '.');
                      quizQuestionArray.push(tempQuizQuestion);
                      generalNewRandomsCount++;
                    }
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
            tempQuizQuestion = new QuizQuestion(generalNewQuestionArray[generalNewRandoms[generalNewRandomsCount]], '*');
            quizQuestionArray.push(tempQuizQuestion);
            generalNewRandomsCount++;
            
            tempQuizQuestion = new QuizQuestion(generalNewQuestionArray[generalNewRandoms[generalNewRandomsCount]], '*');
            quizQuestionArray.push(tempQuizQuestion);
            generalNewRandomsCount++;

            tempQuizQuestion = new QuizQuestion(generalNewQuestionArray[generalNewRandoms[generalNewRandomsCount]], '*');
            quizQuestionArray.push(tempQuizQuestion);
            generalNewRandomsCount++;

            tempQuizQuestion = new QuizQuestion(generalOldQuestionArray[generalOldRandoms[generalOldRandomsCount]], '*');
            quizQuestionArray.push(tempQuizQuestion);
            generalOldRandomsCount++;

            if (generalUnpublishedQuestionsArray.length > 0) {
              tempQuizQuestion = new QuizQuestion(generalUnpublishedQuestionsArray[generalUnpublishedRandoms[unpublishedRandomsCount]], '*');
              quizQuestionArray.push(tempQuizQuestion);
            }
            else {
              tempQuizQuestion = new QuizQuestion(generalOldQuestionArray[generalOldRandoms[generalOldRandomsCount]], '*');
              quizQuestionArray.push(tempQuizQuestion);
              generalOldRandomsCount++;
            }         
  
            tempQuizQuestion = new QuizQuestion(situationQuestionArray[situationQuestionsRandoms[situationQuestionsRandomsCount]], '*');
            quizQuestionArray.push(tempQuizQuestion);
  
            tempQuizQuestion = new QuizQuestion(accordingToArray[accordingToRandoms[accordingToRandomsCount]],'*');
            quizQuestionArray.push(tempQuizQuestion);
  
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

            console.log("general old : " + generalOldRandomsCount);
            console.log("general new : " + generalNewRandomsCount);

          }
        }
        else {
          if (this.selectedFlight.includes('B Flight')) {

            //B flight
            if (generalQuestionsArray.length < 22) {
              if (generalQuestionsArray.length > 11) {
                alert("B Flight quizzes need at least 22 Finish the Verse in order to be generated. generalQuestions array will be duplicated til we have 22 total.");
                generalQuestionsArray = generalQuestionsArray.concat(generalQuestionsArray);
              }
              else {
                alert("B Flight quizzes need at least 11 Questions in order to be generated. Please re-upload the cache");
                this.router.navigate(['']);
                return;
              }             
            }
            if (finishTheVerseArray.length < 8) {
              if (finishTheVerseArray.length > 0) {
                alert("B Flight quizzes need at least 8 Finish the Verse in order to be generated. FTV array will be duplicated til we have 8 total.");
                finishTheVerseArray = finishTheVerseArray.concat(finishTheVerseArray);
              }
              else {
                alert("B Flight quizzes need at least 1 Finish the Verse in order to be generated. Please re-upload the cache");
                this.router.navigate(['']);
                return; 
              }             
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
            var unpublishedRandomsCount = 0;
            var finishTheVerseRandomsCount = 0;
            var situationQuestionsRandomsCount = 0;
            var quoteRandomsCount = 0;
            var accordingToRandomsCount = 0;
  
            var generalRandoms = this.getRandoms(20, generalQuestionsArray.length);
            var generalUnpublishedRandoms = [];
            if (generalUnpublishedQuestionsArray.length > 0) {
              generalUnpublishedRandoms = this.getRandoms(3, generalUnpublishedQuestionsArray.length);
            }
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
  
            for (var n = 1; n < 21; n++) {
  
              //SQ, AT, and General
              if (genQuestionSlots.includes(n)) {
                whatToPick = Math.floor(Math.random() * (13 - 1 + 1) + 1);
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
                else if (unpublishedRandomsCount < 2 && whatToPick == 13 && n != 1 && n != 20 && generalUnpublishedQuestionsArray.length > 0) {
                  tempQuizQuestion = new QuizQuestion(generalUnpublishedQuestionsArray[generalUnpublishedRandoms[unpublishedRandomsCount]], n.toString() + '.');
                  quizQuestionArray.push(tempQuizQuestion);
                  unpublishedRandomsCount++;
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
            for (var o = 0; o < 3; o++) {           
              tempQuizQuestion = new QuizQuestion(generalQuestionsArray[generalRandoms[generalRandomsCount]], '*');
              generalRandomsCount += 1;
              quizQuestionArray.push(tempQuizQuestion);
            }
  
            if (generalUnpublishedQuestionsArray.length > 0) {
              tempQuizQuestion = new QuizQuestion(generalUnpublishedQuestionsArray[generalUnpublishedRandoms[unpublishedRandomsCount]], '*');
              quizQuestionArray.push(tempQuizQuestion);
            }
            else {
              tempQuizQuestion = new QuizQuestion(generalQuestionsArray[generalRandoms[generalRandomsCount]], '*');
              quizQuestionArray.push(tempQuizQuestion);
            }         
  
            tempQuizQuestion = new QuizQuestion(situationQuestionArray[situationQuestionsRandoms[situationQuestionsRandomsCount]], '*');
            quizQuestionArray.push(tempQuizQuestion);
  
            tempQuizQuestion = new QuizQuestion(accordingToArray[accordingToRandoms[accordingToRandomsCount]],'*');
            quizQuestionArray.push(tempQuizQuestion);
  
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

  reformatToMemoryQuote(passedArray: Array<Question>) {
    var returnArray = [];

    passedArray.forEach(x => {
      var temp = new Question(x.book, x.chapter, x.verse, x.section, "MQ", false, false,
      "Quote " + x.book + " " + x.chapter + ":" + x.verse + "?", x.question);   
      returnArray.push(temp);
    });

    return returnArray;
  }
}
