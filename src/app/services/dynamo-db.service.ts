import { Injectable } from '@angular/core';
import { DynamoDB } from 'aws-sdk'

import { Customer } from '../models/Customer'
import { AWSService } from './aws.service';

/**
 * This is a service that handles all the operations to DynamoDB.
 */
@Injectable({
    providedIn: 'root'
})
export class DynamoDBService {

    // the DynamoDB service object
    dynamodb: DynamoDB;


    /**
     * Constructor
     */
    constructor(private awsService: AWSService) {
        this.awsService.initAWS()
        this.dynamodb = new DynamoDB()
        this.createTable()
    }

    /**
     * Creates a DynamoDB table.
     * This method should only create a table the first time the app is launched.
     * Next time, suppossing the table has already been created, it won't do anything.
     */
    createTable() {
        // read/write capaacity units
        const units = 1
        let params = {
            "TableName": "customer-demographics",
            "AttributeDefinitions": [
                {
                    "AttributeName": "customer-id",
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
                }
            ],
            "KeySchema": [
                {
                    "AttributeName": "customer-id",
                    "KeyType": "HASH"
                }
            ],
            "GlobalSecondaryIndexes": [
                {
                    "IndexName": "CustomerIdIndex",
                    "KeySchema": [
                        {
                            "AttributeName": "customer-id",
                            "KeyType": "HASH"
                        }
                    ],
                    "Projection": {
                        "ProjectionType": "KEYS_ONLY"
                    },
                    "ProvisionedThroughput": {
                        "ReadCapacityUnits": 1,
                        "WriteCapacityUnits": 1
                    }
                },
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

    /**
     * Add new customer to the database
     * Note: Even though `age` is `number`, it is converted to `string`
     * because `string` is the expected type in the parameters.
     * `smile` is converted from boolean to number first.
     * 
     * @param customer 
     * @returns a boolean that is true if the customer has been added successfully.
     */
    addCustomer(customer: Customer) {
        let params = {
            TableName: 'customer-demographics',
            Item: {
                'age': { N: customer.age.toString() },
                'gender': { S: customer.gender },
                'emotion': { S: customer.emotion },
                'smile': { N: Number(customer.smile).toString() }
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
     */
    getAllCustomers() {
        let customers: any

        const params = {
            TableName: 'customer-demographics',
        };

        // Call the Scan operation to get all customers
        this.dynamodb.scan(params, (err, data) => {
            if (err) {
                console.error('Unable to scan the table:', JSON.stringify(err, null, 2));
            } else {
                customers = JSON.stringify(data.Items, null, 2)
                console.log('Customers:', JSON.stringify(data.Items, null, 2));
            }
        })

        return customers
    }

    /**
     * Get cutomer by id
     */
    getCustomerByID(id: string) {
        var params = {
            TableName: 'customer-demographics',
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

    /**
     * Get cutomers by age
     */
    getCustomersByAge(age: number) {
        const params = {
            TableName: 'customer-demographics',
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
     * Get cutomers by gender
     */
    getCustomersByGender(gender: string) {
        const params = {
            TableName: 'customer-demographics',
            IndexName: 'GenderIndex',
            KeyConditionExpression: '#gender = :gender',
            ExpressionAttributeNames: {
                '#gender': 'gender',
            },
            ExpressionAttributeValues: {
                ':gender': { S: gender },
            },
        }

        let customers: any

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
     * Get cutomers by emotions
     */
    getCustomersByEmotion(emotion: string) {
        const params = {
            TableName: 'customer-demographics',
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
     * Get smiling cutomers
     */
    getSmilingCustomers(smile: boolean) {
        const params = {
            TableName: 'customer-demographics',
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


}

