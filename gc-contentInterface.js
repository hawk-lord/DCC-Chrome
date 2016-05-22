/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const GcContentInterface = function(anInformationHolder) {
    "use strict";
    const sendEnabledStatus = function(tabId, status) {
        var contentPort;
        contentPort = chrome.tabs.connect(tabId, {name: "dccContentPort"});
        try {
            contentPort.postMessage(status);            }
        catch (err) {
            console.error(err);
        }
    };
    const sendSettingsToPage = function(tabId, changeInfo, tab) {
        // console.log("sendSettingsToPage " + tabId + " status " + changeInfo.status + " url " + changeInfo.url);
        var contentPort;
        const finishedTabProcessingHandler = function (aHasConvertedElements) {
            try {
                //console.log("finishedTabProcessingHandler");
                eventAggregator.publish("toggleConversion", anInformationHolder.conversionEnabled);
            }
            catch (err) {
                console.error("finishedTabProcessingHandler " + err);
            }
        };
        const onScriptExecuted = function () {
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
            chrome.tabs.executeScript(tabId, {file: "common/dcc-regexes.js", allFrames: true}, function(){
                chrome.tabs.executeScript(tabId, {file: "common/dcc-content.js", allFrames: true}, function(){
                    chrome.tabs.executeScript(tabId, {file: "dcc-chrome-content-adapter.js", allFrames: true},
                        onScriptExecuted);
                });
            });
        }
    };
    const watchForPages = function() {
        chrome.tabs.onUpdated.removeListener(sendSettingsToPage);
        chrome.tabs.onUpdated.addListener(sendSettingsToPage);
    };
    const toggleConversion = function(aStatus) {
        // console.log("toggleConversion " + aStatus);
        const updateTab = function(aTab) {
            // console.log("updateTab " + aTab.id + " " + aStatus);
            anInformationHolder.conversionEnabled = aStatus;
            const makeEnabledStatus = function(tabId) {
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
        const updateActiveTabs = function(aTabs) {
            aTabs.map(updateTab);
        };
        chrome.tabs.query({}, updateActiveTabs);
    };
    return {
        watchForPages: watchForPages,
        toggleConversion: toggleConversion
    }
};

if (typeof exports === "object") {
    exports.GcContentInterface = GcContentInterface;
}
