import { useState, useMemo } from "react";
import {
  LayoutDashboard, Users, Building2, Folder, FileSpreadsheet,
  UserCheck, ChevronRight, Plus, X, ExternalLink,
  Menu, Tag, Trash2, CheckSquare, ArrowRight, Edit3,
  Clock, CheckCircle, AlertCircle, Bell, Lock, LogOut,
  StickyNote, Eye, EyeOff, Save, Unlink, Settings,
  Link2, UserPlus, UserMinus, AlertTriangle, Send
} from "lucide-react";

// ─── CSS ────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #07070c; overflow: hidden; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #1e1e2c; border-radius: 99px; }
  .hov-card { transition: all 0.2s ease !important; }
  .hov-card:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(0,0,0,0.5) !important; border-color: #2a2a3c !important; }
  .hov-purple:hover { border-color: #7c5ff5 !important; }
  .hov-green:hover { border-color: #00c896 !important; }
  .row-item { transition: all 0.15s ease; }
  .row-item:hover { background: #111119 !important; border-color: #252535 !important; }
  .nav-lnk { transition: all 0.13s ease; border-left: 2px solid transparent !important; }
  .nav-lnk:hover { background: rgba(124,95,245,0.07) !important; color: #9d87fa !important; }
  .nav-lnk.active { background: rgba(124,95,245,0.12) !important; color: #9d87fa !important; border-left-color: #7c5ff5 !important; }
  .btn-p { transition: all 0.15s ease !important; }
  .btn-p:hover { opacity: 0.85; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(124,95,245,0.4) !important; }
  .btn-s:hover { background: rgba(255,255,255,0.05) !important; }
  .btn-d:hover { background: rgba(248,113,113,0.1) !important; color: #f87171 !important; border-color: rgba(248,113,113,0.2) !important; }
  .btn-green:hover { background: rgba(0,200,150,0.15) !important; }
  .tab-btn { transition: all 0.13s ease !important; }
  .tab-btn:hover { color: #8888aa !important; }
  .tab-btn.active { color: #9d87fa !important; background: #141426 !important; }
  .filter-chip { transition: all 0.13s ease; cursor: pointer; }
  .filter-chip:hover { border-color: #7c5ff5 !important; color: #9d87fa !important; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);} }
  @keyframes overlayIn { from{opacity:0;}to{opacity:1;} }
  @keyframes modalPop { from{opacity:0;transform:scale(0.95) translateY(10px);}to{opacity:1;transform:scale(1) translateY(0);} }
  @keyframes slideRight { from{opacity:0;transform:translateX(14px);}to{opacity:1;transform:translateX(0);} }
  @keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.35;} }
  .fade-up { animation: fadeUp 0.24s ease forwards; }
  .d1{animation-delay:.04s;opacity:0;} .d2{animation-delay:.08s;opacity:0;} .d3{animation-delay:.12s;opacity:0;}
  .d4{animation-delay:.16s;opacity:0;} .d5{animation-delay:.20s;opacity:0;}
  .modal-wrap { animation: overlayIn 0.15s ease; }
  .modal-box { animation: modalPop 0.2s cubic-bezier(0.34,1.4,0.64,1); }
  .notif-panel { animation: slideRight 0.18s ease; }
  .notif-dot { animation: pulse 1.5s ease infinite; }
  .notif-item:hover { background: #0f0f18 !important; }
  .f-in { background:#0a0a12 !important; border:1px solid #1c1c2a !important; border-radius:8px !important; color:#e2e2f0 !important; padding:8px 11px !important; font-size:13px !important; font-family:'Outfit',sans-serif !important; width:100%; outline:none !important; transition:border-color 0.15s !important; }
  .f-in:focus { border-color:#7c5ff5 !important; }
  .f-in option { background:#0a0a12; color:#e2e2f0; }
  .f-area { background:#0a0a12 !important; border:1px solid #1c1c2a !important; border-radius:8px !important; color:#e2e2f0 !important; padding:8px 11px !important; font-size:13px !important; font-family:'Outfit',sans-serif !important; width:100%; outline:none !important; resize:vertical; min-height:80px; transition:border-color 0.15s !important; }
  .f-area:focus { border-color:#7c5ff5 !important; }
  @media (max-width:768px) {
    .sidebar { position:fixed !important; z-index:999; height:100vh; transform:translateX(-100%); transition:transform 0.22s ease !important; }
    .sidebar.open { transform:translateX(0) !important; }
  }
`;

// ─── SEED ───────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const now = () => Date.now();

// Pakistani time format
const fmtTime = (ts) => {
  if (!ts) return "";
  const d = new Date(ts);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let h = d.getHours(), m = d.getMinutes(), ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${d.getDate()} ${months[d.getMonth()]} · ${h}:${m.toString().padStart(2,"0")} ${ampm}`;
};
const timeAgo = (ts) => {
  const d = Date.now() - ts;
  if (d < 60000) return "just now";
  if (d < 3600000) return `${Math.floor(d/60000)}m ago`;
  if (d < 86400000) return `${Math.floor(d/3600000)}h ago`;
  return `${Math.floor(d/86400000)}d ago`;
};

const SEED = {
  sheetTypes: [
    { id:"st1", name:"SEO",       color:"#10b981" },
    { id:"st2", name:"PPC",       color:"#f59e0b" },
    { id:"st3", name:"Analytics", color:"#3b82f6" },
    { id:"st4", name:"Social",    color:"#8b5cf6" },
    { id:"st5", name:"Content",   color:"#ec4899" },
    { id:"st6", name:"Email",     color:"#06b6d4" },
  ],
  clients: [
    { id:"c1", name:"TechNova Corp",    email:"ops@technova.io",  industry:"Technology", notes:"", createdAt: now()-86400000*5 },
    { id:"c2", name:"GreenLeaf Retail", email:"hi@greenleaf.co",  industry:"E-Commerce", notes:"", createdAt: now()-86400000*2 },
  ],
  accounts: [
    { id:"a1", clientId:"c1", name:"Amazon Ads",    platform:"Amazon",  status:"Active",   notes:"", createdAt: now()-86400000*4 },
    { id:"a2", clientId:"c1", name:"Google Search", platform:"Google",  status:"Active",   notes:"", createdAt: now()-86400000*3 },
    { id:"a3", clientId:"c2", name:"Shopify Store", platform:"Shopify", status:"Inactive", notes:"", createdAt: now()-86400000*1 },
  ],
  projects: [
    { id:"p1", accountId:"a1", name:"Q1 2025 Launch",    status:"In Progress", notes:"", createdAt: now()-86400000*3 },
    { id:"p2", accountId:"a1", name:"Brand Awareness",   status:"Pending",     notes:"", createdAt: now()-86400000*2 },
    { id:"p3", accountId:"a2", name:"Google Search Ads", status:"Done",        notes:"", createdAt: now()-86400000*1 },
    { id:"p4", accountId:"a3", name:"Conversion Ops",    status:"In Progress", notes:"", createdAt: now()-86400000*1 },
  ],
  workers: [
    { id:"w1", name:"Ahmed Khan", role:"SEO Specialist", avatar:"AK", password:"ahmed123", createdAt: now()-86400000*10 },
    { id:"w2", name:"Sara Ali",   role:"PPC Manager",    avatar:"SA", password:"sara123",  createdAt: now()-86400000*8  },
    { id:"w3", name:"Bilal Raza", role:"Analyst",        avatar:"BR", password:"bilal123", createdAt: now()-86400000*6  },
  ],
  sheets: [
    { id:"sh1", projectId:"p1", name:"Keyword Research Master",  url:"https://docs.google.com/spreadsheets/d/1", typeId:"st1", workerIds:["w1"],     priority:"High",   createdAt: now()-86400000*2 },
    { id:"sh2", projectId:"p1", name:"Campaign Budget Planner",  url:"https://docs.google.com/spreadsheets/d/2", typeId:"st2", workerIds:["w2"],     priority:"High",   createdAt: now()-86400000*2 },
    { id:"sh3", projectId:"p2", name:"Brand Tracker 2025",       url:"https://docs.google.com/spreadsheets/d/3", typeId:"st4", workerIds:["w1"],     priority:"Medium", createdAt: now()-86400000*1 },
    { id:"sh4", projectId:"p3", name:"Google Ads Performance",   url:"https://docs.google.com/spreadsheets/d/4", typeId:"st2", workerIds:["w2"],     priority:"High",   createdAt: now()-86400000*1 },
    { id:"sh5", projectId:"p3", name:"Conversion Analytics",     url:"https://docs.google.com/spreadsheets/d/5", typeId:"st3", workerIds:["w3"],     priority:"Medium", createdAt: now()-86400000*0 },
    { id:"sh6", projectId:"p4", name:"Revenue Report Q1",        url:"https://docs.google.com/spreadsheets/d/6", typeId:"st3", workerIds:["w3"],     priority:"Low",    createdAt: now()-86400000*0 },
    { id:"sh7", projectId:"p1", name:"Competitor Analysis",      url:"https://docs.google.com/spreadsheets/d/7", typeId:"st1", workerIds:["w1","w2"],priority:"Medium", createdAt: now()-86400000*0 },
    { id:"sh8", projectId:"p4", name:"Email Campaign Stats",     url:"https://docs.google.com/spreadsheets/d/8", typeId:"st6", workerIds:["w2"],     priority:"Low",    createdAt: now()-86400000*0 },
  ],
  tasks: [
    { id:"t1", workerId:"w1", projectId:"p1", sheetId:"sh1", title:"Update keyword targets for Q1",  description:"Go through master keyword list and update targets based on latest search volume. Focus on long-tail opportunities.", status:"In Progress", deadline: now()+86400000*3,  createdAt: now()-86400000*2 },
    { id:"t2", workerId:"w2", projectId:"p1", sheetId:"sh2", title:"Review budget allocation",        description:"Review current budget split across campaigns and reallocate based on ROAS performance.",                           status:"Pending",     deadline: now()+86400000*5,  createdAt: now()-86400000*1 },
    { id:"t3", workerId:"w1", projectId:"p2", sheetId:"sh3", title:"Add brand terms & variations",   description:"Add all brand term variations and negative keywords to the brand tracker sheet.",                                  status:"Done",        deadline: null,              createdAt: now()-86400000*3 },
    { id:"t4", workerId:"w3", projectId:"p3", sheetId:"sh5", title:"Setup conversion goals",         description:"Configure all conversion goals in analytics and link to the tracking sheet.",                                    status:"In Progress", deadline: now()+86400000*2,  createdAt: now()-86400000*1 },
    { id:"t5", workerId:"w2", projectId:"p3", sheetId:"sh4", title:"Optimize ad spend",              description:"Pause underperforming ad groups and shift budget to top performers.",                                            status:"Pending",     deadline: now()+86400000*7,  createdAt: now()-86400000*0 },
  ],
  notifications: [],
  statusRequests: [], // worker requests to change task status
  adminCreds: { email:"admin@arpusultron.io", password:"admin123" },
  // Point 8: projects not tied to any account
  specialProjects: [
    { id:"sp1", name:"Internal Ops Dashboard", status:"In Progress", notes:"", sheets:[], log:[
      { id:"spl1", status:"Pending",     note:"Project initiated — scope defined",    ts: now()-86400000*3 },
      { id:"spl2", status:"In Progress", note:"Development started, 40% complete",    ts: now()-86400000*1 },
    ], createdAt: now()-86400000*3 },
    { id:"sp2", name:"Annual Strategy Deck", status:"Pending", notes:"", sheets:[], log:[
      { id:"spl3", status:"Pending", note:"Waiting for Q4 data from finance",         ts: now()-86400000*1 },
    ], createdAt: now()-86400000*1 },
  ],
  // Point 7: admin's own task log with chain
  adminTasks: [
    { id:"at1", title:"File client appeal for TechNova", status:"Done", log:[
      { id:"al1", status:"Pending",     note:"Created — appeal needs to be filed",    ts: now()-86400000*3 },
      { id:"al2", status:"In Progress", note:"Gathered all documents",                ts: now()-86400000*2 },
      { id:"al3", status:"Done",        note:"Appeal submitted successfully",          ts: now()-86400000*1 },
    ], createdAt: now()-86400000*3 },
    { id:"at2", title:"Quarterly billing review", status:"In Progress", log:[
      { id:"al4", status:"Pending",     note:"Scheduled for this week",               ts: now()-86400000*2 },
      { id:"al5", status:"In Progress", note:"Going through invoices",                ts: now()-86400000*1 },
    ], createdAt: now()-86400000*2 },
    { id:"at3", title:"Onboard new SEO client", status:"Pending", log:[
      { id:"al6", status:"Pending",     note:"Received brief from client",            ts: now()-86400000*0 },
    ], createdAt: now()-86400000*0 },
  ],
  accountCases: [
    { id:"ac1", accountId:"a1", title:"Refund dispute — Q4 overcharge", status:"In Progress", log:[
      { id:"acl1", status:"Pending",     note:"Client reported overcharge on Q4 invoice",   ts: now()-86400000*4 },
      { id:"acl2", status:"In Progress", note:"Escalated to billing team for review",        ts: now()-86400000*2 },
    ], createdAt: now()-86400000*4 },
    { id:"ac2", accountId:"a2", title:"Ad account suspension appeal", status:"Pending", log:[
      { id:"acl3", status:"Pending", note:"Google suspended account — appeal filed",         ts: now()-86400000*1 },
    ], createdAt: now()-86400000*1 },
  ],
  integrations: {
    supabase: { url:"", anonKey:"", connected:false },
    github:   { token:"", repo:"", owner:"", connected:false },
  },
};

// ─── HELPERS ────────────────────────────────────────────────────────────────
const priStyle = p => ({
  High:   { color:"#f87171", background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.18)" },
  Medium: { color:"#fbbf24", background:"rgba(251,191,36,0.1)",  border:"1px solid rgba(251,191,36,0.18)"  },
  Low:    { color:"#6ee7b7", background:"rgba(110,231,183,0.1)", border:"1px solid rgba(110,231,183,0.18)" },
}[p] || {});

const stStyle = s => ({
  "In Progress": { color:"#60a5fa", background:"rgba(96,165,250,0.1)",  border:"1px solid rgba(96,165,250,0.18)"  },
  "Pending":     { color:"#fbbf24", background:"rgba(251,191,36,0.1)",  border:"1px solid rgba(251,191,36,0.18)"  },
  "Done":        { color:"#34d399", background:"rgba(52,211,153,0.1)",  border:"1px solid rgba(52,211,153,0.18)"  },
  "Active":      { color:"#34d399", background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.15)"  },
  "Inactive":    { color:"#aaaacc", background:"rgba(136,136,153,0.08)",border:"1px solid rgba(136,136,153,0.15)" },
  "In Appeal":   { color:"#f59e0b", background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.15)"  },
}[s] || {});

const initials = n => n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const ACCOUNT_STATUSES = ["Active","Inactive","In Appeal"];

// Status flow for workers: Pending→InProgress→Done (forward only without request)
const canAdvanceStatus = (current, next) => {
  const order = ["Pending","In Progress","Done"];
  return order.indexOf(next) === order.indexOf(current) + 1;
};

// ─── ATOMS ──────────────────────────────────────────────────────────────────
const Av = ({ text, color="#7c5ff5", size=34 }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:`${color}1a`, border:`1.5px solid ${color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.33, fontWeight:700, color, flexShrink:0, fontFamily:"'Syne',sans-serif" }}>{text}</div>
);
const Badge = ({ label, style:s }) => (
  <span style={{ fontSize:11, fontWeight:600, padding:"2px 9px", borderRadius:99, letterSpacing:"0.02em", whiteSpace:"nowrap", ...s }}>{label}</span>
);
const Btn = ({ label, icon:Icon, onClick, variant="p", small, style:s, disabled }) => {
  const vs = {
    p:      { background:"#7c5ff5", color:"#fff",     border:"none" },
    s:      { background:"transparent", color:"#aaaacc", border:"1px solid #1e1e2c" },
    d:      { background:"transparent", color:"#aaaacc", border:"1px solid #1e1e2c" },
    ghost:  { background:"transparent", color:"#6666aa", border:"none" },
    danger: { background:"rgba(248,113,113,0.1)", color:"#f87171", border:"1px solid rgba(248,113,113,0.2)" },
    green:  { background:"rgba(0,200,150,0.1)", color:"#00c896", border:"1px solid rgba(0,200,150,0.2)" },
  };
  return (
    <button className={`btn-${variant}`} onClick={onClick} disabled={disabled}
      style={{ display:"inline-flex", alignItems:"center", gap:5, padding:small?"4px 10px":"7px 14px", borderRadius:8, fontSize:small?11:13, fontWeight:600, cursor:disabled?"not-allowed":"pointer", fontFamily:"'Outfit',sans-serif", opacity:disabled?0.5:1, flexShrink:0, ...vs[variant], ...s }}>
      {Icon && <Icon size={small?12:14}/>}{label}
    </button>
  );
};
const Field = ({ label, children }) => (
  <div style={{ marginBottom:12 }}>
    <label style={{ display:"block", fontSize:10, fontWeight:600, color:"#555568", marginBottom:5, letterSpacing:"0.06em", textTransform:"uppercase" }}>{label}</label>
    {children}
  </div>
);
const Empty = ({ icon:Icon=FileSpreadsheet, msg }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"44px 24px", color:"#44445e", gap:9 }}>
    <Icon size={28} strokeWidth={1}/><div style={{ fontSize:13 }}>{msg}</div>
  </div>
);
const IconBtn = ({ icon:Icon, onClick, title, color="#33334a", hoverColor="#9d87fa" }) => (
  <button onClick={onClick} title={title}
    style={{ background:"none", border:"none", color, cursor:"pointer", display:"flex", padding:4, borderRadius:5, transition:"color 0.13s" }}
    onMouseEnter={e=>e.currentTarget.style.color=hoverColor}
    onMouseLeave={e=>e.currentTarget.style.color=color}>
    <Icon size={13}/>
  </button>
);
const Divider = ({ label }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, margin:"14px 0 10px" }}>
    {label && <div style={{ fontSize:9, color:"#555568", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{label}</div>}
    <div style={{ flex:1, height:1, background:"#111120" }}/>
  </div>
);
const CreatedAt = ({ ts }) => ts ? (
  <div style={{ fontSize:10, color:"#4a4a62", marginTop:3 }}>{fmtTime(ts)}</div>
) : null;

// ─── MODAL ──────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, wide, maxW }) => (
  <div className="modal-wrap" onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.82)", backdropFilter:"blur(5px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }}>
    <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ background:"#0e0e18", border:"1px solid #1e1e2c", borderRadius:16, padding:24, width:"100%", maxWidth:maxW||( wide?580:430), maxHeight:"88vh", overflowY:"auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <h3 style={{ fontSize:16, fontWeight:700, color:"#e4e4f4", fontFamily:"'Syne',sans-serif" }}>{title}</h3>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"#7777a0", cursor:"pointer", display:"flex", padding:3 }}><X size={15}/></button>
      </div>
      {children}
    </div>
  </div>
);

// ─── CONFIRM MODAL ───────────────────────────────────────────────────────────
const ConfirmModal = ({ message, onConfirm, onClose, danger=true }) => (
  <Modal title={danger ? "⚠️ Confirm Delete" : "Confirm"} onClose={onClose}>
    <div style={{ fontSize:14, color:"#b0b0cc", marginBottom:20, lineHeight:1.6 }}>{message}</div>
    <div style={{ display:"flex", gap:8 }}>
      <Btn label={danger?"Yes, Delete":"Confirm"} variant={danger?"danger":"p"} icon={danger?Trash2:CheckCircle} onClick={()=>{onConfirm();onClose();}}/>
      <Btn label="Cancel" variant="s" onClick={onClose}/>
    </div>
  </Modal>
);

// ─── LOGIN ───────────────────────────────────────────────────────────────────
const LoginScreen = ({ data, onLogin }) => {
  const [u,setU]=useState(""); const [p,setP]=useState(""); const [show,setShow]=useState(false);
  const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  const handle = () => {
    setErr(""); setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      const lu = u.trim().toLowerCase().replace(/\s/g,"");
      if ((lu==="admin"||lu===data.adminCreds.email.toLowerCase().replace(/\s/g,"")) && p===data.adminCreds.password) { onLogin({id:"admin",name:"Admin",role:"admin"}); return; }
      const w = data.workers.find(w=>w.name.toLowerCase().replace(/\s/g,"")===lu && w.password===p);
      if (w) { onLogin({id:w.id,name:w.name,role:"worker",workerId:w.id}); return; }
      setErr("Incorrect username or password. Please try again.");
    },500);
  };
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#07070c", fontFamily:"'Outfit',sans-serif" }}>
      <div style={{ width:"100%", maxWidth:350, padding:20 }}>
        <div style={{ textAlign:"center", marginBottom:30 }}>
          <div style={{ fontSize:28, fontWeight:800, color:"#eeeef8", fontFamily:"'Syne',sans-serif", marginBottom:4 }}>Arpus-<span style={{ color:"#7c5ff5" }}>Ultron</span></div>
          <div style={{ fontSize:10, color:"#555568", letterSpacing:"0.1em", textTransform:"uppercase" }}>Secure Login</div>
        </div>
        <div style={{ background:"#0e0e18", border:"1px solid #1e1e2c", borderRadius:16, padding:22 }}>
          <Field label="Username / Email"><input className="f-in" value={u} onChange={e=>setU(e.target.value)} placeholder="admin or worker name" onKeyDown={e=>e.key==="Enter"&&handle()}/></Field>
          <Field label="Password">
            <div style={{ position:"relative" }}>
              <input className="f-in" type={show?"text":"password"} value={p} onChange={e=>setP(e.target.value)} placeholder="••••••••" style={{ paddingRight:36 }} onKeyDown={e=>e.key==="Enter"&&handle()}/>
              <button onClick={()=>setShow(x=>!x)} style={{ position:"absolute", right:9, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#555568", cursor:"pointer", display:"flex" }}>{show?<EyeOff size={13}/>:<Eye size={13}/>}</button>
            </div>
          </Field>
          {err && <div style={{ background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.18)", borderRadius:7, padding:"8px 11px", fontSize:12, color:"#f87171", marginBottom:12 }}>{err}</div>}
          <button onClick={handle} disabled={loading} style={{ width:"100%", background:"#7c5ff5", color:"#fff", border:"none", borderRadius:9, padding:"10px 0", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'Syne',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:7, opacity:loading?0.7:1 }}>
            <Lock size={13}/>{loading?"Verifying...":"Login"}
          </button>
          <div style={{ marginTop:14, padding:"9px 11px", background:"#08080f", borderRadius:7, border:"1px solid #111120" }}>
            <div style={{ fontSize:9, color:"#22222e", marginBottom:4, letterSpacing:"0.08em", textTransform:"uppercase" }}>Demo Credentials</div>
            <div style={{ fontSize:11, color:"#555568", lineHeight:1.9 }}>
              Admin: <span style={{ color:"#7c5ff5" }}>admin</span> / <span style={{ color:"#7c5ff5" }}>admin123</span><br/>
              Worker: <span style={{ color:"#00c896" }}>AhmedKhan</span> / <span style={{ color:"#00c896" }}>ahmed123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── TABS ────────────────────────────────────────────────────────────────────
const Tabs = ({ tabs, active, onChange }) => (
  <div style={{ display:"flex", gap:3, background:"#0a0a12", borderRadius:9, padding:3, width:"fit-content", marginBottom:16, flexWrap:"wrap" }}>
    {tabs.map(t=>(
      <button key={t.value} className={`tab-btn${active===t.value?" active":""}`} onClick={()=>onChange(t.value)}
        style={{ padding:"5px 13px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, color:active===t.value?"#9d87fa":"#44445a", background:active===t.value?"#141426":"transparent", fontFamily:"'Outfit',sans-serif" }}>
        {t.label}
      </button>
    ))}
  </div>
);

// ─── SHEET WORKERS MODAL ─────────────────────────────────────────────────────
const SheetWorkersModal = ({ sheet, workers, onClose, onUpdate }) => {
  const [assigned, setAssigned] = useState(sheet.workerIds||[]);
  const toggle = (wid) => setAssigned(prev => prev.includes(wid) ? prev.filter(x=>x!==wid) : [...prev,wid]);
  return (
    <Modal title={`Workers — ${sheet.name}`} onClose={onClose}>
      <div style={{ marginBottom:14, fontSize:12, color:"#555568" }}>Select workers who have access to this sheet:</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:18 }}>
        {workers.map(w=>{
          const has = assigned.includes(w.id);
          return (
            <div key={w.id} onClick={()=>toggle(w.id)} style={{ display:"flex", alignItems:"center", gap:11, padding:"10px 13px", background:has?"rgba(0,200,150,0.06)":"#0a0a12", border:`1px solid ${has?"rgba(0,200,150,0.25)":"#1c1c2a"}`, borderRadius:9, cursor:"pointer", transition:"all 0.15s" }}>
              <Av text={w.avatar} color="#00c896" size={32}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#e2e2f0" }}>{w.name}</div>
                <div style={{ fontSize:11, color:"#7777a0" }}>{w.role}</div>
              </div>
              <div style={{ width:18, height:18, borderRadius:5, border:`2px solid ${has?"#00c896":"#2a2a3e"}`, background:has?"#00c896":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.13s" }}>
                {has && <span style={{ color:"#07070c", fontSize:11, fontWeight:800 }}>✓</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <Btn label="Save Access" icon={Save} onClick={()=>{onUpdate(sheet.id,assigned);onClose();}}/>
        <Btn label="Cancel" variant="s" onClick={onClose}/>
      </div>
    </Modal>
  );
};

// ─── SHEET ROW ───────────────────────────────────────────────────────────────
const SheetRow = ({ sheet, sheetTypes, workers, projects, isAdmin, onEdit, onDelete, onManageWorkers, onNavigate }) => {
  const type   = sheetTypes.find(t=>t.id===sheet.typeId);
  const proj   = projects.find(p=>p.id===sheet.projectId);
  const assigned = workers.filter(w=>(sheet.workerIds||[]).includes(w.id));
  const [showWho, setShowWho] = useState(false);
  return (
    <div className="row-item" style={{ display:"flex", alignItems:"flex-start", gap:11, padding:"12px 15px", background:"#0c0c14", border:"1px solid #181826", borderRadius:10 }}>
      <div style={{ width:8, height:8, borderRadius:"50%", background:type?.color||"#333", flexShrink:0, marginTop:5 }}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#e2e2f0", wordBreak:"break-word", lineHeight:1.4 }}>{sheet.name}</div>
        {proj && (
          <button onClick={()=>onNavigate&&onNavigate("project",{projectId:proj.id})} style={{ background:"none",border:"none",padding:0,cursor:"pointer",fontSize:11,color:"#555570",marginTop:2,display:"block",textAlign:"left" }}>
            📁 {proj.name}
          </button>
        )}
        <CreatedAt ts={sheet.createdAt}/>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap", flexShrink:0 }}>
        {type && <span style={{ fontSize:11, fontWeight:600, color:type.color, background:`${type.color}18`, padding:"2px 8px", borderRadius:99 }}>{type.name}</span>}
        <Badge label={sheet.priority} style={{ ...priStyle(sheet.priority), fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:99 }}/>
        {/* Workers — admin: clickable icon button, worker: hidden */}
        {isAdmin && (
          <div style={{ position:"relative" }}>
            <button onClick={()=>setShowWho(p=>!p)} title={`${assigned.length} worker${assigned.length!==1?"s":""} assigned`}
              style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(0,200,150,0.07)", border:"1px solid rgba(0,200,150,0.18)", borderRadius:7, padding:"3px 9px", cursor:"pointer", transition:"all 0.13s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(0,200,150,0.4)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(0,200,150,0.18)"}>
              <UserCheck size={12} color="#00c896"/>
              <span style={{ fontSize:11, color:"#00c896", fontWeight:600 }}>{assigned.length}</span>
            </button>
            {showWho && (
              <div onClick={e=>e.stopPropagation()} style={{ position:"absolute", right:0, top:"110%", background:"#0e0e18", border:"1px solid #1e1e2c", borderRadius:10, padding:"10px 12px", zIndex:50, minWidth:180, boxShadow:"0 12px 36px rgba(0,0,0,0.6)" }}>
                <div style={{ fontSize:10, color:"#555568", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:8 }}>Assigned Workers</div>
                {assigned.length===0 ? <div style={{ fontSize:12, color:"#555568" }}>No workers assigned</div> : (
                  assigned.map(w=>(
                    <div key={w.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:"1px solid #111120" }}>
                      <Av text={w.avatar} color="#00c896" size={22}/>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, color:"#e2e2f0", fontWeight:600 }}>{w.name}</div>
                        <div style={{ fontSize:10, color:"#555568" }}>{w.role}</div>
                      </div>
                    </div>
                  ))
                )}
                <button onClick={()=>{setShowWho(false);onManageWorkers&&onManageWorkers();}} style={{ marginTop:9, width:"100%", background:"rgba(0,200,150,0.08)", border:"1px solid rgba(0,200,150,0.18)", borderRadius:6, padding:"5px 0", color:"#00c896", cursor:"pointer", fontSize:11, fontWeight:600, fontFamily:"'Outfit',sans-serif" }}>
                  Manage Access
                </button>
              </div>
            )}
          </div>
        )}
        {/* Open link — prominent */}
        <a href={sheet.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} title="Open sheet"
          style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(59,130,246,0.12)", border:"1px solid rgba(59,130,246,0.25)", borderRadius:7, padding:"4px 11px", color:"#7ab8ff", fontSize:12, fontWeight:600, textDecoration:"none", flexShrink:0 }}>
          <ExternalLink size={14}/> Open
        </a>
        {isAdmin && <>
          <IconBtn icon={Edit3} onClick={onEdit} title="Edit sheet"/>
          <IconBtn icon={Trash2} onClick={onDelete} title="Delete sheet" color="#44445a" hoverColor="#f87171"/>
        </>}
      </div>
    </div>
  );
};

// ─── PROJECT CARD ────────────────────────────────────────────────────────────
const ProjectCard = ({ project, sheetCount, onClick, onEdit, onNotes, onDelete, isAdmin }) => (
  <div className={`hov-card hov-purple`} style={{ background:"#0e0e17", border:"1px solid #181826", borderRadius:13, overflow:"hidden" }}>
    <div onClick={onClick} style={{ padding:16, cursor:"pointer" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <div style={{ width:36, height:36, borderRadius:9, background:"rgba(124,95,245,0.1)", border:"1px solid rgba(124,95,245,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Folder size={15} color="#7c5ff5"/>
        </div>
        <Badge label={project.status} style={{ ...stStyle(project.status), fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:99 }}/>
      </div>
      <div style={{ fontSize:13, fontWeight:700, color:"#ddddef", fontFamily:"'Syne',sans-serif", marginBottom:5, lineHeight:1.3 }}>{project.name}</div>
      <div style={{ fontSize:11, color:"#383852" }}>{sheetCount} sheet{sheetCount!==1?"s":""}</div>
      <CreatedAt ts={project.createdAt}/>
    </div>
    {isAdmin && (
      <div style={{ display:"flex", gap:5, padding:"6px 12px 9px", borderTop:"1px solid #111120" }}>
        <IconBtn icon={Edit3} onClick={onEdit} title="Edit"/>
        <IconBtn icon={StickyNote} onClick={onNotes} title="Notes" color={project.notes?"#7c5ff5":"#33334a"}/>
        <IconBtn icon={Trash2} onClick={onDelete} title="Delete" color="#44445a" hoverColor="#f87171"/>
      </div>
    )}
  </div>
);

// ─── NOTES MODAL ─────────────────────────────────────────────────────────────
const NotesModal = ({ title, notes, onClose, onSave }) => {
  const [text, setText] = useState(notes||"");
  return (
    <Modal title={`📝 Notes — ${title}`} onClose={onClose} wide>
      <textarea className="f-area" value={text} onChange={e=>setText(e.target.value)} placeholder="Write notes here..." style={{ minHeight:160, marginBottom:14 }}/>
      <div style={{ display:"flex", gap:8 }}><Btn label="Save" icon={Save} onClick={()=>{onSave(text);onClose();}}/><Btn label="Cancel" variant="s" onClick={onClose}/></div>
    </Modal>
  );
};

// ─── ADD MODALS ──────────────────────────────────────────────────────────────
const AddClientModal = ({ onClose, onAdd }) => {
  const [f,setF]=useState({name:"",email:"",industry:""}); const set=(k,v)=>setF(p=>({...p,[k]:v}));
  return (<Modal title="Add Client" onClose={onClose}>
    <Field label="Company Name"><input className="f-in" value={f.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. TechNova Corp"/></Field>
    <Field label="Email"><input className="f-in" value={f.email} onChange={e=>set("email",e.target.value)} placeholder="contact@company.com"/></Field>
    <Field label="Industry"><input className="f-in" value={f.industry} onChange={e=>set("industry",e.target.value)} placeholder="e.g. E-Commerce"/></Field>
    <div style={{ display:"flex", gap:7 }}><Btn label="Create" icon={Plus} onClick={()=>{if(f.name){onAdd({...f,id:uid(),notes:"",createdAt:now()});onClose();}}}/><Btn label="Cancel" variant="s" onClick={onClose}/></div>
  </Modal>);
};
const AddAccountModal = ({ onClose, onAdd, clients, defaultClientId }) => {
  const [f,setF]=useState({name:"",platform:"",clientId:defaultClientId||clients[0]?.id||"",status:"Active"}); const set=(k,v)=>setF(p=>({...p,[k]:v}));
  return (<Modal title="Add Account" onClose={onClose}>
    <Field label="Client"><select className="f-in" value={f.clientId} onChange={e=>set("clientId",e.target.value)}>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
    <Field label="Account Name"><input className="f-in" value={f.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Amazon PPC"/></Field>
    <Field label="Platform"><input className="f-in" value={f.platform} onChange={e=>set("platform",e.target.value)} placeholder="e.g. Amazon, Google"/></Field>
    <Field label="Status"><select className="f-in" value={f.status} onChange={e=>set("status",e.target.value)}>{ACCOUNT_STATUSES.map(s=><option key={s}>{s}</option>)}</select></Field>
    <div style={{ display:"flex", gap:7 }}><Btn label="Create" icon={Plus} onClick={()=>{if(f.name&&f.clientId){onAdd({...f,id:uid(),notes:"",createdAt:now()});onClose();}}}/><Btn label="Cancel" variant="s" onClick={onClose}/></div>
  </Modal>);
};
const AddProjectModal = ({ onClose, onAdd, accounts, defaultAccountId }) => {
  const [f,setF]=useState({name:"",status:"Pending",accountId:defaultAccountId||accounts[0]?.id||""}); const set=(k,v)=>setF(p=>({...p,[k]:v}));
  return (<Modal title="Add Project" onClose={onClose}>
    <Field label="Account"><select className="f-in" value={f.accountId} onChange={e=>set("accountId",e.target.value)}>{accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>
    <Field label="Project Name"><input className="f-in" value={f.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Q1 Campaign"/></Field>
    <Field label="Status"><select className="f-in" value={f.status} onChange={e=>set("status",e.target.value)}>{["Pending","In Progress","Done"].map(s=><option key={s}>{s}</option>)}</select></Field>
    <div style={{ display:"flex", gap:7 }}><Btn label="Create" icon={Plus} onClick={()=>{if(f.name&&f.accountId){onAdd({...f,id:uid(),notes:"",createdAt:now()});onClose();}}}/><Btn label="Cancel" variant="s" onClick={onClose}/></div>
  </Modal>);
};
const AddSheetModal = ({ onClose, onAdd, projects, workers, sheetTypes, defaultProjectId }) => {
  const [f,setF]=useState({name:"",url:"",typeId:sheetTypes[0]?.id||"",projectId:defaultProjectId||projects[0]?.id||"",workerIds:[],priority:"Medium"}); const set=(k,v)=>setF(p=>({...p,[k]:v}));
  return (<Modal title="Add Sheet" onClose={onClose} wide>
    <Field label="Sheet Name"><input className="f-in" value={f.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Keyword Research Master"/></Field>
    <Field label="Google Sheet URL"><input className="f-in" value={f.url} onChange={e=>set("url",e.target.value)} placeholder="https://docs.google.com/spreadsheets/..."/></Field>
    <Field label="Project"><select className="f-in" value={f.projectId} onChange={e=>set("projectId",e.target.value)}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
      <Field label="Type"><select className="f-in" value={f.typeId} onChange={e=>set("typeId",e.target.value)}>{sheetTypes.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></Field>
      <Field label="Priority"><select className="f-in" value={f.priority} onChange={e=>set("priority",e.target.value)}>{["Low","Medium","High"].map(p=><option key={p}>{p}</option>)}</select></Field>
    </div>
    <Field label="Assign Workers">
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {workers.map(w=>{
          const has=f.workerIds.includes(w.id);
          return (<div key={w.id} onClick={()=>set("workerIds",has?f.workerIds.filter(x=>x!==w.id):[...f.workerIds,w.id])} style={{ display:"flex", alignItems:"center", gap:9, padding:"7px 10px", background:has?"rgba(0,200,150,0.05)":"transparent", border:`1px solid ${has?"rgba(0,200,150,0.2)":"#1c1c2a"}`, borderRadius:7, cursor:"pointer" }}>
            <Av text={w.avatar} color="#00c896" size={26}/><span style={{ fontSize:12, color:"#e2e2f0", flex:1 }}>{w.name}</span>
            <div style={{ width:15, height:15, borderRadius:4, border:`2px solid ${has?"#00c896":"#2a2a3e"}`, background:has?"#00c896":"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>{has&&<span style={{ color:"#07070c", fontSize:9, fontWeight:800 }}>✓</span>}</div>
          </div>);
        })}
      </div>
    </Field>
    <div style={{ display:"flex", gap:7 }}><Btn label="Add Sheet" icon={Plus} onClick={()=>{if(f.name&&f.url&&f.projectId){onAdd({...f,id:uid(),createdAt:now()});onClose();}}}/><Btn label="Cancel" variant="s" onClick={onClose}/></div>
  </Modal>);
};
const AddWorkerModal = ({ onClose, onAdd }) => {
  const [f,setF]=useState({name:"",role:"",password:""}); const set=(k,v)=>setF(p=>({...p,[k]:v}));
  return (<Modal title="Add Worker" onClose={onClose}>
    <Field label="Full Name"><input className="f-in" value={f.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Ahmed Khan"/></Field>
    <Field label="Role"><input className="f-in" value={f.role} onChange={e=>set("role",e.target.value)} placeholder="e.g. SEO Specialist"/></Field>
    <Field label="Login Password"><input className="f-in" value={f.password} onChange={e=>set("password",e.target.value)} placeholder="Set login password"/></Field>
    <div style={{ display:"flex", gap:7 }}><Btn label="Add" icon={Plus} onClick={()=>{if(f.name){onAdd({...f,avatar:initials(f.name),id:uid(),createdAt:now()});onClose();}}}/><Btn label="Cancel" variant="s" onClick={onClose}/></div>
  </Modal>);
};
const AddTaskModal = ({ onClose, onAdd, workers, projects, sheets, defaultWorkerId }) => {
  const [f,setF]=useState({title:"",description:"",workerId:defaultWorkerId||workers[0]?.id||"",projectId:"",sheetId:"",status:"Pending",deadline:""}); const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const [projConfirmed, setProjConfirmed] = useState(false);
  const projSheets=sheets.filter(s=>s.projectId===f.projectId);
  const selectedProj = projects.find(p=>p.id===f.projectId);
  return (<Modal title="Add Task" onClose={onClose} wide>
    <Field label="Task Title"><input className="f-in" value={f.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Update keyword targets"/></Field>
    <Field label="Description"><textarea className="f-area" value={f.description} onChange={e=>set("description",e.target.value)} placeholder="Task details & requirements..."/></Field>
    <Field label="Assign To"><select className="f-in" value={f.workerId} onChange={e=>set("workerId",e.target.value)}>{workers.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}</select></Field>
    <Field label="Project (optional — worker will see project name)">
      <select className="f-in" value={f.projectId} onChange={e=>{set("projectId",e.target.value);set("sheetId","");setProjConfirmed(false);}}>
        <option value="">— No Project (keeps data hidden) —</option>
        {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
    </Field>
    {f.projectId && !projConfirmed && (
      <div style={{ background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.22)", borderRadius:9, padding:"11px 13px", marginBottom:12 }}>
        <div style={{ fontSize:12, fontWeight:600, color:"#fbbf24", marginBottom:5 }}>⚠️ Heads up!</div>
        <div style={{ fontSize:12, color:"#a8904a", marginBottom:10, lineHeight:1.5 }}>
          The worker will see <strong style={{ color:"#fbbf24" }}>{selectedProj?.name}</strong> as the linked project. Confirm to proceed.
        </div>
        <div style={{ display:"flex", gap:7 }}>
          <Btn label="Yes, link project" variant="s" small onClick={()=>setProjConfirmed(true)}/>
          <Btn label="Remove project" variant="d" small onClick={()=>{set("projectId","");set("sheetId","");setProjConfirmed(false);}}/>
        </div>
      </div>
    )}
    {f.projectId && projConfirmed && (
      <Field label="Related Sheet (optional)"><select className="f-in" value={f.sheetId} onChange={e=>set("sheetId",e.target.value)}><option value="">— None —</option>{projSheets.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
    )}
    <Field label="Deadline (optional)"><input className="f-in" type="date" value={f.deadline} onChange={e=>set("deadline",e.target.value)}/></Field>
    <Field label="Initial Status"><select className="f-in" value={f.status} onChange={e=>set("status",e.target.value)}>{["Pending","In Progress","Done"].map(s=><option key={s}>{s}</option>)}</select></Field>
    <div style={{ display:"flex", gap:7 }}><Btn label="Create Task" icon={Plus} onClick={()=>{if(f.title&&f.workerId){onAdd({...f,id:uid(),deadline:f.deadline?new Date(f.deadline).getTime():null,createdAt:now()});onClose();}}}/><Btn label="Cancel" variant="s" onClick={onClose}/></div>
  </Modal>);
};

// ─── MANAGE TYPES MODAL ──────────────────────────────────────────────────────
const ManageTypesModal = ({ onClose, sheetTypes, onAdd, onDelete, onEdit }) => {
  const [name,setName]=useState(""); const [color,setColor]=useState("#7c5ff5");
  const [editId,setEditId]=useState(null); const [eName,setEName]=useState(""); const [eColor,setEColor]=useState("");
  return (<Modal title="Sheet Types" onClose={onClose} wide>
    <div style={{ marginBottom:14, maxHeight:250, overflowY:"auto" }}>
      {sheetTypes.map(t=>(
        <div key={t.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 3px", borderBottom:"1px solid #0f0f18" }}>
          {editId===t.id ? (<>
            <input type="color" value={eColor} onChange={e=>setEColor(e.target.value)} style={{ width:28,height:28,borderRadius:5,border:"1px solid #1e1e2c",cursor:"pointer",padding:2 }}/>
            <input className="f-in" value={eName} onChange={e=>setEName(e.target.value)} style={{ flex:1 }}/>
            <Btn label="Save" icon={Save} small onClick={()=>{onEdit(t.id,{name:eName,color:eColor});setEditId(null);}}/>
            <Btn label="×" variant="s" small onClick={()=>setEditId(null)}/>
          </>) : (<>
            <div style={{ width:9,height:9,borderRadius:"50%",background:t.color,flexShrink:0 }}/>
            <span style={{ flex:1,fontSize:13,color:"#e2e2f0",fontFamily:"'Outfit',sans-serif" }}>{t.name}</span>
            <span style={{ fontSize:10,color:"#333344",fontFamily:"monospace" }}>{t.color}</span>
            <IconBtn icon={Edit3} onClick={()=>{setEditId(t.id);setEName(t.name);setEColor(t.color);}} title="Edit"/>
            <IconBtn icon={Trash2} onClick={()=>onDelete(t.id)} title="Delete" hoverColor="#f87171"/>
          </>)}
        </div>
      ))}
    </div>
    <div style={{ background:"#0a0a12",border:"1px solid #1c1c2a",borderRadius:9,padding:11,marginBottom:13 }}>
      <div style={{ fontSize:10,color:"#7777a0",marginBottom:8,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase" }}>New Type</div>
      <div style={{ display:"flex",gap:7 }}>
        <input className="f-in" value={name} onChange={e=>setName(e.target.value)} placeholder="Type name" style={{ flex:1 }}/>
        <input type="color" value={color} onChange={e=>setColor(e.target.value)} style={{ width:36,height:36,borderRadius:6,border:"1px solid #1e1e2c",cursor:"pointer",padding:2 }}/>
        <Btn label="Add" icon={Plus} small onClick={()=>{if(name){onAdd({id:uid(),name,color});setName("");}}}/>
      </div>
    </div>
    <Btn label="Done" variant="s" onClick={onClose}/>
  </Modal>);
};

// ─── SETTINGS MODAL ──────────────────────────────────────────────────────────
const SettingsModal = ({ data, onClose, onSaveAdmin, onSaveWorkerCreds, onSaveIntegrations }) => {
  const [tab,setTab]=useState("admin");
  const [aEmail,setAEmail]=useState(data.adminCreds.email); const [aPw,setAPw]=useState(data.adminCreds.password);
  const [wEdits,setWEdits]=useState(data.workers.reduce((a,w)=>({...a,[w.id]:{name:w.name,role:w.role,password:w.password||""}}),{}));
  const intg = data.integrations||{supabase:{url:"",anonKey:"",connected:false},github:{token:"",repo:"",owner:"",connected:false}};
  const [sb,setSb]=useState({url:intg.supabase?.url||"",anonKey:intg.supabase?.anonKey||""});
  const [gh,setGh]=useState({token:intg.github?.token||"",repo:intg.github?.repo||"",owner:intg.github?.owner||""});
  return (<Modal title="⚙️ Settings" onClose={onClose} wide>
    <Tabs tabs={[{label:"Admin",value:"admin"},{label:"Workers",value:"workers"},{label:"Integrations",value:"integrations"}]} active={tab} onChange={setTab}/>
    {tab==="admin" && (<>
      <Field label="Admin Email / Username"><input className="f-in" value={aEmail} onChange={e=>setAEmail(e.target.value)}/></Field>
      <Field label="Admin Password"><input className="f-in" value={aPw} onChange={e=>setAPw(e.target.value)}/></Field>
      <div style={{ display:"flex",gap:7 }}><Btn label="Save" icon={Save} onClick={()=>{onSaveAdmin({email:aEmail,password:aPw});onClose();}}/><Btn label="Cancel" variant="s" onClick={onClose}/></div>
    </>)}
    {tab==="workers" && (<>
      <div style={{ display:"flex",flexDirection:"column",gap:9,maxHeight:320,overflowY:"auto" }}>
        {data.workers.map(w=>(
          <div key={w.id} style={{ background:"#0a0a12",border:"1px solid #1c1c2a",borderRadius:9,padding:"11px 12px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:9 }}>
              <Av text={w.avatar} color="#00c896" size={26}/><div style={{ fontSize:13,fontWeight:600,color:"#e2e2f0" }}>{w.name}</div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
              <Field label="Name"><input className="f-in" value={wEdits[w.id]?.name||""} onChange={e=>setWEdits(p=>({...p,[w.id]:{...p[w.id],name:e.target.value}}))}/></Field>
              <Field label="Role"><input className="f-in" value={wEdits[w.id]?.role||""} onChange={e=>setWEdits(p=>({...p,[w.id]:{...p[w.id],role:e.target.value}}))}/></Field>
            </div>
            <Field label="Password"><input className="f-in" value={wEdits[w.id]?.password||""} onChange={e=>setWEdits(p=>({...p,[w.id]:{...p[w.id],password:e.target.value}}))}/></Field>
          </div>
        ))}
      </div>
      <div style={{ display:"flex",gap:7,marginTop:13 }}><Btn label="Save All" icon={Save} onClick={()=>{onSaveWorkerCreds(wEdits);onClose();}}/><Btn label="Cancel" variant="s" onClick={onClose}/></div>
    </>)}
    {tab==="integrations" && (<>
      {/* Supabase */}
      <div style={{ background:"#0a0a12",border:"1px solid rgba(0,200,150,0.18)",borderRadius:10,padding:"14px 15px",marginBottom:14 }}>
        <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:12 }}>
          <div style={{ width:28,height:28,borderRadius:7,background:"rgba(0,200,150,0.1)",border:"1px solid rgba(0,200,150,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14 }}>🗄️</div>
          <div>
            <div style={{ fontSize:13,fontWeight:700,color:"#00c896",fontFamily:"'Syne',sans-serif" }}>Supabase</div>
            <div style={{ fontSize:10,color:"#555568" }}>Database + Auth backend</div>
          </div>
          {intg.supabase?.connected && <Badge label="Connected" style={{ ...stStyle("Done"),fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:99,marginLeft:"auto" }}/>}
        </div>
        <Field label="Supabase Project URL"><input className="f-in" value={sb.url} onChange={e=>setSb(p=>({...p,url:e.target.value}))} placeholder="https://xxxx.supabase.co"/></Field>
        <Field label="Anon / Public Key"><input className="f-in" value={sb.anonKey} onChange={e=>setSb(p=>({...p,anonKey:e.target.value}))} placeholder="eyJhbG..."/></Field>
        <div style={{ fontSize:11,color:"#555568",marginBottom:10,lineHeight:1.6 }}>
          Once connected, Arpus-Ultron data can be synced to Supabase tables. Get credentials from your Supabase project → Settings → API.
        </div>
        <Btn label="Save Supabase Config" icon={Save} small onClick={()=>onSaveIntegrations({supabase:{...sb,connected:!!(sb.url&&sb.anonKey)}})}/>
      </div>
      {/* GitHub */}
      <div style={{ background:"#0a0a12",border:"1px solid rgba(124,95,245,0.18)",borderRadius:10,padding:"14px 15px",marginBottom:14 }}>
        <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:12 }}>
          <div style={{ width:28,height:28,borderRadius:7,background:"rgba(124,95,245,0.1)",border:"1px solid rgba(124,95,245,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14 }}>🐙</div>
          <div>
            <div style={{ fontSize:13,fontWeight:700,color:"#9d87fa",fontFamily:"'Syne',sans-serif" }}>GitHub</div>
            <div style={{ fontSize:10,color:"#555568" }}>Repo integration for issue tracking</div>
          </div>
          {intg.github?.connected && <Badge label="Connected" style={{ ...stStyle("Done"),fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:99,marginLeft:"auto" }}/>}
        </div>
        <Field label="Personal Access Token"><input className="f-in" value={gh.token} onChange={e=>setGh(p=>({...p,token:e.target.value}))} placeholder="ghp_xxxxxxxxxxxx"/></Field>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
          <Field label="Owner / Org"><input className="f-in" value={gh.owner} onChange={e=>setGh(p=>({...p,owner:e.target.value}))} placeholder="your-username"/></Field>
          <Field label="Repository"><input className="f-in" value={gh.repo} onChange={e=>setGh(p=>({...p,repo:e.target.value}))} placeholder="repo-name"/></Field>
        </div>
        <div style={{ fontSize:11,color:"#555568",marginBottom:10,lineHeight:1.6 }}>
          Connect your GitHub repo to link tasks with issues. Generate a token at GitHub → Settings → Developer Settings → Personal Access Tokens.
        </div>
        <Btn label="Save GitHub Config" icon={Save} small onClick={()=>onSaveIntegrations({github:{...gh,connected:!!(gh.token&&gh.repo&&gh.owner)}})}/>
      </div>
      {/* Integration status summary */}
      <div style={{ background:"#0c0c14",border:"1px solid #181826",borderRadius:9,padding:"11px 14px" }}>
        <div style={{ fontSize:10,color:"#555568",marginBottom:8,fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase" }}>Integration Notes</div>
        <div style={{ fontSize:11,color:"#7777a0",lineHeight:1.7 }}>
          • Supabase: Save your data permanently — clients, tasks, sheets all synced<br/>
          • GitHub: Link tasks to GitHub issues, track code changes alongside business tasks<br/>
          • These credentials are stored locally in this session only<br/>
          • Full backend sync requires deploying Arpus-Ultron with server-side code
        </div>
      </div>
    </>)}
  </Modal>);
};

// ─── EDIT MODALS ─────────────────────────────────────────────────────────────
const EditClientModal=({client,onClose,onSave})=>{ const [f,setF]=useState({name:client.name,email:client.email,industry:client.industry}); const set=(k,v)=>setF(p=>({...p,[k]:v})); return (<Modal title="Edit Client" onClose={onClose}><Field label="Company Name"><input className="f-in" value={f.name} onChange={e=>set("name",e.target.value)}/></Field><Field label="Email"><input className="f-in" value={f.email} onChange={e=>set("email",e.target.value)}/></Field><Field label="Industry"><input className="f-in" value={f.industry} onChange={e=>set("industry",e.target.value)}/></Field><div style={{ display:"flex",gap:7 }}><Btn label="Save" icon={Save} onClick={()=>{onSave({...client,...f});onClose();}}/><Btn label="Cancel" variant="s" onClick={onClose}/></div></Modal>); };
const EditAccountModal=({account,clients,onClose,onSave})=>{ const [f,setF]=useState({name:account.name,platform:account.platform,clientId:account.clientId,status:account.status||"Active"}); const set=(k,v)=>setF(p=>({...p,[k]:v})); return (<Modal title="Edit Account" onClose={onClose}><Field label="Client"><select className="f-in" value={f.clientId} onChange={e=>set("clientId",e.target.value)}>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field><Field label="Account Name"><input className="f-in" value={f.name} onChange={e=>set("name",e.target.value)}/></Field><Field label="Platform"><input className="f-in" value={f.platform} onChange={e=>set("platform",e.target.value)}/></Field><Field label="Status"><select className="f-in" value={f.status} onChange={e=>set("status",e.target.value)}>{ACCOUNT_STATUSES.map(s=><option key={s}>{s}</option>)}</select></Field><div style={{ display:"flex",gap:7 }}><Btn label="Save" icon={Save} onClick={()=>{onSave({...account,...f});onClose();}}/><Btn label="Cancel" variant="s" onClick={onClose}/></div></Modal>); };
const EditProjectModal=({project,accounts,onClose,onSave})=>{ const [f,setF]=useState({name:project.name,status:project.status,accountId:project.accountId}); const set=(k,v)=>setF(p=>({...p,[k]:v})); return (<Modal title="Edit Project" onClose={onClose}><Field label="Account"><select className="f-in" value={f.accountId} onChange={e=>set("accountId",e.target.value)}>{accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></Field><Field label="Project Name"><input className="f-in" value={f.name} onChange={e=>set("name",e.target.value)}/></Field><Field label="Status"><select className="f-in" value={f.status} onChange={e=>set("status",e.target.value)}>{["Pending","In Progress","Done"].map(s=><option key={s}>{s}</option>)}</select></Field><div style={{ display:"flex",gap:7 }}><Btn label="Save" icon={Save} onClick={()=>{onSave({...project,...f});onClose();}}/><Btn label="Cancel" variant="s" onClick={onClose}/></div></Modal>); };
const EditSheetModal=({sheet,projects,workers,sheetTypes,onClose,onSave})=>{ const [f,setF]=useState({name:sheet.name,url:sheet.url,typeId:sheet.typeId,projectId:sheet.projectId,workerIds:sheet.workerIds||[],priority:sheet.priority}); const set=(k,v)=>setF(p=>({...p,[k]:v})); return (<Modal title="Edit Sheet" onClose={onClose} wide><Field label="Sheet Name"><input className="f-in" value={f.name} onChange={e=>set("name",e.target.value)}/></Field><Field label="URL"><input className="f-in" value={f.url} onChange={e=>set("url",e.target.value)}/></Field><Field label="Project"><select className="f-in" value={f.projectId} onChange={e=>set("projectId",e.target.value)}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></Field><div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}><Field label="Type"><select className="f-in" value={f.typeId} onChange={e=>set("typeId",e.target.value)}>{sheetTypes.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></Field><Field label="Priority"><select className="f-in" value={f.priority} onChange={e=>set("priority",e.target.value)}>{["Low","Medium","High"].map(p=><option key={p}>{p}</option>)}</select></Field></div><div style={{ display:"flex",gap:7 }}><Btn label="Save" icon={Save} onClick={()=>{onSave({...sheet,...f});onClose();}}/><Btn label="Cancel" variant="s" onClick={onClose}/></div></Modal>); };
const EditWorkerModal=({worker,onClose,onSave})=>{ const [f,setF]=useState({name:worker.name,role:worker.role,password:worker.password||""}); const set=(k,v)=>setF(p=>({...p,[k]:v})); return (<Modal title="Edit Worker" onClose={onClose}><Field label="Name"><input className="f-in" value={f.name} onChange={e=>set("name",e.target.value)}/></Field><Field label="Role"><input className="f-in" value={f.role} onChange={e=>set("role",e.target.value)}/></Field><Field label="Password"><input className="f-in" value={f.password} onChange={e=>set("password",e.target.value)}/></Field><div style={{ display:"flex",gap:7 }}><Btn label="Save" icon={Save} onClick={()=>{onSave({...worker,...f,avatar:initials(f.name)});onClose();}}/><Btn label="Cancel" variant="s" onClick={onClose}/></div></Modal>); };
const EditTaskModal=({task,workers,projects,sheets,onClose,onSave})=>{ const [f,setF]=useState({title:task.title,description:task.description||"",workerId:task.workerId,projectId:task.projectId,sheetId:task.sheetId||"",status:task.status,deadline:task.deadline?new Date(task.deadline).toISOString().split("T")[0]:""}); const set=(k,v)=>setF(p=>({...p,[k]:v})); const ps=sheets.filter(s=>s.projectId===f.projectId); return (<Modal title="Edit Task" onClose={onClose} wide><Field label="Title"><input className="f-in" value={f.title} onChange={e=>set("title",e.target.value)}/></Field><Field label="Description"><textarea className="f-area" value={f.description} onChange={e=>set("description",e.target.value)}/></Field><Field label="Assign To"><select className="f-in" value={f.workerId} onChange={e=>set("workerId",e.target.value)}>{workers.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}</select></Field><Field label="Project"><select className="f-in" value={f.projectId} onChange={e=>{set("projectId",e.target.value);set("sheetId","");}}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></Field><Field label="Sheet (optional)"><select className="f-in" value={f.sheetId} onChange={e=>set("sheetId",e.target.value)}><option value="">— None —</option>{ps.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></Field><Field label="Status"><select className="f-in" value={f.status} onChange={e=>set("status",e.target.value)}>{["Pending","In Progress","Done"].map(s=><option key={s}>{s}</option>)}</select></Field><Field label="Deadline"><input className="f-in" type="date" value={f.deadline} onChange={e=>set("deadline",e.target.value)}/></Field><div style={{ display:"flex",gap:7 }}><Btn label="Save" icon={Save} onClick={()=>{onSave({...task,...f,deadline:f.deadline?new Date(f.deadline).getTime():null});onClose();}}/><Btn label="Cancel" variant="s" onClick={onClose}/></div></Modal>); };

// ─── TASK DETAIL MODAL ───────────────────────────────────────────────────────
const TaskDetailModal = ({ task, data, onClose, onUpdateStatus, onDelete, onEdit, isWorker, currentWorkerId, onSendRequest }) => {
  const { projects, sheets, workers } = data;
  const liveTask = data.tasks.find(t=>t.id===task.id)||task;
  const proj = projects.find(p=>p.id===liveTask.projectId);
  const sh = sheets.find(s=>s.id===liveTask.sheetId);
  const worker = workers.find(w=>w.id===liveTask.workerId);
  const [showReqForm, setShowReqForm] = useState(false);
  const [reqReason, setReqReason] = useState("");
  const [reqStatus, setReqStatus] = useState("Pending");
  const [confirmStatus, setConfirmStatus] = useState(null);
  const [requestSent, setRequestSent] = useState(false); // {status}

  const statusOrder = ["Pending","In Progress","Done"];
  const curIdx = statusOrder.indexOf(liveTask.status);

  const handleWorkerStatusClick = (s) => {
    if (!isWorker) { onUpdateStatus(liveTask.id, s, liveTask.workerId); return; }
    const nextIdx = statusOrder.indexOf(s);
    const isForwardOne = nextIdx === curIdx + 1;
    // Pending→InProgress: free, no confirm
    if (isForwardOne && liveTask.status === "Pending" && s === "In Progress") {
      onUpdateStatus(liveTask.id, s, liveTask.workerId);
      return;
    }
    // InProgress→Done: confirm (irreversible)
    if (isForwardOne) { setConfirmStatus(s); return; }
    // reverse or skip: request only
    if (nextIdx <= curIdx) { setShowReqForm(true); return; }
  };

  const fmtDeadline = (ts) => {
    if (!ts) return null;
    const d = new Date(ts);
    const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <Modal title="Task Detail" onClose={onClose} wide>
      {confirmStatus && (
        <div style={{ background:"rgba(96,165,250,0.06)", border:"1px solid rgba(96,165,250,0.2)", borderRadius:10, padding:"14px 16px", marginBottom:16 }}>
          <div style={{ fontSize:13, fontWeight:600, color:"#e2e2f0", marginBottom:6 }}>Confirm Status Change</div>
          <div style={{ fontSize:12, color:"#b0b0cc", marginBottom:12 }}>
            Once changed to <strong style={{ color:"#60a5fa" }}>{confirmStatus}</strong>, you cannot reverse this without requesting admin approval.
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn label="Confirm Change" variant="green" small onClick={()=>{onUpdateStatus(liveTask.id,confirmStatus,liveTask.workerId);setConfirmStatus(null);}}/>
            <Btn label="Cancel" variant="s" small onClick={()=>setConfirmStatus(null)}/>
          </div>
        </div>
      )}

      {/* Title + status */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <h2 style={{ fontSize:16, fontWeight:700, color:"#e4e4f4", fontFamily:"'Syne',sans-serif", flex:1, marginRight:12, lineHeight:1.3 }}>{liveTask.title}</h2>
        <Badge label={liveTask.status} style={{ ...stStyle(liveTask.status), fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:99, flexShrink:0 }}/>
      </div>

      <Divider label="Details"/>

      {/* Description */}
      {liveTask.description && (
        <div style={{ background:"#0a0a12", border:"1px solid #181826", borderRadius:9, padding:"10px 13px", fontSize:13, color:"#b0b0cc", lineHeight:1.65, marginBottom:12 }}>{liveTask.description}</div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
        {!isWorker && proj && <div style={{ background:"#0a0a12", border:"1px solid #181826", borderRadius:8, padding:"8px 11px" }}><div style={{ fontSize:9, color:"#555568", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:3 }}>Project</div><div style={{ fontSize:12, color:"#b0b0cc" }}>{proj.name}</div></div>}
        {worker && <div style={{ background:"#0a0a12", border:"1px solid #181826", borderRadius:8, padding:"8px 11px" }}><div style={{ fontSize:9, color:"#555568", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:3 }}>Assigned To</div><div style={{ fontSize:12, color:"#00c896" }}>{worker.name}</div></div>}
        {liveTask.deadline && <div style={{ background:"rgba(248,113,113,0.04)", border:"1px solid rgba(248,113,113,0.12)", borderRadius:8, padding:"8px 11px" }}><div style={{ fontSize:9, color:"#555568", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:3 }}>Deadline</div><div style={{ fontSize:12, color:"#f87171" }}>{fmtDeadline(liveTask.deadline)}</div></div>}
        {sh && <div style={{ background:"#0a0a12", border:"1px solid #181826", borderRadius:8, padding:"8px 11px" }}><div style={{ fontSize:9, color:"#555568", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:3 }}>Linked Sheet</div><a href={sh.url} target="_blank" rel="noreferrer" style={{ fontSize:12, color:"#7ab8ff", textDecoration:"none", display:"flex", alignItems:"center", gap:4 }}><Link2 size={11}/>{sh.name}</a></div>}
      </div>

      <div style={{ fontSize:10, color:"#4a4a62", marginBottom:14 }}>Created: {fmtTime(liveTask.createdAt)}</div>

      <Divider label="Status"/>

      {/* Worker: show current status + actions clearly */}
      {isWorker ? (
        <div style={{ marginBottom:14 }}>
          {/* Current status display */}
          <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:12 }}>
            <div style={{ fontSize:12, color:"#7777a0" }}>Current:</div>
            <Badge label={liveTask.status} style={{ ...stStyle(liveTask.status), fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:99 }}/>
          </div>

          {/* Pending → In Progress: one-click, free */}
          {liveTask.status==="Pending" && (
            <div style={{ background:"rgba(96,165,250,0.05)", border:"1px solid rgba(96,165,250,0.18)", borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
              <div style={{ fontSize:12, color:"#b0b0cc", marginBottom:9 }}>
                Ready to start? Mark this task as <strong style={{ color:"#60a5fa" }}>In Progress</strong>.
              </div>
              <Btn label="Start Task → In Progress" variant="green" small onClick={()=>onUpdateStatus(liveTask.id,"In Progress",liveTask.workerId)}/>
            </div>
          )}

          {/* In Progress → Done: must send request to admin */}
          {liveTask.status==="In Progress" && (
            <div style={{ background:"rgba(52,211,153,0.05)", border:"1px solid rgba(52,211,153,0.18)", borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
              <div style={{ fontSize:12, color:"#b0b0cc", marginBottom:4 }}>
                Task complete? Send a <strong style={{ color:"#34d399" }}>Done request</strong> to admin for approval.
              </div>
              <div style={{ fontSize:11, color:"#555568", marginBottom:9 }}>Admin will review and mark it Done.</div>
              {!showReqForm ? (
                <Btn label="Request Mark as Done" icon={Send} variant="green" small onClick={()=>{setShowReqForm(true);setReqStatus("Done");}}/>
              ) : (
                <div style={{ marginTop:8 }}>
                  <Field label="What did you complete?">
                    <textarea className="f-area" value={reqReason} onChange={e=>setReqReason(e.target.value)} placeholder="Brief summary of what was completed..." style={{ minHeight:55 }}/>
                  </Field>
                  <div style={{ display:"flex", gap:7 }}>
                    <Btn label="Send to Admin" icon={Send} small onClick={()=>{if(reqReason.trim()){onSendRequest(liveTask.id,"Done",reqReason);setShowReqForm(false);setReqReason("");setRequestSent(true);}}}/>
                    <Btn label="Cancel" variant="s" small onClick={()=>{setShowReqForm(false);setReqReason("");}}/>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Success message after request sent */}
          {requestSent && (
            <div style={{ background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.25)", borderRadius:10, padding:"12px 14px", marginBottom:10, display:"flex", alignItems:"center", gap:9 }}>
              <CheckCircle size={16} color="#34d399"/>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:"#34d399" }}>Request Sent!</div>
                <div style={{ fontSize:11, color:"#555568", marginTop:2 }}>Admin will review and mark it Done. You'll get a notification.</div>
              </div>
            </div>
          )}

          {/* Already done */}
          {liveTask.status==="Done" && (
            <div style={{ background:"rgba(52,211,153,0.05)", border:"1px solid rgba(52,211,153,0.18)", borderRadius:10, padding:"11px 14px" }}>
              <div style={{ fontSize:12, color:"#34d399" }}>✓ This task is complete.</div>
            </div>
          )}

          {/* Other status change requests */}
          {liveTask.status!=="Done" && (
            <button onClick={()=>setShowReqForm(s=>liveTask.status==="In Progress"?s:!s)} style={{ fontSize:11, color:"#7c5ff5", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:5, marginTop:4, opacity:liveTask.status==="In Progress"?0.4:1 }} disabled={liveTask.status==="In Progress"}>
              <Send size={11}/> Request other status change
            </button>
          )}
          {showReqForm && liveTask.status!=="In Progress" && (
            <div style={{ marginTop:9, background:"rgba(124,95,245,0.05)", border:"1px solid rgba(124,95,245,0.15)", borderRadius:9, padding:"11px 13px" }}>
              <Field label="Requested Status">
                <select className="f-in" value={reqStatus} onChange={e=>setReqStatus(e.target.value)}>
                  {["Pending","In Progress","Done"].filter(s=>s!==liveTask.status).map(s=><option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Reason">
                <textarea className="f-area" value={reqReason} onChange={e=>setReqReason(e.target.value)} placeholder="Why do you need this status change?" style={{ minHeight:55 }}/>
              </Field>
              <div style={{ display:"flex", gap:7 }}>
                <Btn label="Send Request" icon={Send} small onClick={()=>{if(reqReason.trim()){onSendRequest(liveTask.id,reqStatus,reqReason);setShowReqForm(false);setReqReason("");setRequestSent(true);}}}/>
                <Btn label="Cancel" variant="s" small onClick={()=>setShowReqForm(false)}/>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Admin: free status change buttons */
        <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:14 }}>
          {["Pending","In Progress","Done"].map(s=>(
            <button key={s} onClick={()=>onUpdateStatus(liveTask.id,s,liveTask.workerId)}
              style={{ padding:"5px 13px", borderRadius:8, border:"1px solid", cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"'Outfit',sans-serif", transition:"all 0.13s", ...(liveTask.status===s?stStyle(s):{background:"transparent",color:"#7777a0",borderColor:"#1e1e2c"}) }}>
              {s}
            </button>
          ))}
        </div>
      )}
      {!isWorker && (
        <div style={{ display:"flex", gap:7, marginTop:10 }}>
          <Btn label="Edit" icon={Edit3} variant="s" small onClick={()=>onEdit(liveTask)}/>
          <Btn label="Delete" icon={Trash2} variant="d" small onClick={()=>{onDelete(liveTask.id);onClose();}}/>
        </div>
      )}
    </Modal>
  );
};
const NotifPanel = ({ notifications, onClose, onClear, onViewAll }) => (
  <div className="notif-panel" style={{ position:"fixed", top:48, right:13, width:310, background:"#0e0e18", border:"1px solid #1e1e2c", borderRadius:13, zIndex:999, boxShadow:"0 20px 60px rgba(0,0,0,0.7)", maxHeight:420, overflow:"hidden", display:"flex", flexDirection:"column" }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 13px", borderBottom:"1px solid #111120" }}>
      <div style={{ fontSize:13, fontWeight:700, color:"#e2e2f0", fontFamily:"'Syne',sans-serif" }}>Notifications</div>
      <div style={{ display:"flex", gap:7, alignItems:"center" }}>
        <button onClick={()=>{onViewAll();onClose();}} style={{ fontSize:11, color:"#7c5ff5", background:"none", border:"none", cursor:"pointer" }}>View all</button>
        {notifications.length>0 && <button onClick={onClear} style={{ fontSize:11, color:"#7777a0", background:"none", border:"none", cursor:"pointer" }}>Clear</button>}
        <button onClick={onClose} style={{ background:"none", border:"none", color:"#7777a0", cursor:"pointer", display:"flex" }}><X size={14}/></button>
      </div>
    </div>
    <div style={{ overflowY:"auto", flex:1 }}>
      {notifications.length===0 ? (
        <div style={{ padding:"24px 14px", textAlign:"center", fontSize:12, color:"#555568" }}>No notifications yet</div>
      ) : (
        notifications.slice().reverse().slice(0,15).map(n=>(
          <div key={n.id} className="notif-item" style={{ padding:"10px 13px", borderBottom:"1px solid #0f0f18", background:n.read?"transparent":"rgba(124,95,245,0.04)" }}>
            <div style={{ fontSize:12, color:n.read?"#666680":"#d0d0e8", lineHeight:1.5 }}>{n.message}</div>
            <div style={{ fontSize:10, color:"#4a4a62", marginTop:3 }}>{timeAgo(n.timestamp)}</div>
          </div>
        ))
      )}
    </div>
  </div>
);

// ─── ALL ACCOUNTS VIEW ───────────────────────────────────────────────────────
const AllAccountsView = ({ data, navigate, openModal, onEdit, onDelete }) => {
  const { accounts, clients, projects, sheets } = data;
  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:"#e4e4f4", fontFamily:"'Syne',sans-serif" }}>All Accounts</h1>
          <p style={{ fontSize:12, color:"#666680", marginTop:3 }}>{accounts.length} accounts total</p>
        </div>
        <Btn label="Add Account" icon={Plus} onClick={()=>openModal("account",{})}/>
      </div>
      {accounts.length===0 ? <Empty icon={Building2} msg="No accounts yet"/> : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {accounts.map(acc=>{
            const client = clients.find(c=>c.id===acc.clientId);
            const accProjs = projects.filter(p=>p.accountId===acc.id);
            const accShs = sheets.filter(s=>accProjs.some(p=>p.id===s.projectId));
            return (
              <div key={acc.id} style={{ background:"#0c0c14", border:"1px solid #181826", borderRadius:11 }}>
                <div className="row-item" onClick={()=>navigate("account",{accountId:acc.id})} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", cursor:"pointer" }}>
                  <div style={{ width:38, height:38, borderRadius:9, background:"rgba(0,200,150,0.08)", border:"1px solid rgba(0,200,150,0.18)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Building2 size={16} color="#00c896"/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9, flexWrap:"wrap" }}>
                      <div style={{ fontSize:14, fontWeight:700, color:"#e2e2f0", fontFamily:"'Syne',sans-serif" }}>{acc.name}</div>
                      <span style={{ fontSize:12, fontWeight:600, color:"#7c5ff5", background:"rgba(124,95,245,0.1)", padding:"2px 9px", borderRadius:99, border:"1px solid rgba(124,95,245,0.2)" }}>{acc.platform}</span>
                      <Badge label={acc.status||"Active"} style={{ ...stStyle(acc.status||"Active"), fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:99 }}/>
                    </div>
                    {client && <div style={{ fontSize:11, color:"#7777a0", marginTop:3 }}>Client: <span style={{ color:"#9999bc" }}>{client.name}</span></div>}
                    <CreatedAt ts={acc.createdAt}/>
                  </div>
                  <div style={{ display:"flex", gap:14, fontSize:11, color:"#555568", flexShrink:0 }}>
                    <div><span style={{ color:"#f59e0b", fontWeight:700 }}>{accProjs.length}</span> projs</div>
                    <div><span style={{ color:"#3b82f6", fontWeight:700 }}>{accShs.length}</span> sheets</div>
                  </div>
                  <ChevronRight size={13} color="#222236"/>
                </div>
                <div style={{ display:"flex", gap:6, padding:"0 16px 10px" }}>
                  <IconBtn icon={Edit3} onClick={()=>onEdit("account",acc)} title="Edit"/>
                  <IconBtn icon={Trash2} onClick={()=>onDelete("account",acc.id)} title="Delete" color="#44445a" hoverColor="#f87171"/>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const Sidebar = ({ nav, navigate, data, globalTypeFilter, setGlobalTypeFilter, open, setOpen, isAdmin, currentUser }) => {
  const { clients, sheetTypes, sheets } = data;

  // For worker: only show sheet types from their assigned sheets
  const workerSheetTypeIds = !isAdmin && currentUser?.workerId
    ? [...new Set(sheets.filter(s=>(s.workerIds||[]).includes(currentUser.workerId)).map(s=>s.typeId).filter(Boolean))]
    : null;
  const visibleTypes = workerSheetTypeIds
    ? sheetTypes.filter(t=>workerSheetTypeIds.includes(t.id))
    : sheetTypes;

  const nb = (label, view, Icon) => (
    <button key={view} onClick={()=>{navigate(view);setOpen(false);setGlobalTypeFilter(null);}}
      className={`nav-lnk${nav.view===view&&!globalTypeFilter?" active":""}`}
      style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 15px", width:"100%", background:"none", border:"none", borderLeft:"2px solid transparent", cursor:"pointer", fontSize:13, fontWeight:500, color:"#7777a0", fontFamily:"'Outfit',sans-serif", textAlign:"left" }}>
      <Icon size={14}/>{label}
    </button>
  );
  return (
    <div className={`sidebar${open?" open":""}`} style={{ width:210, background:"#08080f", borderRight:"1px solid #111120", display:"flex", flexDirection:"column", height:"100vh", flexShrink:0 }}>
      <div style={{ padding:"15px 15px 11px", borderBottom:"1px solid #111120" }}>
        <div style={{ fontSize:17, fontWeight:800, color:"#eeeef8", fontFamily:"'Syne',sans-serif" }}>Arpus-<span style={{ color:"#7c5ff5" }}>Ultron</span></div>
        <div style={{ fontSize:9, color:"#222230", letterSpacing:"0.09em", textTransform:"uppercase", marginTop:2 }}>{isAdmin?"Admin Panel":"Worker Panel"}</div>
      </div>
      <div style={{ flex:1, overflowY:"auto", paddingTop:4 }}>
        <div style={{ padding:"7px 15px 2px", fontSize:9, color:"#1e1e2c", letterSpacing:"0.08em", fontWeight:700, textTransform:"uppercase" }}>Main</div>
        {nb("Dashboard","home",LayoutDashboard)}
        {isAdmin && nb("Clients","clients",Users)}
        {isAdmin && nb("All Accounts","all-accounts",Building2)}
        {isAdmin && nb("All Projects","all-projects",Folder)}
        {isAdmin && nb("All Sheets","all-sheets",FileSpreadsheet)}
        {nb("Workers","workers",UserCheck)}
        {isAdmin && (<>
          <div style={{ padding:"8px 15px 2px", fontSize:9, color:"#1e1e2c", letterSpacing:"0.08em", fontWeight:700, textTransform:"uppercase" }}>Workspace</div>
          {nb("Account Cases","account-cases",Building2)}
          {nb("Special Projects","special-projects",Folder)}
          {nb("My Task Log","admin-tasks",CheckSquare)}
        </>)}

        {isAdmin && clients.length>0 && (<>
          <div style={{ padding:"8px 15px 2px", fontSize:9, color:"#1e1e2c", letterSpacing:"0.08em", fontWeight:700, textTransform:"uppercase" }}>Clients</div>
          {clients.map(c=>(
            <button key={c.id} onClick={()=>{navigate("client",{clientId:c.id});setOpen(false);setGlobalTypeFilter(null);}}
              className={`nav-lnk${nav.clientId===c.id&&!globalTypeFilter?" active":""}`}
              style={{ display:"flex", alignItems:"center", gap:7, padding:"6px 15px 6px 24px", width:"100%", background:"none", border:"none", borderLeft:"2px solid transparent", cursor:"pointer", fontSize:12, color:"#555568", fontFamily:"'Outfit',sans-serif", textAlign:"left" }}>
              <div style={{ width:4,height:4,borderRadius:"50%",background:"#222232" }}/>{c.name}
            </button>
          ))}
        </>)}

        {/* Sheet Type Filter — worker only sees their own types */}
        {visibleTypes.length>0 && (<>
          <div style={{ padding:"8px 15px 2px", fontSize:9, color:"#1e1e2c", letterSpacing:"0.08em", fontWeight:700, textTransform:"uppercase" }}>Filter by Type</div>
          {visibleTypes.map(t=>(
            <button key={t.id} onClick={()=>{setGlobalTypeFilter(globalTypeFilter===t.id?null:t.id);setOpen(false);}}
              className={`nav-lnk${globalTypeFilter===t.id?" active":""}`}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 15px", width:"100%", background:globalTypeFilter===t.id?`${t.color}0d`:"none", border:"none", borderLeft:"2px solid transparent", cursor:"pointer", fontSize:12, color:globalTypeFilter===t.id?t.color:"#555568", fontFamily:"'Outfit',sans-serif", textAlign:"left" }}>
              <div style={{ width:7,height:7,borderRadius:"50%",background:t.color }}/>{t.name}
            </button>
          ))}
        </>)}
      </div>
      <div style={{ padding:"8px 15px", borderTop:"1px solid #0f0f1a", fontSize:10, color:"#1e1e28" }}>Arpus-Ultron v1</div>
    </div>
  );
};

// ─── BREADCRUMB ──────────────────────────────────────────────────────────────
const Breadcrumb = ({ trail }) => (
  <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#555568", flexWrap:"wrap" }}>
    {trail.map((item,i)=>(
      <span key={i} style={{ display:"flex", alignItems:"center", gap:4 }}>
        <span onClick={item.onClick} style={{ cursor:item.onClick?"pointer":"default", color:i===trail.length-1?"#7a7a94":"#33334a", fontWeight:i===trail.length-1?600:400 }}
          onMouseEnter={e=>{if(item.onClick)e.target.style.color="#9d87fa";}} onMouseLeave={e=>{if(item.onClick)e.target.style.color=i===trail.length-1?"#7a7a94":"#33334a";}}>
          {item.label}
        </span>
        {i<trail.length-1 && <ChevronRight size={10} color="#1e1e2c"/>}
      </span>
    ))}
  </div>
);

// ─── ADMIN TASK LOG ───────────────────────────────────────────────────────────
const AdminTaskLog = ({ data, setData }) => {
  const { adminTasks } = data;
  const [open, setOpen] = useState(null); // expanded task id
  const [addOpen, setAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [noteInputs, setNoteInputs] = useState({});
  const [noteStatusInputs, setNoteStatusInputs] = useState({});
  const [confirmDel, setConfirmDel] = useState(null);

  const addAdminTask = () => {
    if (!newTitle.trim()) return;
    const task = { id:uid(), title:newTitle.trim(), status:"Pending", log:[{ id:uid(), status:"Pending", note:"Task created", ts:now() }], createdAt:now() };
    setData(d=>({...d, adminTasks:[...d.adminTasks, task]}));
    setNewTitle(""); setAddOpen(false);
  };
  const addLogEntry = (taskId) => {
    const note = noteInputs[taskId]||""; const status = noteStatusInputs[taskId]||"Pending";
    if (!note.trim()) return;
    const entry = { id:uid(), status, note:note.trim(), ts:now() };
    setData(d=>({ ...d, adminTasks: d.adminTasks.map(t=>{
      if(t.id!==taskId) return t;
      return {...t, status, log:[...t.log, entry]};
    })}));
    setNoteInputs(p=>({...p,[taskId]:""}));
  };
  const deleteAdminTask = (id) => setData(d=>({...d, adminTasks:d.adminTasks.filter(t=>t.id!==id)}));

  return (
    <div style={{ background:"#0c0c14", border:"1px solid rgba(124,95,245,0.2)", borderRadius:13, overflow:"hidden", marginBottom:22 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 16px", borderBottom:"1px solid #111120", background:"rgba(124,95,245,0.04)" }}>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:"#c4b5fd", fontFamily:"'Syne',sans-serif" }}>🗂️ My Task Log</div>
          <div style={{ fontSize:10, color:"#555568", marginTop:2 }}>Admin personal tasks with history chain</div>
        </div>
        <Btn label="Add Task" icon={Plus} small onClick={()=>setAddOpen(p=>!p)}/>
      </div>
      {addOpen && (
        <div style={{ padding:"12px 16px", borderBottom:"1px solid #111120", background:"#0a0a12" }}>
          <div style={{ display:"flex", gap:7 }}>
            <input className="f-in" value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Task title..." style={{ flex:1 }} onKeyDown={e=>e.key==="Enter"&&addAdminTask()}/>
            <Btn label="Create" icon={Plus} small onClick={addAdminTask}/>
            <Btn label="×" variant="s" small onClick={()=>setAddOpen(false)}/>
          </div>
        </div>
      )}
      <div style={{ maxHeight:360, overflowY:"auto" }}>
        {adminTasks.length===0 ? <Empty icon={CheckSquare} msg="No admin tasks yet — add one above"/> : (
          adminTasks.map(task=>(
            <div key={task.id} style={{ borderBottom:"1px solid #0f0f18" }}>
              {/* Task header row */}
              <div className="row-item" onClick={()=>setOpen(open===task.id?null:task.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 16px", cursor:"pointer" }}>
                <div style={{ width:7,height:7,borderRadius:"50%",background:task.status==="Done"?"#34d399":task.status==="In Progress"?"#60a5fa":"#fbbf24",flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#e2e2f0" }}>{task.title}</div>
                  <div style={{ fontSize:10, color:"#4a4a62", marginTop:1 }}>
                    {task.log.length} update{task.log.length!==1?"s":""}  · Last: {fmtTime(task.log[task.log.length-1]?.ts)}
                  </div>
                </div>
                <Badge label={task.status} style={{ ...stStyle(task.status), fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:99 }}/>
                <IconBtn icon={Trash2} onClick={e=>{e.stopPropagation();setConfirmDel({id:task.id,title:task.title});}} title="Delete" color="#7777a0" hoverColor="#f87171"/>
                <ChevronRight size={12} color="#33334a" style={{ transform:open===task.id?"rotate(90deg)":"none", transition:"transform 0.13s" }}/>
              </div>
              {/* Expanded: chain log */}
              {open===task.id && (
                <div style={{ padding:"0 16px 14px 16px", background:"#0a0a12" }}>
                  {/* Timeline chain */}
                  <div style={{ position:"relative", paddingLeft:16, marginBottom:12 }}>
                    <div style={{ position:"absolute", left:3, top:4, bottom:0, width:1, background:"#1e1e2c" }}/>
                    {task.log.map((entry,i)=>(
                      <div key={entry.id} style={{ position:"relative", paddingBottom:10 }}>
                        <div style={{ position:"absolute", left:-13, top:4, width:7, height:7, borderRadius:"50%", background:entry.status==="Done"?"#34d399":entry.status==="In Progress"?"#60a5fa":"#fbbf24", border:"2px solid #0a0a12" }}/>
                        <div style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:12, color:"#c0c0dc", lineHeight:1.4 }}>{entry.note}</div>
                            <div style={{ fontSize:10, color:"#4a4a62", marginTop:2 }}>{fmtTime(entry.ts)}</div>
                          </div>
                          <Badge label={entry.status} style={{ ...stStyle(entry.status), fontSize:9, fontWeight:600, padding:"1px 6px", borderRadius:99, flexShrink:0 }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Add new log entry */}
                  <div style={{ background:"#0c0c14", border:"1px solid #181826", borderRadius:8, padding:"10px 11px" }}>
                    <div style={{ fontSize:10, color:"#555568", marginBottom:7, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>Add Update</div>
                    <textarea className="f-area" value={noteInputs[task.id]||""} onChange={e=>setNoteInputs(p=>({...p,[task.id]:e.target.value}))} placeholder="What happened..." style={{ minHeight:52, marginBottom:7 }}/>
                    <div style={{ display:"flex", gap:7 }}>
                      <select className="f-in" value={noteStatusInputs[task.id]||task.status} onChange={e=>setNoteStatusInputs(p=>({...p,[task.id]:e.target.value}))} style={{ flex:1, fontSize:12 }}>
                        {["Pending","In Progress","Done"].map(s=><option key={s}>{s}</option>)}
                      </select>
                      <Btn label="Add Update" icon={Plus} small onClick={()=>addLogEntry(task.id)}/>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {confirmDel && <ConfirmModal message={`Delete task "${confirmDel.title}"?`} onConfirm={()=>deleteAdminTask(confirmDel.id)} onClose={()=>setConfirmDel(null)}/>}
    </div>
  );
};

// ─── SPECIAL PROJECTS BOX ─────────────────────────────────────────────────────
const SpecialProjectsBox = ({ data, setData }) => {
  const { specialProjects=[] } = data;
  const [addOpen, setAddOpen] = useState(false);
  const [f, setF] = useState({name:"",status:"Pending"});
  const [expandId, setExpandId] = useState(null);
  const [expandTab, setExpandTab] = useState({}); // {projId: "log"|"sheets"}
  const [editId, setEditId] = useState(null);
  const [editF, setEditF] = useState({name:"",status:"Pending"});
  const [confirmDel, setConfirmDel] = useState(null);
  const [logInputs, setLogInputs] = useState({});
  const [logStatusInputs, setLogStatusInputs] = useState({});

  const add = () => {
    if(!f.name.trim()) return;
    setData(d=>({...d, specialProjects:[...d.specialProjects,{id:uid(),name:f.name.trim(),status:f.status,notes:"",sheets:[],log:[{id:uid(),status:f.status,note:"Project created",ts:now()}],createdAt:now()}]}));
    setF({name:"",status:"Pending"}); setAddOpen(false);
  };
  const del = (id) => setData(d=>({...d, specialProjects:d.specialProjects.filter(p=>p.id!==id)}));
  const upd = (id,u) => setData(d=>({...d, specialProjects:d.specialProjects.map(p=>p.id===id?{...p,...u}:p)}));
  const addLog = (projId) => {
    const note=logInputs[projId]||""; const status=logStatusInputs[projId]||"Pending";
    if(!note.trim()) return;
    const entry={id:uid(),status,note:note.trim(),ts:now()};
    setData(d=>({...d,specialProjects:d.specialProjects.map(p=>p.id!==projId?p:{...p,status,log:[...(p.log||[]),entry]})}));
    setLogInputs(x=>({...x,[projId]:""}));
  };
  const getTab=(id)=>expandTab[id]||"log";
  const setTab=(id,t)=>setExpandTab(x=>({...x,[id]:t}));

  return (
    <div style={{ background:"#0c0c14", border:"1px solid rgba(245,158,11,0.2)", borderRadius:13, overflow:"hidden", marginBottom:22 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 16px", borderBottom:"1px solid #111120", background:"rgba(245,158,11,0.03)" }}>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:"#fbbf24", fontFamily:"'Syne',sans-serif" }}>⭐ Special Projects</div>
          <div style={{ fontSize:10, color:"#555568", marginTop:2 }}>Standalone — not tied to any account · Full blockchain log</div>
        </div>
        <Btn label="Add" icon={Plus} small onClick={()=>setAddOpen(p=>!p)}/>
      </div>
      {addOpen && (
        <div style={{ padding:"11px 16px", borderBottom:"1px solid #111120", background:"#0a0a12" }}>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
            <input className="f-in" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))} placeholder="Project name..." style={{ flex:1, minWidth:140 }} onKeyDown={e=>e.key==="Enter"&&add()}/>
            <select className="f-in" value={f.status} onChange={e=>setF(p=>({...p,status:e.target.value}))} style={{ width:130, flex:"none" }}>{["Pending","In Progress","Done"].map(s=><option key={s}>{s}</option>)}</select>
            <Btn label="Create" icon={Plus} small onClick={add}/>
          </div>
        </div>
      )}
      {specialProjects.length===0 ? <Empty icon={Folder} msg="No special projects yet — create one"/> : (
        <div style={{ maxHeight:500, overflowY:"auto" }}>
          {specialProjects.map(p=>{
            const spSheets=p.sheets||[]; const spLog=p.log||[];
            const isExpanded=expandId===p.id; const tab=getTab(p.id);
            return (
              <div key={p.id} style={{ borderBottom:"1px solid #0f0f18" }}>
                {/* Header row */}
                <div className="row-item" onClick={()=>setExpandId(isExpanded?null:p.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 16px", cursor:"pointer" }}>
                  <div style={{ width:7,height:7,borderRadius:"50%",background:p.status==="Done"?"#34d399":p.status==="In Progress"?"#60a5fa":"#fbbf24",flexShrink:0 }}/>
                  {editId===p.id ? (
                    <>
                      <input className="f-in" value={editF.name} onChange={e=>setEditF(x=>({...x,name:e.target.value}))} onClick={e=>e.stopPropagation()} style={{ flex:1, fontSize:12 }}/>
                      <select className="f-in" value={editF.status} onChange={e=>setEditF(x=>({...x,status:e.target.value}))} onClick={e=>e.stopPropagation()} style={{ width:130,flex:"none",fontSize:12 }}>{["Pending","In Progress","Done"].map(s=><option key={s}>{s}</option>)}</select>
                      <Btn label="Save" icon={Save} small onClick={e=>{e.stopPropagation();upd(p.id,{name:editF.name,status:editF.status});setEditId(null);}}/>
                      <Btn label="×" variant="s" small onClick={e=>{e.stopPropagation();setEditId(null);}}/>
                    </>
                  ) : (
                    <>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:"#e2e2f0" }}>{p.name}</div>
                        <div style={{ fontSize:10, color:"#555568", marginTop:1 }}>
                          {spLog.length} update{spLog.length!==1?"s":""} · {spSheets.length} sheet{spSheets.length!==1?"s":""}
                        </div>
                        <CreatedAt ts={p.createdAt}/>
                      </div>
                      <Badge label={p.status} style={{ ...stStyle(p.status), fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:99 }}/>
                      <select value={p.status} onChange={e=>{e.stopPropagation();upd(p.id,{status:e.target.value,log:[...(p.log||[]),{id:uid(),status:e.target.value,note:`Status changed to ${e.target.value}`,ts:now()}]});}} onClick={e=>e.stopPropagation()} style={{ background:"#0a0a12",border:"1px solid #1c1c2a",borderRadius:6,color:"#d0d0e8",padding:"3px 7px",fontSize:11,cursor:"pointer",fontFamily:"'Outfit',sans-serif" }}>
                        {["Pending","In Progress","Done"].map(s=><option key={s}>{s}</option>)}
                      </select>
                      <IconBtn icon={Edit3} onClick={e=>{e.stopPropagation();setEditId(p.id);setEditF({name:p.name,status:p.status});}} title="Edit"/>
                      <IconBtn icon={Trash2} onClick={e=>{e.stopPropagation();setConfirmDel({id:p.id,name:p.name});}} title="Delete" color="#7777a0" hoverColor="#f87171"/>
                      <ChevronRight size={12} color={isExpanded?"#fbbf24":"#333344"}/>
                    </>
                  )}
                </div>
                {/* Expanded content */}
                {isExpanded && !editId && (
                  <div style={{ background:"#0a0a12", borderTop:"1px solid #111120" }}>
                    {/* Sub-tabs */}
                    <div style={{ display:"flex", gap:0, borderBottom:"1px solid #111120" }}>
                      {["log","sheets"].map(t=>(
                        <button key={t} onClick={()=>setTab(p.id,t)} style={{ padding:"7px 16px", background:tab===t?"rgba(245,158,11,0.07)":"transparent", border:"none", borderBottom:tab===t?"2px solid #fbbf24":"2px solid transparent", cursor:"pointer", fontSize:11, fontWeight:600, color:tab===t?"#fbbf24":"#555568", fontFamily:"'Outfit',sans-serif", textTransform:"capitalize" }}>
                          {t==="log"?`History (${spLog.length})`:`Sheets (${spSheets.length})`}
                        </button>
                      ))}
                    </div>
                    {/* Log tab */}
                    {tab==="log" && (
                      <div style={{ padding:"12px 16px" }}>
                        <div style={{ position:"relative", paddingLeft:16, marginBottom:11 }}>
                          <div style={{ position:"absolute", left:3, top:4, bottom:0, width:1, background:"#1e1e2c" }}/>
                          {spLog.length===0 ? <div style={{ fontSize:12,color:"#555568" }}>No updates yet</div> : spLog.map(entry=>(
                            <div key={entry.id} style={{ position:"relative", paddingBottom:9 }}>
                              <div style={{ position:"absolute",left:-13,top:4,width:7,height:7,borderRadius:"50%",background:entry.status==="Done"?"#34d399":entry.status==="In Progress"?"#60a5fa":"#fbbf24",border:"2px solid #0a0a12" }}/>
                              <div style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                                <div style={{ flex:1 }}>
                                  <div style={{ fontSize:12, color:"#c0c0dc", lineHeight:1.4 }}>{entry.note}</div>
                                  <div style={{ fontSize:10, color:"#4a4a62", marginTop:2 }}>{fmtTime(entry.ts)}</div>
                                </div>
                                <Badge label={entry.status} style={{ ...stStyle(entry.status), fontSize:9, fontWeight:600, padding:"1px 6px", borderRadius:99, flexShrink:0 }}/>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div style={{ background:"#0c0c14",border:"1px solid #181826",borderRadius:8,padding:"9px 11px" }}>
                          <textarea className="f-area" value={logInputs[p.id]||""} onChange={e=>setLogInputs(x=>({...x,[p.id]:e.target.value}))} placeholder="Add an update..." style={{ minHeight:48, marginBottom:7 }}/>
                          <div style={{ display:"flex",gap:7 }}>
                            <select className="f-in" value={logStatusInputs[p.id]||p.status} onChange={e=>setLogStatusInputs(x=>({...x,[p.id]:e.target.value}))} style={{ flex:1,fontSize:12 }}>{["Pending","In Progress","Done"].map(s=><option key={s}>{s}</option>)}</select>
                            <Btn label="Add Update" icon={Plus} small onClick={()=>addLog(p.id)}/>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Sheets tab */}
                    {tab==="sheets" && (
                      <div style={{ padding:"12px 16px" }}>
                        {spSheets.length===0 ? <div style={{ fontSize:12,color:"#555568",marginBottom:10 }}>No sheets yet</div> : (
                          <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:10 }}>
                            {spSheets.map(sh=>(
                              <div key={sh.id} style={{ display:"flex",alignItems:"center",gap:9,padding:"7px 11px",background:"#0c0c14",border:"1px solid #181826",borderRadius:8 }}>
                                <FileSpreadsheet size={12} color="#3b82f6"/>
                                <div style={{ flex:1 }}>
                                  <div style={{ fontSize:12,fontWeight:600,color:"#e2e2f0" }}>{sh.name}</div>
                                  {sh.workers&&sh.workers.length>0&&<div style={{ fontSize:10,color:"#555568" }}>Access: {sh.workers.join(", ")}</div>}
                                </div>
                                <a href={sh.url} target="_blank" rel="noreferrer" style={{ display:"flex",alignItems:"center",gap:4,background:"rgba(59,130,246,0.1)",border:"1px solid rgba(59,130,246,0.2)",borderRadius:6,padding:"3px 8px",color:"#7ab8ff",fontSize:11,fontWeight:600,textDecoration:"none" }}>
                                  <ExternalLink size={11}/> Open
                                </a>
                                <IconBtn icon={Trash2} onClick={()=>upd(p.id,{sheets:spSheets.filter(x=>x.id!==sh.id)})} title="Remove" color="#7777a0" hoverColor="#f87171"/>
                              </div>
                            ))}
                          </div>
                        )}
                        <AddSpSheetInline proj={p} workers={data.workers} onAdd={sh=>upd(p.id,{sheets:[...spSheets,sh]})}/>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {confirmDel && <ConfirmModal message={`Delete "${confirmDel.name}"? This cannot be undone.`} onConfirm={()=>del(confirmDel.id)} onClose={()=>setConfirmDel(null)}/>}
    </div>
  );
};

// ─── INLINE ADD SHEET FOR SPECIAL PROJECT ─────────────────────────────────────
const AddSpSheetInline = ({ proj, workers, onAdd }) => {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({name:"",url:"",priority:"Medium",workerIds:[]});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const toggleW=(wid)=>setF(p=>({...p,workerIds:p.workerIds.includes(wid)?p.workerIds.filter(x=>x!==wid):[...p.workerIds,wid]}));
  if (!open) return <button onClick={()=>setOpen(true)} style={{ display:"inline-flex",alignItems:"center",gap:5,fontSize:11,color:"#555568",background:"none",border:"1px dashed #1e1e2c",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontFamily:"'Outfit',sans-serif" }}><Plus size={11}/> Add Sheet</button>;
  return (
    <div style={{ background:"#0c0c14",border:"1px solid rgba(59,130,246,0.2)",borderRadius:9,padding:"11px 12px",marginTop:5 }}>
      <Field label="Sheet Name"><input className="f-in" value={f.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Budget Tracker"/></Field>
      <Field label="Google Sheet URL"><input className="f-in" value={f.url} onChange={e=>set("url",e.target.value)} placeholder="https://docs.google.com/..."/></Field>
      <Field label="Priority"><select className="f-in" value={f.priority} onChange={e=>set("priority",e.target.value)}>{["Low","Medium","High"].map(p=><option key={p}>{p}</option>)}</select></Field>
      <Field label="Worker Access">
        <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
          {workers.map(w=>{const has=f.workerIds.includes(w.id);return <button key={w.id} onClick={()=>toggleW(w.id)} style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:7,border:`1px solid ${has?"rgba(0,200,150,0.3)":"#1e1e2c"}`,background:has?"rgba(0,200,150,0.07)":"transparent",color:has?"#00c896":"#7777a0",cursor:"pointer",fontSize:11,fontFamily:"'Outfit',sans-serif" }}>{w.name}{has?" ✓":""}</button>;})}
        </div>
      </Field>
      <div style={{ display:"flex",gap:7 }}>
        <Btn label="Add Sheet" icon={Plus} small onClick={()=>{if(f.name&&f.url){onAdd({id:uid(),name:f.name,url:f.url,priority:f.priority,workerIds:f.workerIds,workers:workers.filter(w=>f.workerIds.includes(w.id)).map(w=>w.name),createdAt:now()});setF({name:"",url:"",priority:"Medium",workerIds:[]});setOpen(false);}}}/>
        <Btn label="Cancel" variant="s" small onClick={()=>setOpen(false)}/>
      </div>
    </div>
  );
};

// ─── ACCOUNTS TASK OVERVIEW BOX ───────────────────────────────────────────────
const AccountsTaskBox = ({ data, navigate }) => {
  const { accounts, clients, projects, tasks } = data;
  // For each account: get its projects, then tasks linked to those projects
  const accsWithData = accounts.map(acc=>{
    const accProjs = projects.filter(p=>p.accountId===acc.id);
    const accTasks = tasks.filter(t=>accProjs.some(p=>p.id===t.projectId));
    const pending = accTasks.filter(t=>t.status==="Pending").length;
    const inProg  = accTasks.filter(t=>t.status==="In Progress").length;
    const done    = accTasks.filter(t=>t.status==="Done").length;
    const client  = clients.find(c=>c.id===acc.clientId);
    return { acc, client, accProjs, accTasks, pending, inProg, done };
  }).filter(x=>x.accTasks.length>0||x.accProjs.length>0);

  return (
    <div style={{ background:"#0c0c14", border:"1px solid rgba(0,200,150,0.18)", borderRadius:13, overflow:"hidden", marginBottom:22 }}>
      <div style={{ padding:"13px 16px", borderBottom:"1px solid #111120", background:"rgba(0,200,150,0.03)" }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#00c896", fontFamily:"'Syne',sans-serif" }}>📊 Accounts Overview</div>
        <div style={{ fontSize:10, color:"#555568", marginTop:2 }}>Task activity per account</div>
      </div>
      {accsWithData.length===0 ? <Empty icon={Building2} msg="No account task data yet"/> : (
        <div>
          {accsWithData.map(({ acc, client, accProjs, accTasks, pending, inProg, done })=>(
            <div key={acc.id} className="row-item" onClick={()=>navigate("account",{accountId:acc.id})} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 16px", borderBottom:"1px solid #0f0f18", cursor:"pointer" }}>
              <div style={{ width:34,height:34,borderRadius:8,background:"rgba(0,200,150,0.07)",border:"1px solid rgba(0,200,150,0.16)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <Building2 size={14} color="#00c896"/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#e2e2f0" }}>{acc.name}</div>
                <div style={{ fontSize:11, color:"#555568" }}>{client?.name} · {acc.platform} · {accProjs.length} projects</div>
              </div>
              <div style={{ display:"flex", gap:10, flexShrink:0 }}>
                {pending>0  && <div style={{ textAlign:"center" }}><div style={{ fontSize:15, fontWeight:800, color:"#fbbf24", fontFamily:"'Syne',sans-serif" }}>{pending}</div><div style={{ fontSize:9, color:"#555568" }}>Pending</div></div>}
                {inProg>0   && <div style={{ textAlign:"center" }}><div style={{ fontSize:15, fontWeight:800, color:"#60a5fa", fontFamily:"'Syne',sans-serif" }}>{inProg}</div><div style={{ fontSize:9, color:"#555568" }}>Active</div></div>}
                {done>0     && <div style={{ textAlign:"center" }}><div style={{ fontSize:15, fontWeight:800, color:"#34d399", fontFamily:"'Syne',sans-serif" }}>{done}</div><div style={{ fontSize:9, color:"#555568" }}>Done</div></div>}
                {accTasks.length===0 && <div style={{ fontSize:11, color:"#444458" }}>No tasks</div>}
              </div>
              <ChevronRight size={13} color="#222236"/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── ACCOUNT CASES BOX (blockchain log per account) ──────────────────────────
const AccountCasesBox = ({ data, setData }) => {
  const { accounts, clients, accountCases } = data;
  const cases = accountCases || [];
  const [open, setOpen] = useState(null);
  const [addCaseOpen, setAddCaseOpen] = useState(false);
  const [caseForm, setCaseForm] = useState({ accountId: accounts[0]?.id || "", title: "" });
  const [logInputs, setLogInputs] = useState({});
  const [logStatusInputs, setLogStatusInputs] = useState({});
  const [editingCase, setEditingCase] = useState(null);

  const addCase = () => {
    if (!caseForm.title.trim() || !caseForm.accountId) return;
    const nc = { id: uid(), accountId: caseForm.accountId, title: caseForm.title.trim(), status: "Pending", log: [{ id: uid(), status: "Pending", note: "Case opened", ts: now() }], createdAt: now() };
    setData(d => ({ ...d, accountCases: [...(d.accountCases || []), nc] }));
    setCaseForm({ accountId: accounts[0]?.id || "", title: "" }); setAddCaseOpen(false);
  };
  const deleteCase = (id) => setData(d => ({ ...d, accountCases: (d.accountCases || []).filter(c => c.id !== id) }));
  const addLog = (caseId) => {
    const note = logInputs[caseId] || ""; const status = logStatusInputs[caseId] || "Pending";
    if (!note.trim()) return;
    setData(d => ({ ...d, accountCases: (d.accountCases || []).map(c => c.id !== caseId ? c : { ...c, status, log: [...c.log, { id: uid(), status, note: note.trim(), ts: now() }] }) }));
    setLogInputs(p => ({ ...p, [caseId]: "" }));
  };
  const saveEdit = (id) => {
    if (!editingCase?.title?.trim()) return;
    setData(d => ({ ...d, accountCases: (d.accountCases || []).map(c => c.id !== id ? c : { ...c, title: editingCase.title, accountId: editingCase.accountId }) }));
    setEditingCase(null);
  };

  const grouped = accounts.map(acc => ({ acc, client: clients.find(c => c.id === acc.clientId), cases: cases.filter(c => c.accountId === acc.id) })).filter(g => g.cases.length > 0);

  return (
    <div style={{ background: "#0c0c14", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 13, overflow: "hidden", marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderBottom: "1px solid #111120", background: "rgba(245,158,11,0.03)" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24", fontFamily: "'Syne',sans-serif" }}>⚖️ Account Cases</div>
          <div style={{ fontSize: 10, color: "#555568", marginTop: 2 }}>Blockchain log — full history per case</div>
        </div>
        <Btn label="New Case" icon={Plus} small onClick={() => setAddCaseOpen(p => !p)} />
      </div>
      {addCaseOpen && (
        <div style={{ padding: "11px 16px", borderBottom: "1px solid #111120", background: "#0a0a12" }}>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            <select className="f-in" value={caseForm.accountId} onChange={e => setCaseForm(p => ({ ...p, accountId: e.target.value }))} style={{ width: 160, flex: "none", fontSize: 12 }}>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <input className="f-in" value={caseForm.title} onChange={e => setCaseForm(p => ({ ...p, title: e.target.value }))} placeholder="Case title..." style={{ flex: 1 }} onKeyDown={e => e.key === "Enter" && addCase()} />
            <Btn label="Open" icon={Plus} small onClick={addCase} />
          </div>
        </div>
      )}
      {cases.length === 0 ? <Empty icon={Building2} msg="No cases yet — open a new case above" /> : (
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {grouped.length > 0 ? grouped.map(({ acc, client, cases: aCases }) => (
            <div key={acc.id}>
              <div style={{ padding: "8px 16px 4px", fontSize: 10, color: "#fbbf24", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", background: "rgba(245,158,11,0.03)", borderBottom: "1px solid #111120" }}>
                {acc.name} {client ? `· ${client.name}` : ""}
              </div>
              {aCases.map(c => (
                <div key={c.id} style={{ borderBottom: "1px solid #0f0f18" }}>
                  <div className="row-item" onClick={() => setOpen(open === c.id ? null : c.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", cursor: "pointer" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.status === "Done" ? "#34d399" : c.status === "In Progress" ? "#60a5fa" : "#fbbf24", flexShrink: 0 }} />
                    {editingCase?.id === c.id ? (
                      <>
                        <input className="f-in" value={editingCase.title} onChange={e => setEditingCase(p => ({ ...p, title: e.target.value }))} onClick={e => e.stopPropagation()} style={{ flex: 1, fontSize: 12 }} />
                        <Btn label="Save" icon={Save} small onClick={e => { e.stopPropagation(); saveEdit(c.id); }} />
                        <Btn label="×" variant="s" small onClick={e => { e.stopPropagation(); setEditingCase(null); }} />
                      </>
                    ) : (
                      <>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e2f0" }}>{c.title}</div>
                          <div style={{ fontSize: 10, color: "#4a4a62", marginTop: 1 }}>{c.log.length} update{c.log.length !== 1 ? "s" : ""} · Last: {fmtTime(c.log[c.log.length - 1]?.ts)}</div>
                        </div>
                        <Badge label={c.status} style={{ ...stStyle(c.status), fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99 }} />
                        <IconBtn icon={Edit3} onClick={e => { e.stopPropagation(); setEditingCase({ id: c.id, title: c.title, accountId: c.accountId }); }} title="Edit" />
                        <IconBtn icon={Trash2} onClick={e => { e.stopPropagation(); deleteCase(c.id); }} title="Delete" color="#7777a0" hoverColor="#f87171" />
                        <ChevronRight size={12} color={open === c.id ? "#7c5ff5" : "#333344"} />
                      </>
                    )}
                  </div>
                  {open === c.id && (
                    <div style={{ padding: "0 16px 13px", background: "#0a0a12" }}>
                      <div style={{ position: "relative", paddingLeft: 16, marginBottom: 11 }}>
                        <div style={{ position: "absolute", left: 3, top: 4, bottom: 0, width: 1, background: "#1e1e2c" }} />
                        {c.log.map(entry => (
                          <div key={entry.id} style={{ position: "relative", paddingBottom: 9 }}>
                            <div style={{ position: "absolute", left: -13, top: 4, width: 7, height: 7, borderRadius: "50%", background: entry.status === "Done" ? "#34d399" : entry.status === "In Progress" ? "#60a5fa" : "#fbbf24", border: "2px solid #0a0a12" }} />
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 12, color: "#c0c0dc", lineHeight: 1.4 }}>{entry.note}</div>
                                <div style={{ fontSize: 10, color: "#4a4a62", marginTop: 2 }}>{fmtTime(entry.ts)}</div>
                              </div>
                              <Badge label={entry.status} style={{ ...stStyle(entry.status), fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 99, flexShrink: 0 }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: "#0c0c14", border: "1px solid #181826", borderRadius: 8, padding: "9px 11px" }}>
                        <div style={{ fontSize: 10, color: "#555568", marginBottom: 6, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Add Update</div>
                        <textarea className="f-area" value={logInputs[c.id] || ""} onChange={e => setLogInputs(p => ({ ...p, [c.id]: e.target.value }))} placeholder="What happened..." style={{ minHeight: 48, marginBottom: 7 }} />
                        <div style={{ display: "flex", gap: 7 }}>
                          <select className="f-in" value={logStatusInputs[c.id] || c.status} onChange={e => setLogStatusInputs(p => ({ ...p, [c.id]: e.target.value }))} style={{ flex: 1, fontSize: 12 }}>
                            {["Pending", "In Progress", "Done"].map(s => <option key={s}>{s}</option>)}
                          </select>
                          <Btn label="Add" icon={Plus} small onClick={() => addLog(c.id)} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )) : cases.map(c => (
            <div key={c.id} style={{ borderBottom: "1px solid #0f0f18" }}>
              <div className="row-item" onClick={() => setOpen(open === c.id ? null : c.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", cursor: "pointer" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.status === "Done" ? "#34d399" : c.status === "In Progress" ? "#60a5fa" : "#fbbf24", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e2f0" }}>{c.title}</div>
                  <div style={{ fontSize: 10, color: "#4a4a62", marginTop: 1 }}>{c.log.length} updates</div>
                </div>
                <Badge label={c.status} style={{ ...stStyle(c.status), fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99 }} />
                <IconBtn icon={Trash2} onClick={e => { e.stopPropagation(); deleteCase(c.id); }} title="Delete" color="#7777a0" hoverColor="#f87171" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── ADMIN HOME ───────────────────────────────────────────────────────────────
const AdminHome = ({ data, navigate, openModal, currentUser, setGlobalTypeFilter, setData }) => {
  const { clients, accounts, projects, sheets, tasks, workers } = data;
  const specialProjects = data.specialProjects || [];
  const adminTasks = data.adminTasks || [];
  const accountCases = data.accountCases || [];

  const pending = tasks.filter(t => t.status === "Pending");
  const inProg  = tasks.filter(t => t.status === "In Progress");
  const done    = tasks.filter(t => t.status === "Done");
  const [taskView, setTaskView] = useState(null);

  // ── Metric box ──
  const MB = ({ label, value, accent, Icon, sub, onClick, active }) => (
    <div onClick={onClick} className="hov-card" style={{ background: "#0e0e17", border: `1px solid ${active ? accent + "55" : "#181826"}`, borderRadius: 14, padding: "16px 15px", cursor: "pointer", flex: 1, minWidth: 105 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: `${accent}14`, border: `1px solid ${accent}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={15} color={accent} />
        </div>
        <ChevronRight size={11} color={active ? accent : "#22222e"} />
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "#e8e8f6", fontFamily: "'Syne',sans-serif", lineHeight: 1, marginBottom: 3 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#7777a0", fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: "#555568", marginTop: 2 }}>{sub}</div>}
    </div>
  );

  // Section label
  const SL = ({ label }) => (
    <div style={{ fontSize: 10, fontWeight: 700, color: "#555568", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 9, marginTop: 4 }}>{label}</div>
  );

  return (
    <div>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#eeeef8", fontFamily: "'Syne',sans-serif" }}>Plan <span style={{ color: "#7c5ff5" }}>OP</span></h1>
            <p style={{ fontSize: 12, color: "#666680", marginTop: 3 }}>Welcome back, <span style={{ color: "#7c5ff5" }}>{currentUser.name}</span></p>
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            <Btn label="Add Client" icon={Plus} onClick={() => openModal("client")} />
            <Btn label="Add Sheet" icon={Plus} variant="s" onClick={() => openModal("sheet")} />
            <Btn label="Add Worker" icon={Plus} variant="s" onClick={() => openModal("worker")} />
            <Btn label="Sheet Types" icon={Tag} variant="s" onClick={() => openModal("types")} />
          </div>
        </div>
      </div>

      {/* Row 1: Core overview */}
      <SL label="Overview" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <MB label="Clients"   value={clients.length}  accent="#7c5ff5" Icon={Users}         onClick={() => navigate("clients")} />
        <MB label="Accounts"  value={accounts.length} accent="#00c896" Icon={Building2}     onClick={() => navigate("all-accounts")} />
        <MB label="Projects"  value={projects.length} accent="#f59e0b" Icon={Folder}        onClick={() => navigate("all-projects")} />
        <MB label="Sheets"    value={sheets.length}   accent="#3b82f6" Icon={FileSpreadsheet} onClick={() => navigate("all-sheets")} />
      </div>

      {/* Row 2: Task metrics */}
      <SL label="Worker Tasks" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <MB label="Pending"     value={pending.length} accent="#fbbf24" Icon={AlertCircle} onClick={() => setTaskView(taskView === "Pending"     ? null : "Pending")}     active={taskView === "Pending"}     sub="tap to expand" />
        <MB label="In Progress" value={inProg.length}  accent="#60a5fa" Icon={Clock}       onClick={() => setTaskView(taskView === "In Progress" ? null : "In Progress")} active={taskView === "In Progress"} sub="tap to expand" />
        <MB label="Done"        value={done.length}    accent="#34d399" Icon={CheckCircle}  onClick={() => setTaskView(taskView === "Done"        ? null : "Done")}        active={taskView === "Done"}        sub="tap to expand" />
        <MB label="All Tasks"   value={tasks.length}   accent="#8b5cf6" Icon={CheckSquare}  onClick={() => setTaskView(taskView === "All"         ? null : "All")}         active={taskView === "All"}         sub="tap to expand" />
      </div>

      {/* Row 3: My Workspace metrics — each navigates to its own page */}
      <SL label="My Workspace" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <MB label="Special Projects" value={specialProjects.length} accent="#ec4899" Icon={Folder}
          onClick={() => navigate("special-projects")} sub="tap to open" />
        <MB label="My Task Log"  value={adminTasks.length} accent="#a78bfa" Icon={CheckSquare}
          onClick={() => navigate("admin-tasks")} sub="tap to open" />
        <MB label="Account Cases" value={accountCases.length} accent="#fbbf24" Icon={Building2}
          onClick={() => navigate("account-cases")} sub="tap to open" />
      </div>

      {/* Expanded task view — shown inline below task metrics */}
      {taskView && (() => {
        const filtered = taskView === "All" ? tasks : tasks.filter(t => t.status === taskView);
        const fmtDL = ts => { if (!ts) return null; const d = new Date(ts); const mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return `${d.getDate()} ${mo[d.getMonth()]}`; };
        return (
          <div className="fade-up" style={{ background: "#0c0c14", border: "1px solid #181826", borderRadius: 12, padding: 15, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#666680", letterSpacing: "0.06em", textTransform: "uppercase" }}>{taskView} Tasks ({filtered.length})</div>
              <button onClick={() => setTaskView(null)} style={{ background: "none", border: "none", color: "#555568", cursor: "pointer", display: "flex" }}><X size={13} /></button>
            </div>
            {filtered.length === 0 ? <Empty icon={CheckSquare} msg="No tasks here" /> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {filtered.map(task => {
                  const worker = workers.find(w => w.id === task.workerId);
                  const proj = projects.find(p => p.id === task.projectId);
                  const fmtDLt = ts => { if (!ts) return null; const d = new Date(ts); const mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return `${d.getDate()} ${mo[d.getMonth()]}`; };
                  return (
                    <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "#0e0e17", border: "1px solid #181826", borderRadius: 8 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: task.status === "Done" ? "#34d399" : task.status === "In Progress" ? "#60a5fa" : "#fbbf24", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e2f0" }}>{task.title}</div>
                        <div style={{ fontSize: 10, color: "#4a4a62", marginTop: 1 }}>{proj?.name} {worker ? `· ${worker.name}` : ""}{task.deadline ? ` · Due: ${fmtDLt(task.deadline)}` : ""}</div>
                      </div>
                      <Badge label={task.status} style={{ ...stStyle(task.status), fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99 }} />
                      {worker && <Av text={worker.avatar} color="#00c896" size={21} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};

// ─── GLOBAL TYPE RESULTS ──────────────────────────────────────────────────────
const TypeResults = ({ typeId, data, navigate }) => {
  const { sheetTypes, sheets, projects, accounts, clients, workers } = data;
  const type = sheetTypes.find(t=>t.id===typeId);
  if (!type) return null;
  const matching = sheets.filter(s=>s.typeId===typeId);
  return (
    <div className="fade-up">
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <div style={{ width:10,height:10,borderRadius:"50%",background:type.color }}/>
        <h1 style={{ fontSize:19, fontWeight:800, color:"#e4e4f4", fontFamily:"'Syne',sans-serif" }}>{type.name} Sheets</h1>
        <span style={{ fontSize:12, color:"#7777a0" }}>— {matching.length} sheets</span>
      </div>
      {matching.length===0 ? <Empty msg={`No ${type.name} sheets found`}/> : (
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {matching.map(s=>{
            const proj=projects.find(p=>p.id===s.projectId);
            const acc=proj?accounts.find(a=>a.id===proj.accountId):null;
            const client=acc?clients.find(c=>c.id===acc.clientId):null;
            const ref=[client?.name,acc?.name,proj?.name].filter(Boolean).join(" → ");
            return (
              <div key={s.id} className="row-item" style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"12px 15px", background:"#0c0c14", border:"1px solid #181826", borderRadius:10 }}>
                <div style={{ width:8,height:8,borderRadius:"50%",background:type.color,flexShrink:0,marginTop:4 }}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#e2e2f0" }}>{s.name}</div>
                  <button onClick={()=>proj&&navigate("project",{projectId:proj.id})} style={{ background:"none",border:"none",padding:0,cursor:"pointer",fontSize:11,color:"#666680",marginTop:2,display:"block",textAlign:"left" }}>📁 {ref}</button>
                  <CreatedAt ts={s.createdAt}/>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <Badge label={s.priority} style={{ ...priStyle(s.priority), fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:99 }}/>
                  <a href={s.url} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:7, padding:"4px 9px", color:"#7ab8ff", fontSize:11, fontWeight:600, textDecoration:"none" }}>
                    <ExternalLink size={12}/> Open
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── CLIENTS VIEW ─────────────────────────────────────────────────────────────
const ClientsView = ({ data, navigate, openModal, onEdit, onDelete }) => {
  const { clients, accounts, projects, sheets } = data;
  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <div><h1 style={{ fontSize:20, fontWeight:800, color:"#e4e4f4", fontFamily:"'Syne',sans-serif" }}>Clients</h1><p style={{ fontSize:12, color:"#666680", marginTop:3 }}>{clients.length} clients</p></div>
        <Btn label="Add Client" icon={Plus} onClick={()=>openModal("client")}/>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {clients.map(c=>{
          const accs=accounts.filter(a=>a.clientId===c.id);
          const projs=projects.filter(p=>accs.some(a=>a.id===p.accountId));
          const shs=sheets.filter(s=>projs.some(p=>p.id===s.projectId));
          return (
            <div key={c.id} style={{ background:"#0c0c14", border:"1px solid #181826", borderRadius:11 }}>
              <div className="row-item" onClick={()=>navigate("client",{clientId:c.id})} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", cursor:"pointer" }}>
                <Av text={initials(c.name)} size={40}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#d8d8ec", fontFamily:"'Syne',sans-serif" }}>{c.name}</div>
                  <div style={{ fontSize:11, color:"#666680", marginTop:2 }}>{c.industry} · {c.email}</div>
                  <CreatedAt ts={c.createdAt}/>
                </div>
                <div style={{ display:"flex", gap:14, fontSize:12, color:"#555568" }}>
                  <span><span style={{ color:"#7c5ff5", fontWeight:700 }}>{accs.length}</span> accounts</span>
                  <span><span style={{ color:"#f59e0b", fontWeight:700 }}>{projs.length}</span> projects</span>
                  <span><span style={{ color:"#3b82f6", fontWeight:700 }}>{shs.length}</span> sheets</span>
                </div>
                <ChevronRight size={13} color="#222236"/>
              </div>
              <div style={{ display:"flex", gap:6, padding:"0 16px 10px" }}>
                <IconBtn icon={Edit3} onClick={()=>onEdit("client",c)} title="Edit"/>
                <button onClick={()=>openModal("notes",{entity:c,type:"client"})} style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 9px", borderRadius:6, border:"1px solid #1c1c2a", background:"transparent", color:c.notes?"#7c5ff5":"#333344", cursor:"pointer", fontSize:11, fontFamily:"'Outfit',sans-serif" }}><StickyNote size={11}/>{c.notes?"Notes ●":"Notes"}</button>
                <IconBtn icon={Trash2} onClick={()=>onDelete("client",c.id)} title="Delete" color="#44445a" hoverColor="#f87171"/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── CLIENT DETAIL ────────────────────────────────────────────────────────────
const ClientView = ({ client, data, navigate, openModal, onEdit, onDelete }) => {
  const { accounts, projects, sheets } = data;
  const clientAccs = accounts.filter(a=>a.clientId===client.id);
  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <Av text={initials(client.name)} size={44}/>
          <div>
            <h1 style={{ fontSize:19, fontWeight:800, color:"#e4e4f4", fontFamily:"'Syne',sans-serif" }}>{client.name}</h1>
            <p style={{ fontSize:12, color:"#666680", marginTop:3 }}>{client.industry} · {client.email}</p>
            <CreatedAt ts={client.createdAt}/>
          </div>
        </div>
        <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
          <IconBtn icon={Edit3} onClick={()=>onEdit("client",client)} title="Edit"/>
          <button onClick={()=>openModal("notes",{entity:client,type:"client"})} style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 9px", borderRadius:6, border:"1px solid #1c1c2a", background:"transparent", color:client.notes?"#7c5ff5":"#333344", cursor:"pointer", fontSize:11, fontFamily:"'Outfit',sans-serif" }}><StickyNote size={11}/>{client.notes?"Notes ●":"Notes"}</button>
          <IconBtn icon={Trash2} onClick={()=>onDelete("client",client.id)} title="Delete" color="#44445a" hoverColor="#f87171"/>
          <Btn label="Add Account" icon={Plus} onClick={()=>openModal("account",{clientId:client.id})}/>
        </div>
      </div>
      {client.notes && <div style={{ background:"rgba(124,95,245,0.05)", border:"1px solid rgba(124,95,245,0.13)", borderRadius:9, padding:"9px 13px", fontSize:12, color:"#b0b0cc", marginBottom:16, lineHeight:1.6 }}>📝 {client.notes}</div>}
      <div style={{ fontSize:10, fontWeight:700, color:"#666680", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:11 }}>Accounts ({clientAccs.length})</div>
      {clientAccs.length===0 ? <Empty icon={Building2} msg="No accounts yet"/> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:9 }}>
          {clientAccs.map(acc=>{
            const accProjs=projects.filter(p=>p.accountId===acc.id);
            const accShs=sheets.filter(s=>accProjs.some(p=>p.id===s.projectId));
            return (
              <div key={acc.id} style={{ background:"#0e0e17", border:"1px solid #181826", borderRadius:13, overflow:"hidden" }}>
                <div className="hov-card hov-green" onClick={()=>navigate("account",{accountId:acc.id})} style={{ padding:16, cursor:"pointer" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:11 }}>
                    <div style={{ width:34,height:34,borderRadius:9,background:"rgba(0,200,150,0.08)",border:"1px solid rgba(0,200,150,0.18)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                      <Building2 size={14} color="#00c896"/>
                    </div>
                    <Badge label={acc.status||"Active"} style={{ ...stStyle(acc.status||"Active"), fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:99 }}/>
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#e2e2f0", fontFamily:"'Syne',sans-serif", marginBottom:4 }}>{acc.name}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:"#7c5ff5", marginBottom:8 }}>{acc.platform}</div>
                  <div style={{ display:"flex", gap:12, fontSize:11, color:"#555568" }}>
                    <span><span style={{ color:"#f59e0b", fontWeight:700 }}>{accProjs.length}</span> projects</span>
                    <span><span style={{ color:"#3b82f6", fontWeight:700 }}>{accShs.length}</span> sheets</span>
                  </div>
                  <CreatedAt ts={acc.createdAt}/>
                </div>
                <div style={{ display:"flex", gap:6, padding:"6px 12px 9px", borderTop:"1px solid #111120" }}>
                  <IconBtn icon={Edit3} onClick={()=>onEdit("account",acc)} title="Edit"/>
                  <button onClick={()=>openModal("notes",{entity:acc,type:"account"})} style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"3px 9px",borderRadius:6,border:"1px solid #1c1c2a",background:"transparent",color:acc.notes?"#7c5ff5":"#333344",cursor:"pointer",fontSize:11,fontFamily:"'Outfit',sans-serif" }}><StickyNote size={11}/>{acc.notes?"Notes ●":"Notes"}</button>
                  <IconBtn icon={Trash2} onClick={()=>onDelete("account",acc.id)} title="Delete" color="#44445a" hoverColor="#f87171"/>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── ACCOUNT VIEW ─────────────────────────────────────────────────────────────
const AccountView = ({ account, data, navigate, openModal, onEdit, onDelete, onDeleteSheet, onManageWorkers }) => {
  const { projects, sheets, sheetTypes, workers } = data;
  const accProjs = projects.filter(p=>p.accountId===account.id);
  const allAccShs = sheets.filter(s=>accProjs.some(p=>p.id===s.projectId));
  const [tab,setTab] = useState("projects");
  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:4 }}>
            <h1 style={{ fontSize:19, fontWeight:800, color:"#e4e4f4", fontFamily:"'Syne',sans-serif" }}>{account.name}</h1>
            <span style={{ fontSize:13, fontWeight:700, color:"#7c5ff5", background:"rgba(124,95,245,0.1)", padding:"3px 11px", borderRadius:99, border:"1px solid rgba(124,95,245,0.2)" }}>{account.platform}</span>
            <Badge label={account.status||"Active"} style={{ ...stStyle(account.status||"Active"), fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:99 }}/>
          </div>
          <p style={{ fontSize:12, color:"#666680" }}>{accProjs.length} projects · {allAccShs.length} sheets</p>
          <CreatedAt ts={account.createdAt}/>
        </div>
        <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
          <IconBtn icon={Edit3} onClick={()=>onEdit("account",account)} title="Edit"/>
          <button onClick={()=>openModal("notes",{entity:account,type:"account"})} style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"3px 9px",borderRadius:6,border:"1px solid #1c1c2a",background:"transparent",color:account.notes?"#7c5ff5":"#333344",cursor:"pointer",fontSize:11,fontFamily:"'Outfit',sans-serif" }}><StickyNote size={11}/>{account.notes?"Notes ●":"Notes"}</button>
          <IconBtn icon={Trash2} onClick={()=>onDelete("account",account.id)} title="Delete" color="#44445a" hoverColor="#f87171"/>
          <Btn label="Add Project" icon={Plus} onClick={()=>openModal("project",{accountId:account.id})}/>
          <Btn label="Add Sheet" icon={Plus} variant="s" onClick={()=>openModal("sheet",{projectId:accProjs[0]?.id})}/>
        </div>
      </div>
      {account.notes && <div style={{ background:"rgba(124,95,245,0.05)", border:"1px solid rgba(124,95,245,0.13)", borderRadius:9, padding:"9px 13px", fontSize:12, color:"#b0b0cc", marginBottom:14, lineHeight:1.6 }}>📝 {account.notes}</div>}
      <Tabs tabs={[{label:`Projects (${accProjs.length})`,value:"projects"},{label:`Sheets (${allAccShs.length})`,value:"sheets"}]} active={tab} onChange={setTab}/>
      {tab==="projects" && (accProjs.length===0 ? <Empty icon={Folder} msg="No projects yet"/> :
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:9 }}>
          {accProjs.map(p=><ProjectCard key={p.id} project={p} sheetCount={sheets.filter(s=>s.projectId===p.id).length} onClick={()=>navigate("project",{projectId:p.id})} onEdit={()=>onEdit("project",p)} onNotes={()=>openModal("notes",{entity:p,type:"project"})} onDelete={()=>onDelete("project",p.id)} isAdmin/>)}
        </div>
      )}
      {tab==="sheets" && (allAccShs.length===0 ? <Empty msg="No sheets yet"/> :
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {allAccShs.map(s=><SheetRow key={s.id} sheet={s} sheetTypes={sheetTypes} workers={workers} projects={projects} isAdmin onEdit={()=>onEdit("sheet",s)} onDelete={()=>onDeleteSheet(s.id)} onManageWorkers={()=>onManageWorkers(s)} onNavigate={navigate}/>)}
        </div>
      )}
    </div>
  );
};

// ─── PROJECT VIEW ─────────────────────────────────────────────────────────────
const ProjectView = ({ project, data, navigate, openModal, onEdit, onDelete, onDeleteSheet, onManageWorkers }) => {
  const { sheets, sheetTypes, workers, projects } = data;
  const shs = sheets.filter(s=>s.projectId===project.id);
  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:11 }}>
          <div style={{ width:40,height:40,borderRadius:10,background:"rgba(124,95,245,0.1)",border:"1px solid rgba(124,95,245,0.2)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Folder size={17} color="#7c5ff5"/>
          </div>
          <div>
            <h1 style={{ fontSize:18, fontWeight:800, color:"#e4e4f4", fontFamily:"'Syne',sans-serif" }}>{project.name}</h1>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:4 }}>
              <Badge label={project.status} style={{ ...stStyle(project.status), fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:99 }}/>
              <span style={{ fontSize:11, color:"#555568" }}>{shs.length} sheets</span>
            </div>
            <CreatedAt ts={project.createdAt}/>
          </div>
        </div>
        <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
          <IconBtn icon={Edit3} onClick={()=>onEdit("project",project)} title="Edit"/>
          <button onClick={()=>openModal("notes",{entity:project,type:"project"})} style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"3px 9px",borderRadius:6,border:"1px solid #1c1c2a",background:"transparent",color:project.notes?"#7c5ff5":"#333344",cursor:"pointer",fontSize:11,fontFamily:"'Outfit',sans-serif" }}><StickyNote size={11}/>{project.notes?"Notes ●":"Notes"}</button>
          <IconBtn icon={Trash2} onClick={()=>onDelete("project",project.id)} title="Delete" color="#44445a" hoverColor="#f87171"/>
          <Btn label="Add Sheet" icon={Plus} onClick={()=>openModal("sheet",{projectId:project.id})}/>
        </div>
      </div>
      {project.notes && <div style={{ background:"rgba(124,95,245,0.05)", border:"1px solid rgba(124,95,245,0.13)", borderRadius:9, padding:"9px 13px", fontSize:12, color:"#b0b0cc", marginBottom:14, lineHeight:1.6 }}>📝 {project.notes}</div>}
      {shs.length===0 ? <Empty msg="No sheets in this project"/> :
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {shs.map(s=><SheetRow key={s.id} sheet={s} sheetTypes={sheetTypes} workers={workers} projects={projects} isAdmin onEdit={()=>onEdit("sheet",s)} onDelete={()=>onDeleteSheet(s.id)} onManageWorkers={()=>onManageWorkers(s)} onNavigate={navigate}/>)}
        </div>
      }
    </div>
  );
};

// ─── ALL SHEETS ───────────────────────────────────────────────────────────────
const AllSheetsView = ({ data, onDeleteSheet, onManageWorkers, onEdit, navigate }) => {
  const { sheets, sheetTypes, workers, projects } = data;
  return (
    <div className="fade-up">
      <div style={{ marginBottom:16 }}><h1 style={{ fontSize:20, fontWeight:800, color:"#e4e4f4", fontFamily:"'Syne',sans-serif" }}>All Sheets</h1><p style={{ fontSize:12, color:"#666680", marginTop:3 }}>{sheets.length} sheets total</p></div>
      {sheets.length===0 ? <Empty msg="No sheets yet"/> :
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {sheets.map(s=><SheetRow key={s.id} sheet={s} sheetTypes={sheetTypes} workers={workers} projects={projects} isAdmin onEdit={()=>onEdit("sheet",s)} onDelete={()=>onDeleteSheet(s.id)} onManageWorkers={()=>onManageWorkers(s)} onNavigate={navigate}/>)}
        </div>
      }
    </div>
  );
};

// ─── ALL PROJECTS ─────────────────────────────────────────────────────────────
const AllProjectsView = ({ data, navigate, openModal, onEdit, onDelete }) => {
  const { projects, sheets } = data;
  return (
    <div className="fade-up">
      <div style={{ marginBottom:16 }}><h1 style={{ fontSize:20, fontWeight:800, color:"#e4e4f4", fontFamily:"'Syne',sans-serif" }}>All Projects</h1><p style={{ fontSize:12, color:"#666680", marginTop:3 }}>{projects.length} projects</p></div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:9 }}>
        {projects.map(p=><ProjectCard key={p.id} project={p} sheetCount={sheets.filter(s=>s.projectId===p.id).length} onClick={()=>navigate("project",{projectId:p.id})} onEdit={()=>onEdit("project",p)} onNotes={()=>openModal("notes",{entity:p,type:"project"})} onDelete={()=>onDelete("project",p.id)} isAdmin/>)}
      </div>
    </div>
  );
};

// ─── WORKERS VIEW ─────────────────────────────────────────────────────────────
const WorkersView = ({ data, navigate, openModal, onEdit, onDelete, isAdmin }) => {
  const { workers, tasks, sheets } = data;
  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <div><h1 style={{ fontSize:20, fontWeight:800, color:"#e4e4f4", fontFamily:"'Syne',sans-serif" }}>Workers</h1><p style={{ fontSize:12, color:"#666680", marginTop:3 }}>{workers.length} members</p></div>
        {isAdmin && <Btn label="Add Worker" icon={Plus} onClick={()=>openModal("worker")}/>}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:9 }}>
        {workers.map(w=>{
          const wt=tasks.filter(t=>t.workerId===w.id);
          const ws=sheets.filter(s=>(s.workerIds||[]).includes(w.id));
          const pending=wt.filter(t=>t.status!=="Done").length;
          return (
            <div key={w.id} style={{ background:"#0e0e17", border:"1px solid #181826", borderRadius:13, overflow:"hidden" }}>
              <div className="hov-card hov-green" onClick={()=>navigate("worker",{workerId:w.id})} style={{ padding:16, cursor:"pointer" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <Av text={w.avatar} color="#00c896" size={40}/>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#e2e2f0", fontFamily:"'Syne',sans-serif" }}>{w.name}</div>
                    <div style={{ fontSize:11, color:"#555568", marginTop:1 }}>{w.role}</div>
                    <CreatedAt ts={w.createdAt}/>
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-around", borderTop:"1px solid #111120", paddingTop:11 }}>
                  {[["Sheets",ws.length,"#7c5ff5"],["Tasks",wt.length,"#00c896"],["Pending",pending,"#f87171"]].map(([l,v,c])=>(
                    <div key={l} style={{ textAlign:"center" }}>
                      <div style={{ fontSize:18, fontWeight:800, color:c, fontFamily:"'Syne',sans-serif" }}>{v}</div>
                      <div style={{ fontSize:10, color:"#555568" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              {isAdmin && (
                <div style={{ display:"flex", gap:6, padding:"6px 12px 9px", borderTop:"1px solid #111120" }}>
                  <IconBtn icon={Edit3} onClick={()=>onEdit("worker",w)} title="Edit"/>
                  <IconBtn icon={Trash2} onClick={()=>onDelete("worker",w.id)} title="Delete" color="#44445a" hoverColor="#f87171"/>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── WORKER DETAIL (admin) ────────────────────────────────────────────────────
const WorkerDetailView = ({ worker, data, navigate, openModal, onDeleteTask, onDeleteSheet, onManageWorkers, openTask, isAdmin }) => {
  const { tasks, sheets, projects, sheetTypes, workers } = data;
  const wt=tasks.filter(t=>t.workerId===worker.id);
  const ws=sheets.filter(s=>(s.workerIds||[]).includes(worker.id));
  const wProjs=[...new Set([...wt.map(t=>t.projectId),...ws.map(s=>s.projectId)])].map(id=>projects.find(p=>p.id===id)).filter(Boolean);
  const [tab,setTab]=useState("tasks");
  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <Av text={worker.avatar} color="#00c896" size={46}/>
          <div>
            <h1 style={{ fontSize:18, fontWeight:800, color:"#e4e4f4", fontFamily:"'Syne',sans-serif" }}>{worker.name}</h1>
            <p style={{ fontSize:12, color:"#666680", marginTop:2 }}>{worker.role} · {ws.length} sheets · {wt.length} tasks</p>
            <CreatedAt ts={worker.createdAt}/>
          </div>
        </div>
        {isAdmin && <Btn label="Add Task" icon={Plus} onClick={()=>openModal("task",{workerId:worker.id})}/>}
      </div>
      <Tabs tabs={[{label:`Tasks (${wt.length})`,value:"tasks"},{label:`Sheets (${ws.length})`,value:"sheets"},{label:`Projects (${wProjs.length})`,value:"projects"}]} active={tab} onChange={setTab}/>
      {tab==="tasks" && (wt.length===0 ? <Empty icon={CheckSquare} msg="No tasks assigned"/> :
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {wt.map(task=>{
            const proj=projects.find(p=>p.id===task.projectId); const sh=sheets.find(s=>s.id===task.sheetId);
            return (
              <div key={task.id} className="row-item" onClick={()=>openTask(task)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#0c0c14", border:"1px solid #181826", borderRadius:10, cursor:"pointer" }}>
                <div style={{ width:7,height:7,borderRadius:"50%",background:task.status==="Done"?"#34d399":task.status==="In Progress"?"#60a5fa":"#fbbf24",flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"#e2e2f0" }}>{task.title}</div>
                  <div style={{ fontSize:10, color:"#555568", marginTop:1 }}>{proj?.name}{sh?` · ${sh.name}`:""}</div>
                  <CreatedAt ts={task.createdAt}/>
                </div>
                <Badge label={task.status} style={{ ...stStyle(task.status), fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:99, flexShrink:0 }}/>
                {isAdmin && <button onClick={e=>{e.stopPropagation();onDeleteTask(task.id);}} style={{ background:"none",border:"none",color:"#555568",cursor:"pointer",display:"flex",padding:3 }}><Trash2 size={12}/></button>}
                <ChevronRight size={12} color="#22222e"/>
              </div>
            );
          })}
        </div>
      )}
      {tab==="sheets" && (ws.length===0 ? <Empty msg="No sheets assigned"/> :
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {ws.map(s=><SheetRow key={s.id} sheet={s} sheetTypes={sheetTypes} workers={workers} projects={projects} isAdmin={isAdmin} onEdit={()=>onEdit&&onEdit("sheet",s)} onDelete={()=>onDeleteSheet(s.id)} onManageWorkers={()=>onManageWorkers(s)} onNavigate={navigate}/>)}
        </div>
      )}
      {tab==="projects" && (wProjs.length===0 ? <Empty icon={Folder} msg="No projects assigned"/> :
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:9 }}>
          {wProjs.map(p=><ProjectCard key={p.id} project={p} sheetCount={sheets.filter(s=>s.projectId===p.id).length} onClick={()=>navigate("project",{projectId:p.id})} isAdmin={false}/>)}
        </div>
      )}
    </div>
  );
};

// ─── WORKER DASHBOARD ─────────────────────────────────────────────────────────
const WorkerDashboard = ({ data, currentUser, openTask }) => {
  const { tasks, sheets, projects, sheetTypes, workers } = data;
  const worker = workers.find(w=>w.id===currentUser.workerId);
  if (!worker) return <Empty msg="Worker not found"/>;
  const wt = tasks.filter(t=>t.workerId===worker.id);
  // Fix 4: only sheets assigned to this worker
  const ws = sheets.filter(s=>(s.workerIds||[]).includes(worker.id));
  const [taskFilter, setTaskFilter] = useState("All");
  const [mainTab, setMainTab] = useState("tasks");

  // Fix 4: sheet type filter only from worker's own sheet types
  const myTypeIds = [...new Set(ws.map(s=>s.typeId).filter(Boolean))];
  const myTypes = sheetTypes.filter(t=>myTypeIds.includes(t.id));
  const [sheetTypeFilter, setSheetTypeFilter] = useState("");
  const [sheetPriFilter, setSheetPriFilter] = useState("");
  const filteredSheets = ws.filter(s=>{
    if (sheetTypeFilter && s.typeId!==sheetTypeFilter) return false;
    if (sheetPriFilter && s.priority!==sheetPriFilter) return false;
    return true;
  });

  const counts = { All:wt.length, Pending:wt.filter(t=>t.status==="Pending").length, "In Progress":wt.filter(t=>t.status==="In Progress").length, Done:wt.filter(t=>t.status==="Done").length };
  const filtered = taskFilter==="All" ? wt : wt.filter(t=>t.status===taskFilter);

  const StatBox = ({ label, value, accent, Icon, filter }) => (
    <div onClick={()=>{setMainTab("tasks");setTaskFilter(filter);}} className="hov-card" style={{ background:"#0e0e17", border:`1px solid ${taskFilter===filter&&mainTab==="tasks"?accent+"66":"#181826"}`, borderRadius:12, padding:"14px 16px", flex:1, minWidth:100, cursor:"pointer" }}>
      <div style={{ width:30,height:30,borderRadius:8,background:`${accent}14`,border:`1px solid ${accent}25`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:9 }}><Icon size={14} color={accent}/></div>
      <div style={{ fontSize:22, fontWeight:800, color:"#e8e8f6", fontFamily:"'Syne',sans-serif", lineHeight:1, marginBottom:3 }}>{value}</div>
      <div style={{ fontSize:10, color:"#7777a0" }}>{label}</div>
    </div>
  );

  return (
    <div className="fade-up">
      <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:20 }}>
        <Av text={worker.avatar} color="#00c896" size={44}/>
        <div>
          <h1 style={{ fontSize:19, fontWeight:800, color:"#e4e4f4", fontFamily:"'Syne',sans-serif" }}>{worker.name}</h1>
          <p style={{ fontSize:12, color:"#666680", marginTop:2 }}>{worker.role}</p>
        </div>
      </div>

      {/* Clickable stat boxes */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        <StatBox label="All Tasks"   value={counts.All}            accent="#7c5ff5" Icon={CheckSquare} filter="All"/>
        <StatBox label="In Progress" value={counts["In Progress"]} accent="#60a5fa" Icon={Clock}       filter="In Progress"/>
        <StatBox label="Pending"     value={counts.Pending}        accent="#fbbf24" Icon={AlertCircle} filter="Pending"/>
        <StatBox label="Done"        value={counts.Done}           accent="#34d399" Icon={CheckCircle} filter="Done"/>
      </div>

      <Tabs tabs={[{label:`Tasks (${wt.length})`,value:"tasks"},{label:`Sheets (${ws.length})`,value:"sheets"}]} active={mainTab} onChange={setMainTab}/>

      {mainTab==="tasks" && (
        <>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:13 }}>
            {["All","Pending","In Progress","Done"].map(f=>(
              <button key={f} onClick={()=>setTaskFilter(f)} style={{ padding:"4px 12px", borderRadius:7, border:"1px solid", cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"'Outfit',sans-serif", transition:"all 0.13s", ...(taskFilter===f?stStyle(f==="All"?"In Progress":f):{background:"transparent",color:"#7777a0",borderColor:"#1e1e2c"}) }}>
                {f} ({counts[f]||0})
              </button>
            ))}
          </div>
          {filtered.length===0 ? <Empty icon={CheckSquare} msg={`No ${taskFilter==="All"?"":taskFilter+" "}tasks`}/> :
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {filtered.map(task=>{
                const sh=sheets.find(s=>s.id===task.sheetId);
                const fmtDL=(ts)=>{ if(!ts)return null; const d=new Date(ts); const mo=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return `${d.getDate()} ${mo[d.getMonth()]}`; };
                return (
                  <div key={task.id} className="row-item" onClick={()=>openTask(task)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#0c0c14", border:"1px solid #181826", borderRadius:10, cursor:"pointer" }}>
                    <div style={{ width:7,height:7,borderRadius:"50%",background:task.status==="Done"?"#34d399":task.status==="In Progress"?"#60a5fa":"#fbbf24",flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:"#e2e2f0" }}>{task.title}</div>
                      <div style={{ fontSize:10, color:"#4a4a62", marginTop:1 }}>
                        {sh && <span style={{ color:"#4a4a62" }}>{sh.name}</span>}
                        {task.deadline && <span style={{ color:"#f87171" }}>{sh?" · ":""} Due {fmtDL(task.deadline)}</span>}
                      </div>
                      <CreatedAt ts={task.createdAt}/>
                    </div>
                    <Badge label={task.status} style={{ ...stStyle(task.status), fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:99 }}/>
                    <ChevronRight size={12} color="#22222e"/>
                  </div>
                );
              })}
            </div>
          }
        </>
      )}

      {mainTab==="sheets" && (
        <>
          {/* Fix 4: only show types that worker actually has */}
          <div style={{ display:"flex", gap:9, marginBottom:13, flexWrap:"wrap" }}>
            <select className="f-in" value={sheetTypeFilter} onChange={e=>setSheetTypeFilter(e.target.value)} style={{ width:"auto", flex:1, minWidth:130, fontSize:12, padding:"5px 10px" }}>
              <option value="">All Types</option>
              {myTypes.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <select className="f-in" value={sheetPriFilter} onChange={e=>setSheetPriFilter(e.target.value)} style={{ width:"auto", flex:1, minWidth:130, fontSize:12, padding:"5px 10px" }}>
              <option value="">All Priorities</option>
              {["High","Medium","Low"].map(p=><option key={p}>{p}</option>)}
            </select>
            {(sheetTypeFilter||sheetPriFilter) && <button onClick={()=>{setSheetTypeFilter("");setSheetPriFilter("");}} style={{ fontSize:11, color:"#f87171", background:"none", border:"none", cursor:"pointer" }}>Clear</button>}
          </div>
          {filteredSheets.length===0 ? <Empty msg="No sheets match filters"/> :
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {filteredSheets.map(s=><SheetRow key={s.id} sheet={s} sheetTypes={myTypes.concat(sheetTypes.filter(t=>!myTypeIds.includes(t.id)))} workers={workers} projects={projects} isAdmin={false}/>)}
            </div>
          }
        </>
      )}
    </div>
  );
};

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
const NotificationsPage = ({ notifications, onClear }) => (
  <div className="fade-up">
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
      <div><h1 style={{ fontSize:20, fontWeight:800, color:"#e4e4f4", fontFamily:"'Syne',sans-serif" }}>Notifications</h1><p style={{ fontSize:12, color:"#666680", marginTop:3 }}>{notifications.length} total</p></div>
      {notifications.length>0 && <Btn label="Clear All" variant="d" small icon={Trash2} onClick={onClear}/>}
    </div>
    {notifications.length===0 ? <Empty icon={Bell} msg="No notifications yet"/> : (
      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {notifications.slice().reverse().map(n=>(
          <div key={n.id} className="row-item" style={{ padding:"12px 15px", background:n.read?"#0c0c14":"rgba(124,95,245,0.05)", border:`1px solid ${n.read?"#181826":"rgba(124,95,245,0.13)"}`, borderRadius:10 }}>
            <div style={{ fontSize:13, color:n.read?"#666680":"#d0d0e8", lineHeight:1.5 }}>{n.message}</div>
            <div style={{ fontSize:10, color:"#4a4a62", marginTop:4 }}>{fmtTime(n.timestamp)}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ─── STATUS REQUESTS PAGE (admin) ─────────────────────────────────────────────
const StatusRequestsPage = ({ requests, data, onApprove, onReject, onOpenTask }) => {
  const { workers, tasks } = data;
  return (
    <div className="fade-up">
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:20, fontWeight:800, color:"#e4e4f4", fontFamily:"'Syne',sans-serif" }}>Status Requests</h1>
        <p style={{ fontSize:12, color:"#666680", marginTop:3 }}>{requests.filter(r=>r.status==="pending").length} pending · {requests.length} total</p>
      </div>
      {requests.length===0 ? <Empty icon={Send} msg="No status change requests yet"/> : (
        <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
          {requests.slice().reverse().map(req=>{
            const w=workers.find(x=>x.id===req.workerId);
            const t=tasks.find(x=>x.id===req.taskId);
            const isPending=req.status==="pending";
            return (
              <div key={req.id} style={{ background:"#0c0c14", border:`1px solid ${isPending?"rgba(124,95,245,0.25)":"#181826"}`, borderRadius:13, overflow:"hidden" }}>
                {/* Header */}
                <div style={{ padding:"12px 15px", borderBottom:"1px solid #111120", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                    <Av text={w?.avatar||"?"} color="#00c896" size={30}/>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#e2e2f0" }}>{w?.name||"Unknown"}</div>
                      <div style={{ fontSize:10, color:"#555568" }}>{fmtTime(req.timestamp)}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ fontSize:11, color:"#7777a0" }}>Wants:</div>
                    <Badge label={req.requestedStatus} style={{ ...stStyle(req.requestedStatus), fontSize:11, fontWeight:700, padding:"3px 11px", borderRadius:99 }}/>
                    <Badge label={isPending?"Awaiting Review":req.status==="approved"?"Approved":"Rejected"}
                      style={{ fontSize:10, fontWeight:600, padding:"2px 9px", borderRadius:99,
                        ...(isPending?{color:"#fbbf24",background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.2)"}:
                          req.status==="approved"?{...stStyle("Done")}:{color:"#f87171",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.15)"}) }}/>
                  </div>
                </div>
                {/* Task — clickable */}
                {t && (
                  <div className="row-item" onClick={()=>onOpenTask(t)} style={{ padding:"10px 15px", cursor:"pointer", borderBottom:"1px solid #111120", display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:7,height:7,borderRadius:"50%",background:t.status==="Done"?"#34d399":t.status==="In Progress"?"#60a5fa":"#fbbf24",flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:"#d0d0e8" }}>{t.title}</div>
                      {t.description && <div style={{ fontSize:11, color:"#555568", marginTop:2, lineHeight:1.4 }}>{t.description.slice(0,80)}{t.description.length>80?"...":""}</div>}
                    </div>
                    <Badge label={t.status} style={{ ...stStyle(t.status), fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:99, flexShrink:0 }}/>
                    <ChevronRight size={12} color="#333344"/>
                  </div>
                )}
                {/* Reason */}
                <div style={{ padding:"10px 15px", borderBottom:isPending?"1px solid #111120":"none" }}>
                  <div style={{ fontSize:10, color:"#555568", fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:5 }}>Worker's Note</div>
                  <div style={{ fontSize:12, color:"#b0b0cc", lineHeight:1.6, background:"#0a0a12", borderRadius:8, padding:"8px 11px", border:"1px solid #181826" }}>{req.reason}</div>
                </div>
                {/* Actions */}
                {isPending && (
                  <div style={{ padding:"10px 15px", display:"flex", gap:8 }}>
                    <Btn label="Approve & Set Done" variant="green" small icon={CheckCircle} onClick={()=>onApprove(req)}/>
                    <Btn label="Reject" variant="danger" small icon={X} onClick={()=>onReject(req.id)}/>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState({
    sheetTypes: SEED.sheetTypes, clients: SEED.clients, accounts: SEED.accounts,
    projects: SEED.projects, workers: SEED.workers, sheets: SEED.sheets,
    tasks: SEED.tasks, notifications: SEED.notifications,
    statusRequests: SEED.statusRequests, adminCreds: SEED.adminCreds,
    specialProjects: SEED.specialProjects, adminTasks: SEED.adminTasks,
    accountCases: SEED.accountCases, integrations: SEED.integrations,
  });
  const [nav, setNav] = useState({ view:"home", clientId:null, accountId:null, projectId:null, workerId:null });
  const [modal, setModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [taskModal, setTaskModal] = useState(null);
  const [editTaskTarget, setEditTaskTarget] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [sheetWorkerModal, setSheetWorkerModal] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const [globalTypeFilter, setGlobalTypeFilter] = useState(null);

  const isAdmin = currentUser?.role==="admin";

  const navigate = (view, ctx={}) => { setNav({view, clientId:null, accountId:null, projectId:null, workerId:null, ...ctx}); setGlobalTypeFilter(null); };
  const openModal = (type, context={}) => setModal({type, context});

  // Notifications scoped per user
  const myNotifs = useMemo(()=>{
    if (!currentUser) return [];
    if (isAdmin) return data.notifications.filter(n=>!n.targetWorkerId||n.targetWorkerId==="admin");
    return data.notifications.filter(n=>n.targetWorkerId===currentUser.workerId);
  },[data.notifications, isAdmin, currentUser]);
  const unread = myNotifs.filter(n=>!n.read).length;

  const addNotif = (message, targetWorkerId="admin") => {
    setData(d=>({...d, notifications:[...d.notifications,{id:uid(), message, timestamp:now(), read:false, targetWorkerId}]}));
  };
  const markRead = () => {
    setData(d=>({...d, notifications:d.notifications.map(n=>{
      if(isAdmin && (!n.targetWorkerId||n.targetWorkerId==="admin")) return {...n,read:true};
      if(!isAdmin && n.targetWorkerId===currentUser?.workerId) return {...n,read:true};
      return n;
    })}));
  };

  // CRUD helpers
  const addTo  = k => item => setData(d=>({...d,[k]:[...d[k],item]}));
  const delFrom= (k,id)   => setData(d=>({...d,[k]:d[k].filter(e=>e.id!==id)}));
  const updIn  = (k,id,u) => setData(d=>({...d,[k]:d[k].map(e=>e.id===id?{...e,...u}:e)}));

  const confirmDelete = (msg, onConfirm) => setConfirmModal({msg, onConfirm});

  const handleDelete = (type, id) => {
    const kmap={client:"clients",account:"accounts",project:"projects",worker:"workers",sheet:"sheets"};
    confirmDelete(`Are you sure you want to delete this ${type}? This cannot be undone.`, ()=>delFrom(kmap[type],id));
  };
  const handleSaveEdit = (type, updated) => {
    const kmap={client:"clients",account:"accounts",project:"projects",worker:"workers",sheet:"sheets"};
    updIn(kmap[type], updated.id, updated); setEditModal(null);
  };
  const handleSaveNotes = (type, id, notes) => {
    const kmap={client:"clients",account:"accounts",project:"projects"};
    updIn(kmap[type], id, {notes});
  };
  const handleUpdateTaskStatus = (taskId, newStatus, workerId) => {
    const task=data.tasks.find(t=>t.id===taskId);
    if(!task||task.status===newStatus) return;
    updIn("tasks", taskId, {status:newStatus});
    const w=data.workers.find(x=>x.id===workerId);
    addNotif(`${w?.name||"A worker"} updated task "${task.title.slice(0,40)}" status to "${newStatus}"`, "admin");
    addNotif(`Your task "${task.title.slice(0,40)}" status changed to "${newStatus}"`, workerId);
  };
  const handleEditTask = (updated) => {
    updIn("tasks", updated.id, updated);
    addNotif(`Task "${updated.title?.slice(0,40)}" was updated by admin`, updated.workerId);
    setEditTaskTarget(null); setTaskModal(null);
  };
  const handleDeleteTask = (id) => {
    const t=data.tasks.find(x=>x.id===id);
    confirmDelete(`Delete task "${t?.title?.slice(0,40)}"?`, ()=>{ delFrom("tasks",id); addNotif(`Task "${t?.title?.slice(0,40)}" was deleted by admin`, t?.workerId); });
  };
  const handleDeleteSheet = (id) => {
    const s=data.sheets.find(x=>x.id===id);
    confirmDelete(`Delete sheet "${s?.name}"?`, ()=>delFrom("sheets",id));
  };
  const handleSheetWorkerUpdate = (sheetId, workerIds) => {
    const s=data.sheets.find(x=>x.id===sheetId);
    updIn("sheets", sheetId, {workerIds});
    workerIds.forEach(wid=>{
      if(!(s?.workerIds||[]).includes(wid)){
        const w=data.workers.find(x=>x.id===wid);
        addNotif(`Admin granted you access to sheet "${s?.name}"`, wid);
      }
    });
    (s?.workerIds||[]).forEach(wid=>{
      if(!workerIds.includes(wid)){
        const w=data.workers.find(x=>x.id===wid);
        addNotif(`Your access to sheet "${s?.name}" was removed`, wid);
      }
    });
  };
  const handleSendStatusRequest = (taskId, requestedStatus, reason) => {
    const req = { id:uid(), taskId, workerId:currentUser.workerId, requestedStatus, reason, status:"pending", timestamp:now() };
    setData(d=>({...d, statusRequests:[...d.statusRequests,req]}));
    addNotif(`${currentUser.name} requested to change a task status to "${requestedStatus}": "${reason.slice(0,60)}"`, "admin");
  };
  const handleApproveRequest = (req) => {
    updIn("statusRequests", req.id, {status:"approved"});
    updIn("tasks", req.taskId, {status:req.requestedStatus});
    addNotif(`Your status change request was approved — task is now "${req.requestedStatus}"`, req.workerId);
  };
  const handleRejectRequest = (reqId) => {
    const req=data.statusRequests.find(r=>r.id===reqId);
    updIn("statusRequests", reqId, {status:"rejected"});
    addNotif(`Your status change request was rejected by admin`, req?.workerId);
  };

  // Breadcrumb
  const trail = useMemo(()=>{
    const t=[{label:"Home",onClick:()=>navigate("home")}];
    const {view,clientId,accountId,projectId,workerId}=nav;
    if(view==="clients")       t.push({label:"Clients"});
    else if(view==="workers")  t.push({label:"Workers"});
    else if(view==="all-sheets") t.push({label:"All Sheets"});
    else if(view==="all-projects") t.push({label:"All Projects"});
    else if(view==="all-accounts") t.push({label:"All Accounts"});
    else if(view==="notifications") t.push({label:"Notifications"});
    else if(view==="requests") t.push({label:"Status Requests"});
    else if(view==="special-projects") t.push({label:"Special Projects"});
    else if(view==="admin-tasks") t.push({label:"My Task Log"});
    else if(view==="account-cases") t.push({label:"Account Cases"});
    else if(view==="client"&&clientId){ const c=data.clients.find(c=>c.id===clientId); t.push({label:"Clients",onClick:()=>navigate("clients")}); t.push({label:c?.name||"Client"}); }
    else if(view==="account"&&accountId){ const a=data.accounts.find(a=>a.id===accountId); const c=data.clients.find(c=>c.id===a?.clientId); if(c)t.push({label:c.name,onClick:()=>navigate("client",{clientId:c.id})}); t.push({label:a?.name||"Account"}); }
    else if(view==="project"&&projectId){ const p=data.projects.find(p=>p.id===projectId); const a=data.accounts.find(a=>a.id===p?.accountId); const c=data.clients.find(c=>c.id===a?.clientId); if(c)t.push({label:c.name,onClick:()=>navigate("client",{clientId:c.id})}); if(a)t.push({label:a.name,onClick:()=>navigate("account",{accountId:a.id})}); t.push({label:p?.name||"Project"}); }
    else if(view==="worker"&&workerId){ const w=data.workers.find(w=>w.id===workerId); t.push({label:"Workers",onClick:()=>navigate("workers")}); t.push({label:w?.name||"Worker"}); }
    return t;
  },[nav,data]);

  const sharedAdmin = { data, navigate, openModal, onEdit:(t,e)=>setEditModal({type:t,entity:e}), onDelete:handleDelete };

  const renderView = () => {
    if (globalTypeFilter) return <TypeResults typeId={globalTypeFilter} data={data} navigate={navigate}/>;
    // Worker panel
    if (!isAdmin) {
      if (nav.view==="notifications") return <NotificationsPage notifications={myNotifs} onClear={()=>setData(d=>({...d,notifications:d.notifications.filter(n=>n.targetWorkerId!==currentUser.workerId)}))} />;
      return <WorkerDashboard data={data} currentUser={currentUser} openTask={setTaskModal}/>;
    }
    const {view,clientId,accountId,projectId,workerId}=nav;
    const sA={onDeleteSheet:handleDeleteSheet, onManageWorkers:setSheetWorkerModal};
    if(view==="home")         return <AdminHome data={data} navigate={navigate} openModal={openModal} currentUser={currentUser} setGlobalTypeFilter={setGlobalTypeFilter} setData={setData}/>;
    if(view==="clients")      return <ClientsView {...sharedAdmin}/>;
    if(view==="workers")      return <WorkersView {...sharedAdmin} isAdmin/>;
    if(view==="all-sheets")   return <AllSheetsView data={data} {...sA} onEdit={(t,e)=>setEditModal({type:t,entity:e})} navigate={navigate}/>;
    if(view==="all-projects")  return <AllProjectsView {...sharedAdmin}/>;
    if(view==="all-accounts")  return <AllAccountsView {...sharedAdmin}/>;
    if(view==="notifications") return <NotificationsPage notifications={myNotifs} onClear={()=>setData(d=>({...d,notifications:[]}))} />;
    if(view==="requests")      return <StatusRequestsPage requests={data.statusRequests} data={data} onApprove={handleApproveRequest} onReject={handleRejectRequest} onOpenTask={setTaskModal}/>;
    if(view==="special-projects") return <div className="fade-up"><div style={{ marginBottom:18 }}><h1 style={{ fontSize:20,fontWeight:800,color:"#e4e4f4",fontFamily:"'Syne',sans-serif" }}>⭐ Special Projects</h1><p style={{ fontSize:12,color:"#666680",marginTop:3 }}>{data.specialProjects?.length||0} standalone projects</p></div><SpecialProjectsBox data={data} setData={setData} navigate={navigate} openModal={openModal}/></div>;
    if(view==="admin-tasks")   return <div className="fade-up"><div style={{ marginBottom:18 }}><h1 style={{ fontSize:20,fontWeight:800,color:"#e4e4f4",fontFamily:"'Syne',sans-serif" }}>🗂️ My Task Log</h1><p style={{ fontSize:12,color:"#666680",marginTop:3 }}>Admin personal tasks with full history</p></div><AdminTaskLog data={data} setData={setData}/></div>;
    if(view==="account-cases") return <div className="fade-up"><div style={{ marginBottom:18 }}><h1 style={{ fontSize:20,fontWeight:800,color:"#e4e4f4",fontFamily:"'Syne',sans-serif" }}>⚖️ Account Cases</h1><p style={{ fontSize:12,color:"#666680",marginTop:3 }}>{data.accountCases?.length||0} cases — blockchain log</p></div><AccountCasesBox data={data} setData={setData}/></div>;
    if(view==="client"&&clientId){ const c=data.clients.find(c=>c.id===clientId); return c?<ClientView client={c} {...sharedAdmin}/>:<Empty msg="Not found"/>; }
    if(view==="account"&&accountId){ const a=data.accounts.find(a=>a.id===accountId); return a?<AccountView account={a} {...sharedAdmin} {...sA}/>:<Empty msg="Not found"/>; }
    if(view==="project"&&projectId){ const p=data.projects.find(p=>p.id===projectId); return p?<ProjectView project={p} {...sharedAdmin} {...sA}/>:<Empty msg="Not found"/>; }
    if(view==="worker"&&workerId){ const w=data.workers.find(w=>w.id===workerId); return w?<WorkerDetailView worker={w} data={data} navigate={navigate} openModal={openModal} onDeleteTask={handleDeleteTask} {...sA} openTask={setTaskModal} isAdmin/>:<Empty msg="Not found"/>; }
    return <AdminHome data={data} navigate={navigate} openModal={openModal} currentUser={currentUser} setGlobalTypeFilter={setGlobalTypeFilter} setData={setData}/>;
  };

  const renderModal = () => {
    if(!modal) return null;
    const {type,context}=modal; const close=()=>setModal(null);
    if(type==="client")  return <AddClientModal  onClose={close} onAdd={item=>{addTo("clients")(item);addNotif(`New client added: ${item.name}`,"admin");close();}}/>;
    if(type==="account") return <AddAccountModal onClose={close} onAdd={addTo("accounts")} clients={data.clients} defaultClientId={context.clientId}/>;
    if(type==="project") return <AddProjectModal onClose={close} onAdd={addTo("projects")} accounts={data.accounts} defaultAccountId={context.accountId}/>;
    if(type==="sheet")   return <AddSheetModal   onClose={close} onAdd={item=>{addTo("sheets")(item);(item.workerIds||[]).forEach(wid=>addNotif(`Admin assigned you a new sheet: "${item.name}"`,wid));close();}} projects={data.projects} workers={data.workers} sheetTypes={data.sheetTypes} defaultProjectId={context.projectId}/>;
    if(type==="worker")  return <AddWorkerModal  onClose={close} onAdd={item=>{addTo("workers")(item);close();}}/>;
    if(type==="task")    return <AddTaskModal     onClose={close} onAdd={item=>{addTo("tasks")(item);addNotif(`Admin assigned you a new task: "${item.title}"`,item.workerId);close();}} workers={data.workers} projects={data.projects} sheets={data.sheets} defaultWorkerId={context.workerId}/>;
    if(type==="types")   return <ManageTypesModal onClose={close} sheetTypes={data.sheetTypes} onAdd={t=>setData(d=>({...d,sheetTypes:[...d.sheetTypes,t]}))} onDelete={id=>setData(d=>({...d,sheetTypes:d.sheetTypes.filter(t=>t.id!==id)}))} onEdit={(id,u)=>setData(d=>({...d,sheetTypes:d.sheetTypes.map(t=>t.id===id?{...t,...u}:t)}))}/>;
    if(type==="notes")   return <NotesModal title={context.entity.name} notes={context.entity.notes||""} onClose={close} onSave={notes=>{ handleSaveNotes(context.type,context.entity.id,notes); if(context.type==="project")addNotif(`Notes updated on project: ${context.entity.name}`,null); }}/>;
    // Quick edit/delete from home dashboard
    if(type==="editClient")  return <EditClientModal client={context.entity} onClose={close} onSave={u=>handleSaveEdit("client",u)}/>;
    if(type==="editAccount") return <EditAccountModal account={context.entity} clients={data.clients} onClose={close} onSave={u=>handleSaveEdit("account",u)}/>;
    if(type==="editProject") return <EditProjectModal project={context.entity} accounts={data.accounts} onClose={close} onSave={u=>handleSaveEdit("project",u)}/>;
    if(type==="editWorker")  return <EditWorkerModal worker={context.entity} onClose={close} onSave={u=>handleSaveEdit("worker",u)}/>;
    if(type==="editSheet")   return <EditSheetModal sheet={context.entity} projects={data.projects} workers={data.workers} sheetTypes={data.sheetTypes} onClose={close} onSave={u=>handleSaveEdit("sheet",u)}/>;
    if(type==="confirmDelete") return <ConfirmModal message={`Delete ${context.type} "${context.name}"? This cannot be undone.`} onConfirm={()=>handleDelete(context.type,context.id)} onClose={close}/>;
    return null;
  };

  const renderEditModal = () => {
    if(!editModal) return null;
    const close=()=>setEditModal(null); const {type,entity}=editModal;
    if(type==="client")  return <EditClientModal  client={entity} onClose={close} onSave={u=>handleSaveEdit("client",u)}/>;
    if(type==="account") return <EditAccountModal account={entity} clients={data.clients} onClose={close} onSave={u=>handleSaveEdit("account",u)}/>;
    if(type==="project") return <EditProjectModal project={entity} accounts={data.accounts} onClose={close} onSave={u=>handleSaveEdit("project",u)}/>;
    if(type==="worker")  return <EditWorkerModal  worker={entity} onClose={close} onSave={u=>handleSaveEdit("worker",u)}/>;
    if(type==="sheet")   return <EditSheetModal   sheet={entity} projects={data.projects} workers={data.workers} sheetTypes={data.sheetTypes} onClose={close} onSave={u=>handleSaveEdit("sheet",u)}/>;
    return null;
  };

  if(!currentUser) return <><style>{CSS}</style><LoginScreen data={data} onLogin={setCurrentUser}/></>;

  const pendingRequests = data.statusRequests.filter(r=>r.status==="pending").length;

  return (
    <>
      <style>{CSS}</style>
      <div style={{ display:"flex", height:"100vh", background:"#07070c", color:"#e2e2f0", fontFamily:"'Outfit',sans-serif", overflow:"hidden" }}>
        {sideOpen && <div onClick={()=>setSideOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:998 }}/>}
        <Sidebar nav={nav} navigate={navigate} data={data} globalTypeFilter={globalTypeFilter} setGlobalTypeFilter={setGlobalTypeFilter} open={sideOpen} setOpen={setSideOpen} isAdmin={isAdmin} currentUser={currentUser}/>
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
          {/* Topbar */}
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"0 12px 0 0", borderBottom:"1px solid #111120", background:"#08080f", flexShrink:0, minHeight:44 }}>
            <button onClick={()=>setSideOpen(o=>!o)} style={{ padding:"12px 13px", background:"none", border:"none", cursor:"pointer", color:"#555568", display:"flex" }}><Menu size={15}/></button>
            <Breadcrumb trail={trail}/>
            <div style={{ flex:1 }}/>
            {/* Status requests badge (admin) */}
            {isAdmin && pendingRequests>0 && (
              <button onClick={()=>navigate("requests")} style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:7, padding:"4px 10px", color:"#f59e0b", cursor:"pointer", fontSize:11, fontWeight:600, fontFamily:"'Outfit',sans-serif" }}>
                <Send size={11}/>{pendingRequests} Request{pendingRequests>1?"s":""}
              </button>
            )}
            {/* Notif bell */}
            <button onClick={()=>{setShowNotifs(p=>!p);markRead();}} style={{ position:"relative", background:"none", border:"none", color:"#555568", cursor:"pointer", display:"flex", padding:7 }}>
              <Bell size={15}/>
              {unread>0 && <span className="notif-dot" style={{ position:"absolute",top:3,right:3,width:7,height:7,borderRadius:"50%",background:"#7c5ff5",border:"2px solid #08080f" }}/>}
            </button>
            {/* Settings (admin) */}
            {isAdmin && <button onClick={()=>setShowSettings(true)} style={{ background:"none", border:"none", color:"#555568", cursor:"pointer", display:"flex", padding:7 }}><Settings size={14}/></button>}
            {/* User chip */}
            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 9px", background:"#0c0c14", border:"1px solid #111120", borderRadius:8 }}>
              <Av text={isAdmin?"AD":initials(currentUser.name)} color={isAdmin?"#7c5ff5":"#00c896"} size={22}/>
              <span style={{ fontSize:12, color:"#555568", fontWeight:500 }}>{currentUser.name}</span>
            </div>
            <button onClick={()=>setCurrentUser(null)} title="Logout" style={{ background:"none", border:"none", color:"#555568", cursor:"pointer", display:"flex", padding:7 }}><LogOut size={13}/></button>
          </div>
          {/* Content */}
          <div style={{ flex:1, overflowY:"auto", padding:"20px 22px" }}>{renderView()}</div>
        </div>
      </div>

      {showNotifs && (
        <NotifPanel
          notifications={myNotifs}
          onClose={()=>setShowNotifs(false)}
          onClear={()=>setData(d=>({...d,notifications:d.notifications.filter(n=>{
            if(isAdmin) return n.targetWorkerId&&n.targetWorkerId!=="admin";
            return n.targetWorkerId!==currentUser.workerId;
          })}))}
          onViewAll={()=>{navigate("notifications");setShowNotifs(false);}}
        />
      )}

      {showSettings && isAdmin && (
        <SettingsModal data={data} onClose={()=>setShowSettings(false)}
          onSaveAdmin={creds=>setData(d=>({...d,adminCreds:creds}))}
          onSaveWorkerCreds={edits=>setData(d=>({...d,workers:d.workers.map(w=>{ const e=edits[w.id]; return e?{...w,name:e.name||w.name,role:e.role||w.role,password:e.password||w.password,avatar:initials(e.name||w.name)}:w; })}))}/>
      )}

      {taskModal && (
        editTaskTarget ? (
          <EditTaskModal task={editTaskTarget} workers={data.workers} projects={data.projects} sheets={data.sheets} onClose={()=>{setEditTaskTarget(null);}} onSave={handleEditTask}/>
        ) : (
          <TaskDetailModal
            task={data.tasks.find(t=>t.id===taskModal.id)||taskModal}
            data={data}
            onClose={()=>setTaskModal(null)}
            onUpdateStatus={handleUpdateTaskStatus}
            onDelete={handleDeleteTask}
            onEdit={task=>{setEditTaskTarget(task);}}
            isWorker={!isAdmin}
            currentWorkerId={currentUser.workerId}
            onSendRequest={handleSendStatusRequest}
          />
        )
      )}

      {sheetWorkerModal && (
        <SheetWorkersModal sheet={sheetWorkerModal} workers={data.workers} onClose={()=>setSheetWorkerModal(null)} onUpdate={handleSheetWorkerUpdate}/>
      )}

      {confirmModal && (
        <ConfirmModal message={confirmModal.msg} onConfirm={confirmModal.onConfirm} onClose={()=>setConfirmModal(null)}/>
      )}

      {renderModal()}
      {renderEditModal()}
    </>
  );
}
