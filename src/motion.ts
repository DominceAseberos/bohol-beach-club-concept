import { useCallback, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

export function useSiteMotion() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      anchors: { offset: -72 },
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    const updateScrollTrigger = () => ScrollTrigger.update();
    const advanceLenis = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(advanceLenis);
    gsap.ticker.lagSmoothing(0);

    // Smart directional snap controller for interactive 360 tour section
    let isSnapping = false;
    let snapTimer: number | undefined;

    const handleScrollSnap = () => {
      if (isSnapping) return;
      const target = document.querySelector<HTMLElement>(".tour-shell, [data-snap-tour]");
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const topOffset = rect.top;
      const velocity = Math.abs(lenis.velocity);

      // Approaching down from above: top enters viewport from bottom
      const approachingDown = lenis.direction === 1 && topOffset > 25 && topOffset < viewportHeight * 0.55;
      // Approaching up from below: top returns from above
      const approachingUp = lenis.direction === -1 && topOffset < -25 && topOffset > -viewportHeight * 0.45;

      if ((approachingDown || approachingUp) && velocity < 0.75) {
        window.clearTimeout(snapTimer);
        snapTimer = window.setTimeout(() => {
          if (isSnapping) return;
          const currentRect = target.getBoundingClientRect();
          const currentTop = currentRect.top;
          const dir = lenis.direction;

          const shouldSnapDown = dir === 1 && currentTop > 15 && currentTop < viewportHeight * 0.6;
          const shouldSnapUp = dir === -1 && currentTop < -15 && currentTop > -viewportHeight * 0.5;

          if (shouldSnapDown || shouldSnapUp) {
            isSnapping = true;
            lenis.scrollTo(target, {
              offset: 0,
              duration: 0.85,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              onComplete: () => {
                window.setTimeout(() => {
                  isSnapping = false;
                }, 150);
              },
            });
          }
        }, 110);
      }
    };

    lenis.on("scroll", handleScrollSnap);

    const context = gsap.context(() => {
      gsap.fromTo(
        ".hero-content > *",
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.09, ease: "power3.out", delay: 0.15 },
      );

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        gsap.fromTo(
          element,
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: "none",
            scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 0.7 },
          },
        );
      });
    });

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      window.clearTimeout(snapTimer);
      lenis.off("scroll", handleScrollSnap);
      context.revert();
      gsap.ticker.remove(advanceLenis);
      lenis.off("scroll", updateScrollTrigger);
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = null;
    };
  }, []);

  return useCallback((target: string) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const offset = target === "#explore-360" ? 0 : -72;
    lenisRef.current?.scrollTo(target, { offset, duration: 1.05 });
  }, []);
}
