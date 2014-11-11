/**
 * Created by per on 14-10-30.
 */

const ContentAdapter = function() {
    var thePort;
    var messageListener = function(msg) {
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
    var portListener = function(aPort) {
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
