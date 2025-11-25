import { Request, Response } from "express";

import * as EquipoService from "../services/equipo.service.js";
import { success, failure } from "../helpers/response.js";

export const listEquipos = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    if (user.rol === "admin") {
      const equipos = await EquipoService.listAll();
      return success(res, equipos);
    } else {
      const equipos = await EquipoService.listByUser(user.id);
      return success(res, equipos);
    }
  } catch (err: any) {
    return failure(res, err.message || "Error al listar equipos");
  }
};

export const getEquipo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const equipo = await EquipoService.getById(Number(id));
    if (!equipo) return failure(res, "Equipo no encontrado", 404);

    const user = req.user!;
    if (user.rol !== "admin" && equipo.responsableId !== user.id) {
      return failure(res, "No tienes permiso para ver este equipo", 403);
    }

    return success(res, equipo);
  } catch (err: any) {
    return failure(res, err.message || "Error al obtener equipo");
  }
};

export const createEquipo = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const payload = req.body;

    // Si el rol es user, no puede asignar responsable distinto a sí mismo
    if (user.rol === "user") {
      payload.responsableId = user.id;
    } else {
      // admin: si no envía responsableId, podemos asignar por defecto al admin
      if (!payload.responsableId) payload.responsableId = user.id;
    }

    const nuevo = await EquipoService.createEquipo(payload);
    return success(res, nuevo, "Equipo creado", 201);
  } catch (err: any) {
    // manejo simple de error de unicidad (Prisma P2002)
    const msg = err?.meta?.target ? `Valor duplicado en: ${err.meta.target}` : err.message;
    return failure(res, msg || "Error al crear equipo", 400);
  }
};

export const updateEquipo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const equipo = await EquipoService.getById(Number(id));
    if (!equipo) return failure(res, "Equipo no encontrado", 404);

    // Si no es admin, solo puede actualizar sus propios equipos
    if (user.rol !== "admin" && equipo.responsableId !== user.id) {
      return failure(res, "No autorizado para actualizar este equipo", 403);
    }

    // Si user intenta cambiar responsable, forzamos que sea él mismo
    if (user.rol === "user") req.body.responsableId = user.id;

    const actualizado = await EquipoService.updateEquipo(Number(id), req.body);
    return success(res, actualizado, "Equipo actualizado");
  } catch (err: any) {
    const msg = err?.meta?.target ? `Valor duplicado en: ${err.meta.target}` : err.message;
    return failure(res, msg || "Error al actualizar equipo", 400);
  }
};

export const deleteEquipo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // DELETE solo para admin (se controla en la ruta con roleMiddleware)
    await EquipoService.deleteEquipo(Number(id));
    return res.status(204).send();
  } catch (err: any) {
    return failure(res, err.message || "Error al eliminar equipo", 400);
  }
};
