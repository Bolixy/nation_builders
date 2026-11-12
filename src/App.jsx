import { useEffect, useLayoutEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, NavLink, Link, useLocation } from "react-router-dom";
import { Logo } from "./components";
import { Home, About, Events, Outreach, Meetings, Faq, Contact, Join } from "./pages";

const links = [["/", "Home"], ["/about", "About"], ["/events", "Events"], ["/outreach", "Outreaches"], ["/meetings", "Meetings"], ["/faq", "FAQ"], ["/contact", "Contact"]];

const Scene3D = lazy(() => import("./Scene3D.jsx"));

export default function App() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); setOpen(false); }, [pathname]);
  useEffect(() => { document.body.classList.toggle("mo", open); }, [open]);
  // Fade-and-rise reveal as sections scroll into view
  useLayoutEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const els = [...document.querySelectorAll("main .card, main h2, main .sub, main .hero > *, main figure, main details")];
    let revealEnabled = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
          setTimeout(() => { entry.target.style.transitionDelay = ""; }, 900);
        }
      });
      if (!revealEnabled && entries.some((entry) => entry.isIntersecting)) {
        document.documentElement.classList.add("reveal-ready");
        revealEnabled = true;
      }
    }, { threshold: 0.12 });
    els.forEach((el, i) => { el.classList.add("rv"); el.style.transitionDelay = (i % 6) * 70 + "ms"; io.observe(el); });
    return () => {
      io.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, [pathname]);
  return (
    <>
      <Suspense fallback={null}><Scene3D /></Suspense>
      <nav>
        <Link to="/" style={{ marginRight: "auto" }}><Logo /></Link>
        <button className="burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>☰</button>
        <div className="scrim" onClick={() => setOpen(false)} />
        <div className="links" onClick={(e) => { if (e.target.closest("a")) setOpen(false); }}>
          <button className="close" aria-label="Close menu" onClick={() => setOpen(false)}>✕</button>
          {links.map(([to, t]) => <NavLink key={to} to={to} end className="l">{t}</NavLink>)}
          <NavLink to="/join" className="btn">Join the club</NavLink>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} /><Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} /><Route path="/outreach" element={<Outreach />} />
          <Route path="/meetings" element={<Meetings />} /><Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} /><Route path="/join" element={<Join />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <footer><div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><Logo /></div>© {new Date().getFullYear()} Nation Builder's Club</footer>
    </>
  );
}
