declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }

  namespace GlobalTypes {
    type MulterFiles = { [fieldname: string]: Express.Multer.File[] };
  }
}
