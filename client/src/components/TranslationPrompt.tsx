import React from "react";
import { useLanguage, LANGUAGE_NAMES } from "@/contexts/LanguageContext";
import { X } from "lucide-react";

export function TranslationPrompt() {
  const { showTranslationPrompt, dismissTranslationPrompt, setLanguage, detectedLanguage } = useLanguage();

  if (!showTranslationPrompt || !detectedLanguage) return null;

  const handleTranslate = () => {
    setLanguage(detectedLanguage);
    // Reload page to apply translation via Google Translate
    window.location.reload();
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 50,
        maxWidth: "320px",
        animation: "slideInUp 400ms cubic-bezier(0.23, 1, 0.32, 1) both",
      }}
    >
      <div
        style={{
          background: "var(--background)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "1.25rem",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "0.75rem",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--foreground)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Language Detected
          </h3>
          <button
            onClick={dismissTranslationPrompt}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--muted-foreground)",
              transition: "color 200ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)";
            }}
          >
            <X size={18} />
          </button>
        </div>

        <p
          style={{
            margin: "0 0 1rem 0",
            fontSize: "13px",
            color: "var(--muted-foreground)",
            lineHeight: 1.5,
          }}
        >
          We detected your device is set to{" "}
          <strong style={{ color: "var(--foreground)" }}>
            {LANGUAGE_NAMES[detectedLanguage]}
          </strong>
          . Would you like us to translate the website?
        </p>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
          }}
        >
          <button
            onClick={handleTranslate}
            style={{
              flex: 1,
              padding: "0.625rem 1rem",
              background: "var(--foreground)",
              color: "var(--background)",
              border: "none",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 200ms cubic-bezier(0.23, 1, 0.32, 1)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            Translate
          </button>
          <button
            onClick={dismissTranslationPrompt}
            style={{
              flex: 1,
              padding: "0.625rem 1rem",
              background: "transparent",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 200ms cubic-bezier(0.23, 1, 0.32, 1)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--muted)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            Keep English
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
