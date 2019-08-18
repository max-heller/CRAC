import { Scores } from './scores';

export interface ApiRequest {
    toString(): string;
}

export async function api(request: ApiRequest): Promise<any> {
    const base = "https://localhost:8443";
    const response = await fetch(`${base}/${request}`, {
        method: 'GET',
        credentials: 'include'
    });
    if (response.status == 200) return response.json();
    else {
        chrome.tabs.create({ url: "https://localhost:8443" });
    }
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

export async function getAllScores(): Promise<Scores> {
    const cached = localStorage.getItem('scores');
    if (cached) return JSON.parse(cached);
    else {
        const courseScoresRequest = new ScoresRequest(ScoresRequestType.Courses);
        const courseScores = await api(courseScoresRequest);
        const profScoresRequest = new ScoresRequest(ScoresRequestType.Professors);
        const profScores = await api(profScoresRequest);
        const scores = new Scores(courseScores, profScores);
        localStorage.setItem('scores', JSON.stringify(scores));
        return scores;
    }
}