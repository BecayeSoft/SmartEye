/**
 * This interface serves as a dictionary where each key is the age range,
 * and each value is the number of individuals in that age range.
 * For example `between0_9` are the individuals between 0 and 9 years old.
 *
 * It is similar to the `Generations` interface. THe main difference is that
 * it is used for creating a histogram of ages instead of a bar chart.
 *
 */
export interface AgeRanges {
    between0_9: number
    between10_19: number
    between20_29: number
    between30_39: number
    between40_49: number
    between50_59: number
    between60_69: number
    between70_79: number
    between80_89: number
    between90_99: number
    between100_109: number
    between110_119: number
}
