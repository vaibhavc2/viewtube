export const generateTokens = async (user: any) => {
  // generate access token and refresh token
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  // save refresh token to db
  user.refreshToken = refreshToken;

  // save user
  const result = await user.save({ validateBeforeSave: false });

  // check if refresh token was saved successfully
  if (!result) {
    throw new Error("Unable to save refresh token!");
  }

  // return tokens
  return { accessToken, refreshToken };
};
