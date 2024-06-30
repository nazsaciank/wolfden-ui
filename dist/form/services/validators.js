"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validators = void 0;
var Validators = /** @class */ (function () {
    function Validators() {
    }
    Validators.required = function (value) {
        if (value === undefined)
            return { required: true };
        if (value === null)
            return { required: true };
        if (value === "")
            return { required: true };
        return null;
    };
    Validators.email = function (value) {
        if (!value)
            return null;
        if (typeof value !== "string")
            return { email: true };
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
            return { email: true };
        return null;
    };
    Validators.delay = function (ms) {
        return function delayFn(value) {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve(Validators.required(value));
                }, ms);
            });
        };
    };
    return Validators;
}());
exports.Validators = Validators;
