import { getAllScores } from './api';

const allScoresPromise = getAllScores();

export default async function updateResults(results: Element[]) {
    function updateWithScore(element: Element, score: number) {
        element.setAttribute('data-score', ((score - 2.5) / 2.5).toString());
        element.classList.add('scored');
    }

    const allScores = await allScoresPromise;
    results.map(result => result.firstElementChild).forEach(result => {
        // Slice removes 'code:' prefix e.g. 'code:CSCI 0190' => 'CSCI 0190'
        const course = result.getAttribute('data-group').slice(5);

        const scores = allScores[course];
        if (scores) {
            const courseElement = result.querySelector('.result__code');
            if (courseElement) {
                updateWithScore(courseElement, scores.course);
                courseElement.classList.add('scored--course');
            }

            const profElement = result.querySelector('.result__flex--9.text--right');
            if (profElement) {
                updateWithScore(profElement, scores.prof);
                courseElement.classList.add('scored--prof');
            }
        }
    });
}