import {
  isNotNil,
  warn
} from "./chunk-BSJ72W4M.js";
import {
  FormStyle,
  TranslationWidth,
  formatDate,
  getLocaleDayPeriods
} from "./chunk-L5HZ4PYD.js";
import {
  BehaviorSubject,
  Inject,
  Injectable,
  InjectionToken,
  NgModule,
  Optional,
  Pipe,
  inject,
  makeEnvironmentProviders,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdefinePipe,
  ɵɵdirectiveInject,
  ɵɵinject
} from "./chunk-VJFU7J2G.js";
import {
  __spreadValues
} from "./chunk-J4B6MK7R.js";

// node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}

// node_modules/date-fns/esm/_lib/toInteger/index.js
function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }
  var number = Number(dirtyNumber);
  if (isNaN(number)) {
    return number;
  }
  return number < 0 ? Math.ceil(number) : Math.floor(number);
}

// node_modules/date-fns/esm/_lib/requiredArgs/index.js
function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + " argument" + (required > 1 ? "s" : "") + " required, but only " + args.length + " present");
  }
}

// node_modules/date-fns/esm/toDate/index.js
function toDate(argument) {
  requiredArgs(1, arguments);
  var argStr = Object.prototype.toString.call(argument);
  if (argument instanceof Date || _typeof(argument) === "object" && argStr === "[object Date]") {
    return new Date(argument.getTime());
  } else if (typeof argument === "number" || argStr === "[object Number]") {
    return new Date(argument);
  } else {
    if ((typeof argument === "string" || argStr === "[object String]") && typeof console !== "undefined") {
      console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments");
      console.warn(new Error().stack);
    }
    return /* @__PURE__ */ new Date(NaN);
  }
}

// node_modules/date-fns/esm/addMilliseconds/index.js
function addMilliseconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var timestamp = toDate(dirtyDate).getTime();
  var amount = toInteger(dirtyAmount);
  return new Date(timestamp + amount);
}

// node_modules/date-fns/esm/_lib/defaultOptions/index.js
var defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}

// node_modules/date-fns/esm/startOfWeek/index.js
function startOfWeek(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$weekStartsOn, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var defaultOptions2 = getDefaultOptions();
  var weekStartsOn = toInteger((_ref = (_ref2 = (_ref3 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.weekStartsOn) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.weekStartsOn) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.weekStartsOn) !== null && _ref !== void 0 ? _ref : 0);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  var date = toDate(dirtyDate);
  var day = date.getDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/startOfISOWeek/index.js
function startOfISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  return startOfWeek(dirtyDate, {
    weekStartsOn: 1
  });
}

// node_modules/date-fns/esm/getISOWeekYear/index.js
function getISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  var fourthOfJanuaryOfNextYear = /* @__PURE__ */ new Date(0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  var startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);
  var fourthOfJanuaryOfThisYear = /* @__PURE__ */ new Date(0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  var startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// node_modules/date-fns/esm/startOfISOWeekYear/index.js
function startOfISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var year = getISOWeekYear(dirtyDate);
  var fourthOfJanuary = /* @__PURE__ */ new Date(0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  var date = startOfISOWeek(fourthOfJanuary);
  return date;
}

// node_modules/date-fns/esm/_lib/getTimezoneOffsetInMilliseconds/index.js
function getTimezoneOffsetInMilliseconds(date) {
  var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
  utcDate.setUTCFullYear(date.getFullYear());
  return date.getTime() - utcDate.getTime();
}

// node_modules/date-fns/esm/constants/index.js
var daysInYear = 365.2425;
var maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1e3;
var millisecondsInMinute = 6e4;
var millisecondsInHour = 36e5;
var millisecondsInSecond = 1e3;
var minTime = -maxTime;
var secondsInHour = 3600;
var secondsInDay = secondsInHour * 24;
var secondsInWeek = secondsInDay * 7;
var secondsInYear = secondsInDay * daysInYear;
var secondsInMonth = secondsInYear / 12;
var secondsInQuarter = secondsInMonth * 3;

// node_modules/date-fns/esm/isDate/index.js
function isDate(value) {
  requiredArgs(1, arguments);
  return value instanceof Date || _typeof(value) === "object" && Object.prototype.toString.call(value) === "[object Date]";
}

// node_modules/date-fns/esm/isValid/index.js
function isValid(dirtyDate) {
  requiredArgs(1, arguments);
  if (!isDate(dirtyDate) && typeof dirtyDate !== "number") {
    return false;
  }
  var date = toDate(dirtyDate);
  return !isNaN(Number(date));
}

// node_modules/date-fns/esm/subMilliseconds/index.js
function subMilliseconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMilliseconds(dirtyDate, -amount);
}

// node_modules/date-fns/esm/_lib/getUTCDayOfYear/index.js
var MILLISECONDS_IN_DAY = 864e5;
function getUTCDayOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var timestamp = date.getTime();
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
  var startOfYearTimestamp = date.getTime();
  var difference = timestamp - startOfYearTimestamp;
  return Math.floor(difference / MILLISECONDS_IN_DAY) + 1;
}

// node_modules/date-fns/esm/_lib/startOfUTCISOWeek/index.js
function startOfUTCISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var weekStartsOn = 1;
  var date = toDate(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/_lib/getUTCISOWeekYear/index.js
function getUTCISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getUTCFullYear();
  var fourthOfJanuaryOfNextYear = /* @__PURE__ */ new Date(0);
  fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear);
  var fourthOfJanuaryOfThisYear = /* @__PURE__ */ new Date(0);
  fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// node_modules/date-fns/esm/_lib/startOfUTCISOWeekYear/index.js
function startOfUTCISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var year = getUTCISOWeekYear(dirtyDate);
  var fourthOfJanuary = /* @__PURE__ */ new Date(0);
  fourthOfJanuary.setUTCFullYear(year, 0, 4);
  fourthOfJanuary.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCISOWeek(fourthOfJanuary);
  return date;
}

// node_modules/date-fns/esm/_lib/getUTCISOWeek/index.js
var MILLISECONDS_IN_WEEK = 6048e5;
function getUTCISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfUTCISOWeek(date).getTime() - startOfUTCISOWeekYear(date).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
}

// node_modules/date-fns/esm/_lib/startOfUTCWeek/index.js
function startOfUTCWeek(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$weekStartsOn, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var defaultOptions2 = getDefaultOptions();
  var weekStartsOn = toInteger((_ref = (_ref2 = (_ref3 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.weekStartsOn) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.weekStartsOn) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.weekStartsOn) !== null && _ref !== void 0 ? _ref : 0);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  var date = toDate(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/_lib/getUTCWeekYear/index.js
function getUTCWeekYear(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getUTCFullYear();
  var defaultOptions2 = getDefaultOptions();
  var firstWeekContainsDate = toInteger((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
  }
  var firstWeekOfNextYear = /* @__PURE__ */ new Date(0);
  firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCWeek(firstWeekOfNextYear, options);
  var firstWeekOfThisYear = /* @__PURE__ */ new Date(0);
  firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCWeek(firstWeekOfThisYear, options);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// node_modules/date-fns/esm/_lib/startOfUTCWeekYear/index.js
function startOfUTCWeekYear(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var defaultOptions2 = getDefaultOptions();
  var firstWeekContainsDate = toInteger((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);
  var year = getUTCWeekYear(dirtyDate, options);
  var firstWeek = /* @__PURE__ */ new Date(0);
  firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCWeek(firstWeek, options);
  return date;
}

// node_modules/date-fns/esm/_lib/getUTCWeek/index.js
var MILLISECONDS_IN_WEEK2 = 6048e5;
function getUTCWeek(dirtyDate, options) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfUTCWeek(date, options).getTime() - startOfUTCWeekYear(date, options).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK2) + 1;
}

// node_modules/date-fns/esm/_lib/addLeadingZeros/index.js
function addLeadingZeros(number, targetLength) {
  var sign = number < 0 ? "-" : "";
  var output = Math.abs(number).toString();
  while (output.length < targetLength) {
    output = "0" + output;
  }
  return sign + output;
}

// node_modules/date-fns/esm/_lib/format/lightFormatters/index.js
var formatters = {
  // Year
  y: function y(date, token) {
    var signedYear = date.getUTCFullYear();
    var year = signedYear > 0 ? signedYear : 1 - signedYear;
    return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
  },
  // Month
  M: function M(date, token) {
    var month = date.getUTCMonth();
    return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
  },
  // Day of the month
  d: function d(date, token) {
    return addLeadingZeros(date.getUTCDate(), token.length);
  },
  // AM or PM
  a: function a(date, token) {
    var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return dayPeriodEnumValue.toUpperCase();
      case "aaa":
        return dayPeriodEnumValue;
      case "aaaaa":
        return dayPeriodEnumValue[0];
      case "aaaa":
      default:
        return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h: function h(date, token) {
    return addLeadingZeros(date.getUTCHours() % 12 || 12, token.length);
  },
  // Hour [0-23]
  H: function H(date, token) {
    return addLeadingZeros(date.getUTCHours(), token.length);
  },
  // Minute
  m: function m(date, token) {
    return addLeadingZeros(date.getUTCMinutes(), token.length);
  },
  // Second
  s: function s(date, token) {
    return addLeadingZeros(date.getUTCSeconds(), token.length);
  },
  // Fraction of second
  S: function S(date, token) {
    var numberOfDigits = token.length;
    var milliseconds2 = date.getUTCMilliseconds();
    var fractionalSeconds = Math.floor(milliseconds2 * Math.pow(10, numberOfDigits - 3));
    return addLeadingZeros(fractionalSeconds, token.length);
  }
};
var lightFormatters_default = formatters;

// node_modules/date-fns/esm/_lib/format/formatters/index.js
var dayPeriodEnum = {
  am: "am",
  pm: "pm",
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
};
var formatters2 = {
  // Era
  G: function G(date, token, localize2) {
    var era = date.getUTCFullYear() > 0 ? 1 : 0;
    switch (token) {
      case "G":
      case "GG":
      case "GGG":
        return localize2.era(era, {
          width: "abbreviated"
        });
      case "GGGGG":
        return localize2.era(era, {
          width: "narrow"
        });
      case "GGGG":
      default:
        return localize2.era(era, {
          width: "wide"
        });
    }
  },
  // Year
  y: function y2(date, token, localize2) {
    if (token === "yo") {
      var signedYear = date.getUTCFullYear();
      var year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize2.ordinalNumber(year, {
        unit: "year"
      });
    }
    return lightFormatters_default.y(date, token);
  },
  // Local week-numbering year
  Y: function Y(date, token, localize2, options) {
    var signedWeekYear = getUTCWeekYear(date, options);
    var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
    if (token === "YY") {
      var twoDigitYear = weekYear % 100;
      return addLeadingZeros(twoDigitYear, 2);
    }
    if (token === "Yo") {
      return localize2.ordinalNumber(weekYear, {
        unit: "year"
      });
    }
    return addLeadingZeros(weekYear, token.length);
  },
  // ISO week-numbering year
  R: function R(date, token) {
    var isoWeekYear = getUTCISOWeekYear(date);
    return addLeadingZeros(isoWeekYear, token.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function u(date, token) {
    var year = date.getUTCFullYear();
    return addLeadingZeros(year, token.length);
  },
  // Quarter
  Q: function Q(date, token, localize2) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
    switch (token) {
      case "Q":
        return String(quarter);
      case "QQ":
        return addLeadingZeros(quarter, 2);
      case "Qo":
        return localize2.ordinalNumber(quarter, {
          unit: "quarter"
        });
      case "QQQ":
        return localize2.quarter(quarter, {
          width: "abbreviated",
          context: "formatting"
        });
      case "QQQQQ":
        return localize2.quarter(quarter, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQ":
      default:
        return localize2.quarter(quarter, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function q(date, token, localize2) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
    switch (token) {
      case "q":
        return String(quarter);
      case "qq":
        return addLeadingZeros(quarter, 2);
      case "qo":
        return localize2.ordinalNumber(quarter, {
          unit: "quarter"
        });
      case "qqq":
        return localize2.quarter(quarter, {
          width: "abbreviated",
          context: "standalone"
        });
      case "qqqqq":
        return localize2.quarter(quarter, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqq":
      default:
        return localize2.quarter(quarter, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function M2(date, token, localize2) {
    var month = date.getUTCMonth();
    switch (token) {
      case "M":
      case "MM":
        return lightFormatters_default.M(date, token);
      case "Mo":
        return localize2.ordinalNumber(month + 1, {
          unit: "month"
        });
      case "MMM":
        return localize2.month(month, {
          width: "abbreviated",
          context: "formatting"
        });
      case "MMMMM":
        return localize2.month(month, {
          width: "narrow",
          context: "formatting"
        });
      case "MMMM":
      default:
        return localize2.month(month, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone month
  L: function L(date, token, localize2) {
    var month = date.getUTCMonth();
    switch (token) {
      case "L":
        return String(month + 1);
      case "LL":
        return addLeadingZeros(month + 1, 2);
      case "Lo":
        return localize2.ordinalNumber(month + 1, {
          unit: "month"
        });
      case "LLL":
        return localize2.month(month, {
          width: "abbreviated",
          context: "standalone"
        });
      case "LLLLL":
        return localize2.month(month, {
          width: "narrow",
          context: "standalone"
        });
      case "LLLL":
      default:
        return localize2.month(month, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Local week of year
  w: function w(date, token, localize2, options) {
    var week = getUTCWeek(date, options);
    if (token === "wo") {
      return localize2.ordinalNumber(week, {
        unit: "week"
      });
    }
    return addLeadingZeros(week, token.length);
  },
  // ISO week of year
  I: function I(date, token, localize2) {
    var isoWeek = getUTCISOWeek(date);
    if (token === "Io") {
      return localize2.ordinalNumber(isoWeek, {
        unit: "week"
      });
    }
    return addLeadingZeros(isoWeek, token.length);
  },
  // Day of the month
  d: function d2(date, token, localize2) {
    if (token === "do") {
      return localize2.ordinalNumber(date.getUTCDate(), {
        unit: "date"
      });
    }
    return lightFormatters_default.d(date, token);
  },
  // Day of year
  D: function D(date, token, localize2) {
    var dayOfYear = getUTCDayOfYear(date);
    if (token === "Do") {
      return localize2.ordinalNumber(dayOfYear, {
        unit: "dayOfYear"
      });
    }
    return addLeadingZeros(dayOfYear, token.length);
  },
  // Day of week
  E: function E(date, token, localize2) {
    var dayOfWeek = date.getUTCDay();
    switch (token) {
      case "E":
      case "EE":
      case "EEE":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      case "EEEEE":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      case "EEEEEE":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      case "EEEE":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function e(date, token, localize2, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      case "e":
        return String(localDayOfWeek);
      case "ee":
        return addLeadingZeros(localDayOfWeek, 2);
      case "eo":
        return localize2.ordinalNumber(localDayOfWeek, {
          unit: "day"
        });
      case "eee":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      case "eeeee":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      case "eeeeee":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      case "eeee":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function c(date, token, localize2, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      case "c":
        return String(localDayOfWeek);
      case "cc":
        return addLeadingZeros(localDayOfWeek, token.length);
      case "co":
        return localize2.ordinalNumber(localDayOfWeek, {
          unit: "day"
        });
      case "ccc":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "standalone"
        });
      case "ccccc":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "standalone"
        });
      case "cccccc":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "standalone"
        });
      case "cccc":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function i(date, token, localize2) {
    var dayOfWeek = date.getUTCDay();
    var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    switch (token) {
      case "i":
        return String(isoDayOfWeek);
      case "ii":
        return addLeadingZeros(isoDayOfWeek, token.length);
      case "io":
        return localize2.ordinalNumber(isoDayOfWeek, {
          unit: "day"
        });
      case "iii":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      case "iiiii":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      case "iiiiii":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      case "iiii":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function a2(date, token, localize2) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function b(date, token, localize2) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;
    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    }
    switch (token) {
      case "b":
      case "bb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function B(date, token, localize2) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }
    switch (token) {
      case "B":
      case "BB":
      case "BBB":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function h2(date, token, localize2) {
    if (token === "ho") {
      var hours = date.getUTCHours() % 12;
      if (hours === 0)
        hours = 12;
      return localize2.ordinalNumber(hours, {
        unit: "hour"
      });
    }
    return lightFormatters_default.h(date, token);
  },
  // Hour [0-23]
  H: function H2(date, token, localize2) {
    if (token === "Ho") {
      return localize2.ordinalNumber(date.getUTCHours(), {
        unit: "hour"
      });
    }
    return lightFormatters_default.H(date, token);
  },
  // Hour [0-11]
  K: function K(date, token, localize2) {
    var hours = date.getUTCHours() % 12;
    if (token === "Ko") {
      return localize2.ordinalNumber(hours, {
        unit: "hour"
      });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Hour [1-24]
  k: function k(date, token, localize2) {
    var hours = date.getUTCHours();
    if (hours === 0)
      hours = 24;
    if (token === "ko") {
      return localize2.ordinalNumber(hours, {
        unit: "hour"
      });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Minute
  m: function m2(date, token, localize2) {
    if (token === "mo") {
      return localize2.ordinalNumber(date.getUTCMinutes(), {
        unit: "minute"
      });
    }
    return lightFormatters_default.m(date, token);
  },
  // Second
  s: function s2(date, token, localize2) {
    if (token === "so") {
      return localize2.ordinalNumber(date.getUTCSeconds(), {
        unit: "second"
      });
    }
    return lightFormatters_default.s(date, token);
  },
  // Fraction of second
  S: function S2(date, token) {
    return lightFormatters_default.S(date, token);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function X(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    if (timezoneOffset === 0) {
      return "Z";
    }
    switch (token) {
      case "X":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      case "XXXX":
      case "XX":
        return formatTimezone(timezoneOffset);
      case "XXXXX":
      case "XXX":
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function x(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      case "x":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      case "xxxx":
      case "xx":
        return formatTimezone(timezoneOffset);
      case "xxxxx":
      case "xxx":
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (GMT)
  O: function O(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      case "OOOO":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (specific non-location)
  z: function z(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      case "zzzz":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  // Seconds timestamp
  t: function t(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = Math.floor(originalDate.getTime() / 1e3);
    return addLeadingZeros(timestamp, token.length);
  },
  // Milliseconds timestamp
  T: function T(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = originalDate.getTime();
    return addLeadingZeros(timestamp, token.length);
  }
};
function formatTimezoneShort(offset, dirtyDelimiter) {
  var sign = offset > 0 ? "-" : "+";
  var absOffset = Math.abs(offset);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  var delimiter = dirtyDelimiter || "";
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}
function formatTimezoneWithOptionalMinutes(offset, dirtyDelimiter) {
  if (offset % 60 === 0) {
    var sign = offset > 0 ? "-" : "+";
    return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
  }
  return formatTimezone(offset, dirtyDelimiter);
}
function formatTimezone(offset, dirtyDelimiter) {
  var delimiter = dirtyDelimiter || "";
  var sign = offset > 0 ? "-" : "+";
  var absOffset = Math.abs(offset);
  var hours = addLeadingZeros(Math.floor(absOffset / 60), 2);
  var minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}
var formatters_default = formatters2;

// node_modules/date-fns/esm/_lib/format/longFormatters/index.js
var dateLongFormatter = function dateLongFormatter2(pattern, formatLong2) {
  switch (pattern) {
    case "P":
      return formatLong2.date({
        width: "short"
      });
    case "PP":
      return formatLong2.date({
        width: "medium"
      });
    case "PPP":
      return formatLong2.date({
        width: "long"
      });
    case "PPPP":
    default:
      return formatLong2.date({
        width: "full"
      });
  }
};
var timeLongFormatter = function timeLongFormatter2(pattern, formatLong2) {
  switch (pattern) {
    case "p":
      return formatLong2.time({
        width: "short"
      });
    case "pp":
      return formatLong2.time({
        width: "medium"
      });
    case "ppp":
      return formatLong2.time({
        width: "long"
      });
    case "pppp":
    default:
      return formatLong2.time({
        width: "full"
      });
  }
};
var dateTimeLongFormatter = function dateTimeLongFormatter2(pattern, formatLong2) {
  var matchResult = pattern.match(/(P+)(p+)?/) || [];
  var datePattern = matchResult[1];
  var timePattern = matchResult[2];
  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong2);
  }
  var dateTimeFormat;
  switch (datePattern) {
    case "P":
      dateTimeFormat = formatLong2.dateTime({
        width: "short"
      });
      break;
    case "PP":
      dateTimeFormat = formatLong2.dateTime({
        width: "medium"
      });
      break;
    case "PPP":
      dateTimeFormat = formatLong2.dateTime({
        width: "long"
      });
      break;
    case "PPPP":
    default:
      dateTimeFormat = formatLong2.dateTime({
        width: "full"
      });
      break;
  }
  return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong2)).replace("{{time}}", timeLongFormatter(timePattern, formatLong2));
};
var longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter
};
var longFormatters_default = longFormatters;

// node_modules/date-fns/esm/_lib/protectedTokens/index.js
var protectedDayOfYearTokens = ["D", "DD"];
var protectedWeekYearTokens = ["YY", "YYYY"];
function isProtectedDayOfYearToken(token) {
  return protectedDayOfYearTokens.indexOf(token) !== -1;
}
function isProtectedWeekYearToken(token) {
  return protectedWeekYearTokens.indexOf(token) !== -1;
}
function throwProtectedError(token, format2, input) {
  if (token === "YYYY") {
    throw new RangeError("Use `yyyy` instead of `YYYY` (in `".concat(format2, "`) for formatting years to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === "YY") {
    throw new RangeError("Use `yy` instead of `YY` (in `".concat(format2, "`) for formatting years to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === "D") {
    throw new RangeError("Use `d` instead of `D` (in `".concat(format2, "`) for formatting days of the month to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === "DD") {
    throw new RangeError("Use `dd` instead of `DD` (in `".concat(format2, "`) for formatting days of the month to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  }
}

// node_modules/date-fns/esm/locale/en-US/_lib/formatDistance/index.js
var formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
};
var formatDistance = function formatDistance2(token, count, options) {
  var result;
  var tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }
  if (options !== null && options !== void 0 && options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }
  return result;
};
var formatDistance_default = formatDistance;

// node_modules/date-fns/esm/locale/_lib/buildFormatLongFn/index.js
function buildFormatLongFn(args) {
  return function() {
    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var width = options.width ? String(options.width) : args.defaultWidth;
    var format2 = args.formats[width] || args.formats[args.defaultWidth];
    return format2;
  };
}

// node_modules/date-fns/esm/locale/en-US/_lib/formatLong/index.js
var dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
var timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full"
  })
};
var formatLong_default = formatLong;

// node_modules/date-fns/esm/locale/en-US/_lib/formatRelative/index.js
var formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
};
var formatRelative = function formatRelative2(token, _date, _baseDate, _options) {
  return formatRelativeLocale[token];
};
var formatRelative_default = formatRelative;

// node_modules/date-fns/esm/locale/_lib/buildLocalizeFn/index.js
function buildLocalizeFn(args) {
  return function(dirtyIndex, options) {
    var context = options !== null && options !== void 0 && options.context ? String(options.context) : "standalone";
    var valuesArray;
    if (context === "formatting" && args.formattingValues) {
      var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      var width = options !== null && options !== void 0 && options.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      var _defaultWidth = args.defaultWidth;
      var _width = options !== null && options !== void 0 && options.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[_width] || args.values[_defaultWidth];
    }
    var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
    return valuesArray[index];
  };
}

// node_modules/date-fns/esm/locale/en-US/_lib/localize/index.js
var eraValues = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
};
var quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
};
var monthValues = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};
var dayValues = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
};
var dayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
};
var formattingDayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
};
var ordinalNumber = function ordinalNumber2(dirtyNumber, _options) {
  var number = Number(dirtyNumber);
  var rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};
var localize = {
  ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: function argumentCallback(quarter) {
      return quarter - 1;
    }
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide"
  })
};
var localize_default = localize;

// node_modules/date-fns/esm/locale/_lib/buildMatchFn/index.js
function buildMatchFn(args) {
  return function(string) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var width = options.width;
    var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    var matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    var matchedString = matchResult[0];
    var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    var key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, function(pattern) {
      return pattern.test(matchedString);
    }) : findKey(parsePatterns, function(pattern) {
      return pattern.test(matchedString);
    });
    var value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value,
      rest
    };
  };
}
function findKey(object, predicate) {
  for (var key in object) {
    if (object.hasOwnProperty(key) && predicate(object[key])) {
      return key;
    }
  }
  return void 0;
}
function findIndex(array, predicate) {
  for (var key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return void 0;
}

// node_modules/date-fns/esm/locale/_lib/buildMatchPatternFn/index.js
function buildMatchPatternFn(args) {
  return function(string) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var matchResult = string.match(args.matchPattern);
    if (!matchResult)
      return null;
    var matchedString = matchResult[0];
    var parseResult = string.match(args.parsePattern);
    if (!parseResult)
      return null;
    var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value,
      rest
    };
  };
}

// node_modules/date-fns/esm/locale/en-US/_lib/match/index.js
var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern = /\d+/i;
var matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
var parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
var matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
var parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
var parseMonthPatterns = {
  narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
  any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
};
var matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
var parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
var match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: function valueCallback(value) {
      return parseInt(value, 10);
    }
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: function valueCallback2(index) {
      return index + 1;
    }
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any"
  })
};
var match_default = match;

// node_modules/date-fns/esm/locale/en-US/index.js
var locale = {
  code: "en-US",
  formatDistance: formatDistance_default,
  formatLong: formatLong_default,
  formatRelative: formatRelative_default,
  localize: localize_default,
  match: match_default,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
var en_US_default = locale;

// node_modules/date-fns/esm/_lib/defaultLocale/index.js
var defaultLocale_default = en_US_default;

// node_modules/date-fns/esm/format/index.js
var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp = /^'([^]*?)'?$/;
var doubleQuoteRegExp = /''/g;
var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
function format(dirtyDate, dirtyFormatStr, options) {
  var _ref, _options$locale, _ref2, _ref3, _ref4, _options$firstWeekCon, _options$locale2, _options$locale2$opti, _defaultOptions$local, _defaultOptions$local2, _ref5, _ref6, _ref7, _options$weekStartsOn, _options$locale3, _options$locale3$opti, _defaultOptions$local3, _defaultOptions$local4;
  requiredArgs(2, arguments);
  var formatStr = String(dirtyFormatStr);
  var defaultOptions2 = getDefaultOptions();
  var locale2 = (_ref = (_options$locale = options === null || options === void 0 ? void 0 : options.locale) !== null && _options$locale !== void 0 ? _options$locale : defaultOptions2.locale) !== null && _ref !== void 0 ? _ref : defaultLocale_default;
  var firstWeekContainsDate = toInteger((_ref2 = (_ref3 = (_ref4 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale2 = options.locale) === null || _options$locale2 === void 0 ? void 0 : (_options$locale2$opti = _options$locale2.options) === null || _options$locale2$opti === void 0 ? void 0 : _options$locale2$opti.firstWeekContainsDate) !== null && _ref4 !== void 0 ? _ref4 : defaultOptions2.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : 1);
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
  }
  var weekStartsOn = toInteger((_ref5 = (_ref6 = (_ref7 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale3 = options.locale) === null || _options$locale3 === void 0 ? void 0 : (_options$locale3$opti = _options$locale3.options) === null || _options$locale3$opti === void 0 ? void 0 : _options$locale3$opti.weekStartsOn) !== null && _ref7 !== void 0 ? _ref7 : defaultOptions2.weekStartsOn) !== null && _ref6 !== void 0 ? _ref6 : (_defaultOptions$local3 = defaultOptions2.locale) === null || _defaultOptions$local3 === void 0 ? void 0 : (_defaultOptions$local4 = _defaultOptions$local3.options) === null || _defaultOptions$local4 === void 0 ? void 0 : _defaultOptions$local4.weekStartsOn) !== null && _ref5 !== void 0 ? _ref5 : 0);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  if (!locale2.localize) {
    throw new RangeError("locale must contain localize property");
  }
  if (!locale2.formatLong) {
    throw new RangeError("locale must contain formatLong property");
  }
  var originalDate = toDate(dirtyDate);
  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }
  var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
  var utcDate = subMilliseconds(originalDate, timezoneOffset);
  var formatterOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale: locale2,
    _originalDate: originalDate
  };
  var result = formatStr.match(longFormattingTokensRegExp).map(function(substring) {
    var firstCharacter = substring[0];
    if (firstCharacter === "p" || firstCharacter === "P") {
      var longFormatter = longFormatters_default[firstCharacter];
      return longFormatter(substring, locale2.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp).map(function(substring) {
    if (substring === "''") {
      return "'";
    }
    var firstCharacter = substring[0];
    if (firstCharacter === "'") {
      return cleanEscapedString(substring);
    }
    var formatter = formatters_default[firstCharacter];
    if (formatter) {
      if (!(options !== null && options !== void 0 && options.useAdditionalWeekYearTokens) && isProtectedWeekYearToken(substring)) {
        throwProtectedError(substring, dirtyFormatStr, String(dirtyDate));
      }
      if (!(options !== null && options !== void 0 && options.useAdditionalDayOfYearTokens) && isProtectedDayOfYearToken(substring)) {
        throwProtectedError(substring, dirtyFormatStr, String(dirtyDate));
      }
      return formatter(utcDate, substring, locale2.localize, formatterOptions);
    }
    if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
      throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
    }
    return substring;
  }).join("");
  return result;
}
function cleanEscapedString(input) {
  var matched = input.match(escapedStringRegExp);
  if (!matched) {
    return input;
  }
  return matched[1].replace(doubleQuoteRegExp, "'");
}

// node_modules/date-fns/esm/_lib/assign/index.js
function assign(target, object) {
  if (target == null) {
    throw new TypeError("assign requires that input parameter not be null or undefined");
  }
  for (var property in object) {
    if (Object.prototype.hasOwnProperty.call(object, property)) {
      ;
      target[property] = object[property];
    }
  }
  return target;
}

// node_modules/date-fns/esm/formatDistanceStrict/index.js
var MILLISECONDS_IN_MINUTE = 1e3 * 60;
var MINUTES_IN_DAY = 60 * 24;
var MINUTES_IN_MONTH = MINUTES_IN_DAY * 30;
var MINUTES_IN_YEAR = MINUTES_IN_DAY * 365;

// node_modules/date-fns/esm/getISOWeek/index.js
var MILLISECONDS_IN_WEEK3 = 6048e5;
function getISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfISOWeek(date).getTime() - startOfISOWeekYear(date).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK3) + 1;
}

// node_modules/date-fns/esm/getOverlappingDaysInIntervals/index.js
var MILLISECONDS_IN_DAY2 = 24 * 60 * 60 * 1e3;

// node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i2 = 0, arr2 = new Array(len); i2 < len; i2++)
    arr2[i2] = arr[i2];
  return arr2;
}

// node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js
function _unsupportedIterableToArray(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

// node_modules/@babel/runtime/helpers/esm/createForOfIteratorHelper.js
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it)
        o = it;
      var i2 = 0;
      var F = function F2() {
      };
      return {
        s: F,
        n: function n() {
          if (i2 >= o.length)
            return {
              done: true
            };
          return {
            done: false,
            value: o[i2++]
          };
        },
        e: function e2(_e) {
          throw _e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true, didErr = false, err;
  return {
    s: function s3() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e2(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null)
          it["return"]();
      } finally {
        if (didErr)
          throw err;
      }
    }
  };
}

// node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}

// node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}

// node_modules/@babel/runtime/helpers/esm/inherits.js
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass)
    _setPrototypeOf(subClass, superClass);
}

// node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}

// node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js
function _isNativeReflectConstruct() {
  try {
    var t2 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t3) {
  }
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct2() {
    return !!t2;
  })();
}

// node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}

// node_modules/@babel/runtime/helpers/esm/createSuper.js
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}

// node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

// node_modules/@babel/runtime/helpers/esm/toPrimitive.js
function toPrimitive(t2, r) {
  if ("object" != _typeof(t2) || !t2)
    return t2;
  var e2 = t2[Symbol.toPrimitive];
  if (void 0 !== e2) {
    var i2 = e2.call(t2, r || "default");
    if ("object" != _typeof(i2))
      return i2;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t2);
}

// node_modules/@babel/runtime/helpers/esm/toPropertyKey.js
function toPropertyKey(t2) {
  var i2 = toPrimitive(t2, "string");
  return "symbol" == _typeof(i2) ? i2 : String(i2);
}

// node_modules/@babel/runtime/helpers/esm/createClass.js
function _defineProperties(target, props) {
  for (var i2 = 0; i2 < props.length; i2++) {
    var descriptor = props[i2];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

// node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(obj, key, value) {
  key = toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

// node_modules/date-fns/esm/parse/_lib/Setter.js
var TIMEZONE_UNIT_PRIORITY = 10;
var Setter = function() {
  function Setter2() {
    _classCallCheck(this, Setter2);
    _defineProperty(this, "priority", void 0);
    _defineProperty(this, "subPriority", 0);
  }
  _createClass(Setter2, [{
    key: "validate",
    value: function validate(_utcDate, _options) {
      return true;
    }
  }]);
  return Setter2;
}();
var ValueSetter = function(_Setter) {
  _inherits(ValueSetter2, _Setter);
  var _super = _createSuper(ValueSetter2);
  function ValueSetter2(value, validateValue, setValue, priority, subPriority) {
    var _this;
    _classCallCheck(this, ValueSetter2);
    _this = _super.call(this);
    _this.value = value;
    _this.validateValue = validateValue;
    _this.setValue = setValue;
    _this.priority = priority;
    if (subPriority) {
      _this.subPriority = subPriority;
    }
    return _this;
  }
  _createClass(ValueSetter2, [{
    key: "validate",
    value: function validate(utcDate, options) {
      return this.validateValue(utcDate, this.value, options);
    }
  }, {
    key: "set",
    value: function set2(utcDate, flags, options) {
      return this.setValue(utcDate, flags, this.value, options);
    }
  }]);
  return ValueSetter2;
}(Setter);
var DateToSystemTimezoneSetter = function(_Setter2) {
  _inherits(DateToSystemTimezoneSetter2, _Setter2);
  var _super2 = _createSuper(DateToSystemTimezoneSetter2);
  function DateToSystemTimezoneSetter2() {
    var _this2;
    _classCallCheck(this, DateToSystemTimezoneSetter2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this2 = _super2.call.apply(_super2, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this2), "priority", TIMEZONE_UNIT_PRIORITY);
    _defineProperty(_assertThisInitialized(_this2), "subPriority", -1);
    return _this2;
  }
  _createClass(DateToSystemTimezoneSetter2, [{
    key: "set",
    value: function set2(date, flags) {
      if (flags.timestampIsSet) {
        return date;
      }
      var convertedDate = /* @__PURE__ */ new Date(0);
      convertedDate.setFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      convertedDate.setHours(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
      return convertedDate;
    }
  }]);
  return DateToSystemTimezoneSetter2;
}(Setter);

// node_modules/date-fns/esm/parse/_lib/Parser.js
var Parser = function() {
  function Parser2() {
    _classCallCheck(this, Parser2);
    _defineProperty(this, "incompatibleTokens", void 0);
    _defineProperty(this, "priority", void 0);
    _defineProperty(this, "subPriority", void 0);
  }
  _createClass(Parser2, [{
    key: "run",
    value: function run(dateString, token, match2, options) {
      var result = this.parse(dateString, token, match2, options);
      if (!result) {
        return null;
      }
      return {
        setter: new ValueSetter(result.value, this.validate, this.set, this.priority, this.subPriority),
        rest: result.rest
      };
    }
  }, {
    key: "validate",
    value: function validate(_utcDate, _value, _options) {
      return true;
    }
  }]);
  return Parser2;
}();

// node_modules/date-fns/esm/parse/_lib/parsers/EraParser.js
var EraParser = function(_Parser) {
  _inherits(EraParser2, _Parser);
  var _super = _createSuper(EraParser2);
  function EraParser2() {
    var _this;
    _classCallCheck(this, EraParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 140);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["R", "u", "t", "T"]);
    return _this;
  }
  _createClass(EraParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "G":
        case "GG":
        case "GGG":
          return match2.era(dateString, {
            width: "abbreviated"
          }) || match2.era(dateString, {
            width: "narrow"
          });
        case "GGGGG":
          return match2.era(dateString, {
            width: "narrow"
          });
        case "GGGG":
        default:
          return match2.era(dateString, {
            width: "wide"
          }) || match2.era(dateString, {
            width: "abbreviated"
          }) || match2.era(dateString, {
            width: "narrow"
          });
      }
    }
  }, {
    key: "set",
    value: function set2(date, flags, value) {
      flags.era = value;
      date.setUTCFullYear(value, 0, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return EraParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/constants.js
var numericPatterns = {
  month: /^(1[0-2]|0?\d)/,
  // 0 to 12
  date: /^(3[0-1]|[0-2]?\d)/,
  // 0 to 31
  dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
  // 0 to 366
  week: /^(5[0-3]|[0-4]?\d)/,
  // 0 to 53
  hour23h: /^(2[0-3]|[0-1]?\d)/,
  // 0 to 23
  hour24h: /^(2[0-4]|[0-1]?\d)/,
  // 0 to 24
  hour11h: /^(1[0-1]|0?\d)/,
  // 0 to 11
  hour12h: /^(1[0-2]|0?\d)/,
  // 0 to 12
  minute: /^[0-5]?\d/,
  // 0 to 59
  second: /^[0-5]?\d/,
  // 0 to 59
  singleDigit: /^\d/,
  // 0 to 9
  twoDigits: /^\d{1,2}/,
  // 0 to 99
  threeDigits: /^\d{1,3}/,
  // 0 to 999
  fourDigits: /^\d{1,4}/,
  // 0 to 9999
  anyDigitsSigned: /^-?\d+/,
  singleDigitSigned: /^-?\d/,
  // 0 to 9, -0 to -9
  twoDigitsSigned: /^-?\d{1,2}/,
  // 0 to 99, -0 to -99
  threeDigitsSigned: /^-?\d{1,3}/,
  // 0 to 999, -0 to -999
  fourDigitsSigned: /^-?\d{1,4}/
  // 0 to 9999, -0 to -9999
};
var timezonePatterns = {
  basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
  basic: /^([+-])(\d{2})(\d{2})|Z/,
  basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
  extended: /^([+-])(\d{2}):(\d{2})|Z/,
  extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
};

// node_modules/date-fns/esm/parse/_lib/utils.js
function mapValue(parseFnResult, mapFn) {
  if (!parseFnResult) {
    return parseFnResult;
  }
  return {
    value: mapFn(parseFnResult.value),
    rest: parseFnResult.rest
  };
}
function parseNumericPattern(pattern, dateString) {
  var matchResult = dateString.match(pattern);
  if (!matchResult) {
    return null;
  }
  return {
    value: parseInt(matchResult[0], 10),
    rest: dateString.slice(matchResult[0].length)
  };
}
function parseTimezonePattern(pattern, dateString) {
  var matchResult = dateString.match(pattern);
  if (!matchResult) {
    return null;
  }
  if (matchResult[0] === "Z") {
    return {
      value: 0,
      rest: dateString.slice(1)
    };
  }
  var sign = matchResult[1] === "+" ? 1 : -1;
  var hours = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
  var minutes = matchResult[3] ? parseInt(matchResult[3], 10) : 0;
  var seconds = matchResult[5] ? parseInt(matchResult[5], 10) : 0;
  return {
    value: sign * (hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * millisecondsInSecond),
    rest: dateString.slice(matchResult[0].length)
  };
}
function parseAnyDigitsSigned(dateString) {
  return parseNumericPattern(numericPatterns.anyDigitsSigned, dateString);
}
function parseNDigits(n, dateString) {
  switch (n) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigit, dateString);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigits, dateString);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigits, dateString);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigits, dateString);
    default:
      return parseNumericPattern(new RegExp("^\\d{1," + n + "}"), dateString);
  }
}
function parseNDigitsSigned(n, dateString) {
  switch (n) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigitSigned, dateString);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigitsSigned, dateString);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigitsSigned, dateString);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigitsSigned, dateString);
    default:
      return parseNumericPattern(new RegExp("^-?\\d{1," + n + "}"), dateString);
  }
}
function dayPeriodEnumToHours(dayPeriod) {
  switch (dayPeriod) {
    case "morning":
      return 4;
    case "evening":
      return 17;
    case "pm":
    case "noon":
    case "afternoon":
      return 12;
    case "am":
    case "midnight":
    case "night":
    default:
      return 0;
  }
}
function normalizeTwoDigitYear(twoDigitYear, currentYear) {
  var isCommonEra = currentYear > 0;
  var absCurrentYear = isCommonEra ? currentYear : 1 - currentYear;
  var result;
  if (absCurrentYear <= 50) {
    result = twoDigitYear || 100;
  } else {
    var rangeEnd = absCurrentYear + 50;
    var rangeEndCentury = Math.floor(rangeEnd / 100) * 100;
    var isPreviousCentury = twoDigitYear >= rangeEnd % 100;
    result = twoDigitYear + rangeEndCentury - (isPreviousCentury ? 100 : 0);
  }
  return isCommonEra ? result : 1 - result;
}
function isLeapYearIndex(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}

// node_modules/date-fns/esm/parse/_lib/parsers/YearParser.js
var YearParser = function(_Parser) {
  _inherits(YearParser2, _Parser);
  var _super = _createSuper(YearParser2);
  function YearParser2() {
    var _this;
    _classCallCheck(this, YearParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 130);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "u", "w", "I", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(YearParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      var valueCallback3 = function valueCallback4(year) {
        return {
          year,
          isTwoDigitYear: token === "yy"
        };
      };
      switch (token) {
        case "y":
          return mapValue(parseNDigits(4, dateString), valueCallback3);
        case "yo":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "year"
          }), valueCallback3);
        default:
          return mapValue(parseNDigits(token.length, dateString), valueCallback3);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value.isTwoDigitYear || value.year > 0;
    }
  }, {
    key: "set",
    value: function set2(date, flags, value) {
      var currentYear = date.getUTCFullYear();
      if (value.isTwoDigitYear) {
        var normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
        date.setUTCFullYear(normalizedTwoDigitYear, 0, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      }
      var year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
      date.setUTCFullYear(year, 0, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return YearParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/LocalWeekYearParser.js
var LocalWeekYearParser = function(_Parser) {
  _inherits(LocalWeekYearParser2, _Parser);
  var _super = _createSuper(LocalWeekYearParser2);
  function LocalWeekYearParser2() {
    var _this;
    _classCallCheck(this, LocalWeekYearParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 130);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "R", "u", "Q", "q", "M", "L", "I", "d", "D", "i", "t", "T"]);
    return _this;
  }
  _createClass(LocalWeekYearParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      var valueCallback3 = function valueCallback4(year) {
        return {
          year,
          isTwoDigitYear: token === "YY"
        };
      };
      switch (token) {
        case "Y":
          return mapValue(parseNDigits(4, dateString), valueCallback3);
        case "Yo":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "year"
          }), valueCallback3);
        default:
          return mapValue(parseNDigits(token.length, dateString), valueCallback3);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value.isTwoDigitYear || value.year > 0;
    }
  }, {
    key: "set",
    value: function set2(date, flags, value, options) {
      var currentYear = getUTCWeekYear(date, options);
      if (value.isTwoDigitYear) {
        var normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
        date.setUTCFullYear(normalizedTwoDigitYear, 0, options.firstWeekContainsDate);
        date.setUTCHours(0, 0, 0, 0);
        return startOfUTCWeek(date, options);
      }
      var year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
      date.setUTCFullYear(year, 0, options.firstWeekContainsDate);
      date.setUTCHours(0, 0, 0, 0);
      return startOfUTCWeek(date, options);
    }
  }]);
  return LocalWeekYearParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/ISOWeekYearParser.js
var ISOWeekYearParser = function(_Parser) {
  _inherits(ISOWeekYearParser2, _Parser);
  var _super = _createSuper(ISOWeekYearParser2);
  function ISOWeekYearParser2() {
    var _this;
    _classCallCheck(this, ISOWeekYearParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 130);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["G", "y", "Y", "u", "Q", "q", "M", "L", "w", "d", "D", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(ISOWeekYearParser2, [{
    key: "parse",
    value: function parse2(dateString, token) {
      if (token === "R") {
        return parseNDigitsSigned(4, dateString);
      }
      return parseNDigitsSigned(token.length, dateString);
    }
  }, {
    key: "set",
    value: function set2(_date, _flags, value) {
      var firstWeekOfYear = /* @__PURE__ */ new Date(0);
      firstWeekOfYear.setUTCFullYear(value, 0, 4);
      firstWeekOfYear.setUTCHours(0, 0, 0, 0);
      return startOfUTCISOWeek(firstWeekOfYear);
    }
  }]);
  return ISOWeekYearParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/ExtendedYearParser.js
var ExtendedYearParser = function(_Parser) {
  _inherits(ExtendedYearParser2, _Parser);
  var _super = _createSuper(ExtendedYearParser2);
  function ExtendedYearParser2() {
    var _this;
    _classCallCheck(this, ExtendedYearParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 130);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["G", "y", "Y", "R", "w", "I", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(ExtendedYearParser2, [{
    key: "parse",
    value: function parse2(dateString, token) {
      if (token === "u") {
        return parseNDigitsSigned(4, dateString);
      }
      return parseNDigitsSigned(token.length, dateString);
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCFullYear(value, 0, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return ExtendedYearParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/QuarterParser.js
var QuarterParser = function(_Parser) {
  _inherits(QuarterParser2, _Parser);
  var _super = _createSuper(QuarterParser2);
  function QuarterParser2() {
    var _this;
    _classCallCheck(this, QuarterParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 120);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "q", "M", "L", "w", "I", "d", "D", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(QuarterParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "Q":
        case "QQ":
          return parseNDigits(token.length, dateString);
        case "Qo":
          return match2.ordinalNumber(dateString, {
            unit: "quarter"
          });
        case "QQQ":
          return match2.quarter(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.quarter(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "QQQQQ":
          return match2.quarter(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "QQQQ":
        default:
          return match2.quarter(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.quarter(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.quarter(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 4;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCMonth((value - 1) * 3, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return QuarterParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/StandAloneQuarterParser.js
var StandAloneQuarterParser = function(_Parser) {
  _inherits(StandAloneQuarterParser2, _Parser);
  var _super = _createSuper(StandAloneQuarterParser2);
  function StandAloneQuarterParser2() {
    var _this;
    _classCallCheck(this, StandAloneQuarterParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 120);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "Q", "M", "L", "w", "I", "d", "D", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(StandAloneQuarterParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "q":
        case "qq":
          return parseNDigits(token.length, dateString);
        case "qo":
          return match2.ordinalNumber(dateString, {
            unit: "quarter"
          });
        case "qqq":
          return match2.quarter(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.quarter(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "qqqqq":
          return match2.quarter(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "qqqq":
        default:
          return match2.quarter(dateString, {
            width: "wide",
            context: "standalone"
          }) || match2.quarter(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.quarter(dateString, {
            width: "narrow",
            context: "standalone"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 4;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCMonth((value - 1) * 3, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return StandAloneQuarterParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/MonthParser.js
var MonthParser = function(_Parser) {
  _inherits(MonthParser2, _Parser);
  var _super = _createSuper(MonthParser2);
  function MonthParser2() {
    var _this;
    _classCallCheck(this, MonthParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "q", "Q", "L", "w", "I", "D", "i", "e", "c", "t", "T"]);
    _defineProperty(_assertThisInitialized(_this), "priority", 110);
    return _this;
  }
  _createClass(MonthParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      var valueCallback3 = function valueCallback4(value) {
        return value - 1;
      };
      switch (token) {
        case "M":
          return mapValue(parseNumericPattern(numericPatterns.month, dateString), valueCallback3);
        case "MM":
          return mapValue(parseNDigits(2, dateString), valueCallback3);
        case "Mo":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "month"
          }), valueCallback3);
        case "MMM":
          return match2.month(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.month(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "MMMMM":
          return match2.month(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "MMMM":
        default:
          return match2.month(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.month(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.month(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 11;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCMonth(value, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return MonthParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/StandAloneMonthParser.js
var StandAloneMonthParser = function(_Parser) {
  _inherits(StandAloneMonthParser2, _Parser);
  var _super = _createSuper(StandAloneMonthParser2);
  function StandAloneMonthParser2() {
    var _this;
    _classCallCheck(this, StandAloneMonthParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 110);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "q", "Q", "M", "w", "I", "D", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(StandAloneMonthParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      var valueCallback3 = function valueCallback4(value) {
        return value - 1;
      };
      switch (token) {
        case "L":
          return mapValue(parseNumericPattern(numericPatterns.month, dateString), valueCallback3);
        case "LL":
          return mapValue(parseNDigits(2, dateString), valueCallback3);
        case "Lo":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "month"
          }), valueCallback3);
        case "LLL":
          return match2.month(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.month(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "LLLLL":
          return match2.month(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "LLLL":
        default:
          return match2.month(dateString, {
            width: "wide",
            context: "standalone"
          }) || match2.month(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.month(dateString, {
            width: "narrow",
            context: "standalone"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 11;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCMonth(value, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return StandAloneMonthParser2;
}(Parser);

// node_modules/date-fns/esm/_lib/setUTCWeek/index.js
function setUTCWeek(dirtyDate, dirtyWeek, options) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var week = toInteger(dirtyWeek);
  var diff = getUTCWeek(date, options) - week;
  date.setUTCDate(date.getUTCDate() - diff * 7);
  return date;
}

// node_modules/date-fns/esm/parse/_lib/parsers/LocalWeekParser.js
var LocalWeekParser = function(_Parser) {
  _inherits(LocalWeekParser2, _Parser);
  var _super = _createSuper(LocalWeekParser2);
  function LocalWeekParser2() {
    var _this;
    _classCallCheck(this, LocalWeekParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 100);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "i", "t", "T"]);
    return _this;
  }
  _createClass(LocalWeekParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "w":
          return parseNumericPattern(numericPatterns.week, dateString);
        case "wo":
          return match2.ordinalNumber(dateString, {
            unit: "week"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 53;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value, options) {
      return startOfUTCWeek(setUTCWeek(date, value, options), options);
    }
  }]);
  return LocalWeekParser2;
}(Parser);

// node_modules/date-fns/esm/_lib/setUTCISOWeek/index.js
function setUTCISOWeek(dirtyDate, dirtyISOWeek) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var isoWeek = toInteger(dirtyISOWeek);
  var diff = getUTCISOWeek(date) - isoWeek;
  date.setUTCDate(date.getUTCDate() - diff * 7);
  return date;
}

// node_modules/date-fns/esm/parse/_lib/parsers/ISOWeekParser.js
var ISOWeekParser = function(_Parser) {
  _inherits(ISOWeekParser2, _Parser);
  var _super = _createSuper(ISOWeekParser2);
  function ISOWeekParser2() {
    var _this;
    _classCallCheck(this, ISOWeekParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 100);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "Y", "u", "q", "Q", "M", "L", "w", "d", "D", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(ISOWeekParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "I":
          return parseNumericPattern(numericPatterns.week, dateString);
        case "Io":
          return match2.ordinalNumber(dateString, {
            unit: "week"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 53;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      return startOfUTCISOWeek(setUTCISOWeek(date, value));
    }
  }]);
  return ISOWeekParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/DateParser.js
var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var DAYS_IN_MONTH_LEAP_YEAR = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var DateParser = function(_Parser) {
  _inherits(DateParser2, _Parser);
  var _super = _createSuper(DateParser2);
  function DateParser2() {
    var _this;
    _classCallCheck(this, DateParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "subPriority", 1);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "q", "Q", "w", "I", "D", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(DateParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "d":
          return parseNumericPattern(numericPatterns.date, dateString);
        case "do":
          return match2.ordinalNumber(dateString, {
            unit: "date"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(date, value) {
      var year = date.getUTCFullYear();
      var isLeapYear2 = isLeapYearIndex(year);
      var month = date.getUTCMonth();
      if (isLeapYear2) {
        return value >= 1 && value <= DAYS_IN_MONTH_LEAP_YEAR[month];
      } else {
        return value >= 1 && value <= DAYS_IN_MONTH[month];
      }
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCDate(value);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return DateParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/DayOfYearParser.js
var DayOfYearParser = function(_Parser) {
  _inherits(DayOfYearParser2, _Parser);
  var _super = _createSuper(DayOfYearParser2);
  function DayOfYearParser2() {
    var _this;
    _classCallCheck(this, DayOfYearParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "subpriority", 1);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "q", "Q", "M", "L", "w", "I", "d", "E", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(DayOfYearParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "D":
        case "DD":
          return parseNumericPattern(numericPatterns.dayOfYear, dateString);
        case "Do":
          return match2.ordinalNumber(dateString, {
            unit: "date"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(date, value) {
      var year = date.getUTCFullYear();
      var isLeapYear2 = isLeapYearIndex(year);
      if (isLeapYear2) {
        return value >= 1 && value <= 366;
      } else {
        return value >= 1 && value <= 365;
      }
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCMonth(0, value);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return DayOfYearParser2;
}(Parser);

// node_modules/date-fns/esm/_lib/setUTCDay/index.js
function setUTCDay(dirtyDate, dirtyDay, options) {
  var _ref, _ref2, _ref3, _options$weekStartsOn, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(2, arguments);
  var defaultOptions2 = getDefaultOptions();
  var weekStartsOn = toInteger((_ref = (_ref2 = (_ref3 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.weekStartsOn) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.weekStartsOn) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.weekStartsOn) !== null && _ref !== void 0 ? _ref : 0);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  var date = toDate(dirtyDate);
  var day = toInteger(dirtyDay);
  var currentDay = date.getUTCDay();
  var remainder = day % 7;
  var dayIndex = (remainder + 7) % 7;
  var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}

// node_modules/date-fns/esm/parse/_lib/parsers/DayParser.js
var DayParser = function(_Parser) {
  _inherits(DayParser2, _Parser);
  var _super = _createSuper(DayParser2);
  function DayParser2() {
    var _this;
    _classCallCheck(this, DayParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["D", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(DayParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "E":
        case "EE":
        case "EEE":
          return match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "EEEEE":
          return match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "EEEEEE":
          return match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "EEEE":
        default:
          return match2.day(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 6;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value, options) {
      date = setUTCDay(date, value, options);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return DayParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/LocalDayParser.js
var LocalDayParser = function(_Parser) {
  _inherits(LocalDayParser2, _Parser);
  var _super = _createSuper(LocalDayParser2);
  function LocalDayParser2() {
    var _this;
    _classCallCheck(this, LocalDayParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "E", "i", "c", "t", "T"]);
    return _this;
  }
  _createClass(LocalDayParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2, options) {
      var valueCallback3 = function valueCallback4(value) {
        var wholeWeekDays = Math.floor((value - 1) / 7) * 7;
        return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
      };
      switch (token) {
        case "e":
        case "ee":
          return mapValue(parseNDigits(token.length, dateString), valueCallback3);
        case "eo":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "day"
          }), valueCallback3);
        case "eee":
          return match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "eeeee":
          return match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "eeeeee":
          return match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "eeee":
        default:
          return match2.day(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 6;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value, options) {
      date = setUTCDay(date, value, options);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return LocalDayParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/StandAloneLocalDayParser.js
var StandAloneLocalDayParser = function(_Parser) {
  _inherits(StandAloneLocalDayParser2, _Parser);
  var _super = _createSuper(StandAloneLocalDayParser2);
  function StandAloneLocalDayParser2() {
    var _this;
    _classCallCheck(this, StandAloneLocalDayParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "E", "i", "e", "t", "T"]);
    return _this;
  }
  _createClass(StandAloneLocalDayParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2, options) {
      var valueCallback3 = function valueCallback4(value) {
        var wholeWeekDays = Math.floor((value - 1) / 7) * 7;
        return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
      };
      switch (token) {
        case "c":
        case "cc":
          return mapValue(parseNDigits(token.length, dateString), valueCallback3);
        case "co":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "day"
          }), valueCallback3);
        case "ccc":
          return match2.day(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "short",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "ccccc":
          return match2.day(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "cccccc":
          return match2.day(dateString, {
            width: "short",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "cccc":
        default:
          return match2.day(dateString, {
            width: "wide",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "short",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "standalone"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 6;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value, options) {
      date = setUTCDay(date, value, options);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return StandAloneLocalDayParser2;
}(Parser);

// node_modules/date-fns/esm/_lib/setUTCISODay/index.js
function setUTCISODay(dirtyDate, dirtyDay) {
  requiredArgs(2, arguments);
  var day = toInteger(dirtyDay);
  if (day % 7 === 0) {
    day = day - 7;
  }
  var weekStartsOn = 1;
  var date = toDate(dirtyDate);
  var currentDay = date.getUTCDay();
  var remainder = day % 7;
  var dayIndex = (remainder + 7) % 7;
  var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}

// node_modules/date-fns/esm/parse/_lib/parsers/ISODayParser.js
var ISODayParser = function(_Parser) {
  _inherits(ISODayParser2, _Parser);
  var _super = _createSuper(ISODayParser2);
  function ISODayParser2() {
    var _this;
    _classCallCheck(this, ISODayParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "Y", "u", "q", "Q", "M", "L", "w", "d", "D", "E", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(ISODayParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      var valueCallback3 = function valueCallback4(value) {
        if (value === 0) {
          return 7;
        }
        return value;
      };
      switch (token) {
        case "i":
        case "ii":
          return parseNDigits(token.length, dateString);
        case "io":
          return match2.ordinalNumber(dateString, {
            unit: "day"
          });
        case "iii":
          return mapValue(match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }), valueCallback3);
        case "iiiii":
          return mapValue(match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }), valueCallback3);
        case "iiiiii":
          return mapValue(match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }), valueCallback3);
        case "iiii":
        default:
          return mapValue(match2.day(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }), valueCallback3);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 7;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date = setUTCISODay(date, value);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return ISODayParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/AMPMParser.js
var AMPMParser = function(_Parser) {
  _inherits(AMPMParser2, _Parser);
  var _super = _createSuper(AMPMParser2);
  function AMPMParser2() {
    var _this;
    _classCallCheck(this, AMPMParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 80);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["b", "B", "H", "k", "t", "T"]);
    return _this;
  }
  _createClass(AMPMParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "a":
        case "aa":
        case "aaa":
          return match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "aaaaa":
          return match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "aaaa":
        default:
          return match2.dayPeriod(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    }
  }]);
  return AMPMParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/AMPMMidnightParser.js
var AMPMMidnightParser = function(_Parser) {
  _inherits(AMPMMidnightParser2, _Parser);
  var _super = _createSuper(AMPMMidnightParser2);
  function AMPMMidnightParser2() {
    var _this;
    _classCallCheck(this, AMPMMidnightParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 80);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["a", "B", "H", "k", "t", "T"]);
    return _this;
  }
  _createClass(AMPMMidnightParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "b":
        case "bb":
        case "bbb":
          return match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "bbbbb":
          return match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "bbbb":
        default:
          return match2.dayPeriod(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    }
  }]);
  return AMPMMidnightParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/DayPeriodParser.js
var DayPeriodParser = function(_Parser) {
  _inherits(DayPeriodParser2, _Parser);
  var _super = _createSuper(DayPeriodParser2);
  function DayPeriodParser2() {
    var _this;
    _classCallCheck(this, DayPeriodParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 80);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["a", "b", "t", "T"]);
    return _this;
  }
  _createClass(DayPeriodParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "B":
        case "BB":
        case "BBB":
          return match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "BBBBB":
          return match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "BBBB":
        default:
          return match2.dayPeriod(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    }
  }]);
  return DayPeriodParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/Hour1to12Parser.js
var Hour1to12Parser = function(_Parser) {
  _inherits(Hour1to12Parser2, _Parser);
  var _super = _createSuper(Hour1to12Parser2);
  function Hour1to12Parser2() {
    var _this;
    _classCallCheck(this, Hour1to12Parser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 70);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["H", "K", "k", "t", "T"]);
    return _this;
  }
  _createClass(Hour1to12Parser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "h":
          return parseNumericPattern(numericPatterns.hour12h, dateString);
        case "ho":
          return match2.ordinalNumber(dateString, {
            unit: "hour"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 12;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      var isPM = date.getUTCHours() >= 12;
      if (isPM && value < 12) {
        date.setUTCHours(value + 12, 0, 0, 0);
      } else if (!isPM && value === 12) {
        date.setUTCHours(0, 0, 0, 0);
      } else {
        date.setUTCHours(value, 0, 0, 0);
      }
      return date;
    }
  }]);
  return Hour1to12Parser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/Hour0to23Parser.js
var Hour0to23Parser = function(_Parser) {
  _inherits(Hour0to23Parser2, _Parser);
  var _super = _createSuper(Hour0to23Parser2);
  function Hour0to23Parser2() {
    var _this;
    _classCallCheck(this, Hour0to23Parser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 70);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["a", "b", "h", "K", "k", "t", "T"]);
    return _this;
  }
  _createClass(Hour0to23Parser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "H":
          return parseNumericPattern(numericPatterns.hour23h, dateString);
        case "Ho":
          return match2.ordinalNumber(dateString, {
            unit: "hour"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 23;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCHours(value, 0, 0, 0);
      return date;
    }
  }]);
  return Hour0to23Parser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/Hour0To11Parser.js
var Hour0To11Parser = function(_Parser) {
  _inherits(Hour0To11Parser2, _Parser);
  var _super = _createSuper(Hour0To11Parser2);
  function Hour0To11Parser2() {
    var _this;
    _classCallCheck(this, Hour0To11Parser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 70);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["h", "H", "k", "t", "T"]);
    return _this;
  }
  _createClass(Hour0To11Parser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "K":
          return parseNumericPattern(numericPatterns.hour11h, dateString);
        case "Ko":
          return match2.ordinalNumber(dateString, {
            unit: "hour"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 11;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      var isPM = date.getUTCHours() >= 12;
      if (isPM && value < 12) {
        date.setUTCHours(value + 12, 0, 0, 0);
      } else {
        date.setUTCHours(value, 0, 0, 0);
      }
      return date;
    }
  }]);
  return Hour0To11Parser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/Hour1To24Parser.js
var Hour1To24Parser = function(_Parser) {
  _inherits(Hour1To24Parser2, _Parser);
  var _super = _createSuper(Hour1To24Parser2);
  function Hour1To24Parser2() {
    var _this;
    _classCallCheck(this, Hour1To24Parser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 70);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["a", "b", "h", "H", "K", "t", "T"]);
    return _this;
  }
  _createClass(Hour1To24Parser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "k":
          return parseNumericPattern(numericPatterns.hour24h, dateString);
        case "ko":
          return match2.ordinalNumber(dateString, {
            unit: "hour"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 24;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      var hours = value <= 24 ? value % 24 : value;
      date.setUTCHours(hours, 0, 0, 0);
      return date;
    }
  }]);
  return Hour1To24Parser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/MinuteParser.js
var MinuteParser = function(_Parser) {
  _inherits(MinuteParser2, _Parser);
  var _super = _createSuper(MinuteParser2);
  function MinuteParser2() {
    var _this;
    _classCallCheck(this, MinuteParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 60);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["t", "T"]);
    return _this;
  }
  _createClass(MinuteParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "m":
          return parseNumericPattern(numericPatterns.minute, dateString);
        case "mo":
          return match2.ordinalNumber(dateString, {
            unit: "minute"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 59;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCMinutes(value, 0, 0);
      return date;
    }
  }]);
  return MinuteParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/SecondParser.js
var SecondParser = function(_Parser) {
  _inherits(SecondParser2, _Parser);
  var _super = _createSuper(SecondParser2);
  function SecondParser2() {
    var _this;
    _classCallCheck(this, SecondParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 50);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["t", "T"]);
    return _this;
  }
  _createClass(SecondParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "s":
          return parseNumericPattern(numericPatterns.second, dateString);
        case "so":
          return match2.ordinalNumber(dateString, {
            unit: "second"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 59;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCSeconds(value, 0);
      return date;
    }
  }]);
  return SecondParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/FractionOfSecondParser.js
var FractionOfSecondParser = function(_Parser) {
  _inherits(FractionOfSecondParser2, _Parser);
  var _super = _createSuper(FractionOfSecondParser2);
  function FractionOfSecondParser2() {
    var _this;
    _classCallCheck(this, FractionOfSecondParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 30);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["t", "T"]);
    return _this;
  }
  _createClass(FractionOfSecondParser2, [{
    key: "parse",
    value: function parse2(dateString, token) {
      var valueCallback3 = function valueCallback4(value) {
        return Math.floor(value * Math.pow(10, -token.length + 3));
      };
      return mapValue(parseNDigits(token.length, dateString), valueCallback3);
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCMilliseconds(value);
      return date;
    }
  }]);
  return FractionOfSecondParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/ISOTimezoneWithZParser.js
var ISOTimezoneWithZParser = function(_Parser) {
  _inherits(ISOTimezoneWithZParser2, _Parser);
  var _super = _createSuper(ISOTimezoneWithZParser2);
  function ISOTimezoneWithZParser2() {
    var _this;
    _classCallCheck(this, ISOTimezoneWithZParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 10);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["t", "T", "x"]);
    return _this;
  }
  _createClass(ISOTimezoneWithZParser2, [{
    key: "parse",
    value: function parse2(dateString, token) {
      switch (token) {
        case "X":
          return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, dateString);
        case "XX":
          return parseTimezonePattern(timezonePatterns.basic, dateString);
        case "XXXX":
          return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, dateString);
        case "XXXXX":
          return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, dateString);
        case "XXX":
        default:
          return parseTimezonePattern(timezonePatterns.extended, dateString);
      }
    }
  }, {
    key: "set",
    value: function set2(date, flags, value) {
      if (flags.timestampIsSet) {
        return date;
      }
      return new Date(date.getTime() - value);
    }
  }]);
  return ISOTimezoneWithZParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/ISOTimezoneParser.js
var ISOTimezoneParser = function(_Parser) {
  _inherits(ISOTimezoneParser2, _Parser);
  var _super = _createSuper(ISOTimezoneParser2);
  function ISOTimezoneParser2() {
    var _this;
    _classCallCheck(this, ISOTimezoneParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 10);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["t", "T", "X"]);
    return _this;
  }
  _createClass(ISOTimezoneParser2, [{
    key: "parse",
    value: function parse2(dateString, token) {
      switch (token) {
        case "x":
          return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, dateString);
        case "xx":
          return parseTimezonePattern(timezonePatterns.basic, dateString);
        case "xxxx":
          return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, dateString);
        case "xxxxx":
          return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, dateString);
        case "xxx":
        default:
          return parseTimezonePattern(timezonePatterns.extended, dateString);
      }
    }
  }, {
    key: "set",
    value: function set2(date, flags, value) {
      if (flags.timestampIsSet) {
        return date;
      }
      return new Date(date.getTime() - value);
    }
  }]);
  return ISOTimezoneParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/TimestampSecondsParser.js
var TimestampSecondsParser = function(_Parser) {
  _inherits(TimestampSecondsParser2, _Parser);
  var _super = _createSuper(TimestampSecondsParser2);
  function TimestampSecondsParser2() {
    var _this;
    _classCallCheck(this, TimestampSecondsParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 40);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", "*");
    return _this;
  }
  _createClass(TimestampSecondsParser2, [{
    key: "parse",
    value: function parse2(dateString) {
      return parseAnyDigitsSigned(dateString);
    }
  }, {
    key: "set",
    value: function set2(_date, _flags, value) {
      return [new Date(value * 1e3), {
        timestampIsSet: true
      }];
    }
  }]);
  return TimestampSecondsParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/TimestampMillisecondsParser.js
var TimestampMillisecondsParser = function(_Parser) {
  _inherits(TimestampMillisecondsParser2, _Parser);
  var _super = _createSuper(TimestampMillisecondsParser2);
  function TimestampMillisecondsParser2() {
    var _this;
    _classCallCheck(this, TimestampMillisecondsParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 20);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", "*");
    return _this;
  }
  _createClass(TimestampMillisecondsParser2, [{
    key: "parse",
    value: function parse2(dateString) {
      return parseAnyDigitsSigned(dateString);
    }
  }, {
    key: "set",
    value: function set2(_date, _flags, value) {
      return [new Date(value), {
        timestampIsSet: true
      }];
    }
  }]);
  return TimestampMillisecondsParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/index.js
var parsers = {
  G: new EraParser(),
  y: new YearParser(),
  Y: new LocalWeekYearParser(),
  R: new ISOWeekYearParser(),
  u: new ExtendedYearParser(),
  Q: new QuarterParser(),
  q: new StandAloneQuarterParser(),
  M: new MonthParser(),
  L: new StandAloneMonthParser(),
  w: new LocalWeekParser(),
  I: new ISOWeekParser(),
  d: new DateParser(),
  D: new DayOfYearParser(),
  E: new DayParser(),
  e: new LocalDayParser(),
  c: new StandAloneLocalDayParser(),
  i: new ISODayParser(),
  a: new AMPMParser(),
  b: new AMPMMidnightParser(),
  B: new DayPeriodParser(),
  h: new Hour1to12Parser(),
  H: new Hour0to23Parser(),
  K: new Hour0To11Parser(),
  k: new Hour1To24Parser(),
  m: new MinuteParser(),
  s: new SecondParser(),
  S: new FractionOfSecondParser(),
  X: new ISOTimezoneWithZParser(),
  x: new ISOTimezoneParser(),
  t: new TimestampSecondsParser(),
  T: new TimestampMillisecondsParser()
};

// node_modules/date-fns/esm/parse/index.js
var formattingTokensRegExp2 = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp2 = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp2 = /^'([^]*?)'?$/;
var doubleQuoteRegExp2 = /''/g;
var notWhitespaceRegExp = /\S/;
var unescapedLatinCharacterRegExp2 = /[a-zA-Z]/;
function parse(dirtyDateString, dirtyFormatString, dirtyReferenceDate, options) {
  var _ref, _options$locale, _ref2, _ref3, _ref4, _options$firstWeekCon, _options$locale2, _options$locale2$opti, _defaultOptions$local, _defaultOptions$local2, _ref5, _ref6, _ref7, _options$weekStartsOn, _options$locale3, _options$locale3$opti, _defaultOptions$local3, _defaultOptions$local4;
  requiredArgs(3, arguments);
  var dateString = String(dirtyDateString);
  var formatString = String(dirtyFormatString);
  var defaultOptions2 = getDefaultOptions();
  var locale2 = (_ref = (_options$locale = options === null || options === void 0 ? void 0 : options.locale) !== null && _options$locale !== void 0 ? _options$locale : defaultOptions2.locale) !== null && _ref !== void 0 ? _ref : defaultLocale_default;
  if (!locale2.match) {
    throw new RangeError("locale must contain match property");
  }
  var firstWeekContainsDate = toInteger((_ref2 = (_ref3 = (_ref4 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale2 = options.locale) === null || _options$locale2 === void 0 ? void 0 : (_options$locale2$opti = _options$locale2.options) === null || _options$locale2$opti === void 0 ? void 0 : _options$locale2$opti.firstWeekContainsDate) !== null && _ref4 !== void 0 ? _ref4 : defaultOptions2.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : 1);
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
  }
  var weekStartsOn = toInteger((_ref5 = (_ref6 = (_ref7 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale3 = options.locale) === null || _options$locale3 === void 0 ? void 0 : (_options$locale3$opti = _options$locale3.options) === null || _options$locale3$opti === void 0 ? void 0 : _options$locale3$opti.weekStartsOn) !== null && _ref7 !== void 0 ? _ref7 : defaultOptions2.weekStartsOn) !== null && _ref6 !== void 0 ? _ref6 : (_defaultOptions$local3 = defaultOptions2.locale) === null || _defaultOptions$local3 === void 0 ? void 0 : (_defaultOptions$local4 = _defaultOptions$local3.options) === null || _defaultOptions$local4 === void 0 ? void 0 : _defaultOptions$local4.weekStartsOn) !== null && _ref5 !== void 0 ? _ref5 : 0);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  if (formatString === "") {
    if (dateString === "") {
      return toDate(dirtyReferenceDate);
    } else {
      return /* @__PURE__ */ new Date(NaN);
    }
  }
  var subFnOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale: locale2
  };
  var setters = [new DateToSystemTimezoneSetter()];
  var tokens = formatString.match(longFormattingTokensRegExp2).map(function(substring) {
    var firstCharacter = substring[0];
    if (firstCharacter in longFormatters_default) {
      var longFormatter = longFormatters_default[firstCharacter];
      return longFormatter(substring, locale2.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp2);
  var usedTokens = [];
  var _iterator = _createForOfIteratorHelper(tokens), _step;
  try {
    var _loop = function _loop2() {
      var token = _step.value;
      if (!(options !== null && options !== void 0 && options.useAdditionalWeekYearTokens) && isProtectedWeekYearToken(token)) {
        throwProtectedError(token, formatString, dirtyDateString);
      }
      if (!(options !== null && options !== void 0 && options.useAdditionalDayOfYearTokens) && isProtectedDayOfYearToken(token)) {
        throwProtectedError(token, formatString, dirtyDateString);
      }
      var firstCharacter = token[0];
      var parser = parsers[firstCharacter];
      if (parser) {
        var incompatibleTokens = parser.incompatibleTokens;
        if (Array.isArray(incompatibleTokens)) {
          var incompatibleToken = usedTokens.find(function(usedToken) {
            return incompatibleTokens.includes(usedToken.token) || usedToken.token === firstCharacter;
          });
          if (incompatibleToken) {
            throw new RangeError("The format string mustn't contain `".concat(incompatibleToken.fullToken, "` and `").concat(token, "` at the same time"));
          }
        } else if (parser.incompatibleTokens === "*" && usedTokens.length > 0) {
          throw new RangeError("The format string mustn't contain `".concat(token, "` and any other token at the same time"));
        }
        usedTokens.push({
          token: firstCharacter,
          fullToken: token
        });
        var parseResult = parser.run(dateString, token, locale2.match, subFnOptions);
        if (!parseResult) {
          return {
            v: /* @__PURE__ */ new Date(NaN)
          };
        }
        setters.push(parseResult.setter);
        dateString = parseResult.rest;
      } else {
        if (firstCharacter.match(unescapedLatinCharacterRegExp2)) {
          throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
        }
        if (token === "''") {
          token = "'";
        } else if (firstCharacter === "'") {
          token = cleanEscapedString2(token);
        }
        if (dateString.indexOf(token) === 0) {
          dateString = dateString.slice(token.length);
        } else {
          return {
            v: /* @__PURE__ */ new Date(NaN)
          };
        }
      }
    };
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      var _ret = _loop();
      if (_typeof(_ret) === "object")
        return _ret.v;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (dateString.length > 0 && notWhitespaceRegExp.test(dateString)) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var uniquePrioritySetters = setters.map(function(setter2) {
    return setter2.priority;
  }).sort(function(a3, b2) {
    return b2 - a3;
  }).filter(function(priority, index, array) {
    return array.indexOf(priority) === index;
  }).map(function(priority) {
    return setters.filter(function(setter2) {
      return setter2.priority === priority;
    }).sort(function(a3, b2) {
      return b2.subPriority - a3.subPriority;
    });
  }).map(function(setterArray) {
    return setterArray[0];
  });
  var date = toDate(dirtyReferenceDate);
  if (isNaN(date.getTime())) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var utcDate = subMilliseconds(date, getTimezoneOffsetInMilliseconds(date));
  var flags = {};
  var _iterator2 = _createForOfIteratorHelper(uniquePrioritySetters), _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
      var setter = _step2.value;
      if (!setter.validate(utcDate, subFnOptions)) {
        return /* @__PURE__ */ new Date(NaN);
      }
      var result = setter.set(utcDate, flags, subFnOptions);
      if (Array.isArray(result)) {
        utcDate = result[0];
        assign(flags, result[1]);
      } else {
        utcDate = result;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return utcDate;
}
function cleanEscapedString2(input) {
  return input.match(escapedStringRegExp2)[1].replace(doubleQuoteRegExp2, "'");
}

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-time.mjs
var timeUnits = [
  ["Y", 1e3 * 60 * 60 * 24 * 365],
  // years
  ["M", 1e3 * 60 * 60 * 24 * 30],
  // months
  ["D", 1e3 * 60 * 60 * 24],
  // days
  ["H", 1e3 * 60 * 60],
  // hours
  ["m", 1e3 * 60],
  // minutes
  ["s", 1e3],
  // seconds
  ["S", 1]
  // million seconds
];
var NgTimeParser = class {
  constructor(format2, localeId) {
    this.format = format2;
    this.localeId = localeId;
    this.regex = null;
    this.matchMap = {
      hour: null,
      minute: null,
      second: null,
      periodNarrow: null,
      periodWide: null,
      periodAbbreviated: null
    };
    this.genRegexp();
  }
  toDate(str) {
    const result = this.getTimeResult(str);
    const time = /* @__PURE__ */ new Date();
    if (isNotNil(result?.hour)) {
      time.setHours(result.hour);
    }
    if (isNotNil(result?.minute)) {
      time.setMinutes(result.minute);
    }
    if (isNotNil(result?.second)) {
      time.setSeconds(result.second);
    }
    if (result?.period === 1 && time.getHours() < 12) {
      time.setHours(time.getHours() + 12);
    }
    return time;
  }
  getTimeResult(str) {
    const match2 = this.regex.exec(str);
    let period = null;
    if (match2) {
      if (isNotNil(this.matchMap.periodNarrow)) {
        period = getLocaleDayPeriods(this.localeId, FormStyle.Format, TranslationWidth.Narrow).indexOf(match2[this.matchMap.periodNarrow + 1]);
      }
      if (isNotNil(this.matchMap.periodWide)) {
        period = getLocaleDayPeriods(this.localeId, FormStyle.Format, TranslationWidth.Wide).indexOf(match2[this.matchMap.periodWide + 1]);
      }
      if (isNotNil(this.matchMap.periodAbbreviated)) {
        period = getLocaleDayPeriods(this.localeId, FormStyle.Format, TranslationWidth.Abbreviated).indexOf(match2[this.matchMap.periodAbbreviated + 1]);
      }
      return {
        hour: isNotNil(this.matchMap.hour) ? Number.parseInt(match2[this.matchMap.hour + 1], 10) : null,
        minute: isNotNil(this.matchMap.minute) ? Number.parseInt(match2[this.matchMap.minute + 1], 10) : null,
        second: isNotNil(this.matchMap.second) ? Number.parseInt(match2[this.matchMap.second + 1], 10) : null,
        period
      };
    } else {
      return null;
    }
  }
  genRegexp() {
    let regexStr = this.format.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$&");
    const hourRegex = /h{1,2}/i;
    const minuteRegex = /m{1,2}/;
    const secondRegex = /s{1,2}/;
    const periodNarrow = /aaaaa/;
    const periodWide = /aaaa/;
    const periodAbbreviated = /a{1,3}/;
    const hourMatch = hourRegex.exec(this.format);
    const minuteMatch = minuteRegex.exec(this.format);
    const secondMatch = secondRegex.exec(this.format);
    const periodNarrowMatch = periodNarrow.exec(this.format);
    let periodWideMatch = null;
    let periodAbbreviatedMatch = null;
    if (!periodNarrowMatch) {
      periodWideMatch = periodWide.exec(this.format);
    }
    if (!periodWideMatch && !periodNarrowMatch) {
      periodAbbreviatedMatch = periodAbbreviated.exec(this.format);
    }
    const matchs = [hourMatch, minuteMatch, secondMatch, periodNarrowMatch, periodWideMatch, periodAbbreviatedMatch].filter((m3) => !!m3).sort((a3, b2) => a3.index - b2.index);
    matchs.forEach((match2, index) => {
      switch (match2) {
        case hourMatch:
          this.matchMap.hour = index;
          regexStr = regexStr.replace(hourRegex, "(\\d{1,2})");
          break;
        case minuteMatch:
          this.matchMap.minute = index;
          regexStr = regexStr.replace(minuteRegex, "(\\d{1,2})");
          break;
        case secondMatch:
          this.matchMap.second = index;
          regexStr = regexStr.replace(secondRegex, "(\\d{1,2})");
          break;
        case periodNarrowMatch:
          this.matchMap.periodNarrow = index;
          const periodsNarrow = getLocaleDayPeriods(this.localeId, FormStyle.Format, TranslationWidth.Narrow).join("|");
          regexStr = regexStr.replace(periodNarrow, `(${periodsNarrow})`);
          break;
        case periodWideMatch:
          this.matchMap.periodWide = index;
          const periodsWide = getLocaleDayPeriods(this.localeId, FormStyle.Format, TranslationWidth.Wide).join("|");
          regexStr = regexStr.replace(periodWide, `(${periodsWide})`);
          break;
        case periodAbbreviatedMatch:
          this.matchMap.periodAbbreviated = index;
          const periodsAbbreviated = getLocaleDayPeriods(this.localeId, FormStyle.Format, TranslationWidth.Abbreviated).join("|");
          regexStr = regexStr.replace(periodAbbreviated, `(${periodsAbbreviated})`);
          break;
      }
    });
    this.regex = new RegExp(regexStr);
  }
};

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-i18n.mjs
var en_US = {
  locale: "en",
  Pagination: {
    items_per_page: "/ page",
    jump_to: "Go to",
    jump_to_confirm: "confirm",
    page: "Page",
    prev_page: "Previous Page",
    next_page: "Next Page",
    prev_5: "Previous 5 Pages",
    next_5: "Next 5 Pages",
    prev_3: "Previous 3 Pages",
    next_3: "Next 3 Pages",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Select date",
      yearPlaceholder: "Select year",
      quarterPlaceholder: "Select quarter",
      monthPlaceholder: "Select month",
      weekPlaceholder: "Select week",
      rangePlaceholder: ["Start date", "End date"],
      rangeYearPlaceholder: ["Start year", "End year"],
      rangeMonthPlaceholder: ["Start month", "End month"],
      rangeWeekPlaceholder: ["Start week", "End week"],
      locale: "en_US",
      today: "Today",
      now: "Now",
      backToToday: "Back to today",
      ok: "Ok",
      clear: "Clear",
      month: "Month",
      year: "Year",
      timeSelect: "select time",
      dateSelect: "select date",
      weekSelect: "Choose a week",
      monthSelect: "Choose a month",
      yearSelect: "Choose a year",
      decadeSelect: "Choose a decade",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Previous month (PageUp)",
      nextMonth: "Next month (PageDown)",
      previousYear: "Last year (Control + left)",
      nextYear: "Next year (Control + right)",
      previousDecade: "Last decade",
      nextDecade: "Next decade",
      previousCentury: "Last century",
      nextCentury: "Next century"
    },
    timePickerLocale: {
      placeholder: "Select time",
      rangePlaceholder: ["Start time", "End time"]
    }
  },
  TimePicker: {
    placeholder: "Select time",
    rangePlaceholder: ["Start time", "End time"]
  },
  Calendar: {
    lang: {
      placeholder: "Select date",
      yearPlaceholder: "Select year",
      quarterPlaceholder: "Select quarter",
      monthPlaceholder: "Select month",
      weekPlaceholder: "Select week",
      rangePlaceholder: ["Start date", "End date"],
      rangeYearPlaceholder: ["Start year", "End year"],
      rangeMonthPlaceholder: ["Start month", "End month"],
      rangeWeekPlaceholder: ["Start week", "End week"],
      locale: "en_US",
      today: "Today",
      now: "Now",
      backToToday: "Back to today",
      ok: "Ok",
      clear: "Clear",
      month: "Month",
      year: "Year",
      timeSelect: "select time",
      dateSelect: "select date",
      weekSelect: "Choose a week",
      monthSelect: "Choose a month",
      yearSelect: "Choose a year",
      decadeSelect: "Choose a decade",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Previous month (PageUp)",
      nextMonth: "Next month (PageDown)",
      previousYear: "Last year (Control + left)",
      nextYear: "Next year (Control + right)",
      previousDecade: "Last decade",
      nextDecade: "Next decade",
      previousCentury: "Last century",
      nextCentury: "Next century"
    },
    timePickerLocale: {
      placeholder: "Select time",
      rangePlaceholder: ["Start time", "End time"]
    }
  },
  global: {
    placeholder: "Please select"
  },
  Table: {
    filterTitle: "Filter menu",
    filterConfirm: "OK",
    filterReset: "Reset",
    filterEmptyText: "No filters",
    emptyText: "No data",
    selectAll: "Select current page",
    selectInvert: "Invert current page",
    selectionAll: "Select all data",
    sortTitle: "Sort",
    expand: "Expand row",
    collapse: "Collapse row",
    triggerDesc: "Click to sort descending",
    triggerAsc: "Click to sort ascending",
    cancelSort: "Click to cancel sorting",
    filterCheckall: "Select all items",
    filterSearchPlaceholder: "Search in filters",
    selectNone: "Clear all data"
  },
  Modal: {
    okText: "OK",
    cancelText: "Cancel",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Cancel"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Search here",
    itemUnit: "item",
    itemsUnit: "items",
    remove: "Remove",
    selectCurrent: "Select current page",
    removeCurrent: "Remove current page",
    selectAll: "Select all data",
    removeAll: "Remove all data",
    selectInvert: "Invert current page"
  },
  Upload: {
    uploading: "Uploading...",
    removeFile: "Remove file",
    uploadError: "Upload error",
    previewFile: "Preview file",
    downloadFile: "Download file"
  },
  Empty: {
    description: "No Data"
  },
  Icon: {
    icon: "icon"
  },
  Text: {
    edit: "Edit",
    copy: "Copy",
    copied: "Copied",
    expand: "Expand"
  },
  PageHeader: {
    back: "Back"
  },
  Image: {
    preview: "Preview"
  },
  CronExpression: {
    cronError: "Invalid cron expression",
    second: "second",
    minute: "minute",
    hour: "hour",
    day: "day",
    month: "month",
    week: "week"
  },
  QRCode: {
    expired: "QR code expired",
    refresh: "Refresh"
  }
};
var zh_CN = {
  locale: "zh-cn",
  Pagination: {
    items_per_page: "条/页",
    jump_to: "跳至",
    jump_to_confirm: "确定",
    page: "页",
    prev_page: "上一页",
    next_page: "下一页",
    prev_5: "向前 5 页",
    next_5: "向后 5 页",
    prev_3: "向前 3 页",
    next_3: "向后 3 页",
    page_size: "页码"
  },
  DatePicker: {
    lang: {
      placeholder: "请选择日期",
      yearPlaceholder: "请选择年份",
      quarterPlaceholder: "请选择季度",
      monthPlaceholder: "请选择月份",
      weekPlaceholder: "请选择周",
      rangePlaceholder: ["开始日期", "结束日期"],
      rangeYearPlaceholder: ["开始年份", "结束年份"],
      rangeMonthPlaceholder: ["开始月份", "结束月份"],
      rangeWeekPlaceholder: ["开始周", "结束周"],
      locale: "zh_CN",
      today: "今天",
      now: "此刻",
      backToToday: "返回今天",
      ok: "确定",
      timeSelect: "选择时间",
      dateSelect: "选择日期",
      weekSelect: "选择周",
      clear: "清除",
      month: "月",
      year: "年",
      previousMonth: "上个月 (翻页上键)",
      nextMonth: "下个月 (翻页下键)",
      monthSelect: "选择月份",
      yearSelect: "选择年份",
      decadeSelect: "选择年代",
      yearFormat: "YYYY年",
      dayFormat: "D日",
      dateFormat: "YYYY年M月D日",
      dateTimeFormat: "YYYY年M月D日 HH时mm分ss秒",
      previousYear: "上一年 (Control键加左方向键)",
      nextYear: "下一年 (Control键加右方向键)",
      previousDecade: "上一年代",
      nextDecade: "下一年代",
      previousCentury: "上一世纪",
      nextCentury: "下一世纪"
    },
    timePickerLocale: {
      placeholder: "请选择时间",
      rangePlaceholder: ["开始时间", "结束时间"]
    }
  },
  TimePicker: {
    placeholder: "请选择时间",
    rangePlaceholder: ["开始时间", "结束时间"]
  },
  Calendar: {
    lang: {
      placeholder: "请选择日期",
      yearPlaceholder: "请选择年份",
      quarterPlaceholder: "请选择季度",
      monthPlaceholder: "请选择月份",
      weekPlaceholder: "请选择周",
      rangePlaceholder: ["开始日期", "结束日期"],
      rangeYearPlaceholder: ["开始年份", "结束年份"],
      rangeMonthPlaceholder: ["开始月份", "结束月份"],
      rangeWeekPlaceholder: ["开始周", "结束周"],
      locale: "zh_CN",
      today: "今天",
      now: "此刻",
      backToToday: "返回今天",
      ok: "确定",
      timeSelect: "选择时间",
      dateSelect: "选择日期",
      weekSelect: "选择周",
      clear: "清除",
      month: "月",
      year: "年",
      previousMonth: "上个月 (翻页上键)",
      nextMonth: "下个月 (翻页下键)",
      monthSelect: "选择月份",
      yearSelect: "选择年份",
      decadeSelect: "选择年代",
      yearFormat: "YYYY年",
      dayFormat: "D日",
      dateFormat: "YYYY年M月D日",
      dateTimeFormat: "YYYY年M月D日 HH时mm分ss秒",
      previousYear: "上一年 (Control键加左方向键)",
      nextYear: "下一年 (Control键加右方向键)",
      previousDecade: "上一年代",
      nextDecade: "下一年代",
      previousCentury: "上一世纪",
      nextCentury: "下一世纪"
    },
    timePickerLocale: {
      placeholder: "请选择时间",
      rangePlaceholder: ["开始时间", "结束时间"]
    }
  },
  global: {
    placeholder: "请选择"
  },
  Table: {
    filterTitle: "筛选",
    filterConfirm: "确定",
    filterReset: "重置",
    filterEmptyText: "无筛选项",
    selectAll: "全选当页",
    selectInvert: "反选当页",
    selectionAll: "全选所有",
    sortTitle: "排序",
    expand: "展开行",
    collapse: "关闭行",
    triggerDesc: "点击降序",
    triggerAsc: "点击升序",
    cancelSort: "取消排序",
    filterCheckall: "全选",
    filterSearchPlaceholder: "在筛选项中搜索",
    selectNone: "清空所有"
  },
  Modal: {
    okText: "确定",
    cancelText: "取消",
    justOkText: "知道了"
  },
  Popconfirm: {
    cancelText: "取消",
    okText: "确定"
  },
  Transfer: {
    searchPlaceholder: "请输入搜索内容",
    itemUnit: "项",
    itemsUnit: "项",
    remove: "删除",
    selectCurrent: "全选当页",
    removeCurrent: "删除当页",
    selectAll: "全选所有",
    removeAll: "删除全部",
    selectInvert: "反选当页"
  },
  Upload: {
    uploading: "文件上传中",
    removeFile: "删除文件",
    uploadError: "上传错误",
    previewFile: "预览文件",
    downloadFile: "下载文件"
  },
  Empty: {
    description: "暂无数据"
  },
  Icon: {
    icon: "图标"
  },
  Text: {
    edit: "编辑",
    copy: "复制",
    copied: "复制成功",
    expand: "展开"
  },
  PageHeader: {
    back: "返回"
  },
  Image: {
    preview: "预览"
  },
  CronExpression: {
    cronError: "cron 表达式不合法",
    second: "秒",
    minute: "分钟",
    hour: "小时",
    day: "日",
    month: "月",
    week: "周"
  },
  QRCode: {
    expired: "二维码过期",
    refresh: "点击刷新"
  }
};
var NZ_I18N = new InjectionToken("nz-i18n");
function provideNzI18n(config) {
  return makeEnvironmentProviders([{
    provide: NZ_I18N,
    useValue: config
  }]);
}
var NZ_DATE_LOCALE = new InjectionToken("nz-date-locale");
var _NzI18nService = class _NzI18nService {
  get localeChange() {
    return this._change.asObservable();
  }
  constructor(locale2, dateLocale) {
    this._change = new BehaviorSubject(this._locale);
    this.setLocale(locale2 || zh_CN);
    this.setDateLocale(dateLocale || null);
  }
  // [NOTE] Performance issue: this method may called by every change detections
  // TODO: cache more deeply paths for performance
  translate(path, data) {
    let content = this._getObjectPath(this._locale, path);
    if (typeof content === "string") {
      if (data) {
        Object.keys(data).forEach((key) => content = content.replace(new RegExp(`%${key}%`, "g"), data[key]));
      }
      return content;
    }
    return path;
  }
  /**
   * Set/Change current locale globally throughout the WHOLE application
   * NOTE: If called at runtime, rendered interface may not change along with the locale change,
   * because this do not trigger another render schedule.
   *
   * @param locale The translating letters
   */
  setLocale(locale2) {
    if (this._locale && this._locale.locale === locale2.locale) {
      return;
    }
    this._locale = locale2;
    this._change.next(locale2);
  }
  getLocale() {
    return this._locale;
  }
  getLocaleId() {
    return this._locale ? this._locale.locale : "";
  }
  setDateLocale(dateLocale) {
    this.dateLocale = dateLocale;
  }
  getDateLocale() {
    return this.dateLocale;
  }
  /**
   * Get locale data
   *
   * @param path dot paths for finding exist value from locale data, eg. "a.b.c"
   * @param defaultValue default value if the result is not "truthy"
   */
  getLocaleData(path, defaultValue) {
    const result = path ? this._getObjectPath(this._locale, path) : this._locale;
    if (!result && !defaultValue) {
      warn(`Missing translations for "${path}" in language "${this._locale.locale}".
You can use "NzI18nService.setLocale" as a temporary fix.
Welcome to submit a pull request to help us optimize the translations!
https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/CONTRIBUTING.md`);
    }
    return result || defaultValue || this._getObjectPath(en_US, path) || {};
  }
  _getObjectPath(obj, path) {
    let res = obj;
    const paths = path.split(".");
    const depth = paths.length;
    let index = 0;
    while (res && index < depth) {
      res = res[paths[index++]];
    }
    return index === depth ? res : null;
  }
};
_NzI18nService.ɵfac = function NzI18nService_Factory(t2) {
  return new (t2 || _NzI18nService)(ɵɵinject(NZ_I18N, 8), ɵɵinject(NZ_DATE_LOCALE, 8));
};
_NzI18nService.ɵprov = ɵɵdefineInjectable({
  token: _NzI18nService,
  factory: _NzI18nService.ɵfac,
  providedIn: "root"
});
var NzI18nService = _NzI18nService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzI18nService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [NZ_I18N]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [NZ_DATE_LOCALE]
    }]
  }], null);
})();
var _NzI18nPipe = class _NzI18nPipe {
  constructor(_locale) {
    this._locale = _locale;
  }
  transform(path, keyValue) {
    return this._locale.translate(path, keyValue);
  }
};
_NzI18nPipe.ɵfac = function NzI18nPipe_Factory(t2) {
  return new (t2 || _NzI18nPipe)(ɵɵdirectiveInject(NzI18nService, 16));
};
_NzI18nPipe.ɵpipe = ɵɵdefinePipe({
  name: "nzI18n",
  type: _NzI18nPipe,
  pure: true,
  standalone: true
});
var NzI18nPipe = _NzI18nPipe;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzI18nPipe, [{
    type: Pipe,
    args: [{
      name: "nzI18n",
      standalone: true
    }]
  }], () => [{
    type: NzI18nService
  }], null);
})();
var _NzI18nModule = class _NzI18nModule {
};
_NzI18nModule.ɵfac = function NzI18nModule_Factory(t2) {
  return new (t2 || _NzI18nModule)();
};
_NzI18nModule.ɵmod = ɵɵdefineNgModule({
  type: _NzI18nModule,
  imports: [NzI18nPipe],
  exports: [NzI18nPipe]
});
_NzI18nModule.ɵinj = ɵɵdefineInjector({});
var NzI18nModule = _NzI18nModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzI18nModule, [{
    type: NgModule,
    args: [{
      imports: [NzI18nPipe],
      exports: [NzI18nPipe]
    }]
  }], null, null);
})();
var NZ_DATE_CONFIG = new InjectionToken("date-config");
var NZ_DATE_CONFIG_DEFAULT = {
  firstDayOfWeek: void 0
};
function mergeDateConfig(config) {
  return __spreadValues(__spreadValues({}, NZ_DATE_CONFIG_DEFAULT), config);
}
function DATE_HELPER_SERVICE_FACTORY() {
  const i18n = inject(NzI18nService);
  const config = inject(NZ_DATE_CONFIG, {
    optional: true
  });
  return i18n.getDateLocale() ? new DateHelperByDateFns(i18n, config) : new DateHelperByDatePipe(i18n, config);
}
var _DateHelperService = class _DateHelperService {
  constructor(i18n, config) {
    this.i18n = i18n;
    this.config = mergeDateConfig(config);
  }
};
_DateHelperService.ɵfac = function DateHelperService_Factory(t2) {
  return new (t2 || _DateHelperService)(ɵɵinject(NzI18nService), ɵɵinject(NZ_DATE_CONFIG, 8));
};
_DateHelperService.ɵprov = ɵɵdefineInjectable({
  token: _DateHelperService,
  factory: () => DATE_HELPER_SERVICE_FACTORY(),
  providedIn: "root"
});
var DateHelperService = _DateHelperService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DateHelperService, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: DATE_HELPER_SERVICE_FACTORY
    }]
  }], () => [{
    type: NzI18nService
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [NZ_DATE_CONFIG]
    }]
  }], null);
})();
var DateHelperByDateFns = class extends DateHelperService {
  getISOWeek(date) {
    return getISOWeek(date);
  }
  // Use date-fns's "weekStartsOn" to support different locale when "config.firstDayOfWeek" is null
  // https://github.com/date-fns/date-fns/blob/v2.0.0-alpha.27/src/locale/en-US/index.js#L23
  getFirstDayOfWeek() {
    let defaultWeekStartsOn;
    try {
      defaultWeekStartsOn = this.i18n.getDateLocale().options.weekStartsOn;
    } catch (e2) {
      defaultWeekStartsOn = 1;
    }
    return this.config.firstDayOfWeek == null ? defaultWeekStartsOn : this.config.firstDayOfWeek;
  }
  /**
   * Format a date
   *
   * @see https://date-fns.org/docs/format#description
   * @param date Date
   * @param formatStr format string
   */
  format(date, formatStr) {
    return date ? format(date, formatStr, {
      locale: this.i18n.getDateLocale()
    }) : "";
  }
  parseDate(text, formatStr) {
    return parse(text, formatStr, /* @__PURE__ */ new Date(), {
      locale: this.i18n.getDateLocale(),
      weekStartsOn: this.getFirstDayOfWeek()
    });
  }
  parseTime(text, formatStr) {
    return this.parseDate(text, formatStr);
  }
};
var DateHelperByDatePipe = class extends DateHelperService {
  getISOWeek(date) {
    return +this.format(date, "w");
  }
  getFirstDayOfWeek() {
    if (this.config.firstDayOfWeek === void 0) {
      const locale2 = this.i18n.getLocaleId();
      return locale2 && ["zh-cn", "zh-tw"].indexOf(locale2.toLowerCase()) > -1 ? 1 : 0;
    }
    return this.config.firstDayOfWeek;
  }
  format(date, formatStr) {
    return date ? formatDate(date, formatStr, this.i18n.getLocaleId()) : "";
  }
  parseDate(text) {
    return new Date(text);
  }
  parseTime(text, formatStr) {
    const parser = new NgTimeParser(formatStr, this.i18n.getLocaleId());
    return parser.toDate(text);
  }
};
var ar_EG = {
  locale: "ar",
  Pagination: {
    items_per_page: "/ الصفحة",
    jump_to: "الذهاب إلى",
    jump_to_confirm: "تأكيد",
    page: "الصفحة",
    prev_page: "الصفحة السابقة",
    next_page: "الصفحة التالية",
    prev_5: "خمس صفحات سابقة",
    next_5: "خمس صفحات تالية",
    prev_3: "ثلاث صفحات سابقة",
    next_3: "ثلاث صفحات تالية",
    page_size: "مقاس الصفحه"
  },
  DatePicker: {
    lang: {
      placeholder: "اختيار التاريخ",
      yearPlaceholder: "اختيار السنة",
      quarterPlaceholder: "اختيار الربع",
      monthPlaceholder: "اختيار الشهر",
      weekPlaceholder: "اختيار الأسبوع",
      rangePlaceholder: ["البداية", "النهاية"],
      rangeYearPlaceholder: ["سنة البداية", "سنة النهاية"],
      rangeMonthPlaceholder: ["شهر البداية", "شهر النهاية"],
      rangeWeekPlaceholder: ["أسبوع البداية", "أسبوع النهاية"],
      locale: "ar_EG",
      today: "اليوم",
      now: "الأن",
      backToToday: "العودة إلى اليوم",
      ok: "تأكيد",
      clear: "مسح",
      month: "الشهر",
      year: "السنة",
      timeSelect: "اختيار الوقت",
      dateSelect: "اختيار التاريخ",
      weekSelect: "اختيار الأسبوع",
      monthSelect: "اختيار الشهر",
      yearSelect: "اختيار السنة",
      decadeSelect: "اختيار العقد",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "الشهر السابق (PageUp)",
      nextMonth: "الشهر التالى(PageDown)",
      previousYear: "العام السابق (Control + left)",
      nextYear: "العام التالى (Control + right)",
      previousDecade: "العقد السابق",
      nextDecade: "العقد التالى",
      previousCentury: "القرن السابق",
      nextCentury: "القرن التالى"
    },
    timePickerLocale: {
      placeholder: "اختيار الوقت"
    },
    dateFormat: "DD-MM-YYYY",
    monthFormat: "MM-YYYY",
    dateTimeFormat: "DD-MM-YYYY HH:mm:ss",
    weekFormat: "wo-YYYY"
  },
  TimePicker: {
    placeholder: "اختيار الوقت"
  },
  Calendar: {
    lang: {
      placeholder: "اختيار التاريخ",
      yearPlaceholder: "اختيار السنة",
      quarterPlaceholder: "اختيار الربع",
      monthPlaceholder: "اختيار الشهر",
      weekPlaceholder: "اختيار الأسبوع",
      rangePlaceholder: ["البداية", "النهاية"],
      rangeYearPlaceholder: ["سنة البداية", "سنة النهاية"],
      rangeMonthPlaceholder: ["شهر البداية", "شهر النهاية"],
      rangeWeekPlaceholder: ["أسبوع البداية", "أسبوع النهاية"],
      locale: "ar_EG",
      today: "اليوم",
      now: "الأن",
      backToToday: "العودة إلى اليوم",
      ok: "تأكيد",
      clear: "مسح",
      month: "الشهر",
      year: "السنة",
      timeSelect: "اختيار الوقت",
      dateSelect: "اختيار التاريخ",
      weekSelect: "اختيار الأسبوع",
      monthSelect: "اختيار الشهر",
      yearSelect: "اختيار السنة",
      decadeSelect: "اختيار العقد",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "الشهر السابق (PageUp)",
      nextMonth: "الشهر التالى(PageDown)",
      previousYear: "العام السابق (Control + left)",
      nextYear: "العام التالى (Control + right)",
      previousDecade: "العقد السابق",
      nextDecade: "العقد التالى",
      previousCentury: "القرن السابق",
      nextCentury: "القرن التالى"
    },
    timePickerLocale: {
      placeholder: "اختيار الوقت"
    },
    dateFormat: "DD-MM-YYYY",
    monthFormat: "MM-YYYY",
    dateTimeFormat: "DD-MM-YYYY HH:mm:ss",
    weekFormat: "wo-YYYY"
  },
  global: {
    placeholder: "يرجى التحديد"
  },
  Table: {
    filterTitle: "الفلاتر",
    filterConfirm: "تأكيد",
    filterReset: "إعادة ضبط",
    selectAll: "اختيار الكل",
    selectInvert: "إلغاء الاختيار",
    selectionAll: "حدد جميع البيانات",
    sortTitle: "رتب",
    expand: "توسيع الصف",
    collapse: "طي الصف",
    triggerDesc: "ترتيب تنازلي",
    triggerAsc: "ترتيب تصاعدي",
    cancelSort: "إلغاء الترتيب"
  },
  Modal: {
    okText: "تأكيد",
    cancelText: "إلغاء",
    justOkText: "تأكيد"
  },
  Popconfirm: {
    okText: "تأكيد",
    cancelText: "إلغاء"
  },
  Transfer: {
    searchPlaceholder: "ابحث هنا",
    itemUnit: "عنصر",
    itemsUnit: "عناصر"
  },
  Upload: {
    uploading: "جاري الرفع...",
    removeFile: "احذف الملف",
    uploadError: "مشكلة فى الرفع",
    previewFile: "استعرض الملف",
    downloadFile: "تحميل الملف"
  },
  Empty: {
    description: "لا توجد بيانات"
  },
  Icon: {
    icon: "أيقونة"
  },
  Text: {
    edit: "تعديل",
    copy: "نسخ",
    copied: "نقل",
    expand: "وسع"
  },
  PageHeader: {
    back: "عودة"
  }
};
var az_AZ = {
  locale: "az",
  Pagination: {
    items_per_page: "/ səhifə",
    jump_to: "Get",
    jump_to_confirm: "təsdiqlə",
    page: "",
    prev_page: "Əvvəlki Səhifə",
    next_page: "Növbəti Səhifə",
    prev_5: "Əvvəlki 5 Səhifə",
    next_5: "Növbəti 5 Səhifə",
    prev_3: "Əvvəlki 3 Səhifə",
    next_3: "Növbəti 3 Səhifə",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Tarix seçin",
      rangePlaceholder: ["Başlama tarixi", "Bitmə tarixi"],
      locale: "az_AZ",
      today: "Bugün",
      now: "İndi",
      backToToday: "Bugünə qayıt",
      ok: "Təsdiq",
      clear: "Təmizlə",
      month: "Ay",
      year: "İl",
      timeSelect: "vaxtı seç",
      dateSelect: "tarixi seç",
      weekSelect: "Həftə seç",
      monthSelect: "Ay seç",
      yearSelect: "il seç",
      decadeSelect: "Onillik seçin",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Əvvəlki ay (PageUp)",
      nextMonth: "Növbəti ay (PageDown)",
      previousYear: "Sonuncu il (Control + left)",
      nextYear: "Növbəti il (Control + right)",
      previousDecade: "Sonuncu onillik",
      nextDecade: "Növbəti onillik",
      previousCentury: "Sonuncu əsr",
      nextCentury: "Növbəti əsr"
    },
    timePickerLocale: {
      placeholder: "Vaxtı seç"
    }
  },
  TimePicker: {
    placeholder: "Vaxtı seç"
  },
  Calendar: {
    lang: {
      placeholder: "Tarix seçin",
      rangePlaceholder: ["Başlama tarixi", "Bitmə tarixi"],
      locale: "az_AZ",
      today: "Bugün",
      now: "İndi",
      backToToday: "Bugünə qayıt",
      ok: "Təsdiq",
      clear: "Təmizlə",
      month: "Ay",
      year: "İl",
      timeSelect: "vaxtı seç",
      dateSelect: "tarixi seç",
      weekSelect: "Həftə seç",
      monthSelect: "Ay seç",
      yearSelect: "il seç",
      decadeSelect: "Onillik seçin",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Əvvəlki ay (PageUp)",
      nextMonth: "Növbəti ay (PageDown)",
      previousYear: "Sonuncu il (Control + left)",
      nextYear: "Növbəti il (Control + right)",
      previousDecade: "Sonuncu onillik",
      nextDecade: "Növbəti onillik",
      previousCentury: "Sonuncu əsr",
      nextCentury: "Növbəti əsr"
    },
    timePickerLocale: {
      placeholder: "Vaxtı seç"
    }
  },
  Table: {
    filterTitle: "Filter menyu",
    filterConfirm: "Axtar",
    filterReset: "Sıfırla",
    emptyText: "Məlumat yoxdur",
    selectAll: "Cari səhifəni seç",
    selectInvert: "Invert current page"
  },
  Modal: {
    okText: "Bəli",
    cancelText: "Ləğv et",
    justOkText: "Bəli"
  },
  Popconfirm: {
    okText: "Bəli",
    cancelText: "Ləğv et"
  },
  Transfer: {
    titles: ["", ""],
    notFoundContent: "Tapılmadı",
    searchPlaceholder: "Burada axtar",
    itemUnit: "item",
    itemsUnit: "items"
  },
  Select: {
    notFoundContent: "Tapılmadı"
  },
  Upload: {
    uploading: "Yüklənir...",
    removeFile: "Faylı sil",
    uploadError: "Yükləmə xətası",
    previewFile: "Fayla önbaxış"
  }
};
var bg_BG = {
  locale: "bg",
  Pagination: {
    items_per_page: "/ страница",
    jump_to: "Към",
    jump_to_confirm: "потвърждавам",
    page: "",
    prev_page: "Предишна страница",
    next_page: "Следваща страница",
    prev_5: "Предишни 5 страници",
    next_5: "Следващи 5 страници",
    prev_3: "Предишни 3 страници",
    next_3: "Следващи 3 страници",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Избор на дата",
      rangePlaceholder: ["Начална", "Крайна"],
      locale: "bg_BG",
      today: "Днес",
      now: "Сега",
      backToToday: "Към днес",
      ok: "Добре",
      clear: "Изчистване",
      month: "Месец",
      year: "Година",
      timeSelect: "Избор на час",
      dateSelect: "Избор на дата",
      monthSelect: "Избор на месец",
      yearSelect: "Избор на година",
      decadeSelect: "Десетилетие",
      yearFormat: "YYYY",
      dateFormat: "D M YYYY",
      dayFormat: "D",
      dateTimeFormat: "D M YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Предишен месец (PageUp)",
      nextMonth: "Следващ месец (PageDown)",
      previousYear: "Последна година (Control + left)",
      nextYear: "Следваща година (Control + right)",
      previousDecade: "Предишно десетилетие",
      nextDecade: "Следващо десетилетие",
      previousCentury: "Последен век",
      nextCentury: "Следващ век"
    },
    timePickerLocale: {
      placeholder: "Избор на час"
    }
  },
  TimePicker: {
    placeholder: "Избор на час"
  },
  Calendar: {
    lang: {
      placeholder: "Избор на дата",
      rangePlaceholder: ["Начална", "Крайна"],
      locale: "bg_BG",
      today: "Днес",
      now: "Сега",
      backToToday: "Към днес",
      ok: "Добре",
      clear: "Изчистване",
      month: "Месец",
      year: "Година",
      timeSelect: "Избор на час",
      dateSelect: "Избор на дата",
      monthSelect: "Избор на месец",
      yearSelect: "Избор на година",
      decadeSelect: "Десетилетие",
      yearFormat: "YYYY",
      dateFormat: "D M YYYY",
      dayFormat: "D",
      dateTimeFormat: "D M YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Предишен месец (PageUp)",
      nextMonth: "Следващ месец (PageDown)",
      previousYear: "Последна година (Control + left)",
      nextYear: "Следваща година (Control + right)",
      previousDecade: "Предишно десетилетие",
      nextDecade: "Следващо десетилетие",
      previousCentury: "Последен век",
      nextCentury: "Следващ век"
    },
    timePickerLocale: {
      placeholder: "Избор на час"
    }
  },
  Table: {
    filterTitle: "Филтриране",
    filterConfirm: "Добре",
    filterReset: "Нулриане",
    selectAll: "Избор на текуща страница",
    selectInvert: "Обръщане"
  },
  Modal: {
    okText: "Добре",
    cancelText: "Отказ",
    justOkText: "Добре"
  },
  Popconfirm: {
    okText: "Добре",
    cancelText: "Отказ"
  },
  Transfer: {
    searchPlaceholder: "Търсене",
    itemUnit: "избор",
    itemsUnit: "избори"
  },
  Upload: {
    uploading: "Качване...",
    removeFile: "Премахване",
    uploadError: "Грешка при качването",
    previewFile: "Преглед",
    downloadFile: "Свали файл"
  },
  Empty: {
    description: "Няма данни"
  }
};
var bn_BD = {
  locale: "bn-bd",
  Pagination: {
    items_per_page: "/ পৃষ্ঠা",
    jump_to: "যাও",
    jump_to_confirm: "নিশ্চিত",
    page: "পৃষ্ঠা",
    prev_page: "আগের পৃষ্ঠা",
    next_page: "পরের পৃষ্ঠা",
    prev_5: "পূর্ববর্তী ৫ পৃষ্ঠা",
    next_5: "পরবর্তী ৫ পৃষ্ঠা",
    prev_3: "পূর্ববর্তী ৩ পৃষ্ঠা",
    next_3: "পরবর্তী ৩ পৃষ্ঠা",
    page_size: "পাতার আকার"
  },
  DatePicker: {
    lang: {
      placeholder: "তারিখ নির্বাচন",
      yearPlaceholder: "বছর নির্বাচন",
      quarterPlaceholder: "কোয়ার্টার নির্বাচন",
      monthPlaceholder: "মাস নির্বাচন",
      weekPlaceholder: "সপ্তাহ নির্বাচন",
      rangePlaceholder: ["শুরুর তারিখ", "শেষ তারিখ"],
      rangeYearPlaceholder: ["শুরুর বছর", "শেষ বছর"],
      rangeMonthPlaceholder: ["শুরুর মাস", "শেষ মাস"],
      rangeWeekPlaceholder: ["শুরুর সপ্তাহ", "শেষ সপ্তাহ"],
      locale: "bn_BD",
      today: "আজ",
      now: "এখন",
      backToToday: "আজকে ফিরে চলুন",
      ok: "ওকে",
      clear: "পরিস্কার",
      month: "মাস",
      year: "বছর",
      timeSelect: "সময় নির্বাচন",
      dateSelect: "তারিখ নির্বাচন",
      weekSelect: "সপ্তাহ পছন্দ করুন",
      monthSelect: "মাস পছন্দ করুন",
      yearSelect: "বছর পছন্দ করুন",
      decadeSelect: "একটি দশক পছন্দ করুন",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "গত মাস (PageUp)",
      nextMonth: "আগামী মাস (PageDown)",
      previousYear: "গত বছর (Control + left)",
      nextYear: "আগামী বছর (Control + right)",
      previousDecade: "গত দশক",
      nextDecade: "পরের দশক",
      previousCentury: "গত শতাব্দী",
      nextCentury: "পরের শতাব্দী"
    },
    timePickerLocale: {
      placeholder: "সময় নির্বাচন",
      rangePlaceholder: ["সময় শুরু", "শেষ সময়"]
    }
  },
  TimePicker: {
    placeholder: "সময় নির্বাচন",
    rangePlaceholder: ["সময় শুরু", "শেষ সময়"]
  },
  Calendar: {
    lang: {
      placeholder: "তারিখ নির্বাচন",
      yearPlaceholder: "বছর নির্বাচন",
      quarterPlaceholder: "কোয়ার্টার নির্বাচন",
      monthPlaceholder: "মাস নির্বাচন",
      weekPlaceholder: "সপ্তাহ নির্বাচন",
      rangePlaceholder: ["শুরুর তারিখ", "শেষ তারিখ"],
      rangeYearPlaceholder: ["শুরুর বছর", "শেষ বছর"],
      rangeMonthPlaceholder: ["শুরুর মাস", "শেষ মাস"],
      rangeWeekPlaceholder: ["শুরুর সপ্তাহ", "শেষ সপ্তাহ"],
      locale: "bn_BD",
      today: "আজ",
      now: "এখন",
      backToToday: "আজকে ফিরে চলুন",
      ok: "ওকে",
      clear: "পরিস্কার",
      month: "মাস",
      year: "বছর",
      timeSelect: "সময় নির্বাচন",
      dateSelect: "তারিখ নির্বাচন",
      weekSelect: "সপ্তাহ পছন্দ করুন",
      monthSelect: "মাস পছন্দ করুন",
      yearSelect: "বছর পছন্দ করুন",
      decadeSelect: "একটি দশক পছন্দ করুন",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "গত মাস (PageUp)",
      nextMonth: "আগামী মাস (PageDown)",
      previousYear: "গত বছর (Control + left)",
      nextYear: "আগামী বছর (Control + right)",
      previousDecade: "গত দশক",
      nextDecade: "পরের দশক",
      previousCentury: "গত শতাব্দী",
      nextCentury: "পরের শতাব্দী"
    },
    timePickerLocale: {
      placeholder: "সময় নির্বাচন",
      rangePlaceholder: ["সময় শুরু", "শেষ সময়"]
    }
  },
  global: {
    placeholder: "অনুগ্রহ করে নির্বাচন করুন"
  },
  Table: {
    filterTitle: "ফিল্টার মেনু",
    filterConfirm: "ঠিক",
    filterReset: "রিসেট",
    filterEmptyText: "ফিল্টার নেই",
    emptyText: "কোনও ডেটা নেই",
    selectAll: "বর্তমান পৃষ্ঠা নির্বাচন করুন",
    selectInvert: "বর্তমান পৃষ্ঠাটি উল্টে দিন",
    selectNone: "সমস্ত ডেটা সাফ করুন",
    selectionAll: "সমস্ত ডেটা নির্বাচন করুন",
    sortTitle: "সাজান",
    expand: "সারি প্রসারিত করুন",
    collapse: "সারি সঙ্কুচিত করুন",
    triggerDesc: "অবতরণকে সাজানোর জন্য ক্লিক করুন",
    triggerAsc: "আরোহী বাছাই করতে ক্লিক করুন",
    cancelSort: "বাছাই বাতিল করতে ক্লিক করুন"
  },
  Modal: {
    okText: "ঠিক",
    cancelText: "বাতিল",
    justOkText: "ঠিক"
  },
  Popconfirm: {
    okText: "ঠিক",
    cancelText: "বাতিল"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "এখানে অনুসন্ধান",
    itemUnit: "আইটেম",
    itemsUnit: "আইটেমসমূহ",
    remove: "অপসারণ",
    selectCurrent: "বর্তমান পৃষ্ঠা নির্বাচন করুন",
    removeCurrent: "বর্তমান পৃষ্ঠাটি সরান",
    selectAll: "সমস্ত ডেটা নির্বাচন করুন",
    removeAll: "সমস্ত ডেটা সরান",
    selectInvert: "বর্তমান পৃষ্ঠাটি উল্টে দিন"
  },
  Upload: {
    uploading: "আপলোড হচ্ছে ...",
    removeFile: "ফাইল সরান",
    uploadError: "আপলোডে সমস্যা",
    previewFile: "ফাইলের পূর্বরূপ",
    downloadFile: "ফাইল ডাউনলোড"
  },
  Empty: {
    description: "কোনও ডেটা নেই"
  },
  Icon: {
    icon: "আইকন"
  },
  Text: {
    edit: "সম্পাদনা",
    copy: "অনুলিপি",
    copied: "অনুলিপি হয়েছে",
    expand: "বিস্তৃত করা"
  },
  PageHeader: {
    back: "পেছনে"
  },
  Image: {
    preview: "পূর্বরূপ"
  }
};
var by_BY = {
  locale: "by",
  Pagination: {
    items_per_page: "/старонка",
    jump_to: "Перайсці",
    jump_to_confirm: "Пацвердзіць",
    page: "",
    prev_page: "Назад",
    next_page: "Наперад",
    prev_5: "Папярэднія 5",
    next_5: "Наступныя 5",
    prev_3: "Папярэднія 3",
    next_3: "Наступныя 3",
    page_size: "памер старонкі"
  },
  DatePicker: {
    lang: {
      placeholder: "Выберыце дату",
      yearPlaceholder: "Выберыце год",
      quarterPlaceholder: "Выберыце квартал",
      monthPlaceholder: "Выберыце месяц",
      weekPlaceholder: "Выберыце тыдзень",
      rangePlaceholder: ["Пачатковая дата", "Канчатковая дата"],
      rangeYearPlaceholder: ["Пачатковы год", "Год заканчэння"],
      rangeMonthPlaceholder: ["Пачатковы месяц", "Канчатковы месяц"],
      rangeWeekPlaceholder: ["Пачатковы тыдзень", "Канчатковы тыдзень"],
      locale: "by_BY",
      today: "Сёння",
      now: "Зараз",
      backToToday: "Дадзеная дата",
      ok: "Ok",
      clear: "Ачысціць",
      month: "Месяц",
      year: "Год",
      timeSelect: "Выбраць час",
      dateSelect: "Выбраць дату",
      weekSelect: "Выбраць тыдзень",
      monthSelect: "Выбраць месяц",
      yearSelect: "Выбраць год",
      decadeSelect: "Выбраць дзесяцігоддзе",
      yearFormat: "YYYY",
      dateFormat: "D-M-YYYY",
      dayFormat: "D",
      dateTimeFormat: "D-M-YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Папярэдні месяц (PageUp)",
      nextMonth: "Наступны месяц (PageDown)",
      previousYear: "Папярэдні год (Control + left)",
      nextYear: "Наступны год (Control + right)",
      previousDecade: "Папярэдняе дзесяцігоддзе",
      nextDecade: "Наступнае дзесяцігоддзе",
      previousCentury: "Папярэдні век",
      nextCentury: "Наступны век"
    },
    timePickerLocale: {
      placeholder: "Выберыце час",
      rangePlaceholder: ["Час пачатку", "Час заканчэння"]
    }
  },
  TimePicker: {
    placeholder: "Выберыце час",
    rangePlaceholder: ["Час пачатку", "Час заканчэння"]
  },
  Calendar: {
    lang: {
      placeholder: "Выберыце дату",
      yearPlaceholder: "Выберыце год",
      quarterPlaceholder: "Выберыце квартал",
      monthPlaceholder: "Выберыце месяц",
      weekPlaceholder: "Выберыце тыдзень",
      rangePlaceholder: ["Пачатковая дата", "Канчатковая дата"],
      rangeYearPlaceholder: ["Пачатковы год", "Год заканчэння"],
      rangeMonthPlaceholder: ["Пачатковы месяц", "Канчатковы месяц"],
      rangeWeekPlaceholder: ["Пачатковы тыдзень", "Канчатковы тыдзень"],
      locale: "by_BY",
      today: "Сёння",
      now: "Зараз",
      backToToday: "Дадзеная дата",
      ok: "Ok",
      clear: "Ачысціць",
      month: "Месяц",
      year: "Год",
      timeSelect: "Выбраць час",
      dateSelect: "Выбраць дату",
      weekSelect: "Выбраць тыдзень",
      monthSelect: "Выбраць месяц",
      yearSelect: "Выбраць год",
      decadeSelect: "Выбраць дзесяцігоддзе",
      yearFormat: "YYYY",
      dateFormat: "D-M-YYYY",
      dayFormat: "D",
      dateTimeFormat: "D-M-YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Папярэдні месяц (PageUp)",
      nextMonth: "Наступны месяц (PageDown)",
      previousYear: "Папярэдні год (Control + left)",
      nextYear: "Наступны год (Control + right)",
      previousDecade: "Папярэдняе дзесяцігоддзе",
      nextDecade: "Наступнае дзесяцігоддзе",
      previousCentury: "Папярэдні век",
      nextCentury: "Наступны век"
    },
    timePickerLocale: {
      placeholder: "Выберыце час",
      rangePlaceholder: ["Час пачатку", "Час заканчэння"]
    }
  },
  global: {
    placeholder: "Калі ласка выберыце"
  },
  Table: {
    filterTitle: "Фільтр",
    filterConfirm: "OK",
    filterReset: "Скінуць",
    filterEmptyText: "Без фільтраў",
    emptyText: "Няма дадзеных",
    selectAll: "Выбраць усе",
    selectInvert: "Інвертаваць выбар",
    selectionAll: "Выбраць усе дадзеныя",
    sortTitle: "Сартаванне",
    expand: "Разгарнуць радок",
    collapse: "Згарнуць радок",
    triggerDesc: "Націсніце для сартавання па змяншэнні",
    triggerAsc: "Націсніце для сартавання па ўзросту",
    cancelSort: "Націсніце, каб адмяніць сартаванне"
  },
  Modal: {
    okText: "OK",
    cancelText: "Адмена",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Адмена"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Пошук",
    itemUnit: "элем.",
    itemsUnit: "элем.",
    remove: "Выдаліць",
    selectAll: "Выбраць усе дадзеныя",
    selectCurrent: "Вылучыць дадзеную старонку",
    selectInvert: "Паказаць у зваротным парадку",
    removeAll: "Выдаліць усе дадзеныя",
    removeCurrent: "Выдаліць дадзеную старонку"
  },
  Upload: {
    uploading: "Загрузка...",
    removeFile: "Выдаліць файл",
    uploadError: "Адбылася памылка пры загрузцы",
    previewFile: "Прадпрагляд файла",
    downloadFile: "Загрузіць файл"
  },
  Empty: {
    description: "Няма дадзеных"
  },
  Icon: {
    icon: "Іконка"
  },
  Text: {
    edit: "Рэдагаваць",
    copy: "Капіяваць",
    copied: "Капіяванне завершана",
    expand: "Разгарнуць"
  },
  PageHeader: {
    back: "Назад"
  }
};
var ca_ES = {
  locale: "ca",
  Pagination: {
    items_per_page: "/ pàgina",
    jump_to: "Anar a",
    jump_to_confirm: "Confirma",
    page: "",
    prev_page: "Pàgina prèvia",
    next_page: "Pàgina següent",
    prev_5: "5 pàgines prèvies",
    next_5: "5 pàgines següents",
    prev_3: "3 pàgines prèvies",
    next_3: "3 pàgines següents",
    page_size: "mida de la pàgina"
  },
  DatePicker: {
    lang: {
      placeholder: "Seleccionar data",
      rangePlaceholder: ["Data inicial", "Data final"],
      locale: "ca_ES",
      today: "Avui",
      now: "Ara",
      backToToday: "Tornar a avui",
      ok: "Acceptar",
      clear: "Netejar",
      month: "Mes",
      year: "Any",
      timeSelect: "Seleccionar hora",
      dateSelect: "Seleccionar data",
      monthSelect: "Escollir un mes",
      yearSelect: "Escollir un any",
      decadeSelect: "Escollir una dècada",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Mes anterior (PageUp)",
      nextMonth: "Mes següent (PageDown)",
      previousYear: "Any anterior (Control + left)",
      nextYear: "Mes següent (Control + right)",
      previousDecade: "Dècada anterior",
      nextDecade: "Dècada següent",
      previousCentury: "Segle anterior",
      nextCentury: "Segle següent"
    },
    timePickerLocale: {
      placeholder: "Seleccionar hora"
    }
  },
  TimePicker: {
    placeholder: "Seleccionar hora"
  },
  Calendar: {
    lang: {
      placeholder: "Seleccionar data",
      rangePlaceholder: ["Data inicial", "Data final"],
      locale: "ca_ES",
      today: "Avui",
      now: "Ara",
      backToToday: "Tornar a avui",
      ok: "Acceptar",
      clear: "Netejar",
      month: "Mes",
      year: "Any",
      timeSelect: "Seleccionar hora",
      dateSelect: "Seleccionar data",
      monthSelect: "Escollir un mes",
      yearSelect: "Escollir un any",
      decadeSelect: "Escollir una dècada",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Mes anterior (PageUp)",
      nextMonth: "Mes següent (PageDown)",
      previousYear: "Any anterior (Control + left)",
      nextYear: "Mes següent (Control + right)",
      previousDecade: "Dècada anterior",
      nextDecade: "Dècada següent",
      previousCentury: "Segle anterior",
      nextCentury: "Segle següent"
    },
    timePickerLocale: {
      placeholder: "Seleccionar hora"
    }
  },
  global: {
    placeholder: "Seleccionar"
  },
  Table: {
    filterTitle: "Filtrar el menú",
    filterConfirm: "D’acord",
    filterReset: "Reiniciar",
    filterEmptyText: "Sense filtres",
    selectAll: "Seleccionar la pàgina actual",
    selectInvert: "Invertir la selecció",
    selectionAll: "Seleccionar-ho tot",
    sortTitle: "Ordenar",
    expand: "Ampliar la fila",
    collapse: "Plegar la fila",
    triggerDesc: "Ordre descendent",
    triggerAsc: "Ordre ascendent",
    cancelSort: "Desactivar l’ordre"
  },
  Modal: {
    okText: "D’acord",
    cancelText: "Cancel·lar",
    justOkText: "D’acord"
  },
  Popconfirm: {
    okText: "D’acord",
    cancelText: "Cancel·lar"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Cercar",
    itemUnit: "ítem",
    itemsUnit: "ítems",
    remove: "Eliminar",
    selectCurrent: "Seleccionar la pàgina actual",
    removeCurrent: "Eliminar la selecció",
    selectAll: "Seleccionar-ho tot",
    removeAll: "Eliminar-ho tot",
    selectInvert: "Invertir la selecció"
  },
  Upload: {
    uploading: "Carregant…",
    removeFile: "Eliminar el fitxer",
    uploadError: "Error de càrrega",
    previewFile: "Vista prèvia del fitxer",
    downloadFile: "Baixar el fitxer"
  },
  Empty: {
    description: "Sense dades"
  },
  Icon: {
    icon: "icona"
  },
  Text: {
    edit: "Editar",
    copy: "Copiar",
    copied: "Copiat",
    expand: "Ampliar"
  },
  PageHeader: {
    back: "Enrere"
  }
};
var cs_CZ = {
  locale: "cs",
  Pagination: {
    items_per_page: "/ strana",
    jump_to: "Přejít",
    jump_to_confirm: "potvrdit",
    page: "",
    prev_page: "Předchozí strana",
    next_page: "Následující strana",
    prev_5: "Předchozích 5 stran",
    next_5: "Následujících 5 stran",
    prev_3: "Předchozí 3 strany",
    next_3: "Následující 3 strany",
    page_size: "velikost stránky"
  },
  DatePicker: {
    lang: {
      placeholder: "Vybrat datum",
      rangePlaceholder: ["Od", "Do"],
      locale: "cs_CZ",
      today: "Dnes",
      now: "Nyní",
      backToToday: "Zpět na dnešek",
      ok: "Ok",
      clear: "Vymazat",
      month: "Měsíc",
      year: "Rok",
      timeSelect: "Vybrat čas",
      dateSelect: "Vybrat datum",
      monthSelect: "Vyberte měsíc",
      yearSelect: "Vyberte rok",
      decadeSelect: "Vyberte dekádu",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Předchozí měsíc (PageUp)",
      nextMonth: "Následující (PageDown)",
      previousYear: "Předchozí rok (Control + left)",
      nextYear: "Následující rok (Control + right)",
      previousDecade: "Předchozí dekáda",
      nextDecade: "Následující dekáda",
      previousCentury: "Předchozí století",
      nextCentury: "Následující století"
    },
    timePickerLocale: {
      placeholder: "Vybrat čas"
    }
  },
  TimePicker: {
    placeholder: "Vybrat čas"
  },
  Calendar: {
    lang: {
      placeholder: "Vybrat datum",
      rangePlaceholder: ["Od", "Do"],
      locale: "cs_CZ",
      today: "Dnes",
      now: "Nyní",
      backToToday: "Zpět na dnešek",
      ok: "Ok",
      clear: "Vymazat",
      month: "Měsíc",
      year: "Rok",
      timeSelect: "Vybrat čas",
      dateSelect: "Vybrat datum",
      monthSelect: "Vyberte měsíc",
      yearSelect: "Vyberte rok",
      decadeSelect: "Vyberte dekádu",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Předchozí měsíc (PageUp)",
      nextMonth: "Následující (PageDown)",
      previousYear: "Předchozí rok (Control + left)",
      nextYear: "Následující rok (Control + right)",
      previousDecade: "Předchozí dekáda",
      nextDecade: "Následující dekáda",
      previousCentury: "Předchozí století",
      nextCentury: "Následující století"
    },
    timePickerLocale: {
      placeholder: "Vybrat čas"
    }
  },
  global: {
    placeholder: "Prosím vyber"
  },
  Table: {
    filterTitle: "Filtr",
    filterConfirm: "Potvrdit",
    filterReset: "Obnovit",
    filterEmptyText: "Žádné filtry",
    selectAll: "Vybrat všechny řádky na současné stránce",
    selectInvert: "Invertovat výběr na současné stránce",
    selectionAll: "Vybrat všechny řádky",
    sortTitle: "Řadit",
    expand: "Rozbalit řádek",
    collapse: "Zabalit řádek",
    triggerDesc: "Klikni pro sestupné řazení",
    triggerAsc: "Klikni pro vzestupné řazení",
    cancelSort: "Klikni pro zrušení řazení"
  },
  Modal: {
    okText: "OK",
    cancelText: "Storno",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Storno"
  },
  Transfer: {
    searchPlaceholder: "Vyhledávání",
    itemUnit: "položka",
    itemsUnit: "položek"
  },
  Upload: {
    uploading: "Nahrávání...",
    removeFile: "Odstranit soubor",
    uploadError: "Chyba při nahrávání",
    previewFile: "Zobrazit soubor",
    downloadFile: "Stáhnout soubor"
  },
  Empty: {
    description: "Žádná data"
  }
};
var da_DK = {
  locale: "da",
  DatePicker: {
    lang: {
      placeholder: "Vælg dato",
      rangePlaceholder: ["Startdato", "Slutdato"],
      locale: "da_DK",
      today: "I dag",
      now: "Nu",
      backToToday: "Gå til i dag",
      ok: "Ok",
      clear: "Ryd",
      month: "Måned",
      year: "År",
      timeSelect: "Vælg tidspunkt",
      dateSelect: "Vælg dato",
      monthSelect: "Vælg måned",
      yearSelect: "Vælg år",
      decadeSelect: "Vælg årti",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Forrige måned (Page Up)",
      nextMonth: "Næste måned (Page Down)",
      previousYear: "Forrige år (Ctrl-venstre pil)",
      nextYear: "Næste år (Ctrl-højre pil)",
      previousDecade: "Forrige årti",
      nextDecade: "Næste årti",
      previousCentury: "Forrige århundrede",
      nextCentury: "Næste århundrede"
    },
    timePickerLocale: {
      placeholder: "Vælg tid",
      rangePlaceholder: ["Starttidspunkt", "Sluttidspunkt"]
    }
  },
  TimePicker: {
    placeholder: "Vælg tid",
    rangePlaceholder: ["Starttidspunkt", "Sluttidspunkt"]
  },
  Calendar: {
    lang: {
      placeholder: "Vælg dato",
      rangePlaceholder: ["Startdato", "Slutdato"],
      locale: "da_DK",
      today: "I dag",
      now: "Nu",
      backToToday: "Gå til i dag",
      ok: "Ok",
      clear: "Ryd",
      month: "Måned",
      year: "År",
      timeSelect: "Vælg tidspunkt",
      dateSelect: "Vælg dato",
      monthSelect: "Vælg måned",
      yearSelect: "Vælg år",
      decadeSelect: "Vælg årti",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Forrige måned (Page Up)",
      nextMonth: "Næste måned (Page Down)",
      previousYear: "Forrige år (Ctrl-venstre pil)",
      nextYear: "Næste år (Ctrl-højre pil)",
      previousDecade: "Forrige årti",
      nextDecade: "Næste årti",
      previousCentury: "Forrige århundrede",
      nextCentury: "Næste århundrede"
    },
    timePickerLocale: {
      placeholder: "Vælg tid",
      rangePlaceholder: ["Starttidspunkt", "Sluttidspunkt"]
    }
  },
  Pagination: {
    items_per_page: "/ side",
    jump_to: "Gå til",
    jump_to_confirm: "bekræft",
    page: "Side",
    prev_page: "Forrige Side",
    next_page: "Næste Side",
    prev_5: "Forrige 5 Sider",
    next_5: "Næste 5 Sider",
    prev_3: "Forrige 3 Sider",
    next_3: "Næste 3 Sider",
    page_size: "sidestørrelse"
  },
  Table: {
    filterTitle: "Filtermenu",
    filterConfirm: "OK",
    filterReset: "Nulstil",
    selectAll: "Vælg alle",
    selectInvert: "Invertér valg",
    filterEmptyText: "Ingen filtre",
    emptyText: "Ingen data",
    selectNone: "Ryd alt data",
    selectionAll: "Vælg alt data",
    sortTitle: "Sortér",
    expand: "Udvid række",
    collapse: "Flet række",
    triggerDesc: "Klik for at sortere faldende",
    triggerAsc: "Klik for at sortere stigende",
    cancelSort: "Klik for at annullere sortering"
  },
  Modal: {
    okText: "OK",
    cancelText: "Afbryd",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Afbryd"
  },
  Transfer: {
    searchPlaceholder: "Søg her",
    itemUnit: "element",
    itemsUnit: "elementer"
  },
  Upload: {
    uploading: "Uploader...",
    removeFile: "Fjern fil",
    uploadError: "Fejl ved upload",
    previewFile: "Forhåndsvisning",
    downloadFile: "Download fil"
  },
  Empty: {
    description: "Ingen data"
  }
};
var de_DE = {
  locale: "de",
  Pagination: {
    items_per_page: "/ Seite",
    jump_to: "Gehe zu",
    jump_to_confirm: "bestätigen",
    page: "Seite",
    prev_page: "Vorherige Seite",
    next_page: "Nächste Seite",
    prev_5: "5 Seiten zurück",
    next_5: "5 Seiten vor",
    prev_3: "3 Seiten zurück",
    next_3: "3 Seiten vor",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Datum auswählen",
      yearPlaceholder: "Jahr auswählen",
      quarterPlaceholder: "Quartal auswählen",
      monthPlaceholder: "Monat auswählen",
      weekPlaceholder: "Woche auswählen",
      rangePlaceholder: ["Startdatum", "Enddatum"],
      rangeYearPlaceholder: ["Startjahr", "Endjahr"],
      rangeMonthPlaceholder: ["Startmonat", "Endmonat"],
      rangeWeekPlaceholder: ["Startwoche", "Endwoche"],
      locale: "de_DE",
      today: "Heute",
      now: "Jetzt",
      backToToday: "Zurück zu Heute",
      ok: "OK",
      clear: "Zurücksetzen",
      month: "Monat",
      year: "Jahr",
      timeSelect: "Zeit wählen",
      dateSelect: "Datum wählen",
      weekSelect: "Woche wählen",
      monthSelect: "Wähle einen Monat",
      yearSelect: "Wähle ein Jahr",
      decadeSelect: "Wähle ein Jahrzehnt",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Vorheriger Monat (PageUp)",
      nextMonth: "Nächster Monat (PageDown)",
      previousYear: "Vorheriges Jahr (Ctrl + left)",
      nextYear: "Nächstes Jahr (Ctrl + right)",
      previousDecade: "Vorheriges Jahrzehnt",
      nextDecade: "Nächstes Jahrzehnt",
      previousCentury: "Vorheriges Jahrhundert",
      nextCentury: "Nächstes Jahrhundert"
    },
    timePickerLocale: {
      placeholder: "Zeit auswählen",
      rangePlaceholder: ["Startzeit", "Endzeit"]
    }
  },
  TimePicker: {
    placeholder: "Zeit auswählen"
  },
  Calendar: {
    lang: {
      placeholder: "Datum auswählen",
      yearPlaceholder: "Jahr auswählen",
      quarterPlaceholder: "Quartal auswählen",
      monthPlaceholder: "Monat auswählen",
      weekPlaceholder: "Woche auswählen",
      rangePlaceholder: ["Startdatum", "Enddatum"],
      rangeYearPlaceholder: ["Startjahr", "Endjahr"],
      rangeMonthPlaceholder: ["Startmonat", "Endmonat"],
      rangeWeekPlaceholder: ["Startwoche", "Endwoche"],
      locale: "de_DE",
      today: "Heute",
      now: "Jetzt",
      backToToday: "Zurück zu Heute",
      ok: "OK",
      clear: "Zurücksetzen",
      month: "Monat",
      year: "Jahr",
      timeSelect: "Zeit wählen",
      dateSelect: "Datum wählen",
      weekSelect: "Woche wählen",
      monthSelect: "Wähle einen Monat",
      yearSelect: "Wähle ein Jahr",
      decadeSelect: "Wähle ein Jahrzehnt",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Vorheriger Monat (PageUp)",
      nextMonth: "Nächster Monat (PageDown)",
      previousYear: "Vorheriges Jahr (Ctrl + left)",
      nextYear: "Nächstes Jahr (Ctrl + right)",
      previousDecade: "Vorheriges Jahrzehnt",
      nextDecade: "Nächstes Jahrzehnt",
      previousCentury: "Vorheriges Jahrhundert",
      nextCentury: "Nächstes Jahrhundert"
    },
    timePickerLocale: {
      placeholder: "Zeit auswählen",
      rangePlaceholder: ["Startzeit", "Endzeit"]
    }
  },
  global: {
    placeholder: "Bitte auswählen"
  },
  Table: {
    filterTitle: "Filter-Menü",
    filterConfirm: "OK",
    filterReset: "Zurücksetzen",
    filterEmptyText: "Keine Filter",
    emptyText: "Keine Daten",
    selectAll: "Selektiere Alle",
    selectInvert: "Selektion Invertieren",
    selectionAll: "Wählen Sie alle Daten aus",
    sortTitle: "Sortieren",
    expand: "Zeile erweitern",
    collapse: "Zeile reduzieren",
    triggerDesc: "Klicken zur absteigenden  Sortierung",
    triggerAsc: "Klicken zur aufsteigenden Sortierung",
    cancelSort: "Klicken zum Abbrechen der Sortierung"
  },
  Modal: {
    okText: "OK",
    cancelText: "Abbrechen",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Abbrechen"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Suchen",
    itemUnit: "Eintrag",
    itemsUnit: "Einträge",
    remove: "Entfernen",
    selectCurrent: "Alle auf aktueller Seite auswählen",
    removeCurrent: "Auswahl auf aktueller Seite aufheben",
    selectAll: "Alle auswählen",
    removeAll: "Auswahl aufheben",
    selectInvert: "Auswahl umkehren"
  },
  Upload: {
    uploading: "Hochladen...",
    removeFile: "Datei entfernen",
    uploadError: "Fehler beim Hochladen",
    previewFile: "Dateivorschau",
    downloadFile: "Download-Datei"
  },
  Empty: {
    description: "Keine Daten"
  },
  Text: {
    edit: "Bearbeiten",
    copy: "Kopieren",
    copied: "Kopiert",
    expand: "Erweitern"
  },
  PageHeader: {
    back: "Zurück"
  },
  Image: {
    preview: "Vorschau"
  }
};
var el_GR = {
  locale: "el",
  Pagination: {
    items_per_page: "/ σελίδα",
    jump_to: "Μετάβαση",
    jump_to_confirm: "επιβεβαιώνω",
    page: "",
    prev_page: "Προηγούμενη Σελίδα",
    next_page: "Επόμενη Σελίδα",
    prev_5: "Προηγούμενες 5 Σελίδες",
    next_5: "Επόμενες 5 σελίδες",
    prev_3: "Προηγούμενες 3 Σελίδες",
    next_3: "Επόμενες 3 Σελίδες",
    page_size: "Μέγεθος σελίδας"
  },
  DatePicker: {
    lang: {
      placeholder: "Επιλέξτε ημερομηνία",
      rangePlaceholder: ["Αρχική ημερομηνία", "Τελική ημερομηνία"],
      locale: "el_GR",
      today: "Σήμερα",
      now: "Τώρα",
      backToToday: "Πίσω στη σημερινή μέρα",
      ok: "Ok",
      clear: "Καθαρισμός",
      month: "Μήνας",
      year: "Έτος",
      timeSelect: "Επιλογή ώρας",
      dateSelect: "Επιλογή ημερομηνίας",
      monthSelect: "Επιλογή μήνα",
      yearSelect: "Επιλογή έτους",
      decadeSelect: "Επιλογή δεκαετίας",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Προηγούμενος μήνας (PageUp)",
      nextMonth: "Επόμενος μήνας (PageDown)",
      previousYear: "Προηγούμενο έτος (Control + αριστερά)",
      nextYear: "Επόμενο έτος (Control + δεξιά)",
      previousDecade: "Προηγούμενη δεκαετία",
      nextDecade: "Επόμενη δεκαετία",
      previousCentury: "Προηγούμενος αιώνας",
      nextCentury: "Επόμενος αιώνας"
    },
    timePickerLocale: {
      placeholder: "Επιλέξτε ώρα"
    }
  },
  TimePicker: {
    placeholder: "Επιλέξτε ώρα"
  },
  Calendar: {
    lang: {
      placeholder: "Επιλέξτε ημερομηνία",
      rangePlaceholder: ["Αρχική ημερομηνία", "Τελική ημερομηνία"],
      locale: "el_GR",
      today: "Σήμερα",
      now: "Τώρα",
      backToToday: "Πίσω στη σημερινή μέρα",
      ok: "Ok",
      clear: "Καθαρισμός",
      month: "Μήνας",
      year: "Έτος",
      timeSelect: "Επιλογή ώρας",
      dateSelect: "Επιλογή ημερομηνίας",
      monthSelect: "Επιλογή μήνα",
      yearSelect: "Επιλογή έτους",
      decadeSelect: "Επιλογή δεκαετίας",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Προηγούμενος μήνας (PageUp)",
      nextMonth: "Επόμενος μήνας (PageDown)",
      previousYear: "Προηγούμενο έτος (Control + αριστερά)",
      nextYear: "Επόμενο έτος (Control + δεξιά)",
      previousDecade: "Προηγούμενη δεκαετία",
      nextDecade: "Επόμενη δεκαετία",
      previousCentury: "Προηγούμενος αιώνας",
      nextCentury: "Επόμενος αιώνας"
    },
    timePickerLocale: {
      placeholder: "Επιλέξτε ώρα"
    }
  },
  Table: {
    filterTitle: "Μενού φίλτρων",
    filterConfirm: "ΟΚ",
    filterReset: "Επαναφορά",
    selectAll: "Επιλογή τρέχουσας σελίδας",
    selectInvert: "Αντιστροφή τρέχουσας σελίδας"
  },
  Modal: {
    okText: "ΟΚ",
    cancelText: "Άκυρο",
    justOkText: "ΟΚ"
  },
  Popconfirm: {
    okText: "ΟΚ",
    cancelText: "Άκυρο"
  },
  Transfer: {
    searchPlaceholder: "Αναζήτηση",
    itemUnit: "αντικείμενο",
    itemsUnit: "αντικείμενα"
  },
  Upload: {
    uploading: "Μεταφόρτωση...",
    removeFile: "Αφαίρεση αρχείου",
    uploadError: "Σφάλμα μεταφόρτωσης",
    previewFile: "Προεπισκόπηση αρχείου",
    downloadFile: "Λήψη αρχείου"
  },
  Empty: {
    description: "Δεν υπάρχουν δεδομένα"
  }
};
var en_GB = {
  locale: "en-gb",
  Pagination: {
    items_per_page: "/ page",
    jump_to: "Go to",
    jump_to_confirm: "confirm",
    page: "Page",
    prev_page: "Previous Page",
    next_page: "Next Page",
    prev_5: "Previous 5 Pages",
    next_5: "Next 5 Pages",
    prev_3: "Previous 3 Pages",
    next_3: "Next 3 Pages",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Select date",
      yearPlaceholder: "Select year",
      quarterPlaceholder: "Select quarter",
      monthPlaceholder: "Select month",
      weekPlaceholder: "Select week",
      rangePlaceholder: ["Start date", "End date"],
      rangeYearPlaceholder: ["Start year", "End year"],
      rangeMonthPlaceholder: ["Start month", "End month"],
      rangeWeekPlaceholder: ["Start week", "End week"],
      locale: "en_GB",
      today: "Today",
      now: "Now",
      backToToday: "Back to today",
      ok: "Ok",
      clear: "Clear",
      month: "Month",
      year: "Year",
      timeSelect: "Select time",
      dateSelect: "Select date",
      weekSelect: "Choose a week",
      monthSelect: "Choose a month",
      yearSelect: "Choose a year",
      decadeSelect: "Choose a decade",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Previous month (PageUp)",
      nextMonth: "Next month (PageDown)",
      previousYear: "Last year (Control + left)",
      nextYear: "Next year (Control + right)",
      previousDecade: "Last decade",
      nextDecade: "Next decade",
      previousCentury: "Last century",
      nextCentury: "Next century"
    },
    timePickerLocale: {
      placeholder: "Select time",
      rangePlaceholder: ["Start time", "End time"]
    }
  },
  TimePicker: {
    placeholder: "Select time",
    rangePlaceholder: ["Start time", "End time"]
  },
  Calendar: {
    lang: {
      placeholder: "Select date",
      yearPlaceholder: "Select year",
      quarterPlaceholder: "Select quarter",
      monthPlaceholder: "Select month",
      weekPlaceholder: "Select week",
      rangePlaceholder: ["Start date", "End date"],
      rangeYearPlaceholder: ["Start year", "End year"],
      rangeMonthPlaceholder: ["Start month", "End month"],
      rangeWeekPlaceholder: ["Start week", "End week"],
      locale: "en_GB",
      today: "Today",
      now: "Now",
      backToToday: "Back to today",
      ok: "Ok",
      clear: "Clear",
      month: "Month",
      year: "Year",
      timeSelect: "Select time",
      dateSelect: "Select date",
      weekSelect: "Choose a week",
      monthSelect: "Choose a month",
      yearSelect: "Choose a year",
      decadeSelect: "Choose a decade",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Previous month (PageUp)",
      nextMonth: "Next month (PageDown)",
      previousYear: "Last year (Control + left)",
      nextYear: "Next year (Control + right)",
      previousDecade: "Last decade",
      nextDecade: "Next decade",
      previousCentury: "Last century",
      nextCentury: "Next century"
    },
    timePickerLocale: {
      placeholder: "Select time",
      rangePlaceholder: ["Start time", "End time"]
    }
  },
  global: {
    placeholder: "Please select"
  },
  Table: {
    filterTitle: "Filter menu",
    filterConfirm: "OK",
    filterReset: "Reset",
    filterEmptyText: "No filters",
    emptyText: "No data",
    selectAll: "Select current page",
    selectInvert: "Invert current page",
    selectionAll: "Select all data",
    sortTitle: "Sort",
    expand: "Expand row",
    collapse: "Collapse row",
    triggerDesc: "Click to sort descending",
    triggerAsc: "Click to sort ascending",
    cancelSort: "Click to cancel sorting",
    selectNone: "Clear all data"
  },
  Modal: {
    okText: "OK",
    cancelText: "Cancel",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Cancel"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Search here",
    itemUnit: "item",
    itemsUnit: "items",
    remove: "Remove",
    selectCurrent: "Select current page",
    removeCurrent: "Remove current page",
    selectAll: "Select all data",
    removeAll: "Remove all data",
    selectInvert: "Invert current page"
  },
  Upload: {
    uploading: "Uploading...",
    removeFile: "Remove file",
    uploadError: "Upload error",
    previewFile: "Preview file",
    downloadFile: "Download file"
  },
  Empty: {
    description: "No data"
  },
  Icon: {
    icon: "icon"
  },
  Text: {
    edit: "Edit",
    copy: "Copy",
    copied: "Copied",
    expand: "Expand"
  },
  PageHeader: {
    back: "Back"
  }
};
var es_ES = {
  locale: "es",
  Pagination: {
    items_per_page: "/ página",
    jump_to: "Ir a",
    jump_to_confirm: "confirmar",
    page: "Página",
    prev_page: "Página anterior",
    next_page: "Página siguiente",
    prev_5: "5 páginas previas",
    next_5: "5 páginas siguientes",
    prev_3: "3 páginas previas",
    next_3: "3 páginas siguientes",
    page_size: "tamaño de página"
  },
  DatePicker: {
    lang: {
      placeholder: "Seleccionar fecha",
      yearPlaceholder: "Seleccionar año",
      quarterPlaceholder: "Seleccionar trimestre",
      monthPlaceholder: "Seleccionar mes",
      weekPlaceholder: "Seleccionar semana",
      rangePlaceholder: ["Fecha inicial", "Fecha final"],
      rangeYearPlaceholder: ["Año inicial", "Año final"],
      rangeMonthPlaceholder: ["Mes inicial", "Mes final"],
      rangeWeekPlaceholder: ["Semana inicial", "Semana final"],
      locale: "es_ES",
      today: "Hoy",
      now: "Ahora",
      backToToday: "Volver a hoy",
      ok: "Aceptar",
      clear: "Limpiar",
      month: "Mes",
      year: "Año",
      timeSelect: "Seleccionar hora",
      dateSelect: "Seleccionar fecha",
      weekSelect: "Elegir una semana",
      monthSelect: "Elegir un mes",
      yearSelect: "Elegir un año",
      decadeSelect: "Elegir una década",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Mes anterior (PageUp)",
      nextMonth: "Mes siguiente (PageDown)",
      previousYear: "Año anterior (Control + left)",
      nextYear: "Año siguiente (Control + right)",
      previousDecade: "Década anterior",
      nextDecade: "Década siguiente",
      previousCentury: "Siglo anterior",
      nextCentury: "Siglo siguiente"
    },
    timePickerLocale: {
      placeholder: "Seleccionar hora",
      rangePlaceholder: ["Hora inicial", "Hora final"]
    }
  },
  TimePicker: {
    placeholder: "Seleccionar hora",
    rangePlaceholder: ["Hora inicial", "Hora final"]
  },
  Calendar: {
    lang: {
      placeholder: "Seleccionar fecha",
      yearPlaceholder: "Seleccionar año",
      quarterPlaceholder: "Seleccionar trimestre",
      monthPlaceholder: "Seleccionar mes",
      weekPlaceholder: "Seleccionar semana",
      rangePlaceholder: ["Fecha inicial", "Fecha final"],
      rangeYearPlaceholder: ["Año inicial", "Año final"],
      rangeMonthPlaceholder: ["Mes inicial", "Mes final"],
      rangeWeekPlaceholder: ["Semana inicial", "Semana final"],
      locale: "es_ES",
      today: "Hoy",
      now: "Ahora",
      backToToday: "Volver a hoy",
      ok: "Aceptar",
      clear: "Limpiar",
      month: "Mes",
      year: "Año",
      timeSelect: "Seleccionar hora",
      dateSelect: "Seleccionar fecha",
      weekSelect: "Elegir una semana",
      monthSelect: "Elegir un mes",
      yearSelect: "Elegir un año",
      decadeSelect: "Elegir una década",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Mes anterior (AvPág)",
      nextMonth: "Mes siguiente (RePág)",
      previousYear: "Año anterior (Control + izquierda)",
      nextYear: "Año siguiente (Control + derecha)",
      previousDecade: "Década anterior",
      nextDecade: "Década siguiente",
      previousCentury: "Siglo anterior",
      nextCentury: "Siglo siguiente"
    },
    timePickerLocale: {
      placeholder: "Seleccionar hora",
      rangePlaceholder: ["Hora inicial", "Hora final"]
    }
  },
  global: {
    placeholder: "Seleccione"
  },
  Table: {
    filterTitle: "Filtrar menú",
    filterConfirm: "Aceptar",
    filterReset: "Reiniciar",
    filterEmptyText: "Sin filtros",
    emptyText: "Sin datos",
    selectAll: "Seleccionar todo",
    selectInvert: "Invertir selección",
    selectionAll: "Seleccionar todos los datos",
    sortTitle: "Ordenar",
    expand: "Expandir fila",
    collapse: "Colapsar fila",
    triggerDesc: "Click para ordenar descendentemente",
    triggerAsc: "Click para ordenar ascendentemenre",
    cancelSort: "Click para cancelar ordenación",
    filterCheckall: "Seleccionar todos los filtros",
    filterSearchPlaceholder: "Buscar en filtros",
    selectNone: "Vaciar todo"
  },
  Modal: {
    okText: "Aceptar",
    cancelText: "Cancelar",
    justOkText: "Aceptar"
  },
  Popconfirm: {
    okText: "Aceptar",
    cancelText: "Cancelar"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Buscar aquí",
    itemUnit: "elemento",
    itemsUnit: "elementos",
    remove: "Eliminar",
    selectCurrent: "Seleccionar página actual",
    removeCurrent: "Eliminar página actual",
    selectAll: "Seleccionar todos los datos",
    removeAll: "Eliminar todos los datos",
    selectInvert: "Invertir página actual"
  },
  Upload: {
    uploading: "Subiendo...",
    removeFile: "Eliminar archivo",
    uploadError: "Error al subir el archivo",
    previewFile: "Vista previa",
    downloadFile: "Descargar archivo"
  },
  Empty: {
    description: "No hay datos"
  },
  Icon: {
    icon: "icono"
  },
  Text: {
    edit: "Editar",
    copy: "Copiar",
    copied: "Copiado",
    expand: "Expandir"
  },
  PageHeader: {
    back: "Volver"
  },
  Image: {
    preview: "Previsualización"
  }
};
var et_EE = {
  locale: "et",
  Pagination: {
    items_per_page: "/ leheküljel",
    jump_to: "Hüppa",
    jump_to_confirm: "Kinnitage",
    page: "",
    prev_page: "Eelmine leht",
    next_page: "Järgmine leht",
    prev_5: "Eelmised 5 lehekülge",
    next_5: "Järgmised 5 lehekülge",
    prev_3: "Eelmised 3 lehekülge",
    next_3: "Järgmised 3 lehekülge",
    page_size: "lehe suurus"
  },
  DatePicker: {
    lang: {
      placeholder: "Vali kuupäev",
      rangePlaceholder: ["Algus kuupäev", "Lõpu kuupäev"],
      locale: "et_EE",
      today: "Täna",
      now: "Praegu",
      backToToday: "Tagasi tänase juurde",
      ok: "Ok",
      clear: "Tühista",
      month: "Kuu",
      year: "Aasta",
      timeSelect: "Vali aeg",
      dateSelect: "Vali kuupäev",
      monthSelect: "Vali kuu",
      yearSelect: "Vali aasta",
      decadeSelect: "Vali dekaad",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Eelmine kuu (PageUp)",
      nextMonth: "Järgmine kuu (PageDown)",
      previousYear: "Eelmine aasta (Control + left)",
      nextYear: "Järgmine aasta (Control + right)",
      previousDecade: "Eelmine dekaad",
      nextDecade: "Järgmine dekaad",
      previousCentury: "Eelmine sajand",
      nextCentury: "Järgmine sajand"
    },
    timePickerLocale: {
      placeholder: "Vali aeg"
    }
  },
  TimePicker: {
    placeholder: "Vali aeg"
  },
  Calendar: {
    lang: {
      placeholder: "Vali kuupäev",
      rangePlaceholder: ["Algus kuupäev", "Lõpu kuupäev"],
      locale: "et_EE",
      today: "Täna",
      now: "Praegu",
      backToToday: "Tagasi tänase juurde",
      ok: "Ok",
      clear: "Tühista",
      month: "Kuu",
      year: "Aasta",
      timeSelect: "Vali aeg",
      dateSelect: "Vali kuupäev",
      monthSelect: "Vali kuu",
      yearSelect: "Vali aasta",
      decadeSelect: "Vali dekaad",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Eelmine kuu (PageUp)",
      nextMonth: "Järgmine kuu (PageDown)",
      previousYear: "Eelmine aasta (Control + left)",
      nextYear: "Järgmine aasta (Control + right)",
      previousDecade: "Eelmine dekaad",
      nextDecade: "Järgmine dekaad",
      previousCentury: "Eelmine sajand",
      nextCentury: "Järgmine sajand"
    },
    timePickerLocale: {
      placeholder: "Vali aeg"
    }
  },
  Table: {
    filterTitle: "Filtri menüü",
    filterConfirm: "OK",
    filterReset: "Nulli",
    selectAll: "Vali kõik",
    selectInvert: "Inverteeri valik",
    filterEmptyText: "Filtreid pole",
    filterCheckall: "Vali kõik",
    filterSearchPlaceholder: "Otsi filtritest",
    emptyText: "Andmed puuduvad",
    selectNone: "Kustuta kõik andmed",
    selectionAll: "Vali kõik andmed",
    sortTitle: "Sorteeri",
    expand: "Laienda rida",
    collapse: "Ahenda rida",
    triggerDesc: "Klõpsa kahanevalt sortimiseks",
    triggerAsc: "Klõpsa kasvavalt sortimiseks",
    cancelSort: "Klõpsa sortimise tühistamiseks"
  },
  Modal: {
    okText: "OK",
    cancelText: "Tühista",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Tühista"
  },
  Transfer: {
    searchPlaceholder: "Otsi siit",
    itemUnit: "kogus",
    itemsUnit: "kogused",
    titles: ["", ""],
    remove: "Eemalda",
    selectCurrent: "Vali praegune leht",
    removeCurrent: "Eemalda praegune leht",
    selectAll: "Vali kõik",
    removeAll: "Eemalda kõik andmed",
    selectInvert: "Inverteeri valik"
  },
  Upload: {
    uploading: "Üleslaadimine...",
    removeFile: "Eemalda fail",
    uploadError: "Üleslaadimise tõrge",
    previewFile: "Faili eelvaade",
    downloadFile: "Lae fail alla"
  },
  Empty: {
    description: "Andmed puuduvad"
  },
  global: {
    placeholder: "Palun vali"
  },
  Icon: {
    icon: "ikoon"
  },
  Text: {
    edit: "Muuda",
    copy: "Kopeeri",
    copied: "Kopeeritud",
    expand: "Laienda"
  },
  PageHeader: {
    back: "Tagasi"
  },
  Image: {
    preview: "Eelvaade"
  }
};
var fa_IR = {
  locale: "fa",
  Pagination: {
    items_per_page: "/ صفحه",
    jump_to: "برو به",
    jump_to_confirm: "تایید",
    page: "",
    prev_page: "صفحه قبلی",
    next_page: "صفحه بعدی",
    prev_5: "۵ صفحه قبلی",
    next_5: "۵ صفحه بعدی",
    prev_3: "۳ صفحه قبلی",
    next_3: "۳ صفحه بعدی",
    page_size: "اندازه صفحه"
  },
  DatePicker: {
    lang: {
      placeholder: "انتخاب تاریخ",
      yearPlaceholder: "انتخاب سال",
      quarterPlaceholder: "انتخاب فصل",
      monthPlaceholder: "انتخاب ماه",
      weekPlaceholder: "انتخاب هفته",
      rangePlaceholder: ["تاریخ شروع", "تاریخ پایان"],
      rangeYearPlaceholder: ["سال شروع", "سال پایان"],
      rangeMonthPlaceholder: ["ماه شروع", "ماه پایان"],
      rangeWeekPlaceholder: ["هفته شروع", "هفته پایان"],
      locale: "fa_IR",
      today: "امروز",
      now: "اکنون",
      backToToday: "بازگشت به روز",
      ok: "باشه",
      clear: "پاک کردن",
      month: "ماه",
      year: "سال",
      timeSelect: "انتخاب زمان",
      dateSelect: "انتخاب تاریخ",
      weekSelect: "یک هفته رو انتخاب کنید",
      monthSelect: "یک ماه را انتخاب کنید",
      yearSelect: "یک سال را انتخاب کنید",
      decadeSelect: "یک دهه را انتخاب کنید",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "ماه قبل (PageUp)",
      nextMonth: "ماه بعد (PageDown)",
      previousYear: "سال قبل (Control + left)",
      nextYear: "سال بعد (Control + right)",
      previousDecade: "دهه قبل",
      nextDecade: "دهه بعد",
      previousCentury: "قرن قبل",
      nextCentury: "قرن بعد"
    },
    timePickerLocale: {
      placeholder: "انتخاب زمان",
      rangePlaceholder: ["زمان شروع", "زمان پایان"]
    }
  },
  TimePicker: {
    placeholder: "انتخاب زمان",
    rangePlaceholder: ["زمان شروع", "زمان پایان"]
  },
  Calendar: {
    lang: {
      placeholder: "انتخاب تاریخ",
      yearPlaceholder: "انتخاب سال",
      quarterPlaceholder: "انتخاب فصل",
      monthPlaceholder: "انتخاب ماه",
      weekPlaceholder: "انتخاب هفته",
      rangePlaceholder: ["تاریخ شروع", "تاریخ پایان"],
      rangeYearPlaceholder: ["سال شروع", "سال پایان"],
      rangeMonthPlaceholder: ["ماه شروع", "ماه پایان"],
      rangeWeekPlaceholder: ["هفته شروع", "هفته پایان"],
      locale: "fa_IR",
      today: "امروز",
      now: "اکنون",
      backToToday: "بازگشت به روز",
      ok: "باشه",
      clear: "پاک کردن",
      month: "ماه",
      year: "سال",
      timeSelect: "انتخاب زمان",
      dateSelect: "انتخاب تاریخ",
      weekSelect: "انتخاب هفته",
      monthSelect: "یک ماه را انتخاب کنید",
      yearSelect: "یک سال را انتخاب کنید",
      decadeSelect: "یک دهه را انتخاب کنید",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "ماه قبل (PageUp)",
      nextMonth: "ماه بعد (PageDown)",
      previousYear: "سال قبل (Control + left)",
      nextYear: "سال بعد (Control + right)",
      previousDecade: "دهه قبل",
      nextDecade: "دهه بعد",
      previousCentury: "قرن قبل",
      nextCentury: "قرن بعد"
    },
    timePickerLocale: {
      placeholder: "انتخاب زمان",
      rangePlaceholder: ["زمان شروع", "زمان پایان"]
    }
  },
  global: {
    placeholder: "لطفا انتخاب کنید"
  },
  Table: {
    filterTitle: "منوی فیلتر",
    filterConfirm: "تایید",
    filterReset: "پاک کردن",
    filterEmptyText: "بدون فیلتر",
    emptyText: "بدون داده",
    selectAll: "انتخاب صفحه‌ی کنونی",
    selectInvert: "معکوس کردن انتخاب‌ها در صفحه ی کنونی",
    selectionAll: "انتخاب همه داده‌ها",
    sortTitle: "مرتب سازی",
    expand: "باز شدن ردیف",
    collapse: "بستن ردیف",
    triggerDesc: "ترتیب نزولی",
    triggerAsc: "ترتیب صعودی",
    cancelSort: "لغوِ ترتیبِ داده شده",
    filterCheckall: "انتخاب همه موارد",
    filterSearchPlaceholder: "جست‌و‌جو در فیلتر‌ها",
    selectNone: "انتخاب هیچکدام"
  },
  Modal: {
    okText: "تایید",
    cancelText: "لغو",
    justOkText: "تایید"
  },
  Popconfirm: {
    okText: "تایید",
    cancelText: "لغو"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "جستجو",
    itemUnit: "عدد",
    itemsUnit: "عدد",
    remove: "حذف",
    selectCurrent: "انتخاب صفحه فعلی",
    removeCurrent: "پاک کردن انتخاب‌های صفحه فعلی",
    selectAll: "انتخاب همه",
    removeAll: "پاک کردن همه انتخاب‌ها",
    selectInvert: "معکوس کردن انتخاب‌ها در صفحه ی کنونی"
  },
  Upload: {
    uploading: "در حال آپلود...",
    removeFile: "حذف فایل",
    uploadError: "خطا در آپلود",
    previewFile: "مشاهده‌ی فایل",
    downloadFile: "دریافت فایل"
  },
  Empty: {
    description: "داده‌ای موجود نیست"
  },
  Icon: {
    icon: "آیکن"
  },
  Text: {
    edit: "ویرایش",
    copy: "کپی",
    copied: "کپی شد",
    expand: "توسعه"
  },
  PageHeader: {
    back: "برگشت"
  },
  Image: {
    preview: "نمایش"
  },
  CronExpression: {
    cronError: "Invalid cron expression",
    second: "ثانیه",
    minute: "دقیقه",
    hour: "ساعت",
    day: "روز",
    month: "ماه",
    week: "هفته"
  },
  QRCode: {
    expired: "کد QR منقضی شده است",
    refresh: "تازه کردن"
  }
};
var fi_FI = {
  locale: "fi",
  Pagination: {
    items_per_page: "/ sivu",
    jump_to: "Mene",
    jump_to_confirm: "Potvrdite",
    page: "Sivu",
    prev_page: "Edellinen sivu",
    next_page: "Seuraava sivu",
    prev_5: "Edelliset 5 sivua",
    next_5: "Seuraavat 5 sivua",
    prev_3: "Edelliset 3 sivua",
    next_3: "Seuraavat 3 sivua",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Valitse päivä",
      rangePlaceholder: ["Alkamispäivä", "Päättymispäivä"],
      locale: "fi_FI",
      today: "Tänään",
      now: "Nyt",
      backToToday: "Tämä päivä",
      ok: "Ok",
      clear: "Tyhjennä",
      month: "Kuukausi",
      year: "Vuosi",
      timeSelect: "Valise aika",
      dateSelect: "Valitse päivä",
      monthSelect: "Valitse kuukausi",
      yearSelect: "Valitse vuosi",
      decadeSelect: "Valitse vuosikymmen",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Edellinen kuukausi (PageUp)",
      nextMonth: "Seuraava kuukausi (PageDown)",
      previousYear: "Edellinen vuosi (Control + left)",
      nextYear: "Seuraava vuosi (Control + right)",
      previousDecade: "Edellinen vuosikymmen",
      nextDecade: "Seuraava vuosikymmen",
      previousCentury: "Edellinen vuosisata",
      nextCentury: "Seuraava vuosisata"
    },
    timePickerLocale: {
      placeholder: "Valitse aika"
    }
  },
  TimePicker: {
    placeholder: "Valitse aika"
  },
  Calendar: {
    lang: {
      placeholder: "Valitse päivä",
      rangePlaceholder: ["Alkamispäivä", "Päättymispäivä"],
      locale: "fi_FI",
      today: "Tänään",
      now: "Nyt",
      backToToday: "Tämä päivä",
      ok: "Ok",
      clear: "Tyhjennä",
      month: "Kuukausi",
      year: "Vuosi",
      timeSelect: "Valise aika",
      dateSelect: "Valitse päivä",
      monthSelect: "Valitse kuukausi",
      yearSelect: "Valitse vuosi",
      decadeSelect: "Valitse vuosikymmen",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Edellinen kuukausi (PageUp)",
      nextMonth: "Seuraava kuukausi (PageDown)",
      previousYear: "Edellinen vuosi (Control + left)",
      nextYear: "Seuraava vuosi (Control + right)",
      previousDecade: "Edellinen vuosikymmen",
      nextDecade: "Seuraava vuosikymmen",
      previousCentury: "Edellinen vuosisata",
      nextCentury: "Seuraava vuosisata"
    },
    timePickerLocale: {
      placeholder: "Valitse aika"
    }
  },
  Table: {
    filterTitle: "Suodatus valikko",
    filterConfirm: "OK",
    filterReset: "Tyhjennä",
    selectAll: "Valitse kaikki",
    selectInvert: "Valitse päinvastoin",
    sortTitle: "Lajittele",
    triggerDesc: "Lajittele laskevasti",
    triggerAsc: "Lajittele nousevasti",
    cancelSort: "Peruuta lajittelu"
  },
  Modal: {
    okText: "OK",
    cancelText: "Peruuta",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Peruuta"
  },
  Transfer: {
    searchPlaceholder: "Etsi täältä",
    itemUnit: "kohde",
    itemsUnit: "kohdetta"
  },
  Upload: {
    uploading: "Lähetetään...",
    removeFile: "Poista tiedosto",
    uploadError: "Virhe lähetyksessä",
    previewFile: "Esikatsele tiedostoa",
    downloadFile: "Lataa tiedosto"
  },
  Empty: {
    description: "Ei kohteita"
  },
  Text: {
    edit: "Muokkaa",
    copy: "Kopioi",
    copied: "Kopioitu",
    expand: "Näytä lisää"
  }
};
var fr_BE = {
  locale: "fr",
  Pagination: {
    items_per_page: "/ page",
    jump_to: "Aller à",
    jump_to_confirm: "confirmer",
    page: "Page",
    prev_page: "Page précédente",
    next_page: "Page suivante",
    prev_5: "5 Pages précédentes",
    next_5: "5 Pages suivantes",
    prev_3: "3 Pages précédentes",
    next_3: "3 Pages suivantes",
    page_size: "taille de la page"
  },
  DatePicker: {
    lang: {
      placeholder: "Sélectionner une date",
      yearPlaceholder: "Sélectionner une année",
      quarterPlaceholder: "Sélectionner un trimestre",
      monthPlaceholder: "Sélectionner un mois",
      weekPlaceholder: "Sélectionner une semaine",
      rangePlaceholder: ["Date de début", "Date de fin"],
      rangeYearPlaceholder: ["Année de début", "Année de fin"],
      rangeMonthPlaceholder: ["Mois de début", "Mois de fin"],
      rangeWeekPlaceholder: ["Semaine de début", "Semaine de fin"],
      locale: "fr_BE",
      today: "Aujourd'hui",
      now: "Maintenant",
      backToToday: "Aujourd'hui",
      ok: "Ok",
      clear: "Rétablir",
      month: "Mois",
      year: "Année",
      timeSelect: "Sélectionner l'heure",
      dateSelect: "Sélectionner la date",
      weekSelect: "Choisissez une semaine",
      monthSelect: "Choisissez un mois",
      yearSelect: "Choisissez une année",
      decadeSelect: "Choisissez une décennie",
      yearFormat: "YYYY",
      dateFormat: "DD/MM/YYYY",
      dayFormat: "DD",
      dateTimeFormat: "DD/MM/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Mois précédent (PageUp)",
      nextMonth: "Mois suivant (PageDown)",
      previousYear: "Année précédente (Ctrl + gauche)",
      nextYear: "Année prochaine (Ctrl + droite)",
      previousDecade: "Décennie précédente",
      nextDecade: "Décennie suivante",
      previousCentury: "Siècle précédent",
      nextCentury: "Siècle suivant"
    },
    timePickerLocale: {
      placeholder: "Sélectionner l'heure",
      rangePlaceholder: ["Heure de début", "Heure de fin"]
    }
  },
  TimePicker: {
    placeholder: "Sélectionner l'heure",
    rangePlaceholder: ["Heure de début", "Heure de fin"]
  },
  Calendar: {
    lang: {
      placeholder: "Sélectionner une date",
      yearPlaceholder: "Sélectionner une année",
      quarterPlaceholder: "Sélectionner un trimestre",
      monthPlaceholder: "Sélectionner un mois",
      weekPlaceholder: "Sélectionner une semaine",
      rangePlaceholder: ["Date de début", "Date de fin"],
      rangeYearPlaceholder: ["Année de début", "Année de fin"],
      rangeMonthPlaceholder: ["Mois de début", "Mois de fin"],
      rangeWeekPlaceholder: ["Semaine de début", "Semaine de fin"],
      locale: "fr_BE",
      today: "Aujourd'hui",
      now: "Maintenant",
      backToToday: "Aujourd'hui",
      ok: "Ok",
      clear: "Rétablir",
      month: "Mois",
      year: "Année",
      timeSelect: "Sélectionner l'heure",
      dateSelect: "Sélectionner la date",
      monthSelect: "Choisissez un mois",
      yearSelect: "Choisissez une année",
      decadeSelect: "Choisissez une décennie",
      yearFormat: "YYYY",
      dateFormat: "DD/MM/YYYY",
      dayFormat: "DD",
      dateTimeFormat: "DD/MM/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Mois précédent (PageUp)",
      nextMonth: "Mois suivant (PageDown)",
      previousYear: "Année précédente (Ctrl + gauche)",
      nextYear: "Année prochaine (Ctrl + droite)",
      previousDecade: "Décennie précédente",
      nextDecade: "Décennie suivante",
      previousCentury: "Siècle précédent",
      nextCentury: "Siècle suivant"
    },
    timePickerLocale: {
      placeholder: "Sélectionner l'heure",
      rangePlaceholder: ["Heure de début", "Heure de fin"]
    }
  },
  global: {
    placeholder: "Sélectionner"
  },
  Table: {
    filterTitle: "Filtrer",
    filterConfirm: "OK",
    filterReset: "Réinitialiser",
    selectAll: "Sélectionner la page actuelle",
    selectInvert: "Inverser la sélection de la page actuelle",
    selectionAll: "Sélectionner toutes les données",
    sortTitle: "Trier",
    expand: "Développer la ligne",
    collapse: "Réduire la ligne",
    triggerDesc: "Trier par ordre décroissant",
    triggerAsc: "Trier par ordre croissant",
    cancelSort: "Annuler le tri",
    filterEmptyText: "Aucun filtre",
    emptyText: "Aucune donnée",
    selectNone: "Désélectionner toutes les données"
  },
  Modal: {
    okText: "OK",
    cancelText: "Annuler",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Annuler"
  },
  Transfer: {
    searchPlaceholder: "Rechercher",
    itemUnit: "élément",
    itemsUnit: "éléments",
    titles: ["", ""],
    remove: "Désélectionner",
    selectCurrent: "Sélectionner la page actuelle",
    removeCurrent: "Désélectionner la page actuelle",
    selectAll: "Sélectionner toutes les données",
    removeAll: "Désélectionner toutes les données",
    selectInvert: "Inverser la sélection de la page actuelle"
  },
  Empty: {
    description: "Aucune donnée"
  },
  Upload: {
    uploading: "Téléchargement...",
    removeFile: "Effacer le fichier",
    uploadError: "Erreur de téléchargement",
    previewFile: "Fichier de prévisualisation",
    downloadFile: "Télécharger un fichier"
  },
  Text: {
    edit: "Éditer",
    copy: "Copier",
    copied: "Copie effectuée",
    expand: "Développer"
  },
  PageHeader: {
    back: "Retour"
  },
  Icon: {
    icon: "icône"
  },
  Image: {
    preview: "Aperçu"
  },
  CronExpression: {
    cronError: "Expression CRON invalide",
    second: "seconde",
    minute: "minute",
    hour: "heure",
    day: "jour",
    month: "mois",
    week: "semaine"
  },
  QRCode: {
    expired: "QR code expiré",
    refresh: "Rafraîchir"
  }
};
var fr_CA = {
  locale: "fr",
  Pagination: {
    items_per_page: "/ page",
    jump_to: "Aller à",
    jump_to_confirm: "confirmer",
    page: "Page",
    prev_page: "Page précédente",
    next_page: "Page suivante",
    prev_5: "5 Pages précédentes",
    next_5: "5 Pages suivantes",
    prev_3: "3 Pages précédentes",
    next_3: "3 Pages suivantes",
    page_size: "taille de la page"
  },
  DatePicker: {
    lang: {
      placeholder: "Sélectionner une date",
      yearPlaceholder: "Sélectionner une année",
      quarterPlaceholder: "Sélectionner un trimestre",
      monthPlaceholder: "Sélectionner un mois",
      weekPlaceholder: "Sélectionner une semaine",
      rangePlaceholder: ["Date de début", "Date de fin"],
      rangeYearPlaceholder: ["Année de début", "Année de fin"],
      rangeMonthPlaceholder: ["Mois de début", "Mois de fin"],
      rangeWeekPlaceholder: ["Semaine de début", "Semaine de fin"],
      locale: "fr_CA",
      today: "Aujourd'hui",
      now: "Maintenant",
      backToToday: "Aujourd'hui",
      ok: "Ok",
      clear: "Rétablir",
      month: "Mois",
      year: "Année",
      timeSelect: "Sélectionner l'heure",
      dateSelect: "Sélectionner la date",
      weekSelect: "Choisissez une semaine",
      monthSelect: "Choisissez un mois",
      yearSelect: "Choisissez une année",
      decadeSelect: "Choisissez une décennie",
      yearFormat: "YYYY",
      dateFormat: "DD/MM/YYYY",
      dayFormat: "DD",
      dateTimeFormat: "DD/MM/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Mois précédent (PageUp)",
      nextMonth: "Mois suivant (PageDown)",
      previousYear: "Année précédente (Ctrl + gauche)",
      nextYear: "Année prochaine (Ctrl + droite)",
      previousDecade: "Décennie précédente",
      nextDecade: "Décennie suivante",
      previousCentury: "Siècle précédent",
      nextCentury: "Siècle suivant"
    },
    timePickerLocale: {
      placeholder: "Sélectionner l'heure",
      rangePlaceholder: ["Heure de début", "Heure de fin"]
    }
  },
  TimePicker: {
    placeholder: "Sélectionner l'heure",
    rangePlaceholder: ["Heure de début", "Heure de fin"]
  },
  Calendar: {
    lang: {
      placeholder: "Sélectionner une date",
      yearPlaceholder: "Sélectionner une année",
      quarterPlaceholder: "Sélectionner un trimestre",
      monthPlaceholder: "Sélectionner un mois",
      weekPlaceholder: "Sélectionner une semaine",
      rangePlaceholder: ["Date de début", "Date de fin"],
      rangeYearPlaceholder: ["Année de début", "Année de fin"],
      rangeMonthPlaceholder: ["Mois de début", "Mois de fin"],
      rangeWeekPlaceholder: ["Semaine de début", "Semaine de fin"],
      locale: "fr_CA",
      today: "Aujourd'hui",
      now: "Maintenant",
      backToToday: "Aujourd'hui",
      ok: "Ok",
      clear: "Rétablir",
      month: "Mois",
      year: "Année",
      timeSelect: "Sélectionner l'heure",
      dateSelect: "Sélectionner la date",
      monthSelect: "Choisissez un mois",
      yearSelect: "Choisissez une année",
      decadeSelect: "Choisissez une décennie",
      yearFormat: "YYYY",
      dateFormat: "DD/MM/YYYY",
      dayFormat: "DD",
      dateTimeFormat: "DD/MM/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Mois précédent (PageUp)",
      nextMonth: "Mois suivant (PageDown)",
      previousYear: "Année précédente (Ctrl + gauche)",
      nextYear: "Année prochaine (Ctrl + droite)",
      previousDecade: "Décennie précédente",
      nextDecade: "Décennie suivante",
      previousCentury: "Siècle précédent",
      nextCentury: "Siècle suivant"
    },
    timePickerLocale: {
      placeholder: "Sélectionner l'heure",
      rangePlaceholder: ["Heure de début", "Heure de fin"]
    }
  },
  global: {
    placeholder: "Sélectionner"
  },
  Table: {
    filterTitle: "Filtrer",
    filterConfirm: "OK",
    filterReset: "Réinitialiser",
    selectAll: "Sélectionner la page actuelle",
    selectInvert: "Inverser la sélection de la page actuelle",
    selectionAll: "Sélectionner toutes les données",
    sortTitle: "Trier",
    expand: "Développer la ligne",
    collapse: "Réduire la ligne",
    triggerDesc: "Trier par ordre décroissant",
    triggerAsc: "Trier par ordre croissant",
    cancelSort: "Annuler le tri",
    filterEmptyText: "Aucun filtre",
    emptyText: "Aucune donnée",
    selectNone: "Désélectionner toutes les données"
  },
  Modal: {
    okText: "OK",
    cancelText: "Annuler",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Annuler"
  },
  Transfer: {
    searchPlaceholder: "Rechercher",
    itemUnit: "élément",
    itemsUnit: "éléments",
    titles: ["", ""],
    remove: "Désélectionner",
    selectCurrent: "Sélectionner la page actuelle",
    removeCurrent: "Désélectionner la page actuelle",
    selectAll: "Sélectionner toutes les données",
    removeAll: "Désélectionner toutes les données",
    selectInvert: "Inverser la sélection de la page actuelle"
  },
  Empty: {
    description: "Aucune donnée"
  },
  Upload: {
    uploading: "Téléchargement...",
    removeFile: "Effacer le fichier",
    uploadError: "Erreur de téléchargement",
    previewFile: "Fichier de prévisualisation",
    downloadFile: "Télécharger un fichier"
  },
  Text: {
    edit: "Éditer",
    copy: "Copier",
    copied: "Copie effectuée",
    expand: "Développer"
  },
  PageHeader: {
    back: "Retour"
  },
  Icon: {
    icon: "icône"
  },
  Image: {
    preview: "Aperçu"
  },
  CronExpression: {
    cronError: "Expression CRON invalide",
    second: "seconde",
    minute: "minute",
    hour: "heure",
    day: "jour",
    month: "mois",
    week: "semaine"
  },
  QRCode: {
    expired: "QR code expiré",
    refresh: "Rafraîchir"
  }
};
var fr_FR = {
  locale: "fr",
  Pagination: {
    items_per_page: "/ page",
    jump_to: "Aller à",
    jump_to_confirm: "confirmer",
    page: "Page",
    prev_page: "Page précédente",
    next_page: "Page suivante",
    prev_5: "5 Pages précédentes",
    next_5: "5 Pages suivantes",
    prev_3: "3 Pages précédentes",
    next_3: "3 Pages suivantes",
    page_size: "taille de la page"
  },
  DatePicker: {
    lang: {
      placeholder: "Sélectionner une date",
      yearPlaceholder: "Sélectionner une année",
      quarterPlaceholder: "Sélectionner un trimestre",
      monthPlaceholder: "Sélectionner un mois",
      weekPlaceholder: "Sélectionner une semaine",
      rangePlaceholder: ["Date de début", "Date de fin"],
      rangeYearPlaceholder: ["Année de début", "Année de fin"],
      rangeMonthPlaceholder: ["Mois de début", "Mois de fin"],
      rangeWeekPlaceholder: ["Semaine de début", "Semaine de fin"],
      locale: "fr_FR",
      today: "Aujourd'hui",
      now: "Maintenant",
      backToToday: "Aujourd'hui",
      ok: "Ok",
      clear: "Rétablir",
      month: "Mois",
      year: "Année",
      timeSelect: "Sélectionner l'heure",
      dateSelect: "Sélectionner la date",
      weekSelect: "Choisissez une semaine",
      monthSelect: "Choisissez un mois",
      yearSelect: "Choisissez une année",
      decadeSelect: "Choisissez une décennie",
      yearFormat: "YYYY",
      dateFormat: "DD/MM/YYYY",
      dayFormat: "DD",
      dateTimeFormat: "DD/MM/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Mois précédent (PageUp)",
      nextMonth: "Mois suivant (PageDown)",
      previousYear: "Année précédente (Ctrl + gauche)",
      nextYear: "Année prochaine (Ctrl + droite)",
      previousDecade: "Décennie précédente",
      nextDecade: "Décennie suivante",
      previousCentury: "Siècle précédent",
      nextCentury: "Siècle suivant"
    },
    timePickerLocale: {
      placeholder: "Sélectionner l'heure",
      rangePlaceholder: ["Heure de début", "Heure de fin"]
    }
  },
  TimePicker: {
    placeholder: "Sélectionner l'heure",
    rangePlaceholder: ["Heure de début", "Heure de fin"]
  },
  Calendar: {
    lang: {
      placeholder: "Sélectionner une date",
      yearPlaceholder: "Sélectionner une année",
      quarterPlaceholder: "Sélectionner un trimestre",
      monthPlaceholder: "Sélectionner un mois",
      weekPlaceholder: "Sélectionner une semaine",
      rangePlaceholder: ["Date de début", "Date de fin"],
      rangeYearPlaceholder: ["Année de début", "Année de fin"],
      rangeMonthPlaceholder: ["Mois de début", "Mois de fin"],
      rangeWeekPlaceholder: ["Semaine de début", "Semaine de fin"],
      locale: "fr_FR",
      today: "Aujourd'hui",
      now: "Maintenant",
      backToToday: "Aujourd'hui",
      ok: "Ok",
      clear: "Rétablir",
      month: "Mois",
      year: "Année",
      timeSelect: "Sélectionner l'heure",
      dateSelect: "Sélectionner la date",
      monthSelect: "Choisissez un mois",
      yearSelect: "Choisissez une année",
      decadeSelect: "Choisissez une décennie",
      yearFormat: "YYYY",
      dateFormat: "DD/MM/YYYY",
      dayFormat: "DD",
      dateTimeFormat: "DD/MM/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Mois précédent (PageUp)",
      nextMonth: "Mois suivant (PageDown)",
      previousYear: "Année précédente (Ctrl + gauche)",
      nextYear: "Année prochaine (Ctrl + droite)",
      previousDecade: "Décennie précédente",
      nextDecade: "Décennie suivante",
      previousCentury: "Siècle précédent",
      nextCentury: "Siècle suivant"
    },
    timePickerLocale: {
      placeholder: "Sélectionner l'heure",
      rangePlaceholder: ["Heure de début", "Heure de fin"]
    }
  },
  global: {
    placeholder: "Sélectionner"
  },
  Table: {
    filterTitle: "Filtrer",
    filterConfirm: "OK",
    filterReset: "Réinitialiser",
    selectAll: "Sélectionner la page actuelle",
    selectInvert: "Inverser la sélection de la page actuelle",
    selectionAll: "Sélectionner toutes les données",
    sortTitle: "Trier",
    expand: "Développer la ligne",
    collapse: "Réduire la ligne",
    triggerDesc: "Trier par ordre décroissant",
    triggerAsc: "Trier par ordre croissant",
    cancelSort: "Annuler le tri",
    filterEmptyText: "Aucun filtre",
    emptyText: "Aucune donnée",
    selectNone: "Désélectionner toutes les données"
  },
  Modal: {
    okText: "OK",
    cancelText: "Annuler",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Annuler"
  },
  Transfer: {
    searchPlaceholder: "Rechercher",
    itemUnit: "élément",
    itemsUnit: "éléments",
    titles: ["", ""],
    remove: "Désélectionner",
    selectCurrent: "Sélectionner la page actuelle",
    removeCurrent: "Désélectionner la page actuelle",
    selectAll: "Sélectionner toutes les données",
    removeAll: "Désélectionner toutes les données",
    selectInvert: "Inverser la sélection de la page actuelle"
  },
  Empty: {
    description: "Aucune donnée"
  },
  Upload: {
    uploading: "Téléchargement...",
    removeFile: "Effacer le fichier",
    uploadError: "Erreur de téléchargement",
    previewFile: "Fichier de prévisualisation",
    downloadFile: "Télécharger un fichier"
  },
  Text: {
    edit: "Éditer",
    copy: "Copier",
    copied: "Copie effectuée",
    expand: "Développer"
  },
  PageHeader: {
    back: "Retour"
  },
  Icon: {
    icon: "icône"
  },
  Image: {
    preview: "Aperçu"
  },
  CronExpression: {
    cronError: "Expression CRON invalide",
    second: "seconde",
    minute: "minute",
    hour: "heure",
    day: "jour",
    month: "mois",
    week: "semaine"
  },
  QRCode: {
    expired: "QR code expiré",
    refresh: "Rafraîchir"
  }
};
var ga_IE = {
  locale: "ga",
  Pagination: {
    items_per_page: "/ leathanach",
    jump_to: "Téigh",
    jump_to_confirm: "dheimhnigh",
    page: "",
    prev_page: "Leathanach Roimhe Seo",
    next_page: "An chéad leathanach eile",
    prev_5: "5 leathanach roimhe seo",
    next_5: "Ar Aghaidh 5 Leathanaigh",
    prev_3: "3 leathanach roimhe seo",
    next_3: "Ar Aghaidh 3 Leathanaigh",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Roghnaigh dáta",
      yearPlaceholder: "Roghnaigh bliain",
      quarterPlaceholder: "Roghnaigh ráithe",
      monthPlaceholder: "Roghnaigh mí",
      weekPlaceholder: "Roghnaigh seachtain",
      rangePlaceholder: ["Dáta tosaigh", "Dáta deiridh"],
      rangeYearPlaceholder: ["Tús na bliana", "Deireadh na bliana"],
      rangeMonthPlaceholder: ["Tosaigh mhí", "Deireadh mhí"],
      rangeWeekPlaceholder: ["Tosaigh an tseachtain", "Deireadh na seachtaine"],
      locale: "ga_IE",
      today: "inniu",
      now: "anois",
      backToToday: "Ar ais inniu",
      ok: "ceart go leor",
      clear: "soiléir",
      month: "mhí",
      year: "bhliain",
      timeSelect: "roghnaigh am",
      dateSelect: "roghnaigh dáta",
      weekSelect: "Roghnaigh seachtain",
      monthSelect: "Roghnaigh mí",
      yearSelect: "Roghnaigh bliain",
      decadeSelect: "Roghnaigh deich mbliana",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "An mhí roimhe seo (PageUp)",
      nextMonth: "An mhí seo chugainn (PageDown)",
      previousYear: "Anuraidh (Control + left)",
      nextYear: "An bhliain seo chugainn (Control + right)",
      previousDecade: "Le deich mbliana anuas",
      nextDecade: "Deich mbliana amach romhainn",
      previousCentury: "An chéid seo caite",
      nextCentury: "An chéad aois eile"
    },
    timePickerLocale: {
      placeholder: "Roghnaigh am",
      rangePlaceholder: ["Am tosaigh", "Am deiridh"]
    }
  },
  TimePicker: {
    placeholder: "Roghnaigh am",
    rangePlaceholder: ["Am tosaigh", "Am deiridh"]
  },
  Calendar: {
    lang: {
      placeholder: "Roghnaigh dáta",
      yearPlaceholder: "Roghnaigh bliain",
      quarterPlaceholder: "Roghnaigh ráithe",
      monthPlaceholder: "Roghnaigh mí",
      weekPlaceholder: "Roghnaigh seachtain",
      rangePlaceholder: ["Dáta tosaigh", "Dáta deiridh"],
      rangeYearPlaceholder: ["Tús na bliana", "Deireadh na bliana"],
      rangeMonthPlaceholder: ["Tosaigh mhí", "Deireadh mhí"],
      rangeWeekPlaceholder: ["Tosaigh an tseachtain", "Deireadh na seachtaine"],
      locale: "ga_IE",
      today: "inniu",
      now: "anois",
      backToToday: "Ar ais inniu",
      ok: "ceart go leor",
      clear: "soiléir",
      month: "mhí",
      year: "bhliain",
      timeSelect: "roghnaigh am",
      dateSelect: "roghnaigh dáta",
      weekSelect: "Roghnaigh seachtain",
      monthSelect: "Roghnaigh mí",
      yearSelect: "Roghnaigh bliain",
      decadeSelect: "Roghnaigh deich mbliana",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "An mhí roimhe seo (PageUp)",
      nextMonth: "An mhí seo chugainn (PageDown)",
      previousYear: "Anuraidh (Control + left)",
      nextYear: "An bhliain seo chugainn (Control + right)",
      previousDecade: "Le deich mbliana anuas",
      nextDecade: "Deich mbliana amach romhainn",
      previousCentury: "An chéid seo caite",
      nextCentury: "An chéad aois eile"
    },
    timePickerLocale: {
      placeholder: "Roghnaigh am",
      rangePlaceholder: ["Am tosaigh", "Am deiridh"]
    }
  },
  global: {
    placeholder: "Please select"
  },
  Table: {
    filterTitle: "Filter menu",
    filterConfirm: "OK",
    filterReset: "Reset",
    selectAll: "Select current page",
    selectInvert: "Invert current page",
    selectionAll: "Select all data",
    sortTitle: "Sort",
    expand: "Expand row",
    collapse: "Collapse row",
    triggerDesc: "Click to sort descending",
    triggerAsc: "Click to sort ascending",
    cancelSort: "Click to cancel sorting"
  },
  Modal: {
    okText: "OK",
    cancelText: "Cancel",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Cancel"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Search here",
    itemUnit: "item",
    itemsUnit: "items",
    remove: "Remove",
    selectCurrent: "Select current page",
    removeCurrent: "Remove current page",
    selectAll: "Select all data",
    removeAll: "Remove all data",
    selectInvert: "Invert current page"
  },
  Upload: {
    uploading: "Uploading...",
    removeFile: "Remove file",
    uploadError: "Upload error",
    previewFile: "Preview file",
    downloadFile: "Download file"
  },
  Empty: {
    description: "No Data"
  },
  Icon: {
    icon: "icon"
  },
  Text: {
    edit: "Edit",
    copy: "Copy",
    copied: "Copied",
    expand: "Expand"
  },
  PageHeader: {
    back: "Back"
  }
};
var gl_ES = {
  locale: "gl",
  Pagination: {
    items_per_page: "/ páxina",
    jump_to: "Ir a",
    jump_to_confirm: "confirmar",
    page: "",
    prev_page: "Páxina anterior",
    next_page: "Páxina seguinte",
    prev_5: "5 páxinas previas",
    next_5: "5 páxinas seguintes",
    prev_3: "3 páxinas previas",
    next_3: "3 páxinas seguintes",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Escolla data",
      rangePlaceholder: ["Data inicial", "Data final"],
      locale: "gl_ES",
      today: "Hoxe",
      now: "Agora",
      backToToday: "Voltar a hoxe",
      ok: "Aceptar",
      clear: "Limpar",
      month: "Mes",
      year: "Ano",
      timeSelect: "Seleccionar hora",
      dateSelect: "Seleccionar data",
      monthSelect: "Elexir un mes",
      yearSelect: "Elexir un año",
      decadeSelect: "Elexir unha década",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Mes anterior (PageUp)",
      nextMonth: "Mes seguinte (PageDown)",
      previousYear: "Ano anterior (Control + left)",
      nextYear: "Ano seguinte (Control + right)",
      previousDecade: "Década anterior",
      nextDecade: "Década seguinte",
      previousCentury: "Século anterior",
      nextCentury: "Século seguinte"
    },
    timePickerLocale: {
      placeholder: "Escolla hora"
    }
  },
  TimePicker: {
    placeholder: "Escolla hora"
  },
  Calendar: {
    lang: {
      placeholder: "Escolla data",
      rangePlaceholder: ["Data inicial", "Data final"],
      locale: "gl_ES",
      today: "Hoxe",
      now: "Agora",
      backToToday: "Voltar a hoxe",
      ok: "Aceptar",
      clear: "Limpar",
      month: "Mes",
      year: "Ano",
      timeSelect: "Seleccionar hora",
      dateSelect: "Seleccionar data",
      monthSelect: "Elexir un mes",
      yearSelect: "Elexir un año",
      decadeSelect: "Elexir unha década",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Mes anterior (PageUp)",
      nextMonth: "Mes seguinte (PageDown)",
      previousYear: "Ano anterior (Control + left)",
      nextYear: "Ano seguinte (Control + right)",
      previousDecade: "Década anterior",
      nextDecade: "Década seguinte",
      previousCentury: "Século anterior",
      nextCentury: "Século seguinte"
    },
    timePickerLocale: {
      placeholder: "Escolla hora"
    }
  },
  global: {
    placeholder: "Escolla"
  },
  Table: {
    filterTitle: "Filtrar menú",
    filterConfirm: "Aceptar",
    filterReset: "Reiniciar",
    selectAll: "Seleccionar todo",
    selectInvert: "Invertir selección",
    sortTitle: "Ordenar"
  },
  Modal: {
    okText: "Aceptar",
    cancelText: "Cancelar",
    justOkText: "Aceptar"
  },
  Popconfirm: {
    okText: "Aceptar",
    cancelText: "Cancelar"
  },
  Transfer: {
    searchPlaceholder: "Buscar aquí",
    itemUnit: "elemento",
    itemsUnit: "elementos"
  },
  Upload: {
    uploading: "Subindo...",
    removeFile: "Eliminar arquivo",
    uploadError: "Error ao subir o arquivo",
    previewFile: "Vista previa",
    downloadFile: "Descargar arquivo"
  },
  Empty: {
    description: "Non hai datos"
  },
  Icon: {
    icon: "icona"
  },
  Text: {
    edit: "editar",
    copy: "copiar",
    copied: "copiado",
    expand: "expandir"
  },
  PageHeader: {
    back: "voltar"
  }
};
var he_IL = {
  locale: "he",
  Pagination: {
    items_per_page: "/ עמוד",
    jump_to: "עבור אל",
    jump_to_confirm: "אישור",
    page: "",
    prev_page: "העמוד הקודם",
    next_page: "העמוד הבא",
    prev_5: "5 עמודים קודמים",
    next_5: "5 עמודים הבאים",
    prev_3: "3 עמודים קודמים",
    next_3: "3 עמודים הבאים",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "בחר תאריך",
      rangePlaceholder: ["תאריך התחלה", "תאריך סיום"],
      locale: "he_IL",
      today: "היום",
      now: "עכשיו",
      backToToday: "חזור להיום",
      ok: "אישור",
      clear: "איפוס",
      month: "חודש",
      year: "שנה",
      timeSelect: "בחר שעה",
      dateSelect: "בחר תאריך",
      weekSelect: "בחר שבוע",
      monthSelect: "בחר חודש",
      yearSelect: "בחר שנה",
      decadeSelect: "בחר עשור",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "חודש קודם (PageUp)",
      nextMonth: "חודש הבא (PageDown)",
      previousYear: "שנה שעברה (Control + left)",
      nextYear: "שנה הבאה (Control + right)",
      previousDecade: "העשור הקודם",
      nextDecade: "העשור הבא",
      previousCentury: "המאה הקודמת",
      nextCentury: "המאה הבאה"
    },
    timePickerLocale: {
      placeholder: "בחר שעה"
    }
  },
  TimePicker: {
    placeholder: "בחר שעה"
  },
  Calendar: {
    lang: {
      placeholder: "בחר תאריך",
      rangePlaceholder: ["תאריך התחלה", "תאריך סיום"],
      locale: "he_IL",
      today: "היום",
      now: "עכשיו",
      backToToday: "חזור להיום",
      ok: "אישור",
      clear: "איפוס",
      month: "חודש",
      year: "שנה",
      timeSelect: "בחר שעה",
      dateSelect: "בחר תאריך",
      weekSelect: "בחר שבוע",
      monthSelect: "בחר חודש",
      yearSelect: "בחר שנה",
      decadeSelect: "בחר עשור",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "חודש קודם (PageUp)",
      nextMonth: "חודש הבא (PageDown)",
      previousYear: "שנה שעברה (Control + left)",
      nextYear: "שנה הבאה (Control + right)",
      previousDecade: "העשור הקודם",
      nextDecade: "העשור הבא",
      previousCentury: "המאה הקודמת",
      nextCentury: "המאה הבאה"
    },
    timePickerLocale: {
      placeholder: "בחר שעה"
    }
  },
  global: {
    placeholder: "אנא בחר"
  },
  Table: {
    filterTitle: "תפריט סינון",
    filterConfirm: "אישור",
    filterReset: "איפוס",
    selectAll: "בחר הכל",
    selectInvert: "הפוך בחירה",
    selectionAll: "בחר את כל הנתונים",
    sortTitle: "מיון",
    expand: "הרחב שורה",
    collapse: "צמצם שורהw",
    triggerDesc: "לחץ על מיון לפי סדר יורד",
    triggerAsc: "לחץ על מיון לפי סדר עולה",
    cancelSort: "לחץ כדי לבטל את המיון"
  },
  Modal: {
    okText: "אישור",
    cancelText: "ביטול",
    justOkText: "אישור"
  },
  Popconfirm: {
    okText: "אישור",
    cancelText: "ביטול"
  },
  Transfer: {
    searchPlaceholder: "חפש כאן",
    itemUnit: "פריט",
    itemsUnit: "פריטים"
  },
  Upload: {
    uploading: "מעלה...",
    removeFile: "הסר קובץ",
    uploadError: "שגיאת העלאה",
    previewFile: "הצג קובץ",
    downloadFile: "הורד קובץ"
  },
  Empty: {
    description: "אין מידע"
  },
  Icon: {
    icon: "סמל"
  },
  Text: {
    edit: "ערוך",
    copy: "העתק",
    copied: "הועתק",
    expand: "הרחב"
  },
  PageHeader: {
    back: "חזרה"
  }
};
var hi_IN = {
  locale: "hi",
  Pagination: {
    items_per_page: "/ पृष्ठ",
    jump_to: "इस पर चलें",
    jump_to_confirm: "पुष्टि करें",
    page: "",
    prev_page: "पिछला पृष्ठ",
    next_page: "अगला पृष्ठ",
    prev_5: "पिछले 5 पृष्ठ",
    next_5: "अगले 5 पृष्ठ",
    prev_3: "पिछले 3 पृष्ठ",
    next_3: "अगले 3 पेज",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "तारीख़ चुनें",
      rangePlaceholder: ["प्रारंभ तिथि", "समाप्ति तिथि"],
      locale: "hi_IN",
      today: "आज",
      now: "अभी",
      backToToday: "आज तक",
      ok: "ठीक",
      clear: "स्पष्ट",
      month: "महीना",
      year: "साल",
      timeSelect: "समय का चयन करें",
      dateSelect: "तारीख़ चुनें",
      weekSelect: "एक सप्ताह चुनें",
      monthSelect: "एक महीना चुनें",
      yearSelect: "एक वर्ष चुनें",
      decadeSelect: "एक दशक चुनें",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "पिछला महीना (पेजअप)",
      nextMonth: "अगले महीने (पेजडाउन)",
      previousYear: "पिछले साल (Ctrl + बाएं)",
      nextYear: "अगले साल (Ctrl + दाहिना)",
      previousDecade: "पिछला दशक",
      nextDecade: "अगले दशक",
      previousCentury: "पीछ्ली शताब्दी",
      nextCentury: "अगली सदी",
      yearPlaceholder: "वर्ष चुनें",
      quarterPlaceholder: "तिमाही चुनें",
      monthPlaceholder: "महीना चुनिए",
      weekPlaceholder: "सप्ताह चुनें",
      rangeYearPlaceholder: ["आरंभिक वर्ष", "अंत वर्ष"],
      rangeMonthPlaceholder: ["आरंभिक महीना", "अंत महीना"],
      rangeWeekPlaceholder: ["आरंभिक सप्ताह", "अंत सप्ताह"]
    },
    timePickerLocale: {
      placeholder: "समय का चयन करें",
      rangePlaceholder: ["आरंभिक समय", "अंत समय"]
    }
  },
  TimePicker: {
    placeholder: "समय का चयन करें",
    rangePlaceholder: ["आरंभिक समय", "अंत समय"]
  },
  Calendar: {
    lang: {
      placeholder: "तारीख़ चुनें",
      rangePlaceholder: ["प्रारंभ तिथि", "समाप्ति तिथि"],
      locale: "hi_IN",
      today: "आज",
      now: "अभी",
      backToToday: "आज तक",
      ok: "ठीक",
      clear: "स्पष्ट",
      month: "महीना",
      year: "साल",
      timeSelect: "समय का चयन करें",
      dateSelect: "तारीख़ चुनें",
      weekSelect: "एक सप्ताह चुनें",
      monthSelect: "एक महीना चुनें",
      yearSelect: "एक वर्ष चुनें",
      decadeSelect: "एक दशक चुनें",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "पिछला महीना (पेजअप)",
      nextMonth: "अगले महीने (पेजडाउन)",
      previousYear: "पिछले साल (Ctrl + बाएं)",
      nextYear: "अगले साल (Ctrl + दाहिना)",
      previousDecade: "पिछला दशक",
      nextDecade: "अगले दशक",
      previousCentury: "पीछ्ली शताब्दी",
      nextCentury: "अगली सदी",
      yearPlaceholder: "वर्ष चुनें",
      quarterPlaceholder: "तिमाही चुनें",
      monthPlaceholder: "महीना चुनिए",
      weekPlaceholder: "सप्ताह चुनें",
      rangeYearPlaceholder: ["आरंभिक वर्ष", "अंत वर्ष"],
      rangeMonthPlaceholder: ["आरंभिक महीना", "अंत महीना"],
      rangeWeekPlaceholder: ["आरंभिक सप्ताह", "अंत सप्ताह"]
    },
    timePickerLocale: {
      placeholder: "समय का चयन करें",
      rangePlaceholder: ["आरंभिक समय", "अंत समय"]
    }
  },
  global: {
    placeholder: "कृपया चुनें"
  },
  Table: {
    filterTitle: "सूची बंद करें",
    filterConfirm: "अच्छी तरह से",
    filterReset: "रीसेट",
    emptyText: "कोई जानकारी नहीं",
    selectAll: "वर्तमान पृष्ठ का चयन करें",
    selectInvert: "वर्तमान पृष्ठ घुमाएं",
    sortTitle: "द्वारा क्रमबद्ध करें",
    filterEmptyText: "कोई फ़िल्टर नहीं",
    selectNone: "सभी डेटा साफ़ करें",
    selectionAll: "सभी डेटा का चयन करें",
    expand: "पंक्ति का विस्तार करें",
    collapse: "पंक्ति संक्षिप्त करें",
    triggerDesc: "अवरोही क्रमित करने के लिए क्लिक करें",
    triggerAsc: "आरोही क्रमित करने के लिए क्लिक करें",
    cancelSort: "छँटाई रद्द करने के लिए क्लिक करें"
  },
  Modal: {
    okText: "अच्छी तरह से",
    cancelText: "रद्द करना",
    justOkText: "अच्छी तरह से"
  },
  Popconfirm: {
    okText: "अच्छी तरह से",
    cancelText: "रद्द करना"
  },
  Transfer: {
    titles: ["", ""],
    notFoundContent: "नहीं मिला",
    searchPlaceholder: "यहां खोजें",
    itemUnit: "तत्त्व",
    itemsUnit: "विषय-वस्तु",
    remove: "हटाए",
    selectCurrent: "वर्तमान पृष्ठ का चयन करें",
    removeCurrent: "वर्तमान पृष्ठ हटाएं",
    selectAll: "सभी डेटा का चयन करें",
    removeAll: "सभी डेटा हटाएं",
    selectInvert: "वर्तमान पृष्ठ को उल्टा करें"
  },
  Select: {
    notFoundContent: "नहीं मिला"
  },
  Upload: {
    uploading: "अपलोड हो रहा...",
    removeFile: "फ़ाइल निकालें",
    uploadError: "अपलोड में त्रुटि",
    previewFile: "फ़ाइल पूर्वावलोकन",
    downloadFile: "फ़ाइल डाउनलोड करें"
  },
  Empty: {
    description: "कोई आकड़ा उपलब्ध नहीं है"
  },
  Icon: {
    icon: "आइकन"
  },
  Text: {
    edit: "संपादित करें",
    copy: "प्रतिलिपि",
    copied: "कॉपी किया गया",
    expand: "विस्तार"
  },
  PageHeader: {
    back: "वापस"
  },
  Image: {
    preview: "पूर्वावलोकन"
  }
};
var hr_HR = {
  locale: "hr",
  Pagination: {
    items_per_page: "/ str",
    jump_to: "Idi na",
    jump_to_confirm: "potvrdi",
    page: "",
    prev_page: "Prijašnja stranica",
    next_page: "Sljedeća stranica",
    prev_5: "Prijašnjih 5 stranica",
    next_5: "Sljedećih 5 stranica",
    prev_3: "Prijašnje 3 stranice",
    next_3: "Sljedeće 3 stranice",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Odaberite datum",
      rangePlaceholder: ["Početni datum", "Završni datum"],
      locale: "hr_HR",
      today: "Danas",
      now: "Sad",
      backToToday: "Natrag na danas",
      ok: "Ok",
      clear: "Očisti",
      month: "Mjesec",
      year: "Godina",
      timeSelect: "odaberite vrijeme",
      dateSelect: "odaberite datum",
      weekSelect: "Odaberite tjedan",
      monthSelect: "Odaberite mjesec",
      yearSelect: "Odaberite godinu",
      decadeSelect: "Odaberite desetljeće",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Prošli mjesec (PageUp)",
      nextMonth: "Sljedeći mjesec (PageDown)",
      previousYear: "Prošla godina (Control + left)",
      nextYear: "Sljedeća godina (Control + right)",
      previousDecade: "Prošlo desetljeće",
      nextDecade: "Sljedeće desetljeće",
      previousCentury: "Prošlo stoljeće",
      nextCentury: "Sljedeće stoljeće",
      yearPlaceholder: "Odaberite godinu",
      quarterPlaceholder: "Odaberite četvrtinu",
      monthPlaceholder: "Odaberite mjesec",
      weekPlaceholder: "Odaberite tjedan",
      rangeYearPlaceholder: ["Početna godina", "Završna godina"],
      rangeMonthPlaceholder: ["Početni mjesec", "Završni mjesec"],
      rangeWeekPlaceholder: ["Početni tjedan", "Završni tjedan"]
    },
    timePickerLocale: {
      placeholder: "Odaberite vrijeme",
      rangePlaceholder: ["Vrijeme početka", "Vrijeme završetka"]
    }
  },
  TimePicker: {
    placeholder: "Odaberite vrijeme",
    rangePlaceholder: ["Vrijeme početka", "Vrijeme završetka"]
  },
  Calendar: {
    lang: {
      placeholder: "Odaberite datum",
      rangePlaceholder: ["Početni datum", "Završni datum"],
      locale: "hr_HR",
      today: "Danas",
      now: "Sad",
      backToToday: "Natrag na danas",
      ok: "Ok",
      clear: "Očisti",
      month: "Mjesec",
      year: "Godina",
      timeSelect: "odaberite vrijeme",
      dateSelect: "odaberite datum",
      weekSelect: "Odaberite tjedan",
      monthSelect: "Odaberite mjesec",
      yearSelect: "Odaberite godinu",
      decadeSelect: "Odaberite desetljeće",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Prošli mjesec (PageUp)",
      nextMonth: "Sljedeći mjesec (PageDown)",
      previousYear: "Prošla godina (Control + left)",
      nextYear: "Sljedeća godina (Control + right)",
      previousDecade: "Prošlo desetljeće",
      nextDecade: "Sljedeće desetljeće",
      previousCentury: "Prošlo stoljeće",
      nextCentury: "Sljedeće stoljeće",
      yearPlaceholder: "Odaberite godinu",
      quarterPlaceholder: "Odaberite četvrtinu",
      monthPlaceholder: "Odaberite mjesec",
      weekPlaceholder: "Odaberite tjedan",
      rangeYearPlaceholder: ["Početna godina", "Završna godina"],
      rangeMonthPlaceholder: ["Početni mjesec", "Završni mjesec"],
      rangeWeekPlaceholder: ["Početni tjedan", "Završni tjedan"]
    },
    timePickerLocale: {
      placeholder: "Odaberite vrijeme",
      rangePlaceholder: ["Vrijeme početka", "Vrijeme završetka"]
    }
  },
  global: {
    placeholder: "Molimo označite"
  },
  Table: {
    filterTitle: "Filter meni",
    filterConfirm: "OK",
    filterReset: "Reset",
    selectAll: "Označi trenutnu stranicu",
    selectInvert: "Invertiraj trenutnu stranicu",
    sortTitle: "Sortiraj",
    filterEmptyText: "Nema filtera",
    emptyText: "Nema podataka",
    selectionAll: "Odaberite sve podatke",
    expand: "Proširi redak",
    collapse: "Sažmi redak",
    triggerDesc: "Kliknite za sortiranje silazno",
    triggerAsc: "Kliknite za sortiranje uzlazno",
    cancelSort: "Kliknite da biste otkazali sortiranje"
  },
  Modal: {
    okText: "OK",
    cancelText: "Odustani",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Odustani"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Pretraži ovdje",
    itemUnit: "stavka",
    itemsUnit: "stavke",
    remove: "Ukloniti",
    selectCurrent: "Odaberite trenutnu stranicu",
    removeCurrent: "Ukloni trenutnu stranicu",
    selectAll: "Odaberite sve podatke",
    removeAll: "Uklonite sve podatke",
    selectInvert: "Obrni trenutnu stranicu"
  },
  Upload: {
    uploading: "Upload u tijeku...",
    removeFile: "Makni datoteku",
    uploadError: "Greška kod uploada",
    previewFile: "Pogledaj datoteku",
    downloadFile: "Preuzmi datoteku"
  },
  Empty: {
    description: "Nema podataka"
  },
  Icon: {
    icon: "ikona"
  },
  Text: {
    edit: "Uredi",
    copy: "Kopiraj",
    copied: "Kopiranje uspješno",
    expand: "Proširi"
  },
  PageHeader: {
    back: "Natrag"
  },
  Image: {
    preview: "Pregled"
  }
};
var hu_HU = {
  locale: "hu",
  Pagination: {
    items_per_page: "/ oldal",
    jump_to: "Ugrás",
    jump_to_confirm: "megerősít",
    page: "",
    prev_page: "Előző oldal",
    next_page: "Következő oldal",
    prev_5: "Előző 5 oldal",
    next_5: "Következő 5 oldal",
    prev_3: "Előző 3 oldal",
    next_3: "Következő 3 oldal",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Válasszon dátumot",
      yearPlaceholder: "Válasszon évet",
      quarterPlaceholder: "Válasszon negyedévet",
      monthPlaceholder: "Válasszon hónapot",
      weekPlaceholder: "Válasszon hetet",
      rangePlaceholder: ["Kezdő dátum", "Befejezés dátuma"],
      rangeYearPlaceholder: ["Kezdő év", "Befejezés éve"],
      rangeMonthPlaceholder: ["Kezdő hónap", "Befejezés hónapja"],
      rangeWeekPlaceholder: ["Kezdő hét", "Befejezés hete"],
      locale: "hu_HU",
      today: "Ma",
      now: "Most",
      backToToday: "Vissza a mai napra",
      ok: "Ok",
      clear: "Törlés",
      month: "Hónap",
      year: "Év",
      timeSelect: "Időpont kiválasztása",
      dateSelect: "Dátum kiválasztása",
      weekSelect: "Hét kiválasztása",
      monthSelect: "Hónap kiválasztása",
      yearSelect: "Év kiválasztása",
      decadeSelect: "Évtized kiválasztása",
      yearFormat: "YYYY",
      dateFormat: "YYYY/MM/DD",
      dayFormat: "DD",
      dateTimeFormat: "YYYY/MM/DD HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Előző hónap (PageUp)",
      nextMonth: "Következő hónap (PageDown)",
      previousYear: "Múlt év (Control + left)",
      nextYear: "Jövő év (Control + right)",
      previousDecade: "Előző évtized",
      nextDecade: "Következő évtized",
      previousCentury: "Múlt évszázad",
      nextCentury: "Jövő évszázad"
    },
    timePickerLocale: {
      placeholder: "Válasszon időt",
      rangePlaceholder: ["Kezdő idő", "Befejezés ideje"]
    }
  },
  TimePicker: {
    placeholder: "Válasszon időt",
    rangePlaceholder: ["Kezdő idő", "Befejezés ideje"]
  },
  Calendar: {
    lang: {
      placeholder: "Válasszon dátumot",
      yearPlaceholder: "Válasszon évet",
      quarterPlaceholder: "Válasszon negyedévet",
      monthPlaceholder: "Válasszon hónapot",
      weekPlaceholder: "Válasszon hetet",
      rangePlaceholder: ["Kezdő dátum", "Befejezés dátuma"],
      rangeYearPlaceholder: ["Kezdő év", "Befejezés éve"],
      rangeMonthPlaceholder: ["Kezdő hónap", "Befejezés hónapja"],
      rangeWeekPlaceholder: ["Kezdő hét", "Befejezés hete"],
      locale: "hu_HU",
      today: "Ma",
      now: "Most",
      backToToday: "Vissza a mai napra",
      ok: "Ok",
      clear: "Törlés",
      month: "Hónap",
      year: "Év",
      timeSelect: "Időpont kiválasztása",
      dateSelect: "Dátum kiválasztása",
      weekSelect: "Hét kiválasztása",
      monthSelect: "Hónap kiválasztása",
      yearSelect: "Év kiválasztása",
      decadeSelect: "Évtized kiválasztása",
      yearFormat: "YYYY",
      dateFormat: "YYYY/MM/DD",
      dayFormat: "DD",
      dateTimeFormat: "YYYY/MM/DD HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Előző hónap (PageUp)",
      nextMonth: "Következő hónap (PageDown)",
      previousYear: "Múlt év (Control + left)",
      nextYear: "Jövő év (Control + right)",
      previousDecade: "Előző évtized",
      nextDecade: "Következő évtized",
      previousCentury: "Múlt évszázad",
      nextCentury: "Jövő évszázad"
    },
    timePickerLocale: {
      placeholder: "Válasszon időt",
      rangePlaceholder: ["Kezdő idő", "Befejezés ideje"]
    }
  },
  global: {
    placeholder: "Kérlek, válassz"
  },
  Table: {
    filterTitle: "Szűrők",
    filterConfirm: "Alkalmazás",
    filterReset: "Visszaállítás",
    filterEmptyText: "No filters",
    emptyText: "Nincs adat",
    selectAll: "Jelenlegi oldal kiválasztása",
    selectInvert: "Jelenlegi oldal inverze",
    selectionAll: "Összes adat kiválasztása",
    sortTitle: "Rendezés",
    expand: "Sor kinyitása",
    collapse: "Sor becsukása",
    triggerDesc: "Kattintson a csökkenő sorrendbe rendezéshez",
    triggerAsc: "Kattintson a növekvő sorrendbe rendezéshez",
    cancelSort: "Kattintson a rendezés visszavonásához",
    selectNone: "Összes visszavonása"
  },
  Modal: {
    okText: "Alkalmazás",
    cancelText: "Visszavonás",
    justOkText: "Alkalmazás"
  },
  Popconfirm: {
    okText: "Alkalmazás",
    cancelText: "Visszavonás"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Keresés",
    itemUnit: "elem",
    itemsUnit: "elemek",
    remove: "Eltávolít",
    selectCurrent: "Jelenlegi oldal kiválasztása",
    removeCurrent: "Jelenlegi oldal eltávolítása",
    selectAll: "Összes adat kiválasztása",
    removeAll: "Összes adat eltávolítása",
    selectInvert: "Jelenlegi oldal inverze"
  },
  Upload: {
    uploading: "Feltöltés...",
    removeFile: "Fájl eltávolítása",
    uploadError: "Feltöltési hiba",
    previewFile: "Fájl előnézet",
    downloadFile: "Fájl letöltése"
  },
  Empty: {
    description: "Nincs adat"
  },
  Icon: {
    icon: "ikon"
  },
  Text: {
    edit: "Szerkesztés",
    copy: "Másolás",
    copied: "Másolva",
    expand: "Kiterjesztés"
  },
  PageHeader: {
    back: "Vissza"
  }
};
var hy_AM = {
  locale: "hy-am",
  Pagination: {
    items_per_page: "/ էջ",
    jump_to: "Գնալ",
    jump_to_confirm: "հաստատել",
    page: "",
    prev_page: "Նախորդ Էջ",
    next_page: "Հաջորդ Էջ",
    prev_5: "Նախորդ 5 Էջերը",
    next_5: "Հաջորդ 5 Էջերը",
    prev_3: "Նախորդ 3 Էջերը",
    next_3: "Հաջորդ 3 Էջերը"
  },
  DatePicker: {
    lang: {
      locale: "hy-am",
      placeholder: "Ընտրեք ամսաթիվը",
      rangePlaceholder: ["Մեկնարկի ամսաթիվ", "Ավարտի ամսաթիվը"],
      today: "Այսօր",
      now: "Հիմա",
      backToToday: "Վերադառնալ այսօր",
      ok: "Օկ",
      clear: "Մաքրել",
      month: "Ամիս",
      year: "Տարի",
      timeSelect: "ընտրեք ժամը",
      dateSelect: "ընտրեք ամսաթիվը",
      weekSelect: "Ընտրեք շաբաթը",
      monthSelect: "Ընտրեք ամիսը",
      yearSelect: "Ընտրեք տարին",
      decadeSelect: "Ընտրեք տասնամյակը",
      yearFormat: "YYYY",
      dateFormat: "DD/MM//YYYY",
      dayFormat: "DD",
      dateTimeFormat: "DD/MM//YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Անցած ամիս (PageUp)",
      nextMonth: "Մյուս ամիս (PageDown)",
      previousYear: "Անցած տարի (Control + left)",
      nextYear: "Մյուս տարի (Control + right)",
      previousDecade: "Անցած տասնամյակ",
      nextDecade: "Մյուս տասնամյակ",
      previousCentury: "Անցած դար",
      nextCentury: "Մյուս դար"
    },
    timePickerLocale: {
      placeholder: "Ընտրեք ժամը"
    }
  },
  TimePicker: {
    placeholder: "Ընտրեք ժամը"
  },
  Calendar: {
    lang: {
      locale: "hy-am",
      placeholder: "Ընտրեք ամսաթիվը",
      rangePlaceholder: ["Մեկնարկի ամսաթիվ", "Ավարտի ամսաթիվը"],
      today: "Այսօր",
      now: "Հիմա",
      backToToday: "Վերադառնալ այսօր",
      ok: "Օկ",
      clear: "Մաքրել",
      month: "Ամիս",
      year: "Տարի",
      timeSelect: "ընտրեք ժամը",
      dateSelect: "ընտրեք ամսաթիվը",
      weekSelect: "Ընտրեք շաբաթը",
      monthSelect: "Ընտրեք ամիսը",
      yearSelect: "Ընտրեք տարին",
      decadeSelect: "Ընտրեք տասնամյակը",
      yearFormat: "YYYY",
      dateFormat: "DD/MM//YYYY",
      dayFormat: "DD",
      dateTimeFormat: "DD/MM//YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Անցած ամիս (PageUp)",
      nextMonth: "Մյուս ամիս (PageDown)",
      previousYear: "Անցած տարի (Control + left)",
      nextYear: "Մյուս տարի (Control + right)",
      previousDecade: "Անցած տասնամյակ",
      nextDecade: "Մյուս տասնամյակ",
      previousCentury: "Անցած դար",
      nextCentury: "Մյուս դար"
    },
    timePickerLocale: {
      placeholder: "Ընտրեք ժամը"
    }
  },
  global: {
    placeholder: "Ընտրեք"
  },
  Table: {
    filterTitle: "ֆիլտրի ընտրացանկ",
    filterConfirm: "ֆիլտրել",
    filterReset: "Զրոյացնել",
    selectAll: "Ընտրեք ընթացիկ էջը",
    selectInvert: "Փոխարկել ընթացիկ էջը",
    sortTitle: "Տեսակավորել",
    expand: "Ընդլայնեք տողը",
    collapse: "Կրճատել տողը"
  },
  Modal: {
    okText: "Օկ",
    cancelText: "Չեղարկել",
    justOkText: "Օկ"
  },
  Popconfirm: {
    okText: "Հաստատել",
    cancelText: "Մերժել"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Որոնեք այստեղ",
    itemUnit: "պարագան",
    itemsUnit: "պարագաները"
  },
  Upload: {
    uploading: "Ներբեռնում...",
    removeFile: "Հեռացնել ֆայլը",
    uploadError: "Ներբեռնման սխալ",
    previewFile: "Դիտել ֆայլը",
    downloadFile: "Ներբեռնել ֆայլը"
  },
  Empty: {
    description: "Տվյալներ չկան"
  },
  Icon: {
    icon: "պատկեր"
  },
  Text: {
    edit: "Խմբագրել",
    copy: "Պատճենել",
    copied: "Պատճենվել է",
    expand: "Տեսնել ավելին"
  },
  PageHeader: {
    back: "Հետ"
  }
};
var id_ID = {
  locale: "id",
  Pagination: {
    items_per_page: "/ halaman",
    jump_to: "Menuju",
    jump_to_confirm: "konfirmasi",
    page: "Halaman",
    prev_page: "Halaman Sebelumnya",
    next_page: "Halaman Berikutnya",
    prev_5: "5 Halaman Sebelumnya",
    next_5: "5 Halaman Berikutnya",
    prev_3: "3 Halaman Sebelumnya",
    next_3: "3 Halaman Berikutnya",
    page_size: "ukuran halaman"
  },
  DatePicker: {
    lang: {
      placeholder: "Pilih tanggal",
      rangePlaceholder: ["Mulai tanggal", "Tanggal akhir"],
      locale: "id_ID",
      today: "Hari ini",
      now: "Sekarang",
      backToToday: "Kembali ke hari ini",
      ok: "Baik",
      clear: "Bersih",
      month: "Bulan",
      year: "Tahun",
      timeSelect: "pilih waktu",
      dateSelect: "pilih tanggal",
      weekSelect: "Pilih satu minggu",
      monthSelect: "Pilih satu bulan",
      yearSelect: "Pilih satu tahun",
      decadeSelect: "Pilih satu dekade",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Bulan sebelumnya (PageUp)",
      nextMonth: "Bulan selanjutnya (PageDown)",
      previousYear: "Tahun lalu (Control + kiri)",
      nextYear: "Tahun selanjutnya (Kontrol + kanan)",
      previousDecade: "Dekade terakhir",
      nextDecade: "Dekade berikutnya",
      previousCentury: "Abad terakhir",
      nextCentury: "Abad berikutnya"
    },
    timePickerLocale: {
      placeholder: "Pilih waktu"
    }
  },
  TimePicker: {
    placeholder: "Pilih waktu"
  },
  Calendar: {
    lang: {
      placeholder: "Pilih tanggal",
      rangePlaceholder: ["Mulai tanggal", "Tanggal akhir"],
      locale: "id_ID",
      today: "Hari ini",
      now: "Sekarang",
      backToToday: "Kembali ke hari ini",
      ok: "Baik",
      clear: "Bersih",
      month: "Bulan",
      year: "Tahun",
      timeSelect: "pilih waktu",
      dateSelect: "pilih tanggal",
      weekSelect: "Pilih satu minggu",
      monthSelect: "Pilih satu bulan",
      yearSelect: "Pilih satu tahun",
      decadeSelect: "Pilih satu dekade",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Bulan sebelumnya (PageUp)",
      nextMonth: "Bulan selanjutnya (PageDown)",
      previousYear: "Tahun lalu (Control + kiri)",
      nextYear: "Tahun selanjutnya (Kontrol + kanan)",
      previousDecade: "Dekade terakhir",
      nextDecade: "Dekade berikutnya",
      previousCentury: "Abad terakhir",
      nextCentury: "Abad berikutnya"
    },
    timePickerLocale: {
      placeholder: "Pilih waktu"
    }
  },
  Table: {
    filterTitle: "Saring",
    filterConfirm: "OK",
    filterReset: "Hapus",
    selectAll: "Pilih semua di halaman ini",
    selectInvert: "Balikkan pilihan di halaman ini",
    sortTitle: "Urutkan"
  },
  Modal: {
    okText: "OK",
    cancelText: "Batal",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Batal"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Cari",
    itemUnit: "item",
    itemsUnit: "item"
  },
  Upload: {
    uploading: "Mengunggah...",
    removeFile: "Hapus file",
    uploadError: "Kesalahan pengunggahan",
    previewFile: "File pratinjau",
    downloadFile: "Unduh berkas"
  },
  Empty: {
    description: "Tidak ada data"
  }
};
var is_IS = {
  locale: "is",
  Pagination: {
    items_per_page: "/ síðu",
    jump_to: "Síða",
    jump_to_confirm: "staðfest",
    page: "",
    prev_page: "Fyrri síða",
    next_page: "Næsta síða",
    prev_5: "Til baka 5 síður",
    next_5: "Áfram 5 síður",
    prev_3: "Til baka 3 síður",
    next_3: "Áfram 3 síður",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Veldu dag",
      rangePlaceholder: ["Upphafsdagur", "Lokadagur"],
      locale: "is_IS",
      today: "Í dag",
      now: "Núna",
      backToToday: "Til baka til dagsins í dag",
      ok: "Í lagi",
      clear: "Hreinsa",
      month: "Mánuður",
      year: "Ár",
      timeSelect: "Velja tíma",
      dateSelect: "Velja dag",
      monthSelect: "Velja mánuð",
      yearSelect: "Velja ár",
      decadeSelect: "Velja áratug",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Fyrri mánuður (PageUp)",
      nextMonth: "Næsti mánuður (PageDown)",
      previousYear: "Fyrra ár (Control + left)",
      nextYear: "Næsta ár (Control + right)",
      previousDecade: "Fyrri áratugur",
      nextDecade: "Næsti áratugur",
      previousCentury: "Fyrri öld",
      nextCentury: "Næsta öld"
    },
    timePickerLocale: {
      placeholder: "Velja tíma"
    }
  },
  TimePicker: {
    placeholder: "Velja tíma"
  },
  Calendar: {
    lang: {
      placeholder: "Veldu dag",
      rangePlaceholder: ["Upphafsdagur", "Lokadagur"],
      locale: "is_IS",
      today: "Í dag",
      now: "Núna",
      backToToday: "Til baka til dagsins í dag",
      ok: "Í lagi",
      clear: "Hreinsa",
      month: "Mánuður",
      year: "Ár",
      timeSelect: "Velja tíma",
      dateSelect: "Velja dag",
      monthSelect: "Velja mánuð",
      yearSelect: "Velja ár",
      decadeSelect: "Velja áratug",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Fyrri mánuður (PageUp)",
      nextMonth: "Næsti mánuður (PageDown)",
      previousYear: "Fyrra ár (Control + left)",
      nextYear: "Næsta ár (Control + right)",
      previousDecade: "Fyrri áratugur",
      nextDecade: "Næsti áratugur",
      previousCentury: "Fyrri öld",
      nextCentury: "Næsta öld"
    },
    timePickerLocale: {
      placeholder: "Velja tíma"
    }
  },
  Table: {
    filterTitle: "Afmarkanir",
    filterConfirm: "Staðfesta",
    filterReset: "Núllstilla",
    selectAll: "Velja allt",
    selectInvert: "Viðsnúa vali"
  },
  Modal: {
    okText: "Áfram",
    cancelText: "Hætta við",
    justOkText: "Í lagi"
  },
  Popconfirm: {
    okText: "Áfram",
    cancelText: "Hætta við"
  },
  Transfer: {
    searchPlaceholder: "Leita hér",
    itemUnit: "færsla",
    itemsUnit: "færslur"
  },
  Upload: {
    uploading: "Hleð upp...",
    removeFile: "Fjarlægja skrá",
    uploadError: "Villa við að hlaða upp",
    previewFile: "Forskoða skrá",
    downloadFile: "Hlaða niður skrá"
  },
  Empty: {
    description: "Engin gögn"
  }
};
var it_IT = {
  locale: "it",
  Pagination: {
    items_per_page: "/ pagina",
    jump_to: "vai a",
    jump_to_confirm: "Conferma",
    page: "Pagina",
    prev_page: "Pagina precedente",
    next_page: "Pagina successiva",
    prev_5: "Precedente 5 pagine",
    next_5: "Prossime 5 pagine",
    prev_3: "Precedente 3 pagine",
    next_3: "Prossime 3 pagine",
    page_size: "dimensioni della pagina"
  },
  DatePicker: {
    lang: {
      placeholder: "Selezionare la data",
      yearPlaceholder: "Selezionare l'anno",
      quarterPlaceholder: "Selezionare il trimestre",
      monthPlaceholder: "Selezionare il mese",
      weekPlaceholder: "Selezionare la settimana",
      rangePlaceholder: ["Data d'inizio", "Data di fine"],
      rangeYearPlaceholder: ["Anno d'inizio", "Anno di fine"],
      rangeMonthPlaceholder: ["Mese d'inizio ", "Mese di fine"],
      rangeWeekPlaceholder: ["Settimana d'inizio", "Settimana di fine"],
      locale: "it_IT",
      today: "Oggi",
      now: "Adesso",
      backToToday: "Torna ad oggi",
      ok: "Ok",
      clear: "Cancella",
      month: "Mese",
      year: "Anno",
      timeSelect: "Seleziona l'ora",
      dateSelect: "Seleziona la data",
      weekSelect: "Seleziona la settimana",
      monthSelect: "Seleziona il mese",
      yearSelect: "Seleziona l'anno",
      decadeSelect: "Seleziona il decennio",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Il mese scorso (PageUp)",
      nextMonth: "Il prossimo mese (PageDown)",
      previousYear: "L'anno scorso (Control + sinistra)",
      nextYear: "L'anno prossimo (Control + destra)",
      previousDecade: "Ultimo decennio",
      nextDecade: "Prossimo decennio",
      previousCentury: "Secolo precedente",
      nextCentury: "Prossimo secolo"
    },
    timePickerLocale: {
      placeholder: "Selezionare l'orario",
      rangePlaceholder: ["Ora d'inizio", "Ora di fine"]
    }
  },
  TimePicker: {
    placeholder: "Selezionare l'orario",
    rangePlaceholder: ["Ora d'inizio", "Ora di fine"]
  },
  Calendar: {
    lang: {
      placeholder: "Selezionare la data",
      yearPlaceholder: "Selezionare l'anno",
      quarterPlaceholder: "Selezionare il trimestre",
      monthPlaceholder: "Selezionare il mese",
      weekPlaceholder: "Selezionare la settimana",
      rangePlaceholder: ["Data d'inizio", "Data di fine"],
      rangeYearPlaceholder: ["Anno d'inizio", "Anno di fine"],
      rangeMonthPlaceholder: ["Mese d'inizio ", "Mese di fine"],
      rangeWeekPlaceholder: ["Settimana d'inizio", "Settimana di fine"],
      locale: "it_IT",
      today: "Oggi",
      now: "Adesso",
      backToToday: "Torna ad oggi",
      ok: "Ok",
      clear: "Cancella",
      month: "Mese",
      year: "Anno",
      timeSelect: "Seleziona l'ora",
      weekSelect: "Seleziona la settimana",
      dateSelect: "Seleziona la data",
      monthSelect: "Seleziona il mese",
      yearSelect: "Seleziona l'anno",
      decadeSelect: "Seleziona il decennio",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Il mese scorso (PageUp)",
      nextMonth: "Il prossimo mese (PageDown)",
      previousYear: "L'anno scorso (Control + sinistra)",
      nextYear: "L'anno prossimo (Control + destra)",
      previousDecade: "Ultimo decennio",
      nextDecade: "Prossimo decennio",
      previousCentury: "Secolo precedente",
      nextCentury: "Prossimo secolo"
    },
    timePickerLocale: {
      placeholder: "Selezionare l'orario",
      rangePlaceholder: ["Ora d'inizio", "Ora di fine"]
    }
  },
  global: {
    placeholder: "Selezionare"
  },
  Table: {
    filterTitle: "Menù Filtro",
    filterConfirm: "OK",
    filterReset: "Reset",
    filterEmptyText: "Nessun filtro",
    emptyText: "Nessun dato",
    selectAll: "Seleziona pagina corrente",
    selectInvert: "Inverti selezione nella pagina corrente",
    selectionAll: "Seleziona tutti i dati",
    sortTitle: "Ordina",
    expand: "Esapandi riga",
    collapse: "Chiudi riga",
    triggerDesc: "Clicca per ordinare in modo discendente",
    triggerAsc: "Clicca per ordinare in modo ascendente",
    cancelSort: "Clicca per eliminare i filtri",
    filterCheckall: "Seleziona tutto",
    filterSearchPlaceholder: "Cerca nei filtri",
    selectNone: "Pulisci tutti i dati"
  },
  Modal: {
    okText: "OK",
    cancelText: "Annulla",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Annulla"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Cerca qui",
    itemUnit: "elemento",
    itemsUnit: "elementi",
    remove: "Rimuovi",
    selectCurrent: "Seleziona pagina corrente",
    removeCurrent: "Rimuovi pagina corrente",
    selectAll: "Selezione tutti i dati",
    removeAll: "Rimuovi tutti i dati",
    selectInvert: "Inverti selezione nella pagina corrente"
  },
  Upload: {
    uploading: "Caricamento...",
    removeFile: "Rimuovi il file",
    uploadError: "Errore di caricamento",
    previewFile: "Anteprima file",
    downloadFile: "Download file"
  },
  Empty: {
    description: "Nessun dato"
  },
  Icon: {
    icon: "icona"
  },
  Text: {
    edit: "modifica",
    copy: "copia",
    copied: "copia effettuata",
    expand: "espandi"
  },
  PageHeader: {
    back: "Indietro"
  },
  Image: {
    preview: "Anteprima"
  }
};
var ja_JP = {
  locale: "ja",
  Pagination: {
    items_per_page: "件 / ページ",
    jump_to: "移動",
    jump_to_confirm: "確認する",
    page: "ページ",
    prev_page: "前のページ",
    next_page: "次のページ",
    prev_5: "前 5ページ",
    next_5: "次 5ページ",
    prev_3: "前 3ページ",
    next_3: "次 3ページ",
    page_size: "ページサイズ"
  },
  DatePicker: {
    lang: {
      placeholder: "日付を選択",
      yearPlaceholder: "年を選択",
      monthPlaceholder: "月を選択",
      weekPlaceholder: "週を選択",
      rangePlaceholder: ["開始日付", "終了日付"],
      rangeYearPlaceholder: ["開始年", "終了年"],
      rangeMonthPlaceholder: ["開始月", "終了月"],
      rangeWeekPlaceholder: ["開始週", "終了週"],
      locale: "ja_JP",
      today: "今日",
      now: "現在時刻",
      backToToday: "今日に戻る",
      ok: "決定",
      timeSelect: "時間を選択",
      dateSelect: "日時を選択",
      weekSelect: "週を選択",
      clear: "クリア",
      month: "月",
      year: "年",
      previousMonth: "前月 (ページアップキー)",
      nextMonth: "翌月 (ページダウンキー)",
      monthSelect: "月を選択",
      yearSelect: "年を選択",
      decadeSelect: "年代を選択",
      yearFormat: "YYYY年",
      dayFormat: "D日",
      dateFormat: "YYYY年M月D日",
      dateTimeFormat: "YYYY年M月D日 HH時mm分ss秒",
      previousYear: "前年 (Controlを押しながら左キー)",
      nextYear: "翌年 (Controlを押しながら右キー)",
      previousDecade: "前の年代",
      nextDecade: "次の年代",
      previousCentury: "前の世紀",
      nextCentury: "次の世紀"
    },
    timePickerLocale: {
      placeholder: "時間を選択",
      rangePlaceholder: ["開始時間", "終了時間"]
    }
  },
  TimePicker: {
    placeholder: "時間を選択",
    rangePlaceholder: ["開始時間", "終了時間"]
  },
  Calendar: {
    lang: {
      placeholder: "日付を選択",
      rangePlaceholder: ["開始日付", "終了日付"],
      locale: "ja_JP",
      today: "今日",
      now: "現在時刻",
      backToToday: "今日に戻る",
      ok: "決定",
      timeSelect: "時間を選択",
      dateSelect: "日時を選択",
      weekSelect: "週を選択",
      clear: "クリア",
      month: "月",
      year: "年",
      previousMonth: "前月 (ページアップキー)",
      nextMonth: "翌月 (ページダウンキー)",
      monthSelect: "月を選択",
      yearSelect: "年を選択",
      decadeSelect: "年代を選択",
      yearFormat: "YYYY年",
      dayFormat: "D日",
      dateFormat: "YYYY年M月D日",
      dateTimeFormat: "YYYY年M月D日 HH時mm分ss秒",
      previousYear: "前年 (Controlを押しながら左キー)",
      nextYear: "翌年 (Controlを押しながら右キー)",
      previousDecade: "前の年代",
      nextDecade: "次の年代",
      previousCentury: "前の世紀",
      nextCentury: "次の世紀"
    },
    timePickerLocale: {
      placeholder: "時間を選択",
      rangePlaceholder: ["開始時間", "終了時間"]
    }
  },
  Table: {
    filterTitle: "フィルター",
    filterConfirm: "OK",
    filterReset: "リセット",
    filterEmptyText: "フィルターなし",
    selectAll: "ページ単位で選択",
    selectInvert: "ページ単位で反転",
    selectionAll: "すべてを選択",
    sortTitle: "ソート",
    expand: "展開する",
    collapse: "折り畳む",
    triggerDesc: "クリックで降順にソート",
    triggerAsc: "クリックで昇順にソート",
    cancelSort: "ソートをキャンセル"
  },
  Modal: {
    okText: "OK",
    cancelText: "キャンセル",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "キャンセル"
  },
  Transfer: {
    searchPlaceholder: "ここを検索",
    itemUnit: "アイテム",
    itemsUnit: "アイテム"
  },
  Upload: {
    uploading: "アップロード中...",
    removeFile: "ファイルを削除",
    uploadError: "アップロードエラー",
    previewFile: "ファイルをプレビュー",
    downloadFile: "ダウンロードファイル"
  },
  Empty: {
    description: "データがありません"
  }
};
var ka_GE = {
  locale: "ka",
  Pagination: {
    items_per_page: "/ გვერდი.",
    jump_to: "გადასვლა",
    jump_to_confirm: "დადასტურება",
    page: "",
    prev_page: "წინა გვერდი",
    next_page: "შემდეგი გვერდი",
    prev_5: "წინა 5 გვერდი",
    next_5: "შემდეგი 5 გვერდი",
    prev_3: "წინა 3 გვერდი",
    next_3: "შემდეგი 3 გვერდი",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "აირჩიეთ თარიღი",
      yearPlaceholder: "აირჩიეთ წელი",
      quarterPlaceholder: "აირჩიეთ მეოთხედი",
      monthPlaceholder: "აირჩიეთ თვე",
      weekPlaceholder: "აირჩიეთ კვირა",
      rangePlaceholder: ["საწყისი თარიღი", "საბოლოო თარიღი"],
      rangeYearPlaceholder: ["საწყისი წელი", "საბოლოო წელი"],
      rangeMonthPlaceholder: ["საწყისი თვე", "საბოლოო თვე"],
      rangeWeekPlaceholder: ["საწყისი კვირა", "საბოლოო კვირა"],
      locale: "ka_GE",
      today: "დღეს",
      now: "ახლა",
      backToToday: "მიმდინარე თარიღი",
      ok: "Ok",
      clear: "გასუფთავება",
      month: "თვე",
      year: "წელი",
      timeSelect: "დროის არჩევა",
      dateSelect: "თარიღის არჩევა",
      weekSelect: "კვირის არჩევა",
      monthSelect: "თვის არჩევა",
      yearSelect: "წლის არჩევა",
      decadeSelect: "ათწლეულის არჩევა",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "წინა თვე (PageUp)",
      nextMonth: "მომდევნო თვე (PageDown)",
      previousYear: "წინა წელი (Control + left)",
      nextYear: "მომდევნო წელი (Control + right)",
      previousDecade: "წინა ათწლეული",
      nextDecade: "მომდევნო ათწლეული",
      previousCentury: "გასული საუკუნე",
      nextCentury: "მომდევნო საუკუნე"
    },
    timePickerLocale: {
      placeholder: "აირჩიეთ დრო",
      rangePlaceholder: ["საწყისი თარიღი", "საბოლოო თარიღი"]
    }
  },
  TimePicker: {
    placeholder: "აირჩიეთ დრო",
    rangePlaceholder: ["საწყისი თარიღი", "საბოლოო თარიღი"]
  },
  Calendar: {
    lang: {
      placeholder: "აირჩიეთ თარიღი",
      yearPlaceholder: "აირჩიეთ წელი",
      quarterPlaceholder: "აირჩიეთ მეოთხედი",
      monthPlaceholder: "აირჩიეთ თვე",
      weekPlaceholder: "აირჩიეთ კვირა",
      rangePlaceholder: ["საწყისი თარიღი", "საბოლოო თარიღი"],
      rangeYearPlaceholder: ["საწყისი წელი", "საბოლოო წელი"],
      rangeMonthPlaceholder: ["საწყისი თვე", "საბოლოო თვე"],
      rangeWeekPlaceholder: ["საწყისი კვირა", "საბოლოო კვირა"],
      locale: "ka_GE",
      today: "დღეს",
      now: "ახლა",
      backToToday: "მიმდინარე თარიღი",
      ok: "Ok",
      clear: "გასუფთავება",
      month: "თვე",
      year: "წელი",
      timeSelect: "დროის არჩევა",
      dateSelect: "თარიღის არჩევა",
      weekSelect: "კვირის არჩევა",
      monthSelect: "თვის არჩევა",
      yearSelect: "წლის არჩევა",
      decadeSelect: "ათწლეულის არჩევა",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "წინა თვე (PageUp)",
      nextMonth: "მომდევნო თვე (PageDown)",
      previousYear: "წინა წელი (Control + left)",
      nextYear: "მომდევნო წელი (Control + right)",
      previousDecade: "წინა ათწლეული",
      nextDecade: "მომდევნო ათწლეული",
      previousCentury: "გასული საუკუნე",
      nextCentury: "მომდევნო საუკუნე"
    },
    timePickerLocale: {
      placeholder: "აირჩიეთ დრო",
      rangePlaceholder: ["საწყისი თარიღი", "საბოლოო თარიღი"]
    }
  },
  global: {
    placeholder: "გთხოვთ აირჩიოთ"
  },
  Table: {
    filterTitle: "ფილტრის მენიუ",
    filterConfirm: "კარგი",
    filterReset: "გასუფთავება",
    filterEmptyText: "ფილტრები არაა",
    emptyText: "ინფორმაცია არაა",
    selectAll: "აირჩიეთ მიმდინარე გვერდი",
    selectInvert: "შეაბრუნეთ მიმდინარე გვერდი",
    selectionAll: "ყველას მონიშვნა",
    sortTitle: "დალაგება",
    expand: "სტრიქონის გაშლა",
    collapse: "სტრიქონის შეკუმშვა",
    triggerDesc: "დაღმავალი დალაგება",
    triggerAsc: "აღმავალი დალაგება",
    cancelSort: "დალაგების გაუქმება",
    selectNone: "მონაცემების გასუფთავება"
  },
  Modal: {
    okText: "კარგი",
    cancelText: "გაუქმება",
    justOkText: "ოკ"
  },
  Popconfirm: {
    okText: "კარგი",
    cancelText: "გაუქმება"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "მოძებნე აქ",
    itemUnit: "ერთეული",
    itemsUnit: "ერთეულები",
    remove: "ამოშლა",
    selectCurrent: "მიმდინარე გვერდის არჩევა",
    removeCurrent: "მიმდინარე გვერდის ამოშლა",
    selectAll: "ყველას მონიშვნა",
    removeAll: "ყველას წაშლა",
    selectInvert: "მიმდინარე გვერდის შებრუნება"
  },
  Upload: {
    uploading: "იტვირთება...",
    removeFile: "ფაილის ამოშლა",
    uploadError: "ატვირთვის შეცდომა",
    previewFile: "ფაილის გადახედვა",
    downloadFile: "ფაილის ჩამოტვირთვა"
  },
  Empty: {
    description: "ინფორმაცია არაა"
  },
  Icon: {
    icon: "ხატულა"
  },
  Text: {
    edit: "რედაქტირება",
    copy: "ასლი",
    copied: "ასლი აღებულია",
    expand: "გაშლა"
  },
  PageHeader: {
    back: "უკან"
  },
  Image: {
    preview: "გადახედვა"
  }
};
var km_KH = {
  locale: "km",
  Pagination: {
    items_per_page: "/ ទំព័រ",
    jump_to: "លោត​ទៅ",
    jump_to_confirm: "បញ្ជាក់",
    page: "ទំព័រ",
    prev_page: "ទំព័រ​មុន",
    next_page: "ទំព័រ​​បន្ទាប់",
    prev_5: "៥ ទំព័រថយក្រោយ",
    next_5: "៥ ទំព័រទៅមុខ",
    prev_3: "៣ ទំព័រថយក្រោយ",
    next_3: "៣ ទំព័រទៅមុខ",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "រើសថ្ងៃ",
      yearPlaceholder: "រើសឆ្នាំ",
      quarterPlaceholder: "រើសត្រីមាស",
      monthPlaceholder: "រើសខែ",
      weekPlaceholder: "រើសសប្តាហ៍",
      rangePlaceholder: ["ថ្ងៃចាប់ផ្ដើម", "ថ្ងៃបញ្ចប់"],
      rangeYearPlaceholder: ["ឆ្នាំចាប់ផ្ដើម", "ឆ្នាំបញ្ចប់"],
      rangeMonthPlaceholder: ["ខែចាប់ផ្ដើម", "ខែបញ្ចប់"],
      rangeWeekPlaceholder: ["សប្ដាហ៍ចាប់ផ្ដើម", "សប្ដាហ៍បញ្ចប់"],
      locale: "km",
      today: "ថ្ងៃនេះ",
      now: "ឥឡូវ​នេះ",
      backToToday: "ត្រលប់ទៅថ្ងៃនេះ",
      ok: "កំណត់",
      timeSelect: "រយៈពេលជ្រើសរើស",
      dateSelect: "ជ្រើសរើសកាលបរិច្ឆេទ",
      weekSelect: "ជ្រើសរើសសប្តាហ៍",
      clear: "ច្បាស់",
      month: "ខែ",
      year: "ឆ្នាំ",
      previousMonth: "ខែមុន (ឡើងទំព័រ)",
      nextMonth: "ខែបន្ទាប់ (ប៊ូតុងចុះទំព័រ)",
      monthSelect: "ជ្រើសរើសខែ",
      yearSelect: "ជ្រើសរើសឆ្នាំ",
      decadeSelect: "ជ្រើសរើសអាយុ",
      yearFormat: "YYYY",
      dayFormat: "D",
      dateFormat: "YYYY-M-D",
      dateTimeFormat: "YYYY-M-D HH:mm:ss",
      previousYear: "ឆ្នាំមុន (Controlគ្រាប់ចុចបូកព្រួញខាងឆ្វេង)",
      nextYear: "ឆ្នាំក្រោយ (Control គ្រាប់ចុចបូកព្រួញស្ដាំ)",
      previousDecade: "ជំនាន់ចុងក្រោយ",
      nextDecade: "ជំនាន់​ក្រោយ",
      previousCentury: "សតវត្សចុងក្រោយ",
      nextCentury: "សតវត្សរ៍បន្ទាប់",
      monthBeforeYear: true
    },
    timePickerLocale: {
      placeholder: "រើសម៉ោង",
      rangePlaceholder: ["ម៉ោងចប់ផ្ដើម", "ម៉ោងបញ្ចប់"]
    }
  },
  TimePicker: {
    placeholder: "រើសម៉ោង",
    rangePlaceholder: ["ម៉ោងចប់ផ្ដើម", "ម៉ោងបញ្ចប់"]
  },
  Calendar: {
    lang: {
      placeholder: "រើសថ្ងៃ",
      yearPlaceholder: "រើសឆ្នាំ",
      quarterPlaceholder: "រើសត្រីមាស",
      monthPlaceholder: "រើសខែ",
      weekPlaceholder: "រើសសប្តាហ៍",
      rangePlaceholder: ["ថ្ងៃចាប់ផ្ដើម", "ថ្ងៃបញ្ចប់"],
      rangeYearPlaceholder: ["ឆ្នាំចាប់ផ្ដើម", "ឆ្នាំបញ្ចប់"],
      rangeMonthPlaceholder: ["ខែចាប់ផ្ដើម", "ខែបញ្ចប់"],
      rangeWeekPlaceholder: ["សប្ដាហ៍ចាប់ផ្ដើម", "សប្ដាហ៍បញ្ចប់"],
      locale: "km",
      today: "ថ្ងៃនេះ",
      now: "ឥឡូវ​នេះ",
      backToToday: "ត្រលប់ទៅថ្ងៃនេះ",
      ok: "កំណត់",
      timeSelect: "រយៈពេលជ្រើសរើស",
      dateSelect: "ជ្រើសរើសកាលបរិច្ឆេទ",
      weekSelect: "ជ្រើសរើសសប្តាហ៍",
      clear: "ច្បាស់",
      month: "ខែ",
      year: "ឆ្នាំ",
      previousMonth: "ខែមុន (ឡើងទំព័រ)",
      nextMonth: "ខែបន្ទាប់ (ប៊ូតុងចុះទំព័រ)",
      monthSelect: "ជ្រើសរើសខែ",
      yearSelect: "ជ្រើសរើសឆ្នាំ",
      decadeSelect: "ជ្រើសរើសអាយុ",
      yearFormat: "YYYY",
      dayFormat: "D",
      dateFormat: "YYYY-M-D",
      dateTimeFormat: "YYYY-M-D HH:mm:ss",
      previousYear: "ឆ្នាំមុន (Controlគ្រាប់ចុចបូកព្រួញខាងឆ្វេង)",
      nextYear: "ឆ្នាំក្រោយ (Control គ្រាប់ចុចបូកព្រួញស្ដាំ)",
      previousDecade: "ជំនាន់ចុងក្រោយ",
      nextDecade: "ជំនាន់​ក្រោយ",
      previousCentury: "សតវត្សចុងក្រោយ",
      nextCentury: "សតវត្សរ៍បន្ទាប់",
      monthBeforeYear: true
    },
    timePickerLocale: {
      placeholder: "រើសម៉ោង",
      rangePlaceholder: ["ម៉ោងចប់ផ្ដើម", "ម៉ោងបញ្ចប់"]
    }
  },
  global: {
    placeholder: "សូមជ្រើសរើស"
  },
  Table: {
    filterTitle: "បញ្ចីតម្រៀប",
    filterConfirm: "យល់ព្រម",
    filterReset: "ត្រឡប់ដើម",
    filterEmptyText: "គ្មានបញ្ចីតម្រៀប",
    emptyText: "គ្មានទិន្នន័យ",
    selectAll: "រើសក្នុងទំព័រនេះ",
    selectInvert: "បញ្ច្រាសក្នុងទំព័រនេះ",
    selectNone: "លុបចេញទាំងអស់",
    selectionAll: "រើសយកទាំងអស់",
    sortTitle: "តម្រៀប",
    expand: "ពន្លាត",
    collapse: "បិតបាំង",
    triggerDesc: "ចុចដើម្បីរៀបតាមលំដាប់ធំ",
    triggerAsc: "ចុចដើម្បីរៀបតាមលំដាប់តូច​",
    cancelSort: "ចុចដើម្បីបោះបង់"
  },
  Modal: {
    okText: "យល់ព្រម",
    cancelText: "បោះបង់",
    justOkText: "យល់ព្រម"
  },
  Popconfirm: {
    okText: "យល់ព្រម",
    cancelText: "បោះបង់"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "ស្វែងរកនៅទីនេះ",
    itemUnit: "item",
    itemsUnit: "items",
    remove: "លុប",
    selectCurrent: "រើសទំព័របច្ចុប្បន្ន",
    removeCurrent: "លុបទំព័របច្ចុប្បន្ន",
    selectAll: "រើសទិន្នន័យទាំងអស់",
    removeAll: "លុបទិន្នន័យទាំងអស់",
    selectInvert: "បញ្ច្រាសទំព័របច្ចុប្បន្ន"
  },
  Upload: {
    uploading: "កំពុងបញ្ចូលឡើង...",
    removeFile: "លុបឯកសារ",
    uploadError: "បញ្ចូលមិនជោកជ័យ",
    previewFile: "មើលឯកសារ",
    downloadFile: "ទាញយកឯកសារ"
  },
  Empty: {
    description: "គ្មានទិន្នន័យ"
  },
  Icon: {
    icon: "icon"
  },
  Text: {
    edit: "កែ",
    copy: "Copy",
    copied: "Copied",
    expand: "ពង្រីក"
  },
  PageHeader: {
    back: "Back"
  }
};
var kk_KZ = {
  locale: "kk",
  Pagination: {
    items_per_page: "/ бет",
    jump_to: "Секіру",
    jump_to_confirm: "Растау",
    page: "",
    prev_page: "Артқа",
    next_page: "Алға",
    prev_5: "Алдыңғы 5",
    next_5: "Келесі 5",
    prev_3: "Алдыңғы 3",
    next_3: "Келесі 3",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Күнді таңдаңыз",
      yearPlaceholder: "Жылды таңдаңыз",
      quarterPlaceholder: "Тоқсанды таңдаңыз",
      monthPlaceholder: "Айды таңдаңыз",
      weekPlaceholder: "Аптаны таңдаңыз",
      rangePlaceholder: ["Бастау күні", "Аяқталу күні"],
      rangeYearPlaceholder: ["Бастау жылы", "Аяқталу жылы"],
      rangeMonthPlaceholder: ["Бастау айы", "Аяқталу айы"],
      rangeWeekPlaceholder: ["Бастау апта", "Аяқталу апта"],
      locale: "kk_KZ",
      today: "Бүгін",
      now: "Қазір",
      backToToday: "Ағымдағы күн",
      ok: "Таңдау",
      clear: "Таза",
      month: "Ай",
      year: "Жыл",
      timeSelect: "Уақытты таңдау",
      dateSelect: "Күнді таңдау",
      monthSelect: "Айды таңдаңыз",
      yearSelect: "Жылды таңдаңыз",
      decadeSelect: "Онжылды таңдаңыз",
      yearFormat: "YYYY",
      dateFormat: "D-M-YYYY",
      dayFormat: "D",
      dateTimeFormat: "D-M-YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Алдыңғы ай (PageUp)",
      nextMonth: "Келесі ай (PageDown)",
      previousYear: "Алдыңғы жыл (Control + left)",
      nextYear: "Келесі жыл (Control + right)",
      previousDecade: "Алдыңғы онжылдық",
      nextDecade: "Келесі онжылдық",
      previousCentury: "Алдыңғы ғасыр",
      nextCentury: "Келесі ғасыр"
    },
    timePickerLocale: {
      placeholder: "Уақытты таңдаңыз",
      rangePlaceholder: ["Бастау уақыты", "Аяқталу уақыты"]
    }
  },
  TimePicker: {
    placeholder: "Уақытты таңдаңыз",
    rangePlaceholder: ["Бастау уақыты", "Аяқталу уақыты"]
  },
  Calendar: {
    lang: {
      placeholder: "Күнді таңдаңыз",
      yearPlaceholder: "Жылды таңдаңыз",
      quarterPlaceholder: "Тоқсанды таңдаңыз",
      monthPlaceholder: "Айды таңдаңыз",
      weekPlaceholder: "Аптаны таңдаңыз",
      rangePlaceholder: ["Бастау күні", "Аяқталу күні"],
      rangeYearPlaceholder: ["Бастау жылы", "Аяқталу жылы"],
      rangeMonthPlaceholder: ["Бастау айы", "Аяқталу айы"],
      rangeWeekPlaceholder: ["Бастау апта", "Аяқталу апта"],
      locale: "kk_KZ",
      today: "Бүгін",
      now: "Қазір",
      backToToday: "Ағымдағы күн",
      ok: "Таңдау",
      clear: "Таза",
      month: "Ай",
      year: "Жыл",
      timeSelect: "Уақытты таңдау",
      dateSelect: "Күнді таңдау",
      monthSelect: "Айды таңдаңыз",
      yearSelect: "Жылды таңдаңыз",
      decadeSelect: "Онжылды таңдаңыз",
      yearFormat: "YYYY",
      dateFormat: "D-M-YYYY",
      dayFormat: "D",
      dateTimeFormat: "D-M-YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Алдыңғы ай (PageUp)",
      nextMonth: "Келесі ай (PageDown)",
      previousYear: "Алдыңғы жыл (Control + left)",
      nextYear: "Келесі жыл (Control + right)",
      previousDecade: "Алдыңғы онжылдық",
      nextDecade: "Келесі онжылдық",
      previousCentury: "Алдыңғы ғасыр",
      nextCentury: "Келесі ғасыр"
    },
    timePickerLocale: {
      placeholder: "Уақытты таңдаңыз",
      rangePlaceholder: ["Бастау уақыты", "Аяқталу уақыты"]
    }
  },
  global: {
    placeholder: "Таңдаңыз"
  },
  Table: {
    filterTitle: "Фильтр",
    filterConfirm: "OK",
    filterReset: "Тазарту",
    filterEmptyText: "Фильтр жоқ",
    emptyText: "Деректер жоқ",
    selectAll: "Барлығын таңдау",
    selectInvert: "Таңдауды төңкеру",
    selectionAll: "Барлық деректерді таңдаңыз",
    sortTitle: "Сұрыптау",
    expand: "Жолды жазу",
    collapse: "Жолды бүктеу",
    triggerDesc: "Төмендеуді сұрыптау үшін басыңыз",
    triggerAsc: "Өсу ретімен сұрыптау үшін басыңыз",
    cancelSort: "Сұрыптаудан бас тарту үшін басыңыз"
  },
  Modal: {
    okText: "Жарайды",
    cancelText: "Болдырмау",
    justOkText: "Жарайды"
  },
  Popconfirm: {
    okText: "Жарайды",
    cancelText: "Болдырмау"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Іздеу",
    itemUnit: "элемент.",
    itemsUnit: "элемент.",
    remove: "Жою",
    selectAll: "Барлық деректерді таңдау",
    selectCurrent: "Ағымдағы бетті таңдау",
    selectInvert: "Кері тәртіпте көрсету",
    removeAll: "Барлық деректерді жою",
    removeCurrent: "Ағымдағы парақты өшіру"
  },
  Upload: {
    uploading: "Жүктеу...",
    removeFile: "Файлды жою",
    uploadError: "Жүктеу кезінде қате пайда болды",
    previewFile: "Файлды алдын ала қарау",
    downloadFile: "Файлды жүктеу"
  },
  Empty: {
    description: "Деректер жоқ"
  },
  Icon: {
    icon: "белгішесі"
  },
  Text: {
    edit: "Өңдеу",
    copy: "Көшіру",
    copied: "Көшірілді",
    expand: "Жазу"
  },
  PageHeader: {
    back: "Артқа"
  }
};
var kmr_IQ = {
  locale: "ku",
  Pagination: {
    items_per_page: "/ rûpel",
    jump_to: "Biçe",
    jump_to_confirm: "piştrast bike",
    page: "",
    prev_page: "Rûpelê Pêş",
    next_page: "Rûpelê Paş",
    prev_5: "5 Rûpelên Pêş",
    next_5: "5 Rûpelên Paş",
    prev_3: "3 Rûpelên Pêş",
    next_3: "3 Rûpelên Paş",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Dîrok hilbijêre",
      rangePlaceholder: ["Dîroka destpêkê", "Dîroka dawîn"],
      locale: "ku",
      today: "Îro",
      now: "Niha",
      backToToday: "Vegere îro",
      ok: "Temam",
      clear: "Paqij bike",
      month: "Meh",
      year: "Sal",
      timeSelect: "Demê hilbijêre",
      dateSelect: "Dîrok hilbijêre",
      monthSelect: "Meh hilbijêre",
      yearSelect: "Sal hilbijêre",
      decadeSelect: "Dehsal hilbijêre",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Meha peş (PageUp))",
      nextMonth: "Meha paş (PageDown)",
      previousYear: "Sala peş (Control + şep)",
      nextYear: "Sala paş (Control + rast)",
      previousDecade: "Dehsalen peş",
      nextDecade: "Dehsalen paş",
      previousCentury: "Sedsalen peş",
      nextCentury: "Sedsalen paş"
    },
    timePickerLocale: {
      placeholder: "Demê hilbijêre"
    }
  },
  TimePicker: {
    placeholder: "Demê hilbijêre"
  },
  Calendar: {
    lang: {
      placeholder: "Dîrok hilbijêre",
      rangePlaceholder: ["Dîroka destpêkê", "Dîroka dawîn"],
      locale: "ku",
      today: "Îro",
      now: "Niha",
      backToToday: "Vegere îro",
      ok: "Temam",
      clear: "Paqij bike",
      month: "Meh",
      year: "Sal",
      timeSelect: "Demê hilbijêre",
      dateSelect: "Dîrok hilbijêre",
      monthSelect: "Meh hilbijêre",
      yearSelect: "Sal hilbijêre",
      decadeSelect: "Dehsal hilbijêre",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Meha peş (PageUp))",
      nextMonth: "Meha paş (PageDown)",
      previousYear: "Sala peş (Control + şep)",
      nextYear: "Sala paş (Control + rast)",
      previousDecade: "Dehsalen peş",
      nextDecade: "Dehsalen paş",
      previousCentury: "Sedsalen peş",
      nextCentury: "Sedsalen paş"
    },
    timePickerLocale: {
      placeholder: "Demê hilbijêre"
    }
  },
  Table: {
    filterTitle: "Menuê peldanka",
    filterConfirm: "Temam",
    filterReset: "Jê bibe",
    selectAll: "Hemî hilbijêre",
    selectInvert: "Hilbijartinan veguhere"
  },
  Modal: {
    okText: "Temam",
    cancelText: "Betal ke",
    justOkText: "Temam"
  },
  Popconfirm: {
    okText: "Temam",
    cancelText: "Betal ke"
  },
  Transfer: {
    searchPlaceholder: "Lêgerîn",
    itemUnit: "tişt",
    itemsUnit: "tişt"
  },
  Upload: {
    uploading: "Bardike...",
    removeFile: "Pelê rabike",
    uploadError: "Xeta barkirine",
    previewFile: "Pelê pêşbibîne",
    downloadFile: "Pelê dakêşin"
  },
  Empty: {
    description: "Agahî tune"
  }
};
var kn_IN = {
  locale: "kn",
  Pagination: {
    items_per_page: "/ ಪುಟ",
    jump_to: "ಜಿಗಿತವನ್ನು",
    jump_to_confirm: "ಖಚಿತಪಡಿಸಲು ಜಿಗಿತವನ್ನು",
    page: "",
    prev_page: "ಹಿಂದಿನ ಪುಟ",
    next_page: "ಮುಂದಿನ ಪುಟ",
    prev_5: "ಹಿಂದಿನ 5 ಪುಟಗಳು",
    next_5: "ಮುಂದಿನ 5 ಪುಟಗಳು",
    prev_3: "ಹಿಂದಿನ 3 ಪುಟಗಳು",
    next_3: "ಮುಂದಿನ 3 ಪುಟಗಳು",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ",
      rangePlaceholder: ["ಪ್ರಾರಂಭ ದಿನಾಂಕ", "ಅಂತಿಮ ದಿನಾಂಕ"],
      locale: "kn_IN",
      today: "ಇಂದು",
      now: "ಈಗ",
      backToToday: "ಇಂದು ಹಿಂದಿರುಗಿ",
      ok: "ಸರಿ",
      clear: "ಸ್ಪಷ್ಟ",
      month: "ತಿಂಗಳು",
      year: "ವರ್ಷ",
      timeSelect: "ಸಮಯ ಆಯ್ಕೆಮಾಡಿ",
      dateSelect: "ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
      weekSelect: "ಒಂದು ವಾರದ ಆರಿಸಿ",
      monthSelect: "ಒಂದು ತಿಂಗಳು ಆಯ್ಕೆಮಾಡಿ",
      yearSelect: "ಒಂದು ವರ್ಷ ಆರಿಸಿ",
      decadeSelect: "ಒಂದು ದಶಕದ ಆಯ್ಕೆಮಾಡಿ",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "ಹಿಂದಿನ ತಿಂಗಳು (ಪೇಜ್ಅಪ್)",
      nextMonth: "ಮುಂದಿನ ತಿಂಗಳು (ಪೇಜ್ಡೌನ್)",
      previousYear: "ಕಳೆದ ವರ್ಷ (Ctrl + ಎಡ)",
      nextYear: "ಮುಂದಿನ ವರ್ಷ (Ctrl + ಬಲ)",
      previousDecade: "ಕಳೆದ ದಶಕ",
      nextDecade: "ಮುಂದಿನ ದಶಕ",
      previousCentury: "ಕಳೆದ ಶತಮಾನ",
      nextCentury: "ಮುಂದಿನ ಶತಮಾನ"
    },
    timePickerLocale: {
      placeholder: "ಸಮಯ ಆಯ್ಕೆಮಾಡಿ"
    }
  },
  TimePicker: {
    placeholder: "ಸಮಯ ಆಯ್ಕೆಮಾಡಿ"
  },
  Calendar: {
    lang: {
      placeholder: "ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ",
      rangePlaceholder: ["ಪ್ರಾರಂಭ ದಿನಾಂಕ", "ಅಂತಿಮ ದಿನಾಂಕ"],
      locale: "kn_IN",
      today: "ಇಂದು",
      now: "ಈಗ",
      backToToday: "ಇಂದು ಹಿಂದಿರುಗಿ",
      ok: "ಸರಿ",
      clear: "ಸ್ಪಷ್ಟ",
      month: "ತಿಂಗಳು",
      year: "ವರ್ಷ",
      timeSelect: "ಸಮಯ ಆಯ್ಕೆಮಾಡಿ",
      dateSelect: "ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
      weekSelect: "ಒಂದು ವಾರದ ಆರಿಸಿ",
      monthSelect: "ಒಂದು ತಿಂಗಳು ಆಯ್ಕೆಮಾಡಿ",
      yearSelect: "ಒಂದು ವರ್ಷ ಆರಿಸಿ",
      decadeSelect: "ಒಂದು ದಶಕದ ಆಯ್ಕೆಮಾಡಿ",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "ಹಿಂದಿನ ತಿಂಗಳು (ಪೇಜ್ಅಪ್)",
      nextMonth: "ಮುಂದಿನ ತಿಂಗಳು (ಪೇಜ್ಡೌನ್)",
      previousYear: "ಕಳೆದ ವರ್ಷ (Ctrl + ಎಡ)",
      nextYear: "ಮುಂದಿನ ವರ್ಷ (Ctrl + ಬಲ)",
      previousDecade: "ಕಳೆದ ದಶಕ",
      nextDecade: "ಮುಂದಿನ ದಶಕ",
      previousCentury: "ಕಳೆದ ಶತಮಾನ",
      nextCentury: "ಮುಂದಿನ ಶತಮಾನ"
    },
    timePickerLocale: {
      placeholder: "ಸಮಯ ಆಯ್ಕೆಮಾಡಿ"
    }
  },
  global: {
    placeholder: "ದಯವಿಟ್ಟು ಆರಿಸಿ"
  },
  Table: {
    filterTitle: "ಪಟ್ಟಿ ಸೋಸಿ",
    filterConfirm: "ಸರಿ",
    filterReset: "ಮರುಹೊಂದಿಸಿ",
    emptyText: "ಮಾಹಿತಿ ಇಲ್ಲ",
    selectAll: "ಪ್ರಸ್ತುತ ಪುಟವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    selectInvert: "ಪ್ರಸ್ತುತ ಪುಟವನ್ನು ತಿರುಗಿಸಿ",
    sortTitle: "ವಿಂಗಡಿಸಿ"
  },
  Modal: {
    okText: "ಸರಿ",
    cancelText: "ರದ್ದು",
    justOkText: "ಸರಿ"
  },
  Popconfirm: {
    okText: "ಸರಿ",
    cancelText: "ರದ್ದು"
  },
  Transfer: {
    titles: ["", ""],
    notFoundContent: "ದೊರೆತಿಲ್ಲ",
    searchPlaceholder: "ಇಲ್ಲಿ ಹುಡುಕಿ",
    itemUnit: "ವಿಷಯ",
    itemsUnit: "ವಿಷಯಗಳು"
  },
  Select: {
    notFoundContent: "ದೊರೆತಿಲ್ಲ"
  },
  Upload: {
    uploading: "ಏರಿಸಿ...",
    removeFile: "ಫೈಲ್ ತೆಗೆದುಹಾಕಿ",
    uploadError: "ಏರಿಸುವ ದೋಷ",
    previewFile: "ಫೈಲ್ ಮುನ್ನೋಟ",
    downloadFile: "ಫೈಲ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ"
  }
};
var ko_KR = {
  locale: "ko",
  Pagination: {
    items_per_page: "/ 쪽",
    jump_to: "이동하기",
    jump_to_confirm: "확인하다",
    page: "페이지",
    prev_page: "이전 페이지",
    next_page: "다음 페이지",
    prev_5: "이전 5 페이지",
    next_5: "다음 5 페이지",
    prev_3: "이전 3 페이지",
    next_3: "다음 3 페이지",
    page_size: "페이지 크기"
  },
  DatePicker: {
    lang: {
      placeholder: "날짜 선택",
      rangePlaceholder: ["시작일", "종료일"],
      locale: "ko_KR",
      today: "오늘",
      now: "현재 시각",
      backToToday: "오늘로 돌아가기",
      ok: "확인",
      clear: "지우기",
      month: "월",
      year: "년",
      timeSelect: "시간 선택",
      dateSelect: "날짜 선택",
      monthSelect: "달 선택",
      yearSelect: "연 선택",
      decadeSelect: "연대 선택",
      yearFormat: "YYYY년",
      dateFormat: "YYYY-MM-DD",
      dayFormat: "Do",
      dateTimeFormat: "YYYY-MM-DD HH:mm:ss",
      monthBeforeYear: false,
      previousMonth: "이전 달 (PageUp)",
      nextMonth: "다음 달 (PageDown)",
      previousYear: "이전 해 (Control + left)",
      nextYear: "다음 해 (Control + right)",
      previousDecade: "이전 연대",
      nextDecade: "다음 연대",
      previousCentury: "이전 세기",
      nextCentury: "다음 세기"
    },
    timePickerLocale: {
      placeholder: "시간 선택",
      rangePlaceholder: ["시작 시간", "종료 시간"]
    }
  },
  TimePicker: {
    placeholder: "시간 선택",
    rangePlaceholder: ["시작 시간", "종료 시간"]
  },
  Calendar: {
    lang: {
      placeholder: "날짜 선택",
      rangePlaceholder: ["시작일", "종료일"],
      locale: "ko_KR",
      today: "오늘",
      now: "현재 시각",
      backToToday: "오늘로 돌아가기",
      ok: "확인",
      clear: "지우기",
      month: "월",
      year: "년",
      timeSelect: "시간 선택",
      dateSelect: "날짜 선택",
      monthSelect: "달 선택",
      yearSelect: "연 선택",
      decadeSelect: "연대 선택",
      yearFormat: "YYYY년",
      dateFormat: "YYYY-MM-DD",
      dayFormat: "Do",
      dateTimeFormat: "YYYY-MM-DD HH:mm:ss",
      monthBeforeYear: false,
      previousMonth: "이전 달 (PageUp)",
      nextMonth: "다음 달 (PageDown)",
      previousYear: "이전 해 (Control + left)",
      nextYear: "다음 해 (Control + right)",
      previousDecade: "이전 연대",
      nextDecade: "다음 연대",
      previousCentury: "이전 세기",
      nextCentury: "다음 세기"
    },
    timePickerLocale: {
      placeholder: "시간 선택",
      rangePlaceholder: ["시작 시간", "종료 시간"]
    }
  },
  Table: {
    filterTitle: "필터 메뉴",
    filterConfirm: "확인",
    filterReset: "초기화",
    selectAll: "모두 선택",
    selectInvert: "선택 반전",
    filterEmptyText: "필터 없음",
    emptyText: "데이터 없음"
  },
  Modal: {
    okText: "확인",
    cancelText: "취소",
    justOkText: "확인"
  },
  Popconfirm: {
    okText: "확인",
    cancelText: "취소"
  },
  Transfer: {
    searchPlaceholder: "여기에 검색하세요",
    itemUnit: "개",
    itemsUnit: "개"
  },
  Upload: {
    uploading: "업로드 중...",
    removeFile: "파일 삭제",
    uploadError: "업로드 실패",
    previewFile: "파일 미리보기",
    downloadFile: "파일 다운로드"
  },
  Empty: {
    description: "데이터 없음"
  }
};
var ku_IQ = {
  locale: "ku-iq",
  Pagination: {
    items_per_page: "/ rûpel",
    jump_to: "Biçe",
    jump_to_confirm: "piştrast bike",
    page: "",
    prev_page: "Rûpelê Pêş",
    next_page: "Rûpelê Paş",
    prev_5: "5 Rûpelên Pêş",
    next_5: "5 Rûpelên Paş",
    prev_3: "3 Rûpelên Pêş",
    next_3: "3 Rûpelên Paş",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Dîrok hilbijêre",
      rangePlaceholder: ["Dîroka destpêkê", "Dîroka dawîn"],
      locale: "ku",
      today: "Îro",
      now: "Niha",
      backToToday: "Vegere îro",
      ok: "Temam",
      clear: "Paqij bike",
      month: "Meh",
      year: "Sal",
      timeSelect: "Demê hilbijêre",
      dateSelect: "Dîrok hilbijêre",
      monthSelect: "Meh hilbijêre",
      yearSelect: "Sal hilbijêre",
      decadeSelect: "Dehsal hilbijêre",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Meha peş (PageUp))",
      nextMonth: "Meha paş (PageDown)",
      previousYear: "Sala peş (Control + şep)",
      nextYear: "Sala paş (Control + rast)",
      previousDecade: "Dehsalen peş",
      nextDecade: "Dehsalen paş",
      previousCentury: "Sedsalen peş",
      nextCentury: "Sedsalen paş"
    },
    timePickerLocale: {
      placeholder: "Demê hilbijêre"
    }
  },
  TimePicker: {
    placeholder: "Demê hilbijêre"
  },
  Calendar: {
    lang: {
      placeholder: "Dîrok hilbijêre",
      rangePlaceholder: ["Dîroka destpêkê", "Dîroka dawîn"],
      locale: "ku",
      today: "Îro",
      now: "Niha",
      backToToday: "Vegere îro",
      ok: "Temam",
      clear: "Paqij bike",
      month: "Meh",
      year: "Sal",
      timeSelect: "Demê hilbijêre",
      dateSelect: "Dîrok hilbijêre",
      monthSelect: "Meh hilbijêre",
      yearSelect: "Sal hilbijêre",
      decadeSelect: "Dehsal hilbijêre",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Meha peş (PageUp))",
      nextMonth: "Meha paş (PageDown)",
      previousYear: "Sala peş (Control + şep)",
      nextYear: "Sala paş (Control + rast)",
      previousDecade: "Dehsalen peş",
      nextDecade: "Dehsalen paş",
      previousCentury: "Sedsalen peş",
      nextCentury: "Sedsalen paş"
    },
    timePickerLocale: {
      placeholder: "Demê hilbijêre"
    }
  },
  Table: {
    filterTitle: "Menuê peldanka",
    filterConfirm: "Temam",
    filterReset: "Jê bibe",
    selectAll: "Hemî hilbijêre",
    selectInvert: "Hilbijartinan veguhere"
  },
  Modal: {
    okText: "Temam",
    cancelText: "Betal ke",
    justOkText: "Temam"
  },
  Popconfirm: {
    okText: "Temam",
    cancelText: "Betal ke"
  },
  Transfer: {
    searchPlaceholder: "Lêgerîn",
    itemUnit: "tişt",
    itemsUnit: "tişt"
  },
  Upload: {
    uploading: "Bardike...",
    removeFile: "Pelê rabike",
    uploadError: "Xeta barkirine",
    previewFile: "Pelê pêşbibîne",
    downloadFile: "Pelê dakêşin"
  },
  Empty: {
    description: "Agahî tune"
  }
};
var lt_LT = {
  locale: "lt",
  Pagination: {
    items_per_page: "/ psl.",
    jump_to: "Pereiti",
    jump_to_confirm: "patvirtinti",
    page: "",
    prev_page: "Atgal",
    next_page: "Pirmyn",
    prev_5: "Grįžti 5 pls.",
    next_5: "Peršokti 5 pls.",
    prev_3: "Grįžti 3 pls.",
    next_3: "Peršokti 3 pls.",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Pasirinkite datą",
      yearPlaceholder: "Pasirinkite metus",
      quarterPlaceholder: "Pasirinkite ketvirtį",
      monthPlaceholder: "Pasirinkite mėnesį",
      weekPlaceholder: "Pasirinkite savaitę",
      rangePlaceholder: ["Pradžios data", "Pabaigos data"],
      rangeYearPlaceholder: ["Pradžios metai", "Pabaigos metai"],
      rangeMonthPlaceholder: ["Pradžios mėnesis", "Pabaigos mėnesis"],
      rangeWeekPlaceholder: ["Pradžios savaitė", "Pabaigos savaitė"],
      locale: "lt_LT",
      today: "Šiandien",
      now: "Dabar",
      backToToday: "Rodyti šiandien",
      ok: "Gerai",
      clear: "Išvalyti",
      month: "Mėnesis",
      year: "Metai",
      timeSelect: "Pasirinkti laiką",
      dateSelect: "Pasirinkti datą",
      monthSelect: "Pasirinkti mėnesį",
      yearSelect: "Pasirinkti metus",
      decadeSelect: "Pasirinkti dešimtmetį",
      yearFormat: "YYYY",
      dateFormat: "YYYY-MM-DD",
      dayFormat: "DD",
      dateTimeFormat: "YYYY-MM-DD HH:MM:SS",
      monthBeforeYear: true,
      previousMonth: "Buvęs mėnesis (PageUp)",
      nextMonth: "Sekantis mėnesis (PageDown)",
      previousYear: "Buvę metai (Control + left)",
      nextYear: "Sekantis metai (Control + right)",
      previousDecade: "Buvęs dešimtmetis",
      nextDecade: "Sekantis dešimtmetis",
      previousCentury: "Buvęs amžius",
      nextCentury: "Sekantis amžius"
    },
    timePickerLocale: {
      placeholder: "Pasirinkite laiką",
      rangePlaceholder: ["Pradžios laikas", "Pabaigos laikas"]
    }
  },
  TimePicker: {
    placeholder: "Pasirinkite laiką",
    rangePlaceholder: ["Pradžios laikas", "Pabaigos laikas"]
  },
  Calendar: {
    lang: {
      placeholder: "Pasirinkite datą",
      yearPlaceholder: "Pasirinkite metus",
      quarterPlaceholder: "Pasirinkite ketvirtį",
      monthPlaceholder: "Pasirinkite mėnesį",
      weekPlaceholder: "Pasirinkite savaitę",
      rangePlaceholder: ["Pradžios data", "Pabaigos data"],
      rangeYearPlaceholder: ["Pradžios metai", "Pabaigos metai"],
      rangeMonthPlaceholder: ["Pradžios mėnesis", "Pabaigos mėnesis"],
      rangeWeekPlaceholder: ["Pradžios savaitė", "Pabaigos savaitė"],
      locale: "lt_LT",
      today: "Šiandien",
      now: "Dabar",
      backToToday: "Rodyti šiandien",
      ok: "Gerai",
      clear: "Išvalyti",
      month: "Mėnesis",
      year: "Metai",
      timeSelect: "Pasirinkti laiką",
      dateSelect: "Pasirinkti datą",
      monthSelect: "Pasirinkti mėnesį",
      yearSelect: "Pasirinkti metus",
      decadeSelect: "Pasirinkti dešimtmetį",
      yearFormat: "YYYY",
      dateFormat: "YYYY-MM-DD",
      dayFormat: "DD",
      dateTimeFormat: "YYYY-MM-DD HH:MM:SS",
      monthBeforeYear: true,
      previousMonth: "Buvęs mėnesis (PageUp)",
      nextMonth: "Sekantis mėnesis (PageDown)",
      previousYear: "Buvę metai (Control + left)",
      nextYear: "Sekantis metai (Control + right)",
      previousDecade: "Buvęs dešimtmetis",
      nextDecade: "Sekantis dešimtmetis",
      previousCentury: "Buvęs amžius",
      nextCentury: "Sekantis amžius"
    },
    timePickerLocale: {
      placeholder: "Pasirinkite laiką",
      rangePlaceholder: ["Pradžios laikas", "Pabaigos laikas"]
    }
  },
  Table: {
    filterTitle: "Filtras",
    filterConfirm: "Gerai",
    filterReset: "Atstatyti",
    filterEmptyText: "Be filtrų",
    emptyText: "Nėra duomenų",
    selectAll: "Pasirinkti viską",
    selectInvert: "Apversti pasirinkimą",
    selectionAll: "Rinktis visus",
    sortTitle: "Rikiavimas",
    expand: "Išskleisti",
    collapse: "Suskleisti",
    triggerDesc: "Spustelėkite norėdami rūšiuoti mažėjančia tvarka",
    triggerAsc: "Spustelėkite norėdami rūšiuoti didėjančia tvarka",
    cancelSort: "Spustelėkite, kad atšauktumėte rūšiavimą"
  },
  Modal: {
    okText: "Taip",
    cancelText: "Atšaukti",
    justOkText: "Gerai"
  },
  Popconfirm: {
    okText: "Taip",
    cancelText: "Atšaukti"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Paieška",
    itemUnit: "vnt.",
    itemsUnit: "vnt.",
    remove: "Pašalinti",
    selectAll: "Pasirinkti visus",
    selectCurrent: "Pasirinkite dabartinį puslapį",
    selectInvert: "Atkeist pasirinkimą",
    removeAll: "Ištrinti visus duomenis",
    removeCurrent: "Ištrinti dabartinį puslapį"
  },
  Upload: {
    uploading: "Gaunami duomenys...",
    removeFile: "Ištrinti failą",
    uploadError: "Įkeliant įvyko klaida",
    previewFile: "Failo peržiūra",
    downloadFile: "Įkelti failą"
  },
  Empty: {
    description: "Nėra duomenų"
  },
  Icon: {
    icon: "piktograma"
  },
  Text: {
    edit: "Redaguoti",
    copy: "Kopijuoti",
    copied: "Nukopijuota",
    expand: "Plačiau"
  },
  PageHeader: {
    back: "Atgal"
  }
};
var lv_LV = {
  locale: "lv",
  Pagination: {
    items_per_page: "/ lappuse",
    jump_to: "iet uz",
    jump_to_confirm: "apstiprināt",
    page: "",
    prev_page: "Iepriekšējā lapa",
    next_page: "Nākamā lapaspuse",
    prev_5: "Iepriekšējās 5 lapas",
    next_5: "Nākamās 5 lapas",
    prev_3: "Iepriekšējās 3 lapas",
    next_3: "Nākamās 3 lapas",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Izvēlieties datumu",
      rangePlaceholder: ["Sākuma datums", "Beigu datums"],
      locale: "lv_LV",
      today: "Šodien",
      now: "Tagad",
      backToToday: "Atpakaļ pie šodienas",
      ok: "Ok",
      clear: "Skaidrs",
      month: "Mēnesis",
      year: "Gads",
      timeSelect: "Izvēlieties laiku",
      dateSelect: "Izvēlieties datumu",
      monthSelect: "Izvēlieties mēnesi",
      yearSelect: "Izvēlieties gadu",
      decadeSelect: "Izvēlieties desmit gadus",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Iepriekšējais mēnesis (PageUp)",
      nextMonth: "Nākammēnes (PageDown)",
      previousYear: "Pagājušais gads (Control + left)",
      nextYear: "Nākamgad (Control + right)",
      previousDecade: "Pēdējā desmitgadē",
      nextDecade: "Nākamā desmitgade",
      previousCentury: "Pagājušajā gadsimtā",
      nextCentury: "Nākamajā gadsimtā"
    },
    timePickerLocale: {
      placeholder: "Izvēlieties laiku"
    }
  },
  TimePicker: {
    placeholder: "Izvēlieties laiku"
  },
  Calendar: {
    lang: {
      placeholder: "Izvēlieties datumu",
      rangePlaceholder: ["Sākuma datums", "Beigu datums"],
      locale: "lv_LV",
      today: "Šodien",
      now: "Tagad",
      backToToday: "Atpakaļ pie šodienas",
      ok: "Ok",
      clear: "Skaidrs",
      month: "Mēnesis",
      year: "Gads",
      timeSelect: "Izvēlieties laiku",
      dateSelect: "Izvēlieties datumu",
      monthSelect: "Izvēlieties mēnesi",
      yearSelect: "Izvēlieties gadu",
      decadeSelect: "Izvēlieties desmit gadus",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Iepriekšējais mēnesis (PageUp)",
      nextMonth: "Nākammēnes (PageDown)",
      previousYear: "Pagājušais gads (Control + left)",
      nextYear: "Nākamgad (Control + right)",
      previousDecade: "Pēdējā desmitgadē",
      nextDecade: "Nākamā desmitgade",
      previousCentury: "Pagājušajā gadsimtā",
      nextCentury: "Nākamajā gadsimtā"
    },
    timePickerLocale: {
      placeholder: "Izvēlieties laiku"
    }
  },
  Table: {
    filterTitle: "Filtrēšanas izvēlne",
    filterConfirm: "OK",
    filterReset: "Atiestatīt",
    selectAll: "Atlasiet pašreizējo lapu",
    selectInvert: "Pārvērst pašreizējo lapu"
  },
  Modal: {
    okText: "OK",
    cancelText: "Atcelt",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Atcelt"
  },
  Transfer: {
    searchPlaceholder: "Meklēt šeit",
    itemUnit: "vienumu",
    itemsUnit: "vienumus"
  },
  Upload: {
    uploading: "Augšupielāde...",
    removeFile: "Noņemt failu",
    uploadError: "Augšupielādes kļūda",
    previewFile: "Priekšskatiet failu",
    downloadFile: "Lejupielādēt failu"
  },
  Empty: {
    description: "Nav datu"
  }
};
var mk_MK = {
  locale: "mk",
  Pagination: {
    items_per_page: "/ стр",
    jump_to: "Оди на",
    jump_to_confirm: "потврди",
    page: "",
    prev_page: "Претходна страница",
    next_page: "Наредна страница",
    prev_5: "Претходни 5 страници",
    next_5: "Наредни 5 страници",
    prev_3: "Претходни 3 страници",
    next_3: "Наредни 3 страници",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Избери датум",
      rangePlaceholder: ["Од датум", "До датум"],
      locale: "mk_MK",
      today: "Денес",
      now: "Сега",
      backToToday: "Назад до денес",
      ok: "ОК",
      clear: "Избриши",
      month: "Месец",
      year: "Година",
      timeSelect: "Избери време",
      dateSelect: "Избери датум",
      monthSelect: "Избери месец",
      yearSelect: "Избери година",
      decadeSelect: "Избери деценија",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Претходен месец (PageUp)",
      nextMonth: "Нареден месец (PageDown)",
      previousYear: "Претходна година (Control + left)",
      nextYear: "Наредна година (Control + right)",
      previousDecade: "Претходна деценија",
      nextDecade: "Наредна деценија",
      previousCentury: "Претходен век",
      nextCentury: "Нареден век"
    },
    timePickerLocale: {
      placeholder: "Избери време"
    }
  },
  TimePicker: {
    placeholder: "Избери време"
  },
  Calendar: {
    lang: {
      placeholder: "Избери датум",
      rangePlaceholder: ["Од датум", "До датум"],
      locale: "mk_MK",
      today: "Денес",
      now: "Сега",
      backToToday: "Назад до денес",
      ok: "ОК",
      clear: "Избриши",
      month: "Месец",
      year: "Година",
      timeSelect: "Избери време",
      dateSelect: "Избери датум",
      monthSelect: "Избери месец",
      yearSelect: "Избери година",
      decadeSelect: "Избери деценија",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Претходен месец (PageUp)",
      nextMonth: "Нареден месец (PageDown)",
      previousYear: "Претходна година (Control + left)",
      nextYear: "Наредна година (Control + right)",
      previousDecade: "Претходна деценија",
      nextDecade: "Наредна деценија",
      previousCentury: "Претходен век",
      nextCentury: "Нареден век"
    },
    timePickerLocale: {
      placeholder: "Избери време"
    }
  },
  global: {
    placeholder: "Ве молиме означете"
  },
  Table: {
    filterTitle: "Мени за филтрирање",
    filterConfirm: "ОК",
    filterReset: "Избриши",
    selectAll: "Одбери страница",
    selectInvert: "Инвертирај страница"
  },
  Modal: {
    okText: "ОК",
    cancelText: "Откажи",
    justOkText: "ОК"
  },
  Popconfirm: {
    okText: "ОК",
    cancelText: "Откажи"
  },
  Transfer: {
    searchPlaceholder: "Пребарај тука",
    itemUnit: "предмет",
    itemsUnit: "предмети"
  },
  Upload: {
    uploading: "Се прикачува...",
    removeFile: "Избриши фајл",
    uploadError: "Грешка при прикачување",
    previewFile: "Прикажи фајл",
    downloadFile: "Преземи фајл"
  },
  Empty: {
    description: "Нема податоци"
  },
  Icon: {
    icon: "Икона"
  },
  Text: {
    edit: "Уреди",
    copy: "Копирај",
    copied: "Копирано",
    expand: "Зголеми"
  },
  PageHeader: {
    back: "Назад"
  }
};
var ml_IN = {
  locale: "ml",
  Pagination: {
    items_per_page: "/ പേജ്",
    jump_to: "അടുത്തത്",
    jump_to_confirm: "ഉറപ്പാക്കുക",
    page: "",
    prev_page: "മുൻപുള്ള പേജ്",
    next_page: "അടുത്ത പേജ്",
    prev_5: "മുൻപുള്ള 5 പേജുകൾ",
    next_5: "അടുത്ത 5 പേജുകൾ",
    prev_3: "മുൻപുള്ള 3 പേജുകൾ",
    next_3: "അടുത്ത 3 പേജുകൾ",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "തിയതി തിരഞ്ഞെടുക്കുക",
      yearPlaceholder: "വർഷം തിരഞ്ഞെടുക്കുക",
      quarterPlaceholder: "ത്രൈമാസം തിരഞ്ഞെടുക്കുക",
      monthPlaceholder: "മാസം തിരഞ്ഞെടുക്കുക",
      weekPlaceholder: "വാരം തിരഞ്ഞെടുക്കുക",
      rangePlaceholder: ["ആരംഭ ദിനം", "അവസാന ദിനം"],
      rangeYearPlaceholder: ["ആരംഭ വർഷം", "അവസാന വർഷം"],
      rangeMonthPlaceholder: ["ആരംഭ മാസം", "അവസാന മാസം"],
      rangeWeekPlaceholder: ["ആരംഭ വാരം", "അവസാന വാരം"],
      locale: "ml_IN",
      today: "ഇന്ന്",
      now: "ഇപ്പോൾ",
      backToToday: "ഇന്നത്തെ ദിവസത്തിലേക്ക് തിരിച്ചു പോകുക",
      ok: "ശരിയാണ്",
      clear: "നീക്കം ചെയ്യുക",
      month: "മാസം",
      year: "വർഷം",
      timeSelect: "സമയം തിരഞ്ഞെടുക്കുക",
      dateSelect: "ദിവസം തിരഞ്ഞെടുക്കുക",
      weekSelect: "വാരം തിരഞ്ഞെടുക്കുക",
      monthSelect: "മാസം തിരഞ്ഞെടുക്കുക",
      yearSelect: "വർഷം തിരഞ്ഞെടുക്കുക",
      decadeSelect: "ദശാബ്ദം തിരഞ്ഞെടുക്കുക",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "കഴിഞ്ഞ മാസം (PageUp)",
      nextMonth: "അടുത്ത മാസം (PageDown)",
      previousYear: "കഴിഞ്ഞ വർഷം (Control + left)",
      nextYear: "അടുത്ത വർഷം (Control + right)",
      previousDecade: "കഴിഞ്ഞ ദശാബ്ദം",
      nextDecade: "അടുത്ത ദശാബ്ദം",
      previousCentury: "കഴിഞ്ഞ നൂറ്റാണ്ട്",
      nextCentury: "അടുത്ത നൂറ്റാണ്ട്"
    },
    timePickerLocale: {
      placeholder: "സമയം തിരഞ്ഞെടുക്കുക",
      rangePlaceholder: ["ആരംഭ സമയം", "അവസാന സമയം"]
    }
  },
  TimePicker: {
    placeholder: "സമയം തിരഞ്ഞെടുക്കുക",
    rangePlaceholder: ["ആരംഭ സമയം", "അവസാന സമയം"]
  },
  Calendar: {
    lang: {
      placeholder: "തിയതി തിരഞ്ഞെടുക്കുക",
      yearPlaceholder: "വർഷം തിരഞ്ഞെടുക്കുക",
      quarterPlaceholder: "ത്രൈമാസം തിരഞ്ഞെടുക്കുക",
      monthPlaceholder: "മാസം തിരഞ്ഞെടുക്കുക",
      weekPlaceholder: "വാരം തിരഞ്ഞെടുക്കുക",
      rangePlaceholder: ["ആരംഭ ദിനം", "അവസാന ദിനം"],
      rangeYearPlaceholder: ["ആരംഭ വർഷം", "അവസാന വർഷം"],
      rangeMonthPlaceholder: ["ആരംഭ മാസം", "അവസാന മാസം"],
      rangeWeekPlaceholder: ["ആരംഭ വാരം", "അവസാന വാരം"],
      locale: "ml_IN",
      today: "ഇന്ന്",
      now: "ഇപ്പോൾ",
      backToToday: "ഇന്നത്തെ ദിവസത്തിലേക്ക് തിരിച്ചു പോകുക",
      ok: "ശരിയാണ്",
      clear: "നീക്കം ചെയ്യുക",
      month: "മാസം",
      year: "വർഷം",
      timeSelect: "സമയം തിരഞ്ഞെടുക്കുക",
      dateSelect: "ദിവസം തിരഞ്ഞെടുക്കുക",
      weekSelect: "വാരം തിരഞ്ഞെടുക്കുക",
      monthSelect: "മാസം തിരഞ്ഞെടുക്കുക",
      yearSelect: "വർഷം തിരഞ്ഞെടുക്കുക",
      decadeSelect: "ദശാബ്ദം തിരഞ്ഞെടുക്കുക",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "കഴിഞ്ഞ മാസം (PageUp)",
      nextMonth: "അടുത്ത മാസം (PageDown)",
      previousYear: "കഴിഞ്ഞ വർഷം (Control + left)",
      nextYear: "അടുത്ത വർഷം (Control + right)",
      previousDecade: "കഴിഞ്ഞ ദശാബ്ദം",
      nextDecade: "അടുത്ത ദശാബ്ദം",
      previousCentury: "കഴിഞ്ഞ നൂറ്റാണ്ട്",
      nextCentury: "അടുത്ത നൂറ്റാണ്ട്"
    },
    timePickerLocale: {
      placeholder: "സമയം തിരഞ്ഞെടുക്കുക",
      rangePlaceholder: ["ആരംഭ സമയം", "അവസാന സമയം"]
    }
  },
  global: {
    placeholder: "ദയവായി തിരഞ്ഞെടുക്കുക"
  },
  Table: {
    filterTitle: "ഫിൽറ്റർ",
    filterConfirm: "ശരിയാണ്",
    filterReset: "പുനഃക്രമീകരിക്കുക",
    filterEmptyText: "ഫിൽറ്ററുകളൊന്നുമില്ല",
    emptyText: "ഡാറ്റയൊന്നുമില്ല",
    selectAll: "നിലവിലെ പേജ് തിരഞ്ഞെടുക്കുക",
    selectInvert: "നിലവിലെ പേജിൽ ഇല്ലാത്തത് തിരഞ്ഞെടുക്കുക",
    selectNone: "എല്ലാ ഡാറ്റയും നീക്കം ചെയ്യുക",
    selectionAll: "എല്ലാ ഡാറ്റയും തിരഞ്ഞെടുക്കുക",
    sortTitle: "ക്രമമാക്കുക",
    expand: "വരി വികസിപ്പിക്കുക",
    collapse: "വരി ചുരുക്കുക",
    triggerDesc: "അവരോഹണ ക്രമത്തിനായി ക്ലിക്ക് ചെയ്യുക",
    triggerAsc: "ആരോഹണ ക്രമത്തിനായി ക്ലിക്ക് ചെയ്യുക",
    cancelSort: "ക്രമീകരണം ഒഴിവാക്കുന്നതിനായി ക്ലിക്ക് ചെയ്യുക"
  },
  Modal: {
    okText: "ശരിയാണ്",
    cancelText: "റദ്ദാക്കുക",
    justOkText: "ശരിയാണ്"
  },
  Popconfirm: {
    okText: "ശരിയാണ്",
    cancelText: "റദ്ദാക്കുക"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "ഇവിടെ തിരയുക",
    itemUnit: "ഇനം",
    itemsUnit: "ഇനങ്ങൾ",
    remove: "നീക്കം ചെയ്യുക",
    selectCurrent: "നിലവിലെ പേജ് തിരഞ്ഞെടുക്കുക",
    removeCurrent: "നിലവിലെ പേജ് നീക്കം ചെയ്യുക",
    selectAll: "എല്ലാ ഡാറ്റയും തിരഞ്ഞെടുക്കുക",
    removeAll: "എല്ലാ ഡാറ്റയും നീക്കം ചെയ്യുക",
    selectInvert: "നിലവിലെ പേജിൽ ഇല്ലാത്തത് തിരഞ്ഞെടുക്കുക"
  },
  Upload: {
    uploading: "അപ്‌ലോഡ് ചെയ്തു കൊണ്ടിരിക്കുന്നു...",
    removeFile: "ഫയൽ നീക്കം ചെയ്യുക",
    uploadError: "അപ്‌ലോഡിൽ പിശക് സംഭവിച്ചിരിക്കുന്നു",
    previewFile: "ഫയൽ പ്രിവ്യൂ ചെയ്യുക",
    downloadFile: "ഫയൽ ഡൗൺലോഡ് ചെയ്യുക"
  },
  Empty: {
    description: "ഡാറ്റയൊന്നുമില്ല"
  },
  Icon: {
    icon: "ഐക്കൺ"
  },
  Text: {
    edit: "തിരുത്തുക",
    copy: "കോപ്പി ചെയ്യുക",
    copied: "കോപ്പി ചെയ്തു",
    expand: "വികസിപ്പിക്കുക"
  },
  PageHeader: {
    back: "തിരികെ"
  },
  Image: {
    preview: "പ്രിവ്യൂ"
  }
};
var mn_MN = {
  locale: "mn-mn",
  Pagination: {
    items_per_page: "/ хуудас",
    jump_to: "Шилжих",
    jump_to_confirm: "сонгох",
    page: "",
    prev_page: "Өмнөх хуудас",
    next_page: "Дараагийн хуудас",
    prev_5: "Дараагийн 5 хуудас",
    next_5: "Дараагийн 5 хуудас",
    prev_3: "Дараагийн 3 хуудас",
    next_3: "Дараагийн 3 хуудас",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Огноо сонгох",
      rangePlaceholder: ["Эхлэх огноо", "Дуусах огноо"],
      locale: "mn_MN",
      today: "Өнөөдөр",
      now: "Одоо",
      backToToday: "Өнөөдөрлүү буцах",
      ok: "Ok",
      clear: "Цэвэрлэх",
      month: "Сар",
      year: "Жил",
      timeSelect: "Цаг сонгох",
      dateSelect: "Огноо сонгох",
      weekSelect: "7 хоног сонгох",
      monthSelect: "Сар сонгох",
      yearSelect: "Жил сонгох",
      decadeSelect: "Арван сонгох",
      yearFormat: "YYYY",
      dateFormat: "YYYY/MM/DD",
      dayFormat: "DD",
      dateTimeFormat: "YYYY/MM/DD HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Өмнөх сар (PageUp)",
      nextMonth: "Дараа сар (PageDown)",
      previousYear: "Өмнөх жил (Control + left)",
      nextYear: "Дараа жил (Control + right)",
      previousDecade: "Өмнөх арван",
      nextDecade: "Дараа арван",
      previousCentury: "Өмнөх зуун",
      nextCentury: "Дараа зуун"
    },
    timePickerLocale: {
      placeholder: "Цаг сонгох"
    }
  },
  TimePicker: {
    placeholder: "Цаг сонгох"
  },
  Calendar: {
    lang: {
      placeholder: "Огноо сонгох",
      rangePlaceholder: ["Эхлэх огноо", "Дуусах огноо"],
      locale: "mn_MN",
      today: "Өнөөдөр",
      now: "Одоо",
      backToToday: "Өнөөдөрлүү буцах",
      ok: "Ok",
      clear: "Цэвэрлэх",
      month: "Сар",
      year: "Жил",
      timeSelect: "Цаг сонгох",
      dateSelect: "Огноо сонгох",
      weekSelect: "7 хоног сонгох",
      monthSelect: "Сар сонгох",
      yearSelect: "Жил сонгох",
      decadeSelect: "Арван сонгох",
      yearFormat: "YYYY",
      dateFormat: "YYYY/MM/DD",
      dayFormat: "DD",
      dateTimeFormat: "YYYY/MM/DD HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Өмнөх сар (PageUp)",
      nextMonth: "Дараа сар (PageDown)",
      previousYear: "Өмнөх жил (Control + left)",
      nextYear: "Дараа жил (Control + right)",
      previousDecade: "Өмнөх арван",
      nextDecade: "Дараа арван",
      previousCentury: "Өмнөх зуун",
      nextCentury: "Дараа зуун"
    },
    timePickerLocale: {
      placeholder: "Цаг сонгох"
    }
  },
  Table: {
    filterTitle: "Хайх цэс",
    filterConfirm: "OK",
    filterReset: "Цэвэрлэх",
    selectAll: "Бүгдийг сонгох",
    selectInvert: "Бусдыг сонгох"
  },
  Modal: {
    okText: "OK",
    cancelText: "Цуцлах",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Цуцлах"
  },
  Transfer: {
    searchPlaceholder: "Хайх",
    itemUnit: "Зүйл",
    itemsUnit: "Зүйлүүд"
  },
  Upload: {
    uploading: "Хуулж байна...",
    removeFile: "Файл устгах",
    uploadError: "Хуулахад алдаа гарлаа",
    previewFile: "Файлыг түргэн үзэх",
    downloadFile: "Файлыг татах"
  },
  Empty: {
    description: "Мэдээлэл байхгүй байна"
  }
};
var ms_MY = {
  locale: "ms-my",
  Pagination: {
    items_per_page: "/ halaman",
    jump_to: "Lompat ke",
    jump_to_confirm: "Sahkan",
    page: "",
    prev_page: "Halaman sebelumnya",
    next_page: "Halam seterusnya",
    prev_5: "5 halaman sebelum",
    next_5: "5 halaman seterusnya",
    prev_3: "3 halaman sebelumnya",
    next_3: "3 halaman seterusnya",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Pilih tarikh",
      rangePlaceholder: ["Tarikh mula", "Tarikh akhir"],
      locale: "ms_MY",
      today: "Hari ini",
      now: "Sekarang",
      backToToday: "Kembali ke hari ini",
      ok: "Ok",
      timeSelect: "Pilih masa",
      dateSelect: "Pilih tarikh",
      weekSelect: "Pilih minggu",
      clear: "Padam",
      month: "Bulan",
      year: "Tahun",
      previousMonth: "Bulan lepas",
      nextMonth: "Bulan depan",
      monthSelect: "Pilih bulan",
      yearSelect: "Pilih tahun",
      decadeSelect: "Pilih dekad",
      yearFormat: "YYYY",
      dayFormat: "D",
      dateFormat: "M/D/YYYY",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      previousYear: "Tahun lepas (Ctrl+left)",
      nextYear: "Tahun depan (Ctrl+right)",
      previousDecade: "Dekad lepas",
      nextDecade: "Dekad depan",
      previousCentury: "Abad lepas",
      nextCentury: "Abad depan"
    },
    timePickerLocale: {
      placeholder: "Sila pilih masa"
    }
  },
  TimePicker: {
    placeholder: "Sila pilih masa"
  },
  Calendar: {
    lang: {
      placeholder: "Pilih tarikh",
      rangePlaceholder: ["Tarikh mula", "Tarikh akhir"],
      locale: "ms_MY",
      today: "Hari ini",
      now: "Sekarang",
      backToToday: "Kembali ke hari ini",
      ok: "Ok",
      timeSelect: "Pilih masa",
      dateSelect: "Pilih tarikh",
      weekSelect: "Pilih minggu",
      clear: "Padam",
      month: "Bulan",
      year: "Tahun",
      previousMonth: "Bulan lepas",
      nextMonth: "Bulan depan",
      monthSelect: "Pilih bulan",
      yearSelect: "Pilih tahun",
      decadeSelect: "Pilih dekad",
      yearFormat: "YYYY",
      dayFormat: "D",
      dateFormat: "M/D/YYYY",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      previousYear: "Tahun lepas (Ctrl+left)",
      nextYear: "Tahun depan (Ctrl+right)",
      previousDecade: "Dekad lepas",
      nextDecade: "Dekad depan",
      previousCentury: "Abad lepas",
      nextCentury: "Abad depan"
    },
    timePickerLocale: {
      placeholder: "Sila pilih masa"
    }
  },
  global: {
    placeholder: "Sila pilih"
  },
  PageHeader: {
    back: "Kembali"
  },
  Text: {
    edit: "Sunting",
    copy: "Salin",
    copied: "Berjaya menyalin",
    expand: "Kembang"
  },
  Empty: {
    description: "Tiada data"
  },
  Table: {
    filterTitle: "Cari dengan tajuk",
    filterConfirm: "OK",
    filterReset: "Menetapkan semula",
    emptyText: "Tiada data",
    selectAll: "Pilih semua",
    selectInvert: "Terbalikkan"
  },
  Modal: {
    okText: "OK",
    cancelText: "Batal",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Batal"
  },
  Transfer: {
    notFoundContent: "Tidak dijumpai",
    searchPlaceholder: "Carian di sini",
    itemUnit: "item",
    itemsUnit: "item"
  },
  Icon: {
    icon: "ikon"
  },
  Select: {
    notFoundContent: "Tidak Dijumpai"
  },
  Upload: {
    uploading: "Sedang memuat naik...",
    removeFile: "Buang fail",
    uploadError: "Masalah muat naik",
    previewFile: "Tengok fail",
    downloadFile: "Muat turun fail"
  }
};
var nb_NO = {
  locale: "nb",
  Pagination: {
    items_per_page: "/ side",
    jump_to: "Gå til side",
    page: "Side",
    prev_page: "Forrige side",
    next_page: "Neste side",
    prev_5: "5 forrige",
    next_5: "5 neste",
    prev_3: "3 forrige",
    next_3: "3 neste",
    page_size: "sidestørrelse"
  },
  DatePicker: {
    lang: {
      placeholder: "Velg dato",
      yearPlaceholder: "Velg år",
      quarterPlaceholder: "Velg kvartal",
      monthPlaceholder: "Velg måned",
      weekPlaceholder: "Velg uke",
      rangePlaceholder: ["Startdato", "Sluttdato"],
      rangeYearPlaceholder: ["Startår", "Sluttår"],
      rangeMonthPlaceholder: ["Startmåned", "Sluttmåned"],
      rangeWeekPlaceholder: ["Start uke", "Sluttuke"],
      locale: "nb_NO",
      today: "I dag",
      now: "Nå",
      backToToday: "Gå til i dag",
      ok: "Ok",
      clear: "Annuller",
      month: "Måned",
      year: "År",
      timeSelect: "Velg tidspunkt",
      dateSelect: "Velg dato",
      weekSelect: "Velg uke",
      monthSelect: "Velg måned",
      yearSelect: "Velg år",
      decadeSelect: "Velg tiår",
      yearFormat: "YYYY",
      dateFormat: "DD.MM.YYYY",
      dayFormat: "DD",
      dateTimeFormat: "DD.MM.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Forrige måned (PageUp)",
      nextMonth: "Neste måned (PageDown)",
      previousYear: "Forrige år (Control + venstre)",
      nextYear: "Neste år (Control + høyre)",
      previousDecade: "Forrige tiår",
      nextDecade: "Neste tiår",
      previousCentury: "Forrige århundre",
      nextCentury: "Neste århundre"
    },
    timePickerLocale: {
      placeholder: "Velg tid",
      rangePlaceholder: ["Starttid", "Sluttid"]
    }
  },
  TimePicker: {
    placeholder: "Velg tid",
    rangePlaceholder: ["Starttid", "Sluttid"]
  },
  Calendar: {
    lang: {
      placeholder: "Velg dato",
      yearPlaceholder: "Velg år",
      quarterPlaceholder: "Velg kvartal",
      monthPlaceholder: "Velg måned",
      weekPlaceholder: "Velg uke",
      rangePlaceholder: ["Startdato", "Sluttdato"],
      rangeYearPlaceholder: ["Startår", "Sluttår"],
      rangeMonthPlaceholder: ["Startmåned", "Sluttmåned"],
      rangeWeekPlaceholder: ["Start uke", "Sluttuke"],
      locale: "nb_NO",
      today: "I dag",
      now: "Nå",
      backToToday: "Gå til i dag",
      ok: "Ok",
      clear: "Annuller",
      month: "Måned",
      year: "År",
      timeSelect: "Velg tidspunkt",
      dateSelect: "Velg dato",
      weekSelect: "Velg uke",
      monthSelect: "Velg måned",
      yearSelect: "Velg år",
      decadeSelect: "Velg tiår",
      yearFormat: "YYYY",
      dateFormat: "DD.MM.YYYY",
      dayFormat: "DD",
      dateTimeFormat: "DD.MM.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Forrige måned (PageUp)",
      nextMonth: "Neste måned (PageDown)",
      previousYear: "Forrige år (Control + venstre)",
      nextYear: "Neste år (Control + høyre)",
      previousDecade: "Forrige tiår",
      nextDecade: "Neste tiår",
      previousCentury: "Forrige århundre",
      nextCentury: "Neste århundre"
    },
    timePickerLocale: {
      placeholder: "Velg tid",
      rangePlaceholder: ["Starttid", "Sluttid"]
    }
  },
  global: {
    placeholder: "Vennligst velg"
  },
  Table: {
    filterTitle: "Filtermeny",
    filterConfirm: "OK",
    filterReset: "Nullstill",
    filterEmptyText: "Ingen filtre",
    selectAll: "Velg alle",
    selectInvert: "Inverter gjeldende side",
    selectionAll: "Velg all data",
    sortTitle: "Sorter",
    expand: "Utvid rad",
    collapse: "Skjul rad",
    triggerDesc: "Sorter data i synkende rekkefølge",
    triggerAsc: "Sorterer data i stigende rekkefølge",
    cancelSort: "Klikk for å avbryte sorteringen"
  },
  Modal: {
    okText: "OK",
    cancelText: "Avbryt",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Avbryt"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Søk her",
    itemUnit: "element",
    itemsUnit: "elementer",
    remove: "Fjern",
    selectCurrent: "Velg gjeldende side",
    removeCurrent: "Fjern gjeldende side",
    selectAll: "Velg all data",
    removeAll: "Fjern all data",
    selectInvert: "Inverter gjeldende side"
  },
  Upload: {
    uploading: "Laster opp...",
    removeFile: "Fjern fil",
    uploadError: "Feil ved opplastning",
    previewFile: "Forhåndsvisning",
    downloadFile: "Last ned fil"
  },
  Empty: {
    description: "Ingen data"
  },
  Icon: {
    icon: "ikon"
  },
  Text: {
    edit: "Rediger",
    copy: "Kopier",
    copied: "Kopiert",
    expand: "Utvid"
  },
  PageHeader: {
    back: "Tilbake"
  }
};
var ne_NP = {
  locale: "ne-np",
  Pagination: {
    items_per_page: "/ page",
    jump_to: "Go to",
    jump_to_confirm: "confirm",
    page: "Page",
    prev_page: "Previous Page",
    next_page: "Next Page",
    prev_5: "Previous 5 Pages",
    next_5: "Next 5 Pages",
    prev_3: "Previous 3 Pages",
    next_3: "Next 3 Pages",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Select date",
      yearPlaceholder: "Select year",
      quarterPlaceholder: "Select quarter",
      monthPlaceholder: "Select month",
      weekPlaceholder: "Select week",
      rangePlaceholder: ["Start date", "End date"],
      rangeYearPlaceholder: ["Start year", "End year"],
      rangeMonthPlaceholder: ["Start month", "End month"],
      rangeWeekPlaceholder: ["Start week", "End week"],
      locale: "en_US",
      today: "Today",
      now: "Now",
      backToToday: "Back to today",
      ok: "Ok",
      clear: "Clear",
      month: "Month",
      year: "Year",
      timeSelect: "select time",
      dateSelect: "select date",
      weekSelect: "Choose a week",
      monthSelect: "Choose a month",
      yearSelect: "Choose a year",
      decadeSelect: "Choose a decade",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Previous month (PageUp)",
      nextMonth: "Next month (PageDown)",
      previousYear: "Last year (Control + left)",
      nextYear: "Next year (Control + right)",
      previousDecade: "Last decade",
      nextDecade: "Next decade",
      previousCentury: "Last century",
      nextCentury: "Next century"
    },
    timePickerLocale: {
      placeholder: "Select time",
      rangePlaceholder: ["Start time", "End time"]
    }
  },
  TimePicker: {
    placeholder: "Select time",
    rangePlaceholder: ["Start time", "End time"]
  },
  Calendar: {
    lang: {
      placeholder: "Select date",
      yearPlaceholder: "Select year",
      quarterPlaceholder: "Select quarter",
      monthPlaceholder: "Select month",
      weekPlaceholder: "Select week",
      rangePlaceholder: ["Start date", "End date"],
      rangeYearPlaceholder: ["Start year", "End year"],
      rangeMonthPlaceholder: ["Start month", "End month"],
      rangeWeekPlaceholder: ["Start week", "End week"],
      locale: "en_US",
      today: "Today",
      now: "Now",
      backToToday: "Back to today",
      ok: "Ok",
      clear: "Clear",
      month: "Month",
      year: "Year",
      timeSelect: "select time",
      dateSelect: "select date",
      weekSelect: "Choose a week",
      monthSelect: "Choose a month",
      yearSelect: "Choose a year",
      decadeSelect: "Choose a decade",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Previous month (PageUp)",
      nextMonth: "Next month (PageDown)",
      previousYear: "Last year (Control + left)",
      nextYear: "Next year (Control + right)",
      previousDecade: "Last decade",
      nextDecade: "Next decade",
      previousCentury: "Last century",
      nextCentury: "Next century"
    },
    timePickerLocale: {
      placeholder: "Select time",
      rangePlaceholder: ["Start time", "End time"]
    }
  },
  Table: {
    filterTitle: "फिल्टर मेनु",
    filterConfirm: "हो",
    filterReset: "रीसेट",
    selectAll: "सबै छान्नुुहोस्",
    selectInvert: "छनौट उल्टाउनुहोस"
  },
  Modal: {
    okText: "हो",
    cancelText: "होईन",
    justOkText: "हो"
  },
  Popconfirm: {
    okText: "हो",
    cancelText: "होईन"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "यहाँ खोज्नुहोस्",
    itemUnit: "वस्तु",
    itemsUnit: "वस्तुहरू"
  },
  Upload: {
    uploading: "अपलोड गर्दै...",
    removeFile: "फाइल हटाउनुहोस्",
    uploadError: "अप्लोडमा समस्या भयो",
    previewFile: "फाइल पूर्वावलोकन गर्नुहोस्",
    downloadFile: "डाउनलोड फाइल"
  },
  Empty: {
    description: "डाटा छैन"
  }
};
var nl_BE = {
  locale: "nl-be",
  Pagination: {
    items_per_page: "/ pagina",
    jump_to: "Ga naar",
    jump_to_confirm: "bevestigen",
    page: "",
    prev_page: "Vorige pagina",
    next_page: "Volgende pagina",
    prev_5: "Vorige 5 pagina's",
    next_5: "Volgende 5 pagina's",
    prev_3: "Vorige 3 pagina's",
    next_3: "Volgende 3 pagina's",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Selecteer datum",
      rangePlaceholder: ["Begin datum", "Eind datum"],
      locale: "nl_BE",
      today: "Vandaag",
      now: "Nu",
      backToToday: "Terug naar vandaag",
      ok: "Ok",
      clear: "Reset",
      month: "Maand",
      year: "Jaar",
      timeSelect: "Selecteer tijd",
      dateSelect: "Selecteer datum",
      monthSelect: "Kies een maand",
      yearSelect: "Kies een jaar",
      decadeSelect: "Kies een decennium",
      yearFormat: "YYYY",
      dateFormat: "D-M-YYYY",
      dayFormat: "D",
      dateTimeFormat: "D-M-YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Vorige maand (PageUp)",
      nextMonth: "Volgende maand (PageDown)",
      previousYear: "Vorig jaar (Control + left)",
      nextYear: "Volgend jaar (Control + right)",
      previousDecade: "Vorig decennium",
      nextDecade: "Volgend decennium",
      previousCentury: "Vorige eeuw",
      nextCentury: "Volgende eeuw",
      monthPlaceholder: "Selecteer maand",
      quarterPlaceholder: "Selecteer kwartaal",
      rangeMonthPlaceholder: ["Begin maand", "Eind maand"],
      rangeWeekPlaceholder: ["Begin week", "Eind week"],
      rangeYearPlaceholder: ["Begin jaar", "Eind jaar"],
      weekPlaceholder: "Selecteer week",
      yearPlaceholder: "Selecteer jaar"
    },
    timePickerLocale: {
      placeholder: "Selecteer tijd",
      rangePlaceholder: ["Start tijd", "Eind tijd"]
    }
  },
  TimePicker: {
    placeholder: "Selecteer tijd",
    rangePlaceholder: ["Start tijd", "Eind tijd"]
  },
  Calendar: {
    lang: {
      placeholder: "Selecteer datum",
      rangePlaceholder: ["Begin datum", "Eind datum"],
      locale: "nl_BE",
      today: "Vandaag",
      now: "Nu",
      backToToday: "Terug naar vandaag",
      ok: "Ok",
      clear: "Reset",
      month: "Maand",
      year: "Jaar",
      timeSelect: "Selecteer tijd",
      dateSelect: "Selecteer datum",
      monthSelect: "Kies een maand",
      yearSelect: "Kies een jaar",
      decadeSelect: "Kies een decennium",
      yearFormat: "YYYY",
      dateFormat: "D-M-YYYY",
      dayFormat: "D",
      dateTimeFormat: "D-M-YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Vorige maand (PageUp)",
      nextMonth: "Volgende maand (PageDown)",
      previousYear: "Vorig jaar (Control + left)",
      nextYear: "Volgend jaar (Control + right)",
      previousDecade: "Vorig decennium",
      nextDecade: "Volgend decennium",
      previousCentury: "Vorige eeuw",
      nextCentury: "Volgende eeuw",
      monthPlaceholder: "Selecteer maand",
      quarterPlaceholder: "Selecteer kwartaal",
      rangeMonthPlaceholder: ["Begin maand", "Eind maand"],
      rangeWeekPlaceholder: ["Begin week", "Eind week"],
      rangeYearPlaceholder: ["Begin jaar", "Eind jaar"],
      weekPlaceholder: "Selecteer week",
      yearPlaceholder: "Selecteer jaar"
    },
    timePickerLocale: {
      placeholder: "Selecteer tijd",
      rangePlaceholder: ["Start tijd", "Eind tijd"]
    }
  },
  Table: {
    filterTitle: "Filteren",
    filterConfirm: "OK",
    filterReset: "Reset",
    selectAll: "Selecteer huidige pagina",
    selectInvert: "Keer volgorde om",
    cancelSort: "Klik om sortering te annuleren",
    collapse: "Rij inklappen",
    emptyText: "Geen data",
    expand: "Rij uitklappen",
    filterEmptyText: "Geen filters",
    selectNone: "Maak selectie leeg",
    selectionAll: "Selecteer alle data",
    sortTitle: "Sorteren",
    triggerAsc: "Klik om oplopend te sorteren",
    triggerDesc: "Klik om aflopend te sorteren"
  },
  Modal: {
    okText: "OK",
    cancelText: "Annuleer",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Annuleer"
  },
  Transfer: {
    searchPlaceholder: "Zoek hier",
    itemUnit: "item",
    itemsUnit: "items",
    remove: "Verwijder",
    removeAll: "Verwijder alles",
    removeCurrent: "Verwijder huidige pagina",
    selectAll: "Selecteer alles",
    selectCurrent: "Selecteer huidige pagina",
    selectInvert: "Huidige pagina omkeren",
    titles: ["", ""]
  },
  Upload: {
    uploading: "Uploaden...",
    removeFile: "Verwijder bestand",
    uploadError: "Fout tijdens uploaden",
    previewFile: "Preview file",
    downloadFile: "Bestand downloaden"
  },
  Empty: {
    description: "Geen gegevens"
  },
  global: {
    placeholder: "Maak een selectie"
  },
  Icon: {
    icon: "icoon"
  },
  Text: {
    edit: "Bewerken",
    copy: "kopiëren",
    copied: "Gekopieerd",
    expand: "Uitklappen"
  },
  PageHeader: {
    back: "Terug"
  },
  Image: {
    preview: "Voorbeeld"
  }
};
var nl_NL = {
  locale: "nl",
  Pagination: {
    items_per_page: "/ pagina",
    jump_to: "Ga naar",
    jump_to_confirm: "bevestigen",
    page: "Pagina",
    prev_page: "Vorige pagina",
    next_page: "Volgende pagina",
    prev_5: "Vorige 5 pagina's",
    next_5: "Volgende 5 pagina's",
    prev_3: "Vorige 3 pagina's",
    next_3: "Volgende 3 pagina's",
    page_size: "pagina grootte"
  },
  DatePicker: {
    lang: {
      placeholder: "Selecteer datum",
      rangePlaceholder: ["Begin datum", "Eind datum"],
      locale: "nl_NL",
      today: "Vandaag",
      now: "Nu",
      backToToday: "Terug naar vandaag",
      ok: "Ok",
      clear: "Reset",
      month: "Maand",
      year: "Jaar",
      timeSelect: "Selecteer tijd",
      dateSelect: "Selecteer datum",
      monthSelect: "Kies een maand",
      yearSelect: "Kies een jaar",
      decadeSelect: "Kies een decennium",
      yearFormat: "YYYY",
      dateFormat: "D-M-YYYY",
      dayFormat: "D",
      dateTimeFormat: "D-M-YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Vorige maand (PageUp)",
      nextMonth: "Volgende maand (PageDown)",
      previousYear: "Vorig jaar (Control + left)",
      nextYear: "Volgend jaar (Control + right)",
      previousDecade: "Vorig decennium",
      nextDecade: "Volgend decennium",
      previousCentury: "Vorige eeuw",
      nextCentury: "Volgende eeuw",
      monthPlaceholder: "Selecteer maand",
      quarterPlaceholder: "Selecteer kwartaal",
      rangeMonthPlaceholder: ["Begin maand", "Eind maand"],
      rangeWeekPlaceholder: ["Begin week", "Eind week"],
      rangeYearPlaceholder: ["Begin jaar", "Eind jaar"],
      weekPlaceholder: "Selecteer week",
      yearPlaceholder: "Selecteer jaar"
    },
    timePickerLocale: {
      placeholder: "Selecteer tijd",
      rangePlaceholder: ["Start tijd", "Eind tijd"]
    }
  },
  TimePicker: {
    placeholder: "Selecteer tijd",
    rangePlaceholder: ["Start tijd", "Eind tijd"]
  },
  Calendar: {
    lang: {
      placeholder: "Selecteer datum",
      rangePlaceholder: ["Begin datum", "Eind datum"],
      locale: "nl_NL",
      today: "Vandaag",
      now: "Nu",
      backToToday: "Terug naar vandaag",
      ok: "Ok",
      clear: "Reset",
      month: "Maand",
      year: "Jaar",
      timeSelect: "Selecteer tijd",
      dateSelect: "Selecteer datum",
      monthSelect: "Kies een maand",
      yearSelect: "Kies een jaar",
      decadeSelect: "Kies een decennium",
      yearFormat: "YYYY",
      dateFormat: "D-M-YYYY",
      dayFormat: "D",
      dateTimeFormat: "D-M-YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Vorige maand (PageUp)",
      nextMonth: "Volgende maand (PageDown)",
      previousYear: "Vorig jaar (Control + left)",
      nextYear: "Volgend jaar (Control + right)",
      previousDecade: "Vorig decennium",
      nextDecade: "Volgend decennium",
      previousCentury: "Vorige eeuw",
      nextCentury: "Volgende eeuw",
      monthPlaceholder: "Selecteer maand",
      quarterPlaceholder: "Selecteer kwartaal",
      rangeMonthPlaceholder: ["Begin maand", "Eind maand"],
      rangeWeekPlaceholder: ["Begin week", "Eind week"],
      rangeYearPlaceholder: ["Begin jaar", "Eind jaar"],
      weekPlaceholder: "Selecteer week",
      yearPlaceholder: "Selecteer jaar"
    },
    timePickerLocale: {
      placeholder: "Selecteer tijd",
      rangePlaceholder: ["Start tijd", "Eind tijd"]
    }
  },
  global: {
    placeholder: "Maak een selectie"
  },
  Table: {
    filterTitle: "Filteren",
    filterConfirm: "OK",
    filterReset: "Reset",
    selectAll: "Selecteer huidige pagina",
    selectInvert: "Keer volgorde om",
    sortTitle: "Sorteren",
    expand: "Rij uitklappen",
    collapse: "Rij inklappen",
    cancelSort: "Klik om sortering te annuleren",
    emptyText: "Geen data",
    filterEmptyText: "Geen filters",
    selectNone: "Maak selectie leeg",
    selectionAll: "Selecteer alle data",
    triggerAsc: "Klik om oplopend te sorteren",
    triggerDesc: "Klik om aflopend te sorteren"
  },
  Modal: {
    okText: "OK",
    cancelText: "Annuleer",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Annuleer"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Zoek hier",
    itemUnit: "item",
    itemsUnit: "items",
    remove: "Verwijder",
    removeAll: "Verwijder alles",
    removeCurrent: "Verwijder huidige pagina",
    selectAll: "Selecteer alles",
    selectCurrent: "Selecteer huidige pagina",
    selectInvert: "Huidige pagina omkeren"
  },
  Upload: {
    uploading: "Uploaden...",
    removeFile: "Verwijder bestand",
    uploadError: "Fout tijdens uploaden",
    previewFile: "Preview file",
    downloadFile: "Bestand downloaden"
  },
  Empty: {
    description: "Geen gegevens"
  },
  Icon: {
    icon: "icoon"
  },
  Text: {
    edit: "Bewerken",
    copy: "kopiëren",
    copied: "Gekopieerd",
    expand: "Uitklappen"
  },
  PageHeader: {
    back: "Terug"
  },
  Image: {
    preview: "Voorbeeld"
  }
};
var pl_PL = {
  locale: "pl",
  Pagination: {
    items_per_page: "na stronę",
    jump_to: "Idź do",
    jump_to_confirm: "potwierdź",
    page: "",
    prev_page: "Poprzednia strona",
    next_page: "Następna strona",
    prev_5: "Poprzednie 5 stron",
    next_5: "Następne 5 stron",
    prev_3: "Poprzednie 3 strony",
    next_3: "Następne 3 strony",
    page_size: "rozmiar strony"
  },
  DatePicker: {
    lang: {
      placeholder: "Wybierz datę",
      yearPlaceholder: "Wybierz rok",
      monthPlaceholder: "Wybierz miesiąc",
      weekPlaceholder: "Wybierz tydzień",
      rangePlaceholder: ["Data początkowa", "Data końcowa"],
      rangeYearPlaceholder: ["Początkowy rok", "Końcowy rok"],
      rangeMonthPlaceholder: ["Początkowy miesiąc", "Końcowy miesiąc"],
      rangeWeekPlaceholder: ["Początkowy tydzień", "Końcowy tydzień"],
      locale: "pl_PL",
      today: "Dzisiaj",
      now: "Teraz",
      backToToday: "Ustaw dzisiaj",
      ok: "Ok",
      clear: "Wyczyść",
      month: "Miesiąc",
      year: "Rok",
      timeSelect: "Ustaw czas",
      dateSelect: "Ustaw datę",
      monthSelect: "Wybierz miesiąc",
      yearSelect: "Wybierz rok",
      decadeSelect: "Wybierz dekadę",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Poprzedni miesiąc (PageUp)",
      nextMonth: "Następny miesiąc (PageDown)",
      previousYear: "Ostatni rok (Ctrl + left)",
      nextYear: "Następny rok (Ctrl + right)",
      previousDecade: "Ostatnia dekada",
      nextDecade: "Następna dekada",
      previousCentury: "Ostatni wiek",
      nextCentury: "Następny wiek"
    },
    timePickerLocale: {
      placeholder: "Wybierz godzinę"
    }
  },
  TimePicker: {
    placeholder: "Wybierz godzinę"
  },
  Calendar: {
    lang: {
      placeholder: "Wybierz datę",
      rangePlaceholder: ["Data początkowa", "Data końcowa"],
      locale: "pl_PL",
      today: "Dzisiaj",
      now: "Teraz",
      backToToday: "Ustaw dzisiaj",
      ok: "Ok",
      clear: "Wyczyść",
      month: "Miesiąc",
      year: "Rok",
      timeSelect: "Ustaw czas",
      dateSelect: "Ustaw datę",
      monthSelect: "Wybierz miesiąc",
      yearSelect: "Wybierz rok",
      decadeSelect: "Wybierz dekadę",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Poprzedni miesiąc (PageUp)",
      nextMonth: "Następny miesiąc (PageDown)",
      previousYear: "Ostatni rok (Ctrl + left)",
      nextYear: "Następny rok (Ctrl + right)",
      previousDecade: "Ostatnia dekada",
      nextDecade: "Następna dekada",
      previousCentury: "Ostatni wiek",
      nextCentury: "Następny wiek"
    },
    timePickerLocale: {
      placeholder: "Wybierz godzinę"
    }
  },
  Table: {
    filterTitle: "Menu filtra",
    filterConfirm: "OK",
    filterReset: "Usuń filtry",
    selectAll: "Zaznacz bieżącą stronę",
    selectInvert: "Odwróć zaznaczenie",
    triggerDesc: "Sortuj malejąco",
    triggerAsc: "Sortuj rosnąco",
    cancelSort: "Usuń sortowanie",
    filterEmptyText: "Brak filtrów",
    filterCheckall: "Wybierz wszystkie elementy",
    filterSearchPlaceholder: "Szukaj w filtrach",
    emptyText: "Brak danych",
    selectNone: "Wyczyść",
    selectionAll: "Wybierz wszystkie",
    sortTitle: "Sortowanie",
    expand: "Rozwiń wiersz",
    collapse: "Zwiń wiersz"
  },
  Modal: {
    okText: "OK",
    cancelText: "Anuluj",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Anuluj"
  },
  Transfer: {
    searchPlaceholder: "Szukaj",
    itemUnit: "obiekt",
    itemsUnit: "obiekty",
    titles: ["", ""],
    remove: "Usuń",
    selectCurrent: "Wybierz aktualną stronę",
    removeCurrent: "Usuń aktualną stronę",
    selectAll: "Wybierz wszystkie",
    removeAll: "Usuń wszystkie",
    selectInvert: "Odwróć wybór"
  },
  Upload: {
    uploading: "Wysyłanie...",
    removeFile: "Usuń plik",
    uploadError: "Błąd wysyłania",
    previewFile: "Podejrzyj plik",
    downloadFile: "Pobieranie pliku"
  },
  Empty: {
    description: "Brak danych"
  },
  global: {
    placeholder: "Wybierz"
  },
  Icon: {
    icon: "Ikona"
  },
  Text: {
    edit: "Edytuj",
    copy: "Kopiuj",
    copied: "Skopiowany",
    expand: "Rozwiń"
  },
  PageHeader: {
    back: "Wstecz"
  },
  Image: {
    preview: "Podgląd"
  }
};
var pt_BR = {
  locale: "pt-br",
  Pagination: {
    items_per_page: "/ página",
    jump_to: "Vá até",
    jump_to_confirm: "confirme",
    page: "Página",
    prev_page: "Página anterior",
    next_page: "Próxima página",
    prev_5: "5 páginas anteriores",
    next_5: "5 próximas páginas",
    prev_3: "3 páginas anteriores",
    next_3: "3 próximas páginas",
    page_size: "tamanho da página"
  },
  DatePicker: {
    lang: {
      placeholder: "Selecionar data",
      yearPlaceholder: "Selecionar ano",
      quarterPlaceholder: "Selecionar trimestre",
      monthPlaceholder: "Selecionar mês",
      weekPlaceholder: "Selecionar semana",
      rangePlaceholder: ["Data inicial", "Data final"],
      rangeYearPlaceholder: ["Ano inicial", "Ano Final"],
      rangeMonthPlaceholder: ["Mês inicial", "Mês final"],
      rangeWeekPlaceholder: ["Semana inicial", "Semana final"],
      locale: "pt_BR",
      today: "Hoje",
      now: "Agora",
      backToToday: "Voltar para hoje",
      ok: "Ok",
      clear: "Limpar",
      month: "Mês",
      year: "Ano",
      timeSelect: "Selecionar hora",
      dateSelect: "Selecionar data",
      weekSelect: "Escolher semana",
      monthSelect: "Escolher mês",
      yearSelect: "Escolher ano",
      decadeSelect: "Escolher década",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: false,
      previousMonth: "Mês anterior (PageUp)",
      nextMonth: "Próximo mês (PageDown)",
      previousYear: "Ano anterior (Control + esquerda)",
      nextYear: "Próximo ano (Control + direita)",
      previousDecade: "Década anterior",
      nextDecade: "Próxima década",
      previousCentury: "Século anterior",
      nextCentury: "Próximo século",
      shortWeekDays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      shortMonths: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    },
    timePickerLocale: {
      placeholder: "Hora",
      rangePlaceholder: ["Hora inicial", "Hora final"]
    }
  },
  TimePicker: {
    placeholder: "Hora",
    rangePlaceholder: ["Hora inicial", "Hora final"]
  },
  Calendar: {
    lang: {
      placeholder: "Selecionar data",
      yearPlaceholder: "Selecionar ano",
      quarterPlaceholder: "Selecionar trimestre",
      monthPlaceholder: "Selecionar mês",
      weekPlaceholder: "Selecionar semana",
      rangePlaceholder: ["Data inicial", "Data final"],
      rangeYearPlaceholder: ["Ano inicial", "Ano Final"],
      rangeMonthPlaceholder: ["Mês inicial", "Mês final"],
      rangeWeekPlaceholder: ["Semana inicial", "Semana final"],
      locale: "pt_BR",
      today: "Hoje",
      now: "Agora",
      backToToday: "Voltar para hoje",
      ok: "Ok",
      clear: "Limpar",
      month: "Mês",
      year: "Ano",
      timeSelect: "Selecionar hora",
      dateSelect: "Selecionar data",
      weekSelect: "Escolher semana",
      monthSelect: "Escolher mês",
      yearSelect: "Escolher ano",
      decadeSelect: "Escolher década",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: false,
      previousMonth: "Mês anterior (PageUp)",
      nextMonth: "Próximo mês (PageDown)",
      previousYear: "Ano anterior (Control + esquerda)",
      nextYear: "Próximo ano (Control + direita)",
      previousDecade: "Década anterior",
      nextDecade: "Próxima década",
      previousCentury: "Século anterior",
      nextCentury: "Próximo século",
      shortWeekDays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      shortMonths: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    },
    timePickerLocale: {
      placeholder: "Hora",
      rangePlaceholder: ["Hora inicial", "Hora final"]
    }
  },
  global: {
    placeholder: "Por favor escolha"
  },
  Table: {
    filterTitle: "Menu de Filtro",
    filterConfirm: "OK",
    filterReset: "Resetar",
    filterEmptyText: "Sem filtros",
    emptyText: "Sem conteúdo",
    selectAll: "Selecionar página atual",
    selectInvert: "Inverter seleção",
    selectionAll: "Selecionar todo o conteúdo",
    sortTitle: "Ordenar título",
    expand: "Expandir linha",
    collapse: "Colapsar linha",
    triggerDesc: "Clique organiza por descendente",
    triggerAsc: "Clique organiza por ascendente",
    cancelSort: "Clique para cancelar organização",
    selectNone: "Apagar todo o conteúdo"
  },
  Modal: {
    okText: "OK",
    cancelText: "Cancelar",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Cancelar"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Procurar",
    itemUnit: "item",
    itemsUnit: "items",
    remove: "Remover",
    selectCurrent: "Selecionar página atual",
    removeCurrent: "Remover página atual",
    selectAll: "Selecionar todos",
    removeAll: "Remover todos",
    selectInvert: "Inverter seleção atual"
  },
  Upload: {
    uploading: "Enviando...",
    removeFile: "Remover arquivo",
    uploadError: "Erro no envio",
    previewFile: "Visualizar arquivo",
    downloadFile: "Baixar arquivo"
  },
  Empty: {
    description: "Não há dados"
  },
  Icon: {
    icon: "ícone"
  },
  Text: {
    edit: "editar",
    copy: "copiar",
    copied: "copiado",
    expand: "expandir"
  },
  PageHeader: {
    back: "Retornar"
  },
  Image: {
    preview: "Pré-visualização"
  }
};
var pt_PT = {
  locale: "pt",
  Pagination: {
    items_per_page: "/ página",
    jump_to: "Saltar",
    jump_to_confirm: "confirmar",
    page: "Página",
    prev_page: "Página Anterior",
    next_page: "Página Seguinte",
    prev_5: "Recuar 5 Páginas",
    next_5: "Avançar 5 Páginas",
    prev_3: "Recuar 3 Páginas",
    next_3: "Avançar 3 Páginas",
    page_size: "mărimea paginii"
  },
  DatePicker: {
    lang: {
      yearPlaceholder: "Selecionar ano",
      quarterPlaceholder: "Selecionar trimestre",
      monthPlaceholder: "Selecionar mês",
      weekPlaceholder: "Selecionar semana",
      rangePlaceholder: ["Data inicial", "Data final"],
      rangeYearPlaceholder: ["Ano inicial", "Ano final"],
      rangeMonthPlaceholder: ["Mês inicial", "Mês final"],
      rangeWeekPlaceholder: ["Semana inicial", "Semana final"],
      locale: "pt_PT",
      today: "Hoje",
      now: "Agora",
      backToToday: "Hoje",
      ok: "OK",
      clear: "Limpar",
      month: "Mês",
      year: "Ano",
      timeSelect: "Hora",
      dateSelect: "Selecionar data",
      monthSelect: "Selecionar mês",
      yearSelect: "Selecionar ano",
      decadeSelect: "Selecionar década",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: false,
      previousMonth: "Mês anterior (PageUp)",
      nextMonth: "Mês seguinte (PageDown)",
      previousYear: "Ano anterior (Control + left)",
      nextYear: "Ano seguinte (Control + right)",
      previousDecade: "Última década",
      nextDecade: "Próxima década",
      previousCentury: "Último século",
      nextCentury: "Próximo século",
      placeholder: "Data",
      monthFormat: "MMMM"
    },
    timePickerLocale: {
      placeholder: "Hora"
    }
  },
  TimePicker: {
    placeholder: "Hora"
  },
  Calendar: {
    lang: {
      locale: "pt_PT",
      today: "Hoje",
      now: "Agora",
      backToToday: "Hoje",
      ok: "OK",
      clear: "Limpar",
      month: "Mês",
      year: "Ano",
      timeSelect: "Hora",
      dateSelect: "Selecionar data",
      monthSelect: "Selecionar mês",
      yearSelect: "Selecionar ano",
      decadeSelect: "Selecionar década",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: false,
      previousMonth: "Mês anterior (PageUp)",
      nextMonth: "Mês seguinte (PageDown)",
      previousYear: "Ano anterior (Control + left)",
      nextYear: "Ano seguinte (Control + right)",
      previousDecade: "Última década",
      nextDecade: "Próxima década",
      previousCentury: "Último século",
      nextCentury: "Próximo século",
      placeholder: "Data",
      rangePlaceholder: ["Data inicial", "Data final"],
      monthFormat: "MMMM"
    },
    timePickerLocale: {
      placeholder: "Hora"
    }
  },
  Table: {
    filterTitle: "Filtro",
    filterConfirm: "Aplicar",
    filterReset: "Reiniciar",
    selectAll: "Selecionar página atual",
    selectInvert: "Inverter seleção",
    sortTitle: "Ordenação"
  },
  Modal: {
    okText: "OK",
    cancelText: "Cancelar",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Cancelar"
  },
  Transfer: {
    searchPlaceholder: "Procurar...",
    itemUnit: "item",
    itemsUnit: "itens"
  },
  Upload: {
    uploading: "A carregar...",
    removeFile: "Remover",
    uploadError: "Erro ao carregar",
    previewFile: "Pré-visualizar",
    downloadFile: "Baixar"
  },
  Empty: {
    description: "Sem resultados"
  }
};
var ro_RO = {
  locale: "ro",
  Pagination: {
    items_per_page: "/ pagină",
    jump_to: "Mergi la",
    jump_to_confirm: "confirm",
    page: "",
    prev_page: "Pagina Anterioară",
    next_page: "Pagina Următoare",
    prev_5: "5 Pagini Anterioare",
    next_5: "5 Pagini Următoare",
    prev_3: "3 Pagini Anterioare",
    next_3: "3 Pagini Următoare",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Selectează data",
      rangePlaceholder: ["Data start", "Data sfârșit"],
      locale: "ro_RO",
      today: "Azi",
      now: "Acum",
      backToToday: "Înapoi la azi",
      ok: "Ok",
      clear: "Șterge",
      month: "Lună",
      year: "An",
      timeSelect: "selectează timpul",
      dateSelect: "selectează data",
      weekSelect: "Alege o săptămână",
      monthSelect: "Alege o lună",
      yearSelect: "Alege un an",
      decadeSelect: "Alege un deceniu",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Luna anterioară (PageUp)",
      nextMonth: "Luna următoare (PageDown)",
      previousYear: "Anul anterior (Control + stânga)",
      nextYear: "Anul următor (Control + dreapta)",
      previousDecade: "Deceniul anterior",
      nextDecade: "Deceniul următor",
      previousCentury: "Secolul anterior",
      nextCentury: "Secolul următor"
    },
    timePickerLocale: {
      placeholder: "Selectează ora"
    }
  },
  TimePicker: {
    placeholder: "Selectează ora"
  },
  Calendar: {
    lang: {
      placeholder: "Selectează data",
      rangePlaceholder: ["Data start", "Data sfârșit"],
      locale: "ro_RO",
      today: "Azi",
      now: "Acum",
      backToToday: "Înapoi la azi",
      ok: "Ok",
      clear: "Șterge",
      month: "Lună",
      year: "An",
      timeSelect: "selectează timpul",
      dateSelect: "selectează data",
      weekSelect: "Alege o săptămână",
      monthSelect: "Alege o lună",
      yearSelect: "Alege un an",
      decadeSelect: "Alege un deceniu",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Luna anterioară (PageUp)",
      nextMonth: "Luna următoare (PageDown)",
      previousYear: "Anul anterior (Control + stânga)",
      nextYear: "Anul următor (Control + dreapta)",
      previousDecade: "Deceniul anterior",
      nextDecade: "Deceniul următor",
      previousCentury: "Secolul anterior",
      nextCentury: "Secolul următor"
    },
    timePickerLocale: {
      placeholder: "Selectează ora"
    }
  },
  global: {
    placeholder: "Selectează"
  },
  Table: {
    filterTitle: "Filtrează",
    filterConfirm: "OK",
    filterReset: "Resetează",
    selectAll: "Selectează pagina curentă",
    selectInvert: "Inversează pagina curentă",
    sortTitle: "Ordonează",
    expand: "Extinde rândul",
    collapse: "Micșorează rândul",
    filterEmptyText: "Fără filtre",
    emptyText: "Nu există date",
    selectNone: "Șterge selecția",
    selectionAll: "Selectează toate datele",
    triggerDesc: "Apasă pentru ordonare descrescătoare",
    triggerAsc: "Apasă pentru ordonare crescătoare",
    cancelSort: "Apasă pentru a anula ordonarea"
  },
  Modal: {
    okText: "OK",
    cancelText: "Anulare",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Anulare"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Căutare",
    itemUnit: "element",
    itemsUnit: "elemente",
    remove: "Șterge",
    selectCurrent: "Selectează pagina curentă",
    removeCurrent: "Șterge pagina curentă",
    selectAll: "Selectează toate datele",
    removeAll: "Șterge toate datele",
    selectInvert: "Inversează pagina curentă"
  },
  Upload: {
    uploading: "Se transferă...",
    removeFile: "Înlătură fișierul",
    uploadError: "Eroare la upload",
    previewFile: "Previzualizare fișier",
    downloadFile: "Descărcare fișier"
  },
  Empty: {
    description: "Fără date"
  },
  Icon: {
    icon: "icon"
  },
  Text: {
    edit: "editează",
    copy: "copiază",
    copied: "copiat",
    expand: "extinde"
  },
  PageHeader: {
    back: "înapoi"
  },
  Image: {
    preview: "Preview"
  }
};
var ru_RU = {
  locale: "ru",
  Pagination: {
    items_per_page: "/ стр.",
    jump_to: "Перейти",
    jump_to_confirm: "подтвердить",
    page: "Страница",
    prev_page: "Назад",
    next_page: "Вперед",
    prev_5: "Предыдущие 5",
    next_5: "Следующие 5",
    prev_3: "Предыдущие 3",
    next_3: "Следующие 3",
    page_size: "размер страницы"
  },
  DatePicker: {
    lang: {
      placeholder: "Выберите дату",
      yearPlaceholder: "Выберите год",
      quarterPlaceholder: "Выберите квартал",
      monthPlaceholder: "Выберите месяц",
      weekPlaceholder: "Выберите неделю",
      rangePlaceholder: ["Начальная дата", "Конечная дата"],
      rangeYearPlaceholder: ["Начальный год", "Год окончания"],
      rangeMonthPlaceholder: ["Начальный месяц", "Конечный месяц"],
      rangeWeekPlaceholder: ["Начальная неделя", "Конечная неделя"],
      locale: "ru_RU",
      today: "Сегодня",
      now: "Сейчас",
      backToToday: "Текущая дата",
      ok: "ОК",
      clear: "Очистить",
      month: "Месяц",
      year: "Год",
      timeSelect: "Выбрать время",
      dateSelect: "Выбрать дату",
      monthSelect: "Выбрать месяц",
      yearSelect: "Выбрать год",
      decadeSelect: "Выбрать десятилетие",
      yearFormat: "YYYY",
      dateFormat: "D-M-YYYY",
      dayFormat: "D",
      dateTimeFormat: "D-M-YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Предыдущий месяц (PageUp)",
      nextMonth: "Следующий месяц (PageDown)",
      previousYear: "Предыдущий год (Control + left)",
      nextYear: "Следующий год (Control + right)",
      previousDecade: "Предыдущее десятилетие",
      nextDecade: "Следущее десятилетие",
      previousCentury: "Предыдущий век",
      nextCentury: "Следующий век"
    },
    timePickerLocale: {
      placeholder: "Выберите время",
      rangePlaceholder: ["Время начала", "Время окончания"]
    }
  },
  TimePicker: {
    placeholder: "Выберите время",
    rangePlaceholder: ["Время начала", "Время окончания"]
  },
  Calendar: {
    lang: {
      placeholder: "Выберите дату",
      yearPlaceholder: "Выберите год",
      quarterPlaceholder: "Выберите квартал",
      monthPlaceholder: "Выберите месяц",
      weekPlaceholder: "Выберите неделю",
      rangePlaceholder: ["Начальная дата", "Конечная дата"],
      rangeYearPlaceholder: ["Начальный год", "Год окончания"],
      rangeMonthPlaceholder: ["Начальный месяц", "Конечный месяц"],
      rangeWeekPlaceholder: ["Начальная неделя", "Конечная неделя"],
      locale: "ru_RU",
      today: "Сегодня",
      now: "Сейчас",
      backToToday: "Текущая дата",
      ok: "ОК",
      clear: "Очистить",
      month: "Месяц",
      year: "Год",
      timeSelect: "Выбрать время",
      dateSelect: "Выбрать дату",
      monthSelect: "Выбрать месяц",
      yearSelect: "Выбрать год",
      decadeSelect: "Выбрать десятилетие",
      yearFormat: "YYYY",
      dateFormat: "D-M-YYYY",
      dayFormat: "D",
      dateTimeFormat: "D-M-YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Предыдущий месяц (PageUp)",
      nextMonth: "Следующий месяц (PageDown)",
      previousYear: "Предыдущий год (Control + left)",
      nextYear: "Следующий год (Control + right)",
      previousDecade: "Предыдущее десятилетие",
      nextDecade: "Следущее десятилетие",
      previousCentury: "Предыдущий век",
      nextCentury: "Следующий век"
    },
    timePickerLocale: {
      placeholder: "Выберите время",
      rangePlaceholder: ["Время начала", "Время окончания"]
    }
  },
  global: {
    placeholder: "Пожалуйста выберите"
  },
  Table: {
    filterTitle: "Фильтр",
    filterConfirm: "OK",
    filterReset: "Сбросить",
    filterEmptyText: "Без фильтров",
    emptyText: "Нет данных",
    selectAll: "Выбрать всё",
    selectInvert: "Инвертировать выбор",
    selectionAll: "Выбрать все данные",
    sortTitle: "Сортировка",
    expand: "Развернуть строку",
    collapse: "Свернуть строку",
    triggerDesc: "Нажмите для сортировки по убыванию",
    triggerAsc: "Нажмите для сортировки по возрастанию",
    cancelSort: "Нажмите, чтобы отменить сортировку",
    selectNone: "Очистить все данные"
  },
  Modal: {
    okText: "OK",
    cancelText: "Отмена",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Отмена"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Поиск",
    itemUnit: "элем.",
    itemsUnit: "элем.",
    remove: "Удалить",
    selectAll: "Выбрать все данные",
    selectCurrent: "Выбрать текущую страницу",
    selectInvert: "Показать в обратном порядке",
    removeAll: "Удалить все данные",
    removeCurrent: "Удалить текущую страницу"
  },
  Upload: {
    uploading: "Загрузка...",
    removeFile: "Удалить файл",
    uploadError: "При загрузке произошла ошибка",
    previewFile: "Предпросмотр файла",
    downloadFile: "Загрузить файл"
  },
  Empty: {
    description: "Нет данных"
  },
  Icon: {
    icon: "иконка"
  },
  Text: {
    edit: "Редактировать",
    copy: "Копировать",
    copied: "Скопировано",
    expand: "Раскрыть"
  },
  PageHeader: {
    back: "Назад"
  },
  Image: {
    preview: "Предпросмотр"
  }
};
var sk_SK = {
  locale: "sk",
  Pagination: {
    items_per_page: "/ strana",
    jump_to: "Choď na",
    jump_to_confirm: "potvrdit",
    page: "",
    prev_page: "Predchádzajúca strana",
    next_page: "Nasledujúca strana",
    prev_5: "Predchádzajúcich 5 strán",
    next_5: "Nasledujúcich 5 strán",
    prev_3: "Predchádzajúce 3 strany",
    next_3: "Nasledujúce 3 strany",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Vybrať dátum",
      rangePlaceholder: ["Od", "Do"],
      locale: "sk_SK",
      today: "Dnes",
      now: "Teraz",
      backToToday: "Späť na dnes",
      ok: "Ok",
      clear: "Vymazať",
      month: "Mesiac",
      year: "Rok",
      timeSelect: "Vybrať čas",
      dateSelect: "Vybrať dátum",
      monthSelect: "Vybrať mesiac",
      yearSelect: "Vybrať rok",
      decadeSelect: "Vybrať dekádu",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Predchádzajúci mesiac (PageUp)",
      nextMonth: "Nasledujúci mesiac (PageDown)",
      previousYear: "Predchádzajúci rok (Control + left)",
      nextYear: "Nasledujúci rok (Control + right)",
      previousDecade: "Predchádzajúca dekáda",
      nextDecade: "Nasledujúca dekáda",
      previousCentury: "Predchádzajúce storočie",
      nextCentury: "Nasledujúce storočie"
    },
    timePickerLocale: {
      placeholder: "Vybrať čas"
    }
  },
  TimePicker: {
    placeholder: "Vybrať čas"
  },
  Calendar: {
    lang: {
      placeholder: "Vybrať dátum",
      rangePlaceholder: ["Od", "Do"],
      locale: "sk_SK",
      today: "Dnes",
      now: "Teraz",
      backToToday: "Späť na dnes",
      ok: "Ok",
      clear: "Vymazať",
      month: "Mesiac",
      year: "Rok",
      timeSelect: "Vybrať čas",
      dateSelect: "Vybrať dátum",
      monthSelect: "Vybrať mesiac",
      yearSelect: "Vybrať rok",
      decadeSelect: "Vybrať dekádu",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Predchádzajúci mesiac (PageUp)",
      nextMonth: "Nasledujúci mesiac (PageDown)",
      previousYear: "Predchádzajúci rok (Control + left)",
      nextYear: "Nasledujúci rok (Control + right)",
      previousDecade: "Predchádzajúca dekáda",
      nextDecade: "Nasledujúca dekáda",
      previousCentury: "Predchádzajúce storočie",
      nextCentury: "Nasledujúce storočie"
    },
    timePickerLocale: {
      placeholder: "Vybrať čas"
    }
  },
  global: {
    placeholder: "Prosím vyberte"
  },
  Table: {
    filterTitle: "Filter",
    filterConfirm: "OK",
    filterReset: "Obnoviť",
    selectAll: "Vybrať všetko",
    selectInvert: "Vybrať opačné",
    sortTitle: "Zoradiť",
    expand: "Rozbaliť riadok",
    collapse: "Zbaliť riadok"
  },
  Modal: {
    okText: "OK",
    cancelText: "Zrušiť",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Zrušiť"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Vyhľadávanie",
    itemUnit: "položka",
    itemsUnit: "položiek"
  },
  Upload: {
    uploading: "Nahrávanie...",
    removeFile: "Odstrániť súbor",
    uploadError: "Chyba pri nahrávaní",
    previewFile: "Zobraziť súbor",
    downloadFile: "Stiahnuť súbor"
  },
  Empty: {
    description: "Žiadne dáta"
  },
  Icon: {
    icon: "ikona"
  },
  Text: {
    edit: "Upraviť",
    copy: "Kopírovať",
    copied: "Skopírované",
    expand: "Zväčšiť"
  },
  PageHeader: {
    back: "Späť"
  }
};
var sl_SI = {
  locale: "sl",
  Pagination: {
    items_per_page: "/ strani",
    jump_to: "Pojdi na",
    jump_to_confirm: "potrdi",
    page: "",
    prev_page: "Prejšnja stran",
    next_page: "Naslednja stran",
    prev_5: "Prejšnjih 5 strani",
    next_5: "Naslednjih 5 strani",
    prev_3: "Prejšnje 3 strani",
    next_3: "Naslednje 3 strani",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      locale: "sl",
      placeholder: "Izberite datum",
      rangePlaceholder: ["Začetni datum", "Končni datum"],
      today: "Danes",
      now: "Trenutno",
      backToToday: "Nazaj na trenutni datum",
      ok: "OK",
      clear: "Počisti",
      month: "Mesec",
      year: "Leto",
      timeSelect: "Izberi čas",
      dateSelect: "Izberi datum",
      monthSelect: "Izberite mesec",
      yearSelect: "Izberite leto",
      decadeSelect: "Izberite desetletje",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthFormat: "MMMM",
      monthBeforeYear: true,
      previousMonth: "Prejšnji mesec (PageUp)",
      nextMonth: "Naslednji mesec (PageDown)",
      previousYear: "Lansko leto (Control + left)",
      nextYear: "Naslednje leto (Control + right)",
      previousDecade: "Prejšnje desetletje",
      nextDecade: "Naslednje desetletje",
      previousCentury: "Zadnje stoletje",
      nextCentury: "Naslednje stoletje"
    },
    timePickerLocale: {
      placeholder: "Izberite čas"
    }
  },
  TimePicker: {
    placeholder: "Izberite čas"
  },
  Calendar: {
    lang: {
      locale: "sl",
      placeholder: "Izberite datum",
      rangePlaceholder: ["Začetni datum", "Končni datum"],
      today: "Danes",
      now: "Trenutno",
      backToToday: "Nazaj na trenutni datum",
      ok: "OK",
      clear: "Počisti",
      month: "Mesec",
      year: "Leto",
      timeSelect: "Izberi čas",
      dateSelect: "Izberi datum",
      monthSelect: "Izberite mesec",
      yearSelect: "Izberite leto",
      decadeSelect: "Izberite desetletje",
      yearFormat: "YYYY",
      dateFormat: "D.M.YYYY",
      dayFormat: "D",
      dateTimeFormat: "D.M.YYYY HH:mm:ss",
      monthFormat: "MMMM",
      monthBeforeYear: true,
      previousMonth: "Prejšnji mesec (PageUp)",
      nextMonth: "Naslednji mesec (PageDown)",
      previousYear: "Lansko leto (Control + left)",
      nextYear: "Naslednje leto (Control + right)",
      previousDecade: "Prejšnje desetletje",
      nextDecade: "Naslednje desetletje",
      previousCentury: "Zadnje stoletje",
      nextCentury: "Naslednje stoletje"
    },
    timePickerLocale: {
      placeholder: "Izberite čas"
    }
  },
  Table: {
    filterTitle: "Filter",
    filterConfirm: "Filtriraj",
    filterReset: "Pobriši filter",
    selectAll: "Izberi vse na trenutni strani",
    selectInvert: "Obrni izbor na trenutni strani"
  },
  Modal: {
    okText: "V redu",
    cancelText: "Prekliči",
    justOkText: "V redu"
  },
  Popconfirm: {
    okText: "v redu",
    cancelText: "Prekliči"
  },
  Transfer: {
    searchPlaceholder: "Išči tukaj",
    itemUnit: "Objekt",
    itemsUnit: "Objektov"
  },
  Upload: {
    uploading: "Nalaganje...",
    removeFile: "Odstrani datoteko",
    uploadError: "Napaka pri nalaganju",
    previewFile: "Predogled datoteke",
    downloadFile: "Prenos datoteke"
  },
  Empty: {
    description: "Ni podatkov"
  }
};
var sr_RS = {
  locale: "sr",
  Pagination: {
    items_per_page: "/ strani",
    jump_to: "Idi na",
    page: "",
    prev_page: "Prethodna strana",
    next_page: "Sledeća strana",
    prev_5: "Prethodnih 5 Strana",
    next_5: "Sledećih 5 Strana",
    prev_3: "Prethodnih 3 Strane",
    next_3: "Sledećih 3 Strane",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Izaberi datum",
      rangePlaceholder: ["Datum početka", "Datum završetka"],
      locale: "sr_RS",
      today: "Danas",
      now: "Sada",
      backToToday: "Vrati se na danas",
      ok: "U redu",
      clear: "Obriši",
      month: "Mesec",
      year: "Godina",
      timeSelect: "Izaberi vreme",
      dateSelect: "Izaberi datum",
      monthSelect: "Izaberi mesec",
      yearSelect: "Izaberi godinu",
      decadeSelect: "Izaberi deceniju",
      yearFormat: "YYYY",
      dateFormat: "DD.MM.YYYY",
      dayFormat: "D",
      dateTimeFormat: "DD.MM.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Prethodni mesec (PageUp)",
      nextMonth: "Sledeći mesec (PageDown)",
      previousYear: "Prethodna godina (Control + left)",
      nextYear: "Sledeća godina (Control + right)",
      previousDecade: "Prethodna decenija",
      nextDecade: "Sledeća decenija",
      previousCentury: "Prethodni vek",
      nextCentury: "Sledeći vek",
      yearPlaceholder: "Izaberi godinu",
      quarterPlaceholder: "Izaberi tromesečje",
      monthPlaceholder: "Izaberi mesec",
      weekPlaceholder: "Izaberi sedmicu",
      rangeYearPlaceholder: ["Godina početka", "Godina završetka"],
      rangeMonthPlaceholder: ["Mesec početka", "Mesec završetka"],
      rangeWeekPlaceholder: ["Sedmica početka", "Sedmica završetka"]
    },
    timePickerLocale: {
      placeholder: "Izaberi vreme",
      rangePlaceholder: ["Vreme početka", "Vreme završetka"]
    }
  },
  TimePicker: {
    placeholder: "Izaberi vreme",
    rangePlaceholder: ["Vreme početka", "Vreme završetka"]
  },
  Calendar: {
    lang: {
      placeholder: "Izaberi datum",
      rangePlaceholder: ["Datum početka", "Datum završetka"],
      locale: "sr_RS",
      today: "Danas",
      now: "Sada",
      backToToday: "Vrati se na danas",
      ok: "U redu",
      clear: "Obriši",
      month: "Mesec",
      year: "Godina",
      timeSelect: "Izaberi vreme",
      dateSelect: "Izaberi datum",
      monthSelect: "Izaberi mesec",
      yearSelect: "Izaberi godinu",
      decadeSelect: "Izaberi deceniju",
      yearFormat: "YYYY",
      dateFormat: "DD.MM.YYYY",
      dayFormat: "D",
      dateTimeFormat: "DD.MM.YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Prethodni mesec (PageUp)",
      nextMonth: "Sledeći mesec (PageDown)",
      previousYear: "Prethodna godina (Control + left)",
      nextYear: "Sledeća godina (Control + right)",
      previousDecade: "Prethodna decenija",
      nextDecade: "Sledeća decenija",
      previousCentury: "Prethodni vek",
      nextCentury: "Sledeći vek",
      yearPlaceholder: "Izaberi godinu",
      quarterPlaceholder: "Izaberi tromesečje",
      monthPlaceholder: "Izaberi mesec",
      weekPlaceholder: "Izaberi sedmicu",
      rangeYearPlaceholder: ["Godina početka", "Godina završetka"],
      rangeMonthPlaceholder: ["Mesec početka", "Mesec završetka"],
      rangeWeekPlaceholder: ["Sedmica početka", "Sedmica završetka"]
    },
    timePickerLocale: {
      placeholder: "Izaberi vreme",
      rangePlaceholder: ["Vreme početka", "Vreme završetka"]
    }
  },
  Table: {
    filterTitle: "Meni filtera",
    filterConfirm: "U redu",
    filterReset: "Poništi",
    selectAll: "Izaberi trenutnu stranicu",
    selectInvert: "Obrni izbor trenutne stranice",
    filterEmptyText: "Nema filtera",
    emptyText: "Nema podataka",
    selectNone: "Obriši sve podatke",
    selectionAll: "Izaberi sve podatke",
    sortTitle: "Sortiraj",
    expand: "Proširi red",
    collapse: "Skupi red",
    triggerDesc: "Klikni da sortiraš po padajućem redosledu",
    triggerAsc: "Klikni da sortiraš po rastućem redosledu",
    cancelSort: "Klikni da otkažeš sortiranje"
  },
  Modal: {
    okText: "U redu",
    cancelText: "Otkaži",
    justOkText: "U redu"
  },
  Popconfirm: {
    okText: "U redu",
    cancelText: "Otkaži"
  },
  Transfer: {
    searchPlaceholder: "Pretraži ovde",
    itemUnit: "stavka",
    itemsUnit: "stavki",
    titles: ["", ""],
    remove: "Ukloni",
    selectCurrent: "Izaberi trenutnu stranicu",
    removeCurrent: "Ukloni trenutnu stranicu",
    selectAll: "Izaberi sve podatke",
    removeAll: "Ukloni sve podatke",
    selectInvert: "Obrni izbor trenutne stranice"
  },
  Upload: {
    uploading: "Otpremanje...",
    removeFile: "Ukloni datoteku",
    uploadError: "Greška pri otpremanju",
    previewFile: "Pregledaj datoteku",
    downloadFile: "Preuzmi datoteku"
  },
  Empty: {
    description: "Nema podataka"
  },
  global: {
    placeholder: "Izaberi"
  },
  Icon: {
    icon: "ikona"
  },
  Text: {
    edit: "Uredi",
    copy: "Kopiraj",
    copied: "Kopirano",
    expand: "Proširi"
  },
  PageHeader: {
    back: "Nazad"
  },
  Image: {
    preview: "Pregled"
  }
};
var sv_SE = {
  locale: "sv",
  Pagination: {
    items_per_page: "/ sida",
    jump_to: "Gå till",
    jump_to_confirm: "bekräfta",
    page: "Sida",
    prev_page: "Föreg sida",
    next_page: "Nästa sida",
    prev_5: "Föreg 5 sidor",
    next_5: "Nästa 5 sidor",
    prev_3: "Föreg 3 sidor",
    next_3: "Nästa 3 sidor",
    page_size: "sidstorlek"
  },
  DatePicker: {
    lang: {
      placeholder: "Välj datum",
      rangePlaceholder: ["Startdatum", "Slutdatum"],
      locale: "sv_SE",
      today: "I dag",
      now: "Nu",
      backToToday: "Till idag",
      ok: "Ok",
      clear: "Avbryt",
      month: "Månad",
      year: "År",
      timeSelect: "Välj tidpunkt",
      dateSelect: "Välj datum",
      monthSelect: "Välj månad",
      yearSelect: "Välj år",
      decadeSelect: "Välj årtionde",
      yearFormat: "YYYY",
      dateFormat: "YYYY-MM-DD",
      dayFormat: "D",
      dateTimeFormat: "YYYY-MM-DD H:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Förra månaden (PageUp)",
      nextMonth: "Nästa månad (PageDown)",
      previousYear: "Föreg år (Control + left)",
      nextYear: "Nästa år (Control + right)",
      previousDecade: "Föreg årtionde",
      nextDecade: "Nästa årtionde",
      previousCentury: "Föreg århundrade",
      nextCentury: "Nästa århundrade",
      yearPlaceholder: "Välj år",
      quarterPlaceholder: "Välj kvartal",
      monthPlaceholder: "Välj månad",
      weekPlaceholder: "Välj vecka",
      rangeYearPlaceholder: ["Startår", "Slutår"],
      rangeMonthPlaceholder: ["Startmånad", "Slutmånad"],
      rangeWeekPlaceholder: ["Startvecka", "Slutvecka"]
    },
    timePickerLocale: {
      placeholder: "Välj tid"
    }
  },
  TimePicker: {
    placeholder: "Välj tid"
  },
  Calendar: {
    lang: {
      placeholder: "Välj datum",
      rangePlaceholder: ["Startdatum", "Slutdatum"],
      locale: "sv_SE",
      today: "I dag",
      now: "Nu",
      backToToday: "Till idag",
      ok: "Ok",
      clear: "Avbryt",
      month: "Månad",
      year: "År",
      timeSelect: "Välj tidpunkt",
      dateSelect: "Välj datum",
      monthSelect: "Välj månad",
      yearSelect: "Välj år",
      decadeSelect: "Välj årtionde",
      yearFormat: "YYYY",
      dateFormat: "YYYY-MM-DD",
      dayFormat: "D",
      dateTimeFormat: "YYYY-MM-DD H:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Förra månaden (PageUp)",
      nextMonth: "Nästa månad (PageDown)",
      previousYear: "Föreg år (Control + left)",
      nextYear: "Nästa år (Control + right)",
      previousDecade: "Föreg årtionde",
      nextDecade: "Nästa årtionde",
      previousCentury: "Föreg århundrade",
      nextCentury: "Nästa århundrade",
      yearPlaceholder: "Välj år",
      quarterPlaceholder: "Välj kvartal",
      monthPlaceholder: "Välj månad",
      weekPlaceholder: "Välj vecka",
      rangeYearPlaceholder: ["Startår", "Slutår"],
      rangeMonthPlaceholder: ["Startmånad", "Slutmånad"],
      rangeWeekPlaceholder: ["Startvecka", "Slutvecka"]
    },
    timePickerLocale: {
      placeholder: "Välj tid"
    }
  },
  Table: {
    filterTitle: "Filtermeny",
    filterConfirm: "OK",
    filterReset: "Återställ",
    filterEmptyText: "Inga filter",
    emptyText: "Ingen data",
    selectAll: "Markera nuvarande sida",
    selectInvert: "Invertera nuvarande sida",
    selectNone: "Avmarkera all data",
    selectionAll: "Markera all data",
    sortTitle: "Sortera",
    expand: "Expandera rad",
    collapse: "Komprimera rad",
    triggerDesc: "Klicka för att sortera i fallande ordning",
    triggerAsc: "Klicka för att sortera i stigande ordning",
    cancelSort: "Klicka för att avbryta sortering"
  },
  Modal: {
    okText: "OK",
    cancelText: "Avbryt",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Avbryt"
  },
  Transfer: {
    searchPlaceholder: "Sök här",
    itemUnit: "objekt",
    itemsUnit: "objekt",
    titles: ["", ""],
    remove: "Ta bort",
    selectCurrent: "Markera nuvarande sida",
    removeCurrent: "Ta bort nuvarande sida",
    selectAll: "Markera all data",
    removeAll: "Ta bort all data",
    selectInvert: "Invertera nuvarande sida"
  },
  Empty: {
    description: "Ingen data"
  },
  Text: {
    edit: "Redigera",
    copy: "Kopiera",
    copied: "Kopierad",
    expand: "Expandera"
  },
  Upload: {
    uploading: "Laddar upp...",
    removeFile: "Ta bort fil",
    uploadError: "Uppladdningsfel",
    previewFile: "Förhandsgranska fil",
    downloadFile: "Ladda ned fil"
  },
  global: {
    placeholder: "Vänligen välj"
  },
  Icon: {
    icon: "ikon"
  },
  PageHeader: {
    back: "Tillbaka"
  },
  Image: {
    preview: "Förhandsgranska"
  }
};
var ta_IN = {
  locale: "ta",
  Pagination: {
    items_per_page: "/ பக்கம்",
    jump_to: "அடுத்த",
    jump_to_confirm: "உறுதிப்படுத்தவும்",
    page: "",
    prev_page: "முந்தைய பக்கம்",
    next_page: "அடுத்த பக்கம்",
    prev_5: "முந்தைய 5 பக்கங்கள்",
    next_5: "அடுத்த 5 பக்கங்கள்",
    prev_3: "முந்தைய 3 பக்கங்கள்",
    next_3: "அடுத்த 3 பக்கங்கள்",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "தேதியைத் தேர்ந்தெடுக்கவும்",
      rangePlaceholder: ["தொடக்க தேதி", "கடைசி தேதி"],
      locale: "ta_IN",
      today: "இன்று",
      now: "இப்போது",
      backToToday: "இன்றுக்கு திரும்பு",
      ok: "சரி",
      clear: "அழி",
      month: "மாதம்",
      year: "வருடம்",
      timeSelect: "நேரத்தைத் தேர்ந்தெடு",
      dateSelect: "தேதியைத் தேர்ந்தெடு",
      weekSelect: "வாரத்தைத் தேர்வுசெய்க",
      monthSelect: "மாதத்தைத் தேர்வுசெய்க",
      yearSelect: "வருடத்தைத் தேர்வுசெய்க",
      decadeSelect: "தசாப்தத்தைத் தேர்வுசெய்க",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "முந்தைய மாதம் (PageUp)",
      nextMonth: "அடுத்த மாதம் (PageDown)",
      previousYear: "முந்தைய வருடம் (Control + left)",
      nextYear: "அடுத்த வருடம் (Control + right)",
      previousDecade: "முந்தைய தசாப்தம்",
      nextDecade: "அடுத்த தசாப்தம்",
      previousCentury: "முந்தைய நூற்றாண்டு",
      nextCentury: "அடுத்த நூற்றாண்டு"
    },
    timePickerLocale: {
      placeholder: "நேரத்தைத் தேர்ந்தெடுக்கவும்"
    }
  },
  TimePicker: {
    placeholder: "நேரத்தைத் தேர்ந்தெடுக்கவும்"
  },
  Calendar: {
    lang: {
      placeholder: "தேதியைத் தேர்ந்தெடுக்கவும்",
      rangePlaceholder: ["தொடக்க தேதி", "கடைசி தேதி"],
      locale: "ta_IN",
      today: "இன்று",
      now: "இப்போது",
      backToToday: "இன்றுக்கு திரும்பு",
      ok: "சரி",
      clear: "அழி",
      month: "மாதம்",
      year: "வருடம்",
      timeSelect: "நேரத்தைத் தேர்ந்தெடு",
      dateSelect: "தேதியைத் தேர்ந்தெடு",
      weekSelect: "வாரத்தைத் தேர்வுசெய்க",
      monthSelect: "மாதத்தைத் தேர்வுசெய்க",
      yearSelect: "வருடத்தைத் தேர்வுசெய்க",
      decadeSelect: "தசாப்தத்தைத் தேர்வுசெய்க",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "முந்தைய மாதம் (PageUp)",
      nextMonth: "அடுத்த மாதம் (PageDown)",
      previousYear: "முந்தைய வருடம் (Control + left)",
      nextYear: "அடுத்த வருடம் (Control + right)",
      previousDecade: "முந்தைய தசாப்தம்",
      nextDecade: "அடுத்த தசாப்தம்",
      previousCentury: "முந்தைய நூற்றாண்டு",
      nextCentury: "அடுத்த நூற்றாண்டு"
    },
    timePickerLocale: {
      placeholder: "நேரத்தைத் தேர்ந்தெடுக்கவும்"
    }
  },
  global: {
    placeholder: "தேதியைத் தேர்ந்தெடுக்கவும்"
  },
  Table: {
    filterTitle: "பட்டியலை மூடு",
    filterConfirm: "சரி",
    filterReset: "மீட்டமை",
    emptyText: "தகவல் இல்லை",
    selectAll: "அனைத்தையும் தேர்வுசெய்",
    selectInvert: "தலைகீழாக மாற்று",
    sortTitle: "தலைப்பை வரிசைப்படுத்தவும்"
  },
  Modal: {
    okText: "சரி",
    cancelText: "ரத்து செய்யவும்",
    justOkText: "பரவாயில்லை, சரி"
  },
  Popconfirm: {
    okText: "சரி",
    cancelText: "ரத்து செய்யவும்"
  },
  Transfer: {
    titles: ["", ""],
    notFoundContent: "உள்ளடக்கம் கிடைக்கவில்லை",
    searchPlaceholder: "இங்கு தேடவும்",
    itemUnit: "தகவல்",
    itemsUnit: "தகவல்கள்"
  },
  Upload: {
    uploading: "பதிவேற்றுகிறது...",
    removeFile: "கோப்பை அகற்று",
    uploadError: "பதிவேற்றுவதில் பிழை",
    previewFile: "கோப்பை முன்னோட்டமிடுங்கள்",
    downloadFile: "பதிவிறக்க கோப்பு"
  },
  Empty: {
    description: "தகவல் இல்லை"
  },
  Icon: {
    icon: "உருவம்"
  },
  Text: {
    edit: "திருத்து",
    copy: "நகல் எடு",
    copied: "நகல் எடுக்கப்பட்டது",
    expand: "விரிவாக்கவும்"
  },
  PageHeader: {
    back: "பின் செல்லவும்"
  }
};
var th_TH = {
  locale: "th",
  Pagination: {
    items_per_page: "/ หน้า",
    jump_to: "ไปยัง",
    jump_to_confirm: "ยืนยัน",
    page: "หน้า",
    prev_page: "หน้าก่อนหน้า",
    next_page: "หน้าถัดไป",
    prev_5: "ย้อนกลับ 5 หน้า",
    next_5: "ถัดไป 5 หน้า",
    prev_3: "ย้อนกลับ 3 หน้า",
    next_3: "ถัดไป 3 หน้า",
    page_size: "ขนาดหน้า"
  },
  DatePicker: {
    lang: {
      placeholder: "เลือกวันที่",
      yearPlaceholder: "เลือกปี",
      quarterPlaceholder: "เลือกไตรมาส",
      monthPlaceholder: "เลือกเดือน",
      weekPlaceholder: "เลือกสัปดาห์",
      rangePlaceholder: ["วันเริ่มต้น", "วันสิ้นสุด"],
      rangeYearPlaceholder: ["ปีเริ่มต้น", "ปีสิ้นสุด"],
      rangeMonthPlaceholder: ["เดือนเริ่มต้น", "เดือนสิ้นสุด"],
      rangeWeekPlaceholder: ["สัปดาห์เริ่มต้น", "สัปดาห์สิ้นสุด"],
      locale: "th_TH",
      today: "วันนี้",
      now: "ตอนนี้",
      backToToday: "กลับไปยังวันนี้",
      ok: "ตกลง",
      clear: "ลบล้าง",
      month: "เดือน",
      year: "ปี",
      timeSelect: "เลือกเวลา",
      dateSelect: "เลือกวัน",
      monthSelect: "เลือกเดือน",
      yearSelect: "เลือกปี",
      decadeSelect: "เลือกทศวรรษ",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "เดือนก่อนหน้า (PageUp)",
      nextMonth: "เดือนถัดไป (PageDown)",
      previousYear: "ปีก่อนหน้า (Control + left)",
      nextYear: "ปีถัดไป (Control + right)",
      previousDecade: "ทศวรรษก่อนหน้า",
      nextDecade: "ทศวรรษถัดไป",
      previousCentury: "ศตวรรษก่อนหน้า",
      nextCentury: "ศตวรรษถัดไป"
    },
    timePickerLocale: {
      placeholder: "เลือกเวลา"
    }
  },
  TimePicker: {
    placeholder: "เลือกเวลา"
  },
  Calendar: {
    lang: {
      placeholder: "เลือกวันที่",
      yearPlaceholder: "เลือกปี",
      quarterPlaceholder: "เลือกไตรมาส",
      monthPlaceholder: "เลือกเดือน",
      weekPlaceholder: "เลือกสัปดาห์",
      rangePlaceholder: ["วันเริ่มต้น", "วันสิ้นสุด"],
      rangeYearPlaceholder: ["ปีเริ่มต้น", "ปีสิ้นสุด"],
      rangeMonthPlaceholder: ["เดือนเริ่มต้น", "เดือนสิ้นสุด"],
      rangeWeekPlaceholder: ["สัปดาห์เริ่มต้น", "สัปดาห์สิ้นสุด"],
      locale: "th_TH",
      today: "วันนี้",
      now: "ตอนนี้",
      backToToday: "กลับไปยังวันนี้",
      ok: "ตกลง",
      clear: "ลบล้าง",
      month: "เดือน",
      year: "ปี",
      timeSelect: "เลือกเวลา",
      dateSelect: "เลือกวัน",
      monthSelect: "เลือกเดือน",
      yearSelect: "เลือกปี",
      decadeSelect: "เลือกทศวรรษ",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "เดือนก่อนหน้า (PageUp)",
      nextMonth: "เดือนถัดไป (PageDown)",
      previousYear: "ปีก่อนหน้า (Control + left)",
      nextYear: "ปีถัดไป (Control + right)",
      previousDecade: "ทศวรรษก่อนหน้า",
      nextDecade: "ทศวรรษถัดไป",
      previousCentury: "ศตวรรษก่อนหน้า",
      nextCentury: "ศตวรรษถัดไป"
    },
    timePickerLocale: {
      placeholder: "เลือกเวลา"
    }
  },
  global: {
    placeholder: "กรุณาเลือก"
  },
  Table: {
    filterTitle: "ตัวกรอง",
    filterConfirm: "ยืนยัน",
    filterReset: "รีเซ็ต",
    filterEmptyText: "ไม่มีตัวกรอง",
    emptyText: "ไม่มีข้อมูล",
    selectAll: "เลือกทั้งหมดในหน้านี้",
    selectInvert: "กลับสถานะการเลือกในหน้านี้",
    selectionAll: "เลือกข้อมูลทั้งหมด",
    sortTitle: "เรียง",
    expand: "แสดงแถวข้อมูล",
    collapse: "ย่อแถวข้อมูล",
    triggerDesc: "คลิกเรียงจากมากไปน้อย",
    triggerAsc: "คลิกเรียงจากน้อยไปมาก",
    cancelSort: "คลิกเพื่อยกเลิกการเรียง"
  },
  Modal: {
    okText: "ตกลง",
    cancelText: "ยกเลิก",
    justOkText: "ตกลง"
  },
  Popconfirm: {
    okText: "ตกลง",
    cancelText: "ยกเลิก"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "ค้นหา",
    itemUnit: "ชิ้น",
    itemsUnit: "ชิ้น",
    remove: "นำออก",
    selectCurrent: "เลือกทั้งหมดในหน้านี้",
    removeCurrent: "นำออกทั้งหมดในหน้านี้",
    selectAll: "เลือกข้อมูลทั้งหมด",
    removeAll: "นำข้อมูลออกทั้งหมด",
    selectInvert: "กลับสถานะการเลือกในหน้านี้"
  },
  Upload: {
    uploading: "กำลังอัปโหลด...",
    removeFile: "ลบไฟล์",
    uploadError: "เกิดข้อผิดพลาดในการอัปโหลด",
    previewFile: "ดูตัวอย่างไฟล์",
    downloadFile: "ดาวน์โหลดไฟล์"
  },
  Empty: {
    description: "ไม่มีข้อมูล"
  },
  Icon: {
    icon: "ไอคอน"
  },
  Text: {
    edit: "แก้ไข",
    copy: "คัดลอก",
    copied: "คัดลอกแล้ว",
    expand: "ขยาย"
  },
  PageHeader: {
    back: "ย้อนกลับ"
  }
};
var tr_TR = {
  locale: "tr",
  Pagination: {
    items_per_page: "/ sayfa",
    jump_to: "Git",
    jump_to_confirm: "onayla",
    page: "Sayfa",
    prev_page: "Önceki Sayfa",
    next_page: "Sonraki Sayfa",
    prev_5: "Önceki 5 Sayfa",
    next_5: "Sonraki 5 Sayfa",
    prev_3: "Önceki 3 Sayfa",
    next_3: "Sonraki 3 Sayfa",
    page_size: "sayfa boyutu"
  },
  DatePicker: {
    lang: {
      placeholder: "Tarih seç",
      yearPlaceholder: "Yıl seç",
      quarterPlaceholder: "Çeyrek seç",
      monthPlaceholder: "Ay seç",
      weekPlaceholder: "Hafta seç",
      rangePlaceholder: ["Başlangıç tarihi", "Bitiş tarihi"],
      rangeYearPlaceholder: ["Başlangıç yılı", "Bitiş yılı"],
      rangeMonthPlaceholder: ["Başlangıç ayı", "Bitiş ayı"],
      rangeWeekPlaceholder: ["Başlangıç haftası", "Bitiş haftası"],
      locale: "tr_TR",
      today: "Bugün",
      now: "Şimdi",
      backToToday: "Bugüne Geri Dön",
      ok: "tamam",
      clear: "Temizle",
      month: "Ay",
      year: "Yıl",
      timeSelect: "Zaman Seç",
      dateSelect: "Tarih Seç",
      monthSelect: "Ay Seç",
      yearSelect: "Yıl Seç",
      decadeSelect: "On Yıl Seç",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Önceki Ay (PageUp)",
      nextMonth: "Sonraki Ay (PageDown)",
      previousYear: "Önceki Yıl (Control + Sol)",
      nextYear: "Sonraki Yıl (Control + Sağ)",
      previousDecade: "Önceki On Yıl",
      nextDecade: "Sonraki On Yıl",
      previousCentury: "Önceki Yüzyıl",
      nextCentury: "Sonraki Yüzyıl"
    },
    timePickerLocale: {
      placeholder: "Zaman seç",
      rangePlaceholder: ["Başlangıç zamanı", "Bitiş zamanı"]
    }
  },
  TimePicker: {
    placeholder: "Zaman seç",
    rangePlaceholder: ["Başlangıç zamanı", "Bitiş zamanı"]
  },
  Calendar: {
    lang: {
      placeholder: "Tarih seç",
      yearPlaceholder: "Yıl seç",
      quarterPlaceholder: "Çeyrek seç",
      monthPlaceholder: "Ay seç",
      weekPlaceholder: "Hafta seç",
      rangePlaceholder: ["Başlangıç tarihi", "Bitiş tarihi"],
      rangeYearPlaceholder: ["Başlangıç yılı", "Bitiş yılı"],
      rangeMonthPlaceholder: ["Başlangıç ayı", "Bitiş ayı"],
      rangeWeekPlaceholder: ["Başlangıç haftası", "Bitiş haftası"],
      locale: "tr_TR",
      today: "Bugün",
      now: "Şimdi",
      backToToday: "Bugüne Geri Dön",
      ok: "tamam",
      clear: "Temizle",
      month: "Ay",
      year: "Yıl",
      timeSelect: "Zaman Seç",
      dateSelect: "Tarih Seç",
      monthSelect: "Ay Seç",
      yearSelect: "Yıl Seç",
      decadeSelect: "On Yıl Seç",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Önceki Ay (PageUp)",
      nextMonth: "Sonraki Ay (PageDown)",
      previousYear: "Önceki Yıl (Control + Sol)",
      nextYear: "Sonraki Yıl (Control + Sağ)",
      previousDecade: "Önceki On Yıl",
      nextDecade: "Sonraki On Yıl",
      previousCentury: "Önceki Yüzyıl",
      nextCentury: "Sonraki Yüzyıl"
    },
    timePickerLocale: {
      placeholder: "Zaman seç",
      rangePlaceholder: ["Başlangıç zamanı", "Bitiş zamanı"]
    }
  },
  global: {
    placeholder: "Lütfen seçiniz"
  },
  Table: {
    filterTitle: "Filtre menüsü",
    filterConfirm: "Tamam",
    filterReset: "Sıfırla",
    filterEmptyText: "Filtre yok",
    selectAll: "Tüm sayfayı seç",
    selectInvert: "Tersini seç",
    selectionAll: "Tümünü seç",
    sortTitle: "Sırala",
    expand: "Satırı genişlet",
    collapse: "Satırı daralt",
    triggerDesc: "Azalan düzende sırala",
    triggerAsc: "Artan düzende sırala",
    cancelSort: "Sıralamayı kaldır"
  },
  Modal: {
    okText: "Tamam",
    cancelText: "İptal",
    justOkText: "Tamam"
  },
  Popconfirm: {
    okText: "Tamam",
    cancelText: "İptal"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Arama",
    itemUnit: "Öğe",
    itemsUnit: "Öğeler",
    remove: "Kaldır",
    selectCurrent: "Tüm sayfayı seç",
    removeCurrent: "Sayfayı kaldır",
    selectAll: "Tümünü seç",
    removeAll: "Tümünü kaldır",
    selectInvert: "Tersini seç"
  },
  Upload: {
    uploading: "Yükleniyor...",
    removeFile: "Dosyayı kaldır",
    uploadError: "Yükleme hatası",
    previewFile: "Dosyayı önizle",
    downloadFile: "Dosyayı indir"
  },
  Empty: {
    description: "Veri Yok"
  },
  Icon: {
    icon: "ikon"
  },
  Text: {
    edit: "Düzenle",
    copy: "Kopyala",
    copied: "Kopyalandı",
    expand: "Genişlet"
  },
  PageHeader: {
    back: "Geri"
  },
  Image: {
    preview: "Önizleme"
  }
};
var uk_UA = {
  locale: "uk",
  Pagination: {
    items_per_page: "/ сторінці",
    jump_to: "Перейти",
    jump_to_confirm: "підтвердити",
    page: "",
    prev_page: "Попередня сторінка",
    next_page: "Наступна сторінка",
    prev_5: "Попередні 5 сторінок",
    next_5: "Наступні 5 сторінок",
    prev_3: "Попередні 3 сторінки",
    next_3: "Наступні 3 сторінки",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "Оберіть дату",
      yearPlaceholder: "Оберіть рік",
      quarterPlaceholder: "Оберіть квартал",
      monthPlaceholder: "Оберіть місяць",
      weekPlaceholder: "Оберіть тиждень",
      rangePlaceholder: ["Початкова дата", "Кінцева дата"],
      rangeYearPlaceholder: ["Початковий рік", "Рік закінчення"],
      rangeMonthPlaceholder: ["Початковий місяць", "Кінцевий місяць"],
      rangeWeekPlaceholder: ["Початковий тиждень", "Кінцевий тиждень"],
      locale: "uk_UA",
      today: "Сьогодні",
      now: "Зараз",
      backToToday: "Поточна дата",
      ok: "Ok",
      clear: "Очистити",
      month: "Місяць",
      year: "Рік",
      timeSelect: "Обрати час",
      dateSelect: "Обрати дату",
      monthSelect: "Обрати місяць",
      yearSelect: "Обрати рік",
      decadeSelect: "Обрати десятиріччя",
      yearFormat: "YYYY",
      dateFormat: "D-M-YYYY",
      dayFormat: "D",
      dateTimeFormat: "D-M-YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Попередній місяць (PageUp)",
      nextMonth: "Наступний місяць (PageDown)",
      previousYear: "Попередній рік (Control + left)",
      nextYear: "Наступний рік (Control + right)",
      previousDecade: "Попереднє десятиріччя",
      nextDecade: "Наступне десятиріччя",
      previousCentury: "Попереднє століття",
      nextCentury: "Наступне століття"
    },
    timePickerLocale: {
      placeholder: "Оберіть час",
      rangePlaceholder: ["Час початку", "Час закінчення"]
    }
  },
  TimePicker: {
    placeholder: "Оберіть час",
    rangePlaceholder: ["Час початку", "Час закінчення"]
  },
  Calendar: {
    lang: {
      placeholder: "Оберіть дату",
      rangePlaceholder: ["Початкова дата", "Кінцева дата"],
      locale: "uk_UA",
      today: "Сьогодні",
      now: "Зараз",
      backToToday: "Поточна дата",
      ok: "Ok",
      clear: "Очистити",
      month: "Місяць",
      year: "Рік",
      timeSelect: "Обрати час",
      dateSelect: "Обрати дату",
      monthSelect: "Обрати місяць",
      yearSelect: "Обрати рік",
      decadeSelect: "Обрати десятиріччя",
      yearFormat: "YYYY",
      dateFormat: "D-M-YYYY",
      dayFormat: "D",
      dateTimeFormat: "D-M-YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Попередній місяць (PageUp)",
      nextMonth: "Наступний місяць (PageDown)",
      previousYear: "Попередній рік (Control + left)",
      nextYear: "Наступний рік (Control + right)",
      previousDecade: "Попереднє десятиріччя",
      nextDecade: "Наступне десятиріччя",
      previousCentury: "Попереднє століття",
      nextCentury: "Наступне століття"
    },
    timePickerLocale: {
      placeholder: "Оберіть час"
    }
  },
  Table: {
    filterTitle: "Фільтрувати",
    filterConfirm: "OK",
    filterReset: "Скинути",
    selectAll: "Обрати всі",
    selectInvert: "Інвертувати вибір"
  },
  Modal: {
    okText: "Гаразд",
    cancelText: "Скасувати",
    justOkText: "Гаразд"
  },
  Popconfirm: {
    okText: "Гаразд",
    cancelText: "Скасувати"
  },
  Transfer: {
    searchPlaceholder: "Введіть текст для пошуку",
    itemUnit: "елем.",
    itemsUnit: "елем."
  },
  Upload: {
    uploading: "Завантаження ...",
    removeFile: "Видалити файл",
    uploadError: "Помилка завантаження",
    previewFile: "Попередній перегляд файлу",
    downloadFile: "Завантажити файл"
  },
  Empty: {
    description: "Даних немає"
  },
  Icon: {
    icon: "іконка"
  },
  Text: {
    edit: "Редагувати",
    copy: "Копіювати",
    copied: "Скопійовано",
    expand: "Розгорнути"
  },
  PageHeader: {
    back: "Назад"
  }
};
var ur_PK = {
  locale: "ur",
  Pagination: {
    items_per_page: "/ صفحہ",
    jump_to: "پاس جاؤ",
    jump_to_confirm: "تصدیق کریں",
    page: "",
    prev_page: "پچھلا صفحہ",
    next_page: "اگلا صفحہ",
    prev_5: "پچھلے 5 صفحات",
    next_5: "اگلے 5 صفحات",
    prev_3: "پچھلے 3 صفحات",
    next_3: "اگلے 3 صفحات",
    page_size: "Page Size"
  },
  DatePicker: {
    lang: {
      placeholder: "تاریخ منتخب کریں",
      yearPlaceholder: "سال کو منتخب کریں",
      quarterPlaceholder: "کوارٹر منتخب کریں",
      monthPlaceholder: "ماہ منتخب کریں",
      weekPlaceholder: "ہفتہ منتخب کریں",
      rangePlaceholder: ["شروع کرنے کی تاریخ", "آخری تاریخ"],
      rangeYearPlaceholder: ["آغاز سال", "آخر سال"],
      rangeMonthPlaceholder: ["مہینہ شروع", "اختتامی مہینہ"],
      rangeWeekPlaceholder: ["ہفتے شروع کریں", "اختتام ہفتہ"],
      locale: "ur_PK",
      today: "آج",
      now: "ابھی",
      backToToday: "آج واپس",
      ok: "ٹھیک ہے",
      clear: "صاف",
      month: "مہینہ",
      year: "سال",
      timeSelect: "وقت منتخب کریں",
      dateSelect: "تاریخ منتخب کریں",
      weekSelect: "ایک ہفتہ کا انتخاب کریں",
      monthSelect: "ایک مہینہ کا انتخاب کریں",
      yearSelect: "ایک سال کا انتخاب کریں",
      decadeSelect: "ایک دہائی کا انتخاب کریں",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "پچھلے مہینے (PageUp)",
      nextMonth: "اگلے مہینے (PageDown)",
      previousYear: "گزشتہ سال (Control + left)",
      nextYear: "اگلے سال (Control + right)",
      previousDecade: "پچھلی دہائی",
      nextDecade: "اگلی دہائی",
      previousCentury: "پچھلی صدی",
      nextCentury: "اگلی صدی"
    },
    timePickerLocale: {
      placeholder: "وقت منتخب کریں",
      rangePlaceholder: ["وقت منتخب کریں", "آخر وقت"]
    }
  },
  TimePicker: {
    placeholder: "وقت منتخب کریں",
    rangePlaceholder: ["وقت منتخب کریں", "آخر وقت"]
  },
  Calendar: {
    lang: {
      placeholder: "تاریخ منتخب کریں",
      yearPlaceholder: "سال کو منتخب کریں",
      quarterPlaceholder: "کوارٹر منتخب کریں",
      monthPlaceholder: "ماہ منتخب کریں",
      weekPlaceholder: "ہفتہ منتخب کریں",
      rangePlaceholder: ["شروع کرنے کی تاریخ", "آخری تاریخ"],
      rangeYearPlaceholder: ["آغاز سال", "آخر سال"],
      rangeMonthPlaceholder: ["مہینہ شروع", "اختتامی مہینہ"],
      rangeWeekPlaceholder: ["ہفتے شروع کریں", "اختتام ہفتہ"],
      locale: "ur_PK",
      today: "آج",
      now: "ابھی",
      backToToday: "آج واپس",
      ok: "ٹھیک ہے",
      clear: "صاف",
      month: "مہینہ",
      year: "سال",
      timeSelect: "وقت منتخب کریں",
      dateSelect: "تاریخ منتخب کریں",
      weekSelect: "ایک ہفتہ کا انتخاب کریں",
      monthSelect: "ایک مہینہ کا انتخاب کریں",
      yearSelect: "ایک سال کا انتخاب کریں",
      decadeSelect: "ایک دہائی کا انتخاب کریں",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "پچھلے مہینے (PageUp)",
      nextMonth: "اگلے مہینے (PageDown)",
      previousYear: "گزشتہ سال (Control + left)",
      nextYear: "اگلے سال (Control + right)",
      previousDecade: "پچھلی دہائی",
      nextDecade: "اگلی دہائی",
      previousCentury: "پچھلی صدی",
      nextCentury: "اگلی صدی"
    },
    timePickerLocale: {
      placeholder: "وقت منتخب کریں",
      rangePlaceholder: ["وقت منتخب کریں", "آخر وقت"]
    }
  },
  global: {
    placeholder: "منتخب کریں"
  },
  Table: {
    filterTitle: "فلٹر مینو",
    filterConfirm: "ٹھیک ہے",
    filterReset: "ری سیٹ کریں",
    filterEmptyText: "فلٹرز نہیں",
    emptyText: "کوئی ڈیٹا نہیں",
    selectAll: "موجودہ صفحہ منتخب کریں",
    selectInvert: "موجودہ صفحے کو الٹ دیں",
    selectNone: "تمام ڈیٹا صاف کریں",
    selectionAll: "تمام ڈیٹا کو منتخب کریں",
    sortTitle: "ترتیب دیں",
    expand: "پھیلائیں",
    collapse: "سمیٹیں",
    triggerDesc: "نزولی کو ترتیب دینے کیلئے کلک کریں",
    triggerAsc: "چڑھنے کو ترتیب دینے کیلئے کلک کریں",
    cancelSort: "ترتیب کو منسوخ کرنے کیلئے دبائیں"
  },
  Modal: {
    okText: "ٹھیک ہے",
    cancelText: "منسوخ کریں",
    justOkText: "ٹھیک ہے"
  },
  Popconfirm: {
    okText: "ٹھیک ہے",
    cancelText: "منسوخ کریں"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "یہاں تلاش کریں",
    itemUnit: "شے",
    itemsUnit: "اشیاء",
    remove: "ہٹائیں",
    selectCurrent: "موجودہ صفحہ منتخب کریں",
    removeCurrent: "موجودہ صفحہ ہٹائیں",
    selectAll: "تمام ڈیٹا کو منتخب کریں",
    removeAll: "تمام ڈیٹا کو ہٹا دیں",
    selectInvert: "موجودہ صفحے کو الٹ دیں"
  },
  Upload: {
    uploading: "اپ لوڈ ہو رہا ہے…",
    removeFile: "فائل کو ہٹا دیں",
    uploadError: "اپ لوڈ کی خرابی",
    previewFile: "پیش نظار فائل",
    downloadFile: "فائل ڈاؤن لوڈ کریں"
  },
  Empty: {
    description: "کوئی ڈیٹا نہیں"
  },
  Icon: {
    icon: "آئیکن"
  },
  Text: {
    edit: "ترمیم",
    copy: "کاپی",
    copied: "کاپی ہوگیا",
    expand: "پھیلائیں"
  },
  PageHeader: {
    back: "پیچھے"
  },
  Image: {
    preview: "پیش نظارہ"
  }
};
var vi_VN = {
  locale: "vi",
  Pagination: {
    items_per_page: "/ trang",
    jump_to: "Đến",
    jump_to_confirm: "xác nhận",
    page: "Trang",
    prev_page: "Trang Trước",
    next_page: "Trang Kế",
    prev_5: "Về 5 Trang Trước",
    next_5: "Đến 5 Trang Kế",
    prev_3: "Về 3 Trang Trước",
    next_3: "Đến 3 Trang Kế",
    page_size: "kích thước trang"
  },
  DatePicker: {
    lang: {
      placeholder: "Chọn thời điểm",
      yearPlaceholder: "Chọn năm",
      quarterPlaceholder: "Chọn quý",
      monthPlaceholder: "Chọn tháng",
      weekPlaceholder: "Chọn tuần",
      rangePlaceholder: ["Ngày bắt đầu", "Ngày kết thúc"],
      rangeYearPlaceholder: ["Năm bắt đầu", "Năm kết thúc"],
      rangeMonthPlaceholder: ["Tháng bắt đầu", "Tháng kết thúc"],
      rangeWeekPlaceholder: ["Tuần bắt đầu", "Tuần kết thúc"],
      locale: "vi_VN",
      today: "Hôm nay",
      now: "Bây giờ",
      backToToday: "Trở về hôm nay",
      ok: "Ok",
      clear: "Xóa",
      month: "Tháng",
      year: "Năm",
      timeSelect: "Chọn thời gian",
      dateSelect: "Chọn ngày",
      weekSelect: "Chọn tuần",
      monthSelect: "Chọn tháng",
      yearSelect: "Chọn năm",
      decadeSelect: "Chọn thập kỷ",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Tháng trước (PageUp)",
      nextMonth: "Tháng sau (PageDown)",
      previousYear: "Năm trước (Control + left)",
      nextYear: "Năm sau (Control + right)",
      previousDecade: "Thập kỷ trước",
      nextDecade: "Thập kỷ sau",
      previousCentury: "Thế kỷ trước",
      nextCentury: "Thế kỷ sau"
    },
    timePickerLocale: {
      placeholder: "Chọn thời gian"
    }
  },
  TimePicker: {
    placeholder: "Chọn thời gian"
  },
  Calendar: {
    lang: {
      placeholder: "Chọn thời điểm",
      yearPlaceholder: "Chọn năm",
      quarterPlaceholder: "Chọn quý",
      monthPlaceholder: "Chọn tháng",
      weekPlaceholder: "Chọn tuần",
      rangePlaceholder: ["Ngày bắt đầu", "Ngày kết thúc"],
      rangeYearPlaceholder: ["Năm bắt đầu", "Năm kết thúc"],
      rangeMonthPlaceholder: ["Tháng bắt đầu", "Tháng kết thúc"],
      rangeWeekPlaceholder: ["Tuần bắt đầu", "Tuần kết thúc"],
      locale: "vi_VN",
      today: "Hôm nay",
      now: "Bây giờ",
      backToToday: "Trở về hôm nay",
      ok: "Ok",
      clear: "Xóa",
      month: "Tháng",
      year: "Năm",
      timeSelect: "Chọn thời gian",
      dateSelect: "Chọn ngày",
      weekSelect: "Chọn tuần",
      monthSelect: "Chọn tháng",
      yearSelect: "Chọn năm",
      decadeSelect: "Chọn thập kỷ",
      yearFormat: "YYYY",
      dateFormat: "D/M/YYYY",
      dayFormat: "D",
      dateTimeFormat: "D/M/YYYY HH:mm:ss",
      monthBeforeYear: true,
      previousMonth: "Tháng trước (PageUp)",
      nextMonth: "Tháng sau (PageDown)",
      previousYear: "Năm trước (Control + left)",
      nextYear: "Năm sau (Control + right)",
      previousDecade: "Thập kỷ trước",
      nextDecade: "Thập kỷ sau",
      previousCentury: "Thế kỷ trước",
      nextCentury: "Thế kỷ sau"
    },
    timePickerLocale: {
      placeholder: "Chọn thời gian"
    }
  },
  Table: {
    filterTitle: "Bộ ",
    filterConfirm: "OK",
    filterReset: "Tạo Lại",
    selectAll: "Chọn Tất Cả",
    selectInvert: "Chọn Ngược Lại"
  },
  Modal: {
    okText: "OK",
    cancelText: "Huỷ",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Huỷ"
  },
  Transfer: {
    searchPlaceholder: "Tìm ở đây",
    itemUnit: "mục",
    itemsUnit: "mục"
  },
  Upload: {
    uploading: "Đang tải lên...",
    removeFile: "Gỡ bỏ tập tin",
    uploadError: "Lỗi tải lên",
    previewFile: "Xem thử tập tin",
    downloadFile: "Tải tập tin"
  },
  Empty: {
    description: "Trống"
  }
};
var zh_HK = {
  locale: "zh-hk",
  Pagination: {
    items_per_page: "條/頁",
    jump_to: "跳至",
    jump_to_confirm: "確定",
    page: "頁",
    prev_page: "上一頁",
    next_page: "下一頁",
    prev_5: "向前 5 頁",
    next_5: "向後 5 頁",
    prev_3: "向前 3 頁",
    next_3: "向後 3 頁",
    page_size: "頁碼"
  },
  DatePicker: {
    lang: {
      placeholder: "請選擇日期",
      rangePlaceholder: ["開始日期", "結束日期"],
      locale: "zh_TW",
      today: "今天",
      now: "此刻",
      backToToday: "返回今天",
      ok: "確定",
      timeSelect: "選擇時間",
      dateSelect: "選擇日期",
      weekSelect: "選擇周",
      clear: "清除",
      month: "月",
      year: "年",
      previousMonth: "上個月 (翻頁上鍵)",
      nextMonth: "下個月 (翻頁下鍵)",
      monthSelect: "選擇月份",
      yearSelect: "選擇年份",
      decadeSelect: "選擇年代",
      yearFormat: "YYYY年",
      dayFormat: "D日",
      dateFormat: "YYYY年M月D日",
      dateTimeFormat: "YYYY年M月D日 HH時mm分ss秒",
      previousYear: "上一年 (Control鍵加左方向鍵)",
      nextYear: "下一年 (Control鍵加右方向鍵)",
      previousDecade: "上一年代",
      nextDecade: "下一年代",
      previousCentury: "上一世紀",
      nextCentury: "下一世紀",
      yearPlaceholder: "請選擇年份",
      quarterPlaceholder: "請選擇季度",
      monthPlaceholder: "請選擇月份",
      weekPlaceholder: "請選擇周",
      rangeYearPlaceholder: ["開始年份", "結束年份"],
      rangeMonthPlaceholder: ["開始月份", "結束月份"],
      rangeWeekPlaceholder: ["開始周", "結束周"]
    },
    timePickerLocale: {
      placeholder: "請選擇時間"
    }
  },
  TimePicker: {
    placeholder: "請選擇時間"
  },
  Calendar: {
    lang: {
      placeholder: "請選擇日期",
      rangePlaceholder: ["開始日期", "結束日期"],
      locale: "zh_TW",
      today: "今天",
      now: "此刻",
      backToToday: "返回今天",
      ok: "確定",
      timeSelect: "選擇時間",
      dateSelect: "選擇日期",
      weekSelect: "選擇周",
      clear: "清除",
      month: "月",
      year: "年",
      previousMonth: "上個月 (翻頁上鍵)",
      nextMonth: "下個月 (翻頁下鍵)",
      monthSelect: "選擇月份",
      yearSelect: "選擇年份",
      decadeSelect: "選擇年代",
      yearFormat: "YYYY年",
      dayFormat: "D日",
      dateFormat: "YYYY年M月D日",
      dateTimeFormat: "YYYY年M月D日 HH時mm分ss秒",
      previousYear: "上一年 (Control鍵加左方向鍵)",
      nextYear: "下一年 (Control鍵加右方向鍵)",
      previousDecade: "上一年代",
      nextDecade: "下一年代",
      previousCentury: "上一世紀",
      nextCentury: "下一世紀",
      yearPlaceholder: "請選擇年份",
      quarterPlaceholder: "請選擇季度",
      monthPlaceholder: "請選擇月份",
      weekPlaceholder: "請選擇周",
      rangeYearPlaceholder: ["開始年份", "結束年份"],
      rangeMonthPlaceholder: ["開始月份", "結束月份"],
      rangeWeekPlaceholder: ["開始周", "結束周"]
    },
    timePickerLocale: {
      placeholder: "請選擇時間"
    }
  },
  global: {
    placeholder: "請選擇"
  },
  Table: {
    filterTitle: "篩選器",
    filterConfirm: "確定",
    filterReset: "重置",
    filterEmptyText: "無篩選項",
    selectAll: "全部選取",
    selectInvert: "反向選取",
    selectionAll: "全選所有",
    sortTitle: "排序",
    expand: "展開行",
    collapse: "關閉行",
    triggerDesc: "點擊降序",
    triggerAsc: "點擊升序",
    cancelSort: "取消排序",
    selectNone: "清空所有"
  },
  Modal: {
    okText: "確定",
    cancelText: "取消",
    justOkText: "知道了"
  },
  Popconfirm: {
    okText: "確定",
    cancelText: "取消"
  },
  Transfer: {
    searchPlaceholder: "搜尋資料",
    itemUnit: "項目",
    itemsUnit: "項目",
    remove: "刪除",
    selectCurrent: "全選當頁",
    removeCurrent: "刪除當頁",
    selectAll: "全選所有",
    removeAll: "刪除全部",
    selectInvert: "反選當頁"
  },
  Upload: {
    uploading: "正在上傳...",
    removeFile: "刪除檔案",
    uploadError: "上傳失敗",
    previewFile: "檔案預覽",
    downloadFile: "下载文件"
  },
  Empty: {
    description: "無此資料"
  },
  Icon: {
    icon: "圖標"
  },
  Text: {
    edit: "編輯",
    copy: "複製",
    copied: "複製成功",
    expand: "展開"
  },
  PageHeader: {
    back: "返回"
  },
  Image: {
    preview: "預覽"
  }
};
var zh_TW = {
  locale: "zh-tw",
  Pagination: {
    items_per_page: "條/頁",
    jump_to: "跳至",
    jump_to_confirm: "確定",
    page: "頁",
    prev_page: "上一頁",
    next_page: "下一頁",
    prev_5: "向前 5 頁",
    next_5: "向後 5 頁",
    prev_3: "向前 3 頁",
    next_3: "向後 3 頁",
    page_size: "頁碼"
  },
  DatePicker: {
    lang: {
      placeholder: "請選擇日期",
      rangePlaceholder: ["開始日期", "結束日期"],
      locale: "zh_TW",
      today: "今天",
      now: "此刻",
      backToToday: "返回今天",
      ok: "確定",
      timeSelect: "選擇時間",
      dateSelect: "選擇日期",
      weekSelect: "選擇周",
      clear: "清除",
      month: "月",
      year: "年",
      previousMonth: "上個月 (翻頁上鍵)",
      nextMonth: "下個月 (翻頁下鍵)",
      monthSelect: "選擇月份",
      yearSelect: "選擇年份",
      decadeSelect: "選擇年代",
      yearFormat: "YYYY年",
      dayFormat: "D日",
      dateFormat: "YYYY年M月D日",
      dateTimeFormat: "YYYY年M月D日 HH時mm分ss秒",
      previousYear: "上一年 (Control鍵加左方向鍵)",
      nextYear: "下一年 (Control鍵加右方向鍵)",
      previousDecade: "上一年代",
      nextDecade: "下一年代",
      previousCentury: "上一世紀",
      nextCentury: "下一世紀",
      yearPlaceholder: "請選擇年份",
      quarterPlaceholder: "請選擇季度",
      monthPlaceholder: "請選擇月份",
      weekPlaceholder: "請選擇周",
      rangeYearPlaceholder: ["開始年份", "結束年份"],
      rangeMonthPlaceholder: ["開始月份", "結束月份"],
      rangeWeekPlaceholder: ["開始周", "結束周"]
    },
    timePickerLocale: {
      placeholder: "請選擇時間"
    }
  },
  TimePicker: {
    placeholder: "請選擇時間"
  },
  Calendar: {
    lang: {
      placeholder: "請選擇日期",
      rangePlaceholder: ["開始日期", "結束日期"],
      locale: "zh_TW",
      today: "今天",
      now: "此刻",
      backToToday: "返回今天",
      ok: "確定",
      timeSelect: "選擇時間",
      dateSelect: "選擇日期",
      weekSelect: "選擇周",
      clear: "清除",
      month: "月",
      year: "年",
      previousMonth: "上個月 (翻頁上鍵)",
      nextMonth: "下個月 (翻頁下鍵)",
      monthSelect: "選擇月份",
      yearSelect: "選擇年份",
      decadeSelect: "選擇年代",
      yearFormat: "YYYY年",
      dayFormat: "D日",
      dateFormat: "YYYY年M月D日",
      dateTimeFormat: "YYYY年M月D日 HH時mm分ss秒",
      previousYear: "上一年 (Control鍵加左方向鍵)",
      nextYear: "下一年 (Control鍵加右方向鍵)",
      previousDecade: "上一年代",
      nextDecade: "下一年代",
      previousCentury: "上一世紀",
      nextCentury: "下一世紀",
      yearPlaceholder: "請選擇年份",
      quarterPlaceholder: "請選擇季度",
      monthPlaceholder: "請選擇月份",
      weekPlaceholder: "請選擇周",
      rangeYearPlaceholder: ["開始年份", "結束年份"],
      rangeMonthPlaceholder: ["開始月份", "結束月份"],
      rangeWeekPlaceholder: ["開始周", "結束周"]
    },
    timePickerLocale: {
      placeholder: "請選擇時間"
    }
  },
  global: {
    placeholder: "請選擇"
  },
  Table: {
    filterTitle: "篩選器",
    filterConfirm: "確定",
    filterReset: "重置",
    filterEmptyText: "無篩選項",
    selectAll: "全部選取",
    selectInvert: "反向選取",
    selectionAll: "全選所有",
    sortTitle: "排序",
    expand: "展開行",
    collapse: "關閉行",
    triggerDesc: "點擊降序",
    triggerAsc: "點擊升序",
    cancelSort: "取消排序",
    selectNone: "清空所有"
  },
  Modal: {
    okText: "確定",
    cancelText: "取消",
    justOkText: "知道了"
  },
  Popconfirm: {
    okText: "確定",
    cancelText: "取消"
  },
  Transfer: {
    searchPlaceholder: "搜尋資料",
    itemUnit: "項目",
    itemsUnit: "項目",
    remove: "删除",
    selectCurrent: "全選當頁",
    removeCurrent: "删除當頁",
    selectAll: "全選所有",
    removeAll: "删除全部",
    selectInvert: "反選當頁"
  },
  Upload: {
    uploading: "正在上傳...",
    removeFile: "刪除檔案",
    uploadError: "上傳失敗",
    previewFile: "檔案預覽",
    downloadFile: "下載文件"
  },
  Empty: {
    description: "無此資料"
  },
  Icon: {
    icon: "圖標"
  },
  Text: {
    edit: "編輯",
    copy: "複製",
    copied: "複製成功",
    expand: "展開"
  },
  PageHeader: {
    back: "返回"
  },
  Image: {
    preview: "預覽"
  }
};
export {
  DATE_HELPER_SERVICE_FACTORY,
  DateHelperByDateFns,
  DateHelperByDatePipe,
  DateHelperService,
  NZ_DATE_CONFIG,
  NZ_DATE_CONFIG_DEFAULT,
  NZ_DATE_LOCALE,
  NZ_I18N,
  NzI18nModule,
  NzI18nPipe,
  NzI18nService,
  ar_EG,
  az_AZ,
  bg_BG,
  bn_BD,
  by_BY,
  ca_ES,
  cs_CZ,
  da_DK,
  de_DE,
  el_GR,
  en_GB,
  en_US,
  es_ES,
  et_EE,
  fa_IR,
  fi_FI,
  fr_BE,
  fr_CA,
  fr_FR,
  ga_IE,
  gl_ES,
  he_IL,
  hi_IN,
  hr_HR,
  hu_HU,
  hy_AM,
  id_ID,
  is_IS,
  it_IT,
  ja_JP,
  ka_GE,
  kk_KZ,
  km_KH,
  kmr_IQ,
  kn_IN,
  ko_KR,
  ku_IQ,
  lt_LT,
  lv_LV,
  mergeDateConfig,
  mk_MK,
  ml_IN,
  mn_MN,
  ms_MY,
  nb_NO,
  ne_NP,
  nl_BE,
  nl_NL,
  pl_PL,
  provideNzI18n,
  pt_BR,
  pt_PT,
  ro_RO,
  ru_RU,
  sk_SK,
  sl_SI,
  sr_RS,
  sv_SE,
  ta_IN,
  th_TH,
  tr_TR,
  uk_UA,
  ur_PK,
  vi_VN,
  zh_CN,
  zh_HK,
  zh_TW
};
//# sourceMappingURL=ng-zorro-antd_i18n.js.map
