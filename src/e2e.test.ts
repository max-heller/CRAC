import { Builder, By, Key, ThenableWebDriver, until, WebElement } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import { BROWNCR } from './api';
import { promisify } from 'util';
import { writeFile, mkdir } from 'fs';

const SCREENSHOT_DIR = "tmp";
const saveFile = promisify(writeFile);

describe('Selenium Test Suite', () => {
    let driver: ThenableWebDriver;
    const options: chrome.Options = new chrome.Options();
    options.addArguments('--load-extension=dist');

    const cab = "https://cab.brown.edu/";

    beforeAll(async () => {
        driver = new Builder()
            .withCapabilities(options)
            .build();
        driver.manage().window().maximize();

        async function screenshot(name: String): Promise<void> {
            const image = await driver.takeScreenshot();
            return saveFile(`${SCREENSHOT_DIR}/${name}`, image, 'base64');
        }
        promisify(mkdir)(SCREENSHOT_DIR);

        // Authenticate with BrownCR
        console.log("Loading BrownCR");
        await driver.get(`${BROWNCR}/search/CSCI`);
        await driver.sleep(1000);

        console.log("Entering credentials");
        await driver.wait(until.elementLocated(By.id('username')), 10000).sendKeys(process.env.BROWN_USERNAME);
        await driver.findElement(By.id('password')).sendKeys(process.env.BROWN_PASSWORD, Key.ENTER);
        await driver.sleep(1000);
        await screenshot("credentials_entered.png");

        console.log("Looking for 2FA iframe");
        const authFrame = await driver.wait(until.elementLocated(By.id('duo_iframe')), 10000);
        await driver.switchTo().frame(authFrame);
        await driver.sleep(1000);

        console.log("Entering bypass code");
        await driver.findElement(By.id('passcode')).click();
        await driver.findElement(By.name('passcode')).sendKeys(process.env.BROWN_BYPASS_CODE, Key.ENTER);
        await driver.sleep(1000);
        await screenshot("bypass_code_entered.png");

        console.log("Waiting to find results (indicative of successful login)");
        await driver.wait(until.elementLocated(By.className('results_header')), 30000);
        await driver.sleep(1000);
        await screenshot("login_finished.png");
        console.log("Logged in!");
    }, 60000);

    beforeEach(() => sessionStorage.clear());

    afterAll(() => {
        driver.quit();
        sessionStorage.clear()
    });

    /**
     * Find the results of a search on CAB
     * @param query term to search for
     */
    async function searchResults(query: string): Promise<WebElement[]> {
        // Enter search and submit
        const searchBox = await driver.findElement(By.id('crit-keyword'));
        searchBox.sendKeys(query, Key.ENTER);

        // Wait for results to load
        const results = await driver.wait(
            until.elementsLocated(By.className('result')), 1000);

        return results;
    }

    class ScoredElements {
        constructor(public courses: WebElement[], public profs: WebElement[]) { }

        async verify() {
            for (const elt of this.courses.concat(this.profs)) {
                // Color changed away from default
                expect(await elt.getCssValue('color')).not.toBe('rgba(68, 68, 68, 1)');

                // Hover text is raw 1-5 score
                const score = Number.parseFloat(await elt.getAttribute('title'));
                expect(score).toBeLessThanOrEqual(5);
                expect(score).toBeGreaterThanOrEqual(1);

                // data-score (used for styling) is 0-1
                const dataScore = Number.parseFloat(await elt.getAttribute('data-score'));
                expect(dataScore).toBeLessThanOrEqual(1);
                expect(dataScore).toBeGreaterThanOrEqual(0);
            }
        }
    }

    /**
     * Find all scored course and professor elements in current search results,
     * verifying that they have been properly scored
     */
    async function scoredElements(): Promise<ScoredElements> {
        await driver.wait(until.elementsLocated(By.className('scored')), 20000);
        const scored = new ScoredElements(
            await driver.findElements(By.className('scored--course')),
            await driver.findElements(By.className('scored--prof')));
        await scored.verify();
        return scored;
    }

    it("should inject scores for courses known to have reviews", async () => {
        await driver.get(cab);

        // Search for CS courses
        const results = await searchResults("CSCI");
        expect(results.length).toBeGreaterThan(1);

        // There are certainly multiple CS courses and professors with reviews
        const scored = await scoredElements();
        expect(scored.courses.length).toBeGreaterThan(1);
        expect(scored.profs.length).toBeGreaterThan(1);
    }, 30000);

    it("should inject professor scores for each section of a course", async () => {
        await driver.get(cab);

        // Search for course with many sections
        const results = await searchResults("MATH 0100");
        expect(results.length).toBeGreaterThan(1);
        expect(await driver.findElements(By.className('result--group-start'))).toHaveLength(1);

        // Verify that multiple sections are scored
        const scored = await scoredElements();
        expect(scored.courses).toHaveLength(1);
        expect(scored.profs.length).toBeGreaterThan(1);
    }, 30000);
});