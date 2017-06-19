/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = expandUrlRange;
// @TODO Padded ranges
// @TODO decrement
// @TODO alpha ranges
// @TODO steps


var concat = function concat(x, y) {
    return x.concat(y);
};
var fmap = function fmap(f, xs) {
    return xs.map(f).reduce(concat, []);
};

Array.prototype.fmap = function (f) {
    return fmap(f, this);
};

var arrayRange = function arrayRange(from, to) {
    return new Array(to - from + 1).fill(0).map(function (_, i) {
        return parseInt(from) + i;
    });
};

function expandUrlRange(pattern) {
    // detect braces
    // https://regex101.com/r/NUZ0mY/2
    var bracesRegex = /\{([^\}]*?)\}/;
    var bracesMatch = bracesRegex.exec(pattern);
    if (bracesMatch) {
        var vals = bracesMatch[1].split(',');
        return vals.map(function (v) {
            return pattern.replace(bracesRegex, v);
        }).fmap(function (s) {
            return expandUrlRange(s);
        });
    }

    // https://regex101.com/r/NUZ0mY/3
    var bracketsRegex = /\[(\d+)\.\.(\d+)\]/;
    var bracketsMatch = bracketsRegex.exec(pattern);
    if (bracketsMatch) {
        var from = bracketsMatch[1],
            to = bracketsMatch[2];

        return arrayRange(from, to).map(function (v) {
            return pattern.replace(bracketsRegex, v);
        }).fmap(function (s) {
            return expandUrlRange(s);
        });
    }

    return [pattern];
}

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _expandUrlRange = __webpack_require__(10);

var _expandUrlRange2 = _interopRequireDefault(_expandUrlRange);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SequencePlayer = function SequencePlayer(el, range) {
    _classCallCheck(this, SequencePlayer);

    this._images = (0, _expandUrlRange2.default)(range);

    console.log(this._images);
};

window.SequencePlayer = SequencePlayer;

/***/ })

/******/ });