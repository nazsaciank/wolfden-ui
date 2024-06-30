"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormContext = useFormContext;
var react_1 = require("react");
var context_1 = require("../context");
function useFormContext(path) {
    var context = (0, react_1.useContext)(context_1.FormContext);
    if (!context || !context.findControl)
        return null;
    return context.findControl(path);
}
