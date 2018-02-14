/**
 * Created by per on 2015-09-10.
 */

/*
const chrome = function() {
    "use strict";
    const tabs = function() {

    }
    return {
        tabs: tabs
    }
};
*/

"use strict"
/*
if (!this.chrome) {
    const chrome = function() {
    };

    chrome.tabs = function() {
    };


    chrome.tabs.onUpdated = function () {

    };

    chrome.tabs.onUpdated.removeListener = function () {

    }

    chrome.tabs.onUpdated.addListener = function () {

    }

    chrome.tabs.query = function () {

    }

    chrome.tabs.create = function () {

    }

    chrome.storage = function() {
    }

    chrome.storage.local = function() {
    }

    chrome.storage.local.get = function() {
    }

    chrome.extension = function() {

    }

    chrome.extension.getURL = function() {

    }

    chrome.runtime = function () {

    }
    chrome.runtime.onConnect = function () {

    }
    chrome.runtime.onConnect.addListener = function () {

    }

    this.chrome = chrome;
}
*/
/*
tabs.on = function (what, fn) {};
tabs.open = function () {};
tabs.activeTab = {};
*/
describe("GcContentInterface", function() {
    describe("#new", function() {
        it("new", function () {
            const informationHolder = new MockInformationHolder();
            const gcContentInterface = new GcContentInterface(informationHolder);
        });
        it("watchForPages", function () {
            const informationHolder = new MockInformationHolder();
            const gcContentInterface = new GcContentInterface(informationHolder);
            gcContentInterface.watchForPages();
        });
        it("toggleConversion", function () {
            const conversionEnabled = true;
            const informationHolder = new MockInformationHolder();
            const gcContentInterface = new GcContentInterface(informationHolder);
            gcContentInterface.toggleConversion(conversionEnabled);
        });
        it("showQuotesTab", function () {
            const informationHolder = new MockInformationHolder();
            const gcContentInterface = new GcContentInterface(informationHolder);
            gcContentInterface.showQuotesTab();

        });
    });
});
