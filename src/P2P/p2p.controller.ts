import { Request, Response } from "express";
import { omit } from "lodash";
import { createP2P } from "./p2p.service";
import log from "../logger";
import { P2PDocument } from "./p2p.model";

export async function createP2PHandler(req: Request, res: Response) {
  try {
    await createP2P(req.body);
    return res.send("Successful transaction, you can check rigth now your balance");
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}