"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failure = exports.success = void 0;
const success = (res, data = null, message = "OK", status = 200) => {
    return res.status(status).json({ ok: true, message, data });
};
exports.success = success;
const failure = (res, message = "Error", status = 500, errors = null) => {
    const body = { ok: false, message };
    if (errors)
        body.errors = errors;
    return res.status(status).json(body);
};
exports.failure = failure;
