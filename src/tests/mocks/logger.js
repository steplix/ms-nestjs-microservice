"use strict";
exports.__esModule = true;
exports.LoggerMock = void 0;
var LoggerMock = /** @class */ (function () {
    function LoggerMock() {
    }
    LoggerMock.prototype.log = function (message) { };
    LoggerMock.prototype.error = function (message, trace) { };
    LoggerMock.prototype.warn = function (message) { };
    LoggerMock.prototype.debug = function (message) { };
    LoggerMock.prototype.verbose = function (message) { };
    return LoggerMock;
}());
exports.LoggerMock = LoggerMock;
