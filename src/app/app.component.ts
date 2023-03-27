import { Component } from '@angular/core';

import { AWSService } from './services/aws.service';

declare var cv: any;


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Smart Eye';

    constructor(private awsService: AWSService) { }

}
