import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <p className="text-7xl font-bold text-emerald-600 mb-4">404</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist, may have been moved, or the
          link may be incorrect. Nothing has been charged and no account action was
          taken — if you followed a link from a message, treat it with caution and
          contact support if it claims to come from ATOX.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
          >
            Go to Homepage
          </Link>
          <Link
            href="/faq"
            className="px-6 py-3 bg-white text-emerald-700 border border-emerald-200 rounded-xl font-semibold hover:shadow-lg transition"
          >
            Read the FAQ
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white text-emerald-700 border border-emerald-200 rounded-xl font-semibold hover:shadow-lg transition"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}