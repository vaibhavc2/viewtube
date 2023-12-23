import * as z from "zod";

const requiredError = (fieldName: string) => {
  return fieldName + " can't be empty! Please fill in all the required fields.";
};

const largeStringError = (fieldName: string, max: number) => {
  return fieldName + " must not exceed " + max + " characters.";
};

export const RegisterValidation = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: requiredError("Full Name") })
      .min(3, { message: "Full Name must be at least 3 characters." })
      .max(30, { message: largeStringError("Full Name", 30) })
      .regex(/^[a-zA-Z\s]*$/, {
        message: "Full Name can only contain: letters and spaces",
      }),
    username: z
      .string({ required_error: requiredError("Username") })
      .min(3, { message: "Username must be at least 3 characters." })
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
      .min(6, { message: "Password must be at least 6 characters." })
      .max(255, { message: largeStringError("Password", 255) })
      .regex(/^(?=.*\d)(?=.*\W).*$/, {
        message: "Password must contain at least a digit, and a symbol.",
      }),
  }),
});
