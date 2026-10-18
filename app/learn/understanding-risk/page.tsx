import type { Metadata } from "next";
import Link from "next/link";
import ArticleShell from "@/components/marketing/ArticleShell";
import AdSenseAd from "@/components/ads/AdSenseAd";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Understanding Risk: Why You Can Lose Money",
  description:
    "The main types of investment risk, how to size positions so a loss is survivable, and a worked example that calculates the real percentage return of ATOX plans — and what those numbers imply about risk.",
  alternates: { canonical: `${SITE_URL}/learn/understanding-risk` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Understanding Risk: Why You Can Lose Money",
  description:
    "Types of investment risk, position sizing, and a worked example calculating the real return percentage of ATOX plans.",
  author: { "@type": "Organization", name: SITE_NAME },
  publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  url: `${SITE_URL}/learn/understanding-risk`,
  datePublished: "2026-10-18",
  inLanguage: "en",
};

export default function UnderstandingRiskPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleShell
        eyebrow="Guide 2 of 3"
        title="Understanding Risk: Why You Can Lose Money"
        intro="This guide is about the part of investing most marketing skips: the ways money is lost, how to decide how much to commit, and how to read the return numbers on ATOX plans honestly — using the platform's own published figures."
      >
        <section>
          <h2 className="text-2xl font-bold text-gray-900">The main ways investments lose money</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Opportunity risk</strong> — the promised return simply does not
              arrive: the platform underperforms, changes terms, or cannot sustain
              payouts. You earn less than expected, or nothing.
            </li>
            <li>
              <strong>Capital risk</strong> — the principal itself is lost. With
              non-refundable plan purchases, a platform failure or account suspension
              can mean the price you paid never comes back.
            </li>
            <li>
              <strong>Liquidity risk</strong> — your money is committed for the plan
              term. Even where withdrawals are allowed from balances, plan principal
              cannot be pulled out early. You may not be able to access money when you
              need it.
            </li>
            <li>
              <strong>Operational risk</strong> — outages, cyber-attacks, human error
              or provider failures interrupt the service or affect records.
            </li>
            <li>
              <strong>Behavioural risk</strong> — your own decisions: over-committing,
              chasing losses, reinvesting everything, or borrowing to invest.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">Position sizing: the loss you can survive</h2>
          <p>
            Before calculating how much you might <em>make</em>, decide how much you
            can afford to <em>lose</em>. That number — not the advertised return —
            should set your maximum commitment. If losing ₦20,000 would strain your
            rent or food budget, then ₦20,000 has no business in a high-risk plan,
            whatever its daily income says. Money for essential needs belongs in a
            regulated savings account, not in any earning platform.
          </p>
          <p>
            A useful discipline: treat any plan purchase as an expense that will
            probably return nothing. If that thought is uncomfortable, the amount is
            too large.
          </p>
        </section>

        {/* Article ad — between content sections */}
        <AdSenseAd placementId="ARTICLE_MID" />

        <section>
          <h2 className="text-2xl font-bold text-gray-900">Worked example: what ATOX plans really pay</h2>
          <p>
            Reading a &ldquo;daily income&rdquo; figure alone tells you little. Convert
            it into a percentage return so you can compare it with everything else in
            the world of finance. Two examples using the platform&apos;s published
            parameters (see the{" "}
            <Link href="/fees" className="text-emerald-600 underline">Fees page</Link>
            {" "}for the full table):
          </p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div>
              <p className="font-semibold text-gray-900">VIP 1</p>
              <p>
                Pay ₦3,000. Complete 20 daily ad tasks. Stated income ₦350/day for 15
                days → gross total ₦5,250. Gross profit = ₦2,250 on ₦3,000 ={" "}
                <strong>75% in 15 days</strong> — before the 10% withdrawal fee.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">VIP 3</p>
              <p>
                Pay ₦15,000. Stated income ₦1,000/day for 30 days → gross total
                ₦30,000. Gross profit = ₦15,000 on ₦15,000 ={" "}
                <strong>100% in 30 days</strong> — before the 10% withdrawal fee.
              </p>
            </div>
          </div>
          <p>
            Now annualise: 100% per month is roughly 3,000%+ per year compounded.
            Sustained returns of that scale do not exist in legitimate, regulated
            markets — they are far beyond what any real business operation can pay
            indefinitely. That does not mean the platform will fail; it means the
            probability of not receiving those returns over the long run is{" "}
            <strong>high</strong>, and the plans must be treated as high-risk
            speculation, not savings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">Scenario thinking</h2>
          <p>
            Before committing, ask three questions and answer them honestly: (1) What
            do I lose if the platform pays nothing from tomorrow? (2) What do I lose
            if withdrawals are delayed for weeks? (3) What do I lose if my account is
            suspended for a terms violation? If any answer threatens your living
            costs, the position is too big. Many participants on platforms like this
            are only safe because they sized for the worst case on day one.
          </p>
          <p>
            See the full list of platform-specific risks in the{" "}
            <Link href="/risk-disclosure" className="text-emerald-600 underline">Risk Disclosure</Link>,
            and the cost side of the equation in the{" "}
            <Link href="/fees" className="text-emerald-600 underline">Fees page</Link>.
            Guide 3 covers how to evaluate any opportunity — including this one —
            for red flags.
          </p>
        </section>
      </ArticleShell>
    </>
  );
}