import { Express, Request, Response } from "express";
import {
  createUserHandler,
  getAllUsersHandler,
  getUserDetailsHandler,
} from "./User/user.controller";
import validateRequest from "./middleware/validate-request";
import { createUserSchema } from "./User/user.schema";
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  invalidateUserSessionHandler,
} from "./Session/session.controller";
import requiresUser from "./middleware/require-user";
import { createAccountSchema, createAccountSessionSchema } from "./Account/account.schema";
import { createAccountHandler, getAccountDetailsHandler, getAllAccountsHandler } from "./Account/account.controller";
import { createP2PSchema } from "./P2P/p2p.schema";
import { createP2PHandler, getP2PHandler } from "./P2P/p2p.controller";

export default function (app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));
  app.get("/api/sessions", requiresUser, getUserSessionsHandler);
  app.post("/api/users", validateRequest(createUserSchema), createUserHandler);
  app.get("/api/users/:_id", requiresUser, getUserDetailsHandler);
  app.get("/api/users", requiresUser, getAllUsersHandler);
  app.post(
    "/api/login",
    validateRequest(createAccountSessionSchema),
    createUserSessionHandler
  );
  app.delete("/api/logout", requiresUser, invalidateUserSessionHandler);
  app.post("/api/accounts", validateRequest(createAccountSchema), createAccountHandler);
  app.get("/api/accounts/:_id", requiresUser, getAccountDetailsHandler);
  app.get("/api/accounts", requiresUser, getAllAccountsHandler);
  app.post("/api/p2p", requiresUser, validateRequest(createP2PSchema), createP2PHandler);
  app.get("/api/p2p/:_id", requiresUser, getP2PHandler);




}
