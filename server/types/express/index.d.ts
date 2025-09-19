import { JwtPayload } from "../../utils/jwtPayload";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}
