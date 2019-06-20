import { Course, Scores, meanAccumulator } from "./scores";

const apiURL = "https://us-east1-brown-critical-review.cloudfunctions.net/getCourseReviews";

interface Review {
    edition: string;
    profavg: number;
    courseavg: number;
}

export function api(course: Course): Promise<Review[]> {
    return fetch(apiURL + `?department_code=${course.department}&course_num=${course.code}`)
        .then(response => response.json());
}

export async function getScores(course: Course): Promise<Scores> {
    console.log(`Finding scores for ${course.department} ${course.code}`);
    let reviews = await api(course);
    console.log(`Reviews for ${course.full}:`, reviews);
    let acc = new meanAccumulator();
    reviews.map(convertIfNecessary).forEach(review => {
        if (review.profavg) {
            acc.profSum += review.profavg;
            acc.profCount++;
        }
        if (review.courseavg) {
            acc.courseSum += review.courseavg;
            acc.courseCount++;
        }
    });
    console.log("Accumulator:", acc);
    return new Scores(acc);
}

function convertIfNecessary(review: Review): Review {
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