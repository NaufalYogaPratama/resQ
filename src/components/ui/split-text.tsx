"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

export default function SplitText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".char",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.03,
        }
      );
    }, root);
    return () => ctx.revert();
  }, [children]);

  const text = typeof children === "string" ? children : "";

  return (
    <div ref={root} className={cn("flex flex-wrap", className)}>
      {text.split("").map((char, index) => (
        <span key={index} className="char opacity-0">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}