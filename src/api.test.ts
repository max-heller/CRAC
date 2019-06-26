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

const scores = {
    "ENGN 0030": {
        "prof": 4.1,
        "course": 3.9
    }
};

test("scores cached", async () => {
    fetchMock.once(JSON.stringify(scores));
    const scores1 = await getAllScores();
    expect(scores1).toEqual(scores);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);

    const scores2 = await getAllScores();
    expect(scores2).toEqual(scores1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem).toHaveBeenCalledTimes(2);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
});