// app/api/complaints/authHelper.ts
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function requireAuth(req: Request, allowedRoles?: string[]) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
  const parts = auth.split(" ");
  if (parts.length !== 2) return NextResponse.json({ error: "Invalid Authorization header" }, { status: 401 });
  const token = parts[1];
  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid/Expired token" }, { status: 401 });
  const role = (decoded as any).role;
  if (allowedRoles && !allowedRoles.includes(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return decoded;
}
