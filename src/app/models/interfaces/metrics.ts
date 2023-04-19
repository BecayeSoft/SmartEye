import { Emotions } from "./emotions";
import { FacialExpressions } from "./facial-expressions";
import { Genders } from "./genders";
import { Generations } from "./generations";
import {AgeRanges} from "./age-ranges";

/**
 * This interface serves as a dictionary to track individuals metrics.
 * It groups all the others dictionaries created in hte `interface` folder.
 * Read their description for more information.
 */
export interface Metrics {
    gender: Genders
    emotions: Emotions
    generations: Generations
    ageRanges: AgeRanges
    facialExpressions: FacialExpressions
    timestamp: number
}
