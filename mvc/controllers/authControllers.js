import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import sendEmail from "../../utils/sendEmail.js";

import winstonLogger from "../../utils/winstonLogger.js";

const signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const newUser = await User.create({ firstName, lastName, email, password });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { username: `${newUser.firstName} ${newUser.lastName}` },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  winstonLogger.info(`User created: ${firstName} ${lastName}, successfully.`);

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: true, // https
    sameSite: "None", // cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry: set to match rT
  });

  res.status(201).json({ accessToken });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ email: email }).exec();

  if (!foundUser) {
    return res
      .status(401)
      .json({ message: "User does not exist: Unauthorized" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match)
    return res
      .status(401)
      .json({ message: "Enter correct values: Unauthorized" });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: `${foundUser.firstName} ${foundUser.lastName}`,
        email: foundUser.email,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { username: `${foundUser.firstName} ${foundUser.lastName}` },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: true, // https
    sameSite: "None", // cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry: set to match rT
  });

  winstonLogger.info(
    `User logged in: ${foundUser.firstName} ${foundUser.lastName}, successfully.`
  );

  // Send accessToken containing username and roles
  res.status(200).json({ accessToken });
});

// Persist login by refreshing access tokens
const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({
        name: decoded.username,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: `${foundUser.firstName} ${foundUser.lastName}`,
            email: foundUser.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      winstonLogger.info(
        `User refreshed token: ${foundUser.firstName} ${foundUser.lastName}, successfully.`
      );

      res.json({ accessToken });
    })
  );
});

const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); //No content

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  winstonLogger.info(`User logged out successfully.`);

  res.json({ message: "Cookie cleared" });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError(
        "A user with this email was not found please try again, with a valid email."
      )
    );
  }

  // Get Reset Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset password URL.
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset-password/${resetToken}`;

  const message = `Hello from Stevans Auto.\n A request to change your password was made. The link below is valid for 30 minutes, your password reset token is \n ${resetUrl} \n If you did not make this request please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Home Interview LLC: Password Recovery",
      message,
    });

    winstonLogger.info(`Email sent to ${user.email} to reset password.`);

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new AppError(error.message, 500));
  }
});

export { signup, login, refresh, logout, forgotPassword };
