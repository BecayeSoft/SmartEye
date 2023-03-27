import { Injectable } from '@angular/core';

import { config, CognitoIdentityCredentials, Rekognition } from 'aws-sdk'

@Injectable({
    providedIn: 'root'
})
export class AWSService {

	rekognition: any;


    constructor() {}

    /**
     * Init the AWS configuration. 
     * Set region, credentials and some optional settings.
     * Credentials are retrieved from Cognito to access to Rekognition.
     */
    initAWS() {

        config.region = 'us-east-2';

        config.credentials = new CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-2:cf65ff8f-d5c2-4762-bcaa-bb19b51461ea',
        });

        // Log AWS SDK events in the console
        config.logger = console;

        // Enable AWS SDK debugging
        // @ts-ignore
        config.debug = true;

        (<CognitoIdentityCredentials>config.credentials).get(err => {
            if (err) {
                console.error('Failed to retrieve AWS credentials:', err);
            } else {
                console.log('AWS credentials retrieved successfully:', config.credentials);
            }
        });
    }

    /**
     * Initializes the rekognition object
     */
    initRekognition() {
        this.rekognition = new Rekognition()
    }

}
