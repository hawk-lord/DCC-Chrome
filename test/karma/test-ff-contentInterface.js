/**
 * Created by per on 2015-09-10.
 */


const PageMod = function() {
    "use strict";

};

const tabs = function() {
    "use strict";
};
tabs.on = function (what, fn) {};
tabs.open = function () {};
tabs.activeTab = {};

describe("GcContentInterface", function() {
    "use strict";
    describe("#new", function() {
        it("new", function () {
            const informationHolder = new MockInformationHolder();
            const firefoxContentInterface = new GcContentInterface(informationHolder);
        });
        it("watchForPages", function () {
            const informationHolder = new MockInformationHolder();
            const firefoxContentInterface = new GcContentInterface(informationHolder);
            firefoxContentInterface.watchForPages();
        });
        it("toggleConversion", function () {
            const conversionEnabled = true;
            const informationHolder = new MockInformationHolder();
            const firefoxContentInterface = new GcContentInterface(informationHolder);
            firefoxContentInterface.toggleConversion(conversionEnabled);
        });
    });
});
