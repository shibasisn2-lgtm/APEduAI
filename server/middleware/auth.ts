import type { Request, Response, NextFunction } from "express";
import type { User } from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export interface AuthRequest extends Request {
  user?: User;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const { storage } = await import("../storage");
  const user = await storage.getUser(req.session.userId);
  
  if (!user || !user.isActive) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  req.user = user;
  next();
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    
    next();
  };
}

export function requireDistrictAccess(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  if (req.user.role === "State Administrator") {
    return next();
  }
  
  const requestedDistrictId = req.params.districtId || req.body.districtId;
  
  if (req.user.role === "District Official" && req.user.districtId !== requestedDistrictId) {
    return res.status(403).json({ message: "Access denied to this district" });
  }
  
  next();
}
