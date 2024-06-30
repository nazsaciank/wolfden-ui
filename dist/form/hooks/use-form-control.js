"use strict";
"use client";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormControl = useFormControl;
var react_1 = require("react");
var use_form_context_1 = require("./use-form-context");
var use_debounce_1 = require("./use-debounce");
var reducers_1 = require("../services/reducers");
var initial_state_1 = require("../services/initial-state");
function useFormControl(name, schema) {
    var initialState = (0, react_1.useRef)((0, initial_state_1.initialControlState)(name, schema));
    var _a = (0, react_1.useReducer)(reducers_1.formControl, initialState.current), data = _a[0], dispatch = _a[1];
    var debounce = (0, use_debounce_1.useDebounce)(500);
    var validatorsRef = (0, react_1.useRef)(schema.validators || []);
    var asyncValidatorsRef = (0, react_1.useRef)(schema.asyncValidators || []);
    var maskRef = (0, react_1.useRef)(schema.mask || null);
    var parseRef = (0, react_1.useRef)(schema.parse || null);
    var control = (0, use_form_context_1.useFormContext)(name);
    (0, react_1.useEffect)(function () {
        if (control)
            return;
        asyncValidate();
    }, []);
    if (control)
        return control;
    function setValue(value) {
        var masked = "";
        if (maskRef.current && typeof value === "string") {
            for (var i = 0; i < value.length; i++) {
                var character = value[i];
                masked += maskRef.current(character, i, value);
            }
        }
        var parsed = parseRef.current ? parseRef.current(masked) : value;
        dispatch({ value: value, masked: masked, parsed: parsed });
        if (!data.isDirty)
            markAsDirty();
        validate(parsed);
        asyncValidate(parsed);
    }
    function reset() {
        dispatch(__assign({}, initialState.current));
    }
    function validate(value) {
        if (value === void 0) { value = data.value; }
        var error = null;
        for (var _i = 0, _a = validatorsRef.current; _i < _a.length; _i++) {
            var validator = _a[_i];
            var result = validator(value);
            if (!result)
                continue;
            error = result;
            break;
        }
        dispatch({ error: error, status: error ? "INVALID" : "VALID" });
    }
    function asyncValidate(value) {
        var _this = this;
        if (value === void 0) { value = data.value; }
        if (asyncValidatorsRef.current.length === 0)
            return;
        if (data.error)
            return;
        dispatch({ status: "PENDING" });
        return debounce(function () { return __awaiter(_this, void 0, void 0, function () {
            var error, _i, _a, validator, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        error = null;
                        _i = 0, _a = asyncValidatorsRef.current;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        validator = _a[_i];
                        return [4 /*yield*/, validator(value)];
                    case 2:
                        result = _b.sent();
                        if (!result)
                            return [3 /*break*/, 3];
                        error = result;
                        return [3 /*break*/, 4];
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        dispatch({ error: error, status: error ? "INVALID" : "VALID" });
                        return [2 /*return*/];
                }
            });
        }); });
    }
    function markAsPristine() {
        dispatch({ isDirty: false });
    }
    function markAsDirty() {
        dispatch({ isDirty: true });
    }
    function markAsTouched() {
        dispatch({ isTouched: true });
    }
    function markAsUntouched() {
        dispatch({ isTouched: false });
    }
    function disable() {
        dispatch({ isDisabled: true });
    }
    function enable() {
        dispatch({ isDisabled: false });
    }
    function setError(errors) {
        dispatch({ error: errors, status: errors ? "INVALID" : "VALID" });
    }
    function setValidators(validators, emitSelf) {
        if (emitSelf === void 0) { emitSelf = true; }
        validatorsRef.current = validators;
        if (emitSelf)
            validate();
    }
    function setMask(mask, emitSelf) {
        if (emitSelf === void 0) { emitSelf = true; }
        maskRef.current = mask;
        if (emitSelf)
            setValue(data.value);
    }
    function setParse(parse, emitSelf) {
        if (emitSelf === void 0) { emitSelf = true; }
        parseRef.current = parse;
        if (emitSelf)
            setValue(data.value);
    }
    return __assign(__assign({}, data), { isValid: data.status === "VALID", isInvalid: data.status === "INVALID", isPending: data.status === "PENDING", setValue: setValue, reset: reset, validate: function () { return validate(); }, asyncValidate: function () { return asyncValidate(); }, markAsPristine: markAsPristine, markAsDirty: markAsDirty, markAsTouched: markAsTouched, markAsUntouched: markAsUntouched, disable: disable, enable: enable, setError: setError, setValidators: setValidators, setMask: setMask, setParse: setParse });
}
