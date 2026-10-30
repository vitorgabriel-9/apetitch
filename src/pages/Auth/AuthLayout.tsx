import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import "./Auth.css";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkTo: string;
  footerLinkLabel: string;
  children: ReactNode;
}

export function AuthLayout({
  title,
  subtitle,
  footerText,
  footerLinkTo,
  footerLinkLabel,
  children,
}: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <div className="logo">apetitch</div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        {children}

        <div className="auth-footer">
          <span>{footerText}</span>
          <Link to={footerLinkTo}>{footerLinkLabel}</Link>
        </div>
      </section>
    </main>
  );
}