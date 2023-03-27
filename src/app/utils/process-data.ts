export class ProcessData {

    /**
     * Extract the age range from the face details returned by 
     * AWS.Rekognition.DetectFaces(), then return the rounded mean.
     * @param faceDetails 
     * @returns the estimated age.
     */
    static extractAge(faceDetails) {
        const ageLow = faceDetails.AgeRange.Low
        const ageHigh = faceDetails.AgeRange.High

        const estimatedAge = Math.round(ageHigh + ageLow / 2)

        return estimatedAge
    }

    /**
     * Extract the emotion with the highest confidence.
     * Possible emotions are "CALM",  "ANGRY",  "CONFUSED",
     * "SURPRISED", "DISGUSTED",  "FEAR",  "SAD" and "HAPPY".
     * 
     * If an emotion has a greater confidence than the previous one,
     * it becomes the emotion type.
     * 
     * Example: Suppose confidence = 12 and type = "ANGRY". Then on the next iteration,
     * "Confidence" = 52 and "Type": "CALM". then confidence will become 52
     * and type will become "CALM"
     * 
     * See the rekognition-test/rekognition.json for more information.
     * 
     * @param faceDetails 
     * @returns the emotion's label
     */
    static extractEmotion(faceDetails) {
        let confidence = 0
        let type = 'NA'
        const emotions = faceDetails.Emotions

        // get type of the emotion with the highest confidence
        for (const emotion of emotions) {
            if (emotion.Confidence > confidence) {
                confidence = emotion.Confidence
                type = emotion.Type
            }
        }

        return type
    }

    /**
     * Return the gender
     * 
     * @param faceDetails 
     * @returns "Male" or "Female"
     */
    static extractGender(faceDetails) {
        return faceDetails.Gender.Value
    }

    /**
     * Return the smile's value. 
     * 
     * @param faceDetails 
     * @returns a boolean that is true if the customer is smiling. False otherwise.
     */
    static extractSmile(faceDetails) {
        return faceDetails.Smile.Value
    }
}