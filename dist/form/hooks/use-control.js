"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useControl = useControl;
var react_1 = require("react");
function useControl(control) {
    var inputRef = (0, react_1.useRef)(null);
    function onChange(event) {
        var target = event.target;
        if (target instanceof HTMLInputElement) {
            if (target.type === "checkbox") {
                control.setValue(target.checked);
                return;
            }
            control.setValue(target.value);
        }
        if (target instanceof HTMLSelectElement) {
            control.setValue(target.value);
        }
        if (target instanceof HTMLTextAreaElement) {
            control.setValue(target.value);
        }
    }
    function onFocus(event) {
        if (control.isTouched)
            control.markAsTouched();
    }
    if (inputRef.current) {
        var input = inputRef.current;
        if (input instanceof HTMLInputElement) {
            if (input.type === "checkbox") {
                return {
                    ref: inputRef,
                    checked: control.value,
                    indeterminate: control.isIndeterminate,
                    disabled: control.isDisabled,
                    onChange: onChange,
                    onFocus: onFocus,
                };
            }
        }
    }
    return {
        ref: inputRef,
        value: control.value,
        disabled: control.isDisabled,
        onChange: onChange,
        onFocus: onFocus,
    };
}
