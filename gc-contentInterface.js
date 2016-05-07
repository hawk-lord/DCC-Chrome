/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const GcContentInterface = function(anInformationHolder) {
    "use strict";
    const customTabObjects = [];
    const CustomTabObject = function() {
        "use strict";
        this.enabled = false;
        this.hasConvertedElements = false;
    };
    const sendEnabledStatus = function(customTabObject, status) {
        if (customTabObject.port) {
            try {
                customTabObject.port.postMessage(status);
            }
            catch(err) {
                // TODO handle Error: Attempting to use a disconnected port object
            }
        }
    };
    const sendSettingsToPage = function(tabId, changeInfo, tab) {
        var contentPort;
        const finishedTabProcessingHandler = function (aHasConvertedElements) {
            try {
                if (!customTabObjects[tabId]) {
                    customTabObjects[tabId] = new CustomTabObject();
                }
                customTabObjects[tabId].isEnabled = anInformationHolder.conversionEnabled;
                customTabObjects[tabId].hasConvertedElements = aHasConvertedElements;
                customTabObjects[tabId].port = contentPort;
            }
            catch (err) {
                console.error("finishedTabProcessingHandler " + err);
            }
        };
        const onScriptExecuted = function () {
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
            chrome.tabs.executeScript(tabId, {file: "common/dcc-regexes.js", allFrames: true}, function(){
                chrome.tabs.executeScript(tabId, {file: "common/dcc-content.js", allFrames: true}, function(){
                    chrome.tabs.executeScript(tabId, {file: "dcc-chrome-content-adapter.js", allFrames: true},
                        onScriptExecuted);
                });
            });
        }
    };
    const watchForPages = function() {
        const addTabs = function(aTabs) {
            aTabs.map(function(aTab) {
                if (!customTabObjects[aTab.id]) {
                    customTabObjects[aTab.id] = new CustomTabObject();
                }
                sendSettingsToPage(aTab.id, {status: "complete"}, aTab)
            });
        };
        // FIXME attach to existing tabs
        const setTabs = function(aTab) {
            if (!customTabObjects[aTab.id]) {
                customTabObjects[aTab.id] = new CustomTabObject();
            }
            customTabObjects[aTab.id].isEnabled = anInformationHolder.conversionEnabled;
            eventAggregator.publish("toggleConversion", anInformationHolder.conversionEnabled);
        };
        const releaseTabs = function(aTab) {
            customTabObjects[aTab.id] = null;
        };
        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
            if (tab.url.indexOf("http") === 0 && changeInfo.status === "complete") {
                setTabs(tab);
            }
        });

        chrome.tabs.onUpdated.addListener(sendSettingsToPage);
        chrome.tabs.query({}, addTabs);
    };
    const toggleConversion = function(aStatus) {
        const updateTab = function(aTab) {
            if (!customTabObjects[aTab.id]) {
                customTabObjects[aTab.id] = new CustomTabObject();
            }
            customTabObjects[aTab.id].isEnabled = aStatus;
            anInformationHolder.conversionEnabled = aStatus;
            const makeEnabledStatus = function(customTabObject) {
                const status = {};
                status.isEnabled = aStatus;
                status.hasConvertedElements = customTabObject.hasConvertedElements;
                try {
                    sendEnabledStatus(customTabObject, status);
                }
                catch(err) {
                    console.error("ContentInterface: " + err);
                }
            };
            customTabObjects.map(makeEnabledStatus);
            customTabObjects[aTab.id].hasConvertedElements = true;
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
