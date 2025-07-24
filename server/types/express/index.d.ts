import { JwtPayload } from "../../utils/jwtPayload"; // مسیر درست رو با توجه به ساختار پروژه‌ت بذار

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}
