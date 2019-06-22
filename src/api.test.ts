import { api, getScores, convertIfNecessary } from './api';
import { Course, Scores } from './scores';
import 'isomorphic-fetch';

test("no reviews retrieved for fake course", async () => {
    const reviews = await api([{ department_code: "ABCD", course_num: "1234" }]);
    expect(reviews).toHaveLength(0);
});

test("retrieving reviews for single course", async () => {
    const reviews = await api([{ department_code: "CSCI", course_num: "0190" }]);
    expect(reviews.length).toBeGreaterThan(0);
    reviews.forEach(review => {
        expect(review.department_code).toBe("CSCI");
        expect(review.course_num).toBe("0190");
    });
});

test("retrieving reviews for multiple courses", async () => {
    const reviews = await api([
        { department_code: "PHYS", course_num: "0070" },
        { department_code: "MATH", course_num: "0540" }
    ]);
    expect(reviews.length).toBeGreaterThan(0);
    expect(reviews.some(review => review.department_code === "PHYS")).toBe(true);
    expect(reviews.some(review => review.department_code === "MATH")).toBe(true);
    reviews.forEach(review => {
        expect(["PHYS", "MATH"].includes(review.department_code)).toBe(true);
        expect(["0070", "0540"].includes(review.course_num)).toBe(true);
    });
});

test("N/A scores produced for fake course", async () => {
    const scores = (await getScores([new Course("ABCD 1234")]))["ABCD 1234"];
    expect(scores.getCourseScore()).toBe("N/A");
    expect(scores.getProfScore()).toBe("N/A");
});

function expectValidScores(scores: Scores) {
    const courseScore = scores.getCourseScore();
    const profScore = scores.getProfScore();
    expect(Number.parseFloat(courseScore)).toBeGreaterThanOrEqual(1);
    expect(Number.parseFloat(courseScore)).toBeLessThanOrEqual(5);
    expect(Number.parseFloat(profScore)).toBeGreaterThanOrEqual(1);
    expect(Number.parseFloat(profScore)).toBeLessThanOrEqual(5);
}

test("valid scores retrieved for single course", async () => {
    const scores = await getScores([new Course("CSCI 1450")]);
    expectValidScores(scores["CSCI 1450"]);
});

test("valid scores retrieved for multiple courses", async () => {
    const courseNames = ["CSCI 1670", "CSCI 1690", "CLPS 1700"];
    const scores = await getScores(courseNames.map(name => new Course(name)));
    courseNames.map(name => expectValidScores(scores[name]));
});

test("score conversion for old reviews", () => {
    const beforeSwitch = {
        department_code: "CSCI",
        course_num: "0190",
        edition: "2012.2013.1",
        profavg: 1,
        courseavg: 4
    };
    {
        const converted = convertIfNecessary(beforeSwitch);
        expect(converted.profavg).toBe(5);
        expect(converted.courseavg).toBe(1);
    }
    const rightBeforeSwitch = {
        department_code: "CSCI",
        course_num: "0190",
        edition: "2014.2015.1",
        profavg: 4,
        courseavg: 1
    };
    {
        const converted = convertIfNecessary(rightBeforeSwitch);
        expect(converted.profavg).toBe(1);
        expect(converted.courseavg).toBe(5);
    }
});

test("score conversion doesn't affect new reviews", () => {
    const atSwitch = {
        department_code: "CSCI",
        course_num: "0190",
        edition: "2014.2015.2",
        profavg: 4.7,
        courseavg: 4.2
    };
    expect(convertIfNecessary(atSwitch)).toBe(atSwitch);
    const afterSwitch = {
        department_code: "CSCI",
        course_num: "0190",
        edition: "2015.2016.1",
        profavg: 4.7,
        courseavg: 4.2
    };
    expect(convertIfNecessary(afterSwitch)).toBe(afterSwitch);
});