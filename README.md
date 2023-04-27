# Smart Eye
An app that collect demographic data using cameras.

#### TODO
- [ ] Use birth date instead of age
- [ ] Dynamic values

Warning: Collecting individuals' data may be subject to some regulations. 
[Find the official guiline here](https://www.priv.gc.ca/en/privacy-topics/surveillance/video-surveillance-by-businesses/gl_vs_080306/).

### Situation
Manually gathering information from customers in grocery stores, shops and supermarkets is a tedious and time-consuming task. This is why I developed Smart Eye.
Smart Eye is an app that uses AWS Rekognition capabilities to to gather demographics data on individuals. It can detect the gender, age and emotions of customers using cameras.

### Action
We needed a short development time, and a robust model. This is why I chose the following tools:

* **Amazon Rekognition**: a cloud-based software as a service computer vision platform. It provides an easy-to-use API to perform computer vision tasks.

* **Angular:** A Javascript front-end framework to build robust web applications.

### Results
* Genders: Rekognition predicts the gender perfectly.
* Age: Rekognition provides an age range that is very acurate. However, the model is biaised on minority groups such as myself and may give poor age approximations.
* Emotions: emotions are harder to interpret as they are subtle and subject to the complexity of humans.

#### New Version: ChartJS
<img width="800" alt="image" src="https://user-images.githubusercontent.com/87549214/232987210-290a9d66-6813-456b-96c2-c999c076cdf4.png">

#### Old version: Google Chart

<img width="806" alt="image" src="https://user-images.githubusercontent.com/87549214/232167574-14932551-dcdc-4d2c-a798-91b8e5447ca8.png">


<br>
<br>
<br>

---

## Project Structure

```
git clone https://github.com/BecayeSoft/SmartEye
cd SmartEye
npm install
ng serve --open
```

This app uses 2 types of entities:
* Component: the .html and .ts files. These are respectively the interface and the dynamic logic of a component.
* Services: the .service.ts files. These allows us to interact with external services such as AWS, Rekognition, DynamoDB.

Navigate to SmartEye/src/app. Here you will fin dthe app.

### The services
#### `aws.service.ts`
This service establishes the connection to AWS by using AWS Cognito credentials.

#### `rekognition.service.ts`
This service handles interactions with AWS rekognition. It is used to call the API.

#### `dynamodb.service.ts`
This service allows interactions with the DynamoDB database. It is used to perform CRUD operations in the database, and more.

### The components
#### `home`
HomeComponent displays in simple dashboard of the data. It contains some graphs and cards that display information about the age, gender and emotions from the data present in the DynamoDB database.

#### `video-capture`
VideoCaptureComponent connects to the webcam, take a picture, then send it to rekognition. As this is a prototype, I did not use real cameras, but rather a webcam.


## References
* [AWS Rekognition Doc](https://docs.aws.amazon.com/rekognition/index.html)
* [AWS Rekognition tutorial](https://medium.com/@andrewxiaoyu0/how-to-detect-labels-and-objects-using-amazon-rekognition-with-javascript-882bcfa602df)
* [OpenCV with Javascript](https://docs.opencv.org/3.4/d0/d84/tutorial_js_usage.html)
