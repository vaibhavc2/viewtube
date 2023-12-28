import ApiError from "../../utils/api/error/api-error.util.js";

export const __jwt_callback = (err: unknown, decoded: any) => {
  if (err) {
    throw new ApiError(401, "Invalid Access Token!");
  }
  return decoded;
};
