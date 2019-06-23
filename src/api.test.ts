import { FetchMock } from 'jest-fetch-mock';
import { calculateScores, convertIfNecessary, getAllReviews, getAllScores } from './api';
import { Scores } from './scores';

beforeEach(() => {
    localStorage.clear();
});

const review = {
    department_code: "CSCI",
    course_num: "0190",
    edition: "2019.2020.1",
    courseavg: 4.5,
    profavg: 4.7
};

test("empty api response", async () => {
    fetchMock.once("[]");
    const scores = await getAllReviews();
    expect(scores).toHaveLength(0);
});

test("no reviews => no scores", async () => {
    fetchMock.once("[]");
    const scores = await getAllScores();
    expect(scores).toEqual({});
});

test("scores pulled from api response", async () => {
    fetchMock.once(JSON.stringify([review]));
    const reviews = await getAllReviews();
    expect(reviews).toHaveLength(1);
    expect(reviews).toContainEqual(review);
});

test("valid scores retrieved for single review", async () => {
    fetchMock.once(JSON.stringify([review]));
    const scores = await getAllScores();
    expect(scores).toEqual({
        "CSCI 0190": {
            course: review.courseavg,
            prof: review.profavg
        }
    });
});

test("scores cached", async () => {
    fetchMock.once(JSON.stringify([review]));
    const scores1 = await getAllScores();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);

    const scores2 = await getAllScores();
    expect(scores2).toEqual(scores1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem).toHaveBeenCalledTimes(2);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
});

test("reviews with one invalid score", async () => {
    fetchMock.once(JSON.stringify([
        { ...review, edition: "2011.2012.1", profavg: 1, courseavg: 0 },
        { ...review, edition: "2011.2012.1", profavg: 0, courseavg: 4 },
    ]));
    expect(await getAllScores()).toEqual({
        "CSCI 0190": new Scores(5, 1)
    });
});

test("multiple reviews' scores averaged", async () => {
    const reviews = [
        { ...review, courseavg: 4.6, profavg: 4.4 },
        { ...review, courseavg: 3.4, profavg: 1.3 },
        { ...review, courseavg: 2.5, profavg: 2.6 },
    ];
    fetchMock.once(JSON.stringify(reviews));
    const scores = await getAllScores();
    expect(scores).toEqual({
        "CSCI 0190": {
            course: (4.6 + 3.4 + 2.5) / 3,
            prof: (4.4 + 1.3 + 2.6) / 3
        }
    });
    expect(calculateScores(reviews)).toEqual(scores);
});

test("scores calculated for each course in reviews", async () => {
    const reviews = [
        { ...review, department_code: "ENGL", course_num: "0900" },
        { ...review, department_code: "ENGN", course_num: "0030" },
        { ...review, department_code: "CSCI", course_num: "1670" },
    ];
    fetchMock.once(JSON.stringify(reviews));
    const scores = await getAllScores();
    const expectedScores = { course: review.courseavg, prof: review.profavg };
    expect(scores).toEqual({
        "ENGL 0900": expectedScores,
        "ENGN 0030": expectedScores,
        "CSCI 1670": expectedScores,
    });
    expect(calculateScores(reviews)).toEqual(scores);
});

test("score calculation converts old reviews", async () => {
    const review = {
        department_code: "CSCI",
        course_num: "1670",
        edition: "2012.2013.1",
        courseavg: 1,
        profavg: 1
    };
    fetchMock.once(JSON.stringify([review]));
    const scores = await getAllScores();
    expect(scores).toEqual({
        "CSCI 1670": {
            course: 5,
            prof: 5
        }
    });
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