/* Author: AndrewJ */
var ajaxCache = {
    versionNumber: 1 //increment this to force users to get new cache
    ,checkCache: function(ajaxUrl) {
        if (ajaxUrl) {
            if (localStorage && JSON && localStorage.getItem(ajaxUrl)) { 
                var ajaxContent = JSON.parse(localStorage.getItem(ajaxUrl));

                if (ajaxContent.url && ajaxContent.dateTime && ajaxContent.content && ajaxContent.cacheLimit) {
                    var cachedContentDate = new Date(ajaxContent.dateTime);
                    var currentDate = new Date();
                    var diff = Math.ceil(((currentDate.getTime() - cachedContentDate.getTime()) / 1000));
                    if (diff < ajaxContent.cacheLimit) { //If cache hasn't expired
                        if (ajaxContent.versionNumber === ajaxCache.versionNumber && ajaxContent.versionNumber > 0) {//If correct version number
                            return true;
                        } else {
                            localStorage.removeItem(ajaxUrl);
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else { //Is corrupted
                    localStorage.removeItem(ajaxUrl);
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    , getContent: function(ajaxUrl) {
        if (localStorage && JSON) {
            var ajaxCache = JSON.parse(localStorage.getItem(ajaxUrl));
            if (ajaxCache) {
                return ajaxCache.content || "";
            }
        }
    }
    , storeContent: function(ajaxUrl, ajaxContent, cacheTime) {
        var ajaxUrlCache = 0;
        if (localStorage && JSON && ajaxContent && window.sitemode === "L" && !utils.getCookie("noCache")) { // & is on live
            try {
                if (localStorage.getItem(ajaxUrl)) { 
                    localStorage.removeItem(ajaxUrl);
                }
                if (cacheTime) {
                    ajaxUrlCache = cacheTime;
                } else {
                    ajaxUrlCache = 0; //No cache time specified
                }
                if (parseInt(ajaxUrlCache) !== 0 && ajaxContent) { //Save some execution by having this condition
                    localStorage.setItem(ajaxUrl, JSON.stringify({versionNumber: ajaxCache.versionNumber, dateTime: new Date().toString(), cacheLimit: ajaxUrlCache, url: ajaxUrl, content: ajaxContent}));
                }
            } finally {
                return false;
            }
        }
    }
    , clearLocalStorage: function(){
        localStorage.clear();
    }
};

$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    if (options.type !== "POST" && options.type !== "post") { //Only cache get requests
        if (options.dataType === "jsonp") {
            var callback = originalOptions.success;
            window.jsonpCallbacks = window.jsonpCallbacks || {};
            window.jsonpCallbacks[options.jsonpCallback] = function(response) {
                callback(response);
            };
            window[options.jsonpCallback] = function(response) {
                if (typeof window.jsonpCallbacks[options.jsonpCallback] === "function") {
                    window.jsonpCallbacks[options.jsonpCallback](response);
                }
            };
        } else {
            
            if (!ajaxCache.checkCache(options.url)) {
                options.success = function() {
                    if (!responseText) {
                        var responseText = responseText || jqXHR.responseText || "";
                        responseText = responseText.toString();
                    }
                    if (options.dataType === "json" && responseText) {
                        responseText = this.converters["text json"](responseText);
                    }

                    if (originalOptions.success) {
                        if (responseText.toString().indexOf("?xml version") !== -1) {
                            //XML file, parse it
                            responseText = this.converters["text xml"](responseText);
                        }
                        if (options.cache !== false) { //Only store if it will be read
                            ajaxCache.storeContent(originalOptions.url, responseText, originalOptions.cacheTime);
                        }
                        originalOptions.success(responseText, options, originalOptions, jqXHR);
                    }
                };
            } else {
                jqXHR.abort();
                var cachedResponse = ajaxCache.getContent(options.url);
                originalOptions.success(cachedResponse, options, originalOptions, jqXHR);
            }
        }
    } else {
        options.success = function(responseText) {
            originalOptions.success(responseText, options, originalOptions, jqXHR);
        };
    }
});