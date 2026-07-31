"use client";

import { createElement, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; rootMargin?: string; once?: boolean }
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (options?.once !== false) io.unobserve(entry.target);
          } else if (options?.once === false) {
            setInView(false);
          }
        });
      },
      {
        threshold: options?.threshold ?? 0.12,
        rootMargin: options?.rootMargin ?? "0px 0px -8% 0px",
      }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [options?.threshold, options?.rootMargin, options?.once]);

  return { ref, inView };
}

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/** Reveals children with a restrained fade-up once they enter the viewport. */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLElement>();

  return createElement(
    as,
    {
      ref,
      className: cn(
        "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
        inView || reduced ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      ),
      style: { transitionDelay: `${delay}ms` },
    },
    children
  );
}

interface RevealGroupProps {
  children: React.ReactNode;
  className?: string;
  /** Base delay applied to the whole group. */
  delay?: number;
  /** Delay increment applied per child. */
  stagger?: number;
}

/** Wraps children and applies an incremental reveal delay to each one. */
export function RevealGroup({ children, className, delay = 0, stagger = 90 }: RevealGroupProps) {
  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, i) =>
            child == null ? null : (
              <Reveal key={i} delay={delay + i * stagger}>
                {child}
              </Reveal>
            )
          )
        : children}
    </div>
  );
}
