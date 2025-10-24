// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    const exists = await User.findOne({ email });
    if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role || "user" });

    return NextResponse.json({ message: "User registered", user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
