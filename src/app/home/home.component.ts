import { Component, OnInit, AfterViewInit } from '@angular/core';

import { AWSService } from '../services/aws.service';
import { DynamoDBService } from '../services/dynamo-db.service';
import { Customer } from '../models/Customer';


/**
 * A component that displays the home page with a Dashboard
 * showing insights about data form the DynamoDB database.
 */
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    customers: Customer[]
    faceDetails: any;
	
	
	constructor (private dynamodbService: DynamoDBService) {}

    ngOnInit(): void {}

    getAllCustomers() {
        this.customers = this.dynamodbService.getAllCustomers();
    }


}
