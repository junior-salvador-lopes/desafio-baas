import { DocumentDefinition, FilterQuery } from "mongoose";
import Account, { AccountDocument } from "./account.model";
import { omit } from "lodash";

export async function createAccount(
  input: DocumentDefinition<AccountDocument>
) {
  try {
    return await Account.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}
export async function updateAccount(
  input: DocumentDefinition<AccountDocument>
) {
  try {
    return await Account.updateOne(
      //@ts-ignore
      { _id: input._id },
      { $set: { balance: input.balance } }
    );
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findAccount(query: FilterQuery<AccountDocument>) {
  return Account.findOne(query).lean().select("-password");
}

export async function findAccountBalance(query: FilterQuery<AccountDocument>) {
  const account = await Account.findOne(query).lean()
  return {account: account?.accountNumber, balance: account?.balance }
}

export async function getAccounts() {
  return await Account.find().select(["ownerId", "accountNumber"]);
}

export async function validatePassword({
  accountNumber,
  password,
}: {
  accountNumber: AccountDocument["accountNumber"];
  password: string;
}) {
  const account = await Account.findOne({ accountNumber });

  if (!account) {
    return false;
  }

  const isValid = await account.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(account.toJSON(), "password");
}
