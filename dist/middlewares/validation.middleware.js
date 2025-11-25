"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
// @ts-ignore
const express_validator_1 = require("express-validator");
const response_js_1 = require("../helpers/response.js");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, response_js_1.failure)(res, "Errores de validación", 400, { errors: errors.array() });
    }
    next();
};
exports.validateRequest = validateRequest;
