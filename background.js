/**
 * Created by per on 14-10-27.
 */
// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const DirectCurrencyConverter = (function () {


    const informationHolder = {
        conversionQuotes: {},
        convertToCurrency: "EUR",
        convertToCountry: "AX",
        currencySymbols: [],
        customSymbols: [],
        decimalSep: ",",
        enableOnStart: true,
        excludedDomains: [],
        enabledCurrencies: {
            "CHF": true,
            "DKK": true,
            "EUR": true,
            "GBP": true,
            "ISK": true,
            "JPY": true,
            "NOK": true,
            "RUB": true,
            "SEK": true,
            "USD": true,
            "AFN": true,
            "AED": true,
            "ALL": true,
            "AMD": true,
            "ANG": true,
            "AOA": true,
            "ARS": true,
            "AUD": true,
            "AWG": true,
            "AZN": true,
            "BAM": true,
            "BBD": true,
            "BDT": true,
            "BGN": true,
            "BHD": true,
            "BIF": true,
            "BMD": true,
            "BND": true,
            "BOB": true,
            "BOV": true,
            "BRL": true,
            "BSD": true,
            "BTN": true,
            "BWP": true,
            "BYR": true,
            "BZD": true,
            "CAD": true,
            "CDF": true,
            "CHE": true,
            "CHW": true,
            "CLF": true,
            "CLP": true,
            "CNY": true,
            "COP": true,
            "COU": true,
            "CRC": true,
            "CUC": true,
            "CUP": true,
            "CVE": true,
            "CZK": true,
            "DJF": true,
            "DOP": true,
            "DZD": true,
            "EGP": true,
            "ERN": true,
            "ETB": true,
            "FJD": true,
            "FKP": true,
            "GEL": true,
            "GHS": true,
            "GIP": true,
            "GMD": true,
            "GNF": true,
            "GTQ": true,
            "GYD": true,
            "HKD": true,
            "HNL": true,
            "HRK": true,
            "HTG": true,
            "HUF": true,
            "IDR": true,
            "ILS": true,
            "INR": true,
            "IQD": true,
            "IRR": true,
            "JMD": true,
            "JOD": true,
            "KES": true,
            "KGS": true,
            "KHR": true,
            "KMF": true,
            "KPW": true,
            "KRW": true,
            "KWD": true,
            "KYD": true,
            "KZT": true,
            "LAK": true,
            "LBP": true,
            "LKR": true,
            "LRD": true,
            "LSL": true,
            "LTL": true,
            "LYD": true,
            "MAD": true,
            "MDL": true,
            "MGA": true,
            "MKD": true,
            "MMK": true,
            "MNT": true,
            "MOP": true,
            "MRO": true,
            "MUR": true,
            "MVR": true,
            "MWK": true,
            "MXN": true,
            "MXV": true,
            "MYR": true,
            "MZN": true,
            "NAD": true,
            "NGN": true,
            "NIO": true,
            "NPR": true,
            "NZD": true,
            "OMR": true,
            "PAB": true,
            "PEN": true,
            "PGK": true,
            "PHP": true,
            "PKR": true,
            "PLN": true,
            "PYG": true,
            "QAR": true,
            "RON": true,
            "RSD": true,
            "RWF": true,
            "SAR": true,
            "SBD": true,
            "SCR": true,
            "SDG": true,
            "SGD": true,
            "SHP": true,
            "SLL": true,
            "SOS": true,
            "SRD": true,
            "SSP": true,
            "STD": true,
            "SVC": true,
            "SYP": true,
            "SZL": true,
            "THB": true,
            "TJS": true,
            "TMT": true,
            "TND": true,
            "TOP": true,
            "TRY": true,
            "TTD": true,
            "TWD": true,
            "TZS": true,
            "UAH": true,
            "UGX": true,
            "USN": true,
            "UYI": true,
            "UYU": true,
            "UZS": true,
            "VEF": true,
            "VND": true,
            "VUV": true,
            "WST": true,
            "XAF": true,
            "XAG": true,
            "XAU": true,
            "XBA": true,
            "XBB": true,
            "XBC": true,
            "XBD": true,
            "XCD": true,
            "XDR": true,
            "XOF": true,
            "XPD": true,
            "XPF": true,
            "XPT": true,
            "XSU": true,
            "XTS": true,
            "XUA": true,
            "XXX": true,
            "YER": true,
            "ZAR": true,
            "ZMW": true,
            "ZWL": true
        },
        quoteAdjustmentPercent: 0,
        roundPrices: true,
        separatePrice: true,
        showOriginalPrices: true,
        unitAfter: true,
        tempConvertUnits: true,
        thousandSep: ".",
        conversionEnabled: true,
        currencyNames: []
    };


    informationHolder.conversionQuotes.AFN = 0.0137;
    informationHolder.conversionQuotes.AED = 0.2158;
    informationHolder.conversionQuotes.ALL = 0.007187703277233309;
    informationHolder.conversionQuotes.AMD = 0.001925146826135562;
    informationHolder.conversionQuotes.ANG = 0.4428;
    informationHolder.conversionQuotes.AOA = 0.007973165514145591;
    informationHolder.conversionQuotes.ARS = 0.0932;
    informationHolder.conversionQuotes.AUD = 0.6996;
    informationHolder.conversionQuotes.AWG = 0.4428;
    informationHolder.conversionQuotes.AZN = 1.0105;
    informationHolder.conversionQuotes.BAM = 0.51;
    informationHolder.conversionQuotes.BBD = 0.3963;
    informationHolder.conversionQuotes.BDT = 0.0102;
    informationHolder.conversionQuotes.BGN = 0.5089;
    informationHolder.conversionQuotes.BHD = 2.102;
    informationHolder.conversionQuotes.BIF = 0.0005074647815635609;
    informationHolder.conversionQuotes.BMD = 0.7927;
    informationHolder.conversionQuotes.BND = 0.6208;
    informationHolder.conversionQuotes.BOB = 0.1147;
    informationHolder.conversionQuotes.BOV = 0;
    informationHolder.conversionQuotes.BRL = 0.3294;
    informationHolder.conversionQuotes.BSD = 0.7927;
    informationHolder.conversionQuotes.BTN = 0.0129;
    informationHolder.conversionQuotes.BWP = 0.0869;
    informationHolder.conversionQuotes.BYR = 0.00007383884648127033;
    informationHolder.conversionQuotes.BZD = 0.3973;
    informationHolder.conversionQuotes.CAD = 0.708;
    informationHolder.conversionQuotes.CDF = 0.0008569297509556481;
    informationHolder.conversionQuotes.CHE = 0;
    informationHolder.conversionQuotes.CHF = 0.8292;
    informationHolder.conversionQuotes.CHW = 0;
    informationHolder.conversionQuotes.CLF = 33.4174;
    informationHolder.conversionQuotes.CLP = 0.0013736418459658474;
    informationHolder.conversionQuotes.CNY = 0.1296;
    informationHolder.conversionQuotes.COP = 0.0003861736248975095;
    informationHolder.conversionQuotes.COU = 0;
    informationHolder.conversionQuotes.CRC = 0.0014658528837797075;
    informationHolder.conversionQuotes.CUC = 0;
    informationHolder.conversionQuotes.CUP = 0.7927;
    informationHolder.conversionQuotes.CVE = 0.009179617577131738;
    informationHolder.conversionQuotes.CZK = 0.036;
    informationHolder.conversionQuotes.DJF = 0.004355275501662409;
    informationHolder.conversionQuotes.DKK = 0.1343;
    informationHolder.conversionQuotes.DOP = 0.0181;
    informationHolder.conversionQuotes.DZD = 0.009475915539269616;
    informationHolder.conversionQuotes.EGP = 0.1109;
    informationHolder.conversionQuotes.ERN = 0.0525;
    informationHolder.conversionQuotes.ETB = 0.0395;
    informationHolder.conversionQuotes.EUR = 1.00;
    informationHolder.conversionQuotes.FJD = 0.4162;
    informationHolder.conversionQuotes.FKP = 1.267;
    informationHolder.conversionQuotes.GBP = 1.2684;
    informationHolder.conversionQuotes.GEL = 0.4525;
    informationHolder.conversionQuotes.GHS = 0.2464;
    informationHolder.conversionQuotes.GIP = 1.2671;
    informationHolder.conversionQuotes.GMD = 0.0184;
    informationHolder.conversionQuotes.GNF = 0.00011275390925978061;
    informationHolder.conversionQuotes.GTQ = 0.1041;
    informationHolder.conversionQuotes.GYD = 0.0038534754495079117;
    informationHolder.conversionQuotes.HKD = 0.1022;
    informationHolder.conversionQuotes.HNL = 0.0372;
    informationHolder.conversionQuotes.HRK = 0.1305;
    informationHolder.conversionQuotes.HTG = 0.0173;
    informationHolder.conversionQuotes.HUF = 0.0032445515867479536;
    informationHolder.conversionQuotes.IDR = 0.0000653740187841914;
    informationHolder.conversionQuotes.ILS = 0.2104;
    informationHolder.conversionQuotes.INR = 0.0129;
    informationHolder.conversionQuotes.IQD = 0.0006815649030061579;
    informationHolder.conversionQuotes.IRR = 0.000029653211444875205;
    informationHolder.conversionQuotes.ISK = 0.006502542494115199;
    informationHolder.conversionQuotes.JMD = 0.007039611188194853;
    informationHolder.conversionQuotes.JOD = 1.1184;
    informationHolder.conversionQuotes.JPY = 0.007248703750551807;
    informationHolder.conversionQuotes.KES = 0.008866442995864691;
    informationHolder.conversionQuotes.KGS = 0.0138;
    informationHolder.conversionQuotes.KHR = 0.00019451778845723663;
    informationHolder.conversionQuotes.KMF = 0.0020329355894852506;
    informationHolder.conversionQuotes.KPW = 0.000880733298544368;
    informationHolder.conversionQuotes.KRW = 0.0007505468296564169;
    informationHolder.conversionQuotes.KWD = 2.738;
    informationHolder.conversionQuotes.KYD = 0.9667;
    informationHolder.conversionQuotes.KZT = 0.004381395193959984;
    informationHolder.conversionQuotes.LAK = 0.0000985221577810682;
    informationHolder.conversionQuotes.LBP = 0.0005238995372342998;
    informationHolder.conversionQuotes.LKR = 0.006055460753953308;
    informationHolder.conversionQuotes.LRD = 0.009380590245499427;
    informationHolder.conversionQuotes.LSL = 0.0727;
    informationHolder.conversionQuotes.LTL = 0.2896;
    informationHolder.conversionQuotes.LYD = 0.6566;
    informationHolder.conversionQuotes.MAD = 0.0904;
    informationHolder.conversionQuotes.MDL = 0.054;
    informationHolder.conversionQuotes.MGA = 0.00029195580022749196;
    informationHolder.conversionQuotes.MKD = 0.0162;
    informationHolder.conversionQuotes.MMK = 0.0007855897080206588;
    informationHolder.conversionQuotes.MNT = 0.00042719482984894004;
    informationHolder.conversionQuotes.MOP = 0.0992;
    informationHolder.conversionQuotes.MRO = 0.0027286060233977965;
    informationHolder.conversionQuotes.MUR = 0.0249;
    informationHolder.conversionQuotes.MVR = 0.0516;
    informationHolder.conversionQuotes.MWK = 0.0016934284814349434;
    informationHolder.conversionQuotes.MXN = 0.059;
    informationHolder.conversionQuotes.MXV = 0.3068;
    informationHolder.conversionQuotes.MYR = 0.2411;
    informationHolder.conversionQuotes.MZN = 0.0255;
    informationHolder.conversionQuotes.NAD = 0.0727;
    informationHolder.conversionQuotes.NGN = 0.004786017172229613;
    informationHolder.conversionQuotes.NIO = 0.0301;
    informationHolder.conversionQuotes.NOK = 0.1183;
    informationHolder.conversionQuotes.NPR = 0.007954443312262013;
    informationHolder.conversionQuotes.NZD = 0.6216;
    informationHolder.conversionQuotes.OMR = 2.0591;
    informationHolder.conversionQuotes.PAB = 0.7927;
    informationHolder.conversionQuotes.PEN = 0.2716;
    informationHolder.conversionQuotes.PGK = 0.3142;
    informationHolder.conversionQuotes.PHP = 0.0177;
    informationHolder.conversionQuotes.PKR = 0.007691994095625332;
    informationHolder.conversionQuotes.PLN = 0.2373;
    informationHolder.conversionQuotes.PYG = 0.00017135055405259223;
    informationHolder.conversionQuotes.QAR = 0.2177;
    informationHolder.conversionQuotes.RON = 0.2264;
    informationHolder.conversionQuotes.RSD = 0.008385230925067062;
    informationHolder.conversionQuotes.RUB = 0.0192;
    informationHolder.conversionQuotes.RWF = 0.0011479507643917153;
    informationHolder.conversionQuotes.SAR = 0.2113;
    informationHolder.conversionQuotes.SBD = 0.1069;
    informationHolder.conversionQuotes.SCR = 0.0563;
    informationHolder.conversionQuotes.SDG = 0.1395;
    informationHolder.conversionQuotes.SEK = 0.1079;
    informationHolder.conversionQuotes.SGD = 0.6204;
    informationHolder.conversionQuotes.SHP = 1.2671;
    informationHolder.conversionQuotes.SLL = 0.0001803549424946382;
    informationHolder.conversionQuotes.SOS = 0.001019498416973833;
    informationHolder.conversionQuotes.SRD = 0.242;
    informationHolder.conversionQuotes.SSP = 0;
    informationHolder.conversionQuotes.STD = 0.00004069096431298667;
    informationHolder.conversionQuotes.SVC = 0.0906;
    informationHolder.conversionQuotes.SYP = 0.004805455922436097;
    informationHolder.conversionQuotes.SZL = 0.0726;
    informationHolder.conversionQuotes.THB = 0.0243;
    informationHolder.conversionQuotes.TJS = 0.1585;
    informationHolder.conversionQuotes.TMT = 0.2781;
    informationHolder.conversionQuotes.TND = 0.4376;
    informationHolder.conversionQuotes.TOP = 0.401;
    informationHolder.conversionQuotes.TRY = 0.3606;
    informationHolder.conversionQuotes.TTD = 0.1253;
    informationHolder.conversionQuotes.TWD = 0.0261;
    informationHolder.conversionQuotes.TZS = 0.00046395081304828254;
    informationHolder.conversionQuotes.UAH = 0.0612;
    informationHolder.conversionQuotes.UGX = 0.00029303511501320575;
    informationHolder.conversionQuotes.USD = 0.7927;
    informationHolder.conversionQuotes.USN = 0;
    informationHolder.conversionQuotes.UYI = 0;
    informationHolder.conversionQuotes.UYU = 0.0333;
    informationHolder.conversionQuotes.UZS = 0.00033249441667063166;
    informationHolder.conversionQuotes.VEF = 0.1261;
    informationHolder.conversionQuotes.VND = 0.000037345583899828806;
    informationHolder.conversionQuotes.VUV = 0.008071891494405774;
    informationHolder.conversionQuotes.WST = 0.3281;
    informationHolder.conversionQuotes.XAF = 0.001524701692113938;
    informationHolder.conversionQuotes.XAG = 12.9925;
    informationHolder.conversionQuotes.XAU = 950.9938;
    informationHolder.conversionQuotes.XBA = 0;
    informationHolder.conversionQuotes.XBB = 0;
    informationHolder.conversionQuotes.XBC = 0;
    informationHolder.conversionQuotes.XBD = 0;
    informationHolder.conversionQuotes.XCD = 0.2936;
    informationHolder.conversionQuotes.XDR = 1.1753;
    informationHolder.conversionQuotes.XOF = 0.001521420227525352;
    informationHolder.conversionQuotes.XPD = 618.5522;
    informationHolder.conversionQuotes.XPF = 0.008365806605975528;
    informationHolder.conversionQuotes.XPT = 988.3677;
    informationHolder.conversionQuotes.XSU = 0;
    informationHolder.conversionQuotes.XTS = 0;
    informationHolder.conversionQuotes.XUA = 0;
    informationHolder.conversionQuotes.XXX = 0;
    informationHolder.conversionQuotes.YER = 0.003689278624282758;
    informationHolder.conversionQuotes.ZAR = 0.0729;
    informationHolder.conversionQuotes.ZMW = 0.1246;
    informationHolder.conversionQuotes.ZWL = 0.002458966004794984;


    const dccStatus = {};
    dccStatus.isEnabled = true;
    dccStatus.hasConvertedElements = false;
    dccStatus.status = true;

    const makeContentScriptParams = function (aTab, anInformationHolder) {
        const contentScriptParams = {};
        contentScriptParams.conversionQuotes = anInformationHolder.conversionQuotes;
        contentScriptParams.convertToCurrency = anInformationHolder.convertToCurrency;
        contentScriptParams.convertToCountry = anInformationHolder.convertToCountry;
        contentScriptParams.currencySymbols = anInformationHolder.currencySymbols;
        contentScriptParams.customSymbols = anInformationHolder.customSymbols;
        contentScriptParams.subUnitSeparator = anInformationHolder.decimalSep;
        contentScriptParams.enableOnStart = anInformationHolder.enableOnStart;
        contentScriptParams.excludedDomains = anInformationHolder.excludedDomains;
        contentScriptParams.enabledCurrencies = anInformationHolder.enabledCurrencies;
        contentScriptParams.quoteAdjustmentPercent = anInformationHolder.quoteAdjustmentPercent;
        contentScriptParams.roundAmounts = anInformationHolder.roundPrices;
        contentScriptParams.separatePrice = anInformationHolder.separatePrice;
        contentScriptParams.showOriginalPrices = anInformationHolder.showOriginalPrices;
        contentScriptParams.unitAfter = anInformationHolder.unitAfter;
        contentScriptParams.tempConvertUnits = anInformationHolder.tempConvertUnits;
        contentScriptParams.thousandSep = anInformationHolder.thousandSep;
        //if (aTab != null && typeof aTab.isEnabled != "undefined") {
        //    contentScriptParams.isEnabled = aTab.isEnabled;
        //}
        //else {
            contentScriptParams.isEnabled = anInformationHolder.conversionEnabled;
        //}
        contentScriptParams.currencyNames = anInformationHolder.currencyNames;
        return contentScriptParams;
    };

    var contentPort;
    var settingsPort;

    /**
     * Runs when tab has been loaded
     */
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        const contentExecuted = function() {
            // If conversion is enabled
            contentPort = chrome.tabs.connect(tabId, {name: "dccContentPort"});
            //    alert ("post Message to contentPort " + contentPort.name);
            try {
                contentPort.postMessage(dccStatus);
                contentPort.postMessage(makeContentScriptParams(tab, informationHolder));
            }
            catch (err) {
                alert(err);
            }
            contentPort.onMessage.addListener(function (msg) {
                alert("Content Finished " + msg);
            });

            //    alert ("posted Message");
        };
        if (tab.url.indexOf("http") === 0 && changeInfo.status === "complete") {
            // alert (tabId + " " + tab.id);
            chrome.tabs.executeScript({file: "dcc-regexes.js", allFrames : true});
            chrome.tabs.executeScript({file: "dcc-content.js", allFrames : true});
            chrome.tabs.executeScript({file: "dcc-chrome-content-adapter.js", allFrames : true}, contentExecuted);
        }
    });

    //const sendResponse = function() {
    //    alert("sendResponse");
    //    return "The Response";
    //};
    const callback = function(message, sender, sendResponse) {
        alert(message.greeting);
        sendResponse(makeContentScriptParams(null, informationHolder));
    };
    chrome.runtime.onMessage.addListener(callback);

    chrome.browserAction.onClicked.addListener(function () {
        alert("browserAction.onClicked");
    });
/*
    chrome.browserAction.onClicked.addListener(function () {
        //alert ("browserAction.onClicked");
        const callback = function (newTab) {
          //  alert ("browserAction.onClicked callback " + newTab.id );
            const settingsExecuted = function() {
            //    alert ("settingsExecuted");
                settingsPort = chrome.tabs.connect(newTab.id, {name: "dccSettingsPort"});
                // alert ("settingsExecuted postMessage");
                try {
                    settingsPort.postMessage(makeContentScriptParams(newTab, informationHolder));
                    //alert("posted message");
                }
                catch (err) {
                    alert(err);
                }
                settingsPort.onMessage.addListener(function (msg) {
                    alert("Settings Finished " + msg);
                });
            };
            try {
                chrome.tabs.executeScript(newTab.id, {file: "jquery-2.1.1.min.js"}, settingsExecuted);
            }
            catch(err) {
                alert(err);
            }
            chrome.tabs.executeScript(newTab.id, {file: "jquery-ui-1.10.4.min.js"}, settingsExecuted);
            chrome.tabs.executeScript(newTab.id, {file: "dcc-settings.js"}, settingsExecuted);
            chrome.tabs.executeScript(newTab.id, {file: "dcc-chrome-settings-adapter.js"}, settingsExecuted);
        };
        chrome.tabs.create({url: "index.html"}, callback);

    });
*/
return {
    roundPrices : function () {
        return informationHolder.roundPrices;
    }
}
})();
