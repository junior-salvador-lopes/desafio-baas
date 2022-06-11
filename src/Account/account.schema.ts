import { object, string, ref, number } from "yup";

export const createAccountSchema = object({
  body: object({
    ownerId: string().required("Owner is required"),
    agency: string()
      .required("agency is required")
      .min(4, "Agency is a four digits field")
      .max(4, "Agency is a four digits field")
      .matches(/^[0-9_.-]*$/, "agency can only contain numbers."),
    accountNumber: string()
      .required("Account Number is required")
      .min(7, "Account Number is a seven digits field")
      .max(7, "Account Number is a seven digits field")
      .matches(/^[0-9_.-]*$/, "Account Number can only contain numbers."),
    identifier: string()
      .required("identifier is required")
      .min(1, "Identifier is a single number")
      .max(1, "Identifier is a single number")
      .matches(/^[0-9_.-]*$/, "Identifier is a number."),
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum.")
      .max(6, "Password is too long - should be 6 chars maximum.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
    passwordConfirmation: string().oneOf(
      [ref("password"), null],
      "Passwords must match"
    ),
    balance: number()
      .default(0)
      .positive("Can't have negative balance at your account"),
  }),
});

export const createAccountSessionSchema = object({
  body: object({
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum.")
      .max(6, "Password is too long - should be 6 chars maximum.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
    accountNumber: string()
      .required("Account Number is required")
      .min(7, "Account Number is a seven digits field")
      .max(7, "Account Number is a seven digits field")
      .matches(/^[0-9_.-]*$/, "Account Number can only contain numbers."),
  }),
});
