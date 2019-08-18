import { convertScores, Scores } from './scores';

export class ApiRequest {
    constructor(public type: RequestType, public courses?: string[]) { }

    public toString(): string {
        let components = [["type", this.type]];
        if (this.courses) components.push(
            ["courses", JSON.stringify(this.courses)]);
        return components.map((component => component.join('='))).join('&');
    }
}

export enum RequestType {
    Reviews = "reviews",
    Scores = "scores",
}

export function api(request: ApiRequest) {
    const base = "https://us-east1-brown-critical-review.cloudfunctions.net/api";
    return fetch(`${base}?${request}`).then(response => response.json());
}

export async function getAllScores(): Promise<Scores> {
    const cached = localStorage.getItem('scores');
    if (cached) return JSON.parse(cached);
    else {
        const request = new ApiRequest(RequestType.Scores);
        const scores = await api(request).then(convertScores);
        localStorage.setItem('scores', JSON.stringify(scores));
        return scores;
    }
}