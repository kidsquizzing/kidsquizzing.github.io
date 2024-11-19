import { Component, OnInit } from '@angular/core';
import { Question } from '../model/question';
import { QuestionService } from '../services/question.service';
import { defaultQuestionsTextBlob } from '../model/defaultQuestionsTextBlob';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
})

export class UploadComponent implements OnInit {
  public fileName: string = '';
  public questionArray: Array<Question> = new Array();
  public hasData: boolean = false;
  public defaultTextBlob: defaultQuestionsTextBlob = new defaultQuestionsTextBlob();

  constructor(private questionService: QuestionService, private router: Router) {
  }

  ngOnInit(): void {
  } 

  viewCache() {
    this.router.navigate(['/cache']);
  }

  onFileSelected(event) {
    const reader = new FileReader();
    const file: File = event.target.files[0];

    if (file) {
      reader.readAsText(file);
      reader.onload = () => {
        let text = reader.result;
        this.questionArray = this.questionService.createQuestionObjectList(text);
        localStorage.setItem('questions', JSON.stringify(this.questionArray));
      };
    }
  }
  
  downloadQuestions() {
    if (this.questionArray.length == 0) {
      alert("You have not yet uploaded a valid csv containing a question array. If you need a sample go visit the Cache Screen.");
      return;
    }

    let tempStrings = this.questionService.getQuestionObjectListAsCSV();
    let tempBlob = new Blob(tempStrings, { type: "text/plain" });

    var link = document.createElement('a');
    var date = formatDate(new Date(), 'yyyy_MM_dd__hh_mm', 'en-US');
    var fileName = "Custom_Upload_Download_" + date + ".csv";
    link.href = window.URL.createObjectURL(tempBlob);
    link.download = fileName;
    link.click();
    alert(`File should have downloaded to wherever you have your browser pointed at for your defult downloads. ` +
          `File is named ${fileName}`);
  }

  downloadQuestionsAsStrictText() {
    if (this.questionArray.length == 0) {
      alert("You have not yet uploaded a valid csv containing a question array. If you need a sample go visit the Cache Screen.");
      return;
    }

    let tempStrings = this.questionService.getQuestionObjectListAsStrictText();
    let tempBlob = new Blob(tempStrings, { type: "text/plain" });

    var link = document.createElement('a');
    var date = formatDate(new Date(), 'yyyy_MM_dd__hh_mm', 'en-US');
    var fileName = "Custom_Upload_TextBlob_Download_" + date + ".txt";
    link.href = window.URL.createObjectURL(tempBlob);
    link.download = fileName;
    link.click();
    alert(`File should have downloaded to wherever you have your browser pointed at for your defult downloads. ` +
          `File is named ${fileName}`);
  }
} 

