# Smart Eye
An app that gathers customers' data using cameras.

Manually gathering information from customers in grocery stores, shops and supermarkets is a tedious and time-consuming task. This is why we created Smart Eye.
Smart Eye is an app that uses computer vision to perform demographic segmentation on customers. It can detect the gender, age and emotions of customers using cameras.

## Technolgies

**Amazon Rekognition**: a cloud-based software as a service computer vision platform. It is part of Amazon Web Services.

**Angular:** A Javascript front-end framework.

## Getting Started
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
