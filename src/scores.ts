export class Course {
    department: string;
    code: string;

    constructor(public str: string) {
        const courseRegExp = new RegExp('([A-Z]{4}) ([0-9]{4}[A-Z]?)');
        [this.department, this.code] = str.match(courseRegExp);
    }
}

class Score {
    constructor(public score: Number) {
    }

    toString(): string {
        return this.score.toPrecision(3);
    }
}

class Scores {
    profScore: Score;
    courseScore: Score;

    constructor(professor: Number, course: Number) {
        this.profScore = new Score(professor);
        this.courseScore = new Score(course);
    }
}

export function getScores(course: Course): Scores {
    console.log(`Finding scores for ${course.department} ${course.code}`);
    return new Scores((Math.random() * 2 + 3), (Math.random() * 2 + 3))
}