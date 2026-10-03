import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
export async function requireRole(roles: string[]) {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await sb.from("profiles").select("*").eq("id", user.id).single();
  if (!profile || !roles.includes(profile.role)) redirect("/login");
  return { sb, profile };
}
