"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialValidators = initialValidators;
exports.initialAsyncValidators = initialAsyncValidators;
exports.initialMask = initialMask;
exports.initialParse = initialParse;
function initialValidators(schema) {
    var validators = {};
    for (var _i = 0, _a = Object.entries(schema); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], controlSchema = _b[1];
        validators[key] = [];
        if (controlSchema.validators) {
            validators[key] = controlSchema.validators;
        }
    }
    return validators;
}
function initialAsyncValidators(schema) {
    var validators = {};
    for (var _i = 0, _a = Object.entries(schema); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], controlSchema = _b[1];
        validators[key] = [];
        if (controlSchema.asyncValidators) {
            validators[key] = controlSchema.asyncValidators;
        }
    }
    return validators;
}
function initialMask(schema) {
    var mask = {};
    for (var _i = 0, _a = Object.entries(schema); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], controlSchema = _b[1];
        mask[key] = controlSchema.mask || null;
    }
    return mask;
}
function initialParse(schema) {
    var parse = {};
    for (var _i = 0, _a = Object.entries(schema); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], controlSchema = _b[1];
        parse[key] = controlSchema.parse || null;
    }
    return parse;
}
