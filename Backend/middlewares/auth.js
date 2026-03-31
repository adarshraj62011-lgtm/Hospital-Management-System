import jwt from "jsonwebtoken";
import { findUserById } from "../database/store.js";

const getSecret = () => process.env.JWT_SECRET_KEY || "zeecare-local-secret";

const authenticate = async (tokenName, expectedRole, req, res, next) => {
  try {
    const token = req.cookies[tokenName];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource.",
      });
    }

    const decoded = jwt.verify(token, getSecret());
    const user = await findUserById(decoded.id);

    if (!user || user.role !== expectedRole) {
      return res.status(401).json({
        success: false,
        message: "User is not authorized for this resource.",
      });
    }

    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed. Please login again.",
    });
  }
};

export const isPatientAuthenticated = (req, res, next) =>
  authenticate("patientToken", "Patient", req, res, next);

export const isAdminAuthenticated = (req, res, next) =>
  authenticate("adminToken", "Admin", req, res, next);
