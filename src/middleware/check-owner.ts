import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import log from "../logger";

const checkOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = get(req, "account");
  if (!user) {
    log.error("user required")
    return res.sendStatus(403);
  }

  if (user.account._id !== req.body?.fromAccountId) {
    log.error("account owner and session user doesn't matches")
    return res.sendStatus(403)
  }
  return next();
};

export default checkOwner;