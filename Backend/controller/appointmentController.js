import {
  createAppointmentRecord,
  deleteAppointmentRecord,
  listAppointments,
  listUsersByRole,
  updateAppointmentRecord,
} from "../database/store.js";

const validStatuses = ["Pending", "Accepted", "Rejected"];

export const postAppointment = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      appointment_date,
      department,
      doctor_firstName,
      doctor_lastName,
      hasVisited,
      address,
    } = req.body;

    const requiredFields = [
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      appointment_date,
      department,
      doctor_firstName,
      doctor_lastName,
      address,
    ];

    if (requiredFields.some((field) => !String(field || "").trim())) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all appointment fields.",
      });
    }

    const doctors = await listUsersByRole("Doctor");
    const doctor = doctors.find(
      (item) =>
        item.firstName === doctor_firstName &&
        item.lastName === doctor_lastName &&
        item.doctorDepartment === department
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Selected doctor was not found.",
      });
    }

    await createAppointmentRecord({
      patientId: req.user._id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: String(phone).trim(),
      nic: String(nic).trim(),
      dob,
      gender,
      appointment_date,
      department,
      hasVisited: Boolean(hasVisited),
      address: address.trim(),
      doctor: {
        _id: doctor._id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        doctorDepartment: doctor.doctorDepartment,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Appointment placed successfully.",
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create appointment.",
    });
  }
};

export const getAllAppointments = async (_req, res) => {
  try {
    const appointments = await listAppointments();
    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch appointments.",
    });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status.",
      });
    }

    const updatedAppointment = await updateAppointmentRecord(req.params.id, {
      status,
    });

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment status updated successfully.",
      appointment: updatedAppointment,
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update appointment status.",
    });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await deleteAppointmentRecord(req.params.id);

    if (!deletedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully.",
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete appointment.",
    });
  }
};
