import { getSupabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("nods_page")
    .select("*")
    .limit(1);

  if (error) {
    return Response.json({ ok: false, error: error.message });
  }

  return Response.json({ ok: true, data });
}
