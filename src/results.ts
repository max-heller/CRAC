import {Course, getScores} from "./scores";

export default function updateResult(result: Element) {
    const courseName = result.firstElementChild.getAttribute('data-group');
    const {profScore, courseScore} = getScores(new Course(courseName));

    const headline: Element = result.querySelector('.result__headline');
    headline.innerHTML +=
        `<div style="margin: auto; padding: 2px">
          <div>${profScore.toString()}</div>
          <div>${courseScore.toString()}</div>
        </div>`;
}