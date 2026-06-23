/**
 * Footer — Lotius
 * Design: Minimal, hairline top border, small label caps
 */
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer
      data-section="footer"
      style={{
        borderTop: `0.5px solid ${isDark ? "oklch(0.97 0 0 / 0.12)" : "oklch(0.08 0 0 / 0.15)"}`,
        padding: "2rem 1.5rem",
        marginTop: "auto",
        background: isDark ? "oklch(0.07 0 0)" : "transparent",
        transition: "border-color 450ms cubic-bezier(0.23,1,0.32,1), background 450ms cubic-bezier(0.23,1,0.32,1)",
      }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-4"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <div className="flex flex-wrap gap-6">
          <a href="#" className="label-caps" style={{ opacity: 0.45 }}>Legal Terms</a>
          <a href="#" className="label-caps" style={{ opacity: 0.45 }}>Terms &amp; Conditions</a>
          <a href="#" className="label-caps" style={{ opacity: 0.45 }}>Personal Data</a>
          <a href="#" className="label-caps" style={{ opacity: 0.45 }}>Accessibility</a>
          <Link href="/discover">
            <span className="label-caps" style={{ opacity: 0.45 }}>Sitemap</span>
          </Link>
        </div>
        <span className="label-caps" style={{ opacity: 0.3 }}>
          © {new Date().getFullYear()} Lotius. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
