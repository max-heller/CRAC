import {Course, getScores} from "./scores";

export default function updateResult(result: Element) {
    const courseName = result.firstElementChild.getAttribute('data-group');
    const {profScore, courseScore} = getScores(new Course(courseName));

    const profScoreDiv: Element = document.createElement("div");
    const courseScoreDiv: Element = document.createElement("div");
    profScoreDiv.innerHTML = profScore.toString();
    courseScoreDiv.innerHTML = courseScore.toString();

    const scoreDiv: Element = document.createElement("div");
    scoreDiv.setAttribute("style", "margin: auto; padding: 2px;");
    scoreDiv.append(profScoreDiv, courseScoreDiv);

    const headline: Element = result.querySelector('.result__headline');
    headline.innerHTML += scoreDiv.outerHTML;
}