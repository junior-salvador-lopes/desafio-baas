import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface AccountDocument extends mongoose.Document {
  ownerId: string;
  accountNumber: string;
  identifier: string;
  agency: string;
  balance: number;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(ownerPassword: string): Promise<boolean>;
}

const AccountSchema = new mongoose.Schema(
  {
    ownerId: { type: String, required: true, unique: true },
    accountNumber: { type: String, required: true, unique: true},
    identifier: { type: String, required: true},
    balance: { type: Number, required: true, default: 0},
    agency: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

AccountSchema.pre("save", async function (next: any) {
    let account = this as AccountDocument;
  
    // only hash the password if it has been modified (or is new)
    if (!account.isModified("password")) return next();
  
    // Random additional data
    const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));
  
    const hash = await bcrypt.hashSync(account.password, salt);
  
    // Replace the password with the hash
    account.password = hash;
  
    return next();
  });
  
  // Used for logging in
  AccountSchema.methods.comparePassword = async function (
    ownerPassword: string
  ) {
    const account = this as AccountDocument;
  
    return bcrypt.compare(ownerPassword, account.password).catch((e) => false);
  };
  
  const Account = mongoose.model<AccountDocument>("Account", AccountSchema);
  
  export default Account;