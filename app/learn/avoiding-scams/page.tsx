import type { Metadata } from "next";
import Link from "next/link";
import ArticleShell from "@/components/marketing/ArticleShell";
import AdSenseAd from "@/components/ads/AdSenseAd";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Evaluating Opportunities and Avoiding Scams",
  description:
    "A practical framework for judging any earning platform: the sustainability math, transparency checks, common red flags of investment fraud, account-safety habits, and how to use ATOX's own published pages as evidence.",
  alternates: { canonical: `${SITE_URL}/learn/avoiding-scams` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Evaluating Opportunities and Avoiding Scams",
  description:
    "A practical framework for judging any earning platform: sustainability math, transparency checks, red flags, and account-safety habits.",
  author: { "@type": "Organization", name: SITE_NAME },
  publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  url: `${SITE_URL}/learn/avoiding-scams`,
  datePublished: "2026-10-18",
  inLanguage: "en",
};

const RED_FLAGS = [
  'Promises of guaranteed profit or "zero risk" — no legitimate investment can promise either.',
  "Returns that annualise into thousands of percent, with no believable explanation of where the money comes from.",
  'Pressure to "act now", limited slots, or fear that prices will rise tomorrow.',
  "Recruitment focus: the main pitch is about how much you earn from inviting others, not about the product itself.",
  "Payment only to personal accounts or wallets that change frequently — never to a stable, in-dashboard account.",
  "Anonymous teams, no verifiable operator identity, and evasive answers to basic questions.",
  "Fake social proof: invented testimonials, doctored payment screenshots, inflated member counts.",
  "Angry responses to any question about withdrawals or sustainability.",
];

export default function AvoidingScamsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleShell
        eyebrow="Guide 3 of 3"
        title="Evaluating Opportunities and Avoiding Scams"
        intro="Scams do not look like scams from the inside — they look like something everyone else is already profiting from. This guide gives you a repeatable checklist for judging any earning platform, including ATOX."
      >
        <section>
          <h2 className="text-2xl font-bold text-gray-900">Step 1 — Do the sustainability math</h2>
          <p>
            Take the advertised return, convert it to a monthly and yearly percentage,
            and ask how any real business could pay that forever. If the answer is
            &ldquo;it couldn&apos;t&rdquo;, then payouts must be coming from somewhere
            else — typically new participants&apos; money. That may work for a while;
            it cannot work indefinitely, and the people who join late almost always
            lose. Our{" "}
            <Link href="/learn/understanding-risk" className="text-emerald-600 underline">risk guide</Link>{" "}
            shows this calculation on real ATOX plan figures.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">Step 2 — Check what is published vs hidden</h2>
          <p>
            Legitimate operators publish costs, rules and risks before you pay. Use
            that standard on every platform — including this one. For ATOX, the
            evidence to check is public: exact plan prices and terms on the{" "}
            <Link href="/fees" className="text-emerald-600 underline">Fees page</Link>,
            withdrawal mechanics in the{" "}
            <Link href="/faq" className="text-emerald-600 underline">FAQ</Link>, the
            binding rules in the{" "}
            <Link href="/terms" className="text-emerald-600 underline">Terms</Link>,
            and the risks in the{" "}
            <Link href="/risk-disclosure" className="text-emerald-600 underline">Risk Disclosure</Link>.
            If a platform publishes none of this, or the numbers change depending on
            who you ask, walk away.
          </p>
        </section>

        {/* Article ad — between content sections */}
        <AdSenseAd placementId="ARTICLE_MID" />

        <section>
          <h2 className="text-2xl font-bold text-gray-900">Step 3 — Watch for these red flags</h2>
          <ul className="list-disc pl-6 space-y-2">
            {RED_FLAGS.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">Step 4 — Protect your account and money</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use a strong, unique password for the platform and never share it — ATOX staff will never ask for it.</li>
            <li>Send deposits only to the bank account displayed inside your own dashboard, never to details sent by third parties.</li>
            <li>Keep records: screenshots of transfers, withdrawal requests and support replies.</li>
            <li>Be sceptical of &ldquo;help&rdquo; groups and agents who ask for a fee to &ldquo;unlock&rdquo; withdrawals — real support never charges.</li>
            <li>Start with the smallest amount a platform allows; increase only after you have actually withdrawn successfully at least once.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">Step 5 — Decide with a cool head</h2>
          <p>
            The strongest protection is a rule you set before you are excited: decide
            in advance the maximum you will commit, the point at which you withdraw
            profits, and the condition under which you stop entirely (for example, one
            missed or delayed withdrawal). Write the rule down. People who lose the
            most on high-risk platforms are almost never the sceptics who sized small
            and left early — they are the believers who kept increasing their stakes.
          </p>
          <p>
            For the honest numbers behind any plan decision, read the{" "}
            <Link href="/fees" className="text-emerald-600 underline">Fees page</Link>{" "}
            and the{" "}
            <Link href="/learn/understanding-risk" className="text-emerald-600 underline">risk guide</Link>.
            Investing always carries risk — including the risk of doing nothing and
            letting inflation erode savings. The goal is not to eliminate risk, it is
            to take it knowingly, in sizes you can survive.
          </p>
        </section>

        {/* Article ad — near end of content */}
        <AdSenseAd placementId="ARTICLE_END" />
      </ArticleShell>
    </>
  );
}