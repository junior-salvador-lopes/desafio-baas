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
        fromAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
        toAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
        amount: { type: Number, required: true },
    },
    { timestamps: true }
  );
  
  const P2P = mongoose.model<P2PDocument>("P2P", P2PSchema);
  
  export default P2P;