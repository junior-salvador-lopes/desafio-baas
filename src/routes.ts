import { Express, Request, Response } from "express";
import {
  createUserHandler,
  getAllUsersHandler,
  getUserDetailsHandler,
} from "./User/user.controller";
import validateRequest from "./middleware/validate-request";
import { createUserSchema } from "./User/user.schema";
import SessionController from "./Session/session.controller";
import requiresUser from "./middleware/require-user";
import {
  createAccountSchema,
  createAccountSessionSchema,
} from "./Account/account.schema";
import {
  createAccountHandler,
  getAccountBalanceHandler,
  getAccountDetailsHandler,
  getAllAccountsHandler,
} from "./Account/account.controller";
import { createP2PSchema } from "./P2P/p2p.schema";
import { createP2PHandler, getP2PHandler } from "./P2P/p2p.controller";
import checkOwner from "./middleware/check-owner";
import uploads from "./upload/upload-service";

const sessionController = new SessionController();

export default function (app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));
  app.get(
    "/api/sessions",
    requiresUser,
    sessionController.getUserSessionsHandler
  );
  app.post("/api/users", validateRequest(createUserSchema), createUserHandler);
  app.get("/api/users/:_id", requiresUser, getUserDetailsHandler);
  app.get("/api/users", requiresUser, getAllUsersHandler);
  app.post(
    "/api/login",
    validateRequest(createAccountSessionSchema),
    sessionController.createUserSessionHandler
  );
  app.delete(
    "/api/logout",
    requiresUser,
    sessionController.invalidateUserSessionHandler
  );
  app.post(
    "/api/accounts",
    validateRequest(createAccountSchema),
    createAccountHandler
  );
  app.get("/api/accounts/:_id", requiresUser, getAccountDetailsHandler);
  app.get("/api/accounts/balance/:_id", requiresUser, getAccountBalanceHandler);
  app.get("/api/accounts", requiresUser, getAllAccountsHandler);
  app.post(
    "/api/p2p",
    requiresUser,
    checkOwner,
    validateRequest(createP2PSchema),
    createP2PHandler
  );
  app.get("/api/p2p/:_id", requiresUser, getP2PHandler);
  app.post(
    "/api/upload-baas-file/:id",
    uploads.single("baasFile"),
    (req, res) => {
      try {
        res
          .status(200)
          .send({ message: `File ${req.file?.filename} successfully saved` });
      } catch (error) {
        res
          .status(500)
          .send({ message: "Something went wrong, please try again later" });
      }
    }
  );
}
