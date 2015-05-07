/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const GcContentInterface = function(anInformationHolder) {
    "use strict";
    let settingsWorker = null;
    let testPageWorker = null;
    var isRegisteredToTabsEvents = false;
    const customTabObjects = [];
    const CustomTabObject = function() {
        "use strict";
        this.enabled = false;
        this.hasConvertedElements = false;
        this.workers = [];
    };
    const sendEnabledStatus = function(customTabObject, status) {
        if (customTabObject.port) {
            customTabObject.port.postMessage(status);
        }
    };
    const attachHandler = function(tabId, changeInfo, tab) {
        var contentPort;
        const finishedTabProcessingHandler = function (aHasConvertedElements) {
            try {
                console.log("finishedTabProcessingHandler " + aHasConvertedElements);
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
        console.log("attachHandler tabId " + tabId);
        console.log("attachHandler changeInfo.status " + changeInfo.status);
        console.log("attachHandler changeInfo.url " + changeInfo.url);
        if (changeInfo.status === "complete" && tab && tab.url && tab.url.indexOf("http") === 0) {
            chrome.tabs.executeScript({file: "common/dcc-regexes.js", allFrames: true}, function(){
                chrome.tabs.executeScript({file: "common/dcc-content.js", allFrames: true}, function(){
                    chrome.tabs.executeScript({file: "dcc-chrome-content-adapter.js", allFrames: true},
                        onScriptExecuted);
                });
            });
        }
    };
    //let pageMod;
    const watchForPages = function() {
        console.log("watchForPages");
        chrome.tabs.onUpdated.addListener(attachHandler);
        /*
                pageMod = new PageMod({
                    include: "*",
                    contentScriptFile: ["./common/dcc-regexes.js",
                        "./common/dcc-content.js",
                        "./dcc-firefox-content-adapter.js"],
                    contentScriptWhen: "ready",
                    attachTo: ["existing", "top", "frame"],
                    onAttach: attachHandler
                });
        */
    };
    const toggleConversion = function(aStatus) {
        console.log("toggleConversion");
/*
        if (tabs.activeTab.customTabObject) {
            // console.log("tabs.activeTab.customTabObject");
            tabs.activeTab.customTabObject.isEnabled = aStatus;
            anInformationHolder.conversionEnabled = aStatus;
            tabs.activeTab.customTabObject.workers.map(sendEnabledStatus);
            tabs.activeTab.customTabObject.hasConvertedElements = true;
        }
        else {
            console.error("customTabObject is missing");
        }
*/
        const updateActiveTabs = function(aTabs) {
            console.log("tabCallback " + aTabs.length);
            if (aTabs.length > 0) {
                const activeTab = aTabs[0];
                console.log("activeTab.id " + activeTab.id);
                if (customTabObjects[activeTab.id]) {
                    customTabObjects[activeTab.id].isEnabled = aStatus;
                    console.log("aStatus " + aStatus);
                    anInformationHolder.conversionEnabled = aStatus;
                    const makeEnabledStatus = function(customTabObject) {
                        console.log("sendEnabledStatus ");
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
                    if (aStatus) {
                        customTabObjects[activeTab.id].hasConvertedElements = true;
                    }
                }
            }
        };
        chrome.tabs.query({active: true}, updateActiveTabs);
    };
    const showSettingsTab = function() {
        const isOpen = settingsWorker && settingsWorker.settingsTab ;
        if (!isOpen) {
            tabs.open({url: "./settings.html"});
        }
        else {
            settingsWorker.settingsTab.activate();
        }
    };
    const showTestTab = function() {
        const isOpen = testPageWorker && testPageWorker.testTab ;
        if (!isOpen) {
            tabs.open({url: "./common/prices.html"});
        }
        else {
            testPageWorker.testPageTab.activate();
        }
    };
    const registerToTabsEvents = function() {
        const setTabs = function(aTab) {
            if (customTabObjects[aTab.id] == null) {
                customTabObjects[aTab.id] = new CustomTabObject();
                customTabObjects[aTab.id].isEnabled = anInformationHolder.conversionEnabled;
                eventAggregator.publish("toggleConversion", anInformationHolder.conversionEnabled);
            }
        };
        const releaseTabs = function(aTab) {
            if (settingsWorker != null && settingsWorker.settingsTab != null) {
                if (settingsWorker.settingsTab.title == aTab.title) {
                    settingsWorker.settingsTab = null;
                }
                else {
                    customTabObjects[aTab.id] = null;
                }
            }
            else {
                customTabObjects[aTab.id] = null;
            }
        };
        if (!isRegisteredToTabsEvents) {
            chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
                if (tab.url.indexOf("http") === 0 && changeInfo.status === "complete") {
                    setTabs(tab);
                }
            });
            isRegisteredToTabsEvents = true;
        }
    };
    const closeSettingsTab = function() {
        if (settingsWorker && settingsWorker.settingsTab) {
            settingsWorker.settingsTab.close();
        }
    };

    return {
        watchForPages: watchForPages,
        toggleConversion: toggleConversion,
        showSettingsTab: showSettingsTab,
        showTestTab: showTestTab,
        registerToTabsEvents: registerToTabsEvents,
        closeSettingsTab: closeSettingsTab
    }
};

if (typeof exports === "object") {
    exports.GcContentInterface = GcContentInterface;
}
