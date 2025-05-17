import { AuthenticatedUser } from "types/domain/user";

declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: AuthenticatedUser;
    }
  }
}
