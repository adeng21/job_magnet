import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import { db } from "@/db";
import Error from "next/error";

export const POST = async (req: NextRequest) => {
  console.log("hititng request");
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id || !user.email) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });  }
  const dbUser = await db.user.findUnique({ where: { id: user.id } });
  if (!dbUser) {
    await db.user.create({ data: { id: user.id, email: user.email } });
  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200, // OK status
    headers: {
      'Content-Type': 'application/json',
    },
  });};
