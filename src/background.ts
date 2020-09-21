import { BROWNCR } from './api';
import { Scores } from './scores';

let cachedScores: Scores | null = null
const callbacks: Array<(scores: Scores) => void> = []

;(window as any).__debug = { cachedScores, callbacks }

chrome.runtime.onMessage.addListener((request, sender, respond) => {
  const handler = () => {
      chrome.tabs.create({ url: `${BROWNCR}/search/CSCI` }, CRTab => {
          chrome.tabs.onRemoved.addListener(closedTabId => {
              if (closedTabId === CRTab.id) {
                  chrome.pageAction.setIcon({ tabId: sender.tab.id, path: "icon48.png" });
                  chrome.pageAction.hide(sender.tab.id);
                  respond('retry');
              }
          });
      })
    }
    if (request === "require-login") {
        chrome.pageAction.setIcon({ tabId: sender.tab.id, path: "icon48-warn.png" });
        chrome.pageAction.show(sender.tab.id);
        return true;
    } else if (typeof request === 'object') {
      console.log('got scores', request)
      cachedScores = request
      callbacks.forEach(cb => cb(cachedScores))
      chrome.tabs.remove(sender.tab.id, console.log)
    } else if (request === 'request-scores') {
      if (cachedScores) {
        console.log('sending scores', cachedScores)
        respond(cachedScores)
      } else {
        if (callbacks.length === 0) handler()
        callbacks.push(respond)
      }
    }
});
