import { supabase } from "@/lib/supabaseClient";
import CaptureBox from "./components/CaptureBox";
import InspirationCard from "./components/InspirationCard";

type Inspiration = {
  id: string;
  created_at: string;
  input_type: string;
  raw_text: string | null;
  image_url: string | null;
  ai_title: string | null;
  ai_summary: string | null;
  ai_product_idea?: string | null;
  ai_xiaohongshu_title?: string | null;
  ai_next_action?: string | null;
  ai_interest_tags?: string[] | null;
  status: string | null;
};

function getInterestStats(inspirations: Inspiration[]) {
  const counts: Record<string, number> = {};

  for (const item of inspirations) {
    const tags = item.ai_interest_tags ?? [];

    for (const tag of tags) {
      const cleanTag = tag?.trim();
      if (!cleanTag) continue;
      counts[cleanTag] = (counts[cleanTag] || 0) + 1;
    }
  }

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return {
    topTag: sorted[0]?.[0] || null,
    topCount: sorted[0]?.[1] || 0,
    allTags: sorted,
  };
}

export default async function Home() {
  const { data, error } = await supabase
    .from("inspirations")
    .select("*")
    .order("created_at", { ascending: false });

  const inspirations = (data ?? []) as Inspiration[];
  const recentInspirations = inspirations.slice(0, 20);
  const interestStats = getInterestStats(recentInspirations);

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-neutral-900">
            MirrorMind
          </h1>
          <p className="mt-2 text-neutral-600">Your AI interest mirror.</p>
        </div>

        <div className="mb-8">
          <CaptureBox />
        </div>

        <section className="mb-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="mb-2 text-xs uppercase tracking-wide text-neutral-400">
            Interest Mirror
          </div>

          {interestStats.topTag ? (
            <>
              <h2 className="text-xl font-medium text-neutral-900">
                你最近最常在想：{interestStats.topTag}
              </h2>
              <p className="mt-2 text-neutral-600">
                在最近的 {recentInspirations.length} 条灵感里，
                「{interestStats.topTag}」出现了 {interestStats.topCount} 次。
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {interestStats.allTags.map(([tag, count]) => (
                  <span
                    key={tag}
                    className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700"
                  >
                    {tag} · {count}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-neutral-600">
              还没有足够的灵感数据，继续记录几条，系统就会开始识别你的兴趣轨迹。
            </p>
          )}
        </section>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error.message}
          </div>
        )}

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {inspirations.map((item) => (
            <InspirationCard key={item.id} item={item} />
          ))}
        </section>
      </div>
    </main>
  );
}