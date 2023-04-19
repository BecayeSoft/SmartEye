import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Buffer } from 'buffer';

import { DynamoDBService } from '../services/dynamo-db.service';
import { RekognitionService } from '../services/rekognition.service';

import { ProcessData } from './../utils/process-data'
import { Customer } from '../models/Customer';


// OpenCV
declare var cv: any;

/**
 * A component that is responsible for gathering data from the camera.
 */
@Component({
    selector: 'app-video-capture',
    templateUrl: './video-capture.component.html',
    styleUrls: ['./video-capture.component.scss']
})
export class VideoCaptureComponent implements OnInit, AfterViewInit {

    // TODO list
    // Next step: Take picture only when there is a face using Viola Jones in OpenCV
    // 2 Faces: Detect the attributes of all the faces instead.

    // rekognition: Rekognition
    faceDetails: any;


    constructor(
        private rekognitionService: RekognitionService,
        private dynamodbService: DynamoDBService
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        // take customer's picture and detect face's labels
        setTimeout(() => {
            this.captureImage()
        }, 3000)
    }

    /**
     * Connect to the camera, take a picture of a customer
     * and send it to rekognition to detect faces attributes.
     */
    captureImage() {

        let videoElement = document.getElementById("videoElement") as HTMLVideoElement;

        // connect to webcam
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(stream => {
                videoElement.srcObject = stream;
                // start webcam
                videoElement.play();
            })
            .catch(function (error) {
                console.log("Error getting video stream: " + error);
            });

        // TODO - Next step: Take picture only when there is a face using Viola Jones in OpenCV

        // wait for video to be loaded
        videoElement.addEventListener("loadeddata", () => {
            let canvas = <HTMLCanvasElement>document.getElementById("canvas");
            let context = canvas.getContext("2d");

            // draw video frame onto canvas
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            // convert image to `Bytes`
            let imageBuffer = this.processImage(canvas)

            // send `Bytes` to rekognition
            this.detectFaces(imageBuffer)
        });

    }


    /**
     * Detect faces attributes of the customer in the image.
     *
     * If the operation succeeds `addCustomerToDatabase()` is called
     * to save the data into DynamoDB.
     */
    detectFaces(imageData) {
        this.rekognitionService.detectFaces(imageData)
            .then(data => {
                this.faceDetails = data.FaceDetails[0]
                console.log('Faces detected:', data.FaceDetails)

                // save the customer to DynamoDB
                this.addCustomerToDatabase(this.faceDetails)
            })
            .catch(err => {
                console.log('Error detecting faces:', err);
            })
    }

    /**
     * Extract the relevant information from the faces details,
     * then create a new customer with those information.
     *
     * The customer can then be saved to DynamoDB.
     * Note: This method should always be called before saving a customer to the database.
     *
     * @param faceDetails
     * @returns a customer created from `faceDetails`
     */
    processCustomerData(faceDetails: any) {
        const age = ProcessData.extractAge(faceDetails)
        const gender = ProcessData.extractGender(faceDetails)
        const emotion = ProcessData.extractEmotion(faceDetails)
        const smile = ProcessData.extractSmile(faceDetails)

        let customer = new Customer()
        customer.age = age
        customer.gender = gender
        customer.emotion = emotion
        customer.smile = smile

        return customer
    }

    /**
     * Save a customer to the table `customer-demographics` in DynamoDB.
     *
     * the JSON string `faceDetails` is first processed with `processCustomerData()`
     * so that it can be added to the database.
     *
     * @param faceDetails a JSON string containg labels of the detected face.
     */
    addCustomerToDatabase(faceDetails) {
        let customer = this.processCustomerData(faceDetails)
        console.log('Process Customer Data>', customer);

        this.dynamodbService.addCustomer(customer)
    }


    //----------------------------------
    //      Utils Functions
    //----------------------------------

    /**
     * Convert the canvas's image into a buffer.
     *
     * We do so becasue AWS Rekogniton only accepts certains types.
     * `canvas.toDataURL()` converts the image to a base64 encoded string,
     * `Buffer.from()` converts that image to `Bytes`.
     */
    processImage(canvas) {
        const imageDataUrl = canvas.toDataURL();
        const imageBuffer = Buffer.from(imageDataUrl.split(',')[1], 'base64')

        return imageBuffer
    }

}
