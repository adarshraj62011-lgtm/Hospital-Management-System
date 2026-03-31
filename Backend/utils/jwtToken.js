import jwt from "jsonwebtoken";

const getSecret = () => process.env.JWT_SECRET_KEY || "zeecare-local-secret";
const getCookieLifetimeDays = () => Number(process.env.COOKIE_EXPIRE || 7);

export const generateToken = (user, message, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    getSecret(),
    { expiresIn: `${getCookieLifetimeDays()}d` }
  );
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";
  const { password, ...safeUser } = user;

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + getCookieLifetimeDays() * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: "lax",
    })
    .json({
      success: true,
      message,
      user: safeUser,
      token,
    });
};
