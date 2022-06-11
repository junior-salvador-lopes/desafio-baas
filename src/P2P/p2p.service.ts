import { DocumentDefinition, LeanDocument } from "mongoose";
import { networkInterfaces } from "os";
import { AccountDocument } from "../Account/account.model";
import { findAccount, updateAccount } from "../Account/account.service";
import P2P, { P2PDocument } from "./p2p.model";

export async function createP2P(input: DocumentDefinition<P2PDocument>) {
  try {
    const { fromAccountId, toAccountId, amount } = input;
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
    console.log(sucessTransaction);
    return await P2P.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

async function checkPositiveBalanceAnGetIt(
  accountId: string,
  amount: number
): Promise<LeanDocument<AccountDocument> | null> {
  const accountValues = await findAccount({ _id: accountId });
  if(!accountValues)throw new Error("Could not find origin account, please check data") 
  if (accountValues.balance > amount) return accountValues;
  return null
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
