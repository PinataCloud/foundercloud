import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Founder Cloud",
	description: "Yap like your SaaS depended on it",
	icons: {
		apple: "/favicon.ico",
		shortcut: "/favicon.ico",
		icon: "/favicon.ico",
	},
	openGraph: {
		title: "Founder Cloud",
		description: "Yap like your SaaS depended on it",
		url: "https://foundercloud.live",
		siteName: "Founder Cloud",
		images: ["https://www.foundercloud.live/og.png"],
	},
	twitter: {
		card: "summary_large_image",
		title: "Founder Cloud",
		description: "Clean and simple code sharing",
		images: ["https://www.foundercloud.live/og.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
