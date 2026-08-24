import { useState, useEffect, useRef } from "react";
import { Dumbbell, TrendingUp, ShoppingBag, Camera, Plus, Trash2, ChevronRight, Search, Play, Square, LogOut } from "lucide-react";
import { supabase } from "./supabaseClient";

const C = {
  black: "#0B0B0A",
  charcoal: "#17140F",
  yellow: "#F5C518",
  amber: "#FFB000",
  cream: "#FAF6EC",
  gray: "#8A8477",
};

const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const CATALOGO = [
  { termo: "barra fixa parede", nome: "Barra Fixa de Parede", cat: "Equipamento" },
  { termo: "elastico de resistencia calistenia", nome: "Elásticos de Resistência (kit)", cat: "Equipamento" },
  { termo: "paralelas calistenia", nome: "Paralelas / Barras Paralelas", cat: "Equipamento" },
  { termo: "whey protein", nome: "Whey Protein", cat: "Suplemento" },
  { termo: "creatina", nome: "Creatina Monohidratada", cat: "Suplemento" },
  { termo: "luvas para treino calistenia", nome: "Luvas de Treino", cat: "Acessório" },
  { termo: "magnesio em po treino", nome: "Pó de Magnésio (grip)", cat: "Acessório" },
  { termo: "colchonete academia", nome: "Colchonete / Tapete de Treino", cat: "Equipamento" },
];

function ml(termo) {
  return `https://lista.mercadolivre.com.br/${encodeURIComponent(termo).replace(/%20/g, "-")}`;
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function CheetahMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="48" fill={C.black} stroke={C.yellow} strokeWidth="2" />
      <g fill={C.yellow}>
        <ellipse cx="50" cy="58" rx="17" ry="20" />
        <circle cx="50" cy="32" r="14" />
        <ellipse cx="41" cy="24" rx="4" ry="6" transform="rotate(-20 41 24)" />
        <ellipse cx="59" cy="24" rx="4" ry="6" transform="rotate(20 59 24)" />
        <rect x="30" y="50" width="10" height="24" rx="5" transform="rotate(28 30 50)" />
        <rect x="60" y="50" width="10" height="24" rx="5" transform="rotate(-28 60 50)" />
      </g>
      <g fill={C.black}>
        <circle cx="45" cy="30" r="1.6" />
        <circle cx="55" cy="30" r="1.6" />
        <circle cx="44" cy="55" r="1.4" />
        <circle cx="56" cy="55" r="1.4" />
        <circle cx="50" cy="65" r="1.4" />
        <circle cx="42" cy="70" r="1.2" />
        <circle cx="58" cy="70" r="1.2" />
      </g>
    </svg>
  );
}

function Login() {
  const [modo, setModo] = useState("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [aviso, setAviso] = useState("");

  async function enviar() {
    setErro("");
    setAviso("");
    if (!email.trim() || !senha.trim()) {
      setErro("Preencha email e senha.");
      return;
    }
    setCarregando(true);
    if (modo === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) setErro(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password: senha });
      if (error) setErro(error.message);
      else setAviso("Conta criada! Verifique seu email para confirmar antes de entrar.");
    }
    setCarregando(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.black, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 380, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <CheetahMark size={72} />
        </div>
        <h1 style={{ color: C.cream, fontSize: 34, fontWeight: 900, letterSpacing: -0.5, margin: 0, fontStyle: "italic" }}>
          GUEPARDO<span style={{ color: C.yellow }}>FIT</span>
        </h1>
        <p style={{ color: C.gray, fontSize: 13, marginTop: 6, marginBottom: 28, letterSpacing: 1.5, textTransform: "uppercase" }}>
          Rápido. Definido. Livre.
        </p>

        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" style={inputBig} />
        <input value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" type="password" style={{ ...inputBig, marginTop: 10 }} />

        {erro && <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 10 }}>{erro}</p>}
        {aviso && <p style={{ color: C.yellow, fontSize: 12, marginTop: 10 }}>{aviso}</p>}

        <button onClick={enviar} disabled={carregando} style={{ ...primaryBtnStyle, width: "100%", marginTop: 16 }}>
          {carregando ? "Aguarde..." : modo === "entrar" ? "Entrar no treino" : "Criar conta"}
        </button>

        <button onClick={() => { setModo(modo === "entrar" ? "cadastrar" : "entrar"); setErro(""); setAviso(""); }} style={{ background: "transparent", border: "none", color: C.gray, fontSize: 12, marginTop: 16, cursor: "pointer", textDecoration: "underline" }}>
          {modo === "entrar" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
      </div>
    </div>
  );
}

function TopBar({ email, tab, setTab, sair }) {
  const tabs = [
    { id: "treino", label: "Treinos", icon: Dumbbell },
    { id: "historico", label: "Histórico", icon: TrendingUp },
    { id: "loja", label: "Loja", icon: ShoppingBag },
    { id: "coach", label: "Coach", icon: Camera },
  ];
  return (
    <div style={{ background: C.black, borderBottom: `2px solid ${C.yellow}`, position: "sticky", top: 0, zIndex: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CheetahMark size={30} />
          <span style={{ color: C.cream, fontWeight: 900, fontStyle: "italic", fontSize: 16 }}>
            GUEPARDO<span style={{ color: C.yellow }}>FIT</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: C.gray, fontSize: 11 }}>{email}</span>
          <button onClick={sair} style={iconBtnStyle}><LogOut size={16} color={C.gray} /></button>
        </div>
      </div>
      <div style={{ display: "flex", maxWidth: 720, margin: "0 auto", overflowX: "auto" }}>
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 6px", background: "transparent", border: "none", cursor: "pointer", color: active ? C.yellow : C.gray, borderBottom: active ? `3px solid ${C.yellow}` : "3px solid transparent", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TreinoTab({ userId, workouts, refresh }) {
  const [dia, setDia] = useState(DIAS[new Date().getDay()]);
  const [foco, setFoco] = useState("");
  const [exercicios, setExercicios] = useState([{ id: crypto.randomUUID(), nome: "", series: "" }]);

  function addExercicio() {
    setExercicios([...exercicios, { id: crypto.randomUUID(), nome: "", series: "" }]);
  }
  function updateExercicio(id, field, value) {
    setExercicios(exercicios.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }
  function removeExercicio(id) {
    setExercicios(exercicios.filter((e) => e.id !== id));
  }

  async function salvar() {
    const validos = exercicios.filter((e) => e.nome.trim());
    if (!validos.length) return;
    await supabase.from("workouts").insert({
      user_id: userId,
      dia,
      foco,
      data: todayISO(),
      exercicios: validos,
    });
    setFoco("");
    setExercicios([{ id: crypto.randomUUID(), nome: "", series: "" }]);
    refresh();
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <div style={{ background: C.charcoal, borderRadius: 16, padding: 20, border: `1px solid ${C.yellow}22` }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <select value={dia} onChange={(e) => setDia(e.target.value)} style={selStyle}>
            {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <input value={foco} onChange={(e) => setFoco(e.target.value)} placeholder="Foco do dia (ex: Peito, tríceps e ombros)" style={{ ...selStyle, flex: 1, minWidth: 180 }} />
        </div>

        {exercicios.map((ex, i) => (
          <div key={ex.id} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
            <span style={{ color: C.gray, fontSize: 12, width: 18 }}>{i + 1}.</span>
            <input value={ex.nome} onChange={(e) => updateExercicio(ex.id, "nome", e.target.value)} placeholder="Exercício (ex: Flexão)" style={{ ...inputStyle, flex: 2 }} />
            <input value={ex.series} onChange={(e) => updateExercicio(ex.id, "series", e.target.value)} placeholder="Séries (ex: 4x12)" style={{ ...inputStyle, flex: 1 }} />
            <button onClick={() => removeExercicio(ex.id)} style={iconBtnStyle}><Trash2 size={15} color={C.gray} /></button>
          </div>
        ))}

        <button onClick={addExercicio} style={{ ...ghostBtnStyle, marginTop: 4 }}>
          <Plus size={15} /> Adicionar exercício
        </button>

        <button onClick={salvar} style={{ ...primaryBtnStyle, marginTop: 18, width: "100%" }}>
          Salvar treino de {dia}
        </button>
      </div>

      <h3 style={sectionTitle}>Treinos recentes</h3>
      {workouts.length === 0 && <p style={{ color: C.gray, fontSize: 13 }}>Nenhum treino registrado ainda.</p>}
      {workouts.slice(0, 8).map((w) => (
        <div key={w.id} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <strong style={{ color: C.yellow, fontSize: 14 }}>{w.dia}{w.foco ? `: ${w.foco}` : ""}</strong>
            <span style={{ color: C.gray, fontSize: 11 }}>{w.data}</span>
          </div>
          <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: C.cream, fontSize: 13 }}>
            {w.exercicios.map((e) => (
              <li key={e.id}>{e.nome} {e.series && <span style={{ color: C.gray }}>— {e.series}</span>}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function HistoricoTab({ workouts }) {
  const totalPorSemana = {};
  workouts.forEach((w) => {
    const d = new Date(w.data);
    const semana = `${d.getFullYear()}-S${Math.ceil((d.getDate() + new Date(d.getFullYear(), d.getMonth(), 1).getDay()) / 7)}`;
    totalPorSemana[semana] = (totalPorSemana[semana] || 0) + 1;
  });
  const semanas = Object.entries(totalPorSemana).slice(-8);
  const max = Math.max(1, ...semanas.map(([, v]) => v));
  const totalTreinos = workouts.length;
  const totalExercicios = workouts.reduce((acc, w) => acc + w.exercicios.length, 0);
  const focos = {};
  workouts.forEach((w) => { if (w.foco) focos[w.foco] = (focos[w.foco] || 0) + 1; });
  const focoTop = Object.entries(focos).sort((a, b) => b[1] - a[1])[0];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard label="Treinos registrados" value={totalTreinos} />
        <StatCard label="Exercícios no total" value={totalExercicios} />
        <StatCard label="Foco mais comum" value={focoTop ? focoTop[0] : "—"} small />
      </div>

      <h3 style={sectionTitle}>Frequência por semana</h3>
      {semanas.length === 0 ? (
        <p style={{ color: C.gray, fontSize: 13 }}>Registre treinos para ver sua evolução aqui.</p>
      ) : (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140, padding: "0 4px" }}>
          {semanas.map(([sem, v]) => (
            <div key={sem} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: "100%", maxWidth: 32, background: `linear-gradient(180deg, ${C.yellow}, ${C.amber})`, borderRadius: "6px 6px 0 0", height: `${(v / max) * 100}px`, minHeight: 6 }} />
              <span style={{ color: C.gray, fontSize: 9 }}>{sem.split("-")[1]}</span>
            </div>
          ))}
        </div>
      )}

      <h3 style={sectionTitle}>Linha do tempo</h3>
      {workouts.slice(0, 15).map((w) => (
        <div key={w.id} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.yellow, marginTop: 5, flexShrink: 0 }} />
          <div>
            <div style={{ color: C.cream, fontSize: 13 }}><strong style={{ color: C.yellow }}>{w.dia}</strong> {w.foco && `· ${w.foco}`}</div>
            <div style={{ color: C.gray, fontSize: 11 }}>{w.data} · {w.exercicios.length} exercícios</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, small }) {
  return (
    <div style={{ flex: 1, minWidth: 130, background: C.charcoal, borderRadius: 12, padding: 14, border: `1px solid ${C.yellow}22` }}>
      <div style={{ color: C.yellow, fontSize: small ? 16 : 24, fontWeight: 900 }}>{value}</div>
      <div style={{ color: C.gray, fontSize: 11, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
    </div>
  );
}

function LojaTab() {
  const [busca, setBusca] = useState("");
  const itens = busca.trim()
    ? [{ termo: busca, nome: `Buscar "${busca}"`, cat: "Busca" }, ...CATALOGO.filter((i) => i.nome.toLowerCase().includes(busca.toLowerCase()))]
    : CATALOGO;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.charcoal, borderRadius: 10, padding: "10px 14px", marginBottom: 18, border: `1px solid ${C.yellow}22` }}>
        <Search size={16} color={C.gray} />
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar equipamento ou suplemento no Mercado Livre" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.cream, fontSize: 14 }} />
      </div>
      <p style={{ color: C.gray, fontSize: 12, marginBottom: 16, lineHeight: 1.5 }}>
        Sem afiliação — os links abrem a busca real no Mercado Livre pra você comparar preço e vendedor.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {itens.map((item, i) => (
          <a key={i} href={ml(item.termo)} target="_blank" rel="noopener noreferrer" style={{ display: "block", background: C.charcoal, borderRadius: 14, padding: 16, textDecoration: "none", border: `1px solid ${C.yellow}22` }}>
            <div style={{ display: "inline-block", background: `${C.yellow}22`, color: C.yellow, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, marginBottom: 8, textTransform: "uppercase" }}>{item.cat}</div>
            <div style={{ color: C.cream, fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{item.nome}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.yellow, fontSize: 12, marginTop: 10 }}>Ver no Mercado Livre <ChevronRight size={13} /></div>
          </a>
        ))}
      </div>
    </div>
  );
}

const DICAS = {
  flexao: ["Mantenha o corpo em linha reta, sem deixar o quadril cair.", "Cotovelos a 45° do tronco, não abertos a 90°.", "Desça até o peito quase tocar o chão."],
  barra: ["Puxe com as costas, não só com o braço.", "Evite balançar o corpo (kipping) sem intenção.", "Suba até o queixo passar a barra."],
  agachamento: ["Joelhos alinhados com a ponta dos pés.", "Desça controlado, quadril para trás primeiro.", "Mantenha o peito erguido durante o movimento."],
  prancha: ["Não deixe o quadril subir ou cair.", "Contraia o abdômen e o glúteo.", "Respire de forma constante, sem prender o ar."],
};function CoachTab() {
  const videoRef = useRef(null);
  const [ativo, setAtivo] = useState(false);
  const [erro, setErro] = useState("");
  const [exercicio, setExercicio] = useState("flexao");
  const [contador, setContador] = useState(0);
  const streamRef = useRef(null);

  async function iniciar() {
    setErro("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setAtivo(true);
    } catch {
      setErro("Não foi possível acessar a câmera. Verifique a permissão do navegador.");
    }
  }
  function parar() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setAtivo(false);
  }
  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <div style={{ background: `${C.yellow}15`, border: `1px solid ${C.yellow}44`, borderRadius: 12, padding: 12, marginBottom: 16, color: C.cream, fontSize: 12, lineHeight: 1.5 }}>
        Versão inicial do Coach: acompanha seu treino ao vivo pela câmera e mostra dicas de execução. Correção automática de postura por IA é a próxima etapa.
      </div>
      <select value={exercicio} onChange={(e) => setExercicio(e.target.value)} style={{ ...selStyle, width: "100%", marginBottom: 12 }}>
        <option value="flexao">Flexão de braço</option>
        <option value="barra">Barra fixa</option>
        <option value="agachamento">Agachamento</option>
        <option value="prancha">Prancha</option>
      </select>
      <div style={{ position: "relative", background: C.charcoal, borderRadius: 16, overflow: "hidden", aspectRatio: "3/4", border: `1px solid ${C.yellow}33` }}>
        {ativo ? (
          <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Camera size={36} color={C.gray} />
            <span style={{ color: C.gray, fontSize: 13 }}>Câmera desligada</span>
          </div>
        )}
        {ativo && (
          <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setContador((c) => c + 1)} style={{ ...primaryBtnStyle, padding: "10px 18px" }}>Rep +1 ({contador})</button>
            <button onClick={parar} style={{ ...iconBtnStyle, background: `${C.black}cc` }}><Square size={16} color={C.cream} /></button>
          </div>
        )}
      </div>
      {!ativo && (
        <button onClick={iniciar} style={{ ...primaryBtnStyle, width: "100%", marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Play size={15} /> Ativar câmera e começar
        </button>
      )}
      {erro && <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 8 }}>{erro}</p>}
      <h3 style={sectionTitle}>Dicas de execução</h3>
      <ul style={{ color: C.cream, fontSize: 13, lineHeight: 1.8, paddingLeft: 18 }}>
        {DICAS[exercicio].map((d, i) => <li key={i}>{d}</li>)}
      </ul>
    </div>
  );
}

const inputStyle = { padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.gray}44`, background: C.black, color: C.cream, fontSize: 13, outline: "none" };
const inputBig = { width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 10, border: `1px solid ${C.gray}55`, background: C.charcoal, color: C.cream, fontSize: 16, outline: "none" };
const selStyle = { ...inputStyle, cursor: "pointer" };
const primaryBtnStyle = { padding: "12px 16px", borderRadius: 10, border: "none", background: C.yellow, color: C.black, fontWeight: 800, fontSize: 13, cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.3 };
const ghostBtnStyle = { display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, border: `1px dashed ${C.gray}66`, background: "transparent", color: C.gray, fontSize: 12, cursor: "pointer" };
const iconBtnStyle = { padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", flexShrink: 0 };
const cardStyle = { background: C.charcoal, borderRadius: 12, padding: 14, marginBottom: 10, border: `1px solid ${C.yellow}18` };
const sectionTitle = { color: C.cream, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, margin: "26px 0 12px", borderLeft: `3px solid ${C.yellow}`, paddingLeft: 10 };

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("treino");
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  async function refresh() {
    if (!session) return;
    const { data } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", session.user.id)
      .order("data", { ascending: false });
    setWorkouts(data || []);
  }

  useEffect(() => { if (session) refresh(); }, [session]);

  if (loading) return <div style={{ minHeight: "100vh", background: C.black }} />;
  if (!session) return <Login />;

  return (
    <div style={{ minHeight: "100vh", background: C.black, fontFamily: "Inter, system-ui, sans-serif" }}>
      <TopBar email={session.user.email} tab={tab} setTab={setTab} sair={() => supabase.auth.signOut()} />
      {tab === "treino" && <TreinoTab userId={session.user.id} workouts={workouts} refresh={refresh} />}
      {tab === "historico" && <HistoricoTab workouts={workouts} />}
      {tab === "loja" && <LojaTab />}
      {tab === "coach" && <CoachTab />}
      <div style={{ height: 30 }} />
    </div>
  );
}            
