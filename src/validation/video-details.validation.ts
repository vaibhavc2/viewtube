import * as z from "zod";
import {
  largeStringError,
  minStringError,
  requiredError,
} from "../helpers/validation/zod-error-messages.helper.js";

export const VideoDetailsValidation = z.object({
  body: z.object({
    title: z
      .string({ required_error: requiredError("Title") })
      .min(3, { message: minStringError("Title", 3) })
      .max(255, { message: largeStringError("Title", 255) }),
    description: z
      .string({ required_error: requiredError("Description") })
      .min(3, { message: minStringError("Description", 3) }),
  }),
});
