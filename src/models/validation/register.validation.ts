import * as z from "zod";

export const RegisterValidation = z.object({
  fullName: z
    .string()
    .min(1, {
      message:
        "Full Name can't be empty! Please fill in all the required fields.",
    })
    .min(4, { message: "Full Name must be at least 4 characters." })
    .max(30, {
      message: "Full Name must not exceed 30 characters.",
    }),
  username: z
    .string()
    .min(1, {
      message:
        "Username can't be empty! Please fill in all the required fields.",
    })
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .max(20, {
      message: "Username must not exceed 20 characters.",
    })
    .regex(/^[a-z\d]*[-_]?[a-z\d]*[-_]?[a-z\d]*$/, {
      message:
        "Username can only contain letters or numbers. '_' or '-' can be used.",
    }),
  email: z
    .string()
    .min(1, {
      message: "Email can't be empty! Please fill in all the required fields.",
    })
    .email({ message: "Enter a valid email." }),
  password: z
    .string()
    .min(1, {
      message:
        "Password can't be empty! Please fill in all the required fields.",
    })
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .regex(/^(?=.*\d)(?=.*\W).*$/, {
      message: "Password must contain at least a digit, and a symbol.",
    }),
});
