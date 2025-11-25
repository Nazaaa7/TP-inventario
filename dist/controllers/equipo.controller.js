"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEquipo = exports.updateEquipo = exports.createEquipo = exports.getEquipo = exports.listEquipos = void 0;
require("../types/express"); // Import the extended type definition
const EquipoService = __importStar(require("../services/equipo.service.js"));
const response_js_1 = require("../helpers/response.js");
const listEquipos = async (req, res) => {
    try {
        const user = req.user;
        if (user.rol === "admin") {
            const equipos = await EquipoService.listAll();
            return (0, response_js_1.success)(res, equipos);
        }
        else {
            const equipos = await EquipoService.listByUser(user.id);
            return (0, response_js_1.success)(res, equipos);
        }
    }
    catch (err) {
        return (0, response_js_1.failure)(res, err.message || "Error al listar equipos");
    }
};
exports.listEquipos = listEquipos;
const getEquipo = async (req, res) => {
    try {
        const { id } = req.params;
        const equipo = await EquipoService.getById(Number(id));
        if (!equipo)
            return (0, response_js_1.failure)(res, "Equipo no encontrado", 404);
        const user = req.user;
        if (user.rol !== "admin" && equipo.responsableId !== user.id) {
            return (0, response_js_1.failure)(res, "No tienes permiso para ver este equipo", 403);
        }
        return (0, response_js_1.success)(res, equipo);
    }
    catch (err) {
        return (0, response_js_1.failure)(res, err.message || "Error al obtener equipo");
    }
};
exports.getEquipo = getEquipo;
const createEquipo = async (req, res) => {
    try {
        const user = req.user;
        const payload = req.body;
        // Si el rol es user, no puede asignar responsable distinto a sí mismo
        if (user.rol === "user") {
            payload.responsableId = user.id;
        }
        else {
            // admin: si no envía responsableId, podemos asignar por defecto al admin
            if (!payload.responsableId)
                payload.responsableId = user.id;
        }
        const nuevo = await EquipoService.createEquipo(payload);
        return (0, response_js_1.success)(res, nuevo, "Equipo creado", 201);
    }
    catch (err) {
        // manejo simple de error de unicidad (Prisma P2002)
        const msg = err?.meta?.target ? `Valor duplicado en: ${err.meta.target}` : err.message;
        return (0, response_js_1.failure)(res, msg || "Error al crear equipo", 400);
    }
};
exports.createEquipo = createEquipo;
const updateEquipo = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const equipo = await EquipoService.getById(Number(id));
        if (!equipo)
            return (0, response_js_1.failure)(res, "Equipo no encontrado", 404);
        // Si no es admin, solo puede actualizar sus propios equipos
        if (user.rol !== "admin" && equipo.responsableId !== user.id) {
            return (0, response_js_1.failure)(res, "No autorizado para actualizar este equipo", 403);
        }
        // Si user intenta cambiar responsable, forzamos que sea él mismo
        if (user.rol === "user")
            req.body.responsableId = user.id;
        const actualizado = await EquipoService.updateEquipo(Number(id), req.body);
        return (0, response_js_1.success)(res, actualizado, "Equipo actualizado");
    }
    catch (err) {
        const msg = err?.meta?.target ? `Valor duplicado en: ${err.meta.target}` : err.message;
        return (0, response_js_1.failure)(res, msg || "Error al actualizar equipo", 400);
    }
};
exports.updateEquipo = updateEquipo;
const deleteEquipo = async (req, res) => {
    try {
        const { id } = req.params;
        // DELETE solo para admin (se controla en la ruta con roleMiddleware)
        await EquipoService.deleteEquipo(Number(id));
        return res.status(204).send();
    }
    catch (err) {
        return (0, response_js_1.failure)(res, err.message || "Error al eliminar equipo", 400);
    }
};
exports.deleteEquipo = deleteEquipo;
