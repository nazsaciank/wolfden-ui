"use strict";
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
exports.useFormGroup = useFormGroup;
var react_1 = require("react");
var reducers_1 = require("../services/reducers");
var initial_state_1 = require("../services/initial-state");
var initial_functions_1 = require("../services/initial-functions");
var use_debounce_1 = require("./use-debounce");
function useFormGroup(schema) {
    var initialState = (0, react_1.useRef)((0, initial_state_1.initialGroupState)(schema));
    var _a = (0, react_1.useReducer)(reducers_1.formGroup, initialState.current), data = _a[0], dispatch = _a[1];
    var debounce = (0, use_debounce_1.useDebounceMap)(500);
    var validatorsRef = (0, react_1.useRef)((0, initial_functions_1.initialValidators)(schema));
    var asyncValidatorsRef = (0, react_1.useRef)((0, initial_functions_1.initialAsyncValidators)(schema));
    var maskRef = (0, react_1.useRef)((0, initial_functions_1.initialMask)(schema));
    var parseRef = (0, react_1.useRef)((0, initial_functions_1.initialParse)(schema));
    var values = (0, react_1.useMemo)(function () {
        var values = {};
        for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], control = _b[1];
            values[key] = control.value;
        }
        return values;
    }, [data]);
    var status = (0, react_1.useMemo)(function () {
        var status = "VALID";
        for (var _i = 0, _a = Object.values(data); _i < _a.length; _i++) {
            var control = _a[_i];
            if (control.status === "INVALID") {
                status = "INVALID";
                break;
            }
            if (control.status === "PENDING") {
                status = "PENDING";
                break;
            }
        }
        return status;
    }, [data]);
    var errors = (0, react_1.useMemo)(function () {
        var errors = {};
        for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], control = _b[1];
            if (control.error)
                errors[key] = control.error;
        }
        return errors;
    }, [data]);
    function get(path) {
        var control = data[path];
        if (!control)
            return null;
        var validators = validatorsRef.current[path];
        var asyncValidators = asyncValidatorsRef.current[path];
        var mask = maskRef.current[path];
        var parse = parseRef.current[path];
        function setValue(value) {
            var masked = "";
            if (mask && typeof value === "string") {
                for (var i = 0; i < value.length; i++) {
                    var character = value[i];
                    masked += mask(character, i, value);
                }
            }
            var parsed = parse ? parse(value) : value;
            dispatch({ path: path, value: value, masked: masked, parsed: parsed });
            if (!control.isDirty)
                dispatch({ path: path, isDirty: true });
            validate(parsed);
            asyncValidate(parsed);
        }
        function reset() {
            dispatch(__assign({ path: path }, initialState.current[path]));
        }
        function validate(value) {
            if (value === void 0) { value = control.value; }
            var error = null;
            for (var _i = 0, validators_1 = validators; _i < validators_1.length; _i++) {
                var validator = validators_1[_i];
                var result = validator(value);
                if (!result)
                    continue;
                error = result;
                break;
            }
            dispatch({ path: path, error: error, status: error ? "INVALID" : "VALID" });
        }
        function asyncValidate(value) {
            var _this = this;
            if (value === void 0) { value = control.value; }
            if (asyncValidators.length === 0)
                return;
            if (control.error)
                return;
            dispatch({ path: path, status: "PENDING" });
            return debounce(path, function () { return __awaiter(_this, void 0, void 0, function () {
                var error, _i, asyncValidators_1, validator, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            error = null;
                            _i = 0, asyncValidators_1 = asyncValidators;
                            _a.label = 1;
                        case 1:
                            if (!(_i < asyncValidators_1.length)) return [3 /*break*/, 4];
                            validator = asyncValidators_1[_i];
                            return [4 /*yield*/, validator(value)];
                        case 2:
                            result = _a.sent();
                            if (!result)
                                return [3 /*break*/, 3];
                            error = result;
                            return [3 /*break*/, 4];
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            dispatch({ path: path, error: error, status: error ? "INVALID" : "VALID" });
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        function disable() {
            dispatch({ path: path, isDisabled: true });
        }
        function enable() {
            dispatch({ path: path, isDisabled: false });
        }
        function markAsPristine() {
            dispatch({ path: path, isDirty: false });
        }
        function markAsDirty() {
            dispatch({ path: path, isDirty: true });
        }
        function markAsTouched() {
            dispatch({ path: path, isTouched: true });
        }
        function markAsUntouched() {
            dispatch({ path: path, isTouched: false });
        }
        function setError(error, emitSelf) {
            dispatch({ path: path, error: error, status: error ? "INVALID" : "VALID" });
            if (emitSelf)
                validate();
        }
        function setValidators(validators, emitSelf) {
            var _a;
            validatorsRef.current = __assign(__assign({}, validatorsRef.current), (_a = {}, _a[path] = validators, _a));
            if (emitSelf)
                validate();
        }
        function setMask(mask, emitSelf) {
            var _a;
            maskRef.current = __assign(__assign({}, maskRef.current), (_a = {}, _a[path] = mask, _a));
            if (emitSelf)
                setValue(control.value);
        }
        function setParse(parse, emitSelf) {
            var _a;
            parseRef.current = __assign(__assign({}, parseRef.current), (_a = {}, _a[path] = parse, _a));
            if (emitSelf)
                setValue(control.value);
        }
        return __assign(__assign({}, control), { isValid: control.status === "VALID", isInvalid: control.status === "INVALID", isPending: control.status === "PENDING", setValue: setValue, reset: reset, validate: validate, asyncValidate: asyncValidate, disable: disable, enable: enable, markAsDirty: markAsDirty, markAsPristine: markAsPristine, markAsTouched: markAsTouched, markAsUntouched: markAsUntouched, setError: setError, setValidators: setValidators, setMask: setMask, setParse: setParse });
    }
    function setValue(value) {
        var newState = __assign({}, data);
        for (var _i = 0, _a = Object.entries(value); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], control = _b[1];
            var path = key;
            var current = newState[path];
            if (!current)
                continue;
            var validators = validatorsRef.current[path];
            var asyncValidators = asyncValidatorsRef.current[path];
            var mask = maskRef.current[path];
            var parse = parseRef.current[path];
            var masked = "";
            if (mask && typeof control === "string") {
                for (var i = 0; i < control.length; i++) {
                    var character = control[i];
                    masked += mask(character, i, control);
                }
            }
            var parsed = parse ? parse(control) : control;
            newState[path] = __assign(__assign({}, current), { value: control, masked: masked, parsed: parsed });
            if (!current.isDirty)
                newState[path] = __assign(__assign({}, newState[path]), { isDirty: true });
            validate(parsed, validators);
            asyncValidate(path, parsed, asyncValidators);
        }
        dispatch(newState);
    }
    function reset() {
        dispatch(initialState.current);
    }
    function addField(name, schema) {
        var _a, _b, _c, _d;
        var path = name;
        var control = (0, initial_state_1.initialControlState)(name, schema);
        dispatch(__assign({ path: path }, control));
        validatorsRef.current = __assign(__assign({}, validatorsRef.current), (_a = {}, _a[path] = schema.validators, _a));
        asyncValidatorsRef.current = __assign(__assign({}, asyncValidatorsRef.current), (_b = {}, _b[path] = schema.asyncValidators, _b));
        maskRef.current = __assign(__assign({}, maskRef.current), (_c = {}, _c[path] = schema.mask, _c));
        parseRef.current = __assign(__assign({}, parseRef.current), (_d = {}, _d[path] = schema.parse, _d));
    }
    function removeField(path) {
        var newState = __assign({}, data);
        delete newState[path];
        dispatch(newState);
        delete validatorsRef.current[path];
        delete asyncValidatorsRef.current[path];
        delete maskRef.current[path];
        delete parseRef.current[path];
    }
    function validate(value, validators) {
        var error = null;
        for (var _i = 0, validators_2 = validators; _i < validators_2.length; _i++) {
            var validator = validators_2[_i];
            var result = validator(value);
            if (!result)
                continue;
            error = result;
            break;
        }
        dispatch({ error: error, status: error ? "INVALID" : "VALID" });
    }
    function asyncValidate(path, value, asyncValidators) {
        var _this = this;
        if (asyncValidators.length === 0)
            return;
        if (data[path].error)
            return;
        dispatch({ path: path, status: "PENDING" });
        return debounce(path, function () { return __awaiter(_this, void 0, void 0, function () {
            var error, _i, asyncValidators_2, validator, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = null;
                        _i = 0, asyncValidators_2 = asyncValidators;
                        _a.label = 1;
                    case 1:
                        if (!(_i < asyncValidators_2.length)) return [3 /*break*/, 4];
                        validator = asyncValidators_2[_i];
                        return [4 /*yield*/, validator(value)];
                    case 2:
                        result = _a.sent();
                        if (!result)
                            return [3 /*break*/, 3];
                        error = result;
                        return [3 /*break*/, 4];
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        dispatch({ path: path, error: error, status: error ? "INVALID" : "VALID" });
                        return [2 /*return*/];
                }
            });
        }); });
    }
    return {
        values: values,
        status: status,
        errors: errors,
        isValid: status === "VALID",
        isInvalid: status === "INVALID",
        isPending: status === "PENDING",
        get: get,
        setValue: setValue,
        reset: reset,
        addField: addField,
        removeField: removeField,
        validate: function () {
            for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
                var _b = _a[_i], path = _b[0], control = _b[1];
                var validators = validatorsRef.current[path];
                validate(control.value, validators);
            }
        },
        asyncValidate: function () {
            for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
                var _b = _a[_i], path = _b[0], control = _b[1];
                var asyncValidators = asyncValidatorsRef.current[path];
                asyncValidate(path, control.value, asyncValidators);
            }
        },
    };
}
