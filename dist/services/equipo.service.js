"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEquipo = exports.updateEquipo = exports.createEquipo = exports.getById = exports.listByUser = exports.listAll = void 0;
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
const listAll = async () => {
    return prisma_js_1.default.equipo.findMany({ include: { responsable: { select: { id: true, nombre: true, email: true, rol: true } } } });
};
exports.listAll = listAll;
const listByUser = async (userId) => {
    return prisma_js_1.default.equipo.findMany({
        where: { responsableId: userId },
        include: { responsable: { select: { id: true, nombre: true, email: true } } }
    });
};
exports.listByUser = listByUser;
const getById = async (id) => {
    return prisma_js_1.default.equipo.findUnique({
        where: { id },
        include: { responsable: true }
    });
};
exports.getById = getById;
const createEquipo = async (data) => {
    // Prisma lanzará error si serie ya existe (constraint unique)
    return prisma_js_1.default.equipo.create({
        data: {
            nombre: data.nombre,
            tipo: data.tipo,
            estado: data.estado,
            ubicacion: data.ubicacion,
            serie: data.serie,
            observaciones: data.observaciones ?? null,
            fechaAsignacion: data.fechaAsignacion ?? undefined,
            responsableId: data.responsableId
        }
    });
};
exports.createEquipo = createEquipo;
const updateEquipo = async (id, data) => {
    return prisma_js_1.default.equipo.update({
        where: { id },
        data: {
            nombre: data.nombre,
            tipo: data.tipo,
            estado: data.estado,
            ubicacion: data.ubicacion,
            serie: data.serie,
            observaciones: data.observaciones,
            responsableId: data.responsableId
        }
    });
};
exports.updateEquipo = updateEquipo;
const deleteEquipo = async (id) => {
    return prisma_js_1.default.equipo.delete({ where: { id } });
};
exports.deleteEquipo = deleteEquipo;
