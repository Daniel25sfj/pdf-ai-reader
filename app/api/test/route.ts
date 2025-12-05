import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("nods_page")
    .select("*")
    .limit(1);

  if (error) {
    return Response.json({ ok: false, error: error.message });
  }

  return Response.json({ ok: true, data });
}
