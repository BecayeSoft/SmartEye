/**
 * This interface serves as a dictionary where each key is the generation,
 * and each value is the number of individuals in that generation.
 *
 * Here is a comprehensive list of the generations.ts:
 *      Alpha: 2013-2025
 *      Z: 1997 - 2012
 *      Millennials: 1981 - 1996
 *      Generation x: 1966 - 1980
 *      Baby boomers: 1946 - 1965
 *      Silent Generation: 1928 - 1945
 *      Greatest Generation: 1900 - 1928
 */
export interface Generations {
    alpha: number
    genZ: number
    millennials: number
    genX: number
    babyBoomers: number
    silentGen: number
    greatestGen: number
}
