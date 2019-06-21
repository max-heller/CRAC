export class Course {
    full: string;
    department: string;
    code: string;

    constructor(str: string) {
        const courseRegExp = new RegExp('([A-Z]{3}[A-Z]?) ([0-9]{4}[A-Z]?)');
        [this.full, this.department, this.code] = str.match(courseRegExp);
    }
}

export class Scores {
    profSum: number;
    profCount: number;
    courseSum: number;
    courseCount: number;

    constructor() {
        this.profSum = this.profCount = this.courseSum = this.courseCount = 0;
    }

    public getProfScore(): string {
        return (this.profCount) ?
            (this.profSum / this.profCount).toPrecision(3) : "N/A";
    }

    public getCourseScore(): string {
        return (this.courseCount) ?
            (this.courseSum / this.courseCount).toPrecision(3) : "N/A";
    }
}