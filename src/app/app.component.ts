import {Component} from '@angular/core';

import * as AWS from 'aws-sdk'
import {CognitoIdentityCredentials} from 'aws-sdk'

// Authenticate
import {
    AuthenticationDetails,
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser
} from 'amazon-cognito-identity-js-typescript/src'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'frontend';

    rekognition: any;
    selectedLabel = 'Person'   // label to show bounding boxes for

    // faces details
    faceDetails;

    constructor() {
        // AWS.config.region = 'us-east-1';
        // Initialize the Amazon Cognito credentials provider (Not recommended)
        // AWS.config.credentials = new AWS.Credentials('access_key', 'access_key--');
        //

        //--------------------Authenticate to Cognitio

        // var userPool = new CognitoUserPool({
        //     UserPoolId: 'us-east-2_5SzDO6xtv',
        //     Region: 'us-east-2'
        // });
        //
        // var authenticationDetails = new AuthenticationDetails({
        //     Username: 'becaye',
        //     Password: 'TheBecaye10@aws',
        // });
        //
        // var cognitoUser = new CognitoUser( {
        //     Username: 'becaye',
        //     Pool: userPool
        // })

        // cognitoUser.authenticateUser(authenticationDetails, {
        //     onSuccess: result => {
        //         // User authentication was successful
        //         console.log('Authentication successful:', result);
        //     },
        //     onFailure: function(err) {
        //         // User authentication failed
        //         console.error('Authentication failed:', err);
        //     }
        // });

        //--------------------

        // ---------------------------  Getting credentials from cognito --------------------------------

        AWS.config.region = 'us-east-2'; // Region

        AWS.config.credentials = new CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-2:cf65ff8f-d5c2-4762-bcaa-bb19b51461ea',
        });

        // Optional: Log AWS SDK events in the console
        AWS.config.logger = console;

        // Optional: Enable AWS SDK debugging
        // @ts-ignore
        AWS.config.debug = true;

        (<CognitoIdentityCredentials>AWS.config.credentials).get(err => {
            if (err) {
                console.error('Failed to retrieve AWS credentials:', err);
            } else {
                console.log('AWS credentials retrieved successfully:', AWS.config.credentials);
            }
        });

        // Init the Rekognition object
        this.rekognition = new AWS.Rekognition();
    }


    /**
     * Get the uploaded image and send it to the {detectObjects}
     */
    processImage() {
        const image: any = document.getElementById('uploaded-image')!;

        // if there is a file
        if (image.files.length > 0) {
            const file = image.files[0];

            const reader = new FileReader();

            // when readAsArrayBuffer() is done reading the image file,
            // send it to the detectFaces() method
            reader.onload = ((file: any) => {
                return (e: any) => {
                    this.detectFaces(e.target.result);
                }
            })(file);

            reader.readAsArrayBuffer(file);
        }
    }

    /**
     * Detect Faces
     * Uses Rekognition to label the person's faces in the image.
     * Note that we use singular.
     * This is because, the software will get images from the cashier's cameras,
     * which takes the photo of the customer currently at the checkout.
     */
    detectFaces(imgData) {
        const params = {
            Image: {
                Bytes: imgData
            },
            // MinConfidence: 0.55
            Attributes: [
                'ALL',
            ],
        };

        this.rekognition.detectFaces(params, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                alert('There was an error detecting the labels in the image provided. Check the console for more details.');
            } else {
                this.faceDetails = data.FaceDetails
                console.log('Returned data', this.faceDetails[0]);
                // this.displayLabels(data);
                // this.showBoundingBoxes(data, imgData);
            }
        });
    }

    /**
     * Display Labels
     *
     * Shows a list of detected labels on the screen.
     */
    displayLabels(data) {
        const labels = data.Labels.map((obj) => obj.Name).join(', ');
        document.getElementById('labels')!.textContent = labels;
    }

    /**
     * Show Bounding Boxes
     *
     * Converts ArrayBuffer into Image object
     */
    showBoundingBoxes(objData, imgData) {
        const filtered = objData.Labels.filter(obj => this.selectedLabel === obj.Name);
        const boxes = filtered.length > 0 ? filtered[0].Instances : [];

        const blob = new Blob([imgData], {type: 'image/jpg'});
        const imageUrl = URL.createObjectURL(blob);

        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            this.drawImage(img, boxes);
        };
    }

    /**
     * Draw Image
     *
     * Draws the image and bounding boxes on the canvas
     */
    drawImage(img, boxes) {
        const ctx = (<any>document.getElementById('canvas')).getContext('2d');

        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        ctx.drawImage(img, 0, 0, width, height);

        boxes.forEach((obj) => {
            const box = obj.BoundingBox;
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'green';
            ctx.rect(box.Left * width, box.Top * height, box.Width * width, box.Height * height);
            ctx.stroke();
        });
    }

}
