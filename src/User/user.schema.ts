import { object, string, ref } from "yup";

export const createUserSchema = object({
  body: object({
    name: string().required("Name is required"),
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
