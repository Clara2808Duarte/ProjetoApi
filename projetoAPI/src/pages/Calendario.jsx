// Importa React e hooks useState/useEffect
import { useState, useEffect } from "react";

// Importa o CSS do componente de calendário
import "./Calendario.css";

// Importa o componente Footer para o rodapé
import Footer from "../components/Footer";

// Constante de locale para formatação (pt-BR)
const LOCALE = "pt-BR";

// Chave usada no localStorage para guardar eventos
const STORAGE_KEY = "gc_calendar_events";

// Formata um objeto Date para string ISO YYYY-MM-DD
function formatDateISO(date) {
  const d = new Date(date); // cria Date a partir do argumento
  const yyyy = d.getFullYear(); // ano com 4 dígitos
  const mm = String(d.getMonth() + 1).padStart(2, "0"); // mês com 2 dígitos
  const dd = String(d.getDate()).padStart(2, "0"); // dia com 2 dígitos
  return `${yyyy}-${mm}-${dd}`; // retorna string no formato ISO
}

// Retorna o primeiro dia do mês para a data informada
function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1); // 1º dia do mês
}

// Retorna o último dia do mês para a data informada
function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0); // último dia do mês
}

// Retorna o nome do mês + ano em maiúsculas (ex: JANEIRO 2025)
function monthName(date) {
  return date.toLocaleString(LOCALE, { month: "long", year: "numeric" }).toUpperCase();
}

// Gera um id único simples para eventos
function uid() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

// Componente principal do calendário
export default function CalendarApp() {
  // Estado: mês atual exibido (inicial = início do mês atual)
  const [current, setCurrent] = useState(()=> startOfMonth(new Date()));
  // Estado: objetos de eventos, chave = date ISO, valor = array de eventos
  const [events, setEvents] = useState({});
  // Estado: controla se o modal está aberto
  const [modalOpen, setModalOpen] = useState(false);
  // Estado: formulário do modal (id/data/título/tipo)
  const [form, setForm] = useState({
    id: null,
    date: formatDateISO(new Date()),
    title: "",
    type: "Evento Escolar",
  });
  // Estado: data selecionada para adicionar evento (iso)
  const [selectedDateForAdd, setSelectedDateForAdd] = useState(null);

  // useEffect: carrega eventos do localStorage ao montar o componente
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY); // lê do storage
    if (raw) {
      try {
        const parsed = JSON.parse(raw); // tenta parsear JSON
        setEvents(parsed); // popula estado events
      } catch (e) { console.error(e); } // log se JSON inválido
    }
  }, []); // roda só uma vez ao montar

  // useEffect: salva eventos no localStorage sempre que events mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); // grava JSON
  }, [events]); // depende de events

  // Função para ir ao mês anterior
  function prevMonth() {
    setCurrent(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }
  // Função para ir ao mês seguinte
  function nextMonth() {
    setCurrent(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }
  // Função para ir ao mês atual
  function gotoToday() {
    setCurrent(startOfMonth(new Date()));
  }

  // Calcula primeiro dia da semana do mês atual (0..6)
  const firstDay = new Date(current.getFullYear(), current.getMonth(), 1).getDay();
  // Último dia do mês (número)
  const last = endOfMonth(current).getDate();
  // Array de células em branco antes do dia 1
  const blanks = [];
  for (let i = 0; i < firstDay; i++) blanks.push(i);
  // Array dos dias do mês [1..last]
  const days = [];
  for (let d = 1; d <= last; d++) days.push(d);

  // Abre o modal para adicionar evento em dateIso (ou hoje se null)
  function openAddModal(dateIso = null) {
    const dt = dateIso || formatDateISO(new Date()); // data alvo
    setForm({ id: null, date: dt, title: "", type: "Evento Escolar" }); // reseta form
    setSelectedDateForAdd(dt); // guarda data selecionada
    setModalOpen(true); // abre modal
  }

  // Handle submit do form (criar/editar evento)
  function handleSubmit(e) {
    e.preventDefault(); // previne reload
    if (!form.title.trim()) return alert("Preencha o título do evento."); // valida título
    const id = form.id || uid(); // usa id existente ou gera novo
    const ev = {
      id,
      date: form.date,
      title: form.title,
      type: form.type,
      completed: false,
    }; // monta objeto do evento

    setEvents(prev => {
      const copy = { ...prev }; // copia imutável
      copy[ev.date] = copy[ev.date] ? [ev, ...copy[ev.date]] : [ev]; // adiciona/insere no começo

      // Se estiver editando (form.id existe), remove instâncias antigas
      if (form.id) {
        for (const d in copy) {
          if (d !== ev.date) {
            // remove evento antigo de outras datas
            copy[d] = copy[d].filter(it => it.id !== id);
            if (copy[d].length === 0) delete copy[d]; // limpa chave vazia
          } else {
            // mesma data: remove duplicado antigo e insere o novo no começo
            copy[d] = copy[d].filter(it => it.id !== id);
            copy[d].unshift(ev);
          }
        }
      }

      return copy; // retorna novo estado
    });

    setModalOpen(false); // fecha modal após salvar
  }

  // Deleta evento por id e date (confirma antes)
  function deleteEvent(id, date) {
    if (!window.confirm("Excluir este evento?")) return; // confirmação
    setEvents(prev => {
      const copy = { ...prev };
      copy[date] = copy[date].filter(it => it.id !== id); // filtra evento
      if (copy[date].length === 0) delete copy[date]; // remove chave vazia
      return copy;
    });
  }

  // Alterna flag completed do evento
  function toggleComplete(id, date) {
    setEvents(prev => {
      const copy = { ...prev };
      copy[date] = copy[date].map(it => it.id === id ? { ...it, completed: !it.completed } : it);
      return copy;
    });
  }

  // Abre modal para editar evento (popula form)
  function editEvent(ev) {
    setForm({ id: ev.id, date: ev.date, title: ev.title, type: ev.type });
    setModalOpen(true);
  }

  // Exporta o mês atual para uma janela imprimível (usuário salva como PDF)
  function exportMonthToPdf() {
    const monthStart = new Date(current.getFullYear(), current.getMonth(), 1); // início do mês (não usado diretamente)
    const monthLabel = monthName(current); // rótulo do mês
    const tableRows = buildMonthHtml(); // HTML da tabela do mês

    // HTML completo para abrir em nova janela
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

    const w = window.open("", "_blank"); // abre nova janela
    w.document.write(html); // escreve HTML
    w.document.close(); // finaliza escrita

    // Dá um tempo para render e então chama print
    setTimeout(() => { w.print(); }, 500);
  }

  // Constrói o HTML da tabela do mês (usado na exportação)
  function buildMonthHtml(){
    const daysBefore = firstDay; // quantas células vazias antes do dia 1
    let html = '<table class="calendar"><thead><tr>'; // inicia tabela
    const weekDays = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"]; // cabeçalho

    for (let wd of weekDays) html += `<th>${wd}</th>`; // adiciona colunas de dias
    html += '</tr></thead><tbody><tr>';

    // adiciona células vazias iniciais
    for (let i=0;i<daysBefore;i++) html += '<td></td>';
    let cell = daysBefore;

    // para cada dia do mês
    for (let d=1; d<= last; d++){
      const dateIso = formatDateISO(new Date(current.getFullYear(), current.getMonth(), d)); // data ISO
      const evs = events[dateIso] || []; // eventos desse dia ou array vazio
      let content = `<div>${d}</div>`; // número do dia

      for (const e of evs) {
        let cls = e.type.replace(/\s/g,"\\ "); // classe CSS baseada no tipo (escapa espaços)
        content += `<div class="event ${cls}">${e.title}</div>`; // adiciona evento
      }

      html += `<td>${content}</td>`; // adiciona célula com conteúdo
      cell++;
      if (cell %7 ===0) html += '</tr><tr>'; // quebra de linha da tabela a cada 7 células
    }
    // preenche células vazias no final da tabela para completar a semana
    while (cell %7 !==0) { html += '<td></td>'; cell++; }
    html += '</tr></tbody></table>'; // fecha tabela
    return html; // retorna string HTML
  }

  // Render helper: cria o conteúdo visual de uma célula do calendário
  function renderCell(day) {
    if (!day) return <div className="empty-cell" />; // se null, retorna célula vazia
    const dateIso = formatDateISO(new Date(current.getFullYear(), current.getMonth(), day)); // data ISO da célula
    const evs = events[dateIso] || []; // eventos do dia
    const isToday = formatDateISO(new Date()) === dateIso; // verifica se é hoje

    return (
      <div className={`day-cell ${isToday ? "today" : ""}`}> {/* wrapper da célula */}
        <div className="day-number">{day}</div> {/* mostra número do dia */}

        <div className="events-list">
          {evs.map(ev => ( // mapeia eventos para pílulas
            <div key={ev.id} className={`event-pill type-${ev.type.replace(/\s/g,"-") } ${ev.completed ? "completed":""}`}>
              <div className="event-title">{ev.title}</div> {/* título do evento */}
              <div className="event-actions">
                <button title="Marcar concluído" onClick={() => toggleComplete(ev.id, dateIso)} className="small-btn">✓</button> {/* toggle */}
                <button title="Editar" onClick={() => editEvent(ev)} className="small-btn">✎</button> {/* editar */}
                <button title="Excluir" onClick={() => deleteEvent(ev.id, dateIso)} className="small-btn danger">🗑</button> {/* excluir */}
              </div>
            </div>
          ))}
        </div>

        <div className="add-day-btn">
          <button onClick={() => openAddModal(dateIso)} title="Adicionar evento nesta data">+</button> {/* botão adicionar */}
        </div>
      </div>
    );
  }

  // JSX retornado pelo componente (UI principal)
  return (
    <>
      <div className="cal-app"> {/* container principal */}
        <div className="cal-header"> {/* cabeçalho do painel */}
          <h3>Painel de Planejamento Escolar</h3>

          <div className="cal-controls"> {/* controles de ação */}
            <button className="btn-outline" onClick={exportMonthToPdf}>⬇︎ Baixar PDF</button> {/* exportar */}
            <button className="btn-primary" onClick={() => openAddModal(null)}>Adicionar Evento</button> {/* abrir modal */}
          </div>
        </div>

        <div className="cal-box"> {/* caixa principal do calendário */}
          <div className="cal-toolbar"> {/* barra com navegação de meses */}
            <button className="nav-btn" onClick={prevMonth}>‹</button> {/* mês anterior */}
            <div className="month-label">{monthName(current)}</div> {/* label do mês */}
            <button className="nav-btn" onClick={nextMonth}>›</button> {/* próximo mês */}
          </div>

          <div className="calendar-grid"> {/* grid do calendário */}
            {/* cabeçalho da semana */}
            <div className="week-row header-row">
              {["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map((w,i)=> (
                <div key={i} className="week-day">{w}</div> // nomes dos dias
              ))}
            </div>

            {/* linhas/semanas */}
            <div className="weeks">
              {(() => {
                const cells = []; // array de células para renderizar
                for (let i=0;i<blanks.length;i++) cells.push(null); // adiciona blanks
                for (let d=1; d<= last; d++) cells.push(d); // adiciona dias
                while (cells.length %7 !==0) cells.push(null); // completa última semana
                return cells.map((c, idx) => <div key={idx} className="cell-wrapper">{renderCell(c)}</div>); // renderiza células
              })()}
            </div>
          </div>
        </div>

        {/* botão flutuante para adicionar evento */}
        <button className="floating-add" title="Adicionar evento" onClick={() => openAddModal(null)}>＋</button>

        {/* Modal de criação/edição de evento */}
        {modalOpen && (
          <div className="modal-backdrop" onClick={() => setModalOpen(false)}> {/* backdrop fecha modal ao clicar */}
            <div className="modal" onClick={(e)=>e.stopPropagation()}> {/* stopPropagation evita fechar ao clicar no modal */}
              <div className="modal-header">
                <h4>Novo Evento</h4>
                <button className="close" onClick={()=>setModalOpen(false)}>✕</button> {/* fechar */}
              </div>

              <form onSubmit={handleSubmit} className="modal-body"> {/* formulário */}
                <label>Data</label>
                <input type="date" value={form.date} onChange={(e)=> setForm({...form, date: e.target.value})} /> {/* input data */}

                <label>Título/Descrição</label>
                <input type="text" value={form.title} onChange={(e)=> setForm({...form, title: e.target.value})} placeholder="Título do evento" /> {/* input título */}

                <label>Tipo</label>
                <select value={form.type} onChange={(e)=> setForm({...form, type: e.target.value})}> {/* seletor tipo */}
                  <option>Evento Escolar</option>
                  <option>Feriado Recesso</option>
                  <option>Recurso Pedagogico</option>
                </select>

                <button type="submit" className="modal-create">Criar Evento</button> {/* submit */}
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer /> {/* componente Footer */}
    </>
  );
}
