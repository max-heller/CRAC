import updateResult from "./results";

console.log("Injected script!");

// Watch panels and add observer to any result panels that appear
const panels = document.getElementsByClassName('panels')[0];
new MutationObserver(function (mutations: MutationRecord[]) {
    console.log("panelsObserver triggered");
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if ((node as Element).className === 'panel panel--kind-results') {
                console.log("Found a results panel!");
                resultsObserver.observe(node, {childList: true, subtree: true});
            }
        }
    }
}).observe(panels, {childList: true});

const resultsObserver = new MutationObserver(function (mutations) {
    console.log("resultsObserver triggered");
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            let results = (node as Element).getElementsByClassName("result result--group-start");
            console.log("Mutation type: " + mutation.type);
            if (results.length > 0) console.log(`Found ${results.length} results!`);
            for (const result of results) updateResult(result);
        }
    }
});