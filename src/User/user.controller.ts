import { Request, Response } from "express";
import { omit } from "lodash";
import { createUser, findUser, getUsers } from "./user.service";
import log from "../logger";

export async function createUserHandler(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), "password"));
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}
export async function getAllUsersHandler(req: Request, res: Response) {
  try {
    const user = await getUsers();
    return res.send(user);
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}
export async function getUserDetailsHandler(req: Request, res: Response) {
  try {
    const user = await findUser(req.params);
    return res.send(user);
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}
