import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentification · Payment System",
  description: "Connexion et inscription au portefeuille Payment System",
};

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
