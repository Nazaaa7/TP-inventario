"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_helper_js_1 = require("../helpers/jwt.helper.js");
const response_js_1 = require("../helpers/response.js");
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return (0, response_js_1.failure)(res, "No se proporcionó token", 401);
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer")
            return (0, response_js_1.failure)(res, "Formato de token inválido", 401);
        const token = parts[1];
        const decoded = (0, jwt_helper_js_1.verifyToken)(token);
        // decoded tiene: { id, rol }
        req.user = { id: decoded.id, rol: decoded.rol };
        next();
    }
    catch (err) {
        return (0, response_js_1.failure)(res, "Token inválido o expirado", 401);
    }
};
exports.authMiddleware = authMiddleware;
