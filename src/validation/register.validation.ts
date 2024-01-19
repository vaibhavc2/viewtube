import {
  largeStringError,
  minStringError,
  requiredError,
} from "@/helpers/validation/zod-error-messages.helper";
import * as z from "zod";

export const RegisterValidation = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: requiredError("Full Name") })
      .min(3, { message: minStringError("Full Name", 3) })
      .max(30, { message: largeStringError("Full Name", 30) })
      .regex(/^[a-zA-Z\s]*$/, {
        message: "Full Name can only contain: letters and spaces",
      }),
    username: z
      .string({ required_error: requiredError("Username") })
      .min(3, { message: minStringError("Username", 3) })
      .max(20, { message: largeStringError("Username", 20) })
      .regex(/^[a-z\d_]*$/, {
        message:
          "Username can only contain: lowercase letters, numbers, and underscore characters",
      }),
    email: z
      .string({ required_error: requiredError("Email") })
      .max(255, { message: largeStringError("Email", 255) })
      .email({ message: "Enter a valid email." }),
    password: z
      .string({ required_error: requiredError("Password") })
      .min(6, { message: minStringError("Password", 6) })
      .max(255, { message: largeStringError("Password", 255) })
      .regex(/^(?=.*\d)(?=.*\W).*$/, {
        message: "Password must contain at least a digit, and a symbol.",
      }),
  }),
});
