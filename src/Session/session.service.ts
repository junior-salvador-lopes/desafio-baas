import { LeanDocument, FilterQuery, UpdateQuery } from "mongoose";
import config from "config";
import { get } from "lodash";
import  { AccountDocument }  from "../Account/account.model";
import Session, { SessionDocument } from "./session.model";
import { sign, decode } from "../utils/jwt.utils";
import { findAccount } from "../Account/account.service";
import { omit } from "lodash";


export async function createSession(accountId: string, userAgent: string) {
  const session = await Session.create({ account: accountId, userAgent });

  return omit(session.toJSON(), "password");
}

export function createAccessToken({
  account,
  session,
}: {
  account:
    | Omit<AccountDocument, "password">
    | LeanDocument<Omit<AccountDocument, "password">>;
  session:
    | Omit<SessionDocument, "password">
    | LeanDocument<Omit<SessionDocument, "password">>;
}) {
  // Build and return the new access token
  const accessToken = sign(
    { account, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 120 minutes
  );

  return accessToken;
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  // Decode the refresh token
  const { decoded } = decode(refreshToken);

  if (!decoded || !get(decoded, "_id")) return false;

  // Get the session
  const session = await Session.findById(get(decoded, "_id"));

  // Make sure the session is still valid
  if (!session || !session?.valid) return false;

  const account = await findAccount({ _id: session.account });

  if (!account) return false;

  const accessToken = createAccessToken({ account, session });

  return accessToken;
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return Session.updateOne(query, update);
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return Session.find(query).lean();
}
