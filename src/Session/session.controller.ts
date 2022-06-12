import config from "config";
import { get } from "lodash";
import { Request, Response } from "express";
import { validatePassword } from "../Account/account.service";
import {
  createSession,
  createAccessToken,
  updateSession,
  findSessions,
} from "../Session/session.service";
import { sign } from "../utils/jwt.utils";
import { Post, Get, Route } from "tsoa";


@Route("Session")
export default class SessionController {
 //@Post("/")
   public async  createUserSessionHandler(req: Request, res: Response) {
    // validate the account number and password
    const account = await validatePassword(req.body);
  
    if (!account) {
      return res.status(401).send("Invalid accountNumber or password");
    }
  
    // Create a session
    const session = await createSession(account._id, req.get("user-agent") || "");
  
    // create access token
    const accessToken = createAccessToken({
      account,
      session,
    });
  
    // create refresh token
    const refreshToken = sign(session, {
      expiresIn: config.get("refreshTokenTtl"), // 1 year
    });
  
    // send refresh & access token back
    return res.send({ accessToken, refreshToken });
  }
  
   public async  invalidateUserSessionHandler(
    req: Request,
    res: Response
  ) {
    const sessionId = get(req, "account.session");
  
    await updateSession({ _id: sessionId }, { valid: false });
  
    return res.sendStatus(200);
  }
  @Get("/api/sessions")
   public async  getUserSessionsHandler(req: Request, res: Response) {
    const { account } = get(req, "account");
    const sessions = await findSessions({ account: account._id, valid: true });
  
    return res.send(sessions);
  }
} 
