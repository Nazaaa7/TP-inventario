"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const response_js_1 = require("../helpers/response.js");
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user)
            return (0, response_js_1.failure)(res, "No autorizado", 401);
        if (!allowedRoles.includes(user.rol))
            return (0, response_js_1.failure)(res, "Acceso prohibido", 403);
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
