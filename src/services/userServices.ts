import { prisma } from "../lib/prisma.js";

export const UserService = {
  /* -------------------------------------------------------
     NORMAL USER FUNCTIONS (YOUR ORIGINAL CODE)
  ------------------------------------------------------- */

  async getUserByEmail(emailId: string) {
    return prisma.user.findUnique({
      where: { email: emailId },
      include: { profile: true },
    });
  },

  async getUserEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  },

  async getUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  },

  async updateUserOtpById(data: {
    otpHash: string;
    otpExpiresAt: Date;
    id: number;
  }) {
    return prisma.user.update({
      where: { id: data.id },
      data: {
        otpHash: data.otpHash,
        otpExpiresAt: data.otpExpiresAt,
        lastOtpSentAt: new Date(),
      },
    });
  },

  async updateUserOtpAndPasswordById(data: {
    otpHash: string;
    otpExpiresAt: Date;
    id: number;
    hashedPassword: string;
  }) {
    return prisma.user.update({
      where: { id: data.id },
      data: {
        password: data.hashedPassword,
        otpHash: data.otpHash,
        otpExpiresAt: data.otpExpiresAt,
        lastOtpSentAt: new Date(),
      },
    });
  },

  async markUserVerified(id: number) {
    return prisma.user.update({
      where: { id },
      data: {
        isActive: true,
        otpHash: null,
        otpExpiresAt: null,
        lastOtpSentAt: null,
      },
    });
  },

  /* -------------------------------------------------------
     ⭐ NORMAL SIGNUP — THIS WAS NEVER MEANT TO BE REMOVED
  ------------------------------------------------------- */
  async createUser(data: {
    email: string;
    hashedPassword: string;
    name: string;
    otpHash: string;
    otpExpiresAt: Date;
    phone: string;
    address?: string;
  }) {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.hashedPassword,
        otpHash: data.otpHash,
        otpExpiresAt: data.otpExpiresAt,
        lastOtpSentAt: new Date(),
        isActive: false,

        profile: {
          create: {
            fullname: data.name,
            phone: data.phone,
            address: data.address,
          },
        },
      },
      include: { profile: true },
    });
  },

  /* -------------------------------------------------------
     ⭐ GOOGLE LOGIN METHODS (NEW)
  ------------------------------------------------------- */

  // 1️⃣ Find by googleId first
  async getUserByGoogleId(googleId: string) {
    return prisma.user.findUnique({
      where: { googleId },
      include: { profile: true },
    });
  },

  // 2️⃣ Create Google user
  async createGoogleUser(data: {
    email: string;
    name: string;
    avatar?: string | null;
    googleId: string;
  }) {
    return prisma.user.create({
      data: {
        email: data.email,
        password: "", // Google users don't need password
        googleId: data.googleId,
        isActive: true,

        profile: {
          create: {
            fullname: data.name,
            profileImage: data.avatar || null,
          },
        },
      },
      include: { profile: true },
    });
  },

  // 3️⃣ Link Google account to existing user
  async updateGoogleIdAndActiveUser(userId: number, googleId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { googleId, isActive: true },
      include: { profile: true },
    });
  },
  async updateUserPasswordById(userId: number, hashedPassword: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: {
        id: true,
      },
    });
  },
  // 3️⃣ Link Google account to existing user
  async getUserProfile(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        profile: {
          select: {
            phone: true,
            address: true,
            fullname: true,
            profileImage: true,
          },
        },
      },
    });
  },
};
