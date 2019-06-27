import { getAllScores } from './api';

const allScoresPromise = getAllScores();

export default async function updateResults(results: Element[]) {
    function updateWithScore(element: Element, score: number) {
        if (element) element.setAttribute('data-score', (score / 5).toString());
    }

    const allScores = await allScoresPromise;
    results.map(result => result.firstElementChild).forEach(result => {
        // Slice removes 'code:' prefix e.g. 'code:CSCI 0190' => 'CSCI 0190'
        const course = result.getAttribute('data-group').slice(5);

        const scores = allScores[course];
        if (scores) {
            const courseElement = result.querySelector('.result__code');
            updateWithScore(courseElement, scores.course);

            const profElement = result.querySelector('.result__flex--9.text--right');
            updateWithScore(profElement, scores.prof);
        }
    });
}