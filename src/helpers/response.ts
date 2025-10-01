import { Response } from "express";

export const success = (res: Response, data: any = null, message = "OK", status = 200) => {
  return res.status(status).json({ ok: true, message, data });
};

export const failure = (res: Response, message = "Error", status = 500, errors: any = null) => {
  const body: any = { ok: false, message };
  if (errors) body.errors = errors;
  return res.status(status).json(body);
};
