import * as z from "zod";

const requiredError = (fieldName: string) => {
  return fieldName + " can't be empty! Please fill in all the required fields.";
};

export const RegisterValidation = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: requiredError("Full Name") })
      .min(4, { message: "Full Name must be at least 4 characters." })
      .max(30, { message: "Full Name must not exceed 30 characters." }),
    username: z
      .string({ required_error: requiredError("Username") })
      .min(3, { message: "Username must be at least 3 characters." })
      .max(20, { message: "Username must not exceed 20 characters." })
      .regex(/^[a-z\d]*[-_]?[a-z\d]*[-_]?[a-z\d]*$/, {
        message:
          "Username can only contain letters or numbers. '_' or '-' can be used.",
      }),
    email: z
      .string({ required_error: requiredError("Email") })
      .email({ message: "Enter a valid email." }),
    password: z
      .string({ required_error: requiredError("Password") })
      .min(6, { message: "Password must be at least 6 characters." })
      .regex(/^(?=.*\d)(?=.*\W).*$/, {
        message: "Password must contain at least a digit, and a symbol.",
      }),
  }),
});
