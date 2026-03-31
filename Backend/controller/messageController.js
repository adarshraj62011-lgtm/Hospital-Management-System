import { createMessageRecord, listMessages } from "../database/store.js";

export const sendMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "All message fields are required.",
      });
    }

    await createMessageRecord({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: String(phone).trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unable to send message.",
    });
  }
};

export const getAllMessages = async (_req, res) => {
  try {
    const messages = await listMessages();

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch messages.",
    });
  }
};
