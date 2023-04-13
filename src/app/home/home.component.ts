import { Component, OnInit } from '@angular/core'

import { DynamoDBService } from '../services/dynamo-db.service'
import { Customer } from '../models/Customer'
import { Emotion } from '../models/emotions'
import Chart from 'chart.js/auto'
import { ChartType, Row } from "angular-google-charts";

declare var google

// TODO: https://developers.google.com/chart/interactive/docs/gallery/histogram

interface CustomersMetrics {
    /**
     * The count of customers gender, emotions
     */
    male: number
    female: number

    calm: number
    angry: number
    confused: number
    surprised: number
    disgusted: number
    fear: number
    sad: number
    happy: number

    smile: number

    ageCategory: AgeCategory
}

interface AgeCategory {
    /**
     * Age Generations:
     */
    alpha: number           // 0 - 10 years
    z: number               // 11 - 28
    millennials: number     // 29 - 43
    generationX: number     // 44 - 58
    babyBoomers: number     // 59 - 77
    silentGeneration: number    // 78 - 98
    greatestGeneration: number  // 99 - 122
}


/**
 * A component that displays the home page with a Dashboard
 * showing insights about data form the DynamoDB database.
 */
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    /**
     * A list of all of the customers from the database
     */
    customers: any[]

    customersMetrics: CustomersMetrics = {
        male: 0, female: 0,
        calm: 0, angry: 0, confused: 0, surprised: 0, disgusted: 0, fear: 0, sad: 0, happy: 0,
        smile: 0,
        ageCategory: {
            alpha: 0, z: 0, millennials: 0, generationX: 0, babyBoomers: 0,
            silentGeneration: 0, greatestGeneration: 0
        }
    }

    currentDate = new Date()

    genderData = [
        ['Femme', 10],
        ['Homme', 40],
    ];

    genderColumns = ['City', 'Inhabitants'];
    columnChart = ChartType.ColumnChart;
    chartOptions = {
        colors: ['#e0440e', '#e6693e'],
    }

    public chart: any
    chartJS() {
        this.chart = new Chart("MyChart", {
            type: 'bar', //this denotes tha type of chart

            data: {// values on X-Axis
                labels: ['2022-05-10', '2022-05-11', '2022-05-12', '2022-05-13',
                    '2022-05-14', '2022-05-15', '2022-05-16', '2022-05-17',],
                datasets: [
                    {
                        label: "Sales",
                        data: ['467', '576', '572', '79', '92',
                            '574', '573', '576'],
                        backgroundColor: 'blue'
                    },
                    {
                        label: "Profit",
                        data: ['542', '542', '536', '327', '17',
                            '0.00', '538', '541'],
                        backgroundColor: 'limegreen'
                    }
                ]
            },
            options: {
                aspectRatio: 2.5
            }

        })

    }

    drawAgeChart(ageGenerations) {

        let data = google.visualization.arrayToDataTable([
            ['Age', 'Value', { role: 'style' }],
            ['Alpha (0-10)', ageGenerations.alpha, 'fill-color: #A9DDD6'],
            ['Z (11 - 28)', ageGenerations.z, 'fill-color: #7A8B99'],
            ['Millennials (29 - 43)', ageGenerations.millennials, 'fill-color: #91ADC2'],
            ['Generation X (44 - 58)', ageGenerations.generationX, 'fill-color: #9BA0BC'],
            ['Baby Boomers (59 - 77)', ageGenerations.babyBoomers, 'fill-color: #C1B8C8'],
            ['Silent Generation (78 - 98)', ageGenerations.silentGeneration, 'fill-color: #BBBBFF'],
            ['Greatest Gen. (99 - 122)', ageGenerations.greatestGeneration, 'fill-color: #C5A5CF'],
        ])

        let options = {
            title: 'Generation des clients',
            chartArea: { width: '30%' },
            hAxis: {
                title: '',
                minValue: 0,
                // textPosition: 'none',
                gridlines: {
                    color: 'transparent'
                },
                ticks: [0, 3, 6]
            },
            vAxis: {
                title: '',
                // textPosition: 'none',
                gridlines: {
                    color: 'transparent'
                }
            },
            legend: { position: 'none' },
            fontSize: 20,
        }

        let chart = new google.visualization.BarChart(document.getElementById('age-chart'))

        chart.draw(data, options)
    }

    drawAgeHistogram(ages: number[]) {


        let data = new google.visualization.DataTable();

        data.addColumn('number', 'Age');
        data.addRows(ages.map(age => [age]));       // [age] to transform into an array 

        const options = {
            title: "Distribution de l'age",
            legend: { position: 'none' },
            // histogram: { bucketSize: 5 },
            colors: ['#C5A5CF'],
            dataOpacity: 0.8,
            fontSize: 20,
            vAxis: {
                textPosition: 'none',
                gridlines: {
                    color: 'transparent'
                }
            },
        }

        let chart = new google.visualization.Histogram(document.getElementById('age-histogram-div'));
        chart.draw(data, options);
    }

    drawGenderChart(womenCount: number = 1, menCount: number = 4) {

        let data = google.visualization.arrayToDataTable([
            ['Gender', 'Number', { role: 'style' }],
            ['Femme', womenCount, 'fill-color: #C5A5CF'],
            ['Homme', menCount, 'fill-color: #BBBBFF'],
            // ['Femme', this.customersMetrics.female, 'stroke-color: #bfbbff; stroke-width: 4; fill-color: #bbbbff'],
            // ['Homme', this.customersMetrics.male, 'stroke-color: #703593; stroke-width: 4; fill-color: #C5A5CF'],
        ])

        let options = {
            title: "Nombre de femmes et d'hommes",
            // chartArea: { width: '50%' },
            hAxis: {
                title: '',
                minValue: 0,
                gridlines: {
                    color: 'transparent'
                }
            },
            vAxis: {
                title: '',
                gridlines: {
                    color: 'transparent'
                },
                ticks: [0, 3, 6, 9]
            },
            legend: { position: 'none' },
        }

        let chart = new google.visualization.BarChart(document.getElementById('gender-chart'))

        chart.draw(data, options)

    }


    constructor(private dynamodbService: DynamoDBService) { }

    ngOnInit(): void {
        this.getAllCustomers()
        // this.drawBasic()
        // this.chartJS()
    }

    loadGoogleCharts() {
        google.charts.load('current', { packages: ['corechart', 'bar'] })

        google.charts.setOnLoadCallback(() => {
            const womenCount = this.customersMetrics.female;
            const menCount = this.customersMetrics.male;
            this.drawGenderChart(womenCount, menCount);
        });

        google.charts.setOnLoadCallback(() => {
            this.drawAgeChart(this.customersMetrics.ageCategory);
        });

        google.charts.setOnLoadCallback(() => {
            const ages = this.customers.map(customer => parseInt(customer.age.N))
            this.drawAgeHistogram(ages);
        });
    }

    /**
     * Get all the customers from the database
     */
    getAllCustomers() {
        this.dynamodbService.getAllCustomers()
            .then(data => {
                // console.log('Customers:', JSON.stringify(data.Items, null, 2))
                this.customers = data.Items
                this.getCustomersMetrics()
                this.loadGoogleCharts()
            })
            .catch(err => {
                console.error('An error occured when scanning the table:', err)
            })
    }

    // getCustomersCount() {
    //     this.dynamodbService.getTableInfo()
    //         .then(response => this.customerCount = response.Table.ItemCount)
    //         .catch(err => console.log("Error getting customers count: ", err))
    // }

    /**
     * Get the customers metrics.
     * 
     * By retrieving all the customers and filtering the array to retrieve
     * the information we need, we reduce read cost on AWS DynamoDB.
     */
    getCustomersMetrics() {
        // Reading data again and again from the table is costly
        // const females = this.dynamodbService.getCustomersByGender('Female')
        // this.customersMetrics.womenCount = females.length

        // men & women count

        let female = this.customers.filter((customer) => {
            return customer.gender.S === 'Female'
        })

        if (female && female.length)
            this.customersMetrics.female = female.length

        this.customersMetrics.male = this.customers.length - this.customersMetrics.female

        // // emotions count
        const calmCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.emotion.S === 'CALM'
        })
        this.customersMetrics.calm = calmCustomers.length

        const angryCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.emotion.S === 'ANGRY'
        })
        this.customersMetrics.angry = angryCustomers.length

        const confusedCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.emotion.S === 'CONFUSED'
        })
        this.customersMetrics.confused = confusedCustomers.length

        const surprisedCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.emotion.S === 'SURPRISED'
        })
        this.customersMetrics.surprised = surprisedCustomers.length

        const disgustedCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.emotion.S === 'DISGUSTED'
        })
        this.customersMetrics.disgusted = disgustedCustomers.length

        const scaredCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.emotion.S === 'FEAR'
        })
        this.customersMetrics.fear = scaredCustomers.length

        const sadCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.emotion.S === 'SAD'
        })
        this.customersMetrics.sad = sadCustomers.length

        const happyCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.emotion.S === 'HAPPY'
        })
        this.customersMetrics.happy = happyCustomers.length

        // count of customers who smile
        const smilingCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.smile.N === '1'
        })
        this.customersMetrics.smile = smilingCustomers.length

        // grouping customer age into intervals
        this.customers.forEach(customer => {
            let age = parseInt(customer.age.N)
            if (age <= 10)
                this.customersMetrics.ageCategory.alpha++
            else if (age > 10 && age <= 28)
                this.customersMetrics.ageCategory.z++
            else if (age > 28 && age <= 43)
                this.customersMetrics.ageCategory.millennials++
            else if (age > 43 && age <= 58)
                this.customersMetrics.ageCategory.generationX++
            else if (age > 58 && age <= 77)
                this.customersMetrics.ageCategory.babyBoomers++
            else if (age > 77 && age <= 98)
                this.customersMetrics.ageCategory.silentGeneration++
            else if (age > 98)
                this.customersMetrics.ageCategory.greatestGeneration
            else
                ;
        })
    }



}
