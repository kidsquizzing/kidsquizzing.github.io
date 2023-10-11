import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MaterialCovered } from '../model/materialCovered';
import { SectionCovered } from '../model/sectionCovered';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}

  getUseAllMaterial() {
    var useAllMaterial = false;
    var temp = localStorage.getItem('useAllMaterial');
    if (temp != null) {
      useAllMaterial = (temp == "true");
    }    
    return useAllMaterial;
  }

  getMaterialsList() {
    var materialArray = [];
    var materialJson = localStorage.getItem('printMats');
    if (materialJson != null) {     
      var parsedJson = JSON.parse(materialJson);
      for (var i = 0; i < parsedJson.length; i++) {
        var tempMaterial = new MaterialCovered(parsedJson[i].book, parsedJson[i].chapter);
        materialArray.push(tempMaterial);
      }
    }

    return materialArray;
  }

  getSectionList() {
    var sectionArray = [];
    var sectionJson = localStorage.getItem('printSections');
    if (sectionJson != null) {
      var parsedJson = JSON.parse(sectionJson);
      for (var i = 0; i < parsedJson.length; i++) {
        var tempSection = new SectionCovered(parsedJson[i].section);
        sectionArray.push(tempSection);
      }  
    }
  
    return sectionArray;
  }

  getNumberOfPrintPages() {
    var numberOfPages = 0;
    var temp = localStorage.getItem('printPages');
    if (temp != null) {
      numberOfPages = +temp;
    }    
    return numberOfPages;
  }

  getSelectedFlight() {
    var selectedFlight = '';
    var temp = localStorage.getItem('selectedFlight');
    if (temp != null) {
      selectedFlight = temp;
    }    
    return selectedFlight;
  }
}
