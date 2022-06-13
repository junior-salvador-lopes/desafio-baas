import { object, string, number } from "yup";

export const createP2PSchema = object({
  body: object({
    fromAccountId: string().required("From Account is required"),
    toAccountId: string().required("To Account is required"),
    amount: number().positive("Transfers must be positive"),
  }),
});
