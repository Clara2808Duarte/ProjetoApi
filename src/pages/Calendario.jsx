import React, { useState, useEffect } from "react";
import "./Calendario.css";
import Footer from "../components/Footer";

// Helpers
const LOCALE = "pt-BR";
const STORAGE_KEY = "gc_calendar_events";

function formatDateISO(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return ${yyyy}-${mm}-${dd};
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function monthName(date) {
  return date.toLocaleString(LOCALE, { month: "long", year: "numeric" }).toUpperCase();
}

function uid() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

export default function CalendarApp() {
  const [current, setCurrent] = useState(()=> startOfMonth(new Date()));
  const [events, setEvents] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    date: formatDateISO(new Date()),
    title: "",
    type: "Evento Escolar",
  });
  const [selectedDateForAdd, setSelectedDateForAdd] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setEvents(parsed);
      } catch (e) { console.error(e); }
    }
  }, []);

  // Save
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  // Navigation
  function prevMonth() {
    setCurrent(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCurrent(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }
  function gotoToday() {
    setCurrent(startOfMonth(new Date()));
  }

  // Calendar grid
  const firstDay = new Date(current.getFullYear(), current.getMonth(), 1).getDay(); // 0..6 (Sun..Sat)
  const last = endOfMonth(current).getDate();
  // in JS week starts sunday; we'll keep same layout as image (Dom..Sab)

  const blanks = [];
  for (let i = 0; i < firstDay; i++) blanks.push(i);

  const days = [];
  for (let d = 1; d <= last; d++) days.push(d);

  function openAddModal(dateIso = null) {
    const dt = dateIso || formatDateISO(new Date());
    setForm({ id: null, date: dt, title: "", type: "Evento Escolar" });
    setSelectedDateForAdd(dt);
    setModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return alert("Preencha o título do evento.");
    const id = form.id || uid();
    const ev = {
      id,
      date: form.date,
      title: form.title,
      type: form.type,
      completed: false,
    };
    setEvents(prev => {
      const copy = { ...prev };
      copy[ev.date] = copy[ev.date] ? [ev, ...copy[ev.date]] : [ev];
      // if editing remove old id if date changed
      if (form.id) {
        // remove previous instance if editing moved date
        for (const d in copy) {
          if (d !== ev.date) {
            copy[d] = copy[d].filter(it => it.id !== id);
            if (copy[d].length === 0) delete copy[d];
          } else {
            // if editing same date, remove old then add new (dedupe)
            copy[d] = copy[d].filter(it => it.id !== id);
            copy[d].unshift(ev);
          }
        }
      }
      return copy;
    });
    setModalOpen(false);
  }

  function deleteEvent(id, date) {
    if (!window.confirm("Excluir este evento?")) return;
    setEvents(prev => {
      const copy = { ...prev };
      copy[date] = copy[date].filter(it => it.id !== id);
      if (copy[date].length === 0) delete copy[date];
      return copy;
    });
  }

  function toggleComplete(id, date) {
    setEvents(prev => {
      const copy = { ...prev };
      copy[date] = copy[date].map(it => it.id === id ? { ...it, completed: !it.completed } : it);
      return copy;
    });
  }

  function editEvent(ev) {
    setForm({ id: ev.id, date: ev.date, title: ev.title, type: ev.type });
    setModalOpen(true);
  }

  // Export current month to printable window then call print (user can save as PDF)
  function exportMonthToPdf() {
    const monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
    const monthLabel = monthName(current);
    const tableRows = buildMonthHtml();
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Calendário - ${monthLabel}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color:#222; }
            h2 { text-align:center; color:#e354a6; }
            .calendar { width:100%; border-collapse: collapse; }
            .calendar th { padding:8px; text-align:center; color:#666; font-weight:600; }
            .calendar td { width:14%; height:80px; vertical-align: top; border:1px solid #eee; padding:6px; }
            .event { display:inline-block; padding:4px 8px; border-radius:10px; font-size:12px; margin-top:6px; color:#fff; }
            .Evento\\ Escolar { background:#ff66b3; color:#fff;}
            .Feriado\\ Recesso { background:#40c57b; color:#fff;}
            .Recurso\\ Pedagogico { background:#4aa0ff; color:#fff;}
          </style>
        </head>
        <body>
          <h2>Calendário — ${monthLabel}</h2>
          ${tableRows}
        </body>
      </html>
    `;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    // give time to render then print
    setTimeout(() => { w.print(); }, 500);
  }

  function buildMonthHtml(){
    // build simple table html representing current month with events
    const daysBefore = firstDay;
    let html = '<table class="calendar"><thead><tr>';
    const weekDays = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
    for (let wd of weekDays) html += <th>${wd}</th>;
    html += '</tr></thead><tbody><tr>';
    // blanks
    for (let i=0;i<daysBefore;i++) html += '<td></td>';
    let cell = daysBefore;
    for (let d=1; d<= last; d++){
      const dateIso = formatDateISO(new Date(current.getFullYear(), current.getMonth(), d));
      const evs = events[dateIso] || [];
      let content = <div>${d}</div>;
      for (const e of evs) {
        // choose class by type
        let cls = e.type.replace(/\s/g,"\\ ");
        content += <div class="event ${cls}">${e.title}</div>;
      }
      html += <td>${content}</td>;
      cell++;
      if (cell %7 ===0) html += '</tr><tr>';
    }
    // fill remaining cells
    while (cell %7 !==0) { html += '<td></td>'; cell++; }
    html += '</tr></tbody></table>';
    return html;
  }

  // Render helpers
function renderCell(day) {
  if (!day) return <div className="empty-cell" />;
  const dateIso = formatDateISO(new Date(current.getFullYear(), current.getMonth(), day));
  const evs = events[dateIso] || [];
  const isToday = formatDateISO(new Date()) === dateIso;
  return (
    // CORRIGIDO: Uso de Template String (`) para combinar classes
    <div className={`day-cell ${isToday ? "today" : ""}`}>
      <div className="day-number">{day}</div>

      <div className="events-list">
        {evs.map(ev => (
          // CORRIGIDO: Uso de Template String (`) para construir a className
          <div key={ev.id} className={`event-pill type-${ev.type.replace(/\s/g,"-") } ${ev.completed ? "completed":""}`}>
            <div className="event-title">{ev.title}</div>
            <div className="event-actions">
              <button title="Marcar concluído" onClick={() => toggleComplete(ev.id, dateIso)} className="small-btn">✓</button>
              <button title="Editar" onClick={() => editEvent(ev)} className="small-btn">✎</button>
              <button title="Excluir" onClick={() => deleteEvent(ev.id, dateIso)} className="small-btn danger">🗑</button>
            </div>
          </div>
        ))}
      </div>

      <div className="add-day-btn">
        <button onClick={() => openAddModal(dateIso)} title="Adicionar evento nesta data">+</button>
      </div>
    </div>
  );
}

  return (
    <div className="cal-app">
      <div className="cal-header">
        <h3>Painel de Planejamento Escolar</h3>

        <div className="cal-controls">
          <button className="btn-outline" onClick={exportMonthToPdf}>⬇︎ Baixar PDF</button>
          <button className="btn-primary" onClick={() => openAddModal(null)}>Adicionar Evento</button>
        </div>
      </div>

      <div className="cal-box">
        <div className="cal-toolbar">
          <button className="nav-btn" onClick={prevMonth}>‹</button>
          <div className="month-label">{monthName(current)}</div>
          <button className="nav-btn" onClick={nextMonth}>›</button>
        </div>

        <div className="calendar-grid">
          {/* week header */}
          <div className="week-row header-row">
            {["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map((w,i)=> (
              <div key={i} className="week-day">{w}</div>
            ))}
          </div>

          {/* weeks */}
          <div className="weeks">
            {/* build cells array */}
            {(() => {
              const cells = [];
              for (let i=0;i<blanks.length;i++) cells.push(null);
              for (let d=1; d<= last; d++) cells.push(d);
              // ensure multiple of 7
              while (cells.length %7 !==0) cells.push(null);
              return cells.map((c, idx) => <div key={idx} className="cell-wrapper">{renderCell(c)}</div>);
            })()}
          </div>
        </div>
      </div>

      {/* floating side add button */}
      <button className="floating-add" title="Adicionar evento" onClick={() => openAddModal(null)}>＋</button>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-header">
              <h4>Novo Evento</h4>
              <button className="close" onClick={()=>setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <label>Data</label>
              <input type="date" value={form.date} onChange={(e)=> setForm({...form, date: e.target.value})} />

              <label>Título/Descrição</label>
              <input type="text" value={form.title} onChange={(e)=> setForm({...form, title: e.target.value})} placeholder="Título do evento" />

              <label>Tipo</label>
              <select value={form.type} onChange={(e)=> setForm({...form, type: e.target.value})}>
                <option>Evento Escolar</option>
                <option>Feriado Recesso</option>
                <option>Recurso Pedagogico</option>
              </select>

              <button type="submit" className="modal-create">Criar Evento</button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}