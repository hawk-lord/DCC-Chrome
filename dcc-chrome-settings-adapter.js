const SettingsAdapter = function() {
    const options = null;
    chrome.runtime.sendMessage({command: "show"}, options, DirectCurrencySettings.showSettings);
    document.addEventListener('DOMContentLoaded', DirectCurrencySettings);
    return {
        save : function(contentScriptParams) {
            chrome.runtime.sendMessage({command: "save", contentScriptParams: contentScriptParams});
        },
        reset : function() {
            chrome.runtime.sendMessage({command: "reset"});
        }
    }
}();