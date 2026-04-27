import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomJwtPayload {
  id: string;
  email?: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith("Bearer ")) {
  return res.status(401).json({ message: "No token provided" });
}

const token = authHeader.split(" ")[1];
    console.log("token",token);
if (!token) {
  return res.status(401).json({ message: "Token missing" });
}
   
    const decoded = jwt.verify(token,
      process.env.JWT_SECRET!
    ) as unknown as CustomJwtPayload;
    console.log("decoded",decoded);
    
    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};