export class Course {
    full: string;
    department: string;
    code: string;

    constructor(public str: string) {
        const courseRegExp = new RegExp('([A-Z]{3}[A-Z]?) ([0-9]{4}[A-Z]?)');
        [this.full, this.department, this.code] = str.match(courseRegExp);
    }
}

export class Score {
    constructor(public score: number) {
    }

    toString(): string {
        return this.score.toPrecision(3);
    }
}

export class Scores {
    profScore?: Score;
    courseScore?: Score;

    constructor(acc: meanAccumulator) {
        if (acc.profCount) this.profScore = new Score(acc.profSum / acc.profCount);
        if (acc.courseCount) this.courseScore = new Score(acc.courseSum / acc.courseCount);
    }
}

export class meanAccumulator {
    profSum: number;
    profCount: number;
    courseSum: number;
    courseCount: number;

    constructor() {
        this.profSum = this.profCount = this.courseSum = this.courseCount = 0;
    }
}