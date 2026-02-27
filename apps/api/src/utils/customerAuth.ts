import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface CustomerJwtPayload {
  customerId: string;
  email: string;
}

export function signCustomerToken(payload: CustomerJwtPayload) {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"]
  });
}

export function verifyCustomerToken(token: string): CustomerJwtPayload {
  return jwt.verify(token, env.jwtSecret) as CustomerJwtPayload;
}
