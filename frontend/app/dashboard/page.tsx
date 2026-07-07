export default function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900">
          KMAI Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Korean Medicine Artificial Intelligence Platform
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            "Users",
            "Projects",
            "Image Repository",
            "Consensus",
            "Datasets",
            "AI Models",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl bg-white p-6 shadow"
            >
              <h2 className="text-lg font-semibold text-slate-900">{item}</h2>
              <p className="mt-2 text-sm text-slate-500">Coming soon</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
