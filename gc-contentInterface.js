/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

const GcContentInterface = function(anInformationHolder) {
    const sendEnabledStatus = (tabId, status) => {
        try {
            chrome.tabs.sendMessage(tabId, status)
        }
        catch (err) {
            console.error(err);
        }
    };
    const finishedTabProcessingHandler = (aParameters) => {
        if (aParameters.command === "getEnabledState") {
            try {
                //console.log("finishedTabProcessingHandler " + aParameters.url);
                eventAggregator.publish("toggleConversion",
                    {"conversionEnabled": anInformationHolder.conversionEnabled, "url": aParameters.url});
            }
            catch (err) {
                console.error("finishedTabProcessingHandler " + err);
            }
        }
    };
    const sendSettingsToPage = (tabId, changeInfo, tab) => {
        // console.log("sendSettingsToPage " + tabId + " status " + changeInfo.status + " url " + changeInfo.url);
        const onScriptExecuted = () => {
            // console.log("onScriptExecuted tabId " + tabId);
            try {
                chrome.runtime.onMessage.removeListener(finishedTabProcessingHandler);
                chrome.runtime.onMessage.addListener(finishedTabProcessingHandler);
                // TODO Don't send null
                chrome.tabs.sendMessage(tabId, new ContentScriptParams(null, anInformationHolder))
            }
            catch (err) {
                console.error(err);
            }
        };
        if (changeInfo.status === "complete" && tab && tab.url && tab.url.indexOf("http") === 0
            && tab.url.indexOf("https://chrome.google.com/webstore") === -1
            && tab.url.indexOf("https://addons.opera.com") === -1) {
            //console.log("DCC executeScript tabId " + tabId + " URL " + tab.url);
            // console.log("customTabObjects[tabId] " + customTabObjects[tabId]);
            chrome.tabs.insertCSS(tabId, {file: "title.css", allFrames: true});
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
    const toggleConversion = (aParameters) => {
        //console.log("DCC toggleConversion " + aParameters.conversionEnabled);
        const updateTab = (aTab) => {
            // console.log("updateTab " + aTab.id + " " + aStatus);
            anInformationHolder.conversionEnabled = aParameters.conversionEnabled;
            const makeEnabledStatus = (tabId) => {
                const status = {};
                status.isEnabled = aParameters.conversionEnabled;
                status.hasConvertedElements = false;
                status.url = aParameters.url;
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
        const quotesListener = (message, sender, sendResponse) => {
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
