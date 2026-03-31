import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { hashPassword } from "../utils/password.js";
import { User } from "../models/User.js";
import { Message } from "../models/Message.js";
import { Appointment } from "../models/Appointment.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "..", "data");
const uploadsDir = path.join(__dirname, "..", "uploads");
const dbPath = path.join(dataDir, "db.json");

const createId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

export const getBackendBaseUrl = () =>
  process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`;

const readJsonBackup = async () => {
  try {
    const raw = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const ensureAdminSeed = async () => {
  const adminEmail =
    process.env.ADMIN_EMAIL || "adarshraj62011@gmail.com";
  const adminPassword =
    process.env.ADMIN_PASSWORD || "adarshraj01";

  const existingAdmin = await User.findOne({
    email: adminEmail.toLowerCase(),
    role: "Admin",
  }).lean();

  if (existingAdmin) {
    return;
  }

  await User.create({
    _id: createId(),
    firstName: "System",
    lastName: "Admin",
    email: adminEmail.toLowerCase(),
    phone: "9999999999",
    nic: "0000000000000",
    dob: "1990-01-01",
    gender: "Male",
    role: "Admin",
    password: await hashPassword(adminPassword),
  });
};

const migrateJsonBackupToMongo = async () => {
  const backup = await readJsonBackup();
  if (!backup) {
    return;
  }

  const [userCount, messageCount, appointmentCount] = await Promise.all([
    User.countDocuments(),
    Message.countDocuments(),
    Appointment.countDocuments(),
  ]);

  if (userCount || messageCount || appointmentCount) {
    return;
  }

  if (Array.isArray(backup.users) && backup.users.length) {
    await User.insertMany(backup.users, { ordered: false });
  }

  if (Array.isArray(backup.messages) && backup.messages.length) {
    await Message.insertMany(backup.messages, { ordered: false });
  }

  if (Array.isArray(backup.appointments) && backup.appointments.length) {
    await Appointment.insertMany(backup.appointments, { ordered: false });
  }
};

export const ensureStorage = async () => {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(uploadsDir, { recursive: true });
  await migrateJsonBackupToMongo();
  await ensureAdminSeed();
};

export const listUsersByRole = async (role) => {
  return User.find({ role }).sort({ createdAt: -1 }).lean();
};

export const findUserById = async (id) => {
  return User.findById(id).lean();
};

export const findUserByEmail = async (email) => {
  return User.findOne({ email: String(email).toLowerCase() }).lean();
};

export const createUser = async (payload) => {
  const user = await User.create({
    _id: createId(),
    ...payload,
  });

  return user.toObject();
};

export const createMessageRecord = async (payload) => {
  const message = await Message.create({
    _id: createId(),
    ...payload,
  });

  return message.toObject();
};

export const listMessages = async () => {
  return Message.find().sort({ createdAt: -1 }).lean();
};

export const createAppointmentRecord = async (payload) => {
  const appointment = await Appointment.create({
    _id: createId(),
    ...payload,
  });

  return appointment.toObject();
};

export const listAppointments = async () => {
  return Appointment.find().sort({ createdAt: -1 }).lean();
};

export const updateAppointmentRecord = async (appointmentId, updates) => {
  return Appointment.findByIdAndUpdate(appointmentId, updates, {
    new: true,
  }).lean();
};

export const deleteAppointmentRecord = async (appointmentId) => {
  return Appointment.findByIdAndDelete(appointmentId).lean();
};

export const uploadsPath = uploadsDir;
