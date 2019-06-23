import { ScoreAccumulator, Scores } from './scores';

test("accumulator instantiation", () => {
    const acc = new ScoreAccumulator();
    expect(acc.profSum).toBe(0);
    expect(acc.profCount).toBe(0);
    expect(acc.courseSum).toBe(0);
    expect(acc.courseCount).toBe(0);
});

test("no scores in accumulator => undefined score in Scores", () => {
    let acc = new ScoreAccumulator();
    let scores = Scores.fromAccumulator(acc);
    expect(scores).toEqual(new Scores());
    expect(scores.prof).toBeUndefined();
    expect(scores.course).toBeUndefined();

    acc = new ScoreAccumulator();
    acc.courseCount++;
    acc.courseSum += 5;
    scores = Scores.fromAccumulator(acc);
    expect(scores.prof).toBeUndefined();
    expect(scores.course).toBe(5);

    acc = new ScoreAccumulator();
    acc.profCount++;
    acc.profSum += 5;
    scores = Scores.fromAccumulator(acc);
    expect(scores.prof).toBe(5);
    expect(scores.course).toBeUndefined();
});

test("scores averaged from accumulator", () => {
    const acc = new ScoreAccumulator();
    acc.courseSum = 15;
    acc.courseCount = 3;
    acc.profSum = 8;
    acc.profCount = 2;
    expect(Scores.fromAccumulator(acc)).toEqual(new Scores(4, 5));
});