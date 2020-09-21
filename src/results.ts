import { getAllScores } from './api';
import { ScoreType } from './scores';

const allScoresPromise = getAllScores().catch(() => new Promise(resolve => {
  chrome.runtime.sendMessage('request-scores', resolve)
}));

export default async function updateResults(results: Element[]) {
    const scores = await allScoresPromise;

    function updateWithScore(element: Element, type: ScoreType) {
        const split = element.textContent.split(': ');
        const key = split[split.length - 1];
        const score = scores[type][key];
        if (score) {
            element.setAttribute('title', score.toFixed(2));
            element.setAttribute('data-score', ((score - 2.5) / 2.5).toString());
            element.classList.add('scored');
            element.classList.add('scored--' + type);
        }
    }

    results.map(result => result.firstElementChild).forEach(result => {
        const courseElement = result.querySelector('.result__code');
        if (courseElement) updateWithScore(courseElement, ScoreType.Course);

        const profElement = result.querySelector('.result__flex--9.text--right');
        if (profElement) updateWithScore(profElement, ScoreType.Prof);
    });
}
