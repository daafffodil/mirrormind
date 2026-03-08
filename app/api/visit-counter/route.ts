import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabase
    .from("visit_counter")
    .select("count")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const currentCount = data?.count ?? 0;
  const newCount = currentCount + 1;

  const { error: upsertError } = await supabase
    .from("visit_counter")
    .upsert({ id: 1, count: newCount }, { onConflict: "id" });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json(
    { count: newCount },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
}
