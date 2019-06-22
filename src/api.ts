import { Scores, Course } from "./scores";

const apiURL = "https://us-east1-brown-critical-review.cloudfunctions.net/getCourseReviews";

interface Review {
    department_code: string;
    course_num: string;
    edition: string;
    profavg: number;
    courseavg: number;
}

class ReviewSelector {
    department_code: string;
    course_num: string;
}

export function api(selectors: ReviewSelector[]): Promise<Review[]> {
    return fetch(apiURL + `?selectors=${JSON.stringify(selectors)}`)
        .then(response => response.json());
}

export async function getScores(courses: Course[]): Promise<{ [s: string]: Scores }> {
    console.log(`Finding scores for ${courses.length} courses`);
    const selectors = courses.map(course => {
        return {
            department_code: course.department,
            course_num: course.code
        };
    });

    const reviews = await api(selectors);
    console.log(`Found ${reviews.length} reviews`);

    const allScores = {};
    courses.forEach(course => allScores[course.name] = new Scores());
    reviews.map(convertIfNecessary).forEach(review => {
        const name = review.department_code + ' ' + review.course_num;
        const scores = allScores[name];
        scores.profSum += review.profavg;
        scores.profCount++;
        scores.courseSum += review.courseavg;
        scores.courseCount++;
    });
    return allScores;
}

export function convertIfNecessary(review: Review): Review {
    function shouldConvert(edition: string): boolean {
        var arr = edition.split('.').map(Number.parseInt);
        return (arr[0] < 2014 || (arr[0] === 2014 && arr[2] !== 2));
    }

    function convert(score: number): number {
        return (-4 / 3) * score + (19 / 3);
    }

    if (shouldConvert(review.edition)) {
        review.profavg = convert(review.profavg);
        review.courseavg = convert(review.courseavg);
    }
    return review;
}