import { IUser } from "@/models/user.model";

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
