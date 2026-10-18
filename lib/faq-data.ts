/**
 * Single source of truth for the public FAQ.
 * Used by the FAQ page (accordion + FAQPage structured data).
 * Every answer reflects the platform's actual implemented behaviour.
 */
export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQS: FaqItem[] = [
  {
    question: "What is ATOX Investment Platform?",
    answer:
      "ATOX is a Nigeria-focused digital platform with three main services: (1) VIP investment plans that require completing daily ad-watching tasks in exchange for a stated daily income during the plan term, (2) a Watch and Earn programme that pays ₦10 per completed advertisement for users who have no active plan, and (3) mobile data and airtime purchases for MTN, Airtel, Glo and 9mobile from your dashboard balance.",
  },
  {
    question: "How do I get started?",
    answer:
      "Create a free account with your name, email and Nigerian phone number. To activate a plan, fund your wallet by bank transfer to the account shown in your dashboard and upload your payment screenshot — support confirms it before your balance is credited. Then choose a plan from your dashboard and start the daily tasks.",
  },
  {
    question: "What investment plans are available?",
    answer:
      "Plans range from VIP 1 (₦3,000 for 15 days, stated income ₦350/day) up to VIP 8 (₦1,000,000 for 30 days, stated income ₦43,333.33/day). Each plan lists its price, term, daily task count and stated income on the home page and again in your dashboard before purchase. Stated income is credited only on days when the daily tasks are completed — it is not a guaranteed return.",
  },
  {
    question: "Is the income from plans guaranteed?",
    answer:
      "No. Plan income depends on you completing the daily tasks and on the platform continuing to operate and pay out as described. No return on ATOX is guaranteed, and you should only participate with money you can afford to lose. Read the Risk Disclosure page for the full picture.",
  },
  {
    question: "How does Watch and Earn work?",
    answer:
      "If you have no active plan, open Watch and Earn from your dashboard, tap the watch button, view the short advertisement that opens, then watch the full video in the app and claim ₦10. You can repeat it as often as you like. Watch and Earn is disabled while a VIP plan is active, because plan members earn through their daily tasks instead.",
  },
  {
    question: "What are the deposit methods?",
    answer:
      "Deposits are made by bank transfer to the account displayed in your dashboard's recharge screen. After transferring, upload a screenshot of the payment. Support reviews it and credits your wallet once it is confirmed. Do not send money to any account that is not shown inside your dashboard.",
  },
  {
    question: "What are the withdrawal rules and fees?",
    answer:
      "The minimum withdrawal is ₦2,000. A 10% processing fee is deducted from every withdrawal (for example, a ₦10,000 withdrawal pays out ₦9,000). You can withdraw from your referral balance or task balance. Requests are submitted from the dashboard, reviewed, and paid to your registered bank details — they are not instant.",
  },
  {
    question: "How long do withdrawals take?",
    answer:
      "Withdrawal requests enter a pending state and are processed after review, typically within 24–48 hours on business days, though bank processing times can add delays. You can track the status of every request in your dashboard's withdrawal history.",
  },
  {
    question: "Can I cancel a plan or get a refund?",
    answer:
      "Plan purchases are final and non-refundable once activated. If you stop completing the daily tasks, you simply stop earning that day's income; the plan continues until its term ends. For disputes about a specific transaction, contact support with your registered email and the transaction details.",
  },
  {
    question: "How does the referral programme work?",
    answer:
      "Every account has an invitation code (visible in your dashboard). When someone registers with your code, they become a referral of yours and referral rewards are credited to your referral balance according to the programme rules shown in the dashboard. Referral income is not guaranteed and depends on real, active users.",
  },
  {
    question: "Can I create more than one account?",
    answer:
      "No. Each person may register only one account. Creating multiple accounts to exploit referrals or bonuses is prohibited under our Terms and Conditions and can lead to suspension and forfeiture of earnings.",
  },
  {
    question: "What happens if I miss a day of tasks?",
    answer:
      "You simply do not earn that day's income — the income is only credited on days when all required daily tasks are completed. Your plan keeps running until its term ends, so it is in your interest to complete the tasks every day while a plan is active.",
  },
  {
    question: "How do data and airtime purchases work?",
    answer:
      "From the Data and Airtime section of your dashboard, choose your network (MTN, Airtel, Glo or 9mobile), enter the phone number, pick a bundle or airtime amount, and pay from your wallet balance. Live prices and availability are shown at the point of purchase; the top-up is delivered electronically.",
  },
  {
    question: "Are my personal details and payments secure?",
    answer:
      "Accounts are secured with Firebase Authentication and data is stored in Google Firestore. Payment screenshots you upload are stored via Cloudinary. You are responsible for keeping your password confidential. No online system is completely secure, so also read our Privacy Policy.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Email support@atoxinvestmentplatform.com from your registered email address and include your user ID, the issue, and any relevant screenshot. You can also use the Customer Care section inside your dashboard. Common questions are already answered on this page.",
  },
];