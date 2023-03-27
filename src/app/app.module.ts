import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoCaptureComponent } from './video-capture/video-capture.component';
import { HomeComponent } from './home/home.component';
import { AWSService } from './services/aws.service';
import { DynamoDBService } from './services/dynamo-db.service';
import { RekognitionService } from './services/rekognition.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VideoCaptureComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    AWSService,
    RekognitionService,
    DynamoDBService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
