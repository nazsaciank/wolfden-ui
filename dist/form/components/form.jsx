"use strict";
"use client";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Form = Form;
var react_1 = __importDefault(require("react"));
var context_1 = require("../context");
function Form(_a) {
    var group = _a.group, children = _a.children, onSubmit = _a.onSubmit, props = __rest(_a, ["group", "children", "onSubmit"]);
    function handleOnSubmit(ev) {
        ev.preventDefault();
        if (onSubmit)
            onSubmit(group.values);
    }
    return (<context_1.FormContext.Provider value={{ findControl: group === null || group === void 0 ? void 0 : group.get }}>
            <form onSubmit={handleOnSubmit} {...props}>
                {children}
            </form>
        </context_1.FormContext.Provider>);
}
