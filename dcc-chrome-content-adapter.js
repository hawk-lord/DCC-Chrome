/*
 * © 2014 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Based on code from Simple Currency Converter
 * https://addons.mozilla.org/en-US/firefox/addon/simple-currency-converter/
 *
 * Module pattern is used.
 */
const ContentAdapter = function() {
    "use strict";
    var thePort;
    const messageListener = function(msg) {
        // Check "sendEnabledStatus" or "updateSettings"
        if (msg.conversionQuotes) {
            // alert("onUpdateSettings");
            DirectCurrencyContent.onUpdateSettings(msg);
        }
        else {
            // alert("onSendEnabledStatus");
            DirectCurrencyContent.onSendEnabledStatus(msg);
        }
    };
    const portListener = function(aPort) {
        //    alert ("addListener 2 "+ port.name);
        console.assert(aPort.name == "dccContentPort");
        thePort = aPort;
        aPort.onMessage.addListener(messageListener);
    };
    chrome.runtime.onConnect.addListener(portListener);
    return {
        finish: function (hasConvertedElements) {
            // "finishedTabProcessing"
            thePort.postMessage(hasConvertedElements);
        }
    };

}();


// OK example connect to main
//var port = chrome.runtime.connect({name: "knockknock"});
//port.postMessage({joke: "Knock knock"});
//port.onMessage.addListener(function(msg) {
//    if (msg.question == "Who's there?")
//        port.postMessage({answer: "Madame"});
//    else if (msg.question == "Madame who?")
//        port.postMessage({answer: "Madame... Bovary"});
//});
