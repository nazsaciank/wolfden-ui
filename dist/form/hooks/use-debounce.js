"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebounce = useDebounce;
exports.useDebounceMap = useDebounceMap;
var react_1 = require("react");
function useDebounce(delay) {
    var timer = (0, react_1.useRef)();
    return function (fn) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (timer.current)
            clearTimeout(timer.current);
        timer.current = setTimeout(function () {
            fn.apply(void 0, args);
        }, delay);
    };
}
function useDebounceMap(delay) {
    var timers = (0, react_1.useRef)({});
    return function (key, fn) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (timers.current[key])
            clearTimeout(timers.current[key]);
        timers.current[key] = setTimeout(function () {
            fn.apply(void 0, args);
        }, delay);
    };
}
