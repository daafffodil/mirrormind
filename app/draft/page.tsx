export default function DraftPage() {
  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-neutral-900">Draft</h1>
          <p className="mt-2 text-neutral-600">
            从这段开头继续写下去。
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <textarea
            className="min-h-[420px] w-full resize-none rounded-2xl border border-neutral-200 p-4 text-base leading-7 text-neutral-800 outline-none"
            placeholder="从这里开始写..."
          />
        </div>
      </div>
    </main>
  );
}