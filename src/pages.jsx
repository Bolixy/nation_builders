import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, PastEvent, personFields } from "./components";
import { EVENTS, OUTREACHES, MEETING_URL, PAST_EVENTS } from "./data";

const Head = ({ t, s }) => (<><h2 style={{ marginTop: 50 }}>{t}</h2><p className="sub">{s}</p></>);

function Rot() {
  const w = ["business", "career", "voice", "future"];
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((n) => (n + 1) % w.length), 2200); return () => clearInterval(t); }, []);
  return <span key={i} className="rot">{w[i]}</span>;
}

export function Home() {
  return (
    <>
      <div className="hero">
        <span className="tag">A community for people on a growth journey</span>
        <h1 style={{ marginTop: 16 }}>Build your <Rot />.<br /><span>Build together.</span></h1>
        <p>Nation Builder's Club is a community of like-minded people building businesses, startups and careers, growing together.</p>
        <Link className="btn" to="/join">Become a member</Link> <Link className="btn o" to="/events">Events</Link>
      </div>
      <h2>What we do</h2><p className="sub">Builders, speakers and business people growing together.</p>
      <div className="grid">
        <div className="card"><div className="ic">🧱</div><h3>Build</h3><p>Grow your idea, startup or career alongside other builders.</p></div>
        <div className="card"><div className="ic">🎤</div><h3>Speak</h3><p>Virtual conferences and meetings where members share, present and learn.</p></div>
        <div className="card"><div className="ic">💼</div><h3>Business</h3><p>Connect with people building businesses and startups.</p></div>
        <div className="card"><div className="ic">🌍</div><h3>Outreach</h3><p>Serve beyond the club through our outreaches.</p></div>
      </div>
      <h2>Our last conference</h2><p className="sub">Becoming Virtual Conference, 30th of October 2026.</p>
      <PastEvent p={PAST_EVENTS[0]} />
    </>
  );
}

export function About() {
  return (<><Head t="About the club" s="Who we are." />
    <div className="card"><p>Nation Builder's Club (NBC) is a community of like-minded people on a journey of growth. Our members are building businesses, startups and careers, and we come together to learn from one another and grow.</p></div></>);
}

function Item({ it, kind, btn, cls }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card ev">
      <div className="date">{it.date || "🌍"}<small>{it.where || ""}</small></div>
      <div className="info"><h3>{it.title}</h3><p>{it.desc}</p></div>
      <button className={"btn " + cls} onClick={() => setOpen(!open)}>{open ? "Close" : btn}</button>
      {open && <div style={{ width: "100%" }}><Form table="signups" extra={{ kind, item: it.title }} fields={personFields} button={"Confirm for " + it.title} /></div>}
    </div>
  );
}

export function Events() {
  return (
    <>
      <Head t="Upcoming events" s="Register for our events here." />
      <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
        {EVENTS.map((e) => <Item key={e.title} it={e} kind="event" btn="Register" cls="" />)}
      </div>
      {EVENTS.length === 0 && (
        <div className="card"><h3 style={{ marginTop: 0 }}>No upcoming event announced yet</h3>
          <p>Leave your details and we will reach out when the next event is announced.</p>
          <div style={{ marginTop: 14 }}><Form table="signups" extra={{ kind: "event-interest" }} fields={personFields} button="Notify me" /></div></div>
      )}
      <h2>Past events</h2>
      <div className="grid" style={{ gridTemplateColumns: "1fr" }}>{PAST_EVENTS.map((e) => <PastEvent key={e.when} p={e} />)}</div>
      <h2>From our last conference</h2>
      <div className="gal">
        <figure><img src="/call1.jpg" alt="Participants on the conference video call" /><figcaption>Participants on the video call</figcaption></figure>
        <figure><img src="/call2.jpg" alt="Conference call screen showing 13 participants joined" /><figcaption>13 joined, 32 minutes in</figcaption></figure>
      </div>
    </>
  );
}

export function Outreach() {
  return (
    <>
      <Head t="Outreaches" s="Volunteer and take part." />
      <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
        {OUTREACHES.map((o) => <Item key={o.title} it={o} kind="outreach" btn="Volunteer" cls="g" />)}
      </div>
      {OUTREACHES.length === 0 && (
        <div className="card"><h3 style={{ marginTop: 0 }}>Register your interest</h3>
          <p>Leave your details and we will contact you about upcoming outreaches.</p>
          <div style={{ marginTop: 14 }}><Form table="signups" extra={{ kind: "outreach-interest" }} fields={personFields} button="Register interest" btnClass="btn g" /></div></div>
      )}
    </>
  );
}

export function Meetings() {
  return (
    <>
      <Head t="Meeting room" s="Free video meetings with no time limit and screen sharing for presentations." />
      <div className="card room">
        <div><h3 style={{ margin: 0 }}>Club meeting room</h3><p>Open to members. Use the screen-share button inside the call to present.</p></div>
        <a className="btn g" href={MEETING_URL} target="_blank" rel="noopener noreferrer">Join the call</a>
      </div>
      <div className="note">Calls run on Jitsi Meet, which is free. Allow your browser to use the camera and microphone.</div>
    </>
  );
}

export function Faq() {
  const q = [
    ["Who can join?", "Anyone building a business, a startup or a career and ready to grow with others."],
    ["How do meetings work?", "Open the Meetings page and click Join. Use screen share to present."],
    ["How do I register for an event or outreach?", "Use the Events or Outreaches page. Registration opens when an event is announced."],
  ];
  return (<><Head t="FAQ" s="Quick answers." />{q.map(([a, b]) => <details key={a}><summary>{a}</summary><p>{b}</p></details>)}</>);
}

export function Contact() {
  return (<><Head t="Contact us" s="Questions, partnerships or speaking requests." />
    <Form table="messages" button="Send message" fields={[
      { name: "name", label: "Name", required: true }, { name: "email", label: "Email", type: "email", required: true },
      { name: "message", label: "Message", type: "textarea", rows: 4, required: true }]} /></>);
}

export function Join() {
  return (<><Head t="Join Nation Builder's Club" s="Create your membership in a minute." />
    <Form table="members" whatsapp button="Register" fields={[
      ...personFields.slice(0, 2), { name: "phone", label: "Phone / WhatsApp" }, { name: "location", label: "City and country" },
      { name: "track", label: "What are you building?", type: "select", options: ["Business", "Startup", "Career growth", "Just exploring"] },
      { name: "about", label: "Tell us about it", type: "textarea" }]} /></>);
}
