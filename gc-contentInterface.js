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
    const attachHandler = function(tabId, changeInfo) {
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
        if (changeInfo.status === "complete") {
            console.log("aWorker.port.emit updateSettings");
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
        const setTab = function(aTab) {
            if (aTab.url === "resource://dcc-at-joint-dot-ax/direct-currency-converter-2/data/settings.html") {
                settingsWorker = aTab.attach({contentScriptFile: ["./common/jquery-2.1.3.min.js", "./common/jquery-ui-1.11.2.min.js", "./common/dcc-settings.js", "./dcc-firefox-settings-adapter.js"]});
                console.log("settingsWorker.port.emit showSettings");
                settingsWorker.port.emit("showSettings", new ContentScriptParams(aTab, anInformationHolder));
                settingsWorker.port.on("saveSettings", function(aContentScriptParams) {
                    eventAggregator.publish("saveSettings", {
                        contentScriptParams: aContentScriptParams
                    });
                });
                settingsWorker.port.on("resetSettings", function() {
                    eventAggregator.publish("resetSettings");
                });
                settingsWorker.settingsTab = aTab;
            }
            else if (aTab.url === "resource://dcc-at-joint-dot-ax/direct-currency-converter-2/data/common/prices.html") {
                testPageWorker = aTab.attach({contentScriptFile: ["./common/dcc-regexes.js", "./common/dcc-content.js", "./dcc-firefox-content-adapter.js"]});
                const finishedTabProcessingHandler = function(aHasConvertedElements) {
                    try {
                        if (testPageWorker.tab.customTabObject == null) {
                            testPageWorker.tab.customTabObject = new CustomTabObject();
                        }
                        testPageWorker.tab.customTabObject.isEnabled = anInformationHolder.conversionEnabled;
                        testPageWorker.tab.customTabObject.workers.push(testPageWorker);
                        testPageWorker.tab.customTabObject.hasConvertedElements = aHasConvertedElements;
                    }
                    catch(err) {
                        console.error("registerToTabsEvents: " + err);
                    }
                };
                testPageWorker.port.emit("updateSettings", new ContentScriptParams(testPageWorker.tab, anInformationHolder));
                testPageWorker.port.on("finishedTabProcessing", finishedTabProcessingHandler);
                testPageWorker.testPageTab = aTab;
            }
            else if (aTab.customTabObject == null) {
                aTab.customTabObject = new CustomTabObject();
                aTab.customTabObject.isEnabled = anInformationHolder.conversionEnabled;
                // To set toggle button for this tab
                eventAggregator.publish("toggleConversion", anInformationHolder.conversionEnabled);
            }
            if (aTab.customTabObject != null) {
                let i = aTab.customTabObject.workers.length;
                while (i--) {
                    const worker = aTab.customTabObject.workers[i];
                    if (worker.tab == null) {
                        aTab.customTabObject.workers.splice(i, 1);
                    }
                }
            }
        };
        const releaseTab = function(aTab) {
            if (settingsWorker && settingsWorker.settingsTab) {
                if (settingsWorker.settingsTab.title == aTab.title) {
                    settingsWorker.settingsTab = null;
                }
                else {
                    aTab.customTabObject = null;
                }
            }
            else {
                aTab.customTabObject = null;
            }
        };
        const activateTab = function() {
            if (tabs.activeTab.customTabObject) {
                tabs.activeTab.customTabObject.isEnabled = anInformationHolder.conversionEnabled;
            }
            eventAggregator.publish("tabActivated", {
                tab: tabs.activeTab
            });
        };
        //tabs.on("activate", activateTab);
        //tabs.on("ready", setTab);
        //tabs.on("close", releaseTab);
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
