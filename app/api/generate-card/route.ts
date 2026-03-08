import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    let title = "灵感卡片";
    let summary = text;
    let productIdea = "";
    let xiaohongshuTitle = "";
    let nextAction = "";
    let interestTags: string[] = [];

    try {
      const prompt = `
你是一个帮助用户整理灵感的 AI 助手。

请根据用户输入，输出严格 JSON。
不要输出任何解释文字，不要输出 markdown，不要加代码块。

格式如下：
{
  "title": "不超过12字标题",
  "summary": "一句简洁摘要，不超过40字",
  "product_idea": "把这条灵感整理成一句产品想法，不超过50字",
  "xiaohongshu_title": "生成一个适合小红书分享的标题，不超过20字",
  "next_action": "给出一个最小可执行下一步，不超过30字",
  "interest_tags": ["标签1", "标签2", "标签3"]
}

标签规则：
1. interest_tags 必须是数组
2. 每条灵感输出 1 到 3 个标签
3. 标签必须简短、稳定、可重复统计
4. 标签尽量是单个概念，例如：
   AI、产品、求职、做饭、运动、健康、写作、创业、内容
5. 不要输出带逗号的大串组合词，例如：
   "AI产品,数据分析,个人工具"

用户输入：
${text}
`;

      const response = await fetch(
        "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
          },
          body: JSON.stringify({
            model: "qwen-turbo",
            input: {
              prompt,
            },
            parameters: {
              temperature: 0.7,
            },
          }),
        }
      );

      const result = await response.json();
      console.log("dashscope result:", result);

      if (response.ok) {
        const outputText = result?.output?.text;

        if (outputText) {
          try {
            const parsed = JSON.parse(outputText);

            title = parsed.title || title;
            summary = parsed.summary || summary;
            productIdea = parsed.product_idea || "";
            xiaohongshuTitle = parsed.xiaohongshu_title || "";
            nextAction = parsed.next_action || "";

            if (Array.isArray(parsed.interest_tags)) {
              interestTags = parsed.interest_tags
                .map((tag: unknown) =>
                  typeof tag === "string" ? tag.trim() : ""
                )
                .filter(Boolean)
                .slice(0, 3);
            }
          } catch (parseError) {
            console.log("JSON parse failed, using fallback:", parseError);
          }
        }
      } else {
        console.log("dashscope request failed, using fallback");
        return NextResponse.json({ error: result }, { status: 500 });
      }
    } catch (aiError) {
      console.log("AI generation failed, using fallback:", aiError);
    }

    const { data, error } = await supabase
      .from("inspirations")
      .insert([
        {
          raw_text: text,
          ai_title: title,
          ai_summary: summary,
          ai_product_idea: productIdea,
          ai_xiaohongshu_title: xiaohongshuTitle,
          ai_next_action: nextAction,
          ai_interest_tags: interestTags,
          status: "ready",
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}