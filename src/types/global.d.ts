import { IUser } from "@/database/models";

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
