import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/site";

/**
 * Public marketing footer shared by all public content pages.
 * Server component — every link points to a real, existing page.
 */
export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg?v=2" alt="ATOX Investment Platform logo" className="h-10 w-auto" />
              <span className="text-xl font-bold">ATOX</span>
            </div>
            <p className="text-gray-400 text-sm">
              Investment plans with daily tasks, Watch and Earn, and mobile data
              and airtime top-ups. Investing involves risk — please read our{" "}
              <Link href="/risk-disclosure" className="underline hover:text-white transition">
                risk disclosure
              </Link>{" "}
              before participating.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/#how-it-works" className="hover:text-white transition">How It Works</Link></li>
              <li><Link href="/#plans" className="hover:text-white transition">Plans & Pricing</Link></li>
              <li><Link href="/fees" className="hover:text-white transition">Fees & Withdrawals</Link></li>
              <li><Link href="/learn" className="hover:text-white transition">Investment Guides</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/terms" className="hover:text-white transition">Terms and Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/risk-disclosure" className="hover:text-white transition">Risk Disclosure</Link></li>
              <li>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white transition break-all">
                  {SUPPORT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm space-y-1">
          <p>&copy; {new Date().getFullYear()} ATOX Investment Platform. All rights reserved.</p>
          <p>
            Plan income is credited only when daily tasks are completed and is not
            guaranteed. Only participate with funds you can afford to lose.
          </p>
        </div>
      </div>
    </footer>
  );
}