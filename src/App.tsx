import { useEffect, useState } from "react";

type IconName = "arrow" | "calendar" | "menu" | "close" | "waves" | "pin" | "mail" | "phone" | "facebook" | "instagram";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h13" /><path d="m14 7 5 5-5 5" /></>,
    calendar: <><rect x="3.5" y="5.5" width="17" height="15" rx="2" /><path d="M7.5 3.5v4" /><path d="M16.5 3.5v4" /><path d="M3.5 10h17" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    close: <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>,
    waves: <><path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /><path d="M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /><path d="M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    phone: <path d="M7.5 3.5 10 7l-2 2c1.4 3 3.7 5.3 6.7 6.7l2-2 3.5 2.5c.3.2.4.6.2.9-1 1.9-2.6 3-4.5 3C9.2 20.1 3.9 14.8 3.9 8.1c0-1.9 1.1-3.5 3-4.5.3-.2.5-.2.6-.1Z" />,
    facebook: <path d="M14.2 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2H8v3h2.8v8h3.4Z" fill="currentColor" stroke="none" />,
    instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.8" r=".8" fill="currentColor" stroke="none" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

const BOOK_URL = "https://www.boholbeachclub.com.ph/reservation.html";

const stays = [
  {
    eyebrow: "80 rooms",
    title: "Deluxe Rooms",
    text: "Views of the swimming pool and beach, with convenient access to the beach, pool and restaurants.",
    image: "/images/room-01.jpg",
  },
  {
    eyebrow: "8 suites",
    title: "Beachview Suites",
    text: "Unique views of the beach and Bohol Sea, with spacious, bright interiors and convenient resort access.",
    image: "/images/room-02.jpg",
  },
];

const experiences = [
  { title: "Club Aquasports", text: "Diving, leisure water sports, island hopping, dolphin sightseeing and whale shark swimming are handled by Club Aquasports.", image: "/images/aqua-02.jpg" },
  { title: "Tours & Transportation", text: "Airport and seaport transfers, car hire with driver, guided tours and vehicle rentals can be arranged by the resort.", image: "/images/tour-01.jpg" },
  { title: "Events", text: "Facilities are available for corporate affairs, wedding functions, receptions, meetings and smaller gatherings.", image: "/images/event-02.jpg" },
];

const gallery = [
  "/images/beach-01.jpg",
  "/images/food-01.jpg",
  "/images/aqua-03.jpg",
  "/images/tour-03.jpg",
  "/images/event-01.jpg",
  "/images/stay-02.jpg",
];

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    ["ROOMS", "#stay"],
    ["FOOD", "#dining"],
    ["AQUASPORTS", "#experience"],
    ["TOURS", "#experience"],
    ["EVENTS", "#gather"],
    ["RATES", "https://www.boholbeachclub.com.ph/rates.html"],
    ["CONTACT US", "#contact"],
  ];

  return (
    <div className="site-shell">
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="Bohol Beach Club home">
          <img className="brand-logo" src="/images/brand-logo.png" alt="Bohol Beach Club" />
        </a>
        <nav className={`site-nav ${menuOpen ? "open" : ""}`} aria-label="Primary navigation">
          {nav.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <a className="header-book" href={BOOK_URL} target="_blank" rel="noreferrer"><Icon name="calendar" size={16} /> BOOK NOW</a>
        <button className="menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((value) => !value)}>
          <Icon name={menuOpen ? "close" : "menu"} size={21} />
        </button>
      </header>

      <main>
        <section id="top" className="hero">
          <video className="hero-image" autoPlay muted loop playsInline poster="/images/beach-01.jpg" aria-label="Bohol Beach Club resort video">
            <source src="/video/bbc2023-videobground.mp4" type="video/mp4" />
          </video>
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="kicker light">Experience the Best Beach Front in Panglao</p>
            <h1>It's about the whole experience.</h1>
            <p className="hero-copy">A large private beach with powdery white sand and pristine waters, with the resort layout designed around space, privacy and a relaxed stay.</p>
            <div className="hero-actions">
              <a className="button button-light" href="https://www.boholbeachclub.com.ph/rates.html#localrates" target="_blank" rel="noreferrer">VIEW LOCAL RESIDENT RATES <Icon name="arrow" size={17} /></a>
              <a className="button button-ghost" href={BOOK_URL} target="_blank" rel="noreferrer">BOOK NOW <Icon name="arrow" size={17} /></a>
              <a className="text-link light-link source-link" href="https://www.boholbeachclub.com.ph/" target="_blank" rel="noreferrer">Reference: original Home page <Icon name="arrow" size={16} /></a>
            </div>
          </div>
        </section>

        <section id="story" className="intro section-space">
          <div className="section-label">BOHOL BEACH CLUB</div>
          <div className="intro-grid">
            <h2>Experience the Best Beach Front in Panglao</h2>
            <div className="intro-copy">
              <p>After a major renovation, the resort reopened with new rooms, new suites and modern facilities. Its layout maximizes space while emphasizing freedom, privacy and solitude.</p>
              <p>BBC also highlights its large private beach, powdery white sand, pristine waters and generous breathing space away from crowds and distractions.</p>
              <a className="text-link source-link" href="https://www.boholbeachclub.com.ph/" target="_blank" rel="noreferrer">Reference: original Home page <Icon name="arrow" size={16} /></a>
            </div>
          </div>
          <figure className="wide-figure">
            <img src="/images/hero-beach.jpg" alt="Beachfront setting at Bohol Beach Club" />
          </figure>
        </section>

        <section id="awards" className="awards-section section-space">
          <div className="awards-heading">
            <div className="section-label">Awards & Certifications</div>
            <a className="text-link source-link" href="https://www.boholbeachclub.com.ph/" target="_blank" rel="noreferrer">Reference: original Home page <Icon name="arrow" size={16} /></a>
          </div>
          <div className="awards-grid" aria-label="Bohol Beach Club awards and certifications">
            <img src="/images/awards/award-asean-2024-2026.png" alt="ASEAN award 2024–2026" />
            <img src="/images/awards/award-goldcgsp-2026.png" alt="Gold CGSP 2026 award" />
            <img src="/images/awards/award-tripbest-2026.png" alt="Tripadvisor Best 2026 award" />
            <img src="/images/awards/awards-dot.png" alt="Department of Tourism award and certification" />
          </div>
        </section>

        <section id="film" className="film-section section-space">
          <div className="film-copy">
            <div className="section-label light">BOHOL BEACH CLUB 2023</div>
            <h2>Bohol Beach Club 2023</h2>
            <p>Official YouTube video embedded on Bohol Beach Club's original homepage.</p>
            <div className="film-meta">
              <span>Bohol Beach Club 2023</span>
              <span>Pinoys Interactive</span>
            </div>
            <a className="text-link light-link" href="https://www.youtube.com/watch?v=y1x-oKYCStw" target="_blank" rel="noreferrer">Watch on YouTube <Icon name="arrow" size={16} /></a>
            <a className="text-link light-link source-link" href="https://www.boholbeachclub.com.ph/" target="_blank" rel="noreferrer">Reference: original Home page <Icon name="arrow" size={16} /></a>
          </div>
          <div className="film-player">
            <iframe
              src="https://www.youtube-nocookie.com/embed/y1x-oKYCStw?rel=0&modestbranding=1"
              title="Bohol Beach Club 2023"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </section>

        <section id="stay" className="stay-section section-space">
          <div className="section-head">
            <div><div className="section-label">ROOMS</div><h2>Our Rooms</h2></div>
            <p>The resort has 88 rooms: 80 Deluxe Rooms and 8 Beachview Suites. Rooms are spacious and bright, with modern colors, wooden furniture and local handicraft.</p>
          </div>
          <div className="stay-grid">
            {stays.map((stay, index) => (
              <article className="stay-card" key={stay.title}>
                <img src={stay.image} alt={stay.title} />
                <div className="stay-card-copy">
                  <span>{stay.eyebrow}</span>
                  <h3>{stay.title}</h3>
                  <p>{stay.text}</p>
                  <a className="text-link" href={BOOK_URL} target="_blank" rel="noreferrer">BOOK NOW <Icon name="arrow" size={15} /></a>
                  <a className="text-link source-link" href="https://www.boholbeachclub.com.ph/rooms.html" target="_blank" rel="noreferrer">Reference: Rooms page <Icon name="arrow" size={15} /></a>
                </div>
                <div className="stay-number">0{index + 1}</div>
              </article>
            ))}
          </div>
          <div className="image-ribbon">
            <img src="/images/room-03.jpg" alt="Guest room interior" />
            <img src="/images/stay-01.jpg" alt="Resort stay detail" />
            <img src="/images/stay-03.jpg" alt="Bohol Beach Club accommodation" />
          </div>
        </section>

        <section id="dining" className="editorial-split section-space">
          <div className="editorial-image-stack">
            <img className="editorial-main" src="/images/food-02.jpg" alt="Dining at Bohol Beach Club" />
            <img className="editorial-inset" src="/images/food-03.jpg" alt="Resort food and beverage" />
          </div>
          <div className="editorial-copy">
            <div className="section-label">FOOD</div>
            <h2>Food & Beverage</h2>
            <p>Agotata is the resort's coffee shop, open from 6:00 AM to 10:00 PM, serving breakfast, lunch and dinner with local favorites and international fare.</p>
            <dl className="quiet-list">
              <div><dt>Coffee shop</dt><dd>Agotata</dd></div>
              <div><dt>Hours</dt><dd>6:00 AM – 10:00 PM</dd></div>
              <div><dt>Room service</dt><dd>6:00 AM – 10:00 PM</dd></div>
            </dl>
            <a className="text-link source-link" href="https://www.boholbeachclub.com.ph/food.html" target="_blank" rel="noreferrer">Reference: Food page <Icon name="arrow" size={16} /></a>
          </div>
        </section>

        <section id="experience" className="experience-section section-space">
          <div className="section-head experience-head">
            <div><div className="section-label">AQUASPORTS · TOURS</div><h2>Aqua Sports</h2></div>
            <p>Club Aquasports handles diving and water activities, while the resort can arrange transfers, car hire, guided tours and vehicle rentals for exploring Bohol.</p>
          </div>
          <div className="experience-grid">
            {experiences.map((experience, index) => (
              <article className={`experience-card experience-${index + 1}`} key={experience.title}>
                <img src={experience.image} alt={experience.title} />
                <div className="experience-overlay" />
                <div className="experience-copy"><span>0{index + 1}</span><h3>{experience.title}</h3><p>{experience.text}</p></div>
              </article>
            ))}
          </div>
          <div className="section-sources"><a className="text-link source-link" href="https://www.boholbeachclub.com.ph/aquasports.html" target="_blank" rel="noreferrer">Reference: Aqua Sports page <Icon name="arrow" size={16} /></a><a className="text-link source-link" href="https://www.boholbeachclub.com.ph/tours.html" target="_blank" rel="noreferrer">Reference: Tours & Transportation page <Icon name="arrow" size={16} /></a></div>
        </section>

        <section id="gather" className="gather-section">
          <img src="/images/event-03.jpg" alt="Events at Bohol Beach Club" />
          <div className="gather-shade" />
          <div className="gather-content">
            <div className="section-label light">EVENTS</div>
            <h2>Events</h2>
            <p>The resort's event facilities include the beachfront Taclobo Pavilion, the open-air Courtyard, and a Board Room for smaller meetings and gatherings.</p>
            <a className="button button-light" href="mailto:fandb.coordinator@boholbeachclub.com.ph">BANQUET & WEDDINGS <Icon name="arrow" size={17} /></a>
            <a className="text-link light-link source-link" href="https://www.boholbeachclub.com.ph/events.html" target="_blank" rel="noreferrer">Reference: Events page <Icon name="arrow" size={16} /></a>
          </div>
        </section>

        <section className="gallery-section section-space">
          <div className="section-head">
            <div><div className="section-label">A closer look</div><h2>Beach, table, water, island.</h2></div>
            <div><p>A small selection from the resort's public visual library, used here for a private redesign concept.</p><a className="text-link source-link" href="https://www.boholbeachclub.com.ph/" target="_blank" rel="noreferrer">Reference: original website <Icon name="arrow" size={16} /></a></div>
          </div>
          <div className="gallery-grid">
            {gallery.map((src, index) => <img key={src} className={`gallery-${index + 1}`} src={src} alt="Bohol Beach Club resort scene" />)}
          </div>
        </section>

        <section id="contact" className="contact-section section-space">
          <div className="contact-panel">
            <div className="section-label light">CONTACT US</div>
            <h2>Contact Us</h2>
            <p>Bo. Bolod, Island of Panglao, Bohol, Philippines 6340. Room reservations are available through the official reservation page and reservations team.</p>
            <div className="contact-actions">
              <a className="button button-light" href={BOOK_URL} target="_blank" rel="noreferrer"><Icon name="calendar" size={17} /> Book now</a>
              <a className="contact-link" href="mailto:reservations@boholbeachclub.com.ph"><Icon name="mail" size={17} /> reservations@boholbeachclub.com.ph</a>
              <a className="contact-link" href="tel:+639274527054"><Icon name="phone" size={17} /> +63 927 452 7054</a>
              <a className="contact-link source-link" href="https://www.boholbeachclub.com.ph/contact.html" target="_blank" rel="noreferrer">Reference: Contact Us page <Icon name="arrow" size={16} /></a>
            </div>
          </div>
          <div className="contact-meta">
            <div><Icon name="pin" size={18} /><span>Bo. Bolod, Island of Panglao<br />Bohol, Philippines 6340</span></div>
            <div className="contact-image"><img src="/images/beach-02.jpg" alt="Panglao beachfront" /></div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand"><img className="footer-logo" src="/images/brand-logo.png" alt="Bohol Beach Club" /></div>
        <p>Private redesign concept generated from public resort research. Source imagery remains reference-only unless separately licensed or approved.</p>
        <div className="footer-links">
          <div className="social-links" aria-label="Bohol Beach Club social links">
            <a href="https://www.facebook.com/boholbeachclubresort" target="_blank" rel="noreferrer" aria-label="Bohol Beach Club on Facebook"><Icon name="facebook" size={20} /></a>
            <a href="https://www.instagram.com/boholbeachclub" target="_blank" rel="noreferrer" aria-label="Bohol Beach Club on Instagram"><Icon name="instagram" size={20} /></a>
          </div>
          <a href="https://www.boholbeachclub.com.ph/" target="_blank" rel="noreferrer">Original website</a>
        </div>
      </footer>
    </div>
  );
}
