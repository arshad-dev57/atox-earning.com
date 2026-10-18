import Link from "next/link";

const NAV_LINKS = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#plans", label: "Plans" },
  { href: "/fees", label: "Fees" },
  { href: "/learn", label: "Learn" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

/**
 * Public marketing header shared by all public content pages.
 * Server component — all links are real <a> targets for crawlers.
 */
export default function SiteHeader() {
  return (
    <header className="bg-white/80 backdrop-blur-md py-4 px-6 shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg?v=2" alt="ATOX Investment Platform logo" className="h-10 w-auto" />
          <span className="text-xl font-bold text-gray-900">ATOX</span>
        </Link>
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-emerald-600 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-emerald-600 font-semibold hover:bg-emerald-50 rounded-xl transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}