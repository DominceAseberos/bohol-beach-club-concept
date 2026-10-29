import { useEffect, useMemo, useRef, useState } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { VirtualTourPlugin, type VirtualTourNode } from "@photo-sphere-viewer/virtual-tour-plugin";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/virtual-tour-plugin/index.css";

gsap.registerPlugin(ScrollTrigger);

type SceneId =
  | "beachfront"
  | "grounds"
  | "deluxe-room"
  | "beachview-suite"
  | "agotata"
  | "aquasports"
  | "bohol-tours"
  | "events";

type Scene = {
  id: SceneId;
  index: string;
  name: string;
  eyebrow: string;
  description: string;
  panorama: string;
  thumbnail: string;
  links: Array<{ nodeId: SceneId; yaw: number; pitch?: number }>;
};

const SCENES: Scene[] = [
  {
    id: "beachfront",
    index: "01",
    name: "Beachfront",
    eyebrow: "Private beach",
    description: "BBC's large private beach, powdery white sand and waters facing the Bohol Sea.",
    panorama: "/360/reconstructed/beachfront/beachfront-360-v3.png",
    thumbnail: "/images/beach-01.jpg",
    links: [
      { nodeId: "grounds", yaw: 0.08, pitch: -0.18 },
      { nodeId: "aquasports", yaw: -1.6, pitch: -0.2 },
    ],
  },
  {
    id: "grounds",
    index: "02",
    name: "Resort Grounds",
    eyebrow: "Space · privacy · solitude",
    description: "A resort layout described by BBC as maximizing space while giving guests freedom, privacy and solitude.",
    panorama: "/360/reconstructed/resort-grounds/resort-grounds-360-v4.png",
    thumbnail: "/images/tour-01.jpg",
    links: [
      { nodeId: "beachfront", yaw: 3.02, pitch: -0.18 },
      { nodeId: "deluxe-room", yaw: -0.72, pitch: -0.18 },
      { nodeId: "beachview-suite", yaw: 0.62, pitch: -0.18 },
      { nodeId: "agotata", yaw: 1.78, pitch: -0.18 },
    ],
  },
  {
    id: "deluxe-room",
    index: "03",
    name: "Deluxe Room",
    eyebrow: "80 rooms",
    description: "Deluxe Rooms look toward the swimming pool and beach, with access to the beach, pool and restaurants.",
    panorama: "/360/reconstructed/deluxe-room/deluxe-room-360-v4.png",
    thumbnail: "/images/room-01.jpg",
    links: [
      { nodeId: "grounds", yaw: 3.08, pitch: -0.18 },
      { nodeId: "beachview-suite", yaw: 0.68, pitch: -0.18 },
    ],
  },
  {
    id: "beachview-suite",
    index: "04",
    name: "Beachview Suite",
    eyebrow: "8 suites",
    description: "Beachview Suites are described by BBC as having unique views of the beach and Bohol Sea.",
    panorama: "/360/reconstructed/beachview-suite/beachview-suite-360-v4.png",
    thumbnail: "/images/room-03.jpg",
    links: [
      { nodeId: "grounds", yaw: -3.02, pitch: -0.18 },
      { nodeId: "deluxe-room", yaw: -0.72, pitch: -0.18 },
    ],
  },
  {
    id: "agotata",
    index: "05",
    name: "Agotata",
    eyebrow: "Food & beverage",
    description: "The resort's coffee shop serves breakfast, lunch and dinner from 6:00 AM to 10:00 PM.",
    panorama: "/360/reconstructed/agotata/agotata-360-v2.png",
    thumbnail: "/images/food-01.jpg",
    links: [
      { nodeId: "grounds", yaw: -2.42, pitch: -0.18 },
      { nodeId: "events", yaw: 0.88, pitch: -0.18 },
    ],
  },
  {
    id: "aquasports",
    index: "06",
    name: "Club Aquasports",
    eyebrow: "Aqua Sports",
    description: "Club Aquasports handles diving, leisure water sports, island hopping and other water-based activities.",
    panorama: "/360/reconstructed/aquasports/aquasports-360-v2.png",
    thumbnail: "/images/aqua-02.jpg",
    links: [
      { nodeId: "beachfront", yaw: 1.86, pitch: -0.18 },
      { nodeId: "bohol-tours", yaw: -0.56, pitch: -0.18 },
    ],
  },
  {
    id: "bohol-tours",
    index: "07",
    name: "Bohol Tours",
    eyebrow: "Tours & transportation",
    description: "The resort can arrange transfers, car hire with driver, guided tours and vehicle rentals around Bohol.",
    panorama: "/360/reconstructed/bohol-tours/bohol-tours-360-v2.png",
    thumbnail: "/images/tour-03.jpg",
    links: [
      { nodeId: "aquasports", yaw: 3.0, pitch: -0.18 },
      { nodeId: "events", yaw: 0.56, pitch: -0.18 },
    ],
  },
  {
    id: "events",
    index: "08",
    name: "Events",
    eyebrow: "Gatherings",
    description: "Event spaces include the beachfront Taclobo Pavilion, open-air Courtyard and Board Room.",
    panorama: "/360/reconstructed/events/events-360-v2.png",
    thumbnail: "/images/event-03.jpg",
    links: [
      { nodeId: "agotata", yaw: -2.18, pitch: -0.18 },
      { nodeId: "bohol-tours", yaw: 2.18, pitch: -0.18 },
    ],
  },
];

const sceneById = new Map<SceneId, Scene>(SCENES.map((scene) => [scene.id, scene]));

function ExpandIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3H3v5" /><path d="m3 3 6 6" />
      <path d="M16 3h5v5" /><path d="m21 3-6 6" />
      <path d="M8 21H3v-5" /><path d="m3 21 6-6" />
      <path d="M16 21h5v-5" /><path d="m21 21-6-6" />
    </svg>
  );
}

function PlusIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function MinusIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CompassIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z" />
    </svg>
  );
}

export function Resort360() {
  const pinWrapRef = useRef<HTMLDivElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const viewerElementRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const tourRef = useRef<VirtualTourPlugin | null>(null);
  const [activeId, setActiveId] = useState<SceneId>("beachfront");
  const [fullscreen, setFullscreen] = useState(false);
  const [isFullView, setIsFullView] = useState(false);
  const activeScene = sceneById.get(activeId) ?? SCENES[0];

  const isTouchDevice = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const nodes = useMemo<VirtualTourNode[]>(() => SCENES.map((scene) => ({
    id: scene.id,
    panorama: scene.panorama,
    thumbnail: scene.thumbnail,
    name: scene.name,
    caption: scene.name,
    description: scene.description,
    links: scene.links.map((link) => ({
      nodeId: link.nodeId,
      position: { yaw: link.yaw, pitch: link.pitch ?? -0.18 },
    })),
  })), []);

  useEffect(() => {
    if (!viewerElementRef.current) return;

    let viewer: Viewer | null = null;
    let disposed = false;
    const timer = window.setTimeout(() => {
      if (disposed || !viewerElementRef.current) return;

      viewer = new Viewer({
        container: viewerElementRef.current,
        defaultYaw: 0,
        defaultPitch: -0.02,
        defaultZoomLvl: 48,
        minFov: 35,
        maxFov: 95,
        mousewheel: false, // Prevents wheel scroll hijacking in page flow
        mousewheelCtrlKey: true, // Allows Ctrl + scroll zoom if desired
        touchmoveTwoFingers: isTouchDevice, // Touch screens: 1-finger scrolls page, 2-fingers pan/zoom
        navbar: false,
        plugins: [
          VirtualTourPlugin.withConfig({
            nodes,
            startNodeId: "beachfront",
            positionMode: "manual",
            renderMode: "3d",
            preload: false,
            showLinkTooltip: true,
            transitionOptions: {
              effect: "fade",
              speed: "12rpm",
              rotation: true,
              showLoader: true,
            },
            arrowsPosition: {
              minPitch: 0.24,
              maxPitch: 1.18,
              linkOverlapAngle: 0.42,
            },
          }),
        ],
      });

      viewerRef.current = viewer;

      const tour = viewer.getPlugin(VirtualTourPlugin) as VirtualTourPlugin;
      tourRef.current = tour;
      tour.addEventListener("node-changed", (event: { node: VirtualTourNode }) => {
        if (sceneById.has(event.node.id as SceneId)) setActiveId(event.node.id as SceneId);
      });
    }, 0);

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      viewerRef.current = null;
      tourRef.current = null;
      viewer?.destroy();
    };
  }, [nodes, isTouchDevice]);

  useEffect(() => {
    const onFullscreen = () => {
      const isFs = document.fullscreenElement === shellRef.current;
      setFullscreen(isFs);
      // In fullscreen mode, mousewheel zooms directly and 1-finger pans (since page scrolling is absent)
      viewerRef.current?.setOption("mousewheel", isFs);
      if (isTouchDevice) {
        viewerRef.current?.setOption("touchmoveTwoFingers", !isFs);
      }
    };
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, [isTouchDevice]);

  // GSAP ScrollTrigger: Pin the container, grow the map to full view, and hide the navbar
  useEffect(() => {
    if (!pinWrapRef.current || !shellRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsFullView(true);
      return;
    }

    const pinWrap = pinWrapRef.current;
    const shell = shellRef.current;

    const ctx = gsap.context(() => {
      const width = window.innerWidth;
      const isMobile = width <= 640;
      const isTablet = width > 640 && width <= 1024;

      const initialWidth = isMobile
        ? "calc(100% - 24px)"
        : isTablet
        ? "calc(100% - 48px)"
        : "min(1160px, calc(100% - 64px))";

      const initialHeight = isMobile
        ? "clamp(340px, 52svh, 440px)"
        : isTablet
        ? "min(58svh, 520px)"
        : "min(62svh, 560px)";

      const initialRadius = isMobile ? "16px" : isTablet ? "20px" : "24px";
      const pinDistance = isMobile ? 800 : isTablet ? 1000 : 1200;

      gsap.set(shell, {
        width: initialWidth,
        height: initialHeight,
        borderRadius: initialRadius,
        boxShadow: "0 24px 70px rgba(11, 16, 13, 0.22)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrap,
          start: "top top",
          end: `+=${pinDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: [0, 0.35, 1],
            duration: 0.45,
            delay: 0.1,
            ease: "power2.out",
          },
          onEnter: () => {
            document.body.classList.add("tour-active");
          },
          onEnterBack: () => {
            document.body.classList.add("tour-active");
            setIsFullView(true);
          },
          onLeave: () => {
            document.body.classList.remove("tour-active");
            setIsFullView(false);
          },
          onLeaveBack: () => {
            document.body.classList.remove("tour-active");
            setIsFullView(false);
          },
          onUpdate: (self) => {
            const isTourActive = self.progress > 0.02 && self.progress < 1;
            document.body.classList.toggle("tour-active", isTourActive);
            setIsFullView(self.progress >= 0.2);
            viewerRef.current?.autoSize();
          },
        },
      });

      // Growth phase: progress 0 to 0.3
      tl.to(shell, {
        width: "100%",
        height: "100%",
        borderRadius: "0px",
        boxShadow: "none",
        ease: "power2.out",
        duration: 0.3,
      });

      // Pinned full-view interactive phase: progress 0.3 to 1.0
      tl.to({}, { duration: 0.7 });

      ScrollTrigger.refresh();
    }, pinWrap);

    return () => {
      document.body.classList.remove("tour-active");
      ctx.revert();
    };
  }, []);

  const selectScene = (scene: Scene, event?: React.MouseEvent) => {
    setActiveId(scene.id);
    void tourRef.current?.setCurrentNode(scene.id, {
      effect: "fade",
      rotation: false,
      speed: 700,
      showLoader: true,
    });
    (event?.currentTarget as HTMLElement | undefined)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const toggleFullscreen = async () => {
    if (!shellRef.current) return;
    if (document.fullscreenElement === shellRef.current) await document.exitFullscreen();
    else await shellRef.current.requestFullscreen();
  };

  const zoomIn = () => {
    viewerRef.current?.zoomIn(12);
  };

  const zoomOut = () => {
    viewerRef.current?.zoomOut(12);
  };

  return (
    <section id="explore-360" className="tour-section">
      <div className="tour-heading section-space">
        <div>
          <div className="section-label">360 EXPLORATION</div>
          <h2>Move through the resort.</h2>
        </div>
        <div className="tour-heading-copy">
          <p>Discover the beach, rooms and gathering spaces. Use the floor arrows or scene rail to move between spaces.</p>
          <button
            type="button"
            className="text-link tour-jump-btn"
            onClick={() => {
              const target = pinWrapRef.current;
              if (!target) return;
              const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement, opts: object) => void } }).__lenis;
              const offsetDistance = window.innerWidth <= 640 ? 300 : window.innerWidth <= 1024 ? 360 : 420;
              if (lenis) {
                lenis.scrollTo(target, { offset: offsetDistance, duration: 0.95 });
              } else {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Snap to 360 Full View <ExpandIcon size={14} />
          </button>
        </div>
      </div>

      <div className="tour-pin-wrap" ref={pinWrapRef}>
        <div className="tour-stage">
          <div
            className={`tour-shell ${isFullView ? "is-fullview" : ""} ${fullscreen ? "is-fullscreen" : ""}`}
            ref={shellRef}
          >
            <div className="tour-viewer" ref={viewerElementRef} aria-label={`360 view: ${activeScene.name}`} />
            <div className="tour-vignette" aria-hidden="true" />

            <div className="tour-overlay">
              <div className="tour-current">
                <span>{activeScene.index} / 08</span>
                <p>{activeScene.eyebrow}</p>
                <h3>{activeScene.name}</h3>
                <div>{activeScene.description}</div>
              </div>
              <div className="tour-actions">
                <div className="tour-zoom-group" aria-label="Zoom controls">
                  <button
                    className="tour-zoom-btn"
                    type="button"
                    onClick={zoomIn}
                    aria-label="Zoom in 360 view"
                    title="Zoom in"
                  >
                    <PlusIcon size={16} />
                  </button>
                  <button
                    className="tour-zoom-btn"
                    type="button"
                    onClick={zoomOut}
                    aria-label="Zoom out 360 view"
                    title="Zoom out"
                  >
                    <MinusIcon size={16} />
                  </button>
                </div>
                <button
                  className="tour-expand"
                  type="button"
                  onClick={() => void toggleFullscreen()}
                  aria-label={fullscreen ? "Exit full screen 360 view" : "Open full screen 360 view"}
                >
                  <ExpandIcon size={18} />
                  <span>{fullscreen ? "EXIT FULL SCREEN" : "FULL SCREEN"}</span>
                </button>
              </div>
            </div>

            <div className="tour-instruction">
              <CompassIcon size={16} />
              <span>
                {isTouchDevice
                  ? (fullscreen ? "Drag to look around · tap arrows to move" : "Use two fingers to look around · tap arrows to move")
                  : "Drag to look around · select an arrow to move"}
              </span>
            </div>

            <div className="tour-rail" aria-label="360 resort scenes">
              {SCENES.map((scene) => (
                <button
                  type="button"
                  className={`tour-scene ${scene.id === activeId ? "active" : ""}`}
                  key={scene.id}
                  onClick={(e) => selectScene(scene, e)}
                  aria-pressed={scene.id === activeId}
                >
                  <img src={scene.thumbnail} alt="" />
                  <span>{scene.index}</span>
                  <strong>{scene.name}</strong>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
