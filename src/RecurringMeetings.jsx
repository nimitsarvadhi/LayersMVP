import { useState } from "react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${m} ${ampm}`;
}

function getLocalDateString(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return getLocalDateString(d);
}

function getDayOfWeek(dateStr) {
  return new Date(dateStr + "T00:00:00").getDay();
}

function generateOccurrences(form) {
  const { startDate, endDate, meetingDay } = form;
  if (!startDate || !endDate || meetingDay === "") return [];
  const targetDay = parseInt(meetingDay);
  const occurrences = [];
  let current = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");

  // Advance to first matching weekday
  while (current.getDay() !== targetDay) {
    current.setDate(current.getDate() + 1);
  }

  while (current <= end) {
    const localStr = getLocalDateString(current);
    occurrences.push({
      id: `occ-${localStr}-${Math.random().toString(36).slice(2, 6)}`,
      date: localStr,
      status: "scheduled",
      rescheduledTo: null,
      note: null,
    });
    current.setDate(current.getDate() + 7);
  }
  return occurrences;
}

const STATUS_CONFIG = {
  scheduled: { label: "Scheduled", dot: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d" },
  skipped: { label: "Skipped", dot: "#eab308", bg: "#fefce8", border: "#fef08a", text: "#a16207" },
  cancelled: { label: "Cancelled", dot: "#ef4444", bg: "#fef2f2", border: "#fecaca", text: "#b91c1c" },
  rescheduled: { label: "Rescheduled", dot: "#f97316", bg: "#fff7ed", border: "#fed7aa", text: "#c2410c" },
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "events", label: "Events" },
  { id: "notifications", label: "Notifications" },
];

const defaultForm = {
  title: "",
  description: "",
  meetingDay: "",
  startDate: "",
  endDate: "",
  time: "",
  location: "",
};

export default function RecurringMeetings() {
  const [activeNav, setActiveNav] = useState("events");
  const [form, setForm] = useState(defaultForm);
  const [notifications, setNotifications] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [selectedOcc, setSelectedOcc] = useState(null);
  const [actionNote, setActionNote] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [actionType, setActionType] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [events, setEvents] = useState([]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function addNotification(message) {
    setNotifications(prev => [{
      id: Date.now(),
      message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toLocaleDateString(),
    }, ...prev]);
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleGenerate(e) {
    e.preventDefault();
    if (!form.title || form.meetingDay === "" || !form.startDate || !form.endDate || !form.time) {
      showToast("Please fill in all required fields.");
      return;
    }
    const occs = generateOccurrences(form);
    if (occs.length === 0) {
      showToast("No meetings found in the selected date range for that weekday.");
      return;
    }
    const newEvent = {
      id: `evt-${Date.now()}`,
      ...form,
      occurrences: occs,
      createdAt: new Date().toISOString(),
    };
    setEvents(prev => [newEvent, ...prev]);
    setActiveEvent(newEvent);
    setForm(defaultForm);
    addNotification(`Recurring event "${newEvent.title}" created with ${occs.length} meetings.`);
    showToast(`${occs.length} meetings generated!`);
    setActiveNav("events");
  }

  function openActionModal(occ) {
    setSelectedOcc(occ);
    setActionNote("");
    setCustomDate("");
    setCustomTime("");
    setActionType(null);
    setShowActionModal(true);
  }

  function applyAction(action) {
    if (!selectedOcc || !activeEvent) return;
    const occ = selectedOcc;
    let updatedOcc = { ...occ };
    let notifMsg = "";

    const nextMeetingOcc = activeEvent.occurrences.find(o =>
      o.date > occ.date && o.status === "scheduled"
    );
    const nextMeetingStr = nextMeetingOcc
      ? `Next meeting: ${formatDate(nextMeetingOcc.date)} at ${formatTime(activeEvent.time)}.`
      : "No upcoming meetings scheduled.";

    if (action === "skip") {
      if (!customDate || !customTime) {
        showToast("Please provide a custom date and time to reschedule.");
        return;
      }
      updatedOcc.status = "rescheduled";
      updatedOcc.rescheduledTo = customDate; // Keep for history
      updatedOcc.date = customDate; // CHANGE MAIN DATE
      updatedOcc.note = actionNote || `Rescheduled to custom date and time`;
      notifMsg = `Meeting originally on ${formatDate(occ.date)} has been rescheduled to ${formatDate(customDate)} at ${customTime}.`;
    } else if (action === "cancel") {
      updatedOcc.status = "cancelled";
      updatedOcc.rescheduledTo = null; // Clear any existing
      updatedOcc.note = actionNote || "Cancelled by admin";
      notifMsg = `Meeting on ${formatDate(occ.date)} has been cancelled${actionNote ? " — " + actionNote : " due to a public holiday"}. ${nextMeetingStr}`;
    } else if (action === "move") {
      const nextDay = addDays(occ.date, 1);
      updatedOcc.status = "rescheduled";
      updatedOcc.rescheduledTo = nextDay;
      updatedOcc.date = nextDay; // CHANGE MAIN DATE
      updatedOcc.note = actionNote || "Rescheduled to next day";
      notifMsg = `Meeting originally on ${formatDate(occ.date)} has been rescheduled to ${formatDate(nextDay)} at ${formatTime(activeEvent.time)}.`;
    } else if (action === "notify") {
      notifMsg = `Reminder: Meeting on ${formatDate(occ.date)} at ${formatTime(activeEvent.time)}${activeEvent.location ? " — " + activeEvent.location : ""}. Status: ${STATUS_CONFIG[occ.status]?.label}.`;
    }

    if (action !== "notify") {
      const updatedOccs = activeEvent.occurrences.map(o => o.id === occ.id ? updatedOcc : o);
      const updatedEvent = { ...activeEvent, occurrences: updatedOccs };
      setActiveEvent(updatedEvent);
      setEvents(prev => prev.map(ev => ev.id === activeEvent.id ? updatedEvent : ev));
    }

    addNotification(notifMsg);
    showToast("Members notified!");
    setShowActionModal(false);
    setSelectedOcc(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", gap: 20 }}>
      {/* Sub-nav */}
      <div style={{ display: "flex", gap: 10, borderBottom: "1px solid var(--border)", paddingBottom: 16, alignItems: "center" }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setActiveNav(item.id)} className={activeNav === item.id ? "btn-primary" : "btn-secondary"}>
            {item.label}
            {item.id === "notifications" && notifications.length > 0 && (
              <span className="badge" style={{ marginLeft: 6, background: activeNav === item.id ? "var(--white)" : "var(--blue)", color: activeNav === item.id ? "var(--blue)" : "var(--white)", border: "none" }}>
                {notifications.length > 9 ? "9+" : notifications.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "visible" }}>

        {/* DASHBOARD */}
        {activeNav === "dashboard" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Welcome back, Admin</h2>
              <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>Here's an overview of your community meetings.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Events", value: events.length, color: "var(--blue)" },
                { label: "Total Meetings", value: events.reduce((a, e) => a + e.occurrences.length, 0), color: "var(--green)" },
                { label: "Cancelled", value: events.reduce((a, e) => a + e.occurrences.filter(o => o.status === "cancelled").length, 0), color: "var(--red)" },
                { label: "Notifications", value: notifications.length, color: "var(--orange, #f59e0b)" },
              ].map(stat => (
                <div key={stat.label} className="stat-card">
                  <div className="stat-card-bar" style={{ background: stat.color }}></div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, fontFamily: "var(--mono)" }}>{stat.value}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text2)", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
            {events.length > 0 && (
              <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#111827" }}>Recent Events</div>
                {events.slice(0, 5).map(ev => (
                  <div key={ev.id} onClick={() => { setActiveEvent(ev); setActiveNav("events"); }} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 0", borderBottom: "1px solid #f3f4f6", cursor: "pointer",
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{ev.title}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{DAYS[parseInt(ev.meetingDay)]}s · {formatTime(ev.time)} · {ev.occurrences.length} meetings</div>
                    </div>
                    <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 600 }}>View →</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EVENTS */}
        {activeNav === "events" && (
          <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24, alignItems: "start" }}>

            {/* Form */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
              <div style={{ padding: "18px 20px", borderBottom: "1px solid #f3f4f6", background: "#fafafa" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Create Recurring Meeting</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Fill in the details to generate meeting occurrences</div>
              </div>
              <div style={{ padding: 20 }}>
                {[
                  { name: "title", label: "Event Title *", type: "text", placeholder: "e.g. Weekly Team Standup" },
                  { name: "description", label: "Description", type: "textarea", placeholder: "Brief description of the meeting..." },
                  { name: "location", label: "Location", type: "text", placeholder: "e.g. Zoom, Room 204, Google Meet" },
                ].map(field => (
                  <div key={field.name} style={{ marginBottom: 14 }}>
                    <label className="lbl">{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea name={field.name} value={form[field.name]} onChange={handleFormChange}
                        placeholder={field.placeholder} rows={2}
                        className="input" style={{ width: "100%", resize: "vertical" }} />
                    ) : (
                      <input name={field.name} value={form[field.name]} onChange={handleFormChange}
                        placeholder={field.placeholder} type="text"
                        className="input" style={{ width: "100%" }} />
                    )}
                  </div>
                ))}

                <div style={{ marginBottom: 14 }}>
                  <label className="lbl">Meeting Day *</label>
                  <select name="meetingDay" value={form.meetingDay} onChange={handleFormChange}
                    className="select" style={{ width: "100%" }}>
                    <option value="">Select a day...</option>
                    {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  <div>
                    <label className="lbl">Start Date *</label>
                    <input name="startDate" value={form.startDate} onChange={handleFormChange} type="date"
                      className="input" style={{ width: "100%" }} />
                  </div>
                  <div>
                    <label className="lbl">End Date *</label>
                    <input name="endDate" value={form.endDate} onChange={handleFormChange} type="date"
                      className="input" style={{ width: "100%" }} />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label className="lbl">Time *</label>
                  <input name="time" value={form.time} onChange={handleFormChange} type="time"
                    className="input" style={{ width: "100%" }} />
                </div>

                <button onClick={handleGenerate} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px", fontSize: 14 }}>
                  Generate Meetings
                </button>
              </div>

              {/* Event list */}
              {events.length > 0 && (
                <div style={{ borderTop: "1px solid #f3f4f6", padding: "16px 20px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Your Events</div>
                  {events.map(ev => (
                    <button key={ev.id} onClick={() => setActiveEvent(ev)} style={{
                      width: "100%", textAlign: "left", padding: "9px 12px",
                      background: activeEvent?.id === ev.id ? "#f0f0ff" : "transparent",
                      border: activeEvent?.id === ev.id ? "1px solid #c7d2fe" : "1px solid transparent",
                      borderRadius: 8, cursor: "pointer", marginBottom: 4,
                    }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{ev.title}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{DAYS[parseInt(ev.meetingDay)]}s · {ev.occurrences.length} meetings</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Meeting List */}
            <div>
              {!activeEvent ? (
                <div style={{
                  background: "white", borderRadius: 12, border: "1px solid #e5e7eb",
                  padding: "60px 20px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 40, marginBottom: 12, fontFamily: "var(--mono)" }}>No event selected</div>
                  <div style={{ fontSize: 13, color: "var(--text3)" }}>Create a recurring meeting to get started.</div>
                </div>
              ) : (
                <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                  {/* Event Header */}
                  <div style={{ padding: "18px 24px", borderBottom: "1px solid #f3f4f6", background: "#fafafa" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 800, color: "#111827" }}>{activeEvent.title}</h3>
                        <div style={{ fontSize: 13, color: "#6b7280", display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                          {activeEvent.description && <span>Desc: {activeEvent.description}</span>}
                          <span>Every {DAYS[parseInt(activeEvent.meetingDay)]}</span>
                          <span>Time: {formatTime(activeEvent.time)}</span>
                          {activeEvent.location && <span>Loc: {activeEvent.location}</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        {Object.entries(
                          activeEvent.occurrences.reduce((acc, o) => {
                            acc[o.status] = (acc[o.status] || 0) + 1;
                            return acc;
                          }, {})
                        ).map(([status, count]) => (
                          <span key={status} style={{
                            padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                            background: STATUS_CONFIG[status]?.bg,
                            color: STATUS_CONFIG[status]?.text,
                            border: `1px solid ${STATUS_CONFIG[status]?.border}`,
                          }}>{count} {STATUS_CONFIG[status]?.label}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Occurrences */}
                  <div style={{ padding: "16px 24px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>
                      Upcoming Meetings ({activeEvent.occurrences.length})
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {activeEvent.occurrences.map(occ => {
                        const cfg = STATUS_CONFIG[occ.status];
                        return (
                          <div key={occ.id} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "12px 16px", borderRadius: 10,
                            background: cfg.bg, border: `1px solid ${cfg.border}`,
                            transition: "all 0.15s",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{
                                width: 8, height: 8, borderRadius: "50%",
                                background: cfg.dot, flexShrink: 0,
                              }} />
                              <div>
                                <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>
                                  {formatDate(occ.date)}
                                  {occ.rescheduledTo && (
                                    <span style={{ fontSize: 12, fontWeight: 500, color: "#c2410c", marginLeft: 8 }}>
                                      → Rescheduled to {formatDate(occ.rescheduledTo)}
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>
                                  {DAY_ABBR[getDayOfWeek(occ.date)]} · {formatTime(activeEvent.time)}
                                  {occ.note && <span> · <i>{occ.note}</i></span>}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{
                                fontSize: 11, fontWeight: 700, padding: "2px 10px",
                                borderRadius: 20, background: "white", color: cfg.text,
                                border: `1px solid ${cfg.border}`,
                              }}>{cfg.label}</span>
                              <button onClick={() => openActionModal(occ)} style={{
                                padding: "5px 12px", background: "#111827",
                                color: "white", border: "none", borderRadius: 7,
                                fontSize: 12, fontWeight: 600, cursor: "pointer",
                              }}>Actions</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeNav === "notifications" && (
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Notifications</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>Member notification history and updates.</p>
              </div>
              {notifications.length > 0 && (
                <button onClick={() => setNotifications([])} style={{
                  padding: "6px 14px", background: "#fee2e2", color: "#b91c1c",
                  border: "1px solid #fecaca", borderRadius: 8, fontSize: 12,
                  fontWeight: 600, cursor: "pointer",
                }}>Clear All</button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div style={{
                background: "white", borderRadius: 12, border: "1px solid #e5e7eb",
                padding: "60px 20px", textAlign: "center",
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>◉</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 6 }}>No notifications yet</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>Notifications will appear here when you take actions on meetings.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    background: "white", borderRadius: 12, border: "1px solid #e5e7eb",
                    padding: "16px 20px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontSize: 14, color: "#111827", lineHeight: 1.5, flex: 1, paddingRight: 16 }}>{n.message}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", flexShrink: 0, textAlign: "right" }}>
                        <div>{n.time}</div>
                        <div>{n.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {
        showActionModal && selectedOcc && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
          }} onClick={() => setShowActionModal(false)}>
            <div style={{
              background: "white", borderRadius: 16, padding: "28px",
              width: 460, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }} onClick={e => e.stopPropagation()}>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 800, color: "#111827" }}>Meeting Actions</h3>
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  {formatDate(selectedOcc.date)} · {formatTime(activeEvent?.time)} · Current: <strong>{STATUS_CONFIG[selectedOcc.status]?.label}</strong>
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Note (optional)</label>
                <input value={actionNote} onChange={e => setActionNote(e.target.value)}
                  placeholder="e.g. Public holiday, venue unavailable..."
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>

              {actionType === "skip" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18, padding: "12px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                  <div style={{ gridColumn: "1 / -1", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Select Custom Date & Time</div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Date</label>
                    <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} className="input" style={{ width: "100%", padding: "6px 10px", fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Time</label>
                    <input type="time" value={customTime} onChange={e => setCustomTime(e.target.value)} className="input" style={{ width: "100%", padding: "6px 10px", fontSize: 13 }} />
                  </div>
                  <button onClick={() => applyAction("skip")} className="btn-primary" style={{ gridColumn: "1 / -1", justifyContent: "center", marginTop: 4 }}>
                    Confirm Reschedule
                  </button>
                </div>
              )}

              {actionType !== "skip" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  {[
                    { action: "skip", label: "Select Custom Date/Time", bg: "#fefce8", color: "#a16207", border: "#fef08a" },
                    { action: "cancel", label: "Cancel Meeting", bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" },
                    { action: "move", label: "Move to Next Day", bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
                    { action: "notify", label: "Notify Members", bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
                  ].map(btn => (
                    <button key={btn.action} onClick={() => {
                      if (btn.action === "skip") {
                        setActionType("skip");
                      } else {
                        applyAction(btn.action);
                      }
                    }} style={{
                      padding: "12px 16px", background: btn.bg, color: btn.color,
                      border: `1px solid ${btn.border}`, borderRadius: 10,
                      fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "center",
                      transition: "all 0.15s",
                    }}>{btn.label}</button>
                  ))}
                </div>
              )}

              <button onClick={() => setShowActionModal(false)} className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                Cancel
              </button>
            </div>
          </div>
        )
      }

      {/* Toast */}
      {
        toast && (
          <div style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 200,
            background: "#111827", color: "white", padding: "12px 20px",
            borderRadius: 10, fontSize: 13, fontWeight: 600,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            animation: "slideUp 0.2s ease",
          }}>{toast}</div>
        )
      }

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        button:hover { opacity: 0.88; }
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
      `}</style>
    </div >
  );
}
