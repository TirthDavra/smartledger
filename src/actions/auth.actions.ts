"use server";

import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";

import { registerSchema } from "@/schemas/auth.schema";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const validatedFields =
      registerSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        error: "Invalid fields",
      };
    }

    const { name, email, password } =
      validatedFields.data;

    await connectDB();

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return {
        error: "User already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      success: "Account created successfully",
    };
  } catch {
    return {
      error: "Something went wrong",
    };
  }
}