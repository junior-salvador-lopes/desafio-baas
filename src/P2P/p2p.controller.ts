import { Request, Response } from "express";
import { omit } from "lodash";
import { createP2P, getP2PById } from "./p2p.service";
import log from "../logger";
import { P2PDocument } from "./p2p.model";

export async function createP2PHandler(req: Request, res: Response) {
  try {
    await createP2P(req.body);
    return res.send({message: "Successful transaction, you can check rigth now your balance"});
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}
export async function getP2PHandler(req: Request, res: Response) {
  try {
    return res.send( await getP2PById(req.params as any, req.query?.offset as string, req.query?.limit as string));
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}