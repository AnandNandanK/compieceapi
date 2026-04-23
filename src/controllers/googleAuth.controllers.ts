import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { sendSuccessResponse } from "../utils/responseUtil.js";
import { UserService } from "../services/userServices.js";
import ms, { StringValue } from "ms";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateAuthJwt.js";

const refreshMaxAge = ms(
  (process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue) || "1d"
);

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);


/* ---------------------------------------------
   2) Google Callback — Signup + Login (Secure)
--------------------------------------------- */
export const googleCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const { code } = req.body;
    if (!code) throw new AppError("Missing Google authorization code", 400);

    // ------------------------------
    // 1️⃣ Exchange code → Google tokens
    // ------------------------------
    const { tokens } = await googleClient.getToken(code as string);

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new AppError("Invalid Google token", 400);

    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      throw new AppError("Google account does not have a valid email", 400);
    }

    let user;

    // ------------------------------
    // 2️⃣ Try finding user by Google ID first
    // ------------------------------
    user = await UserService.getUserByGoogleId(googleId);

    if (user) {
      // ⭐ FIX: If user found by Google but inactive → activate
      if (!user.isActive) {
        user = await UserService.updateGoogleIdAndActiveUser(user.id, googleId);
      }
    } else {
      // ------------------------------
      // 3️⃣ Fallback to email
      // ------------------------------
      user = await UserService.getUserByEmail(email);

      if (!user) {
        // ------------------------------
        // 4️⃣ NEW GOOGLE SIGNUP
        // ------------------------------
        user = await UserService.createGoogleUser({
          email,
          name: name || "New User",
          avatar: picture || null,
          googleId,
        });
      } else {
        // ------------------------------
        // 5️⃣ Existing account without/googleId or inactive
        // ------------------------------
        if (!user.googleId || !user.isActive) {
          user = await UserService.updateGoogleIdAndActiveUser(
            user.id,
            googleId
          );
        }
      }
    }

    // ------------------------------
    // 6️⃣ Create JWT Tokens
    // ------------------------------
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: refreshMaxAge,
    });

    return sendSuccessResponse(
      req,
      res,
      "Google login successful",
      {
        accessToken,
        role: user.role,
        expiresIn: ms(process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue),
      },
      200
    );
  }
);

