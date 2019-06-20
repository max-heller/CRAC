import { Course } from './scores';
import { getScores } from './api';

export default async function updateResult(result: Element) {
  let courseName = result.firstElementChild.getAttribute('data-group');
  let scores = await getScores(new Course(courseName));
  let profScore = scores.profScore ? scores.profScore.toString() : "N/A";
  let courseScore = scores.courseScore ? scores.courseScore.toString() : "N/A";

  let headline: Element = result.querySelector('.result__headline');
  headline.innerHTML +=
    `<div style="margin: auto; padding: 2px">
       <div>${profScore}</div>
       <div>${courseScore}</div>
     </div>`;
}