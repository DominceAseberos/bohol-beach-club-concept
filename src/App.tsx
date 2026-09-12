import { useEffect, useState } from "react";

type IconName = "arrow" | "calendar" | "menu" | "close" | "waves" | "pin" | "mail" | "phone";

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
  };
  return <svg {...common}>{paths[name]}</svg>;
}

const BOOK_URL = "https://www.boholbeachclub.com.ph/reservation.html";

const stays = [
  {
    eyebrow: "80 rooms",
    title: "Deluxe Rooms",
    text: "Comfortable island rooms designed for easy beach days, slow mornings, and family stays close to the shore.",
    image: "/images/room-01.jpg",
  },
  {
    eyebrow: "8 suites",
    title: "Beachview Suites",
    text: "A more intimate stay with a stronger connection to the sea and the resort's long private beachfront.",
    image: "/images/room-02.jpg",
  },
];

const experiences = [
  { title: "Club Aquasports", text: "Diving, island hopping, and water activities organized from the resort.", image: "/images/aqua-02.jpg" },
  { title: "Bohol by land", text: "Resort-arranged transportation and guided trips across the island.", image: "/images/tour-01.jpg" },
  { title: "Gather by the sea", text: "Wedding and corporate functions framed by gardens, palms, and open water.", image: "/images/event-02.jpg" },
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
    ["Stay", "#stay"],
    ["Dining", "#dining"],
    ["Experience", "#experience"],
    ["Gather", "#gather"],
    ["Contact", "#contact"],
  ];

  return (
    <div className="site-shell">
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="Bohol Beach Club home">
          <img className="brand-logo" src="/images/brand-logo.png" alt="Bohol Beach Club" />
        </a>
        <nav className={`site-nav ${menuOpen ? "open" : ""}`} aria-label="Primary navigation">
          {nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <a className="header-book" href={BOOK_URL} target="_blank" rel="noreferrer"><Icon name="calendar" size={16} /> Book your stay</a>
        <button className="menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((value) => !value)}>
          <Icon name={menuOpen ? "close" : "menu"} size={21} />
        </button>
      </header>

      <main>
        <section id="top" className="hero">
          <img className="hero-image" src="/images/beach-01.jpg" alt="Bohol Beach Club beachfront" />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="kicker light">Private beachfront · Panglao Island</p>
            <h1>Come for the beach.<br />Stay for the whole experience.</h1>
            <p className="hero-copy">A quieter way to experience Panglao—long beach mornings, relaxed island dining, and days that move naturally between the water and the shade.</p>
            <div className="hero-actions">
              <a className="button button-light" href={BOOK_URL} target="_blank" rel="noreferrer">Reserve a room <Icon name="arrow" size={17} /></a>
              <a className="text-link light-link" href="#story">Explore the resort <Icon name="arrow" size={16} /></a>
            </div>
          </div>
          <div className="hero-facts" aria-label="Resort facts">
            <div><strong>88</strong><span>rooms & suites</span></div>
            <div><strong>Private</strong><span>beachfront</span></div>
            <div><strong>Panglao</strong><span>Bohol, Philippines</span></div>
          </div>
        </section>

        <section id="story" className="intro section-space">
          <div className="section-label">Bohol, slowly</div>
          <div className="intro-grid">
            <h2>A classic Panglao beach resort, reframed around what matters most.</h2>
            <div className="intro-copy">
              <p>Bohol Beach Club brings together a long private stretch of sand, 88 rooms, island dining, watersports, tours, and spaces for celebrations. The idea is simple: make every part of the stay feel close to the beach.</p>
              <a className="text-link" href="#stay">Discover the stay <Icon name="arrow" size={16} /></a>
            </div>
          </div>
          <figure className="wide-figure">
            <img src="/images/hero-beach.jpg" alt="Beachfront setting at Bohol Beach Club" />
          </figure>
        </section>

        <section id="film" className="film-section section-space">
          <div className="film-copy">
            <div className="section-label light">The resort on film</div>
            <h2>See Bohol Beach Club in motion.</h2>
            <p>Watch the resort's 2023 film, the same YouTube video embedded on Bohol Beach Club's official homepage.</p>
            <div className="film-meta">
              <span>Bohol Beach Club 2023</span>
              <span>Pinoys Interactive</span>
            </div>
            <a className="text-link light-link" href="https://www.youtube.com/watch?v=y1x-oKYCStw" target="_blank" rel="noreferrer">Watch on YouTube <Icon name="arrow" size={16} /></a>
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
            <div><div className="section-label">Stay</div><h2>Rooms that keep the island close.</h2></div>
            <p>Eighty Deluxe Rooms and eight Beachview Suites form the heart of the resort's accommodation offering.</p>
          </div>
          <div className="stay-grid">
            {stays.map((stay, index) => (
              <article className="stay-card" key={stay.title}>
                <img src={stay.image} alt={stay.title} />
                <div className="stay-card-copy">
                  <span>{stay.eyebrow}</span>
                  <h3>{stay.title}</h3>
                  <p>{stay.text}</p>
                  <a className="text-link" href={BOOK_URL} target="_blank" rel="noreferrer">View availability <Icon name="arrow" size={15} /></a>
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
            <div className="section-label">Food & beverage</div>
            <h2>Island days, served simply.</h2>
            <p>The resort's Agotata coffee shop serves local favorites and international fare from morning through evening, making dining part of the rhythm rather than a separate occasion.</p>
            <dl className="quiet-list">
              <div><dt>Agotata</dt><dd>6:00 AM – 10:00 PM</dd></div>
              <div><dt>Setting</dt><dd>Casual resort dining</dd></div>
              <div><dt>Style</dt><dd>Local & international</dd></div>
            </dl>
          </div>
        </section>

        <section id="experience" className="experience-section section-space">
          <div className="section-head experience-head">
            <div><div className="section-label">Experience</div><h2>Go farther than the shoreline.</h2></div>
            <p>From the water to the roads of Bohol, the resort can organize the next part of the day without pulling you out of vacation mode.</p>
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
        </section>

        <section id="gather" className="gather-section">
          <img src="/images/event-03.jpg" alt="Events at Bohol Beach Club" />
          <div className="gather-shade" />
          <div className="gather-content">
            <div className="section-label light">Gather</div>
            <h2>Milestones feel different by the sea.</h2>
            <p>Weddings, corporate functions, and group occasions can be hosted across the resort's event facilities.</p>
            <a className="button button-light" href="mailto:reservations@boholbeachclub.com.ph">Plan an event <Icon name="arrow" size={17} /></a>
          </div>
        </section>

        <section className="gallery-section section-space">
          <div className="section-head">
            <div><div className="section-label">A closer look</div><h2>Beach, table, water, island.</h2></div>
            <p>A small selection from the resort's public visual library, used here for a private redesign concept.</p>
          </div>
          <div className="gallery-grid">
            {gallery.map((src, index) => <img key={src} className={`gallery-${index + 1}`} src={src} alt="Bohol Beach Club resort scene" />)}
          </div>
        </section>

        <section id="contact" className="contact-section section-space">
          <div className="contact-panel">
            <div className="section-label light">Plan the stay</div>
            <h2>Panglao is waiting.</h2>
            <p>Book through the resort's official reservation flow, or contact the reservations team directly.</p>
            <div className="contact-actions">
              <a className="button button-light" href={BOOK_URL} target="_blank" rel="noreferrer"><Icon name="calendar" size={17} /> Book now</a>
              <a className="contact-link" href="mailto:reservations@boholbeachclub.com.ph"><Icon name="mail" size={17} /> reservations@boholbeachclub.com.ph</a>
              <a className="contact-link" href="tel:+639274527054"><Icon name="phone" size={17} /> +63 927 452 7054</a>
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
        <a href="https://www.boholbeachclub.com.ph/" target="_blank" rel="noreferrer">Original website</a>
      </footer>
    </div>
  );
}
