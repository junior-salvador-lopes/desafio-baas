import mongoose from "mongoose";

export interface P2PDocument extends mongoose.Document {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}
const P2PSchema = new mongoose.Schema(
    {
      account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
      valid: { type: Boolean, default: true },
      userAgent: { type: String },
    },
    { timestamps: true }
  );
  
  const P2P = mongoose.model<P2PDocument>("P2P", P2PSchema);
  
  export default P2P;