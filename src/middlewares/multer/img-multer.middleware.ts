import { NextFunction, Request, Response } from "express";
import { uploadImgMulter } from "../../helpers/multer/img-multer.helper.js";
import { getErrorMessage } from "../../utils/common/error/error-message.util.js";

export const uploadImagesLocally = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const upload = uploadImgMulter.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "cover",
      maxCount: 1,
    },
  ]);

  upload(req, res, function (error: unknown) {
    if (error) {
      // An unknown error occurred when uploading.
      next(new Error(getErrorMessage(error)));
    }
    // Everything went fine.
    next();
  });
};
