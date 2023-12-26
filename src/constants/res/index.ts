export const __cookie_options = {
  httpOnly: true,
  sameSite: "strict" as "strict",
  secure: true,
  // secure: process.env.NODE_ENV === "development" ? false : true,
} as const;
