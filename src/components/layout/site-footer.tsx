import Link from "next/link";
import { siteConfig } from "@/constants/site";

export default function SiteFooter() {
  const { author } = siteConfig;

  return (
    <footer className="mt-auto border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-muted-foreground sm:flex-row">
        <p>
          Built by{" "}
          <span className="font-medium text-foreground">{author.name}</span>
        </p>
       
      </div>
    </footer>
  );
}
