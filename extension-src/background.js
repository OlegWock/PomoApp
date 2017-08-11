var pomo_tab = null;

chrome.browserAction.onClicked.addListener(function(tab){ 
    if (pomo_tab) {
        chrome.tabs.update(pomo_tab.id, {highlighted: true}, function(tab) {
            if (chrome.runtime.lastError) {
                chrome.tabs.create({index: 0, active: true, pinned: true, url: chrome.extension.getURL("index.html")}, function(tab) {
                    pomo_tab = tab;
                });
            }
        });
    } else {
        chrome.tabs.create({index: 0, active: true, pinned: true, url: chrome.extension.getURL("index.html")}, function(tab) {
            pomo_tab = tab;
        });
    }
    
});
