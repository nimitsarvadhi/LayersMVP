import { useState, useRef, useEffect } from "react";

/* ─── DESIGN SYSTEM ─────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#f4f6f9;--white:#fff;--navy:#1a3353;--blue:#2563eb;--blue-lt:#eff6ff;--blue-md:#dbeafe;
  --green:#059669;--green-lt:#ecfdf5;--red:#dc2626;--red-lt:#fef2f2;--amber:#d97706;--amber-lt:#fffbeb;
  --purple:#7c3aed;--purple-lt:#f5f3ff;
  --s50:#f8fafc;--s100:#f1f5f9;--s200:#e2e8f0;--s300:#cbd5e1;--s400:#94a3b8;--s500:#64748b;--s600:#475569;--s700:#334155;--s800:#1e293b;
  --border:#e2e8f0;--sh:0 1px 3px rgba(0,0,0,.07);--sh2:0 4px 16px rgba(0,0,0,.08);--sh3:0 20px 40px rgba(0,0,0,.12);
  --r:12px;--font:'Plus Jakarta Sans',sans-serif;--mono:'JetBrains Mono',monospace;
}
body{font-family:var(--font);background:var(--bg);color:var(--s800);-webkit-font-smoothing:antialiased}
@keyframes up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes sr{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}
.au{animation:up .32s cubic-bezier(.16,1,.3,1) both}
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);box-shadow:var(--sh)}
.inp{width:100%;background:var(--white);border:1.5px solid var(--border);border-radius:8px;padding:9px 13px;font-family:var(--font);font-size:13.5px;color:var(--s800);outline:none;transition:border .15s,box-shadow .15s}
.inp::placeholder{color:var(--s400)}.inp:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.sel{width:100%;background:var(--white);border:1.5px solid var(--border);border-radius:8px;padding:9px 13px;font-family:var(--font);font-size:13.5px;color:var(--s800);outline:none;cursor:pointer;appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1.5l5 5 5-5' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 12px center;padding-right:34px;transition:border .15s}
.sel:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.bp{display:inline-flex;align-items:center;gap:7px;background:var(--blue);color:#fff;border:none;border-radius:8px;padding:9px 18px;font-family:var(--font);font-size:13.5px;font-weight:600;cursor:pointer;transition:all .15s;white-space:nowrap}
.bp:hover{background:#1d4ed8;box-shadow:0 4px 12px rgba(37,99,235,.3);transform:translateY(-1px)}.bp:active{transform:none}
.bs{display:inline-flex;align-items:center;gap:7px;background:var(--white);color:var(--s600);border:1.5px solid var(--border);border-radius:8px;padding:9px 16px;font-family:var(--font);font-size:13.5px;font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap}
.bs:hover{border-color:var(--s300);color:var(--s800);background:var(--s50)}
.bd{display:inline-flex;align-items:center;gap:7px;background:var(--red-lt);color:var(--red);border:1.5px solid #fecaca;border-radius:8px;padding:9px 16px;font-family:var(--font);font-size:13.5px;font-weight:600;cursor:pointer;transition:all .15s}
.bd:hover{background:#fee2e2}
.lbl{display:block;font-size:12px;font-weight:600;color:var(--s500);letter-spacing:.03em;text-transform:uppercase;margin-bottom:6px}
.badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:100px;font-size:11.5px;font-weight:600;white-space:nowrap}
.ni{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;font-size:13px;font-weight:500;color:var(--s600);cursor:pointer;border:none;background:none;transition:all .15s;width:100%;text-align:left}
.ni:hover{background:var(--s100);color:var(--s800)}.ni.on{background:var(--blue-lt);color:var(--blue);font-weight:700}
.modal-bg{position:fixed;inset:0;z-index:200;background:rgba(15,23,42,.4);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fi .18s}
.modal-box{background:var(--white);border:1px solid var(--border);border-radius:16px;box-shadow:var(--sh3);width:100%;max-width:500px;animation:up .28s cubic-bezier(.16,1,.3,1)}
.toast-w{position:fixed;bottom:24px;right:24px;z-index:999;animation:sr .3s cubic-bezier(.16,1,.3,1)}
.scroll::-webkit-scrollbar{width:5px}.scroll::-webkit-scrollbar-thumb{background:var(--s200);border-radius:4px}
.tbl-h{display:grid;padding:10px 18px;background:var(--s50);border-bottom:1.5px solid var(--border);font-size:11px;font-weight:700;color:var(--s400);letter-spacing:.07em;text-transform:uppercase}
.tbl-r{display:grid;padding:12px 18px;border-bottom:1px solid var(--border);align-items:center;font-size:13.5px;transition:background .1s}
.tbl-r:hover{background:var(--s50)}.tbl-r:last-child{border-bottom:none}
.ic-b{width:28px;height:28px;border-radius:7px;border:1.5px solid transparent;background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--s400);transition:all .12s}
.ic-b:hover{border-color:var(--border);background:var(--white);color:var(--s600)}
.chip{display:inline-flex;align-items:center;gap:7px;padding:5px 12px 5px 14px;border-radius:100px;font-size:13px;font-weight:600;border:1.5px solid}
.tpl-card{padding:18px 20px;border-radius:12px;border:2px solid var(--border);background:var(--white);cursor:pointer;transition:all .2s;text-align:left}
.tpl-card:hover{border-color:var(--blue-md);box-shadow:var(--sh2);transform:translateY(-2px)}
.tpl-card.sel{border-color:var(--blue);background:var(--blue-lt);box-shadow:0 0 0 4px rgba(37,99,235,.08)}
`;

/* ─── CONSTANTS ─────────────────────────────────────────────────────────── */
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const PAL = [
  { bg: "#eff6ff", text: "#1d4ed8", bdr: "#bfdbfe" }, { bg: "#f5f3ff", text: "#6d28d9", bdr: "#ddd6fe" },
  { bg: "#ecfdf5", text: "#065f46", bdr: "#a7f3d0" }, { bg: "#fffbeb", text: "#92400e", bdr: "#fde68a" },
  { bg: "#fef2f2", text: "#991b1b", bdr: "#fecaca" }, { bg: "#f0fdf4", text: "#166534", bdr: "#bbf7d0" },
  { bg: "#fdf4ff", text: "#7e22ce", bdr: "#e9d5ff" }, { bg: "#fff7ed", text: "#9a3412", bdr: "#fed7aa" },
];
const AV_P = [["#eff6ff", "#1d4ed8"], ["#f5f3ff", "#7c3aed"], ["#ecfdf5", "#059669"], ["#fffbeb", "#d97706"], ["#fef2f2", "#dc2626"], ["#f0fdf4", "#16a34a"]];
const SAMPLE_CSV_BASE = `name,email,phone,designation`;

/* ─── HIERARCHY TEMPLATES ───────────────────────────────────────────────── */
const TEMPLATES = [
  { id: "flat", label: "Flat Network", desc: "Simplest structure. Direct member management.", rec: false, levels: [] },
  { id: "chap", label: "Chapter Based", desc: "Members grouped into chapters. Ideal for small orgs.", rec: false, levels: ["Chapter"] },
  { id: "region", label: "Regional Network", desc: "Chapters organized under regions. Most common.", rec: true, levels: ["Region", "Chapter"] },
  { id: "multi", label: "Multi-Level Network", desc: "Zones → Regions → Chapters. For large federations.", rec: false, levels: ["Zone", "Region", "Chapter"] },
];

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
const mkId = () => Math.random().toString(36).slice(2, 9);
const SAMPLE_CSV = (levels) => `name,email,phone,${levels.map(l => l.toLowerCase()).join(",")},designation\nPriya Sharma,priya@example.com,9876543210,${levels.map((_, i) => i === levels.length - 1 ? "Delhi Chapter" : "North Region").join(",")},President`;

function parseCSV(txt, levels) {
  const ls = txt.trim().split("\n"), hs = ls[0].split(",").map(h => h.trim().toLowerCase());
  return ls.slice(1).map(l => {
    const vs = l.split(",").map(v => v.trim()), r = { _id: mkId(), source: "csv" };
    hs.forEach((h, i) => {
      const k = h === "name" ? "Name" : h === "email" ? "Email" : h === "phone" ? "Phone" : h === "designation" ? "Designation" : levels.find(lv => lv.toLowerCase() === h) || h;
      r[k] = vs[i] || "";
    });
    return r;
  });
}
function validate(m) {
  const e = [];
  if (!m.Name?.trim()) e.push("Name is required");
  if (!m.Email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.Email)) e.push("Valid email required");
  return e;
}
function dlCSV(levels) {
  const b = new Blob([SAMPLE_CSV(levels)], { type: "text/csv" });
  const u = URL.createObjectURL(b);
  const a = document.createElement("a"); a.href = u; a.download = "sample_members.csv"; a.click();
  URL.revokeObjectURL(u);
}

/* ─── SHARED UI ──────────────────────────────────────────────────────────── */
function Ic({ d, size = 16, sw = 1.7, stroke = "currentColor", fill = "none" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
}
function Toast({ msg, type = "ok", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  const c = { ok: { b: "#bfdbfe", i: "#2563eb" }, good: { b: "#a7f3d0", i: "#059669" }, bad: { b: "#fecaca", i: "#dc2626" } }[type] || { b: "#e2e8f0", i: "#64748b" };
  return <div className="toast-w"><div style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 16px", background: "#fff", border: `1.5px solid ${c.b}`, borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,.12)", minWidth: 240, maxWidth: 340 }}>
    <Ic d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size={16} stroke={c.i} sw={2} />
    <span style={{ fontSize: 13.5, fontWeight: 500, flex: 1 }}>{msg}</span>
    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--s400)", fontSize: 18, lineHeight: 1 }}>×</button>
  </div></div>;
}
function Modal({ title, sub, onClose, children, footer, wide }) {
  return <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal-box" style={wide ? { maxWidth: 600 } : {}}>
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div><div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>{sub && <div style={{ fontSize: 12, color: "var(--s400)", marginTop: 3 }}>{sub}</div>}</div>
        <button onClick={onClose} className="ic-b" style={{ border: "1.5px solid var(--border)", flexShrink: 0 }}><Ic d="M18 6L6 18M6 6l12 12" size={13} /></button>
      </div>
      <div style={{ padding: "20px 24px" }}>{children}</div>
      {footer && <div style={{ padding: "0 24px 20px", display: "flex", gap: 9, justifyContent: "flex-end" }}>{footer}</div>}
    </div>
  </div>;
}
function Av({ name, idx = 0 }) {
  const [bg, fg] = AV_P[((name || "A").charCodeAt(0) + idx) % AV_P.length];
  const ini = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return <div style={{ width: 32, height: 32, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, fontFamily: "var(--mono)", flexShrink: 0, background: bg, color: fg }}>{ini}</div>;
}

/* ─── SETUP PROGRESS ─────────────────────────────────────────────────────── */
function SetupProgress({ hierarchySaved, orgData, levels, designations, members, meetings, setPage }) {
  const hasOrg = levels.length > 0 ? levels.every(lv => (orgData[lv] || []).length > 0) : true;
  const steps = [
    { label: "Hierarchy", done: hierarchySaved, page: "hierarchy", ico: "M3 6h18M3 12h12M3 18h8" },
    { label: "Org Structure", done: hasOrg, page: "org", ico: "M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" },
    { label: "Designations", done: designations.length > 0, page: "designations", ico: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" },
    { label: "Members", done: members.length > 0, page: "members", ico: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z" },
    { label: "Meetings", done: meetings.length > 0, page: "meetings", ico: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  ];
  const doneCount = steps.filter(s => s.done).length;
  const unlocked = (i) => i === 0 || steps[i - 1].done;
  return <div className="card au" style={{ padding: "16px 20px", marginBottom: 4 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--navy)" }}>Platform Setup Progress</div>
      <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: doneCount === 5 ? "var(--green)" : "var(--s400)", fontWeight: 600 }}>{doneCount}/5</span>
    </div>
    <div style={{ height: 4, borderRadius: 4, background: "var(--s100)", marginBottom: 12, overflow: "hidden" }}>
      <div style={{ height: "100%", borderRadius: 4, background: "var(--blue)", width: `${(doneCount / 5) * 100}%`, transition: "width .4s" }} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 }}>
      {steps.map((s, i) => {
        const ok = unlocked(i);
        return <button key={s.label} onClick={() => ok && setPage(s.page)}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "10px 6px", background: s.done ? "var(--green-lt)" : ok ? "var(--blue-lt)" : "var(--s50)", border: `1.5px solid ${s.done ? "#a7f3d0" : ok ? "#bfdbfe" : "var(--border)"}`, borderRadius: 10, cursor: ok ? "pointer" : "default", opacity: ok ? 1 : .5, transition: "all .2s" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: s.done ? "var(--green)" : ok ? "var(--blue)" : "var(--s200)", flexShrink: 0 }}>
            {s.done ? <Ic d="M5 13l4 4L19 7" size={12} stroke="#fff" sw={2.5} /> : <Ic d={s.ico} size={12} stroke={ok ? "#fff" : "var(--s400)"} sw={1.8} />}
          </div>
          <span style={{ fontSize: 10.5, fontWeight: 600, color: s.done ? "var(--green)" : ok ? "var(--blue)" : "var(--s400)", textAlign: "center", lineHeight: 1.3 }}>{s.label}</span>
        </button>;
      })}
    </div>
  </div>;
}

/* ─── PAGE 1: HIERARCHY ──────────────────────────────────────────────────── */
function HierarchyPage({ levels, setLevels, onSave, toast }) {
  const [tplId, setTplId] = useState(null);
  const [names, setNames] = useState([]); // editable level names
  const [saved, setSaved] = useState(false);

  const pickTemplate = (tpl) => {
    setTplId(tpl.id);
    setNames([...tpl.levels]);
  };

  const setName = (i, v) => setNames(ns => ns.map((n, j) => j === i ? v : n));

  const save = () => {
    const final = names.map(n => n.trim() || `Level ${names.indexOf(n) + 2}`);
    setLevels(final);
    onSave(final);
    setSaved(true);
    toast("Hierarchy structure saved successfully.", "good");
  };

  // preview nodes
  const previewNodes = ["Super Admin", ...names.map(n => n || "—"), "Members"];
  const levelNames = ["Super Admin", ...names.map(n => n.trim() || "—"), "Members"];

  // real example (prefix first editable level with "North ", last with "Delhi ")
  const exampleNodes = ["Super Admin",
    ...names.map((n, i) => {
      const base = n.trim() || `Level ${i + 2}`;
      if (i === 0 && names.length > 0) return `North ${base}`;
      if (i === names.length - 1) return `Delhi ${base}`;
      return `Central ${base}`;
    }),
    "Members"];

  return <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>
    {/* LEFT */}
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Template Selector */}
      <div className="card au" style={{ padding: "22px 24px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 4 }}>Select Hierarchy Template</div>
        <div style={{ fontSize: 13, color: "var(--s600)", marginBottom: 18 }}>Choose the structure that best fits your organization</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {TEMPLATES.map(tpl => (
            <button key={tpl.id} className={`tpl-card${tplId === tpl.id ? " sel" : ""}`} onClick={() => pickTemplate(tpl)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: tplId === tpl.id ? "var(--blue)" : "var(--navy)" }}>{tpl.label}</div>
                {tpl.rec && <span className="badge" style={{ background: "var(--green-lt)", color: "var(--green)", border: "1px solid #a7f3d0", fontSize: 10 }}>Recommended</span>}
              </div>
              {/* mini flow */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, marginBottom: 10 }}>
                {["Super Admin", ...tpl.levels, "Members"].map((n, i, arr) => (
                  <div key={i}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: i === 0 ? "var(--navy)" : i === arr.length - 1 ? "var(--s400)" : "var(--s600)", display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: i === 0 ? "var(--navy)" : i === arr.length - 1 ? "var(--s300)" : "var(--blue)", flexShrink: 0 }} />
                      {n}
                    </div>
                    {i < arr.length - 1 && <div style={{ width: 1, height: 10, background: "var(--border)", marginLeft: 2.5 }} />}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--s500)", lineHeight: 1.5 }}>{tpl.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Rename Levels */}
      {tplId && names.length > 0 && (
        <div className="card au" style={{ padding: "22px 24px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 4 }}>Customize Level Names</div>
          <div style={{ fontSize: 13, color: "var(--s600)", marginBottom: 16 }}>Rename levels to match your organization's terminology</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {names.map((n, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--blue-lt)", border: "1.5px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: "var(--blue)" }}>L{i + 2}</div>
                <input className="inp" value={n} onChange={e => setName(i, e.target.value)} placeholder={`Level ${i + 2} name (e.g. Region, Zone, District…)`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tplId && names.length === 0 && (
        <div className="card au" style={{ padding: "20px 24px", background: "var(--blue-lt)", border: "1.5px solid #bfdbfe" }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--blue)" }}>Flat Network Selected</div>
          <div style={{ fontSize: 13, color: "var(--s600)", marginTop: 6, lineHeight: 1.6 }}>Members will report directly to Super Admin. No intermediate levels. This is the simplest structure.</div>
        </div>
      )}

      {tplId && (
        <button className="bp au" style={{ width: "100%", justifyContent: "center", padding: 13, fontSize: 14, borderRadius: 10 }} onClick={save}>
          <Ic d="M5 13l4 4L19 7" size={16} stroke="#fff" sw={2.5} />
          {saved ? "Update Hierarchy" : "Save Hierarchy Structure"}
        </button>
      )}

      {!tplId && (
        <div style={{ textAlign: "center", padding: "20px", color: "var(--s400)", fontSize: 13 }}>← Select a hierarchy template to get started</div>
      )}
    </div>

    {/* RIGHT */}
    <div style={{ position: "sticky", top: 20, display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Live Preview */}
      <div className="card au" style={{ padding: "20px 22px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 2 }}>Live Preview</div>
        <div style={{ fontSize: 11.5, color: "var(--s400)", marginBottom: 16 }}>Real-world example</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {exampleNodes.map((n, i, arr) => (
            <div key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: i === 0 ? "var(--navy)" : i === arr.length - 1 ? "var(--s300)" : "var(--blue)" }} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: i === 0 ? "var(--navy)" : i === arr.length - 1 ? "var(--s500)" : "var(--s800)" }}>{n}</div>
                  {i > 0 && i < arr.length - 1 && <div style={{ fontSize: 10.5, color: "var(--s400)", fontFamily: "var(--mono)" }}>{names[i - 1] || `Level ${i + 1}`} level</div>}
                </div>
              </div>
              {i < arr.length - 1 && <div style={{ width: 2, height: 20, background: "var(--border)", marginLeft: 3, marginTop: 2, marginBottom: 2 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Structure Summary */}
      {levelNames.length > 2 && (
        <div className="card au" style={{ padding: "20px 22px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 14 }}>Structure Summary</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {levelNames.slice(0, -1).map((nm, i) => {
              const next = levelNames[i + 1];
              const verb = i === levelNames.length - 2 ? "contains" : "manages";
              return <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13, color: "var(--s600)", lineHeight: "1.5" }}>
                <Ic d="M9 12l2 2 4-4" size={14} stroke="var(--blue)" sw={2} style={{ flexShrink: 0, marginTop: 2 }} />
                <span><strong style={{ color: "var(--s800)" }}>{nm}</strong> {verb} <strong style={{ color: "var(--s800)" }}>{next === "Members" ? "Members" : `${next}s`}</strong></span>
              </div>;
            })}
          </div>
        </div>
      )}

      <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--s50)", border: "1.5px solid var(--border)" }}>
        <div style={{ fontSize: 11.5, color: "var(--s500)", lineHeight: "1.6" }}>
          <strong style={{ color: "var(--s700)" }}>💡 Tip</strong><br />
          After saving, all other modules—Org Structure, Members, Designations—will automatically adapt to this hierarchy.
        </div>
      </div>
    </div>
  </div>;
}

/* ─── PAGE 2: ORG STRUCTURE (DYNAMIC) ───────────────────────────────────── */
function OrgStructurePage({ levels, orgData, setOrgData, toast }) {
  const [activeLevel, setActiveLevel] = useState(levels[0] || "");
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState("");
  // form for the last editable level (chapters)
  const [form, setForm] = useState({ name: "", day: "Monday", time: "07:00", location: "" });
  const [parentSel, setParentSel] = useState({}); // parent selections for each level

  useEffect(() => { if (levels.length > 0 && !levels.includes(activeLevel)) setActiveLevel(levels[0]); }, [levels]);

  if (levels.length === 0) return (
    <div className="card au" style={{ padding: "60px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 14, color: "var(--s600)", fontWeight: 500 }}>No intermediate levels in your hierarchy.</div>
      <div style={{ fontSize: 13, color: "var(--s400)", marginTop: 6 }}>Members report directly to Super Admin. No org structure needed.</div>
    </div>
  );

  const isLeaf = (lv) => levels.indexOf(lv) === levels.length - 1; // last level = "chapters" type
  const parentLevel = (lv) => { const i = levels.indexOf(lv); return i > 0 ? levels[i - 1] : null; };

  const getItems = (lv) => orgData[lv] || [];
  const setItems = (lv, items) => setOrgData(d => ({ ...d, [lv]: items }));

  const addItem = (lv) => {
    if (isLeaf(lv)) {
      if (!form.name.trim()) return;
      const pLv = parentLevel(lv);
      if (pLv && !parentSel[lv]) return;
      const item = { id: mkId(), name: form.name.trim(), parentId: pLv ? parentSel[lv] : null, day: form.day, time: form.time, location: form.location };
      setItems(lv, [...getItems(lv), item]);
      setForm({ name: "", day: "Monday", time: "07:00", location: "" });
      toast(`${lv} added`, "good");
    } else {
      const v = input.trim(); if (!v) return;
      const pLv = parentLevel(lv);
      if (pLv && !parentSel[lv]) return;
      setItems(lv, [...getItems(lv), { id: mkId(), name: v, parentId: pLv ? parentSel[lv] : null }]);
      setInput(""); toast(`${lv} added`, "good");
    }
  };

  const del = (lv, id) => {
    setItems(lv, getItems(lv).filter(x => x.id !== id));
    // cascade delete children
    const childLv = levels[levels.indexOf(lv) + 1];
    if (childLv) setItems(childLv, getItems(childLv).filter(x => x.parentId !== id));
    toast(`${lv} deleted`, "bad");
  };
  const saveEdit = (lv, id) => {
    setItems(lv, getItems(lv).map(x => x.id === id ? { ...x, name: editVal.trim() || x.name } : x));
    setEditId(null); toast("Updated", "ok");
  };

  const currentItems = getItems(activeLevel);
  const pLv = parentLevel(activeLevel);
  const parentItems = pLv ? getItems(pLv) : [];
  const leaf = isLeaf(activeLevel);

  // filter items by parent selection for display
  const displayItems = pLv ? currentItems.filter(x => !parentSel[activeLevel] || x.parentId === parentSel[activeLevel]) : currentItems;

  return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    {/* Level Tabs */}
    <div className="au" style={{ display: "flex", gap: 6 }}>
      {levels.map(lv => (
        <button key={lv} onClick={() => setActiveLevel(lv)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 9, border: `1.5px solid ${activeLevel === lv ? "var(--blue)" : "var(--border)"}`, background: activeLevel === lv ? "var(--blue-lt)" : "var(--white)", color: activeLevel === lv ? "var(--blue)" : "var(--s600)", fontFamily: "var(--font)", fontSize: 13, fontWeight: activeLevel === lv ? 700 : 500, cursor: "pointer", transition: "all .15s" }}>
          <span className="badge" style={{ background: activeLevel === lv ? "var(--blue)" : "var(--s100)", color: activeLevel === lv ? "#fff" : "var(--s500)", fontFamily: "var(--mono)", padding: "2px 7px" }}>{getItems(lv).length}</span>
          {lv}s
        </button>
      ))}
    </div>

    {/* Add Form */}
    <div className="card au" style={{ padding: "22px 24px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 14 }}>Add {activeLevel}</div>
      {pLv && (
        <div style={{ marginBottom: 12 }}>
          <label className="lbl">Parent {pLv}</label>
          <select className="sel" value={parentSel[activeLevel] || ""} onChange={e => setParentSel(s => ({ ...s, [activeLevel]: e.target.value }))}>
            <option value="">All {pLv}s</option>
            {parentItems.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      )}
      {leaf ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div style={{ gridColumn: "1/-1" }}><label className="lbl">{activeLevel} Name</label><input className="inp" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={`e.g. Delhi Business ${activeLevel}`} /></div>
          <div><label className="lbl">Meeting Day</label><select className="sel" value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))}>{DAYS.map(d => <option key={d}>{d}</option>)}</select></div>
          <div><label className="lbl">Meeting Time</label><input className="inp" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></div>
          <div style={{ gridColumn: "1/-1" }}><label className="lbl">Location</label><input className="inp" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Venue address" /></div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <input className="inp" style={{ flex: 1 }} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addItem(activeLevel)} placeholder={`${activeLevel} name e.g. North ${activeLevel}`} />
        </div>
      )}
      <button className="bp" onClick={() => addItem(activeLevel)}><Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" sw={2.5} />Add {activeLevel}</button>
    </div>

    {/* Table */}
    <div className="card au" style={{ overflow: "hidden" }}>
      {leaf ? (
        <>
          <div className="tbl-h" style={{ gridTemplateColumns: `2fr ${pLv ? "1.2fr " : ""}1fr 1fr 80px` }}>
            <div>{activeLevel}</div>{pLv && <div>{pLv}</div>}<div>Day</div><div>Time</div><div></div>
          </div>
          {displayItems.length === 0 ? <div style={{ padding: "36px 20px", textAlign: "center", color: "var(--s400)", fontSize: 13 }}>No {activeLevel.toLowerCase()}s yet.</div>
            : displayItems.map(item => {
              const par = pLv ? parentItems.find(p => p.id === item.parentId) : null;
              return <div key={item.id} className="tbl-r" style={{ gridTemplateColumns: `2fr ${pLv ? "1.2fr " : ""}1fr 1fr 80px` }}>
                <span style={{ fontWeight: 600 }}>{item.name}</span>
                {pLv && <span style={{ color: "var(--s600)", fontSize: 13 }}>{par?.name || "—"}</span>}
                <span style={{ color: "var(--s600)" }}>{item.day}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--s500)" }}>{item.time}</span>
                <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                  <button className="ic-b" onClick={() => del(activeLevel, item.id)}><Ic d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" size={12} /></button>
                </div>
              </div>;
            })}
        </>
      ) : (
        <>
          <div className="tbl-h" style={{ gridTemplateColumns: `1fr ${pLv ? "1.2fr " : ""}80px` }}>
            <div>{activeLevel} Name</div>{pLv && <div>Parent {pLv}</div>}<div></div>
          </div>
          {displayItems.length === 0 ? <div style={{ padding: "36px 20px", textAlign: "center", color: "var(--s400)", fontSize: 13 }}>No {activeLevel.toLowerCase()}s yet.</div>
            : displayItems.map(item => {
              const par = pLv ? parentItems.find(p => p.id === item.parentId) : null;
              return <div key={item.id} className="tbl-r" style={{ gridTemplateColumns: `1fr ${pLv ? "1.2fr " : ""}80px` }}>
                {editId === item.id
                  ? <input autoFocus className="inp" style={{ padding: "6px 10px" }} value={editVal} onChange={e => setEditVal(e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveEdit(activeLevel, item.id); if (e.key === "Escape") setEditId(null); }} onBlur={() => saveEdit(activeLevel, item.id)} />
                  : <span style={{ fontWeight: 600 }}>{item.name}</span>}
                {pLv && <span style={{ color: "var(--s600)", fontSize: 13 }}>{par?.name || "—"}</span>}
                <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                  <button className="ic-b" onClick={() => { setEditId(item.id); setEditVal(item.name); }}><Ic d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z" size={12} /></button>
                  <button className="ic-b" onClick={() => del(activeLevel, item.id)}><Ic d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" size={12} /></button>
                </div>
              </div>;
            })}
        </>
      )}
      <div style={{ padding: "9px 18px", borderTop: "1px solid var(--border)", background: "var(--s50)", fontSize: 12, color: "var(--s400)", fontFamily: "var(--mono)" }}>{currentItems.length} {activeLevel.toLowerCase()}(s) total</div>
    </div>
  </div>;
}

/* ─── PAGE 3: DESIGNATIONS (DYNAMIC) ────────────────────────────────────── */
function DesignationsPage({ levels, designations, setDesignations, toast }) {
  const [form, setForm] = useState({ name: "", level: "" });
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState("");

  // Designation can be assigned to any non-Super Admin, non-Members level
  const desigLevels = levels.length > 0 ? levels : ["General"];

  const add = () => {
    const v = form.name.trim(); if (!v || !form.level) return;
    setDesignations(d => [...d, { id: mkId(), name: v, level: form.level }]);
    setForm({ name: "", level: "" });
    toast("Designation added", "good");
  };
  const del = id => { setDesignations(d => d.filter(x => x.id !== id)); toast("Designation deleted", "bad"); };
  const saveEdit = id => {
    const v = editVal.trim();
    if (v) setDesignations(d => d.map(x => x.id === id ? { ...x, name: v } : x));
    setEditing(null); toast("Updated", "ok");
  };

  const byLevel = desigLevels.map(lv => ({ lv, items: designations.filter(d => d.level === lv) }));

  return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div className="card au" style={{ padding: "22px 24px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 14 }}>Add Designation</div>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}><label className="lbl">Designation Name</label><input className="inp" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key === "Enter" && add()} placeholder="e.g. President, Regional Coordinator…" /></div>
        <div style={{ width: 180 }}><label className="lbl">Assigned Level</label>
          <select className="sel" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
            <option value="">Select level…</option>
            {desigLevels.map(l => <option key={l} value={l}>{l} Level</option>)}
          </select>
        </div>
        <button className="bp" onClick={add}><Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" sw={2.5} />Add</button>
      </div>
    </div>

    {byLevel.filter(g => g.items.length > 0).map((g, gi) => (
      <div key={g.lv} className="card au" style={{ padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", letterSpacing: ".07em", textTransform: "uppercase" }}>{g.lv} Level</span>
          <span className="badge" style={{ background: "var(--s100)", color: "var(--s500)", fontFamily: "var(--mono)" }}>{g.items.length}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
          {g.items.map((d, i) => {
            const p = PAL[(gi * 3 + i) % PAL.length];
            return editing === d.id
              ? <div key={d.id} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input autoFocus className="inp" style={{ width: 160, padding: "5px 10px", fontSize: 13 }} value={editVal} onChange={e => setEditVal(e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveEdit(d.id); if (e.key === "Escape") setEditing(null); }} />
                <button className="bs" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => saveEdit(d.id)}>✓</button>
              </div>
              : <div key={d.id} className="chip" style={{ background: p.bg, color: p.text, borderColor: p.bdr }}>
                <span onDoubleClick={() => { setEditing(d.id); setEditVal(d.name); }} style={{ cursor: "text" }}>{d.name}</span>
                <button onClick={() => del(d.id)} style={{ background: "none", border: "none", cursor: "pointer", color: p.text, opacity: .5, display: "flex", lineHeight: 1, padding: 0 }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = .5}><Ic d="M18 6L6 18M6 6l12 12" size={11} stroke={p.text} /></button>
              </div>;
          })}
        </div>
      </div>
    ))}

    {designations.length === 0 && <div className="card au" style={{ padding: "40px 20px", textAlign: "center", color: "var(--s400)", fontSize: 13 }}>No designations yet. Add designations above.</div>}

    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "var(--blue-lt)", border: "1px solid #bfdbfe" }}>
      <Ic d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={15} stroke="var(--blue)" />
      <span style={{ fontSize: 12.5, color: "var(--s600)" }}>Designations are available in the member form. Double-click a chip to rename it.</span>
    </div>
  </div>;
}

/* ─── PAGE 4: MEMBERS (DYNAMIC) ──────────────────────────────────────────── */
function MemberModal({ member, levels, orgData, designations, onSave, onClose }) {
  const emptyM = () => { const m = { Name: "", Email: "", Phone: "", Designation: "" }; levels.forEach(lv => { m[lv] = ""; }); return m; };
  const [form, setForm] = useState(member ? { ...member } : emptyM());
  const [errs, setErrs] = useState([]);
  const isEdit = !!member;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // cascade parent selection for dropdown chaining
  const getOptions = (lv) => {
    const idx = levels.indexOf(lv);
    const items = orgData[lv] || [];
    if (idx === 0) return items;
    const parentLv = levels[idx - 1];
    const parentId = (orgData[parentLv] || []).find(x => x.name === form[parentLv])?.id;
    return parentId ? items.filter(x => x.parentId === parentId) : items;
  };

  const submit = () => {
    const e = validate(form); if (e.length) { setErrs(e); return; } onSave(form);
  };

  return <Modal title={isEdit ? "Edit Member" : "Add Member"} sub="Fill in the member details" onClose={onClose}
    footer={<><button className="bs" onClick={onClose}>Cancel</button><button className="bp" onClick={submit}><Ic d={isEdit ? "M5 13l4 4L19 7" : "M12 5v14M5 12h14"} size={14} stroke="#fff" sw={2.5} />{isEdit ? "Save Changes" : "Add Member"}</button></>}>
    <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
      {errs.length > 0 && <div style={{ background: "var(--red-lt)", border: "1.5px solid #fecaca", borderRadius: 8, padding: "9px 13px" }}>{errs.map((e, i) => <div key={i} style={{ fontSize: 12.5, color: "var(--red)" }}>{e}</div>)}</div>}
      {[["Name", "text", "Full name"], ["Email", "email", "Email address"], ["Phone", "tel", "Phone (optional)"]].map(([k, t, ph]) => (
        <div key={k}><label className="lbl">{k}</label><input type={t} className="inp" value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph} /></div>
      ))}
      {levels.map((lv, i) => {
        const opts = getOptions(lv);
        return <div key={lv}>
          <label className="lbl">{lv}</label>
          <select className="sel" value={form[lv]} onChange={e => { set(lv, e.target.value); levels.slice(i + 1).forEach(l => set(l, "")); }} >
            <option value="">Select {lv}…</option>
            {opts.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
          </select>
        </div>;
      })}
      <div><label className="lbl">Designation</label>
        <select className="sel" value={form.Designation} onChange={e => set("Designation", e.target.value)}>
          <option value="">Select…</option>
          {designations.map(d => <option key={d.id} value={d.name}>{d.name} ({d.level} level)</option>)}
        </select>
      </div>
    </div>
  </Modal>;
}

function MembersPage({ levels, orgData, members, setMembers, designations, toast }) {
  const [modal, setModal] = useState(null);
  const [delId, setDelId] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [csvPrev, setCsvPrev] = useState(null);
  const fileRef = useRef();

  const saveMember = form => {
    if (modal === "add") { setMembers(ms => [...ms, { ...form, _id: mkId(), source: "manual" }]); toast(`${form.Name} added`, "good"); }
    else { setMembers(ms => ms.map(m => m._id === form._id ? form : m)); toast(`${form.Name} updated`, "ok"); }
    setModal(null);
  };
  const doDelete = () => {
    const m = members.find(x => x._id === delId);
    setMembers(ms => ms.filter(x => x._id !== delId));
    setDelId(null); toast(`${m?.Name} removed`, "bad");
  };
  const processFile = f => { const r = new FileReader(); r.onload = e => setCsvPrev(parseCSV(e.target.result, levels)); r.readAsText(f); };
  const confirmCSV = () => {
    const valid = csvPrev.filter(r => validate(r).length === 0);
    setMembers(ms => [...ms, ...valid.map(r => ({ ...r, _id: mkId() }))]);
    setCsvPrev(null); toast(`${valid.length} members imported`, "good");
  };

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    const matchQ = !q || m.Name?.toLowerCase().includes(q) || m.Email?.toLowerCase().includes(q);
    const matchF = levels.every(lv => !filters[lv] || m[lv] === filters[lv]);
    return matchQ && matchF;
  });

  const stats = [
    { label: "Total Members", val: members.length, c: "var(--blue)" },
    { label: "Active Regions", val: [...new Set(members.map(m => m[levels[0]]))].filter(Boolean).length, c: "var(--green)" },
    { label: "Chapters", val: [...new Set(members.map(m => m[levels[levels.length - 1]]))].filter(Boolean).length, c: "var(--purple)" },
    { label: "Designations", val: [...new Set(members.map(m => m.Designation))].filter(Boolean).length, c: "var(--amber)" },
  ];

  // dynamic grid columns for table
  const dynCols = `2fr 1.8fr 1fr${levels.map(() => " 1.2fr").join("")} 1.2fr .8fr 50px`;

  return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    {modal && <MemberModal member={modal === "add" ? null : modal} levels={levels} orgData={orgData} designations={designations} onSave={saveMember} onClose={() => setModal(null)} />}
    {delId && <Modal title="Remove Member" sub="This cannot be undone" onClose={() => setDelId(null)} footer={<><button className="bs" onClick={() => setDelId(null)}>Cancel</button><button className="bd" onClick={doDelete}><Ic d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" size={14} />Remove</button></>}>
      <div style={{ textAlign: "center", padding: "8px 0" }}><p style={{ fontWeight: 700, fontSize: 16 }}>{members.find(m => m._id === delId)?.Name}</p><p style={{ fontSize: 13, color: "var(--s500)", marginTop: 4 }}>Will be permanently removed.</p></div>
    </Modal>}

    {/* Stats */}
    <div className="au" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
      {stats.map(s => <div key={s.label} className="card" style={{ padding: "16px 18px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.c, borderRadius: "12px 12px 0 0" }} />
        <div style={{ fontSize: 30, fontWeight: 800, color: s.c, fontFamily: "var(--mono)", lineHeight: 1 }}>{s.val}</div>
        <div style={{ fontSize: 12, color: "var(--s500)", marginTop: 5, fontWeight: 500 }}>{s.label}</div>
      </div>)}
    </div>

    {/* Toolbar */}
    <div className="au" style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center" }}>
      <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
        <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--s400)" }}><Ic d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" size={14} /></span>
        <input className="inp" style={{ paddingLeft: 36 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email…" />
      </div>
      {levels.map(lv => (
        <select key={lv} className="sel" style={{ width: "auto" }} value={filters[lv] || ""} onChange={e => setFilters(f => ({ ...f, [lv]: e.target.value }))}>
          <option value="">All {lv}s</option>
          {(orgData[lv] || []).map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
        </select>
      ))}
      <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
        <button className="bs" onClick={() => dlCSV(levels)}><Ic d="M12 3v12m0 0l-4-4m4 4l4-4M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" size={14} />Sample CSV</button>
        <button className="bs" onClick={() => fileRef.current.click()}><Ic d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" size={14} />Import CSV</button>
        <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) processFile(e.target.files[0]); e.target.value = ""; }} />
        <button className="bp" onClick={() => setModal("add")}><Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" sw={2.5} />Add Member</button>
      </div>
    </div>

    {/* CSV Preview */}
    {csvPrev && <div className="card au" style={{ overflow: "hidden" }}>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 9, background: "var(--s50)" }}>
        <span style={{ fontWeight: 600, fontSize: 13 }}>CSV Preview</span>
        <span className="badge" style={{ background: "var(--green-lt)", color: "var(--green)", border: "1px solid #a7f3d0" }}>✓ {csvPrev.filter(r => validate(r).length === 0).length} valid</span>
        <span className="badge" style={{ background: "var(--red-lt)", color: "var(--red)", border: "1px solid #fecaca" }}>✗ {csvPrev.filter(r => validate(r).length > 0).length} errors</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="bs" style={{ padding: "6px 13px", fontSize: 12 }} onClick={() => setCsvPrev(null)}>Discard</button>
          <button className="bp" style={{ padding: "6px 13px", fontSize: 12 }} onClick={confirmCSV}>Import Valid</button>
        </div>
      </div>
    </div>}

    {/* Table */}
    <div className="card au" style={{ overflow: "hidden" }}>
      <div className="tbl-h" style={{ gridTemplateColumns: dynCols }}>
        <div>Member</div><div>Email</div><div>Phone</div>
        {levels.map(lv => <div key={lv}>{lv}</div>)}
        <div>Designation</div><div>Source</div><div></div>
      </div>
      {filtered.length === 0
        ? <div style={{ padding: "44px 20px", textAlign: "center", color: "var(--s400)", fontSize: 13 }}>{members.length === 0 ? "Add members or import CSV." : "No members match your filters."}</div>
        : <div className="scroll" style={{ maxHeight: 500, overflowY: "auto" }}>
          {filtered.map((m, idx) => {
            const desig = m.Designation; const di = designations.findIndex(d => d.name === desig); const p = di >= 0 ? PAL[di % PAL.length] : null;
            const srcSt = m.source === "csv" ? { bg: "var(--purple-lt)", c: "var(--purple)", b: "1px solid #ddd6fe" } : { bg: "var(--green-lt)", c: "var(--green)", b: "1px solid #a7f3d0" };
            return <div key={m._id} className="tbl-r" style={{ gridTemplateColumns: dynCols, animation: `up .25s ${idx * .025}s both` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}><Av name={m.Name} idx={idx} /><span style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.Name}</span></div>
              <div style={{ color: "var(--s600)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>{m.Email}</div>
              <div style={{ color: "var(--s400)", fontFamily: "var(--mono)", fontSize: 12 }}>{m.Phone || "—"}</div>
              {levels.map(lv => <div key={lv} style={{ color: "var(--s600)", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m[lv] || "—"}</div>)}
              <div>{desig && p ? <span className="badge" style={{ background: p.bg, color: p.text, border: `1px solid ${p.bdr}` }}>{desig}</span> : <span style={{ color: "var(--s400)", fontSize: 12 }}>—</span>}</div>
              <div><span className="badge" style={{ background: srcSt.bg, color: srcSt.c, border: srcSt.b, fontSize: 11 }}>{m.source === "csv" ? "CSV" : "Manual"}</span></div>
              <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                <button className="ic-b" onClick={() => setModal(m)}><Ic d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z" size={12} /></button>
                <button className="ic-b" onClick={() => setDelId(m._id)}><Ic d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" size={12} /></button>
              </div>
            </div>;
          })}
        </div>}
      <div style={{ padding: "9px 18px", borderTop: "1px solid var(--border)", background: "var(--s50)", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "var(--s400)", fontFamily: "var(--mono)" }}>Showing {filtered.length} of {members.length}</span>
        <button onClick={() => setModal("add")} style={{ background: "none", border: "none", color: "var(--blue)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)" }}>+ Add member</button>
      </div>
    </div>
  </div>;
}

/* ─── PAGE 5: MEETINGS (DYNAMIC) ─────────────────────────────────────────── */
function MeetingsPage({ levels, orgData, meetings, setMeetings, toast }) {
  // Meetings belong to the lowest (leaf) level
  const meetingLevel = levels.length > 0 ? levels[levels.length - 1] : null;
  const meetingItems = meetingLevel ? (orgData[meetingLevel] || []) : [];

  const [form, setForm] = useState({ title: "", itemId: "", day: "Monday", startDate: "", endDate: "", time: "07:00", location: "" });
  const [actionMtg, setActionMtg] = useState(null);
  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const generate = () => {
    if (!form.title || (!form.itemId && meetingLevel) || !form.startDate || !form.endDate) return;
    const item = meetingItems.find(c => c.id === form.itemId);
    const dayIdx = DAYS.indexOf(form.day);
    const start = new Date(form.startDate), end = new Date(form.endDate);
    const occ = []; let d = new Date(start);
    while (d <= end) {
      if ((d.getDay() + 6) % 7 === dayIdx) occ.push({
        id: mkId(), date: new Date(d), title: form.title,
        levelName: meetingLevel || "", itemName: item?.name || "All", time: form.time, location: form.location || item?.location || "", status: "Scheduled"
      });
      d.setDate(d.getDate() + 1);
    }
    setMeetings(occ); toast(`${occ.length} meetings generated`, "good");
  };

  const updStatus = (id, status) => {
    setMeetings(ms => ms.map(m => m.id === id ? { ...m, status, date: status === "Rescheduled" ? new Date(m.date.getTime() + 86400000) : m.date } : m));
    setActionMtg(null); toast(`Meeting ${status.toLowerCase()}`, "ok");
  };

  const stC = { Scheduled: { bg: "var(--blue-lt)", c: "var(--blue)", b: "#bfdbfe" }, Skipped: { bg: "var(--s100)", c: "var(--s500)", b: "var(--s200)" }, Cancelled: { bg: "var(--red-lt)", c: "var(--red)", b: "#fecaca" }, Rescheduled: { bg: "var(--amber-lt)", c: "var(--amber)", b: "#fde68a" } };

  return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    {meetingLevel && <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "var(--blue-lt)", border: "1px solid #bfdbfe", borderRadius: 9, fontSize: 13, color: "var(--s600)" }}>
      <Ic d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={14} stroke="var(--blue)" />
      Meetings are attached to <strong style={{ color: "var(--navy)", margin: "0 3px" }}>{meetingLevel}</strong> level (lowest organizational level)
    </div>}

    {actionMtg && <Modal title="Meeting Actions" sub={`${actionMtg.title} · ${actionMtg.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`} onClose={() => setActionMtg(null)}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button className="bs" style={{ justifyContent: "center", padding: 14, flexDirection: "column", gap: 5, display: "flex" }} onClick={() => updStatus(actionMtg.id, "Skipped")}><Ic d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size={18} />Skip Meeting</button>
        <button className="bd" style={{ justifyContent: "center", padding: 14, flexDirection: "column", gap: 5, display: "flex" }} onClick={() => updStatus(actionMtg.id, "Cancelled")}><Ic d="M18 6L6 18M6 6l12 12" size={18} />Cancel Meeting</button>
        <button className="bs" style={{ justifyContent: "center", padding: 14, flexDirection: "column", gap: 5, display: "flex" }} onClick={() => updStatus(actionMtg.id, "Rescheduled")}><Ic d="M5 12h14M12 5l7 7-7 7" size={18} />Move to Next Day</button>
        <button className="bp" style={{ justifyContent: "center", padding: 14, flexDirection: "column", gap: 5, display: "flex" }} onClick={() => { setActionMtg(null); toast("Members notified!", "good"); }}><Ic d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" size={18} stroke="#fff" />Notify Members</button>
      </div>
    </Modal>}

    <div className="card au" style={{ padding: "22px 24px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--s400)", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 14 }}>Generate Meeting Series</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div><label className="lbl">Event Title</label><input className="inp" value={form.title} onChange={e => sf("title", e.target.value)} placeholder="e.g. Weekly Networking Session" /></div>
        {meetingLevel && <div><label className="lbl">{meetingLevel}</label>
          <select className="sel" value={form.itemId} onChange={e => sf("itemId", e.target.value)}>
            <option value="">All {meetingLevel}s</option>
            {meetingItems.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>}
        <div><label className="lbl">Meeting Day</label><select className="sel" value={form.day} onChange={e => sf("day", e.target.value)}>{DAYS.map(d => <option key={d}>{d}</option>)}</select></div>
        <div><label className="lbl">Meeting Time</label><input className="inp" type="time" value={form.time} onChange={e => sf("time", e.target.value)} /></div>
        <div><label className="lbl">Start Date</label><input className="inp" type="date" value={form.startDate} onChange={e => sf("startDate", e.target.value)} /></div>
        <div><label className="lbl">End Date</label><input className="inp" type="date" value={form.endDate} onChange={e => sf("endDate", e.target.value)} /></div>
        <div style={{ gridColumn: "1/-1" }}><label className="lbl">Location</label><input className="inp" value={form.location} onChange={e => sf("location", e.target.value)} placeholder="Venue (optional)" /></div>
      </div>
      <button className="bp" onClick={generate}><Ic d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={15} stroke="#fff" sw={2} />Generate Meetings</button>
    </div>

    {meetings.length > 0 && <div className="card au" style={{ overflow: "hidden" }}>
      <div className="tbl-h" style={{ gridTemplateColumns: "1.5fr 1fr 1fr .9fr 1.2fr 50px" }}>
        <div>Date</div><div>Day</div><div>{meetingLevel || "Group"}</div><div>Time</div><div>Status</div><div></div>
      </div>
      <div className="scroll" style={{ maxHeight: 430, overflowY: "auto" }}>
        {meetings.map(m => {
          const sc = stC[m.status] || stC.Scheduled;
          const dStr = m.date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
          const dow = DAYS[(m.date.getDay() + 6) % 7];
          return <div key={m.id} className="tbl-r" style={{ gridTemplateColumns: "1.5fr 1fr 1fr .9fr 1.2fr 50px" }}>
            <span style={{ fontWeight: 600 }}>{dStr}</span>
            <span style={{ color: "var(--s600)" }}>{dow}</span>
            <span style={{ color: "var(--s600)", fontSize: 13 }}>{m.itemName}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--s500)" }}>{m.time}</span>
            <span className="badge" style={{ background: sc.bg, color: sc.c, border: `1px solid ${sc.b}` }}>{m.status}</span>
            <div style={{ display: "flex", justifyContent: "flex-end" }}><button className="ic-b" onClick={() => setActionMtg(m)}><Ic d="M12 5v.01M12 12v.01M12 19v.01" size={14} /></button></div>
          </div>;
        })}
      </div>
      <div style={{ padding: "9px 18px", borderTop: "1px solid var(--border)", background: "var(--s50)", fontSize: 12, color: "var(--s400)", fontFamily: "var(--mono)" }}>{meetings.length} occurrences · {meetings.filter(m => m.status === "Scheduled").length} scheduled</div>
    </div>}
    {meetings.length === 0 && <div className="card au" style={{ padding: "40px 20px", textAlign: "center", color: "var(--s400)", fontSize: 13 }}>Fill in the form above and click Generate Meetings.</div>}
  </div>;
}

/* ─── APP SHELL ──────────────────────────────────────────────────────────── */
const PAGE_TITLES = { hierarchy: "Hierarchy Setup", org: "Organization Structure", designations: "Designations", members: "Members", meetings: "Meetings" };
const PAGE_DESCS = { hierarchy: "Select and configure your organizational hierarchy", org: "Manage your organizational units", designations: "Define roles and designations by level", members: "Manage the member directory", meetings: "Schedule recurring chapter meetings" };

export default function App() {
  const [page, setPage] = useState("hierarchy");
  const [levels, setLevels] = useState([]); // e.g. ["Region","Chapter"]
  const [hierarchySaved, setHierarchySaved] = useState(false);
  const [orgData, setOrgData] = useState({}); // {Region:[...], Chapter:[...]}
  const [designations, setDesignations] = useState([]);
  const [members, setMembers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [toastQ, setToastQ] = useState([]);

  const toast = (msg, type = "ok") => setToastQ(q => [...q, { id: mkId(), msg, type }]);
  const rmToast = id => setToastQ(q => q.filter(t => t.id !== id));

  const onSaveHierarchy = (newLevels) => {
    setHierarchySaved(true);
    // reset downstream data if hierarchy changes
    setOrgData({});
    setDesignations([]);
    setMembers([]);
    setMeetings([]);
  };

  // unlock rules
  const unlock = {
    hierarchy: true,
    org: hierarchySaved,
    designations: hierarchySaved && (levels.length === 0 || Object.values(orgData).some(arr => arr.length > 0)),
    members: designations.length > 0 || (hierarchySaved && levels.length === 0),
    meetings: members.length > 0,
  };

  const navTo = (p) => { if (unlock[p]) setPage(p); };

  // sidebar items
  const sidebarItems = [
    {
      section: "SETUP", items: [
        { id: "hierarchy", label: "Hierarchy", ico: "M3 6h18M3 12h12M3 18h8" },
        { id: "org", label: "Org Structure", ico: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75", sub: levels.map(lv => `${lv}s`) },
      ]
    },
    {
      section: "MANAGEMENT", items: [
        { id: "designations", label: "Designations", ico: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" },
        { id: "members", label: "Members", ico: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z" },
        { id: "meetings", label: "Meetings", ico: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
      ]
    },
  ];

  return <>
    <style>{CSS}</style>
    {toastQ.map(t => <Toast key={t.id} msg={t.msg} type={t.type} onClose={() => rmToast(t.id)} />)}
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>

      {/* SIDEBAR */}
      <aside style={{ width: 228, flexShrink: 0, background: "var(--white)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        {/* Logo */}
        <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 10px rgba(26,51,83,.22)" }}>
              <Ic d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" size={16} stroke="#fff" sw={1.8} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14.5, color: "var(--navy)", letterSpacing: "-.01em", lineHeight: 1 }}>NetAdmin</div>
              <div style={{ fontSize: 10.5, color: "var(--s400)", marginTop: 2, fontFamily: "var(--mono)" }}>
                {hierarchySaved && levels.length > 0 ? levels.join(" → ") : "Setup Mode"}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {sidebarItems.map(sec => (
            <div key={sec.section}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--s400)", letterSpacing: ".09em", textTransform: "uppercase", padding: "10px 4px 6px" }}>{sec.section}</div>
              {sec.items.map(it => {
                const locked = !unlock[it.id];
                return <div key={it.id}>
                  <button className={`ni${page === it.id ? " on" : ""}`} onClick={() => navTo(it.id)}
                    style={{ opacity: locked ? .4 : 1, cursor: locked ? "not-allowed" : "pointer", width: "100%" }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: page === it.id ? "var(--blue-lt)" : "var(--s100)" }}>
                      <Ic d={it.ico} size={13} stroke={page === it.id ? "var(--blue)" : "var(--s500)"} />
                    </div>
                    <span style={{ flex: 1 }}>{it.label}</span>
                    {locked && <Ic d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" size={11} stroke="var(--s300)" />}
                  </button>
                  {/* sub-levels for org structure */}
                  {it.id === "org" && it.sub && it.sub.length > 0 && page === "org" && (
                    <div style={{ paddingLeft: 28, marginTop: 2, marginBottom: 4, display: "flex", flexDirection: "column", gap: 2 }}>
                      {it.sub.map((s, i) => <div key={s} style={{ fontSize: 11.5, color: "var(--s400)", padding: "3px 8px", borderRadius: 5, fontWeight: 500 }}>· {s}</div>)}
                    </div>
                  )}
                </div>;
              })}
            </div>
          ))}
        </nav>

        {/* Status */}
        <div style={{ padding: "13px 18px", borderTop: "1px solid var(--border)", background: "var(--s50)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)" }} /><span style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>All systems live</span></div>
          <div style={{ fontSize: 11, color: "var(--s400)", marginTop: 3, fontFamily: "var(--mono)" }}>In-memory · No backend</div>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ padding: "13px 28px", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,.94)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", gap: 16 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "var(--navy)", letterSpacing: "-.02em", lineHeight: 1 }}>{PAGE_TITLES[page]}</div>
            <div style={{ fontSize: 12, color: "var(--s400)", marginTop: 3 }}>{PAGE_DESCS[page]}</div>
          </div>
          {hierarchySaved && levels.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 100, background: "var(--s50)", border: "1.5px solid var(--border)" }}>
              <Ic d="M3 6h18M3 12h12M3 18h8" size={12} stroke="var(--s500)" />
              <span style={{ fontSize: 11.5, color: "var(--s600)", fontWeight: 600, fontFamily: "var(--mono)" }}>{["SA", ...levels.map(l => l.slice(0, 2).toUpperCase()), "M"].join(" → ")}</span>
            </div>
          )}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)" }} /><span style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>Online</span></div>
            <div style={{ width: 1, height: 22, background: "var(--border)" }} />
            <span style={{ fontSize: 12, color: "var(--s500)", fontFamily: "var(--mono)" }}>{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
          <SetupProgress hierarchySaved={hierarchySaved} orgData={orgData} levels={levels} designations={designations} members={members} meetings={meetings} setPage={navTo} />
          {page === "hierarchy" && <HierarchyPage levels={levels} setLevels={setLevels} onSave={onSaveHierarchy} toast={toast} />}
          {page === "org" && <OrgStructurePage levels={levels} orgData={orgData} setOrgData={setOrgData} toast={toast} />}
          {page === "designations" && <DesignationsPage levels={levels} designations={designations} setDesignations={setDesignations} toast={toast} />}
          {page === "members" && <MembersPage levels={levels} orgData={orgData} members={members} setMembers={setMembers} designations={designations} toast={toast} />}
          {page === "meetings" && <MeetingsPage levels={levels} orgData={orgData} meetings={meetings} setMeetings={setMeetings} toast={toast} />}
        </div>
      </div>
    </div>
  </>;
}