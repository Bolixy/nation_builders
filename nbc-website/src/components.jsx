import { useState } from "react";
import { supabase } from "./supabase";
import { WHATSAPP } from "./data";

export function Logo() {
  return (
    <span className="logo">
      <svg className="mk" viewBox="0 0 44 38" aria-hidden="true">
        <g fill="#1f5fff">
          <rect width="44" height="6" /><rect y="8" width="27" height="6" /><rect x="29" y="8" width="15" height="6" />
          <rect y="16" width="14" height="6" /><rect x="16" y="16" width="28" height="6" /><rect y="24" width="44" height="6" />
          <rect y="32" width="23" height="6" /><rect x="25" y="32" width="19" height="6" />
        </g>
      </svg>
      <span>NATION BUILDER'S CLUB <b>(NBC)</b></span>
    </span>
  );
}

// Generic form that saves one row to a Supabase table.
// table: "members" | "signups" | "messages"; extra: fixed columns (kind, item)
export function Form({ table, extra = {}, fields, button, btnClass = "btn", whatsapp = false }) {
  const [state, setState] = useState({ s: "idle" });

  async function submit(e) {
    e.preventDefault();
    const form = e.target;
    if (!supabase) return setState({ s: "error", msg: "The database is not connected yet." });
    setState({ s: "sending" });
    const row = { ...Object.fromEntries(new FormData(form)), ...extra };
    const { error } = await supabase.from(table).insert(row);
    if (error && error.code !== "23505") return setState({ s: "error", msg: "Something went wrong. Please try again." });
    setState({ s: "ok", dup: !!error });
    form.reset();
  }

  return (
    <form onSubmit={submit}>
      {fields.map((f) => (
        <label key={f.name}>
          {f.label}
          {f.type === "textarea" ? (
            <textarea name={f.name} rows={f.rows || 3} required={f.required} />
          ) : f.type === "select" ? (
            <select name={f.name}>{f.options.map((o) => <option key={o}>{o}</option>)}</select>
          ) : (
            <input name={f.name} type={f.type || "text"} required={f.required} />
          )}
        </label>
      ))}
      <button className={btnClass} disabled={state.s === "sending"}>
        {state.s === "sending" ? "Sending…" : button}
      </button>
      {state.s === "error" && <div className="note err">{state.msg}</div>}
      {state.s === "ok" && (
        <div className="note ok">
          {state.dup ? "You are already registered. " : "Thank you! Your registration has been received. "}
          {whatsapp && "Tap below to join our WhatsApp group."}
          {whatsapp && (
            <a className="btn g" href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 10, textAlign: "center" }}>
              Join our WhatsApp group
            </a>
          )}
        </div>
      )}
    </form>
  );
}

export const personFields = [
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone / WhatsApp" },
];

export function PastEvent({ p }) {
  return (
    <div className="card pe">
      <img className="poster" src={p.img} alt={`Flyer for the ${p.title}: ${p.theme}`} />
      <div>
        <span className="tag g">Past event</span>
        <h3 style={{ fontSize: 24, margin: "10px 0 4px" }}>{p.title}</h3>
        <p><b style={{ color: "var(--tx)" }}>Theme:</b> {p.theme}</p>
        <p>{p.when}</p>
        <div className="spk">
          {p.speakers.map(([n, r]) => (<div key={n}><b>{n}</b><span>{r}</span></div>))}
        </div>
      </div>
    </div>
  );
}
