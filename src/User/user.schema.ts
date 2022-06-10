import { object, string, ref } from "yup";

export const createUserSchema = object({
  body: object({
    name: string().required("Name is required"),
    cpf: string()
      .required("CPF is required")
      .min(11, "CPF deve ter no mínimo 11 dígitos")
      .max(11, "CPF deve ter no máximo 11 dígitos")
      .matches(/^[0-9_.-]*$/, "CPF can only contain numbers."),
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
    passwordConfirmation: string().oneOf(
      [ref("password"), null],
      "Passwords must match"
    ),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});

export const createUserSessionSchema = object({
  body: object({
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
    cpf: string()
      .required("CPF is required")
      .min(11, "CPF deve ter no mínimo 11 dígitos")
      .max(11, "CPF deve ter no máximo 11 dígitos")
      .matches(/^[0-9_.-]*$/, "CPF can only contain numbers."),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});


