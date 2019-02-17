alert("Injected script!");

// Watch panels and add observer to any result panels that appear
const panels = document.getElementsByClassName('panels')[0];
new MutationObserver(function (mutations: MutationRecord[]) {
    alert("panelsObserver triggered");
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if ((node as Element).className === 'panel panel--kind-results') {
                alert("Found a results panel!");
                resultsObserver.observe(node, {childList: true, subtree: true});
            }
        }
    }
}).observe(panels, {childList: true});

let count = 0;
const resultsObserver = new MutationObserver(function (mutations) {
    alert("resultsObserver triggered");
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            let results = (node as Element).getElementsByClassName("result result--group-start");
            alert(mutation.type);
            if (results.length > 0) alert(`Found ${results.length} results!`);
            for (const result of results) {
                result.getElementsByClassName('result__code')[0].innerHTML += count++;
            }
        }
    }
});