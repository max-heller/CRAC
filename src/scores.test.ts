import { convertProfNames, Scores } from './scores';

const pairs = [
    ["van Dam, Andries", "A. van Dam"],
    ["Roberts, J Timmons", "J. Roberts"],
    ["Valiant, Paul", "P. Valiant"],
    ["Fonseca, Rodrigo; Doeppner, Tom", "Fonseca/Doeppner"],
    ["James Green", "J. Green"],
    ["Ronald L Martinez", "R. Martinez"]
];

test("prof name conversion", () => {
    pairs.forEach(([before, after]) => {
        expect(convertProfNames(before)).toBe(after);
    });
});

test("score converstion", () => {
    const courseScores = [
        { department_code: "CSCI", course_num: "0190", score: 4.6 }
    ];
    const profScores = [];
    pairs.forEach(([before, _], i) => {
        profScores.push({ professor: before, score: i });
    });
    const converted = new Scores(courseScores, profScores);
    expect(converted.course).toEqual({
        "CSCI 0190": 4.6
    });
    pairs.forEach(([_, after], i) => {
        expect(converted.prof[after]).toBe(i);
    });
});