/**
 * CSInterface.js - Adobe CEP v11 (Minimal Bridge)
 */
function CSInterface() {}

CSInterface.prototype.evalScript = function(script, callback) {
    if (callback) {
        window.__adobe_cep__.evalScript(script, callback);
    } else {
        window.__adobe_cep__.evalScript(script);
    }
};

CSInterface.prototype.getHostEnvironment = function() {
    return JSON.parse(window.__adobe_cep__.getHostEnvironment());
};

CSInterface.prototype.addEventListener = function(type, listener) {
    window.__adobe_cep__.addEventListener(type, listener);
};

CSInterface.prototype.removeEventListener = function(type, listener) {
    window.__adobe_cep__.removeEventListener(type, listener);
};

CSInterface.prototype.dispatchEvent = function(event) {
    window.__adobe_cep__.dispatchEvent(JSON.stringify(event));
};

CSInterface.prototype.registerKeyEventsInterest = function(keyEventsInterest) {
    return window.__adobe_cep__.registerKeyEventsInterest(keyEventsInterest);
};

CSInterface.prototype.requestOpenExtension = function(extensionId, startupParams) {
    window.__adobe_cep__.requestOpenExtension(extensionId, startupParams || "");
};

CSInterface.prototype.closeExtension = function() {
    window.__adobe_cep__.closeExtension();
};

CSInterface.prototype.getSystemPath = function(pathType) {
    return window.__adobe_cep__.getSystemPath(pathType);
};

CSInterface.prototype.getExtensionID = function() {
    return window.__adobe_cep__.getExtensionID();
};

CSInterface.prototype.setWindowTitle = function(title) {
    window.__adobe_cep__.setWindowTitle(title);
};
