import { Scores, ScoreAccumulator } from "./scores";

const apiURL = "https://us-east1-brown-critical-review.cloudfunctions.net/getCourseReviews";

interface Review {
    department_code: string;
    course_num: string;
    edition: string;
    profavg: number;
    courseavg: number;
}

type CourseMap<T> = { [s: string]: T };

export function getAllReviews(): Promise<Review[]> {
    return fetch(apiURL).then(response => response.json());
}

export function getAllScores(): Promise<CourseMap<Scores>> {
    return getAllReviews().then(calculateScores);
}

export function calculateScores(reviews: Review[]): CourseMap<Scores> {
    const accumulators = {};
    reviews.map(convertIfNecessary).forEach(review => {
        // Locate or initialize scores accumulator for the review's course
        let deptAccs = accumulators[review.department_code];
        if (!deptAccs) deptAccs = accumulators[review.department_code] = {};
        let courseAcc = deptAccs[review.course_num];
        if (!courseAcc) courseAcc = deptAccs[review.course_num] = new ScoreAccumulator();

        // Update course's scores accumulator
        if (review.profavg) {
            courseAcc.profSum += review.profavg;
            courseAcc.profCount++;
        }
        if (review.courseavg) {
            courseAcc.courseSum += review.courseavg;
            courseAcc.courseCount++;
        }
    });

    const allScores = {};
    Object.entries(accumulators).forEach(([dept, deptAccs]) => {
        Object.entries(deptAccs).forEach(([num, acc]) => {
            const name = dept + ' ' + num;
            allScores[name] = Scores.fromAccumulator(acc);
        });
    });
    return allScores;
}

export function convertIfNecessary(review: Review): Review {
    function shouldConvert(edition: string): boolean {
        var arr = edition.split('.').map(Number.parseInt);
        return (arr[0] < 2014 || (arr[0] === 2014 && arr[2] !== 2));
    }

    function convert(score: number): number {
        // Make sure not to convert falsy score
        return score ? (-4 / 3) * score + (19 / 3) : 0;
    }

    if (shouldConvert(review.edition)) {
        review.profavg = convert(review.profavg);
        review.courseavg = convert(review.courseavg);
    }
    return review;
}