import { User } from "@/models/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = "mon_super_secret";

// TODO: Faire un de cette fonction un middleware ?
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    try {
      const user = jwt.verify(token, SECRET) as User;
      return user;
    } catch {
      return null;
    }
  }
  return null;
}
