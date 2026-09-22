import React, { useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db, firebaseReady } from "./firebase";

const TASKS = [
  "Tuvalet temizlenecek",
  "Tezgâh toparlanacak",
  "Mutfak süpürülecek",
  "Mutfak moplanacak",
  "Dükkân süpürülecek",
  "Dükkân moplanacak",
  "Masalar silinecek",
  "Zeytin tezgâhı silinecek",
  "Peynir tezgâhı silinecek",
  "Kahve tezgâhı silinecek",
  "Bahçe temizlenecek",
  "Bar moplanacak",
  "Barın üstü silinecek",
  "Bar ekipmanları silinecek",
  "Halılar süpürülecek",
  "Dükkânın önü sulanacak"
];

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const initialTasks = () => TASKS.map((label, id) => ({ id, label, done:false }));
const localKey = "agora-cleaning-v1";

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(localKey) || "{}"); } catch { return {}; }
}

export default function App() {
  const date = todayKey();
  const [employee, setEmployee] = useState("");
  const [tasks, setTasks] = useState(initialTasks);
  const [history, setHistory] = useState([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const completed = useMemo(() => tasks.filter(t => t.done).length, [tasks]);
  const percent = Math.round(completed / TASKS.length * 100);

  useEffect(() => {
    const local = loadLocal();
    if (local[date]) {
      setEmployee(local[date].employee || "");
      setTasks(local[date].tasks || initialTasks());
      setSaved(true);
    }
    loadHistory();
  }, [date]);

  async function loadHistory() {
    if (!firebaseReady || !db) return;
    try {
      const q = query(collection(db, "cleaningDaily"), orderBy("date", "desc"));
      const snap = await getDocs(q);
      setHistory(snap.docs.map(d => d.data()).slice(0, 30));
    } catch {}
  }

  function toggle(id) {
    setTasks(prev => prev.map(t => t.id === id ? {...t, done: !t.done} : t));
    setSaved(false);
  }

  function all(value) {
    setTasks(prev => prev.map(t => ({...t, done:value})));
    setSaved(false);
  }

  async function save() {
    setSaving(true); setError("");
    const data = { date, employee: employee.trim(), tasks, completedCount: completed, total: TASKS.length, completed: completed === TASKS.length };
    const local = loadLocal();
    local[date] = data;
    localStorage.setItem(localKey, JSON.stringify(local));
    try {
      if (firebaseReady && db) {
        await setDoc(doc(db, "cleaningDaily", date), {...data, updatedAt: serverTimestamp()});
        await loadHistory();
      }
      setSaved(true);
    } catch (e) {
      setError("Buluta kayıt yapılamadı. Telefonda kayıt yine saklandı.");
    } finally { setSaving(false); }
  }

  return (
    <main className="page">
      <section className="app">
        <header className="header">
          <div className="logo">A</div>
          <div>
            <div className="eyebrow">AGORA ŞARKÜTERİ</div>
            <h1>Günlük Temizlik</h1>
            <p>{new Date().toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
          </div>
        </header>

        <div className="card employee">
          <label>Personel adı</label>
          <input value={employee} onChange={e=>{setEmployee(e.target.value);setSaved(false)}} placeholder="Ad soyad yazın" />
        </div>

        <div className="card progressCard">
          <div className="progressTop"><strong>{completed} / {TASKS.length}</strong><span>%{percent}</span></div>
          <div className="bar"><div style={{width:`${percent}%`}} /></div>
          {saved && <div className="saved">✓ Bugünkü kayıt kaydedildi</div>}
        </div>

        <div className="actions">
          <button onClick={()=>all(true)} className="secondary">Tümünü Tamamla</button>
          <button onClick={()=>all(false)} className="secondary">Tümünü Kaldır</button>
        </div>

        <section className="card checklist">
          <div className="sectionTitle">Bugünkü görevler</div>
          {tasks.map((task,i)=>(
            <button key={task.id} className={`task ${task.done ? "done":""}`} onClick={()=>toggle(task.id)}>
              <span className="check">{task.done ? "✓" : i+1}</span>
              <span>{task.label}</span>
            </button>
          ))}
        </section>

        {error && <div className="error">{error}</div>}

        <button className="save" onClick={save} disabled={saving}>
          {saving ? "Kaydediliyor..." : "Günü Kaydet"}
        </button>

        <section className="card history">
          <div className="sectionTitle">Geçmiş kayıtlar</div>
          {history.length === 0 ? <p className="muted">Henüz bulut kaydı yok.</p> : history.map((h,i)=>(
            <div className="historyRow" key={i}>
              <div><strong>{h.date}</strong><small>{h.employee || "Personel belirtilmemiş"}</small></div>
              <span className={h.completed ? "complete":""}>{h.completedCount}/{h.total}</span>
            </div>
          ))}
        </section>

        <footer>Agora Şarküteri · Günlük görev takip sistemi</footer>
      </section>
    </main>
  );
}