var Localization = /** @class */ (function () {
    function Localization() {
        this.mGlobalScope = "global";
        this.mCultureCookieName = "Localization.Culture";
        this.mDictionary = {};
        this.mPluralizedDictionary = {};
    }
    Localization.prototype.translate = function (text, scope, cultureName) {
        var dictionary = this.getDictionary(scope, cultureName);
        var result = dictionary.translate(text);
        if (result == null) {
            return this.getFallbackTranslation(text, scope, cultureName);
        }
        return result;
    };
    Localization.prototype.translateFormat = function (text, parameters, scope, cultureName) {
        var dictionary = this.getDictionary(scope, cultureName);
        var result = dictionary.translateFormat(text, parameters);
        if (result == null) {
            return this.getFallbackTranslation(text, scope, cultureName);
        }
        return result;
    };
    Localization.prototype.translatePluralization = function (text, number, scope, cultureName) {
        var dictionary = this.getPluralizationDictionary(scope, cultureName);
        var result = dictionary.translatePluralization(text, number);
        if (result == null) {
            return this.getFallbackTranslation(text, scope, cultureName);
        }
        return result;
    };
    Localization.prototype.getFallbackTranslation = function (text, scope, cultureName) {
        console.log("Localized string with key=" + text + " was not found in dictionary=" + scope + " with culture=" + cultureName);
        var localizedString = { name: text, value: "X{undefined}", resourceNotFound: true };
        return localizedString;
    };
    Localization.prototype.configureSiteUrl = function (siteUrl) {
        this.mSiteUrl = siteUrl;
    };
    Localization.prototype.getDictionary = function (scope, cultureName) {
        scope = this.checkScope(scope);
        cultureName = this.checkCultureName(cultureName);
        return this.getLocalizationDictionary(scope, cultureName);
    };
    Localization.prototype.getPluralizationDictionary = function (scope, cultureName) {
        scope = this.checkScope(scope);
        cultureName = this.checkCultureName(cultureName);
        return this.getPluralizationLocalizationDictionary(scope, cultureName);
    };
    Localization.prototype.checkCultureName = function (cultureName) {
        if (cultureName) {
            return cultureName;
        }
        return this.getCurrentCulture();
    };
    Localization.prototype.checkScope = function (scope) {
        if (scope) {
            return scope;
        }
        return this.mGlobalScope;
    };
    Localization.prototype.getLocalizationDictionary = function (scope, cultureName) {
        var dictionaryKey = this.dictionaryKey(scope, cultureName);
        var dictionary = this.mDictionary[dictionaryKey];
        if (typeof dictionary === "undefined") {
            this.downloadDictionary(scope, cultureName);
            return this.mDictionary[dictionaryKey];
        }
        return dictionary;
    };
    Localization.prototype.getPluralizationLocalizationDictionary = function (scope, cultureName) {
        var dictionaryKey = this.dictionaryKey(scope, cultureName);
        var dictionary = this.mPluralizedDictionary[dictionaryKey];
        if (typeof dictionary === "undefined") {
            this.downloadPluralizedDictionary(scope, cultureName);
            return this.mPluralizedDictionary[dictionaryKey];
        }
        return dictionary;
    };
    Localization.prototype.dictionaryKey = function (scope, cultureName) {
        return scope.concat("|", cultureName);
    };
    Localization.prototype.downloadDictionary = function (scope, cultureName) {
        var _this = this;
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.onreadystatechange = function () {
            if (xmlHttpRequest.readyState === XMLHttpRequest.DONE) {
                if (xmlHttpRequest.status === 200) {
                    var response = xmlHttpRequest.responseText;
                    var dictionaryKey = _this.dictionaryKey(scope, cultureName);
                    _this.mDictionary[dictionaryKey] = new LocalizationDictionary(response);
                }
            }
        };
        var baseUrl = this.mSiteUrl;
        if (baseUrl && baseUrl.charAt(baseUrl.length - 1) === "/") {
            baseUrl = baseUrl.substring(0, baseUrl.length - 1);
        }
        xmlHttpRequest.open("GET", baseUrl + "/Localization/Dictionary?scope=" + scope, false);
        xmlHttpRequest.send();
    };
    Localization.prototype.downloadPluralizedDictionary = function (scope, cultureName) {
        var _this = this;
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.onreadystatechange = function () {
            if (xmlHttpRequest.readyState === XMLHttpRequest.DONE) {
                if (xmlHttpRequest.status === 200) {
                    var response = xmlHttpRequest.responseText;
                    var dictionaryKey = _this.dictionaryKey(scope, cultureName);
                    _this.mPluralizedDictionary[dictionaryKey] = new LocalizationPluralizationDictionary(response);
                }
            }
        };
        var baseUrl = this.mSiteUrl;
        if (baseUrl && baseUrl.charAt(baseUrl.length - 1) === "/") {
            baseUrl = baseUrl.substring(0, baseUrl.length - 1);
        }
        xmlHttpRequest.open("GET", baseUrl + "/Localization/PluralizedDictionary?scope=" + scope, false);
        xmlHttpRequest.send();
    };
    Localization.prototype.getCurrentCulture = function () {
        if (this.mCurrentCulture === "") {
            var currentCulture = this.getCurrentCultureCookie();
            this.setCurrentCulture(currentCulture);
        }
        return this.mCurrentCulture;
    };
    Localization.prototype.setCurrentCulture = function (culture) {
        this.mCurrentCulture = culture;
    };
    Localization.prototype.getCurrentCultureCookie = function () {
        return LocalizationUtils.getCookie(this.mCultureCookieName);
    };
    return Localization;
}());
var LocalizationDictionary = /** @class */ (function () {
    function LocalizationDictionary(dictionary) {
        this.mDictionary = JSON.parse(dictionary);
    }
    LocalizationDictionary.prototype.translate = function (text) {
        var result = this.mDictionary[text];
        if (typeof result === "undefined") {
            return null;
        }
        return result;
    };
    LocalizationDictionary.prototype.translateFormat = function (text, parameters) {
        var translation = this.translate(text);
        var formatedText = !parameters ? translation.value : this.formatString(translation, parameters);
        var localizedString = { name: text, value: formatedText, resourceNotFound: translation.resourceNotFound };
        return localizedString;
    };
    LocalizationDictionary.prototype.translatePluralization = function (text, number) {
        var result = this.mDictionary[text];
        if (typeof result === "undefined") {
            return null;
        }
        return result;
    };
    LocalizationDictionary.prototype.formatString = function (str, obj) {
        return str.value.replace(/\{\s*([^}\s]+)\s*\}/g, function (m, p1, offset, string) { return obj[p1]; });
    };
    return LocalizationDictionary;
}());
var LocalizationPluralizationDictionary = /** @class */ (function () {
    function LocalizationPluralizationDictionary(dictionary) {
        this.mDictionary = JSON.parse(dictionary);
    }
    LocalizationPluralizationDictionary.prototype.translatePluralization = function (text, number) {
        var pluralizedString = this.mDictionary[text];
        var requestedInterval = new PluralizationInterval(number, number);
        if (typeof pluralizedString === "undefined" || pluralizedString === null) {
            return null;
        }
        for (var key in pluralizedString.pluralized) {
            if (pluralizedString.pluralized.hasOwnProperty(key)) {
                var separatedString = key.split(",");
                var intervalStart = parseInt(separatedString[0], 10);
                var intervalEnd = parseInt(separatedString[1], 10);
                if (isNaN(intervalStart) || isNaN(intervalEnd)) {
                    continue;
                }
                var translationInterval = new PluralizationInterval(intervalStart, intervalEnd);
                if (translationInterval.equals(requestedInterval)) {
                    return pluralizedString.pluralized[key];
                }
            }
        }
        return pluralizedString.defaultLocalizedString;
    };
    return LocalizationPluralizationDictionary;
}());
var PluralizationInterval = /** @class */ (function () {
    function PluralizationInterval(x, y) {
        if (x > y) {
            var intervalErrorMsg = "The x value should be less or equal than y.";
            throw new Error(intervalErrorMsg);
        }
        this.X = x;
        this.Y = y;
    }
    PluralizationInterval.prototype.isOverlaping = function (obj) {
        if (!obj) {
            throw new Error("Interval is not defined");
        }
        return this.X <= obj.Y && obj.X <= this.Y;
    };
    PluralizationInterval.prototype.equals = function (obj) {
        if (obj == null) {
            return false;
        }
        if (typeof this != typeof obj) {
            return false;
        }
        return this.isOverlaping(obj);
    };
    return PluralizationInterval;
}());
var LocalizationUtils = /** @class */ (function () {
    function LocalizationUtils() {
    }
    LocalizationUtils.getCookie = function (name) {
        name = name + "=";
        return document.cookie
            .split(";")
            .map(function (c) { return c.trim(); })
            .filter(function (cookie) {
            return cookie.indexOf(name) === 0;
        })
            .map(function (cookie) {
            return decodeURIComponent(cookie.substring(name.length));
        })[0] ||
            null;
    };
    return LocalizationUtils;
}());

//# sourceMappingURL=localization.js.map
