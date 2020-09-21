import { Scores } from './scores';

/** The URL for Brown University's Critical Review */
export const BROWNCR = "https://thecriticalreview.org";

/** Interface representing requests for the Critical Review API */
export interface ApiRequest {
    toString(): string;
}

/**
 * Query the Critical Review API
 * @param request the desired request
 */
export async function api(request: ApiRequest): Promise<any> {
    return fetch(`${BROWNCR}/${request}`, {
        method: 'GET',
        credentials: 'include'
    }).then(response => {
        if (response.status === 200) return response.json();
        else throw new Error("Non-200 status from thecriticalreview.org API");
    });
}

/**
 * Attempts to retry some action after prompting the user to log in
 * @param f A thunk to be executed after logging in
 *
 * Ignored for the purpose of coverage because of reliance on chrome APIs,
 * which aren't present for unit tests.
 */
/* istanbul ignore next */
export async function loginAndRetry<T>(f: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage('require-login', response => {
            if (response === 'retry') f().then(resolve, reject);
        });
    });
}

export class CourseScore {
    department_code: string;
    course_num: string;
    score: number;
}

export class ProfessorScore {
    professor: string;
    score: number;
}

export enum ScoresRequestType {
    Courses = "courses",
    Professors = "professors",
}

export class ScoresRequest {
    constructor(public type: ScoresRequestType) { }

    public toString(): string {
        return `scores/${this.type}`;
    }
}

/** Retrieve all course and professor scores from the Critical Review's API */
export async function getAllScores(): Promise<Scores> {
    const cached = sessionStorage.getItem('scores');
    if (cached) return JSON.parse(cached);
    else {
        const courseScoresRequest = new ScoresRequest(ScoresRequestType.Courses);
        const profScoresRequest = new ScoresRequest(ScoresRequestType.Professors);
        return Promise.all([api(courseScoresRequest), api(profScoresRequest)])
            .then(([courseScores, profScores]) => {
                const scores = new Scores(courseScores, profScores);
                sessionStorage.setItem('scores', JSON.stringify(scores));
                return scores;
            });
    }
}
