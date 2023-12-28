export const generateTokens = async (user: any) => {
  // generate access token and refresh token
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  // save refresh token to db
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // return tokens
  return { accessToken, refreshToken };
};
