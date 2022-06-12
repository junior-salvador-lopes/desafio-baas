import { DocumentDefinition, LeanDocument } from "mongoose";
//@ts-ignore
import bcrypt from "bcrypt";
import { AccountDocument } from "../Account/account.model";
import { findAccount, updateAccount } from "../Account/account.service";
import P2P, { P2PDocument } from "./p2p.model";
import { findUserWithPassword } from "../User/user.service";

export async function createP2P(p2p: DocumentDefinition<P2PDocument>) {
  try {
    const { fromAccountId, toAccountId, amount, password } = p2p;
    const fromAccount = await checkProcess(password, fromAccountId, amount);
    if (!fromAccount) {
      throw new Error("insufficient funds");
    }
    const toAccount = await findAccount({ _id: toAccountId });
    if (!toAccount)
      throw new Error("Could not find destination account, please check data");
    const successTransaction = await makeTransaction(
      fromAccount,
      toAccount,
      amount
    );
    if(!successTransaction) throw new Error("Something wrong, please try again");
    return await P2P.create(p2p);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getP2PById(p2pId: any, offset: string, limit: string) {
  try {
    const results = await P2P.find()
      .where({
        $or: [{ fromAccountId: p2pId._id }, { toAccountId: p2pId._id }],
      })
      .skip(Number(offset))
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    const count = await P2P.find()
      .where({
        $or: [{ fromAccountId: p2pId._id }, { toAccountId: p2pId._id }],
      })
      .count();
    return { results, records: count };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function checkProcess(
  p2pPassword: string,
  accountId: string,
  amount: number
): Promise<LeanDocument<AccountDocument> | null> {
  try {
    const accountValues = await findAccount({ _id: accountId });
    const user = await findUserWithPassword({ _id: accountValues?.ownerId });
    if (!accountValues && !user)
      throw new Error("Could not find origin account, please check data");

    if (!!user && !!accountValues) {
      const checked = await checkPassword(user?.password, p2pPassword);
      if (!checked) throw new Error("Incorrect password, please try it again");

      if (accountValues.balance > amount) return accountValues;
      return null;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function makeTransaction(
  fromAccount: LeanDocument<AccountDocument>,
  toAccount: LeanDocument<AccountDocument>,
  amount: number
): Promise<boolean> {
  fromAccount.balance -= amount;
  toAccount.balance += amount;
  const fromSuccess = await updateAccount(fromAccount);
  const toSuccess = await updateAccount(toAccount);
  if (fromSuccess && toSuccess) return true;
  return false;
}

async function checkPassword(accountPassword: string, password: string) {
  return await bcrypt.compare(password, accountPassword).catch((e: any) => false);
}
