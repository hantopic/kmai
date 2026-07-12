import Link from "next/link";

export default function Dashboard() {
  const items = [
    { name: "Users", href: "#" },
    { name: "Projects", href: "/projects" },
    { name: "Image Repository", href: "/images" },
    { name: "Consensus", href: "#" },
    { name: "Datasets", href: "#" },
    { name: "AI Models", href: "#" },
  ];

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
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-xl bg-white p-6 shadow hover:bg-slate-50"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                {item.name}
              </h2>
              <p className="mt-2 text-sm text-slate-500">Open module</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
