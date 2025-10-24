// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email & password required" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = createToken({ id: user._id, role: user.role, email: user.email });
    return NextResponse.json({ token, role: user.role, email: user.email });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
