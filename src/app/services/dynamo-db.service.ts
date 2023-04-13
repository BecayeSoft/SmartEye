import { Injectable } from '@angular/core';
import { DynamoDB } from 'aws-sdk'

import { Customer } from '../models/Customer'
import { Emotion } from '../models/emotions';

import  {v4 as uuidv4 } from 'uuid'


/**
 * `DynamoDBService` allows interactions with DynamoDB.
 */
@Injectable({
    providedIn: 'root'
})
export class DynamoDBService {

    // the DynamoDB service object
    dynamodb: DynamoDB
    TABLE_NAME = "customer-demographics"
    params = {
        "TableName": this.TABLE_NAME,
        "AttributeDefinitions": [
            {
                "AttributeName": "id",
                "AttributeType": "S"
            },
            {
                "AttributeName": "age",
                "AttributeType": "N"
            },
            {
                "AttributeName": "gender",
                "AttributeType": "S"
            },
            {
                "AttributeName": "emotion",
                "AttributeType": "S"
            },
            {
                "AttributeName": "smile",
                "AttributeType": "N"
            },
            {
                "AttributeName": "timestamp",
                "AttributeType": "N"
            }     
        ],
        "KeySchema": [
            {
                "AttributeName": "id",
                "KeyType": "HASH"
            }
        ],
        "GlobalSecondaryIndexes": [
            {
                "IndexName": "AgeIndex",
                "KeySchema": [
                    {
                        "AttributeName": "age",
                        "KeyType": "HASH"
                    }
                ],
                "Projection": {
                    "ProjectionType": "ALL"
                },
                "ProvisionedThroughput": {
                    "ReadCapacityUnits": 1,
                    "WriteCapacityUnits": 1
                }
            },
            {
                "IndexName": "GenderIndex",
                "KeySchema": [
                    {
                        "AttributeName": "gender",
                        "KeyType": "HASH"
                    }
                ],
                "Projection": {
                    "ProjectionType": "ALL"
                },
                "ProvisionedThroughput": {
                    "ReadCapacityUnits": 1,
                    "WriteCapacityUnits": 1
                }
            },
            {
                "IndexName": "EmotionIndex",
                "KeySchema": [
                    {
                        "AttributeName": "emotion",
                        "KeyType": "HASH"
                    }
                ],
                "Projection": {
                    "ProjectionType": "ALL"
                },
                "ProvisionedThroughput": {
                    "ReadCapacityUnits": 1,
                    "WriteCapacityUnits": 1
                }
            },
            {
                "IndexName": "SmileIndex",
                "KeySchema": [
                    {
                        "AttributeName": "smile",
                        "KeyType": "HASH"
                    }
                ],
                "Projection": {
                    "ProjectionType": "ALL"
                },
                "ProvisionedThroughput": {
                    "ReadCapacityUnits": 1,
                    "WriteCapacityUnits": 1
                }
            }
        ],
        "ProvisionedThroughput": {
            "ReadCapacityUnits": 1,
            "WriteCapacityUnits": 1
        }
    }


    /**
     * Constructor
     */
    constructor() {
        this.dynamodb = new DynamoDB()
        // this.createTable(this.params)
    }


    //-----------------------------------------
    // Create table
    //----------------------------------------

    /**
     * Creates a DynamoDB table.
     * This method should only create a table the first time the app is launched.
     * Next time, suppossing the table has already been created, it won't do anything.
     */
    createTable(params) {
        // read/write capaacity units
        const units = 1
            
        this.dynamodb.describeTable({ TableName: params.TableName }, (err, data) => {
            if (err) {
                console.log('Table does not exist. Creating table...');
                this.dynamodb.createTable(params, function (err, data) {

                    if (err) {
                        console.log('Error creating table:', err);
                    } else {
                        console.log('Table created successfully:', data);
                    }
                });

            } else {
                console.log('Table already exists:', data);
            }
        });
    }


    // ------------------------------
    // CRUD Operations
    //-------------------------------

    /**
     * Add new customer to the database
     * 
     * Note: Even though `age` is `number`, it is converted to `string`
     * because `string` is the expected type in the parameters.
     * `smile` is converted from boolean to number, then converted to string.
     * 
     * @param customer 
     * @returns a boolean that is true if the customer has been added successfully.
     */
    addCustomer(customer: Customer) {
        let params = {
            TableName: this.TABLE_NAME,
            Item: {
                'id': { S: this.generateCustomerID() },
                'age': { N: customer.age.toString() },
                'gender': { S: customer.gender },
                'emotion': { S: customer.emotion },
                'smile': { N: Number(customer.smile).toString() },
                'timestamp': { N: Date.now().toString() },
            }
        };

        let isSuccess = false

        this.dynamodb.putItem(params, function (err, data) {
            if (err) {
                console.error("Error when adding customer to the table", err);
            } else {
                isSuccess = true
                console.log("Successfully added new customer", data);
            }
        });

        return isSuccess
    }


    /**
     * Get all customer form customer-demographics table
     * 
     * @returns a promise that contains a list of all customers
     */
    getAllCustomers(): Promise<any> {
        const params = {
            TableName: this.TABLE_NAME,
        };

        // get all customers
        return this.dynamodb.scan(params).promise()
    }

    /**
     * Get cutomer by id
     */
    getCustomerByID(id: string) {
        var params = {
            TableName: this.TABLE_NAME,
            Key: {
                'customer-id': { S: id }
            }
        }

        let customer: any;

        this.dynamodb.getItem(params, function (err, data) {
            if (err) {
                console.log("Error while trying to get customer by ID", err);
            } else {
                customer = data.Item
                console.log("Successfully retrieved customer's data", data.Item);
            }
        })

        return customer
    }

    
    //-------------------------------------------------------------------------------------
    //       Filtering Methods
    // The following methods should not be used unless necessary.
    // It is likely that we have already retrieved all the customers data first.
    // So we could just filter the `customers` array to get customers by age, gender, etc. 
    //-------------------------------------------------------------------------------------

    /**
     * Get cutomers by age.
     * 
     * Warning: Prefer filtering the `customers` array whenever possible
     * to get customers by age.
     */
    getCustomersByAge(age: number) {
        const params = {
            TableName: this.TABLE_NAME,
            IndexName: 'AgeIndex',
            KeyConditionExpression: '#age = :age',
            ExpressionAttributeNames: {
                '#age': 'age',
            },
            ExpressionAttributeValues: {
                ':age': { N: age.toString() },
            },
        }

        let customers: any;

        this.dynamodb.query(params, (err, data) => {
            if (err) {
                console.error('Error querying customers age:', err);
            } else {
                customers = data.Items
                console.log(`Customers with age ${age}: ${data.Items}`);
            }
        })

        return customers
    }

    /**
     * Get cutomers by gender.
     * 
     * Warning: Prefer filtering the `customers` array whenever possible
     * to get customers by gender.
     * 
     * @param gender: either 'Male' or 'Female'
     * @returns an array of all the male customers
     */
    getCustomersByGender(gender: 'Male' | 'Female') {
        const params = {
            TableName: this.TABLE_NAME,
            IndexName: 'GenderIndex',
            KeyConditionExpression: '#gender = :gender',
            ExpressionAttributeNames: {
                '#gender': 'gender',
            },
            ExpressionAttributeValues: {
                ':gender': { S: gender },
            },
        }

        let customers: any[]

        this.dynamodb.query(params, (err, data) => {
            if (err) {
                console.error('Error querying customers gender:', err);
            } else {
                customers = data.Items
                console.log(`${gender} customers: ${data.Items}`);
            }
        })

        return customers
    }

    /**
     * Get cutomers by emotions.
     * 
     * Warning: Prefer filtering the `customers` array whenever possible
     * to get customers by emotions.
     */
    getCustomersByEmotion(emotion: Emotion) {

        const params = {
            TableName: this.TABLE_NAME,
            IndexName: 'EmotionIndex',
            KeyConditionExpression: '#emotion = :emotion',
            ExpressionAttributeNames: {
                '#emotion': 'emotion',
            },
            ExpressionAttributeValues: {
                ':emotion': { S: emotion },
            },
        }

        let customers: any

        this.dynamodb.query(params, (err, data) => {
            if (err) {
                console.error('Error querying customers emotions:', err);
            } else {
                customers = data.Items
                console.log(`${emotion} customers: ${data.Items}`);
            }
        })

        return customers
    }

    /**
     * Get smiling cutomers.
     * 
     * Warning: Prefer filtering the `customers` array whenever possible
     * to get customers who smile.
     */
    getSmilingCustomers(smile: boolean) {
        const params = {
            TableName: this.TABLE_NAME,
            IndexName: 'SmileIndex',
            KeyConditionExpression: '#smile = :smile',
            ExpressionAttributeNames: {
                '#smile': 'smile',
            },
            ExpressionAttributeValues: {
                ':smile': { BOOL: smile },
            },
        }

        let customers: any

        this.dynamodb.query(params, (err, data) => {
            if (err) {
                console.error('Error querying smiling customers:', err);
            } else {
                customers = data.Items
                console.log(`${smile} customers: ${data.Items}`);
            }
        })

        return customers
    }

    /**
     * Get the table information. 
     * 
     * This method is used to get the number of customers in the table.
     * Use a then/catch block to get a `response` and 
     * get the items count with `response.Table.ItemCount`
     * 
     * @returns a promise that contains the table's information.
     */
    getTableInfo() {
        return this.dynamodb.describeTable({ TableName: this.TABLE_NAME }).promise()
    }


    //-----------------------------------
    //        Util Function
    //-----------------------------------

    /**
     * Generate a unique customer ID for DynamoDB.
     * DynamoDB does not support auto-generated IDs.
     * @returns a unique generated ID
     */
    generateCustomerID() {
        return uuidv4()
    }

}

