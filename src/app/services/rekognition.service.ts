import { Injectable } from '@angular/core';

import { Rekognition } from 'aws-sdk'


/**
 * `RekognitionService` handles interactions with AWS rekognition.
 */
@Injectable({
    providedIn: 'root'
})
export class RekognitionService {

	rekognition: any

    /**
     * the labels returned by `detectFaces()`
     */
    faceDetails: any

    constructor() {
        this.initRekognition()
    }


    /**
     * Initializes the rekognition object
     */
    initRekognition() {
        this.rekognition = new Rekognition()
    }


    // TODO: Detect all the faces instead of one.
    /**
     * Detect faces attributes of the customer in the image using AWS Rekognition.
     * We only keek the first face, hence the `data.FaceDetails[0]`
     *
     * @returns a promise that returns the `faceDetails`.
     */
    detectFaces(imgData: any): Promise<any> {
        const params = {
            Image: {
                Bytes: imgData
            },
            Attributes: [
                'ALL',
            ],
        }

        return this.rekognition.detectFaces(params).promise()
    }
}
