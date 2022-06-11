import { DocumentDefinition, LeanDocument } from "mongoose";
import { networkInterfaces } from "os";
import { AccountDocument } from "../Account/account.model";
import { findAccount, updateAccount } from "../Account/account.service";
import P2P, { P2PDocument } from "./p2p.model";

export async function createP2P(p2p: DocumentDefinition<P2PDocument>) {
  try {
    const { fromAccountId, toAccountId, amount } = p2p;
    const fromAccount = await checkPositiveBalanceAnGetIt(
      fromAccountId,
      amount
    );
    if (!fromAccount) {
      throw new Error("insufficient funds");
    }
    const toAccount = await findAccount({ _id: toAccountId });
    if (!toAccount)
      throw new Error("Could not find destination account, please check data");
    const sucessTransaction = await makeTransaction(
      fromAccount,
      toAccount,
      amount
    );
    return await P2P.create(p2p);
  } catch (error: any) {
    throw new Error(error);
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
    throw new Error(error);
  }
}

async function checkPositiveBalanceAnGetIt(
  accountId: string,
  amount: number
): Promise<LeanDocument<AccountDocument> | null> {
  const accountValues = await findAccount({ _id: accountId });
  if (!accountValues)
    throw new Error("Could not find origin account, please check data");
  if (accountValues.balance > amount) return accountValues;
  return null;
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
