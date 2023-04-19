import { Component, OnInit } from '@angular/core'

import { DynamoDBService } from '../services/dynamo-db.service'
import { Customer } from '../models/Customer'
import { Emotion } from '../models/enums/emotion'
import { Metrics } from "../models/interfaces/metrics";
import { Charts } from '../utils/charts'

declare var google

// TODO: https://developers.google.com/chart/interactive/docs/gallery/histogram


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
     * A list of all the customers from the database
     */
    customers: any[]

    /**
     * Customers metrics
     */
    customersMetrics: Metrics = {
        gender: { maleCount: 10, femaleCount: 7},
        emotions: { calm: 0, angry: 0, confused: 0, surprised: 0, disgusted: 0, fear: 0, sad: 0, happy: 0 },
        facialExpressions: { smilesCount: 4 },
        generations: { alpha: 5, genZ:10, millennials: 20, genX: 15, babyBoomers: 10, silentGen:5, greatestGen: 0 },
        ageRanges: { between0_9: 5,
            between10_19: 10,
            between20_29: 15,
            between30_39: 20,
            between40_49: 5,
            between50_59: 10,
            between60_69: 3,
            between70_79: 1,
            between80_89: 1,
            between90_99: 7,
            between100_109: 1,
            between110_119: 1,
        },
        timestamp: 0
    }

    currentDate = new Date()


    constructor(private dynamodbService: DynamoDBService) { }

    ngOnInit(): void {
        // this.getAllCustomers()
        Charts.genderBars('gender-bar-chart', this.customersMetrics.gender)
        Charts.genderMonthsLine('gender-months-line-chart', [{femaleCount: 1, maleCount: 2}, {femaleCount: 11, maleCount: 22}, {femaleCount: 31, maleCount: 22}, {femaleCount: 7, maleCount: 4}, {femaleCount: 0, maleCount: 4}, {femaleCount: 13, maleCount: 55},
            {femaleCount: 7, maleCount: 9}, {femaleCount: 4, maleCount: 3}, {femaleCount: 3, maleCount: 2}, {femaleCount: 1, maleCount: 2}, {femaleCount: 5, maleCount: 8}, {femaleCount: 7, maleCount: 5}, ])

        Charts.generationsBars('generations-bar-chart', this.customersMetrics.generations)
        Charts.generationsHistogram('generations-histogram', this.customersMetrics.ageRanges)

        // google.charts.load('current', { packages: ['corechart', 'bar', 'line'] })
        //
        // google.charts.setOnLoadCallback(() => {
        //     this.drawGenderLines2();
        // });
    }

    /**
     * Load google charts, then call the function to draw the charts.
     */
    loadGoogleCharts() {
        google.charts.load('current', { packages: ['corechart', 'bar', 'line'] })

        google.charts.setOnLoadCallback(() => {
            const womenCount = this.customersMetrics.gender.femaleCount;
            const menCount = this.customersMetrics.gender.maleCount;
            this.drawGenderBars(womenCount, menCount);
        });

        google.charts.setOnLoadCallback(() => {
            this.drawAgeBars(this.customersMetrics.generations);
        });

        google.charts.setOnLoadCallback(() => {
            const ages = this.customers.map(customer => parseInt(customer.age.N))
            this.drawAgeHistogram(ages);
        });

        google.charts.setOnLoadCallback(() => {
            this.drawGenderLines2();
        });

        // Charts.drawGenderBars(this.customersMetrics.female, this.customersMetrics.male)
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
     * Get the customers' metrics.
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
            this.customersMetrics.gender.femaleCount = female.length

        this.customersMetrics.gender.maleCount = this.customers.length - this.customersMetrics.gender.femaleCount

        // TODO use enum type Emotion
        // // emotions count
        const calmCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.emotion.S === 'CALM'
        })
        this.customersMetrics.emotions.calm = calmCustomers.length

        const angryCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.emotion.S === 'ANGRY'
        })
        this.customersMetrics.emotions.angry = angryCustomers.length

        const confusedCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.emotion.S === 'CONFUSED'
        })
        this.customersMetrics.emotions.confused = confusedCustomers.length

        const surprisedCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.emotion.S === 'SURPRISED'
        })
        this.customersMetrics.emotions.surprised = surprisedCustomers.length

        const disgustedCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.emotion.S === 'DISGUSTED'
        })
        this.customersMetrics.emotions.disgusted = disgustedCustomers.length

        const scaredCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.emotion.S === 'FEAR'
        })
        this.customersMetrics.emotions.fear = scaredCustomers.length

        const sadCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.emotion.S === 'SAD'
        })
        this.customersMetrics.emotions.sad = sadCustomers.length

        const happyCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.emotion.S === 'HAPPY'
        })
        this.customersMetrics.emotions.happy = happyCustomers.length

        // count of customers who smile
        const smilingCustomers = this.customers.filter((customer) => {
            return customer.emotion && customer.smile.N === '1'
        })
        this.customersMetrics.facialExpressions.smilesCount = smilingCustomers.length

        // -------------------------
        // Generations of customers
        // ------------------------
        this.customers.forEach(customer => {
            let age = parseInt(customer.age.N)
            if (age <= 10)
                this.customersMetrics.generations.alpha++
            else if (age > 10 && age <= 28)
                this.customersMetrics.generations.genZ++
            else if (age > 28 && age <= 43)
                this.customersMetrics.generations.millennials++
            else if (age > 43 && age <= 58)
                this.customersMetrics.generations.genX++
            else if (age > 58 && age <= 77)
                this.customersMetrics.generations.babyBoomers++
            else if (age > 77 && age <= 98)
                this.customersMetrics.generations.silentGen++
            else
                this.customersMetrics.generations.greatestGen++
        })

        // -------------------------
        // Age Range of customers
        // ------------------------
        this.customers.forEach(customer => {
            let age = parseInt(customer.age.N)
            if (age <= 9)
                this.customersMetrics.ageRanges.between0_9++
            else if (age >= 10 && age <= 19)
                this.customersMetrics.ageRanges.between10_19++
            else if (age >= 20 && age <= 29)
                this.customersMetrics.ageRanges.between20_29++
            else if (age > 30 && age <= 39)
                this.customersMetrics.ageRanges.between30_39++
            else if (age > 40 && age <= 49)
                this.customersMetrics.ageRanges.between40_49++
            else if (age > 50 && age <= 59)
                this.customersMetrics.ageRanges.between50_59++
            else if (age > 60 && age <= 69)
                this.customersMetrics.ageRanges.between60_69++
            else if (age > 70 && age <= 79)
                this.customersMetrics.ageRanges.between70_79++
            else if (age > 80 && age <= 89)
                this.customersMetrics.ageRanges.between80_89++
            else if (age > 90 && age <= 99)
                this.customersMetrics.ageRanges.between90_99++
            else if (age > 100 && age <= 109)
                this.customersMetrics.ageRanges.between100_109++
            else if (age > 100 && age <= 109)
                this.customersMetrics.ageRanges.between110_119++

        })
    }

    getCustomersByDate() {
        this.customers.filter(customer => {
            const date = new Date(customer.timestamp)
            const year = date.getFullYear()
            const month = date.getMonth()
            const day  = date.getDate()

            let customersCountPerMonth = new Array(12);
             customersCountPerMonth[month]++
        })
    }

    //-------------------------
    // Charts Functions
    //-------------------------

    /**
     * Draw a bar chart where the bars represent the number of men and women.
     *
     * @param womenCount
     * @param menCount
     */
    drawGenderBars(womenCount: number, menCount: number) {

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


    /**
     * Draw a bar chart where each bar represent
     * the number of customers for a given generation.
     *
     * The `AgeGenerations` object contains a key-value pair where
     * the key is the generation, and the value is the number of individuals.
     *
     * @param ageGenerations: an `AgeGenerations` object.
     */
    drawAgeBars(ageGenerations) {

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

    /**
     * Draw a histogram of the individuals' age.
     *
     * @param ages
     */
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

    drawGenderLines() {
        let data = new google.visualization.DataTable();
        data.addColumn('number', 'X');
        data.addColumn('number', 'Dogs');
        data.addColumn('number', 'Cats');

        data.addRows([
            [0, 0, 0],    [1, 10, 5],   [2, 23, 15],  [3, 17, 9],   [4, 18, 10],  [5, 9, 5],
            [6, 11, 3],   [7, 27, 19],  [8, 33, 25],  [9, 40, 32],  [10, 32, 24], [11, 35, 27],
            [12, 30, 22], [13, 40, 32], [14, 42, 34], [15, 47, 39], [16, 44, 36], [17, 48, 40],
            [18, 52, 44], [19, 54, 46], [20, 42, 34], [21, 55, 47], [22, 56, 48], [23, 57, 49],
            [24, 60, 52], [25, 50, 42], [26, 52, 44], [27, 51, 43], [28, 49, 41], [29, 53, 45],
            [30, 55, 47], [31, 60, 52], [32, 61, 53], [33, 59, 51], [34, 62, 54], [35, 65, 57],
            [36, 62, 54], [37, 58, 50], [38, 55, 47], [39, 61, 53], [40, 64, 56], [41, 65, 57],
            [42, 63, 55], [43, 66, 58], [44, 67, 59], [45, 69, 61], [46, 69, 61], [47, 70, 62],
            [48, 72, 64], [49, 68, 60], [50, 66, 58], [51, 65, 57], [52, 67, 59], [53, 70, 62],
            [54, 71, 63], [55, 72, 64], [56, 73, 65], [57, 75, 67], [58, 70, 62], [59, 68, 60],
            [60, 64, 56], [61, 60, 52], [62, 65, 57], [63, 67, 59], [64, 68, 60], [65, 69, 61],
            [66, 70, 62], [67, 72, 64], [68, 75, 67], [69, 80, 72]
        ]);

        let options = {
            hAxis: {
                title: 'Time'
            },
            vAxis: {
                title: 'Popularity'
            },
            colors: ['#a52714', '#097138'],
            crosshair: {
                color: '#000',
                trigger: 'selection'
            }
        };

        let chart = new google.visualization.LineChart(document.getElementById('gender-line-chart'));

        chart.draw(data, options);
        chart.setSelection([{row: 38, column: 1}]);
    }

    drawGenderLines2() {
        let data = google.visualization.arrayToDataTable([
            ['Day', 'Women', 'Men'],
            ['2004',  7,      4],
            ['2005',  8,      5],
            ['2006',  9,       6],
            ['2007',  1,      7]
        ]);

        let options = {
            title: 'Genders Quantization Over Time',
            curveType: 'function',
            legend: { position: 'bottom' },
            colors: ['teal', 'gray'],
            hAxis: {
                // minValue: 0,
            },
            vAxis: {
                gridlines: {
                    color: 'transparent'
                },
            },
        };

        let chart = new google.visualization.LineChart(document.getElementById('gender-line'));
        chart.draw(data, options);
    }
}
