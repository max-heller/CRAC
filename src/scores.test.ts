import { convertProfNames, convertScores } from './scores';

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
    const scores = {
        course: { "CSCI 0190": 4.6 },
        prof: {}
    };
    pairs.forEach(([before, after], i) => {
        scores.prof[before] = i;
    });
    const converted = convertScores(scores);
    expect(converted.course).toEqual(scores.course);
    pairs.forEach(([before, after], i) => {
        expect(converted.prof[after]).toBe(i);
    });
});