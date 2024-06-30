"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Masks = void 0;
var Masks = /** @class */ (function () {
    function Masks() {
    }
    Masks.onlyNumbers = function (character) {
        if (character.match(/[0-9]/)) {
            return character;
        }
        return "";
    };
    return Masks;
}());
exports.Masks = Masks;
