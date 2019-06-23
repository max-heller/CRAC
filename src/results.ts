import { getAllScores } from './api';
import { Scores } from './scores';

const allScoresPromise = getAllScores();

export function scoreToString(score?: number) {
    return score ? score.toPrecision(3) : "N/A";
}

export default async function updateResults(results: Element[]) {
    const courses = results.map(result =>
        // Slice removes 'code:' prefix e.g. 'code:CSCI 0190' => 'CSCI 0190'
        result.firstElementChild.getAttribute('data-group').slice(5)
    );

    const allScores = await allScoresPromise;
    courses.forEach((course, i) => {
        const headline: Element = results[i].querySelector('.result__headline');
        const scores = allScores[course] || new Scores();
        headline.innerHTML +=
            `<div class="scores">
                 <div class="score">${scoreToString(scores.prof)}</div>
                 <div class="score">${scoreToString(scores.course)}</div>
             </div>`;
    });
}