import * as React from "react";
import Link from "@docusaurus/Link";
import { Card, CardContent } from "./card";

export interface CardItem {
  title: string;
  description: string;
  icon?: string; // Emoji or fallback label
  iconSvg?: React.ReactNode; // Optional SVG or React component
  href?: string;
}

interface CardGridProps {
  items: CardItem[];
}

export default function CardGrid({ items }: CardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8">
      {items.map((item, index) => {
        const content = (
          <Card className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer h-full">
            <CardContent className="h-full flex flex-col justify-between">
              <div>
                {/* Icon in Interstellar Purple via CSS variable */}
                <div className="mb-2 text-2xl text-[var(--ifm-color-primary)]">
                  {item.iconSvg ? item.iconSvg : item.icon ?? ""}
                </div>

                {/* Title in Interstellar Purple by default, but white fallback in dark mode if not a link */}
                <h3
                  className={
                    item.href
                      ? "text-base font-semibold mb-1 text-[var(--ifm-color-primary)]"
                      : "text-base font-semibold mb-1 text-[var(--ifm-color-primary)] dark:text-white"
                  }
                >
                  {item.title}
                </h3>

                {/* Description in black/white depending on theme */}
                <p className="text-sm text-black dark:text-white">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        );

        return item.href ? (
          <Link
            key={index}
            to={item.href}
            className="block h-full no-underline hover:no-underline"
          >
            {content}
          </Link>
        ) : (
          <div key={index}>{content}</div>
        );
      })}
    </div>
  );
}
