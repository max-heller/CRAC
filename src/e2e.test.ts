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

    afterAll(() => {
        driver.quit();
    });

    it("should be able to load CAB", () => {
        driver.get(cab).then(() => {
            driver.getCurrentUrl().then(currentUrl => {
                expect(currentUrl).toEqual(cab);
            });
        });
    });

    it("should inject scores for each course in results", async () => {
        await driver.get(cab);

        // Enter search and submit
        const searchBox = await driver.findElement(By.id('crit-keyword'));
        searchBox.sendKeys("CSCI 0190", Key.ENTER);

        // Wait for results to load
        const results = await driver.wait(
            until.elementsLocated(By.className('result__headline')), 1000);
        expect(results.length).toBeGreaterThan(0);

        // Wait for scores to load
        await driver.wait(until.elementsLocated(By.className('scores')), 15000);
        for (const result of results) {
            const scoreDivs = await result.findElements(By.className('score'));
            expect(scoreDivs.length).toBeGreaterThan(0);
            for (const scoreDiv of scoreDivs) {
                const scoreText = await scoreDiv.getText();
                expect(scoreText).toBeDefined();
                let score;
                if (score = Number.parseFloat(scoreText)) {
                    expect(score).toBeGreaterThanOrEqual(1);
                    expect(score).toBeLessThanOrEqual(5);
                } else {
                    expect(scoreText).toEqual("N/A");
                }
            };
        };
    }, 20000);
});