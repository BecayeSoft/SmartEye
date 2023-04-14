# Smart Eye
An app that collect demographic data using cameras.

Warning: Collecting individuals' data may be subject to some regulations. 
[Find the official guiline here](https://www.priv.gc.ca/en/privacy-topics/surveillance/video-surveillance-by-businesses/gl_vs_080306/).

## Situation
Manually gathering information from customers in grocery stores, shops and supermarkets is a tedious and time-consuming task. This is why I developed Smart Eye.
Smart Eye is an app that uses AWS Rekognition capabilities to to gather demographics data on individuals. It can detect the gender, age and emotions of customers using cameras.

## Action
We needed a short development time, and a robust model. This is why I chose the following tools:

* **Amazon Rekognition**: a cloud-based software as a service computer vision platform. It provides an easy-to-use API to perform computer vision tasks.

* **Angular:** A Javascript front-end framework to build robust web applications.

## Results
* Gender: Rekognition predicts the gender perfectly.
* Age: Rekognition provides an age range that is very acurate. However, the model is biaised on minority groups such as myself and may give poor age approximations.
* Emotions: emotions are harder to interpret as they are subtle and subject to the complexity of humans.



## Setup
This is a reference for myself.

### Clone the project
`git clone https://github.com/BecayeSoft/SmartEye`

### Run the app
Navigate to the project <br/>
`cd SmartEye`

Launch the server <br/>
`ng serve --open`

### References
<a href=https://docs.aws.amazon.com/rekognition/index.html">AWS Rekognition</a>
<a href="https://medium.com/@andrewxiaoyu0/how-to-detect-labels-and-objects-using-amazon-rekognition-with-javascript-882bcfa602df"></a>
<a href="https://docs.opencv.org/3.4/d0/d84/tutorial_js_usage.html">OpenCV</a>

### DynamoDB
Create the table with AWS CLI.
`aws dynamodb create-table --cli-input-json file://src/assets/table.json`
