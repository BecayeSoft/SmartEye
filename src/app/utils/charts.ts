import Chart from "chart.js/auto";
import { Metrics } from "../models/interfaces/metrics";
import { Genders } from "../models/interfaces/genders";
import {Generations} from "../models/interfaces/generations";
import {AgeRanges} from "../models/interfaces/age-ranges";

export class Charts {

    // TODO: line chart with days

    /**
     * Draw a line chart showing females and males count over the months.
     * Receives as parameter an array of Genders containing the count of females
     * and males for each month of the year.
     *
     * Important: `gender` must be of size 12
     *
     * @param genders: an array of Genders
     */
    static genderMonthsLine(canvasID, genders: Genders[]) {
        const ctx = document.getElementById(canvasID) as HTMLCanvasElement;
        let femaleCounts: number[] = []
        let maleCounts: number[] = []

        genders.forEach(gender => {
            femaleCounts.push(gender.femaleCount)
            maleCounts.push(gender.maleCount)
        })

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [
                    {
                        label: 'Femmes',
                        data: femaleCounts,
                        borderColor: 'rgba(54, 162, 235, 0.9)',
                        borderWidth: 1
                    },
                    {
                        label: 'Hommes',
                        data: maleCounts,
                        borderColor: 'rgb(153, 102, 255)',
                        borderWidth: 1,
                    },
                ]
            },
            options: {
                // responsive: false,
                maintainAspectRatio: false,

                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                // plugins: {
                //     legend: {
                //         display: false
                //     }
                // }
            }
        });
    }

    /**
     * Draw a bar chart comparing the number of females and males.
     * TODO: group by  months
     *
     * @param gender
     */
    static genderBars(canvasID: string, gender: Genders) {
        const ctx = document.getElementById(canvasID) as HTMLCanvasElement;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Women', 'Men'],
                datasets: [{
                    label: 'Count',
                    data: [gender.femaleCount, gender.maleCount],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                // responsive: false,
                maintainAspectRatio: false,

                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    /**
     * Draw a bar chart showing the different generations.ts of individuals.
     *
     * @param containerID: ID of the canvas
     */
    static generationsBars(canvasID: string, generations: Generations) {
        const ctx = document.getElementById(canvasID) as HTMLCanvasElement;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Alpha (0-10)', 'Gen Z (11 - 28)', 'Millennials (29 - 43)', 'Gen. X (44 - 58)',
                    'Baby Boomers (59 - 77)', 'Silent Gen. (78 - 98)', 'Greatest Gen. (99 - 122)'],
                datasets: [{
                    label: 'Count',
                    data: [generations.alpha, generations.genZ, generations.millennials, generations.genX,
                    generations.babyBoomers, generations.silentGen, generations.greatestGen],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                // responsive: false,
                maintainAspectRatio: false,

                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }


    static generationsHistogram(canvasID: string, ageRanges: AgeRanges) {
        const ctx = document.getElementById(canvasID) as HTMLCanvasElement;

        new Chart(ctx, {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'Ages',
                    data: [
                        { x: 10, y: ageRanges.between0_9 },
                        { x: 20, y: ageRanges.between10_19 },
                        { x: 30, y: ageRanges.between20_29 },
                        { x: 40, y: ageRanges.between30_39 },
                        { x: 50, y: ageRanges.between40_49 },
                        { x: 60, y: ageRanges.between50_59 },
                        { x: 70, y: ageRanges.between60_69 },
                        { x: 80, y: ageRanges.between70_79 },
                        { x: 90, y: ageRanges.between80_89 },
                        { x: 100, y: ageRanges.between90_99 },
                        { x: 110, y: ageRanges.between100_109 },
                        { x: 120, y: ageRanges.between110_119 },
                    ],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 1,

                    // histogram trick
                    barPercentage: 1,
                    categoryPercentage: 1
                }]
            },
            options: {
                // responsive: false,
                maintainAspectRatio: false,

                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            // offset: false
                        },
                        // histogram trick
                        type: 'linear',
                        offset: false,
                        title: {
                            display: true,
                            text: 'Age'
                        },
                        ticks: {
                            stepSize: 10
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

}
