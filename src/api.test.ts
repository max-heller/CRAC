import { FetchMock } from 'jest-fetch-mock';
import { getAllScores, ScoresRequest, ScoresRequestType } from './api';

beforeEach(() => {
    localStorage.clear();
});

test("request toString", () => {
    let request = new ScoresRequest(ScoresRequestType.Courses);
    expect(request.toString()).toEqual("scores/courses");
    request = new ScoresRequest(ScoresRequestType.Professors);
    expect(request.toString()).toEqual("scores/professors");
});

test("scores cached", async () => {
    const courseScores = [{ department_code: "ENGN", course_num: "0030", score: 4.1 }];
    const profScores = [{ professor: "Smith, John", score: 3.9 }];

    fetchMock.once(JSON.stringify(courseScores));
    fetchMock.once(JSON.stringify(profScores));
    const scores1 = await getAllScores();
    expect(scores1).toEqual({
        course: { "ENGN 0030": 4.1 },
        prof: { "J. Smith": 3.9 }
    });
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);

    const scores2 = await getAllScores();
    expect(scores2).toEqual(scores1);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem).toHaveBeenCalledTimes(2);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
});

test("prof names converted", async () => {
    const courseScores = [];
    const profScores = [{ professor: "van Dam, Andries", score: 5 }];

    fetchMock.once(JSON.stringify(courseScores));
    fetchMock.once(JSON.stringify(profScores));
    expect(await getAllScores()).toEqual({
        course: {},
        prof: { "A. van Dam": 5 }
    });
});