import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabaseClient";

// 删除某个灵感的 API
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  let id = searchParams.get("id");

  if (!id) {
    try {
      const body = await request.json();
      if (typeof body?.id === "string") {
        id = body.id;
      }
    } catch {
      // ignore invalid JSON body
    }
  }

  // 如果没有提供 ID，则返回错误信息
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  // 从数据库中删除指定 ID 的灵感
  const { data, error } = await supabase
    .from("inspirations")
    .delete()
    .eq("id", id); // 使用 eq 来删除指定 ID 的数据

  // 如果发生错误，则返回错误信息
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 删除成功后，刷新首页缓存，确保前端显示最新数据
  revalidatePath("/");

  // 返回成功的响应
  return NextResponse.json({ message: "Deleted successfully", data });
}
