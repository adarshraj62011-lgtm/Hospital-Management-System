import path from "path";
import {
  createUser,
  findUserByEmail,
  getBackendBaseUrl,
  listUsersByRole,
  uploadsPath,
} from "../database/store.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { generateToken } from "../utils/jwtToken.js";
import jwt from "jsonwebtoken";

const requiredUserFields = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "nic",
  "dob",
  "gender",
  "password",
];

const validateRequiredFields = (body, fields) =>
  fields.filter((field) => !String(body[field] || "").trim());

const withoutPassword = ({ password, ...safeUser }) => safeUser;
const getSecret = () => process.env.JWT_SECRET_KEY || "zeecare-local-secret";

const saveDoctorAvatar = async (file) => {
  if (!file) {
    return null;
  }

  const safeName = file.name.replace(/\s+/g, "-");
  const fileName = `${Date.now()}-${safeName}`;
  const filePath = path.join(uploadsPath, fileName);

  await file.mv(filePath);

  return {
    public_id: fileName,
    url: `${getBackendBaseUrl()}/uploads/${fileName}`,
  };
};

const createAccount = async ({ body, role, docAvatar }) => {
  const existingUser = await findUserByEmail(body.email);
  if (existingUser) {
    return {
      statusCode: 409,
      payload: {
        success: false,
        message: "User with this email already exists.",
      },
    };
  }

  const password = await hashPassword(body.password);
  const user = await createUser({
    firstName: body.firstName.trim(),
    lastName: body.lastName.trim(),
    email: body.email.trim().toLowerCase(),
    phone: String(body.phone).trim(),
    nic: String(body.nic).trim(),
    dob: body.dob,
    gender: body.gender,
    password,
    role,
    doctorDepartment: body.doctorDepartment || null,
    docAvatar,
  });

  return { statusCode: 201, user };
};

export const patientRegister = async (req, res) => {
  try {
    const missingFields = validateRequiredFields(req.body, requiredUserFields);

    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const result = await createAccount({ body: req.body, role: "Patient" });
    if (!result.user) {
      return res.status(result.statusCode).json(result.payload);
    }

    return generateToken(
      result.user,
      "Patient registered successfully.",
      result.statusCode,
      res
    );
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unable to register patient.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, confirmPassword, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required.",
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password must match.",
      });
    }

    const user = await findUserByEmail(email);
    if (!user || user.role !== role) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const isPasswordMatched = await comparePassword(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    return generateToken(user, "Login successful.", 200, res);
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unable to login right now.",
    });
  }
};

export const addNewAdmin = async (req, res) => {
  try {
    const missingFields = validateRequiredFields(req.body, requiredUserFields);
    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const result = await createAccount({ body: req.body, role: "Admin" });
    if (!result.user) {
      return res.status(result.statusCode).json(result.payload);
    }

    return res.status(result.statusCode).json({
      success: true,
      message: "New admin added successfully.",
      user: withoutPassword(result.user),
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unable to add new admin.",
    });
  }
};

export const addNewDoctor = async (req, res) => {
  try {
    const missingFields = validateRequiredFields(req.body, [
      ...requiredUserFields,
      "doctorDepartment",
    ]);

    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const docAvatar = await saveDoctorAvatar(req.files?.docAvatar);
    const result = await createAccount({
      body: req.body,
      role: "Doctor",
      docAvatar,
    });

    if (!result.user) {
      return res.status(result.statusCode).json(result.payload);
    }

    return res.status(result.statusCode).json({
      success: true,
      message: "New doctor added successfully.",
      user: withoutPassword(result.user),
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unable to add new doctor.",
    });
  }
};

export const getAllDoctors = async (_req, res) => {
  try {
    const doctors = await listUsersByRole("Doctor");
    return res.status(200).json({
      success: true,
      doctors: doctors.map(withoutPassword),
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch doctors.",
    });
  }
};

export const getUserDetails = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: withoutPassword(req.user),
  });
};

const getSessionUser = async (tokenName, expectedRole, req, res) => {
  try {
    const token = req.cookies[tokenName];

    if (!token) {
      return res.status(200).json({
        success: true,
        authenticated: false,
        user: null,
      });
    }

    const decoded = jwt.verify(token, getSecret());
    const user = await findUserById(decoded.id);

    if (!user || user.role !== expectedRole) {
      return res.status(200).json({
        success: true,
        authenticated: false,
        user: null,
      });
    }

    return res.status(200).json({
      success: true,
      authenticated: true,
      user: withoutPassword(user),
    });
  } catch {
    return res.status(200).json({
      success: true,
      authenticated: false,
      user: null,
    });
  }
};

export const getPatientSession = async (req, res) =>
  getSessionUser("patientToken", "Patient", req, res);

export const getAdminSession = async (req, res) =>
  getSessionUser("adminToken", "Admin", req, res);

const clearSessionCookie = (cookieName, message, res) =>
  res
    .status(200)
    .cookie(cookieName, "", {
      expires: new Date(0),
      httpOnly: true,
      sameSite: "lax",
    })
    .json({
      success: true,
      message,
    });

export const logoutPatient = async (_req, res) =>
  clearSessionCookie("patientToken", "Patient logged out successfully.", res);

export const logoutAdmin = async (_req, res) =>
  clearSessionCookie("adminToken", "Admin logged out successfully.", res);
