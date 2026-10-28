/* Navigation in one place: the hall anchors on the home page and the app pages everywhere. */
export const HALL_LINKS = [
  { href: "#lore", label: "Legend" },
  { href: "#tokenomics", label: "Tokenomics" },
  { href: "#how-to-buy", label: "How to Buy" },
  { href: "#ledger", label: "Ledger" },
  { href: "#scroll", label: "Scroll", minor: true },
  { href: "#roadmap", label: "Roadmap", minor: true },
  { href: "#faq", label: "FAQ" },
];

export const APP_LINKS = [
  { href: "/coven", label: "Coven Ledger" },
  { href: "/pfp", label: "Portraits" },
  { href: "/token", label: "Token" },
  { href: "/docs", label: "Docs" },
];

export const FOOT_LINKS = [{ href: "/", label: "Castle hall" }, ...APP_LINKS, { href: "/terms", label: "Terms" }, { href: "/privacy", label: "Privacy" }];
