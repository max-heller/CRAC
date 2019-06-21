export class Course {
    name: string;
    department: string;
    code: string;

    constructor(str: string) {
        // Slice to remove 'code:' prefix
        this.name = str.slice(5);
        [this.department, this.code] = this.name.split(' ');
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