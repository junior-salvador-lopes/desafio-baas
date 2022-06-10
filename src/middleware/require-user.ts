import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import log from "../logger";

const requiresUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = get(req, "account");
  if (!user) {
    log.error("user required")
    return res.sendStatus(403);
  }

  return next();
};

export default requiresUser;