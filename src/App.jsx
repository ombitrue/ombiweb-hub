import { useState, useEffect } from "react";

// ── TOKENS (OmbiWeb Cyber-Glass / iOS SpringBoard Grid Aesthetics) ─────────────
const C = {
  bg: "#030508", card: "#0b101b", cardHover: "#111827", border: "#1a2338",
  accent: "#10B981", blue: "#3B82F6", amber: "#F59E0B", red: "#EF4444",
  orange: "#F97316", purple: "#8B5CF6", muted: "#4e5d78", muted2: "#8896B3", 
  text: "#F8FAFC", glow: "rgba(16, 185, 129, 0.15)", danger: "#EF4444",
};

// ── HUB TRANSLATIONS ──────────────────────────────────────────────────────────
const T = {
  en: {
    operator: "Operator",
    hubStatus: "Neural Grid Online",
    allServices: "Ecosystem Modules",
    analytics: "Analytics",
    settings: "Settings",
    back: "Back to Grid",
    activeModule: "Active Module Telemetry",
    operational: "Container status: Operational and synchronized with OmbiWeb gateway.",
    launch: "Initialize Interface",
    totalThroughput: "Total Throughput",
    throughputDesc: "All micro-apps operating within nominal limits. Zero latency spikes detected.",
    activeMemory: "Active Memory Allocations",
    appearance: "Appearance",
    deepGlass: "Cybernetic Glass",
    deepGlassDesc: "Enhanced neon reflections and depth mapping",
    telemetry: "Telemetry Stream",
    telemetryDesc: "Send performance diagnostics to mainframe",
    connect: "Direct Communications",
    connectDesc: "Secure channels to developer and repository",
    tg: "Telegram Secure Channel",
    gh: "GitHub Source Repository",
    addModule: "Add Module",
    moduleName: "Module Name",
    moduleDesc: "Description",
    cancel: "Cancel",
    create: "Deploy Module",
  },
  ua: {
    operator: "Оператор",
    hubStatus: "Нейромережа активна",
    allServices: "Модулі екосистеми",
    analytics: "Аналітика",
    settings: "Налаштування",
    back: "Назад до сітки",
    activeModule: "Телеметрія активного модуля",
    operational: "Статус контейнера: Працездатний, синхронізований з шлюзом OmbiWeb.",
    launch: "Ініціалізувати інтерфейс",
    totalThroughput: "Загальна пропускна здатність",
    throughputDesc: "Усі мікрододатки працюють у межах норм. Затримок не виявлено.",
    activeMemory: "Розподіл оперативної пам'яті",
    appearance: "Зовнішній вигляд",
    deepGlass: "Кібернетичне скло",
    deepGlassDesc: "Покращені неонові відблиски та мапа глибини",
    telemetry: "Потік телеметрії",
    telemetryDesc: "Відправляти діагностику продуктивності на мейнфрейм",
    connect: "Зв'язок та контакти",
    connectDesc: "Захищені канали до розробника та сховища",
    tg: "Захищений Telegram канал",
    gh: "Вихідний код GitHub",
    addModule: "Додати модуль",
    moduleName: "Назва модуля",
    moduleDesc: "Опис",
    cancel: "Скасувати",
    create: "Розгорнути модуль",
  }
};

// ── INITIAL APPS DATA ─────────────────────────────────────────────────────────
const INITIAL_APPS = [
  { id: "cycling", name: "AI Cycling", desc: "Structured training", v: "v2.4", stats: "CTL 72 · TSB +4" },
  { id: "tasks", name: "Neural Tasks", desc: "AI workflow", v: "v1.1", stats: "12 pending tasks" },
  { id: "crypto", name: "Vault Alpha", desc: "Asset monitor", v: "v3.0", stats: "+14.2% APY" },
  { id: "notes", name: "Secure Sync", desc: "Knowledge base", v: "v1.0", stats: "Encrypted vault" },
];

// ── UI HELPERS ────────────────────────────────────────────────────────────────
const Row = ({ children, style = {} }) => <div style={{ display: "flex", alignItems: "center", gap: 10, ...style }}>{children}</div>;
const SL = ({ children }) => <div style={{ color: C.muted, fontSize: 10, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 10, fontWeight: 700 }}>{children}</div>;
const Toggle = ({ on, flip }) => (
  <div onClick={flip} style={{ width: 38, height: 20, borderRadius: 10, cursor: "pointer", background: on ? C.accent : C.border, position: "relative", transition: "background .2s", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
  </div>
);

// Futuristic SVG Icons
const Icons = {
  cycling: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="5.5" cy="18.5" r="3.5"/><circle cx="18.5" cy="18.5" r="3.5"/><path d="M12 19V6.4a2 2 0 0 0-2-2H6m6 5l4-4m0 0h3m-3 0v3"/></svg>,
  tasks: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4"/></svg>,
  crypto: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  notes: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  hub: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>,
  analytics: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 3v18h18M7 16l4-4 4 4 5-6"/></svg>,
  settings: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  external: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>,
  plus: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>,
  trash: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
};

// ── CYCLING APP TOKENS & TRANSLATIONS ─────────────────────────────────────────
const ZC = ["#60A5FA","#34D399","#FBBF24","#F97316","#EF4444","#A855F7","#EC4899"];

const CyclingT = {
  en: {
    home:"Home", plan:"Plan", coach:"Coach", analytics:"Analytics", profile:"Profile",
    goodMorning:"Good morning,", name:"Ombi",
    todayWorkout:"Today's Workout", startWorkout:"Start Workout",
    weeklyVol:"Weekly vol.", tss:"TSS", load:"Load",
    recentActivities:"Recent Activities", viewAll:"View all",
    trainingPlan:"Training Plan", weekOf:"Week of Jul 14",
    rest:"Rest Day", completed:"Done", today:"Today", upcoming:"Upcoming",
    performance:"Performance", ftpTrend:"FTP Progression", zoneDistrib:"Zone Distribution",
    weeklyVolume:"Weekly Volume (km)", personalRecords:"Personal Records",
    connectedServices:"Connected Services", language:"Language",
    notifications:"Notifications", privacy:"Privacy & Data", settings:"Settings",
    power:"Power", hr:"Heart Rate", cadence:"Cadence",
    z1:"Recovery",z2:"Endurance",z3:"Tempo",z4:"Threshold",
    z5:"VO2 Max",z6:"Anaerobic",z7:"Neuromuscular",
    enduranceRide:"Endurance Ride", intervalTraining:"Interval Training",
    tempoRide:"Tempo Ride", recoveryRide:"Recovery Ride", longRide:"Long Ride",
    fresh:"Fresh", neutral:"Neutral", fatigued:"Fatigued", peak:"Peak Form",
    duration:"Duration", weekProgress:"Week Progress",
    mon:"Mon",tue:"Tue",wed:"Wed",thu:"Thu",fri:"Fri",sat:"Sat",sun:"Sun",
    notes_desc:"Workout reminders & tips", lang_desc:"App display language", priv_desc:"Manage your data",
    askCoach:"Ask your coach…", coachTitle:"AI Coach",
    coachSubtitle:"Powered by The Cyclist's Bible",
    coachGreeting:"Hey Ombi! I've reviewed your training data — you're at TSB +4 (fresh and ready to go hard) with CTL 72. Your FTP is up 10.9% since February. What do you want to work on today?",
    q1:"Plan my week", q2:"Analyse my performance", q3:"What should I train today?", q4:"Recovery advice",
    garmin:"Garmin Connect", strava:"Strava"
  },
  ua: {
    home:"Головна", plan:"План", coach:"Тренер", analytics:"Аналітика", profile:"Профіль",
    goodMorning:"Доброго ранку,", name:"Ombi",
    todayWorkout:"Тренування сьогодні", startWorkout:"Почати",
    weeklyVol:"Об'єм тижня", tss:"TSS", load:"Навантаж.",
    recentActivities:"Останні активності", viewAll:"Всі",
    trainingPlan:"План тренувань", weekOf:"Тиждень з 14 лип",
    rest:"Відпочинок", completed:"Виконано", today:"Сьогодні", upcoming:"Заплановано",
    performance:"Результати", ftpTrend:"Динаміка FTP", zoneDistrib:"Розподіл зон",
    weeklyVolume:"Тижневий об'єм (km)", personalRecords:"Особисті рекорди",
    connectedServices:"Підключені сервіси", language:"Мова",
    notifications:"Сповіщення", privacy:"Конфіденційність", settings:"Налаштування",
    power:"Потужність", hr:"Пульс", cadence:"Каденс",
    z1:"Відновлення",z2:"Витривалість",z3:"Темп",z4:"Поріг",
    z5:"МСК",z6:"Анаеробна",z7:"Нейром'язова",
    enduranceRide:"Їзда на витривалість", intervalTraining:"Інтервальне",
    tempoRide:"Темпова їзда", recoveryRide:"Відновлення", longRide:"Довга їзда",
    fresh:"Свіжа", neutral:"Нейтральна", fatigued:"Втома", peak:"Пік форми",
    duration:"Тривалість", weekProgress:"Прогрес тижня",
    mon:"Пн",tue:"Вт",wed:"Ср",thu:"Чт",fri:"Пт",sat:"Сб",sun:"Нд",
    notes_desc:"Нагадування та поради", lang_desc:"Мова відображення", priv_desc:"Управління даними",
    askCoach:"Задайте питання…", coachTitle:"AI Тренер",
    coachSubtitle:"На основі The Cyclist's Bible",
    coachGreeting:"Привіт, Ombi! Я переглянув ваші тренувальні дані — TSB +4 (свіжий та готовий до інтенсивних тренувань), CTL 72. Ваш FTP виріс на 10.9% з лютого. Над чим хочете попрацювати?",
    q1:"Спланувати тиждень", q2:"Аналіз результатів", q3:"Що тренувати сьогодні?", q4:"Поради по відновленню",
    garmin:"Garmin Connect", strava:"Strava"
  }
};

const PLAN = [
  {k:"mon",t:"enduranceRide",  dur:"1:30",tss:75, s:"done",    p:"65–75% FTP", z:[0,45,40,12,3,0,0]},
  {k:"tue",t:"intervalTraining",dur:"1:15",tss:92, s:"done",    p:"110–120%",   z:[0,20,10,25,35,10,0]},
  {k:"wed",t:"recoveryRide",   dur:"0:45",tss:22, s:"done",    p:"<55% FTP",   z:[65,35,0,0,0,0,0]},
  {k:"thu",t:"tempoRide",      dur:"1:00",tss:65, s:"today",   p:"76–90% FTP", z:[0,30,55,15,0,0,0]},
  {k:"fri",t:null,             dur:null,  tss:null,s:"rest"},
  {k:"sat",t:"longRide",       dur:"3:00",tss:128,s:"upcoming",p:"65–75% FTP", z:[5,60,25,8,2,0,0]},
  {k:"sun",t:"recoveryRide",   dur:"1:00",tss:32, s:"upcoming",p:"<60% FTP",   z:[55,45,0,0,0,0,0]},
];

// ── CYCLING SUB-COMPONENTS ────────────────────────────────────────────────    
const ZoneBar = ({zones}) => (
  <div style={{display:"flex",height:6,borderRadius:3,overflow:"hidden",gap:1}}>
    {zones.map((p,i)=>p>0&&<div key={i} style={{flex:p,background:ZC[i],borderRadius:2}}/>)}
  </div>
);

const CyclingBadge = ({s,t}) => {
  const m={done:{bg:`${C.accent}22`,c:C.accent,l:t.completed},today:{bg:`${C.blue}22`,c:C.blue,l:t.today},upcoming:{bg:C.cardHover,c:C.muted2,l:t.upcoming},rest:{bg:C.cardHover,c:C.muted,l:t.rest}};
  const x=m[s]||m.rest;
  return <span style={{background:x.bg,color:x.c,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:600}}>{x.l}</span>;
};

const CyclingCard = ({children,style={}})=> <div style={{background:C.card,borderRadius:20,padding:14,border:`1px solid ${C.border}`,marginBottom:10,...style}}>{children}</div>;
const CyclingSL = ({children}) => <div style={{color:C.muted,fontSize:11,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>{children}</div>;

const HomeScreen = ({t, gc, sc}) => (
  <div style={{padding:"0 0 12px"}}>
    <div style={{padding:"14px 20px 0"}}>
      <div style={{color:C.muted,fontSize:12}}>Thursday, 17 July · 9:41</div>
      <Row style={{justifyContent:"space-between",marginTop:4}}>
        <div style={{color:C.text,fontSize:21,fontWeight:700}}>{t.goodMorning} {t.name}</div>
        <Row style={{gap:6}}>
          {gc&&<div style={{width:8,height:8,borderRadius:"50%",background:C.blue,boxShadow:`0 0 6px ${C.blue}`}}/>}
          {sc&&<div style={{width:8,height:8,borderRadius:"50%",background:C.orange,boxShadow:`0 0 6px ${C.orange}`}}/>}
        </Row>
      </Row>
    </div>

    <div style={{margin:"14px 20px 0",borderRadius:22,overflow:"hidden",border:`1px solid ${C.accent}30`,background:`radial-gradient(ellipse at top left, ${C.accent}18 0%, ${C.bg} 65%)`}}>
      <div style={{padding:"18px 20px 16px"}}>
        <Row style={{justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{color:C.muted,fontSize:12,marginBottom:6}}>Training status</div>
            <div style={{display:"flex",alignItems:"baseline",gap:8}}>
              <span style={{color:C.accent,fontSize:52,fontWeight:900,lineHeight:1}}>+4</span>
              <div>
                <div style={{color:C.accent,fontSize:13,fontWeight:700}}>TSB · {t.fresh}</div>
                <div style={{color:C.muted,fontSize:11,marginTop:1}}>Ready to train hard</div>
              </div>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{marginBottom:8}}>
              <div style={{color:C.blue,fontSize:18,fontWeight:700}}>72</div>
              <div style={{color:C.muted,fontSize:10}}>CTL fitness</div>
            </div>
            <div>
              <div style={{color:C.amber,fontSize:18,fontWeight:700}}>68</div>
              <div style={{color:C.muted,fontSize:10}}>ATL fatigue</div>
            </div>
          </div>
        </Row>
      </div>
    </div>

    <CyclingCard style={{margin:"12px 20px 0"}}>
      <Row style={{justifyContent:"space-between",marginBottom:10}}>
        <div style={{color:C.muted,fontSize:11,textTransform:"uppercase",letterSpacing:".08em"}}>{t.todayWorkout}</div>
        <CyclingBadge s="today" t={t}/>
      </Row>
      <div style={{color:C.text,fontSize:17,fontWeight:700,marginBottom:6}}>{t.tempoRide}</div>
      <Row style={{gap:18,marginBottom:10}}>
        {[{l:t.duration,v:"1:00 h"},{l:t.tss,v:"65"},{l:t.power,v:"76–90%"}].map((m,i)=>(
          <div key={i}><div style={{color:C.text,fontSize:13,fontWeight:600}}>{m.v}</div><div style={{color:C.muted,fontSize:10}}>{m.l}</div></div>
        ))}
      </Row>
      <ZoneBar zones={[0,30,55,15,0,0,0]}/>
    </CyclingCard>
  </div>
);

const PlanScreen = ({t, selDay}) => {
  const sel = PLAN[selDay];
  return (
    <div style={{padding:"14px 0 12px"}}>
      <div style={{padding:"0 20px 10px"}}>
        <div style={{color:C.text,fontSize:20,fontWeight:700}}>{t.trainingPlan}</div>
        <div style={{color:C.muted,fontSize:13}}>{t.weekOf}</div>
      </div>
      <CyclingCard style={{margin:"0 20px"}}>
        <div style={{color:C.text,fontSize:15,fontWeight:700,marginBottom:8}}>{sel.s==="rest"?t.rest:(t[sel.t]||sel.t)}</div>
        <CyclingBadge s={sel.s} t={t}/>
      </CyclingCard>
    </div>
  );
};

const CoachScreen = ({t}) => (
  <div style={{padding:"14px 20px", color: C.text}}>
    <div style={{fontSize:18, fontWeight:700}}>{t.coachTitle}</div>
    <div style={{fontSize:13, color: C.muted, marginBottom: 15}}>{t.coachSubtitle}</div>
    <div style={{background: C.card, padding: 15, borderRadius: 14, border: `1px solid ${C.border}`, fontSize: 13, lineHeight: 1.5}}>
      {t.coachGreeting}
    </div>
  </div>
);

const CyclingAnalyticsScreen = ({t}) => (
  <div style={{padding:"14px 0 12px", color: C.text}}>
    <div style={{padding:"0 20px 10px"}}>
      <div style={{fontSize:20,fontWeight:700}}>{t.performance}</div>
    </div>
    <CyclingCard style={{margin:"0 20px"}}>
      <div style={{color:C.muted,fontSize:12}}>{t.ftpTrend}</div>
      <div style={{fontSize:27,fontWeight:800}}>275 W</div>
    </CyclingCard>
  </div>
);

const CyclingProfileScreen = ({t, gc, setGc}) => (
  <div style={{padding:"14px 0 12px"}}>
    <CyclingCard style={{margin:"0 20px"}}>
      <CyclingSL>{t.connectedServices}</CyclingSL>
      <Row style={{padding:"10px 0",justifyContent:"space-between"}}>
        <div>{t.garmin}</div>
        <Toggle on={gc} flip={()=>setGc(g=>!g)}/>
      </Row>
    </CyclingCard>
  </div>
);

const CyclingAppModule = ({ onBack, lang: externalLang }) => {
  const [lang, setLang] = useState(externalLang || "en");
  const [tab, setTab] = useState("home");
  const [gc, setGc] = useState(true);
  const [sc, setSc] = useState(true);
  const [selDay, setSelDay] = useState(3);
  
  const t = CyclingT[lang];
  const isCoach = tab === "coach";

  const nav = [
    {k:"home",     l:t.home,      i:"🏠"},
    {k:"plan",     l:t.plan,      i:"📅"},
    {k:"coach",    l:t.coach,     i:"🤖"},
    {k:"analytics",l:t.analytics, i:"📊"},
    {k:"profile",  l:t.profile,   i:"👤"},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:C.bg,color:C.text,position:"relative"}}>
      <div style={{padding:"10px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", background: C.card}}>
        <button onClick={onBack} style={{background:"transparent", border:`1px solid ${C.border}`, color:C.text, borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:11, fontWeight:600}}>
          ← OmbiWeb Hub
        </button>
        <span style={{marginLeft:"auto", fontSize:11, color:C.accent, fontWeight:700}}>AI Cycling v2.4</span>
      </div>

      <div style={{flex:1,overflowY:isCoach?"hidden":"auto",display:"flex",flexDirection:"column"}}>
        {tab==="home"      &&<HomeScreen             t={t} lang={lang} gc={gc} sc={sc} setTab={setTab}/>}
        {tab==="plan"      &&<PlanScreen             t={t} selDay={selDay} setSelDay={setSelDay}/>}
        {tab==="coach"     &&<CoachScreen            t={t}/>}
        {tab==="analytics" &&<CyclingAnalyticsScreen t={t}/>}
        {tab==="profile"   &&<CyclingProfileScreen   t={t} lang={lang} setLang={setLang} gc={gc} setGc={setGc} sc={sc} setSc={setSc}/>}
      </div>

      <div style={{flexShrink:0,borderTop:`1px solid ${C.border}`,background:C.bg,display:"flex",paddingBottom:12,paddingTop:8}}>
        {nav.map(item=>(
          <div key={item.k} onClick={()=>setTab(item.k)} style={{flex:1,textAlign:"center",cursor:"pointer",padding:"2px 0"}}>
            <div style={{fontSize:16}}>{item.i}</div>
            <div style={{fontSize:9,marginTop:2,fontWeight:tab===item.k?700:400,color:tab===item.k?C.accent:C.muted}}>{item.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AppRunnerScreen = ({ app, onBack, t, lang }) => {
  if (app.id === "cycling") {
    return <CyclingAppModule onBack={onBack} lang={lang} />;
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 20px" }}>
      <Row style={{ marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: "8px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
          ← {t.back}
        </button>
        <div style={{ marginLeft: "auto", fontSize: 11, color: C.accent, background: C.glow, border: `1px solid ${C.accent}40`, padding: "4px 10px", borderRadius: 8, fontWeight: 700 }}>
          {app.v || "v1.0"} ACTIVE
        </div>
      </Row>
      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(145deg, ${C.card}, ${C.cardHover})`, border: `1px solid ${C.accent}40`, boxShadow: `0 0 20px ${C.glow}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: C.accent }}>
          {Icons[app.id] || Icons.hub}
        </div>
        <div style={{ color: C.text, fontSize: 20, fontWeight: 800, letterSpacing: "-.02em" }}>{app.name}</div>
        <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{app.desc}</div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 18, textAlign: "center" }}>
        <div style={{ color: C.muted, fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em" }}>{t.activeModule}</div>
        <div style={{ color: C.accent, fontSize: 18, fontWeight: 800, margin: "8px 0" }}>{app.stats || "Operational node"}</div>
        <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.5 }}>{t.operational}</div>
      </div>
      <button style={{ marginTop: "auto", background: C.accent, color: "#000", border: "none", borderRadius: 16, padding: "14px", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: `0 0 20px ${C.glow}` }}>
        {t.launch}
      </button>
    </div>
  );
};

const HubScreen = ({ apps, onLaunch, lang, setLang, t, onAddApp, onDeleteApp }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddApp({
      id: "app_" + Date.now(),
      name: name.trim(),
      desc: desc.trim() || "Custom micro-app",
      v: "v1.0",
      stats: "Synchronized"
    });
    setName("");
    setDesc("");
    setShowAddModal(false);
  };

  return (
    <div style={{ padding: "16px 20px", position: "relative" }}>
      <Row style={{ justifyContent: "space-between", marginBottom: 20 }}>
        <Row style={{ gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#000" }}>
            OW
          </div>
          <div>
            <div style={{ color: C.muted, fontSize: 10, textTransform: "uppercase", letterSpacing: ".08em" }}>OmbiWeb</div>
            <div style={{ color: C.text, fontSize: 16, fontWeight: 800 }}>{t.operator}</div>
          </div>
        </Row>
        
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, display: "flex", padding: 2 }}>
          {["en", "ua"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ background: lang === l ? C.accent : "transparent", color: lang === l ? "#000" : C.muted, border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 10, fontWeight: 800, cursor: "pointer", transition: "all .15s" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </Row>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "12px 16px", marginBottom: 20, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}>
        <Row style={{ justifyContent: "space-between" }}>
          <Row style={{ gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, boxShadow: `0 0 8px ${C.accent}` }} />
            <span style={{ color: C.text, fontSize: 11, fontWeight: 700, letterSpacing: ".02em" }}>{t.hubStatus}</span>
          </Row>
          <span style={{ color: C.muted, fontSize: 10, fontFamily: "monospace" }}>v3.1-dynamic</span>
        </Row>
      </div>

      <Row style={{ justifyContent: "space-between", marginBottom: 10 }}>
        <SL>{t.allServices}</SL>
      </Row>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {apps.map(app => (
          <div 
            key={app.id} 
            style={{ 
              background: C.card, 
              border: `1px solid ${C.border}`, 
              borderRadius: 22, 
              padding: 16, 
              height: 124, 
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "space-between", 
              position: "relative",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
            }}
          >
            <Row style={{ justifyContent: "space-between" }}>
              <div onClick={() => onLaunch(app)} style={{ width: 38, height: 38, borderRadius: 12, background: C.cardHover, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, cursor: "pointer" }}>
                {Icons[app.id] || Icons.hub}
              </div>
              <Row style={{ gap: 4 }}>
                <span style={{ fontSize: 9, color: C.accent, background: C.glow, border: `1px solid ${C.accent}30`, padding: "2px 5px", borderRadius: 6, fontWeight: 700, fontFamily: "monospace" }}>
                  {app.v || "v1.0"}
                </span>
                <button onClick={(e) => { e.stopPropagation(); onDeleteApp(app.id); }} style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", padding: 2, display: "flex" }}>
                  {Icons.trash}
                </button>
              </Row>
            </Row>
            <div onClick={() => onLaunch(app)} style={{ cursor: "pointer" }}>
              <div style={{ color: C.text, fontSize: 13, fontWeight: 700, letterSpacing: "-.01em" }}>{app.name}</div>
              <div style={{ color: C.muted, fontSize: 10, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.desc}</div>
            </div>
          </div>
        ))}

        <div 
          onClick={() => setShowAddModal(true)}
          style={{ 
            background: `${C.card}80`, 
            border: `2px dashed ${C.border}`, 
            borderRadius: 22, 
            padding: 16, 
            height: 124, 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            cursor: "pointer", 
            transition: "all .2s"
          }}
        >
          <div style={{ width: 38, height: 38, borderRadius: 12, background: C.cardHover, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, marginBottom: 8 }}>
            {Icons.plus}
          </div>
          <div style={{ color: C.muted, fontSize: 11, fontWeight: 700 }}>{t.addModule}</div>
        </div>
      </div>

      {showAddModal && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(3,5,8,0.9)", backdropFilter: "blur(6px)", zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "center", padding: 24 }}>
          <div style={{ color: C.text, fontSize: 16, fontWeight: 800, marginBottom: 16 }}>{t.addModule}</div>
          <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <div style={{ color: C.muted, fontSize: 10, marginBottom: 4, textTransform: "uppercase" }}>{t.moduleName}</div>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="e.g. Weather Node" 
                style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none" }}
                autoFocus
              />
            </div>
            <div>
              <div style={{ color: C.muted, fontSize: 10, marginBottom: 4, textTransform: "uppercase" }}>{t.moduleDesc}</div>
              <input 
                type="text" 
                value={desc} 
                onChange={e => setDesc(e.target.value)} 
                placeholder="e.g. Atmospheric telemetry" 
                style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none" }}
              />
            </div>
            <Row style={{ marginTop: 12, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 12, padding: "10px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                {t.cancel}
              </button>
              <button type="submit" style={{ background: C.accent, border: "none", color: "#000", borderRadius: 12, padding: "10px 16px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                {t.create}
              </button>
            </Row>
          </form>
        </div>
      )}
    </div>
  );
};

const AnalyticsScreen = ({ t }) => (
  <div style={{ padding: "16px 20px" }}>
    <div style={{ color: C.text, fontSize: 20, fontWeight: 800, letterSpacing: "-.02em", marginBottom: 4 }}>{t.analytics}</div>
    <div style={{ color: C.muted, fontSize: 12, marginBottom: 20 }}>Cross-module resource telemetry</div>
    
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 18, marginBottom: 12 }}>
      <SL>{t.totalThroughput}</SL>
      <div style={{ color: C.accent, fontSize: 28, fontWeight: 900, margin: "4px 0", letterSpacing: "-.02em" }}>99.98%</div>
      <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.5 }}>{t.throughputDesc}</div>
    </div>

    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 18 }}>
      <SL>{t.activeMemory}</SL>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontSize: 12 }}>
        <span style={{ color: C.text, fontWeight: 600 }}>Hub Core Daemon</span>
        <span style={{ color: C.blue, fontWeight: 800, fontFamily: "monospace" }}>42 MB</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontSize: 12 }}>
        <span style={{ color: C.text, fontWeight: 600 }}>AI Neural Engine</span>
        <span style={{ color: C.accent, fontWeight: 800, fontFamily: "monospace" }}>128 MB</span>
      </div>
    </div>
  </div>
);

const SettingsScreen = ({ t }) => {
  const [deepGlass, setDeepGlass] = useState(true);
  const [telemetry, setTelemetry] = useState(true);
  return (
    <div style={{ padding: "16px 20px" }}>
      <div style={{ color: C.text, fontSize: 20, fontWeight: 800, letterSpacing: "-.02em", marginBottom: 4 }}>{t.settings}</div>
      <div style={{ color: C.muted, fontSize: 12, marginBottom: 20 }}>OmbiWeb core parameters</div>
      
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 16, marginBottom: 12 }}>
        <SL>{t.appearance}</SL>
        <Row style={{ justifyContent: "space-between", padding: "6px 0" }}>
          <div>
            <div style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>{t.deepGlass}</div>
            <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>{t.deepGlassDesc}</div>
          </div>
          <Toggle on={deepGlass} flip={() => setDeepGlass(d => !d)} />
        </Row>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 16, marginBottom: 12 }}>
        <SL>Diagnostics</SL>
        <Row style={{ justifyContent: "space-between", padding: "6px 0" }}>
          <div>
            <div style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>{t.telemetry}</div>
            <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>{t.telemetryDesc}</div>
          </div>
          <Toggle on={telemetry} flip={() => setTelemetry(t => !t)} />
        </Row>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 16 }}>
        <SL>{t.connect}</SL>
        <div style={{ color: C.muted, fontSize: 10, marginBottom: 12 }}>{t.connectDesc}</div>
        
        {[
          { label: t.tg, href: "https://t.me/ombiweb" },
          { label: t.gh, href: "https://github.com/ombitrue" }
        ].map((link, i) => (
          <a key={i} href={link.href} target="_blank" rel="noreferrer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none", color: C.text, textDecoration: "none", fontSize: 12, fontWeight: 700 }}>
            <span>{link.label}</span>
            <span style={{ color: C.accent }}>{Icons.external}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [tab, setTab] = useState("hub");
  const [lang, setLang] = useState("en");
  const [activeApp, setActiveApp] = useState(null);
  const [apps, setApps] = useState(INITIAL_APPS);
  
  // Интеграция с Telegram WebApp SDK
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand(); // Автоматически разворачивать на весь экран в Telegram
    }
  }, []);

  const t = T[lang];

  const handleAddApp = (newApp) => {
    setApps(prev => [...prev, newApp]);
  };

  const handleDeleteApp = (id) => {
    setApps(prev => prev.filter(app => app.id !== id));
  };

  const navItems = [
    { k: "hub", l: t.hubStatus.includes("активна") ? "Хаб" : "Hub", i: Icons.hub },
    { k: "analytics", l: t.analytics, i: Icons.analytics },
    { k: "settings", l: t.settings, i: Icons.settings },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100vw", height: "100vh", background: C.bg }}>
      <div style={{ width: "100%", maxWidth: 480, height: "100%", display: "flex", flexDirection: "column", background: C.bg, overflow: "hidden", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: C.text }}>
        
        {/* Top Minimal Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 20px 0", color: C.muted, fontSize: 10, flexShrink: 0, fontFamily: "monospace" }}>
          <span>OMBIWEB-OS</span>
          <span style={{ color: C.accent }}>● SECURE GRID</span>
        </div>

        {/* Dynamic Content Area */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {activeApp ? (
            <AppRunnerScreen app={activeApp} onBack={() => setActiveApp(null)} t={t} lang={lang} />
          ) : (
            <>
              {tab === "hub" && <HubScreen apps={apps} onLaunch={app => setActiveApp(app)} lang={lang} setLang={setLang} t={t} onAddApp={handleAddApp} onDeleteApp={handleDeleteApp} />}
              {tab === "analytics" && <AnalyticsScreen t={t} />}
              {tab === "settings" && <SettingsScreen t={t} />}
            </>
          )}
        </div>

        {/* Bottom Navigation */}
        {!activeApp && (
          <div style={{ flexShrink: 0, borderTop: `1px solid ${C.border}`, background: C.bg, display: "flex", paddingBottom: 14, paddingTop: 8 }}>
            {navItems.map(item => (
              <div key={item.k} onClick={() => setTab(item.k)} style={{ flex: 1, textAlign: "center", cursor: "pointer", padding: "4px 0" }}>
                <div style={{ display: "flex", justifyContent: "center", color: tab === item.k ? C.accent : C.muted, transition: "color .15s" }}>
                  {item.i}
                </div>
                <div style={{ fontSize: 9, marginTop: 3, fontWeight: tab === item.k ? 800 : 500, color: tab === item.k ? C.accent : C.muted, transition: "color .15s" }}>
                  {item.l}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}