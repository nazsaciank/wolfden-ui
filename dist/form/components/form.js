"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Form = Form;
const react_1 = __importDefault(require("react"));
const context_1 = require("../context");
function Form({ group, children, onSubmit, ...props }) {
    function handleOnSubmit(ev) {
        ev.preventDefault();
        if (onSubmit)
            onSubmit(group.values);
    }
    return (react_1.default.createElement(context_1.FormContext.Provider, { value: { findControl: group?.get } },
        react_1.default.createElement("form", { onSubmit: handleOnSubmit, ...props }, children)));
}
