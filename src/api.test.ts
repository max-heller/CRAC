import { FetchMock } from 'jest-fetch-mock';
import { ApiRequest, getAllScores, RequestType } from './api';

beforeEach(() => {
    localStorage.clear();
});

test("request toString", () => {
    let request = new ApiRequest(RequestType.Scores);
    expect(request.toString()).toEqual("type=scores");
    request.courses = ["CSCI 0190", "CSCI 1670"];
    expect(request.toString()).toEqual(
        `type=scores&courses=["CSCI 0190","CSCI 1670"]`);
    request = new ApiRequest(RequestType.Reviews);
    expect(request.toString()).toEqual("type=reviews");
    request.courses = ["CSCI 0190", "CSCI 1670"];
    expect(request.toString()).toEqual(
        `type=reviews&courses=["CSCI 0190","CSCI 1670"]`);
});

test("scores cached", async () => {
    const scores = {
        course: { "ENGN 0030": 4.1 },
        prof: { "Smith, John": 3.9 }
    };

    fetchMock.once(JSON.stringify(scores));
    const scores1 = await getAllScores();
    expect(scores1).toEqual({
        course: scores.course,
        prof: { "J. Smith": 3.9 }
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);

    const scores2 = await getAllScores();
    expect(scores2).toEqual(scores1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem).toHaveBeenCalledTimes(2);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
});

test("prof names converted", async () => {
    const scores = {
        course: {},
        prof: { "van Dam, Andries": 5 }
    };

    fetchMock.once(JSON.stringify(scores));
    expect(await getAllScores()).toEqual({
        course: {},
        prof: { "A. van Dam": 5 }
    });
});