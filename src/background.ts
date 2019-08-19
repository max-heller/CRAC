import { BROWNCR } from './api';

chrome.runtime.onMessage.addListener((request, sender, respond) => {
    if (request === "require-login") {
        chrome.pageAction.setIcon({ tabId: sender.tab.id, path: "icon48-warn.png" });
        chrome.pageAction.onClicked.addListener(CABTab => {
            chrome.tabs.create({ url: `${BROWNCR}/search/CSCI` }, CRTab => {
                chrome.tabs.onRemoved.addListener(closedTabId => {
                    if (closedTabId === CRTab.id) {
                        chrome.pageAction.setIcon({ tabId: sender.tab.id, path: "icon48.png" });
                        chrome.pageAction.hide(sender.tab.id);
                        respond('retry');
                    }
                });
            });
        });
        chrome.pageAction.show(sender.tab.id);
        return true;
    }
});