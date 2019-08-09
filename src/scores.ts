export enum ScoreType {
    Course = "course",
    Prof = "prof",
}

export interface Scores {
    course: { [s: string]: number };
    prof: { [s: string]: number };
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

export function convertScores(scores: Scores): Scores {
    const convertedProfScores = {};
    Object.entries(scores.prof).forEach(([key, score]) => {
        const convertedName = convertProfNames(key);
        convertedProfScores[convertedName] = score;
    });
    return { course: scores.course, prof: convertedProfScores };
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