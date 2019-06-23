export class Scores {
    constructor(public prof?: number, public course?: number) { }

    public static fromAccumulator(acc: ScoreAccumulator): Scores {
        const scores = new Scores();
        if (acc.profCount > 0) scores.prof = acc.profSum / acc.profCount;
        if (acc.courseCount > 0) scores.course = acc.courseSum / acc.courseCount;
        return scores;
    }
}

export class ScoreAccumulator {
    profSum: number;
    profCount: number;
    courseSum: number;
    courseCount: number;

    constructor() {
        this.profSum = this.profCount = this.courseSum = this.courseCount = 0;
    }
}