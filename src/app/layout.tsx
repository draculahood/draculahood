import type { Metadata, Viewport } from "next";
import { Creepster, Crimson_Pro, Special_Elite } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/config/brand";
import { JsonLd } from "@/components/JsonLd";
import { ChainProvider } from "@/components/providers/ChainProvider";
import { WalletModalProvider } from "@/components/wallet/WalletButton";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { Toast } from "@/components/site/Toast";
import { HOME_DESCRIPTION, HOME_TITLE, siteLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: { default: HOME_TITLE, template: `%s | ${BRAND.name}` },
  description: HOME_DESCRIPTION,
  applicationName: BRAND.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: BRAND.url, siteName: BRAND.name, title: HOME_TITLE, description: HOME_DESCRIPTION, locale: "en_US" },
  twitter: { card: "summary_large_image", site: BRAND.xHandle, creator: BRAND.xHandle, title: HOME_TITLE, description: HOME_DESCRIPTION },
};

const creepster = Creepster({ subsets: ["latin"], weight: "400", variable: "--font-creepster", display: "swap" });
const crimson = Crimson_Pro({ subsets: ["latin"], weight: ["400", "600"], style: ["normal", "italic"], variable: "--font-crimson", display: "swap" });
const elite = Special_Elite({ subsets: ["latin"], weight: "400", variable: "--font-elite", display: "swap" });

export const viewport: Viewport = { themeColor: "#040605", colorScheme: "dark", viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${creepster.variable} ${crimson.variable} ${elite.variable}`}>
      <head>
        <JsonLd data={siteLd} />
      </head>
      <body>
        <WalletProvider>
          <WalletModalProvider>
            <ChainProvider>
              {children}
              <Toast />
            </ChainProvider>
          </WalletModalProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
