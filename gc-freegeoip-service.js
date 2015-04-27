/**
 * Google Chrome browser
 */
const GcFreegeoipServiceProvider = function() {
    "use strict";
    const onComplete = function() {
        try {
            if (this.readyState == this.DONE) {
                var countryCode;
                if (this.status == "200") {
                    const response = JSON.parse(this.responseText);
                    countryCode = response.country_code;
                }
                else {
                    countryCode = "GB";
                }
                eventAggregator.publish("countryReceived", countryCode);
            }
        }
        catch(err) {
            console.error("err " + err);
            eventAggregator.publish("countryReceived", "CH");
        }
    };
    const findCountry = function (aUrlString, aConvertToCountry) {
        const urlString = aUrlString;
        var userCountry = aConvertToCountry;
        const request = new XMLHttpRequest();
        const method = "GET";
        request.open(method, urlString);
        request.onreadystatechange = onComplete;
        request.send();
    };
    return {
        findCountry: findCountry
    };
};
