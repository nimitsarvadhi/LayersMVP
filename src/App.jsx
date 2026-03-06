import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   DESIGN SYSTEM — Professional Light
   Fonts: Plus Jakarta Sans (UI) + JetBrains Mono (data)
   Palette: Slate whites, navy accent, clean shadows
═══════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #f4f6f9;
  --bg2:       #eef1f5;
  --white:     #ffffff;
  --navy:      #1a3353;
  --navy2:     #0f2340;
  --blue:      #2563eb;
  --blue-lt:   #eff6ff;
  --blue-md:   #dbeafe;
  --green:     #059669;
  --green-lt:  #ecfdf5;
  --red:       #dc2626;
  --red-lt:    #fef2f2;
  --amber:     #d97706;
  --amber-lt:  #fffbeb;
  --purple:    #7c3aed;
  --purple-lt: #f5f3ff;
  --slate-50:  #f8fafc;
  --slate-100: #f1f5f9;
  --slate-200: #e2e8f0;
  --slate-300: #cbd5e1;
  --slate-400: #94a3b8;
  --slate-500: #64748b;
  --slate-600: #475569;
  --slate-700: #334155;
  --slate-800: #1e293b;
  --slate-900: #0f172a;
  --text:      #1e293b;
  --text2:     #475569;
  --text3:     #94a3b8;
  --border:    #e2e8f0;
  --border2:   #cbd5e1;
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  --shadow:    0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
  --shadow-md: 0 8px 20px -4px rgba(0,0,0,0.1), 0 4px 8px -4px rgba(0,0,0,0.06);
  --shadow-lg: 0 20px 40px -8px rgba(0,0,0,0.12), 0 8px 16px -8px rgba(0,0,0,0.08);
  --radius:    12px;
  --font:      'Plus Jakarta Sans', system-ui, sans-serif;
  --mono:      'JetBrains Mono', monospace;
}

body { font-family: var(--font); background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; }

@keyframes fadeUp   { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
@keyframes slideRight { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:translateX(0); } }

.au0 { animation: fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both; }
.au1 { animation: fadeUp 0.35s 0.05s cubic-bezier(0.16,1,0.3,1) both; }
.au2 { animation: fadeUp 0.35s 0.1s  cubic-bezier(0.16,1,0.3,1) both; }
.au3 { animation: fadeUp 0.35s 0.15s cubic-bezier(0.16,1,0.3,1) both; }
.au4 { animation: fadeUp 0.35s 0.2s  cubic-bezier(0.16,1,0.3,1) both; }

/* ── Shared components ── */
.card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}

.input {
  width: 100%;
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding: 9px 13px;
  font-family: var(--font);
  font-size: 13.5px;
  font-weight: 400;
  color: var(--text);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.input::placeholder { color: var(--text3); }
.input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }

.select {
  width: 100%;
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding: 9px 34px 9px 13px;
  font-family: var(--font);
  font-size: 13.5px;
  font-weight: 400;
  color: var(--text);
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1.5l5 5 5-5' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}
.select:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
.select option { font-family: var(--font); }

.btn-primary {
  display: inline-flex; align-items: center; gap: 7px;
  background: var(--blue);
  color: #fff;
  border: none; border-radius: 8px;
  padding: 9px 18px;
  font-family: var(--font); font-size: 13.5px; font-weight: 600;
  cursor: pointer; transition: all 0.15s;
  white-space: nowrap;
}
.btn-primary:hover { background: #1d4ed8; box-shadow: 0 4px 12px rgba(37,99,235,0.3); transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); box-shadow: none; }

.btn-secondary {
  display: inline-flex; align-items: center; gap: 7px;
  background: var(--white);
  color: var(--text2);
  border: 1.5px solid var(--border); border-radius: 8px;
  padding: 9px 16px;
  font-family: var(--font); font-size: 13.5px; font-weight: 500;
  cursor: pointer; transition: all 0.15s;
  white-space: nowrap;
}
.btn-secondary:hover { border-color: var(--border2); color: var(--text); background: var(--slate-50); }

.btn-danger {
  display: inline-flex; align-items: center; gap: 7px;
  background: var(--red-lt);
  color: var(--red);
  border: 1.5px solid #fecaca; border-radius: 8px;
  padding: 9px 16px;
  font-family: var(--font); font-size: 13.5px; font-weight: 600;
  cursor: pointer; transition: all 0.15s;
}
.btn-danger:hover { background: #fee2e2; }

.badge {
  display: inline-flex; align-items: center;
  padding: 3px 9px; border-radius: 100px;
  font-size: 11.5px; font-weight: 600; font-family: var(--font);
  white-space: nowrap;
}

.lbl {
  display: block;
  font-size: 12px; font-weight: 600;
  color: var(--slate-500);
  letter-spacing: 0.02em;
  margin-bottom: 6px;
}

.mono { font-family: var(--mono); }

/* Nav */
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px; border-radius: 8px;
  font-size: 13.5px; font-weight: 500; color: var(--text2);
  cursor: pointer; border: none; background: none;
  transition: all 0.15s; width: 100%; text-align: left;
}
.nav-item:hover { background: var(--slate-100); color: var(--text); }
.nav-item.active { background: var(--blue-lt); color: var(--blue); font-weight: 600; }

/* Perm toggle */
.perm-toggle {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 12px; border-radius: 8px;
  background: var(--slate-50); border: 1.5px solid var(--border);
  font-size: 12.5px; font-weight: 500; color: var(--text2);
  cursor: pointer; transition: all 0.15s;
}
.perm-toggle:hover { border-color: var(--border2); color: var(--text); }
.perm-toggle.on { background: var(--blue-lt); border-color: #bfdbfe; color: var(--blue); font-weight: 600; }

.chk {
  width: 15px; height: 15px; border-radius: 4px; flex-shrink: 0;
  border: 1.5px solid var(--border2); background: var(--white);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.chk.on { background: var(--blue); border-color: var(--blue); }

/* Table */
.tbl-head {
  display: grid;
  grid-template-columns: 2fr 2fr 1.2fr 1.6fr 1.4fr 0.9fr 76px;
  padding: 10px 20px; gap: 8px;
  background: var(--slate-50);
  border-bottom: 1.5px solid var(--border);
}
.tbl-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1.2fr 1.6fr 1.4fr 0.9fr 76px;
  padding: 13px 20px; gap: 8px;
  border-bottom: 1px solid var(--border);
  align-items: center;
  transition: background 0.1s;
}
.tbl-row:hover { background: var(--slate-50); }
.tbl-row:last-child { border-bottom: none; }

/* Drag zone */
.drop-zone {
  border: 2px dashed var(--border2);
  border-radius: var(--radius);
  transition: all 0.2s; cursor: pointer;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 12px; padding: 56px 24px; text-align: center;
}
.drop-zone:hover, .drop-zone.over {
  border-color: var(--blue); background: var(--blue-lt);
}

/* Chip */
.desig-chip {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 12px 6px 14px; border-radius: 100px;
  font-size: 13px; font-weight: 600; border: 1.5px solid;
  transition: all 0.15s;
}
.desig-chip:hover { transform: translateY(-1px); box-shadow: var(--shadow-xs); }

/* Avatar */
.avatar {
  width: 34px; height: 34px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; font-family: var(--mono);
  flex-shrink: 0; letter-spacing: 0.03em;
}

/* Toast */
.toast-wrap {
  position: fixed; bottom: 24px; right: 24px; z-index: 999;
  animation: slideRight 0.3s cubic-bezier(0.16,1,0.3,1);
}

/* Scrollbar */
.scroll { overflow-y: auto; }
.scroll::-webkit-scrollbar { width: 5px; }
.scroll::-webkit-scrollbar-track { background: transparent; }
.scroll::-webkit-scrollbar-thumb { background: var(--slate-200); border-radius: 4px; }

/* Tree */
.tree-node {
  padding: 10px 22px; border-radius: 10px;
  font-size: 13.5px; font-weight: 600;
  min-width: 190px; text-align: center;
  transition: all 0.2s;
}
.tree-connector { width: 2px; height: 24px; background: linear-gradient(to bottom, #bfdbfe, #e0e7ff); margin: 0 auto; }

/* Divider */
.divider { height: 1px; background: var(--border); }

/* Layer card */
.layer-card {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-xs);
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.layer-card:hover { border-color: var(--border2); box-shadow: var(--shadow-sm); }
.layer-card.expanded { border-color: #bfdbfe; }

/* Stat card */
.stat-card {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 22px;
  box-shadow: var(--shadow-xs);
  transition: all 0.2s;
  position: relative; overflow: hidden;
}
.stat-card:hover { box-shadow: var(--shadow-sm); transform: translateY(-1px); }
.stat-card-bar {
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  border-radius: 12px 12px 0 0;
}

/* Modal */
.modal-bg {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(15,23,42,0.35);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
  animation: fadeIn 0.18s ease;
}
.modal-box {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  width: 100%; max-width: 476px;
  animation: fadeUp 0.28s cubic-bezier(0.16,1,0.3,1);
}

/* Level button */
.lvl-btn {
  flex: 1; padding: 11px 8px;
  border: 1.5px solid var(--border);
  border-radius: 9px;
  background: var(--white);
  font-family: var(--font); font-size: 17px; font-weight: 700;
  color: var(--text2); cursor: pointer; transition: all 0.15s;
}
.lvl-btn:hover { border-color: var(--border2); color: var(--text); background: var(--slate-50); }
.lvl-btn.on {
  background: var(--blue); border-color: var(--blue);
  color: #fff; box-shadow: 0 4px 12px rgba(37,99,235,0.25);
}

/* Search */
.search-wrap { position: relative; }
.search-wrap .ico { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text3); pointer-events: none; }
.search-wrap .input { padding-left: 38px; }

/* Info banner */
.info-banner {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 14px 16px; border-radius: 10px;
  background: var(--blue-lt); border: 1px solid #bfdbfe;
}
`;

/* ═══════════════════════════════════════
   DATA & HELPERS
═══════════════════════════════════════ */
const DEFAULT_DESIGNATIONS = [
  "VP", "Secretary / Treasurer", "Attendance Coordinator",
  "Event Coordinator", "Membership Chair", "Communications Lead", "Mentor",
];
const DEFAULT_NODES = [
  "Mumbai North", "Mumbai South", "Delhi Central", "Delhi South",
  "Pune West", "Bangalore East", "Hyderabad CBD", "Chennai North",
];
const ALL_PERMS = [
  { key: "manageMembers", label: "Manage Members" },
  { key: "viewAnalytics", label: "View Analytics" },
  { key: "viewFinancials", label: "View Financials" },
  { key: "approveVisitors", label: "Approve Visitors" },
  { key: "configureMeetings", label: "Configure Meetings" },
  { key: "manageEvents", label: "Manage Events" },
  { key: "exportData", label: "Export Data" },
  { key: "configureBranding", label: "Configure Branding" },
  { key: "sendAnnouncements", label: "Send Announcements" },
  { key: "createSubRoles", label: "Create Sub-Roles" },
];
const SCOPE_OPTS = ["Global", "Regional", "Chapter"];

const PALETTES = [
  { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  { bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe" },
  { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" },
  { bg: "#fffbeb", text: "#92400e", border: "#fde68a" },
  { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
  { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
  { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
];

const AVATAR_PAIRS = [
  ["#eff6ff", "#1d4ed8"], ["#f5f3ff", "#7c3aed"], ["#ecfdf5", "#059669"],
  ["#fffbeb", "#d97706"], ["#fef2f2", "#dc2626"], ["#f0fdf4", "#16a34a"],
];

const STAT_COLORS = ["#2563eb", "#059669", "#7c3aed", "#d97706"];

const SAMPLE_CSV = `Name,Email,Phone,Chapter/Region,Designation
Priya Sharma,priya.sharma@example.com,9876543210,Mumbai North,VP
Rahul Verma,rahul.verma@example.com,9123456789,Delhi Central,Mentor
Sneha Patel,sneha.patel@example.com,9988112233,Pune West,Event Coordinator
Karan Mehta,karan.mehta@example.com,9871234560,Bangalore East,Secretary / Treasurer
Ananya Nair,ananya.nair@example.com,9765432100,Chennai North,Membership Chair
Rohit Joshi,rohit.joshi@example.com,9654321087,Hyderabad CBD,Attendance Coordinator
Divya Iyer,divya.iyer@example.com,9543210976,Mumbai South,Communications Lead
Amit Das,amit.das@example.com,9432109865,Delhi South,VP`;

const SEED = [
  { _id: 1, Name: "Riya Shah", Email: "riya@example.com", Phone: "9876543210", "Chapter/Region": "Mumbai North", Designation: "VP", source: "manual" },
  { _id: 2, Name: "Arjun Mehta", Email: "arjun@example.com", Phone: "9123456780", "Chapter/Region": "Delhi South", Designation: "Mentor", source: "csv" },
  { _id: 3, Name: "Priya Nair", Email: "priya@example.com", Phone: "9988776655", "Chapter/Region": "Pune West", Designation: "Event Coordinator", source: "manual" },
];

const makeLayer = (id, name = "") => ({ id, name, scope: "Regional", perms: Object.fromEntries(ALL_PERMS.map(p => [p.key, false])) });
const emptyForm = () => ({ Name: "", Email: "", Phone: "", "Chapter/Region": "", Designation: "" });

function parseCSV(txt) {
  const lines = txt.trim().split("\n");
  const hdrs = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map((l, i) => {
    const vs = l.split(",").map(v => v.trim());
    const r = { _id: Date.now() + i, source: "csv" };
    hdrs.forEach((h, j) => { r[h] = vs[j] || ""; });
    return r;
  });
}
function validate(m) {
  const e = [];
  if (!m.Name) e.push("Name is required");
  if (!m.Email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.Email)) e.push("Valid email required");
  if (!m["Chapter/Region"]) e.push("Chapter / Region required");
  return e;
}
function dlCSV() {
  const b = new Blob([SAMPLE_CSV], { type: "text/csv" });
  const u = URL.createObjectURL(b);
  const a = document.createElement("a"); a.href = u; a.download = "sample_members.csv"; a.click();
  URL.revokeObjectURL(u);
}

/* ═══════════════════════════════════════
   TINY ICON
═══════════════════════════════════════ */
function Ic({ d, size = 16, sw = 1.7, stroke = "currentColor", fill = "none" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
}

/* ═══════════════════════════════════════
   TOAST
═══════════════════════════════════════ */
function Toast({ msg, type = "ok", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  const cfg = {
    ok: { bg: "#fff", border: "#bfdbfe", icon: "#2563eb", ic: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    good: { bg: "#fff", border: "#a7f3d0", icon: "#059669", ic: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    bad: { bg: "#fff", border: "#fecaca", icon: "#dc2626", ic: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
  }[type] || { bg: "#fff", border: "#e2e8f0", icon: "#64748b", ic: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" };
  return (
    <div className="toast-wrap">
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: cfg.bg, border: `1.5px solid ${cfg.border}`, borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 260, fontFamily: "var(--font)" }}>
        <Ic d={cfg.ic} size={17} stroke={cfg.icon} sw={2} />
        <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text)", flex: 1 }}>{msg}</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: 18, lineHeight: 1, display: "flex" }}>×</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MODAL
═══════════════════════════════════════ */
function Modal({ title, sub, onClose, children, footer }) {
  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ padding: "22px 26px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>{title}</div>
            {sub && <div style={{ fontSize: 12.5, color: "var(--text3)", marginTop: 3 }}>{sub}</div>}
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 7, border: "1.5px solid var(--border)", background: "var(--white)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text2)", flexShrink: 0 }}>
            <Ic d="M18 6L6 18M6 6l12 12" size={14} />
          </button>
        </div>
        <div style={{ padding: "22px 26px" }}>{children}</div>
        {footer && <div style={{ padding: "0 26px 22px", display: "flex", gap: 10 }}>{footer}</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   AVATAR
═══════════════════════════════════════ */
function Av({ name, idx = 0 }) {
  const [bg, fg] = AVATAR_PAIRS[(name.charCodeAt(0) + (idx || 0)) % AVATAR_PAIRS.length];
  const ini = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return <div className="avatar" style={{ background: bg, color: fg }}>{ini}</div>;
}

/* ═══════════════════════════════════════
   BADGE
═══════════════════════════════════════ */
function DesigBadge({ label, designations }) {
  if (!label) return <span style={{ color: "var(--text3)", fontSize: 12.5 }}>—</span>;
  const i = designations.indexOf(label);
  const p = PALETTES[Math.max(i, 0) % PALETTES.length];
  return <span className="badge" style={{ background: p.bg, color: p.text, border: `1px solid ${p.border}` }}>{label}</span>;
}

/* ═══════════════════════════════════════════════════
   SECTION 1 — HIERARCHY BUILDER
═══════════════════════════════════════════════════ */
function LayerCard({ layer, index, onUpdate, onDelete }) {
  const [open, setOpen] = useState(true);
  const cnt = Object.values(layer.perms).filter(Boolean).length;
  const tog = k => onUpdate({ ...layer, perms: { ...layer.perms, [k]: !layer.perms[k] } });

  return (
    <div className={`layer-card${open ? " expanded" : ""}`} style={{ animation: `fadeUp 0.3s ${index * 0.07}s both` }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", cursor: "pointer", userSelect: "none", background: "var(--slate-50)" }} onClick={() => setOpen(o => !o)}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--blue-lt)", border: "1.5px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: "var(--blue)" }}>
          L{index + 2}
        </div>
        <input
          className="input"
          style={{ border: "none", background: "transparent", boxShadow: "none", padding: "0", fontSize: 13.5, fontWeight: 600, color: "var(--text)", flex: 1, minWidth: 0, fontFamily: "var(--font)" }}
          value={layer.name}
          placeholder={`Layer ${index + 2} — e.g. "Region Admin"`}
          onClick={e => e.stopPropagation()}
          onChange={e => onUpdate({ ...layer, name: e.target.value })}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span className="badge" style={{ background: cnt > 0 ? "var(--blue-lt)" : "var(--slate-100)", color: cnt > 0 ? "var(--blue)" : "var(--text3)", border: `1px solid ${cnt > 0 ? "#bfdbfe" : "var(--border)"}`, fontFamily: "var(--mono)", fontSize: 11 }}>
            {cnt}/{ALL_PERMS.length} perms
          </span>
          <select className="select" style={{ width: "auto", padding: "6px 28px 6px 10px", fontSize: 12, borderRadius: 7 }} value={layer.scope} onClick={e => e.stopPropagation()} onChange={e => onUpdate({ ...layer, scope: e.target.value })}>
            {SCOPE_OPTS.map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={e => { e.stopPropagation(); onDelete(layer.id); }}
            style={{ width: 28, height: 28, borderRadius: 7, border: "1.5px solid var(--border)", background: "var(--white)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text3)", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#fecaca"; e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.background = "var(--red-lt)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.background = "var(--white)"; }}>
            <Ic d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" size={13} />
          </button>
          <div style={{ color: "var(--text3)", fontSize: 11, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>▼</div>
        </div>
      </div>

      {/* Permissions grid */}
      {open && (
        <div style={{ padding: "14px 16px 16px", borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>Permissions</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {ALL_PERMS.map(p => (
              <div key={p.key} className={`perm-toggle${layer.perms[p.key] ? " on" : ""}`} onClick={() => tog(p.key)}>
                <div className={`chk${layer.perms[p.key] ? " on" : ""}`}>
                  {layer.perms[p.key] && <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg>}
                </div>
                {p.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TreePreview({ layers }) {
  const nodes = [
    { label: "Super Admin", type: "top" },
    ...layers.map((l, i) => ({ label: l.name || `Layer ${i + 2}`, scope: l.scope, type: "mid" })),
    { label: "Members", type: "bot" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0" }}>
      {nodes.map((n, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <div className="tree-node" style={{
            background: n.type === "top" ? "var(--navy)" : n.type === "bot" ? "var(--slate-100)" : "var(--white)",
            color: n.type === "top" ? "#fff" : n.type === "bot" ? "var(--text3)" : "var(--text)",
            border: n.type === "top" ? "none" : n.type === "bot" ? "1.5px solid var(--border)" : "1.5px solid #bfdbfe",
            boxShadow: n.type === "top" ? "0 4px 14px rgba(26,51,83,0.25)" : n.type === "bot" ? "none" : "var(--shadow-xs)",
          }}>
            {n.label || <em style={{ fontWeight: 400, color: "var(--text3)" }}>Unnamed</em>}
            {n.scope && <span className="badge" style={{ marginLeft: 8, background: "rgba(255,255,255,0.15)", color: n.type === "top" ? "#fff" : "var(--blue)", border: "none", fontSize: 10 }}>{n.scope}</span>}
          </div>
          {i < nodes.length - 1 && <div className="tree-connector" />}
        </div>
      ))}
    </div>
  );
}

function HierarchyBuilder() {
  const [layers, setLayers] = useState([makeLayer(1, "Region Admin"), makeLayer(2, "Chapter Admin")]);
  const [toast, setToast] = useState(null);
  const ctr = useRef(20);
  const total = layers.length + 2;

  const setCount = n => {
    const t = n - 2;
    if (t > layers.length) {
      const add = Array.from({ length: t - layers.length }, () => { ctr.current++; return makeLayer(ctr.current); });
      setLayers(l => [...l, ...add]);
    } else setLayers(l => l.slice(0, t));
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Left */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Level picker */}
        <div className="card au0" style={{ padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4 }}>Hierarchy Depth</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--navy)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                {total} <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text2)" }}>levels</span>
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: 12, color: "var(--text3)" }}>
              <div>{layers.length} configurable</div>
              <div>2 fixed (locked)</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[2, 3, 4, 5, 6].map(n => (
              <button key={n} className={`lvl-btn${total === n ? " on" : ""}`} onClick={() => setCount(n)}>{n}</button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>Flat (2-tier)</span>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>Enterprise (6-tier)</span>
          </div>
        </div>

        {/* Super Admin locked */}
        <div className="au1" style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 12, background: "var(--navy)", boxShadow: "0 4px 16px rgba(26,51,83,0.2)" }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Ic d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" size={15} stroke="#fff" sw={2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", lineHeight: 1 }}>Super Admin</div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", marginTop: 3 }}>Level 1 · All Permissions · Global Scope · Locked</div>
          </div>
          <span className="badge" style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", fontSize: 10, border: "none" }}>FIXED</span>
        </div>

        {/* Layers */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {layers.map((l, i) => (
            <LayerCard key={l.id} layer={l} index={i}
              onUpdate={u => setLayers(ls => ls.map(x => x.id === u.id ? u : x))}
              onDelete={id => setLayers(ls => ls.filter(x => x.id !== id))} />
          ))}
        </div>

        {/* Members locked */}
        <div className="au2" style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 12, background: "var(--slate-100)", border: "1.5px solid var(--border)" }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--slate-200)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Ic d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z" size={15} stroke="var(--text3)" sw={1.7} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text2)", lineHeight: 1 }}>Members</div>
            <div style={{ fontSize: 11.5, color: "var(--text3)", marginTop: 3 }}>Level {total} · Self Scope · Standard Access · Locked</div>
          </div>
          <span className="badge" style={{ background: "var(--slate-200)", color: "var(--text3)", fontSize: 10, border: "none" }}>FIXED</span>
        </div>

        {/* Save */}
        <button className="btn-primary au3" style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: 14, borderRadius: 10 }}
          onClick={() => setToast({ msg: "Hierarchy saved successfully!", type: "good" })}>
          <Ic d="M5 13l4 4L19 7" size={16} stroke="#fff" sw={2.5} />
          Save Structure
        </button>
      </div>

      {/* Right — sticky tree */}
      <div style={{ position: "sticky", top: 20 }}>
        <div className="card au0" style={{ padding: "20px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4 }}>Live Preview</div>
          <div style={{ fontSize: 12.5, color: "var(--text2)", marginBottom: 16 }}>Updates as you configure</div>
          <div className="divider" style={{ marginBottom: 18 }} />
          <TreePreview layers={layers} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION 2 — MEMBERS
═══════════════════════════════════════════════════ */
function MemberModal({ member, designations, onSave, onClose }) {
  const [form, setForm] = useState(member ? { ...member } : emptyForm());
  const [errs, setErrs] = useState([]);
  const isEdit = !!member;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    const e = validate(form);
    if (e.length) { setErrs(e); return; }
    onSave(form);
  };

  const flds = [
    { k: "Name", t: "text", ph: "Full name", ic: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" },
    { k: "Email", t: "email", ph: "Email address", ic: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm18 2l-10 7L2 6" },
    { k: "Phone", t: "tel", ph: "Phone number (optional)", ic: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.82a16 16 0 006.29 6.29l1.05-1.05a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" },
  ];

  return (
    <Modal title={isEdit ? "Edit Member" : "Add Member"} sub={isEdit ? "Update member details" : "Fill in details to add manually"} onClose={onClose}
      footer={<>
        <button className="btn-secondary" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Cancel</button>
        <button className="btn-primary" style={{ flex: 2, justifyContent: "center" }} onClick={submit}>
          <Ic d={isEdit ? "M5 13l4 4L19 7" : "M12 5v14M5 12h14"} size={14} stroke="#fff" sw={2.5} />
          {isEdit ? "Save Changes" : "Add Member"}
        </button>
      </>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {errs.length > 0 && (
          <div style={{ background: "var(--red-lt)", border: "1.5px solid #fecaca", borderRadius: 9, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 5 }}>
            {errs.map((e, i) => <div key={i} style={{ fontSize: 12.5, color: "var(--red)", display: "flex", alignItems: "center", gap: 7 }}>
              <Ic d="M12 9v4m0 4h.01" size={13} stroke="var(--red)" />
              {e}
            </div>)}
          </div>
        )}
        {flds.map(({ k, t, ph, ic }) => (
          <div key={k}>
            <label className="lbl">{k}</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", pointerEvents: "none" }}>
                <Ic d={ic} size={15} />
              </div>
              <input type={t} className="input" value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph} style={{ paddingLeft: 38 }} />
            </div>
          </div>
        ))}
        <div>
          <label className="lbl">Chapter / Region *</label>
          <select className="select" value={form["Chapter/Region"]} onChange={e => set("Chapter/Region", e.target.value)}>
            <option value="">Select a region or chapter…</option>
            {DEFAULT_NODES.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="lbl">Designation</label>
          <select className="select" value={form.Designation} onChange={e => set("Designation", e.target.value)}>
            <option value="">Select designation…</option>
            {designations.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
    </Modal>
  );
}

function DeleteModal({ member, onConfirm, onCancel }) {
  return (
    <Modal title="Remove Member" sub="This action cannot be undone" onClose={onCancel}
      footer={<>
        <button className="btn-secondary" style={{ flex: 1, justifyContent: "center" }} onClick={onCancel}>Cancel</button>
        <button className="btn-danger" style={{ flex: 1, justifyContent: "center" }} onClick={onConfirm}>
          <Ic d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" size={14} />
          Remove
        </button>
      </>}>
      <div style={{ textAlign: "center", padding: "6px 0 4px" }}>
        <div style={{ width: 52, height: 52, borderRadius: 13, background: "var(--red-lt)", border: "1.5px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <Ic d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" size={22} stroke="var(--red)" />
        </div>
        <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 6 }}>{member?.Name}</div>
        <div style={{ fontSize: 13, color: "var(--text2)" }}>{member?.Email}</div>
        <div style={{ fontSize: 12.5, color: "var(--text3)", marginTop: 8 }}>Will be permanently removed from the platform.</div>
      </div>
    </Modal>
  );
}

function MemberManagement({ designations }) {
  const [members, setMembers] = useState(SEED);
  const [modal, setModal] = useState(null);
  const [delId, setDelId] = useState(null);
  const [search, setSearch] = useState("");
  const [fNode, setFNode] = useState("");
  const [fSrc, setFSrc] = useState("");
  const [csvPrev, setCsvPrev] = useState(null);
  const [toast, setToast] = useState(null);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();
  const ctr = useRef(300);

  const show = (msg, type = "ok") => setToast({ msg, type });

  const saveMember = form => {
    if (modal === "add") { ctr.current++; setMembers(ms => [...ms, { ...form, _id: ctr.current, source: "manual" }]); show(`${form.Name} added successfully`, "good"); }
    else { setMembers(ms => ms.map(m => m._id === form._id ? form : m)); show(`${form.Name} updated`, "ok"); }
    setModal(null);
  };

  const doDelete = () => {
    const m = members.find(x => x._id === delId);
    setMembers(ms => ms.filter(x => x._id !== delId));
    setDelId(null);
    show(`${m?.Name} removed`, "bad");
  };

  const processFile = f => { const r = new FileReader(); r.onload = e => setCsvPrev(parseCSV(e.target.result)); r.readAsText(f); };
  const onDrop = useCallback(e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }, []);

  const confirmCSV = () => {
    const valid = csvPrev.filter(r => validate(r).length === 0);
    setMembers(ms => [...ms, ...valid.map(r => { ctr.current++; return { ...r, _id: ctr.current }; })]);
    setCsvPrev(null);
    show(`${valid.length} members imported`, "good");
  };

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    return (!q || m.Name.toLowerCase().includes(q) || m.Email.toLowerCase().includes(q) || (m["Chapter/Region"] || "").toLowerCase().includes(q))
      && (!fNode || m["Chapter/Region"] === fNode)
      && (!fSrc || m.source === fSrc);
  });

  const stats = [
    { label: "Total Members", val: members.length, color: STAT_COLORS[0] },
    { label: "Added Manually", val: members.filter(m => m.source === "manual").length, color: STAT_COLORS[1] },
    { label: "CSV Imported", val: members.filter(m => m.source === "csv").length, color: STAT_COLORS[2] },
    { label: "Active Regions", val: [...new Set(members.map(m => m["Chapter/Region"]))].filter(Boolean).length, color: STAT_COLORS[3] },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {modal && <MemberModal member={modal === "add" ? null : modal} designations={designations} onSave={saveMember} onClose={() => setModal(null)} />}
      {delId && <DeleteModal member={members.find(m => m._id === delId)} onConfirm={doDelete} onCancel={() => setDelId(null)} />}

      {/* Stats row */}
      <div className="au0" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {stats.map((s, i) => (
          <div key={s.label} className="stat-card" style={{ animationDelay: `${i * 0.06}s`, animation: "fadeUp 0.35s both" }}>
            <div className="stat-card-bar" style={{ background: s.color }} />
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "var(--mono)" }}>{s.val}</div>
            <div style={{ fontSize: 12.5, color: "var(--text2)", fontWeight: 500, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="au1" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
          <span className="ico"><Ic d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" size={15} stroke="var(--text3)" /></span>
          <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, region…" />
        </div>
        <select className="select" value={fNode} onChange={e => setFNode(e.target.value)} style={{ width: "auto" }}>
          <option value="">All Regions</option>
          {DEFAULT_NODES.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <select className="select" value={fSrc} onChange={e => setFSrc(e.target.value)} style={{ width: "auto" }}>
          <option value="">All Sources</option>
          <option value="manual">Manual</option>
          <option value="csv">CSV Import</option>
        </select>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="btn-secondary" onClick={dlCSV}>
            <Ic d="M12 3v12m0 0l-4-4m4 4l4-4M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" size={14} />
            Sample CSV
          </button>
          <button className="btn-secondary" onClick={() => fileRef.current.click()}>
            <Ic d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" size={14} />
            Import CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) processFile(e.target.files[0]); e.target.value = ""; }} />
          <button className="btn-primary" onClick={() => setModal("add")}>
            <Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" sw={2.5} />
            Add Member
          </button>
        </div>
      </div>

      {/* CSV preview */}
      {csvPrev && (
        <div className="card" style={{ overflow: "hidden", animation: "fadeUp 0.3s ease" }}>
          <div style={{ padding: "13px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, background: "var(--slate-50)" }}>
            <Ic d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" size={15} stroke="var(--blue)" />
            <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--text)" }}>CSV Preview</span>
            <span className="badge" style={{ background: "var(--green-lt)", color: "var(--green)", border: "1px solid #a7f3d0" }}>✓ {csvPrev.filter(r => validate(r).length === 0).length} valid</span>
            <span className="badge" style={{ background: "var(--red-lt)", color: "var(--red)", border: "1px solid #fecaca" }}>✗ {csvPrev.filter(r => validate(r).length > 0).length} errors</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button className="btn-secondary" style={{ padding: "6px 14px", fontSize: 12.5 }} onClick={() => setCsvPrev(null)}>Discard</button>
              <button className="btn-primary" style={{ padding: "6px 14px", fontSize: 12.5 }} onClick={confirmCSV}>Import Valid Rows</button>
            </div>
          </div>
          <div className="scroll" style={{ maxHeight: 200, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead><tr style={{ background: "var(--slate-50)" }}>
                {["Name", "Email", "Phone", "Chapter/Region", "Designation", "Status"].map(c => (
                  <th key={c} style={{ padding: "9px 16px", textAlign: "left", color: "var(--text3)", fontWeight: 700, fontSize: 11, letterSpacing: "0.07em", borderBottom: "1px solid var(--border)", textTransform: "uppercase" }}>{c}</th>
                ))}
              </tr></thead>
              <tbody>
                {csvPrev.map(row => {
                  const e = validate(row);
                  return (
                    <tr key={row._id} style={{ background: e.length ? "#fff8f8" : "var(--white)", borderBottom: "1px solid var(--border)" }}>
                      {["Name", "Email", "Phone", "Chapter/Region", "Designation"].map(c => (
                        <td key={c} style={{ padding: "9px 16px", color: "var(--text)" }}>{row[c] || <span style={{ color: "var(--text3)" }}>—</span>}</td>
                      ))}
                      <td style={{ padding: "9px 16px" }}>
                        {e.length
                          ? <span style={{ color: "var(--red)", fontWeight: 600, fontSize: 11.5 }}>✗ {e[0]}</span>
                          : <span style={{ color: "var(--green)", fontWeight: 600, fontSize: 11.5 }}>✓ Valid</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drop zone — empty state */}
      {members.length === 0 && !csvPrev && (
        <div className={`drop-zone${drag ? " over" : ""}`}
          onDrop={onDrop} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
          onClick={() => fileRef.current.click()}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: "var(--blue-lt)", border: "1.5px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" size={22} stroke="var(--blue)" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text)" }}>Drop a CSV file here</div>
            <div style={{ fontSize: 12.5, color: "var(--text3)", marginTop: 4 }}>or click to browse · Required: Name, Email, Chapter/Region</div>
          </div>
        </div>
      )}

      {/* Table */}
      {members.length > 0 && (
        <div className="card au2" style={{ overflow: "hidden" }}>
          {/* Head */}
          <div className="tbl-head">
            {["MEMBER", "EMAIL", "PHONE", "CHAPTER / REGION", "DESIGNATION", "SOURCE", ""].map(h => (
              <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", letterSpacing: "0.07em" }}>{h}</div>
            ))}
          </div>
          {/* Body */}
          {filtered.length === 0
            ? (
              <div style={{ padding: "48px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 14, color: "var(--text2)", fontWeight: 500 }}>No members match your filters.</div>
                <button className="btn-secondary" style={{ margin: "12px auto 0", display: "inline-flex" }} onClick={() => { setSearch(""); setFNode(""); setFSrc(""); }}>Clear filters</button>
              </div>
            )
            : (
              <div className="scroll" style={{ maxHeight: 480 }}>
                {filtered.map((m, idx) => {
                  const srcStyle = m.source === "csv"
                    ? { background: "var(--purple-lt)", color: "var(--purple)", border: "1px solid #ddd6fe" }
                    : { background: "var(--green-lt)", color: "var(--green)", border: "1px solid #a7f3d0" };
                  return (
                    <div key={m._id} className="tbl-row" style={{ animation: `fadeUp 0.3s ${idx * 0.03}s both` }}>
                      {/* Member */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                        <Av name={m.Name} idx={idx} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.Name}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.Email}</div>
                      <div style={{ fontSize: 12.5, color: "var(--text3)", fontFamily: "var(--mono)" }}>{m.Phone || "—"}</div>
                      <div style={{ fontSize: 13, color: "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m["Chapter/Region"]}</div>
                      <div><DesigBadge label={m.Designation} designations={designations} /></div>
                      <div><span className="badge" style={{ ...srcStyle, fontSize: 11 }}>{m.source === "csv" ? "CSV" : "Manual"}</span></div>
                      {/* Actions */}
                      <div style={{ display: "flex", gap: 5, justifyContent: "flex-end" }}>
                        <button onClick={() => setModal(m)}
                          style={{ width: 28, height: 28, borderRadius: 7, border: "1.5px solid transparent", background: "none", cursor: "pointer", color: "var(--text3)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "#bfdbfe"; e.currentTarget.style.color = "var(--blue)"; e.currentTarget.style.background = "var(--blue-lt)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.background = "none"; }}>
                          <Ic d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" size={12.5} />
                        </button>
                        <button onClick={() => setDelId(m._id)}
                          style={{ width: 28, height: 28, borderRadius: 7, border: "1.5px solid transparent", background: "none", cursor: "pointer", color: "var(--text3)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "#fecaca"; e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.background = "var(--red-lt)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.background = "none"; }}>
                          <Ic d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" size={12.5} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          }
          {/* Footer */}
          <div style={{ padding: "10px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", background: "var(--slate-50)" }}>
            <span style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--mono)" }}>Showing {filtered.length} of {members.length} members</span>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>
              {(search || fNode || fSrc) ? "Filtered view — " : ""}
              <button onClick={() => setModal("add")} style={{ background: "none", border: "none", color: "var(--blue)", cursor: "pointer", fontFamily: "var(--font)", fontSize: 12, fontWeight: 600, padding: 0 }}>+ Add member</button>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION 3 — DESIGNATIONS
═══════════════════════════════════════════════════ */
function Designations({ designations, setDesignations }) {
  const [input, setInput] = useState("");
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState("");

  const add = () => { const v = input.trim(); if (v && !designations.includes(v)) { setDesignations(d => [...d, v]); setInput(""); } };
  const remove = d => setDesignations(ds => ds.filter(x => x !== d));
  const startEdit = d => { setEditing(d); setEditVal(d); };
  const saveEdit = () => {
    const v = editVal.trim();
    if (v && v !== editing && !designations.includes(v)) setDesignations(ds => ds.map(x => x === editing ? v : x));
    setEditing(null);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Main card */}
      <div className="card au0" style={{ padding: "26px 28px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6 }}>Designation Manager</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--navy)", letterSpacing: "-0.02em", lineHeight: 1 }}>
              {designations.length} <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text2)" }}>active designations</span>
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: 12, color: "var(--text3)", lineHeight: "1.7" }}>
            Auto-synced to<br />member modals
          </div>
        </div>

        <div className="divider" style={{ marginBottom: 22 }} />

        {/* Chip grid */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, minHeight: 52, marginBottom: 24 }}>
          {designations.map((d, i) => {
            const p = PALETTES[i % PALETTES.length];
            if (editing === d) return (
              <div key={d} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <input autoFocus value={editVal} onChange={e => setEditVal(e.target.value)} className="input"
                  style={{ width: 170, padding: "5px 11px", fontSize: 13, borderColor: "var(--blue)" }}
                  onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(null); }} />
                <button className="btn-primary" style={{ padding: "5px 12px", fontSize: 12, borderRadius: 7 }} onClick={saveEdit}>Save</button>
                <button className="btn-secondary" style={{ padding: "5px 10px", fontSize: 12, borderRadius: 7 }} onClick={() => setEditing(null)}>✕</button>
              </div>
            );
            return (
              <div key={d} className="desig-chip" style={{ background: p.bg, color: p.text, borderColor: p.border }}>
                <span title="Double-click to edit" onDoubleClick={() => startEdit(d)}>{d}</span>
                <button onClick={() => remove(d)} style={{ background: "none", border: "none", cursor: "pointer", color: p.text, opacity: 0.5, display: "flex", alignItems: "center", padding: 0, lineHeight: 1, transition: "opacity 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.5"}>
                  <Ic d="M18 6L6 18M6 6l12 12" size={12} stroke={p.text} />
                </button>
              </div>
            );
          })}
          {designations.length === 0 && <div style={{ color: "var(--text3)", fontSize: 13.5, fontStyle: "italic" }}>No designations yet — add one below.</div>}
        </div>

        {/* Add input */}
        <div style={{ display: "flex", gap: 10 }}>
          <input className="input" style={{ flex: 1 }} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add()} placeholder="New designation name — press Enter to add" />
          <button className="btn-primary" onClick={add} style={{ flexShrink: 0 }}>
            <Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" sw={2.5} />
            Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="info-banner au1">
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--blue-lt)", border: "1.5px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Ic d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={15} stroke="var(--blue)" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)", marginBottom: 4 }}>Live sync enabled</div>
          <div style={{ fontSize: 12.5, color: "var(--text2)", lineHeight: "1.6" }}>
            All designations appear instantly in the Add / Edit Member modal dropdown. Double-click any chip to rename it inline.
          </div>
        </div>
      </div>

      {/* Palette preview */}
      <div className="card au2" style={{ padding: "20px 24px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 14 }}>Color Palette</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {PALETTES.map((p, i) => (
            <div key={i} style={{
              padding: "5px 14px", borderRadius: 100,
              background: p.bg, color: p.text, border: `1.5px solid ${p.border}`,
              fontSize: 12, fontWeight: 600,
            }}>
              {designations[i] || `Slot ${i + 1}`}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 12 }}>Designations cycle through 7 color slots in order of creation.</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════ */
const NAV = [
  { id: 0, label: "Hierarchy", desc: "Structure & Roles", icon: "M3 6h18M3 12h12M3 18h8" },
  { id: 1, label: "Members", desc: "Directory & Import", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
  { id: 2, label: "Designations", desc: "Roles & Badges", icon: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01" },
];

export default function App() {
  const [tab, setTab] = useState(0);
  const [designations, setDesignations] = useState(DEFAULT_DESIGNATIONS);

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)", fontFamily: "var(--font)" }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: 228, flexShrink: 0,
          background: "var(--white)",
          borderRight: "1px solid var(--border)",
          display: "flex", flexDirection: "column",
          position: "sticky", top: 0, height: "100vh",
          boxShadow: "1px 0 0 var(--border)",
        }}>
          {/* Logo */}
          <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(26,51,83,0.25)" }}>
                <Ic d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" size={17} stroke="#fff" sw={1.8} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "var(--navy)", letterSpacing: "-0.02em", lineHeight: 1 }}>NetAdmin</div>
                <div style={{ fontSize: 10.5, color: "var(--text3)", marginTop: 3, fontFamily: "var(--mono)" }}>v1.0 · MVP</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ padding: "14px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text3)", letterSpacing: "0.09em", textTransform: "uppercase", padding: "6px 4px 8px" }}>Configuration</div>
            {NAV.map(n => (
              <button key={n.id} className={`nav-item${tab === n.id ? " active" : ""}`} onClick={() => setTab(n.id)}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  background: tab === n.id ? "var(--blue-lt)" : "var(--slate-100)", transition: "all 0.15s"
                }}>
                  <Ic d={n.icon} size={14} stroke={tab === n.id ? "var(--blue)" : "var(--slate-500)"} />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: tab === n.id ? 700 : 500, color: tab === n.id ? "var(--blue)" : "var(--text2)", lineHeight: 1 }}>{n.label}</div>
                  <div style={{ fontSize: 10.5, color: "var(--text3)", marginTop: 2, fontFamily: "var(--mono)" }}>{n.desc}</div>
                </div>
              </button>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", background: "var(--slate-50)" }}>
            <div style={{ fontSize: 11.5, color: "var(--text3)", lineHeight: "1.7" }}>
              Community Networking<br />Platform Admin — MVP
            </div>
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)" }} />
              <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>Live · All changes in memory</span>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          {/* Topbar */}
          <div style={{
            padding: "14px 28px",
            borderBottom: "1px solid var(--border)",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(10px)",
            position: "sticky", top: 0, zIndex: 10,
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--navy)", letterSpacing: "-0.02em", lineHeight: 1 }}>{NAV[tab].label}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 3 }}>{NAV[tab].desc}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
              <span className="badge" style={{ background: "var(--blue-lt)", color: "var(--blue)", border: "1px solid #bfdbfe", fontFamily: "var(--mono)", fontSize: 11 }}>
                {designations.length} designations
              </span>
              <div style={{ width: 1, height: 24, background: "var(--border)" }} />
              <span style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--mono)" }}>
                {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="scroll" style={{ flex: 1, padding: "26px 28px", overflowY: "auto" }}>
            {tab === 0 && <HierarchyBuilder />}
            {tab === 1 && <MemberManagement designations={designations} />}
            {tab === 2 && <Designations designations={designations} setDesignations={setDesignations} />}
          </div>
        </main>
      </div>
    </>
  );
}