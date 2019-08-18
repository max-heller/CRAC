import { CourseScore, ProfessorScore } from './api';

export enum ScoreType {
    Course = "course",
    Prof = "prof",
}

export class Scores {
    course: { [s: string]: number };
    prof: { [s: string]: number };

    constructor(courseScores: CourseScore[], professorScores: ProfessorScore[]) {
        const scores = { course: {}, prof: {} };
        courseScores.forEach(courseScore => {
            const name = `${courseScore.department_code} ${courseScore.course_num}`;
            scores.course[name] = courseScore.score;
        });
        professorScores.forEach(profScore => {
            const name = convertProfNames(profScore.professor);
            scores.prof[name] = profScore.score;
        });
        return scores;
    }
}

class Name {
    first: string;
    last: string;

    constructor(raw: string) {
        const split = raw.split(', ');
        if (split.length == 2) {
            [this.last, this.first] = split;
        } else {
            const [first, ...rest] = raw.split(' ');
            this.first = first;
            this.last = rest[rest.length - 1];
        }
    }

    public toString(): string {
        return `${this.first[0]}. ${this.last}`;
    }
}

export function convertProfNames(names: string): string {
    const trimmed = names.trim();
    const split = trimmed.split('; ');
    if (split.length > 1) {
        return split.map(name => new Name(name).last).join('/');
    } else {
        const name = new Name(trimmed);
        return name.toString();
    }
}