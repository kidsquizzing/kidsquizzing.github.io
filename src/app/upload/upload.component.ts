import { Component, OnInit } from '@angular/core';
import { Question } from '../model/question';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
})

export class UploadComponent implements OnInit {
  public fileName: string = '';
  public questionArray: Array<Question> = new Array();
  public hasData: boolean = false;

  constructor(private questionService: QuestionService) {
  }

  ngOnInit(): void {
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
} 

