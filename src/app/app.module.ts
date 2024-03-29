import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { UploadComponent } from './upload/upload.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';
import { CurrentCacheComponent } from './currentCache/current-cache.component';
import { PrintComponent } from './print/print.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
import { BFlightFTVComponent } from './bflight-ftv/bflight-ftv.component';
import { AFlightFTVComponent } from './aflight-ftv/aflight-ftv.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    UploadComponent,
    HomeComponent,
    CurrentCacheComponent,
    PrintComponent,
    BFlightFTVComponent,
    AFlightFTVComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxPrintModule,
    MatRadioModule,
    RouterModule.forRoot([
      { path: "", component: HomeComponent, pathMatch: "full" },
      { path: "upload", component: UploadComponent, pathMatch: "full"},
      { path: "cache", component: CurrentCacheComponent, pathMatch: "full"},
      { path: "print", component: PrintComponent, pathMatch: "full"},
      { path: "bflightftvcontest", component: BFlightFTVComponent, pathMatch: "full"},
      { path: "aflightftvcontest", component: AFlightFTVComponent, pathMatch: "full"},
    ]),
    NoopAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
