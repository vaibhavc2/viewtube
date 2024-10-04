import { IUser } from "@/common/models";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }

  namespace GlobalTypes {
    type MulterFiles = { [fieldname: string]: Express.Multer.File[] };
  }
}

export {};
