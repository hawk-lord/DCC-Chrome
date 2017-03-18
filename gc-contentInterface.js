/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const GcContentInterface = function(anInformationHolder) {
    "use strict";
    let contentPort;
    const sendEnabledStatus = (tabId, status) => {
        contentPort = chrome.tabs.connect(tabId, {name: "dccContentPort"});
        try {
            contentPort.postMessage(status);            }
        catch (err) {
            console.error(err);
        }
    };
    const sendSettingsToPage = (tabId, changeInfo, tab) => {
        // console.log("sendSettingsToPage " + tabId + " status " + changeInfo.status + " url " + changeInfo.url);
        const finishedTabProcessingHandler = (aHasConvertedElements) => {
            try {
                //console.log("finishedTabProcessingHandler");
                eventAggregator.publish("toggleConversion", anInformationHolder.conversionEnabled);
            }
            catch (err) {
                console.error("finishedTabProcessingHandler " + err);
            }
        };
        const onScriptExecuted = () => {
            // console.log("onScriptExecuted tabId " + tabId);
            contentPort = chrome.tabs.connect(tabId, {name: "dccContentPort"});
            try {
                // TODO Don't send null
                contentPort.postMessage(new ContentScriptParams(null, anInformationHolder));            }
            catch (err) {
                console.error(err);
            }
            contentPort.onMessage.addListener(finishedTabProcessingHandler);
        };
        if (changeInfo.status === "complete" && tab && tab.url && tab.url.indexOf("http") === 0
            && tab.url.indexOf("https://chrome.google.com/webstore") === -1
            && tab.url.indexOf("https://addons.opera.com") === -1) {
            // console.log("executeScript tabId " + tabId);
            // console.log("customTabObjects[tabId] " + customTabObjects[tabId]);
            chrome.tabs.executeScript(tabId, {file: "common/dcc-regexes.js", allFrames: true}, () => {
                chrome.tabs.executeScript(tabId, {file: "common/dcc-content.js", allFrames: true}, () => {
                    chrome.tabs.executeScript(tabId, {file: "dcc-chrome-content-adapter.js", allFrames: true},
                        onScriptExecuted);
                });
            });
        }
    };
    const watchForPages = () => {
        chrome.tabs.onUpdated.removeListener(sendSettingsToPage);
        chrome.tabs.onUpdated.addListener(sendSettingsToPage);
    };
    const toggleConversion = (aStatus) => {
        // console.log("toggleConversion " + aStatus);
        const updateTab = (aTab) => {
            // console.log("updateTab " + aTab.id + " " + aStatus);
            anInformationHolder.conversionEnabled = aStatus;
            const makeEnabledStatus = (tabId) => {
                const status = {};
                status.isEnabled = aStatus;
                status.hasConvertedElements = false;
                try {
                    sendEnabledStatus(tabId, status);
                }
                catch(err) {
                    console.error("ContentInterface: " + err);
                }
            };
            makeEnabledStatus(aTab.id);
        };
        const updateActiveTabs = (aTabs) => {
            aTabs.map(updateTab);
        };
        chrome.tabs.query({}, updateActiveTabs);
    };

    const showQuotesTab = () => {
        const quotesListener = (request, sender, sendResponse) => {
            sendResponse(new ContentScriptParams(null, anInformationHolder));
        };
        const quotesCallback = (aTab) => {
            chrome.runtime.onMessage.addListener(quotesListener);
        };
        chrome.tabs.create({"url": chrome.extension.getURL("common/quotes.html")}, quotesCallback);
    };

    return {
        watchForPages: watchForPages,
        toggleConversion: toggleConversion,
        showQuotesTab: showQuotesTab
    }
};

if (typeof exports === "object") {
    exports.GcContentInterface = GcContentInterface;
}
