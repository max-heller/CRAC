import { getScores } from './api';
import { Course } from './scores';

export default async function updateResults(results: Element[]) {
  const courses = results.map(result => {
    return new Course(result.firstElementChild.getAttribute('data-group'));
  });

  const allScores = await getScores(courses);
  courses.forEach((course, i) => {
    const headline: Element = results[i].querySelector('.result__headline');
    const scores = allScores[course.name];
    headline.innerHTML +=
      `<div style="margin: auto; padding: 2px">
         <div>${scores.getProfScore()}</div>
         <div>${scores.getCourseScore()}</div>
       </div>`;
  });
}