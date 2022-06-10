import { Request, Response } from "express";
import { omit } from "lodash";
import { createAccount, findAccount, getAccounts } from "./account.service";
import log from "../logger";

export async function createAccountHandler(req: Request, res: Response) {
  try {
    const account = await createAccount(req.body);
    return res.send(omit(account.toJSON(), "password"));
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}
export async function getAllAccountsHandler(req: Request, res: Response) {
  try {
    const account = await getAccounts();
    return res.send(account);
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}
export async function getAccountDetailsHandler(req: Request, res: Response) {
  try {
    const account = await findAccount(req.params);
    return res.send(account);
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}
