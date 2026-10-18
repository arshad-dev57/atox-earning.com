import type { Metadata } from "next";
import Link from "next/link";
import ArticleShell from "@/components/marketing/ArticleShell";
import AdSenseAd from "@/components/ads/AdSenseAd";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Investment Basics: How Investing and Risk Work",
  description:
    "A plain-language introduction to investing: what an investment is, why risk and return are linked, time horizon, compounding, diversification, and the questions to ask before committing money to any opportunity.",
  alternates: { canonical: `${SITE_URL}/learn/investment-basics` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Investment Basics: How Investing and Risk Work",
  description:
    "A plain-language introduction to investing: risk and return, time horizon, compounding, diversification, and questions to ask before committing money.",
  author: { "@type": "Organization", name: SITE_NAME },
  publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  url: `${SITE_URL}/learn/investment-basics`,
  datePublished: "2026-10-18",
  inLanguage: "en",
};

export default function InvestmentBasicsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleShell
        eyebrow="Guide 1 of 3"
        title="Investment Basics: How Investing and Risk Work"
        intro="Before putting money into any opportunity — on ATOX or anywhere else — it helps to understand what investing actually is, why risk and return travel together, and which questions separate a considered decision from a hopeful one."
      >
        <section>
          <h2 className="text-2xl font-bold text-gray-900">What &ldquo;investment&rdquo; really means</h2>
          <p>
            An investment is money you commit today to an opportunity in the hope of
            receiving more money later. That hope is never a certainty. Every
            investment is a trade-off: you give up certain use of your money now in
            exchange for an <em>expected</em> future return. If the expectation does
            not materialise, you earn nothing — and if the opportunity fails entirely,
            you can lose part or all of the money you committed.
          </p>
          <p>
            This applies equally to shares, business ventures, crypto, cooperative
            contributions, and fixed-plan products like those on ATOX. The label does
            not change the underlying logic: risk exists, and it must be understood
            before, not after, the money leaves your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">Risk and return are linked</h2>
          <p>
            The single most useful idea in finance is this: higher expected returns
            almost always come with higher risk. A savings account pays little
            because it is safe; a new venture promises much more because most new
            ventures fail. When an opportunity advertises very high daily or monthly
            returns, that number is not free money — it is a signal that the risk of
            not being paid is substantial.
          </p>
          <p>
            A practical test: ask what the opportunity does with your money to
            generate the promised return. If there is no clear, believable answer —
            real revenue from real activity — then the return depends entirely on new
            participants paying in, which is not a sustainable model.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">Time horizon and compounding</h2>
          <p>
            Your time horizon is how long you can leave money committed without
            needing it back. Money you will need soon (rent, school fees, emergencies)
            should never be exposed to investment risk, no matter how attractive the
            return looks.
          </p>
          <p>
            Compounding means returns earning returns over time. For example, ₦100,000
            growing at a modest 5% per year becomes about ₦162,889 after 10 years —
            without any further deposits. Compounding works powerfully in your favour
            with patient, sustainable returns, and it works just as powerfully against
            you when people chase high short-term yields that later collapse.
          </p>
        </section>

        {/* Article ad — between content sections */}
        <AdSenseAd placementId="ARTICLE_MID" />

        <section>
          <h2 className="text-2xl font-bold text-gray-900">Diversification and position sizing</h2>
          <p>
            Diversification means not tying up everything in one opportunity.
            Position sizing means deciding, in advance, how much of your total money
            a single opportunity is allowed to consume. A common personal rule: no
            single high-risk opportunity should hold more than a small fraction of your
            investable funds — money that would hurt to lose belongs in a regulated
            savings vehicle, not in high-yield plans.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">Questions to ask before any investment</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Who runs this, and can I verify their identity?</li>
            <li>What concrete activity generates the returns?</li>
            <li>What are ALL the costs — entry fees, processing fees, minimums?</li>
            <li>How do I get my money out, how long does it take, and what can block it?</li>
            <li>What happens if I need my money early?</li>
            <li>Is the promised return realistic compared with ordinary benchmarks?</li>
            <li>What do independent sources say — not the platform&apos;s own testimonials?</li>
          </ul>
          <p>
            On ATOX, several of these have published answers: plan terms and fees on
            the{" "}
            <Link href="/fees" className="text-emerald-600 underline">Fees page</Link>,
            mechanics on the{" "}
            <Link href="/faq" className="text-emerald-600 underline">FAQ</Link>, and
            risks on the{" "}
            <Link href="/risk-disclosure" className="text-emerald-600 underline">Risk Disclosure</Link>.
            Use all three — plus your own judgement — before activating a plan. Next:
            Guide 2 explains how to size the risk and calculate what a plan really
            pays.
          </p>
        </section>

        {/* Article ad — near end of content */}
        <AdSenseAd placementId="ARTICLE_END" />
      </ArticleShell>
    </>
  );
}