export type Plan = {
  id: string;
  name: string;
  ads: number;
  price: number;
  term: string;
  durationDays: number;
  dailyIncome: number;
  totalIncome: number;
  color: string;
  badge: string;
};

export const PLANS: Plan[] = [
  {
    id: "vip1",
    name: "VIP 1",
    ads: 20,
    price: 3000,
    term: "15 days",
    durationDays: 15,
    dailyIncome: 350,
    totalIncome: 5250,
    color: "from-emerald-500 to-green-600",
    badge: "Starter",
  },
  {
    id: "vip2",
    name: "VIP 2",
    ads: 15,
    price: 7000,
    term: "15 days",
    durationDays: 15,
    dailyIncome: 750,
    totalIncome: 11250,
    color: "from-blue-500 to-indigo-600",
    badge: "Basic",
  },
  {
    id: "vip3",
    name: "VIP 3",
    ads: 15,
    price: 15000,
    term: "30 days",
    durationDays: 30,
    dailyIncome: 1000,
    totalIncome: 30000,
    color: "from-purple-500 to-pink-600",
    badge: "Standard",
  },
  {
    id: "vip4",
    name: "VIP 4",
    ads: 15,
    price: 35000,
    term: "30 days",
    durationDays: 30,
    dailyIncome: 1400,
    totalIncome: 42000,
    color: "from-orange-500 to-red-600",
    badge: "Advanced",
  },
  {
    id: "vip5",
    name: "VIP 5",
    ads: 15,
    price: 75000,
    term: "30 days",
    durationDays: 30,
    dailyIncome: 15000,
    totalIncome: 150000,
    color: "from-rose-500 to-pink-700",
    badge: "Premium",
  },
  {
    id: "vip6",
    name: "VIP 6",
    ads: 15,
    price: 100000,
    term: "30 days",
    durationDays: 30,
    dailyIncome: 25000,
    totalIncome: 300000,
    color: "from-yellow-500 to-amber-600",
    badge: "Elite",
  },
  {
    id: "vip7",
    name: "VIP 7",
    ads: 20,
    price: 500000,
    term: "30 days",
    durationDays: 30,
    dailyIncome: 25000,
    totalIncome: 750000,
    color: "from-yellow-500 to-amber-600",
    badge: "Elite",
  },
  {
    id: "vip8",
    name: "VIP 8",
    ads: 20,
    price: 1000000,
    term: "30 days",
    durationDays: 30,
    dailyIncome: 43333.33,
    totalIncome: 1300000,
    color: "from-yellow-500 to-amber-600",
    badge: "Elite",
  },
];

export const PLANS_BY_ID = Object.fromEntries(PLANS.map((p) => [p.id, p])) as Record<
  string,
  Plan
>;

export function getPlan(productId: string): Plan | undefined {
  return PLANS_BY_ID[productId];
}
