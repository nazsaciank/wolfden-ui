"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialControlState = initialControlState;
exports.initialGroupState = initialGroupState;
exports.initialArrayState = initialArrayState;
function initialControlState(name, schema) {
    var value = schema.value, _a = schema.validators, validators = _a === void 0 ? [] : _a, _b = schema.asyncValidators, asyncValidators = _b === void 0 ? [] : _b, mask = schema.mask, parse = schema.parse, _c = schema.isDirty, isDirty = _c === void 0 ? false : _c, _d = schema.isTouched, isTouched = _d === void 0 ? false : _d, _e = schema.isDisabled, isDisabled = _e === void 0 ? false : _e, _f = schema.isIndeterminate, isIndeterminate = _f === void 0 ? false : _f;
    var masked = value;
    if (mask && value) {
        if (typeof value !== "string")
            value = String(value);
        for (var i = 0; i < value.length; i++) {
            var character = value[i];
            masked += mask(character, i, value);
        }
    }
    var parsed = parse ? parse(masked) : value;
    var error = null;
    for (var _i = 0, validators_1 = validators; _i < validators_1.length; _i++) {
        var validator = validators_1[_i];
        var result = validator(value);
        if (!result)
            continue;
        error = result;
        break;
    }
    return {
        name: name,
        value: value || null,
        parsed: parsed || null,
        masked: masked || "",
        error: error || null,
        status: asyncValidators.length > 0 ? "PENDING" : error ? "INVALID" : "VALID",
        isDirty: isDirty,
        isTouched: isTouched,
        isDisabled: isDisabled,
        isIndeterminate: isIndeterminate,
    };
}
function initialGroupState(schema) {
    var state = {};
    for (var _i = 0, _a = Object.entries(schema); _i < _a.length; _i++) {
        var _b = _a[_i], name_1 = _b[0], controlSchema = _b[1];
        if (!controlSchema)
            continue;
        state[name_1] = initialControlState(name_1, controlSchema);
    }
    return state;
}
function initialArrayState(schema) {
    return schema.map(initialGroupState);
}
