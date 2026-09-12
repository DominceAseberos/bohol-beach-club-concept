import { useEffect, useMemo, useRef, useState } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { VirtualTourPlugin, type VirtualTourNode } from "@photo-sphere-viewer/virtual-tour-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/virtual-tour-plugin/index.css";

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
    panorama: "/360/beachfront.jpg",
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
    panorama: "/360/grounds.jpg",
    thumbnail: "/images/stay-02.jpg",
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
    panorama: "/360/deluxe-room.jpg",
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
    panorama: "/360/beachview-suite.jpg",
    thumbnail: "/images/room-02.jpg",
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
    panorama: "/360/agotata.jpg",
    thumbnail: "/images/food-02.jpg",
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
    panorama: "/360/aquasports.jpg",
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
    panorama: "/360/bohol-tours.jpg",
    thumbnail: "/images/tour-01.jpg",
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
    panorama: "/360/events.jpg",
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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3H3v5" /><path d="m3 3 6 6" />
      <path d="M16 3h5v5" /><path d="m21 3-6 6" />
      <path d="M8 21H3v-5" /><path d="m3 21 6-6" />
      <path d="M16 21h5v-5" /><path d="m21 21-6-6" />
    </svg>
  );
}

function CompassIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z" />
    </svg>
  );
}

export function Resort360() {
  const viewerElementRef = useRef<HTMLDivElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const tourRef = useRef<VirtualTourPlugin | null>(null);
  const [activeId, setActiveId] = useState<SceneId>("beachfront");
  const [fullscreen, setFullscreen] = useState(false);
  const activeScene = sceneById.get(activeId) ?? SCENES[0];

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
        mousewheel: true,
        touchmoveTwoFingers: false,
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

      const tour = viewer.getPlugin(VirtualTourPlugin) as VirtualTourPlugin;
      tourRef.current = tour;
      tour.addEventListener("node-changed", (event: { node: VirtualTourNode }) => {
        if (sceneById.has(event.node.id as SceneId)) setActiveId(event.node.id as SceneId);
      });
    }, 0);

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      tourRef.current = null;
      viewer?.destroy();
    };
  }, [nodes]);

  useEffect(() => {
    const onFullscreen = () => setFullscreen(document.fullscreenElement === shellRef.current);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  const selectScene = (scene: Scene) => {
    setActiveId(scene.id);
    void tourRef.current?.setCurrentNode(scene.id, {
      effect: "fade",
      rotation: false,
      speed: 700,
      showLoader: true,
    });
  };

  const toggleFullscreen = async () => {
    if (!shellRef.current) return;
    if (document.fullscreenElement === shellRef.current) await document.exitFullscreen();
    else await shellRef.current.requestFullscreen();
  };

  return (
    <section id="explore-360" className="tour-section">
      <div className="tour-heading section-space">
        <div>
          <div className="section-label">360 EXPLORATION</div>
          <h2>Move through the resort.</h2>
        </div>
        <div className="tour-heading-copy">
          <p>Explore reconstructed spherical scenes assembled from Bohol Beach Club's original website imagery. Use the floor arrows or scene rail to move between spaces.</p>
          <span>Private redesign concept · reconstructed imagery, not a survey-grade 360 capture.</span>
        </div>
      </div>

      <div className={`tour-shell ${fullscreen ? "is-fullscreen" : ""}`} ref={shellRef}>
        <div className="tour-viewer" ref={viewerElementRef} aria-label={`360 view: ${activeScene.name}`} />
        <div className="tour-vignette" aria-hidden="true" />

        <div className="tour-overlay">
          <div className="tour-current">
            <span>{activeScene.index} / 08</span>
            <p>{activeScene.eyebrow}</p>
            <h3>{activeScene.name}</h3>
            <div>{activeScene.description}</div>
          </div>
          <button className="tour-expand" type="button" onClick={() => void toggleFullscreen()} aria-label={fullscreen ? "Exit full screen 360 view" : "Open full screen 360 view"}>
            <ExpandIcon size={18} />
            <span>{fullscreen ? "EXIT FULL SCREEN" : "FULL SCREEN"}</span>
          </button>
        </div>

        <div className="tour-instruction"><CompassIcon size={16} /><span>Drag to look around · select an arrow to move</span></div>

        <div className="tour-rail" aria-label="360 resort scenes">
          {SCENES.map((scene) => (
            <button
              type="button"
              className={`tour-scene ${scene.id === activeId ? "active" : ""}`}
              key={scene.id}
              onClick={() => selectScene(scene)}
              aria-pressed={scene.id === activeId}
            >
              <img src={scene.thumbnail} alt="" />
              <span>{scene.index}</span>
              <strong>{scene.name}</strong>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
