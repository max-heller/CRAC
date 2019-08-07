import { getAllScores } from './api';

const allScoresPromise = getAllScores();

export default async function updateResults(results: Element[]) {
    function updateWithScore(element: Element, scores: { [s: string]: number }) {
        const split = element.textContent.split(': ');
        const key = split[split.length - 1];
        const score = scores[key];
        if (score) {
            element.setAttribute('data-score', ((score - 2.5) / 2.5).toString());
        }
        element.classList.add('scored');
    }

    const scores = await allScoresPromise;
    results.map(result => result.firstElementChild).forEach(result => {
        const courseElement = result.querySelector('.result__code');
        if (courseElement) {
            updateWithScore(courseElement, scores.course);
            courseElement.classList.add('scored--course');
        }

        const profElement = result.querySelector('.result__flex--9.text--right');
        if (profElement) {
            updateWithScore(profElement, scores.prof);
            profElement.classList.add('scored--prof');
        }
    });
}