import { Component, ElementRef, OnInit, QueryList, ViewChildren  } from '@angular/core';
import { Router } from '@angular/router';
import { defaultQuestionsTextBlob } from '../model/defaultQuestionsTextBlob';
import { MaterialCovered } from '../model/materialCovered';
import { Question } from '../model/question';
import { SectionCovered } from '../model/sectionCovered';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit{
  @ViewChildren('matCheck') matCheckBoxes!: QueryList<ElementRef<HTMLInputElement>>;

  public defaultTextBlob: defaultQuestionsTextBlob = new defaultQuestionsTextBlob();
  public numPages: number = 1;
  public numberOfQuestionsLoaded: number = 0;
  public numberOfGeneralLoaded: number = 0;
  public numberOfFtvLoaded: number = 0;
  public numberOfMqLoaded: number = 0;
  public numberOfAccToLoaded: number = 0;
  public numberOfSqLoaded: number = 0;
  public numberOfQuestionsLoadedBFlight: number = 0;
  public numberOfGeneralLoadedBFlight: number = 0;
  public numberOfFtvLoadedBFlight: number = 0;
  public numberOfMqLoadedBFlight: number = 0;
  public numberOfAccToLoadedBFlight: number = 0;
  public numberOfSqLoadedBFlight: number = 0;
  public questionArray: Array<Question> = [];
  public questionTypeArray: Array<string> = [];
  public materialCoveredArray: Array<MaterialCovered> = [];
  public sectionArray: Array<SectionCovered> = [];
  public newSectionArray: Array<SectionCovered> = [];
  public oldSectionArray: Array<SectionCovered> = [];
  public printMats = [];
  public printSections = [];
  public printOldSections = [];
  public printNewSections = [];
  public selectedFlight: string = 'A Flight';
  public flightSelections: string[] = ['A Flight', 'B Flight']
  public materialCount: number = 1;
  public cacheIsLoaded: boolean = false;
  public useAllMaterial: boolean = true;

  constructor(private questionService: QuestionService, private router: Router) { }

  ngOnInit(): void {
    this.questionArray = this.questionService.getQuestionObjectList();
    this.clearPageValues();
    this.setupPageValues();
  }
  
  loadStandardCache() {
    this.clearPageValues();
    this.setQuestionsToLocalStorage();
  }

  matBoxClick(e) {
    this.materialCoveredArray[this.materialCoveredArray.findIndex(x => x.matId == e.target.value)].isSelected = e.target.checked;
  }

  sectionBoxClick(e) {
    this.sectionArray[this.sectionArray.findIndex(x => x.sectionId == e.target.value)].isSelected = e.target.checked;
  }

  newContentBoxClick(e) {
    if (e.target.checked == true) {
      this.oldSectionArray[this.oldSectionArray.findIndex(x => x.sectionId == e.target.value)].isSelected = !e.target.checked;
    }
    this.newSectionArray[this.newSectionArray.findIndex(x => x.sectionId == e.target.value)].isSelected = e.target.checked;
  }

  oldContentBoxClick (e) {
    if (e.target.checked == true) {
      this.newSectionArray[this.newSectionArray.findIndex(x => x.sectionId == e.target.value)].isSelected = !e.target.checked;
    }
    this.oldSectionArray[this.oldSectionArray.findIndex(x => x.sectionId == e.target.value)].isSelected = e.target.checked;
  }

  print() {
    this.materialCoveredArray.forEach((mat, index) => {
      if (mat.isSelected) {
        this.printMats.push(mat);
      }
    });
    this.sectionArray.forEach((sec, index) => {
      if (sec.isSelected) {
        this.printSections.push(sec);
      }
    });
    this.oldSectionArray.forEach((sec, index) => {
      if (sec.isSelected) {
        var tempSection = new SectionCovered(sec.section);
        tempSection.isSelected = sec.isSelected;
        this.printOldSections.push(tempSection);
      }
    });
    this.newSectionArray.forEach((sec, index) => {
      if (sec.isSelected) {
        var tempSection = new SectionCovered(sec.section);
        tempSection.isSelected = sec.isSelected;
        this.printNewSections.push(tempSection);
      }
    });

    if (this.printMats.length < 1 && this.printSections.length < 1 && this.useAllMaterial == false) {
      alert("Please select some material before trying to print");
      return;
    }
    
    this.setPrintVariablesToLocalStorage();
    this.router.navigate(['/print']);
  }

  viewCache() {
    this.router.navigate(['/cache']);
  }

  setQuestionsToLocalStorage() {
    this.questionArray = this.questionService.createQuestionObjectList(this.defaultTextBlob.questionBlob);
    localStorage.setItem('questions', JSON.stringify(this.questionArray));
    this.setupPageValues();
  }

  setPrintVariablesToLocalStorage() {
    this.questionArray = this.questionService.createQuestionObjectList(this.defaultTextBlob.questionBlob);
    localStorage.setItem('useAllMaterial', JSON.stringify(this.useAllMaterial));
    localStorage.setItem('printMats', JSON.stringify(this.printMats));
    localStorage.setItem('printSections', JSON.stringify(this.printSections));
    localStorage.setItem('printOldSections', JSON.stringify(this.printOldSections));
    localStorage.setItem('printNewSections', JSON.stringify(this.printNewSections));
    localStorage.setItem('printPages', JSON.stringify(this.numPages));
    localStorage.setItem('selectedFlight', JSON.stringify(this.selectedFlight));

    this.setupPageValues();
  }

  setupPageValues() {
    for (var i = 0; i < this.questionArray.length; i++) {
      if (!this.questionTypeArray.includes(this.questionArray[i].type)) {
        this.questionTypeArray.push(this.questionArray[i].type);
      }
      var tempMaterial = new MaterialCovered(this.questionArray[i].book, this.questionArray[i].chapter);
      if (!this.materialCoveredArray.some((item) => item.book == tempMaterial.book && item.chapter == tempMaterial.chapter)) {
        tempMaterial.matId = "mat" + this.materialCount;
        this.materialCount += 1;
        this.materialCoveredArray.push(tempMaterial);
      }
      var tempSection = new SectionCovered(this.questionArray[i].section);
      if (!this.sectionArray.some((item) => item.section == tempSection.section)) {
        tempSection.sectionId = "sec" + tempSection.section;
        this.sectionArray.push(tempSection);
      }
      switch(this.questionArray[i].type) {
        case 'General': {
          this.numberOfGeneralLoaded += 1;
          if (this.questionArray[i].isBFlight == true) {
            this.numberOfGeneralLoadedBFlight += 1;
          }
          break;
        }
        case 'FTV': {
          this.numberOfFtvLoaded += 1;
          if (this.questionArray[i].isBFlight == true) {
            this.numberOfFtvLoadedBFlight += 1;
          }
          break;
        }
        case 'MQ': {
          this.numberOfMqLoaded += 1;
          if (this.questionArray[i].isBFlight == true) {
            this.numberOfMqLoadedBFlight += 1;
          }
          break;
        }
        case 'AT': {
          this.numberOfAccToLoaded += 1;
          if (this.questionArray[i].isBFlight == true) {
            this.numberOfAccToLoadedBFlight += 1;
          }
          break;
        }
        case 'SQ': {
          this.numberOfSqLoaded += 1;
          if (this.questionArray[i].isBFlight == true) {
            this.numberOfSqLoadedBFlight += 1;
          }
          break;
        }
      }
    }

    if(this.sectionArray.length > 0) {
      var sectionArrayCount = 0;
      this.sectionArray.forEach((item) => {
        var tempNew = new SectionCovered(item.section);
        tempNew.isSelected = false;
        tempNew.sectionId = item.sectionId;  
        this.newSectionArray.push(tempNew);
        var tempOld = new SectionCovered(item.section);
        tempOld.isSelected = true;
        tempOld.sectionId = item.sectionId;
        this.oldSectionArray.push(tempOld);
        sectionArrayCount++;
      })
    }

    this.oldSectionArray[sectionArrayCount - 1].isSelected = false;
    this.newSectionArray[sectionArrayCount - 1].isSelected = true;

    this.numberOfQuestionsLoaded = this.numberOfGeneralLoaded + this.numberOfFtvLoaded + this.numberOfMqLoaded +
      this.numberOfAccToLoaded + this.numberOfSqLoaded;
    this.numberOfQuestionsLoadedBFlight = this.numberOfGeneralLoadedBFlight + this.numberOfFtvLoadedBFlight + this.numberOfMqLoadedBFlight +
      this.numberOfAccToLoadedBFlight + this.numberOfSqLoadedBFlight;
    this.cacheIsLoaded = true;
  }

  clearPageValues() {
    this.numberOfQuestionsLoaded = 0;
    this.numberOfGeneralLoaded = 0;
    this.numberOfFtvLoaded = 0;
    this.numberOfMqLoaded = 0;
    this.numberOfAccToLoaded = 0;
    this.numberOfSqLoaded = 0;
    this.numberOfQuestionsLoadedBFlight = 0;
    this.numberOfGeneralLoadedBFlight = 0;
    this.numberOfFtvLoadedBFlight = 0;
    this.numberOfMqLoadedBFlight = 0;
    this.numberOfAccToLoadedBFlight = 0;
    this.numberOfSqLoadedBFlight = 0;
    this.questionTypeArray = [];
    this.materialCoveredArray = [];
    this.sectionArray = [];
    this.oldSectionArray = [];
    this.newSectionArray = [];
  }
}