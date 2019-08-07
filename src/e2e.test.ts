import { Builder, By, Key, ThenableWebDriver, until } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

describe('Selenium Test Suite', () => {
    let driver: ThenableWebDriver;
    const options: chrome.Options = new chrome.Options();
    options.addArguments('--load-extension=dist');

    const cab = "https://cab.brown.edu/";

    beforeAll(() => {
        driver = new Builder()
            .withCapabilities(options)
            .build();
        driver.manage().window().maximize();
    });

    beforeEach(() => localStorage.clear());

    afterAll(() => {
        driver.quit();
        localStorage.clear()
    });

    it("should be able to load CAB", () => {
        driver.get(cab).then(() => {
            driver.getCurrentUrl().then(currentUrl => {
                expect(currentUrl).toEqual(cab);
            });
        });
    });

    it("should inject scores for courses known to have reviews", async () => {
        await driver.get(cab);

        // Enter search and submit
        const searchBox = await driver.findElement(By.id('crit-keyword'));
        searchBox.sendKeys("CSCI", Key.ENTER);

        // Wait for results to load
        const results = await driver.wait(
            until.elementsLocated(By.className('result__headline')), 1000);
        expect(results.length).toBeGreaterThan(0);

        await driver.wait(until.elementsLocated(By.className('scored')), 20000);
        const scoredCourses = await driver.findElements(By.className('scored--course'));
        const scoredProfs = await driver.findElements(By.className('scored--prof'));

        const courseScores = [], profScores = [];
        for (const scoredCourse of scoredCourses) {
            expect(await scoredCourse.getCssValue('color')).not.toBe('#444');
            courseScores.push(await scoredCourse.getAttribute('data-score'));
        }
        for (const scoredProf of scoredProfs) {
            expect(await scoredProf.getCssValue('color')).not.toBe('#444');
            profScores.push(await scoredProf.getAttribute('data-score'));
        }

        expect(courseScores.length).toBeGreaterThan(5);
        expect(courseScores.every(score =>
            score === NaN || (score >= 0 && score <= 1))).toBe(true);
        expect(profScores.length).toBeGreaterThan(5);
        expect(profScores.every(score =>
            score === NaN || (score >= 0 && score <= 1))).toBe(true);
    }, 30000);

    it("should inject professor scores for each section of a course", async () => {
        await driver.get(cab);

        // Enter search and submit
        const searchBox = await driver.findElement(By.id('crit-keyword'));
        searchBox.sendKeys("MATH 0100", Key.ENTER);

        // Wait for results to load
        const results = await driver.wait(
            until.elementsLocated(By.className('result')), 1000);
        expect(results.length).toBeGreaterThan(1);

        await driver.wait(until.elementsLocated(By.className('scored')), 20000);
        const scoredCourses = await driver.findElements(By.className('scored--course'));
        const scoredProfs = await driver.findElements(By.className('scored--prof'));

        expect(scoredCourses).toHaveLength(1);
        expect(scoredProfs).toHaveLength(results.length);
    }, 30000);
});