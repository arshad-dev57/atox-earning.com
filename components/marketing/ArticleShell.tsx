import Link from "next/link";
import SiteHeader from "@/components/marketing/SiteHeader";
import SiteFooter from "@/components/marketing/SiteFooter";

/**
 * Shared shell for public learning-centre articles.
 * Server component: article body renders into the server HTML.
 */
export default function ArticleShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 w-full">
        <Link href="/learn" className="text-emerald-600 hover:text-emerald-700 font-medium">
          ← All investment guides
        </Link>
        <article className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600 mb-3">
            {eyebrow}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
            {title}
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">{intro}</p>
          <div className="space-y-6 text-gray-700 leading-relaxed">{children}</div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}