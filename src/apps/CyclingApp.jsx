import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// ── TOKENS ───────────────────────────────────────────────────────────────────
const C = {
  bg:"#07090f", card:"#0e1220", card2:"#141926", border:"#1c2438",
  accent:"#10B981", blue:"#3B82F6", amber:"#F59E0B", red:"#EF4444",
  orange:"#F97316", purple:"#8B5CF6", text:"#F0F4FF", muted:"#5a6680", muted2:"#8896B3",
};
const ZC = ["#60A5FA","#34D399","#FBBF24","#F97316","#EF4444","#A855F7","#EC4899"];

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
const T = {
  en: {
    home:"Home", plan:"Plan", coach:"Coach", analytics:"Analytics", profile:"Profile",
    goodMorning:"Good morning,", name:"Alex",
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
    coachGreeting:"Hey Alex! I've reviewed your training data — you're at TSB +4 (fresh and ready to go hard) with CTL 72. Your FTP is up 10.9% since February. What do you want to work on today?",
    q1:"Plan my week", q2:"Analyse my performance", q3:"What should I train today?", q4:"Recovery advice",
    garmin:"Garmin Connect", strava:"Strava"
  },
  ua: {
    home:"Головна", plan:"План", coach:"Тренер", analytics:"Аналітика", profile:"Профіль",
    goodMorning:"Доброго ранку,", name:"Алекс",
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
    coachGreeting:"Привіт, Алексе! Я переглянув ваші тренувальні дані — TSB +4 (свіжий та готовий до інтенсивних тренувань), CTL 72. Ваш FTP виріс на 10.9% з лютого. Над чим хочете попрацювати?",
    q1:"Спланувати тиждень", q2:"Аналіз результатів", q3:"Що тренувати сьогодні?", q4:"Поради по відновленню",
    garmin:"Garmin Connect", strava:"Strava"
  }
};

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const PLAN = [
  {k:"mon",t:"enduranceRide",  dur:"1:30",tss:75, s:"done",    p:"65–75% FTP", z:[0,45,40,12,3,0,0]},
  {k:"tue",t:"intervalTraining",dur:"1:15",tss:92, s:"done",    p:"110–120%",   z:[0,20,10,25,35,10,0]},
  {k:"wed",t:"recoveryRide",   dur:"0:45",tss:22, s:"done",    p:"<55% FTP",   z:[65,35,0,0,0,0,0]},
  {k:"thu",t:"tempoRide",      dur:"1:00",tss:65, s:"today",   p:"76–90% FTP", z:[0,30,55,15,0,0,0]},
  {k:"fri",t:null,             dur:null,  tss:null,s:"rest"},
  {k:"sat",t:"longRide",       dur:"3:00",tss:128,s:"upcoming",p:"65–75% FTP", z:[5,60,25,8,2,0,0]},
  {k:"sun",t:"recoveryRide",   dur:"1:00",tss:32, s:"upcoming",p:"<60% FTP",   z:[55,45,0,0,0,0,0]},
];
const FTP_D = [{m:"Feb",v:248},{m:"Mar",v:255},{m:"Apr",v:258},{m:"May",v:262},{m:"Jun",v:268},{m:"Jul",v:275}];
const VOL_D = [{w:"W1",v:118},{w:"W2",v:145},{w:"W3",v:82},{w:"W4",v:162},{w:"W5",v:175},{w:"W6",v:91},{w:"W7",v:195},{w:"W8",v:148}];
const RECENT = [
  {en:"Morning Endurance",ua:"Ранкова витривалість",date:"14 Jul",km:42.3,w:218,time:"1:32",tss:75,src:"garmin"},
  {en:"Interval Session", ua:"Інтервальне тренування",date:"13 Jul",km:35.1,w:245,time:"1:15",tss:88,src:"strava"},
  {en:"Recovery Spin",    ua:"Відновлювальна їзда",  date:"12 Jul",km:22.4,w:165,time:"0:45",tss:24,src:"garmin"},
];
const PRS = [
  {en:"5s power",ua:"Потужність 5с",v:"1,124 W"},
  {en:"1 min",   ua:"1 хвилина",   v:"642 W"},
  {en:"5 min",   ua:"5 хвилин",    v:"365 W"},
  {en:"20 min",  ua:"20 хвилин",   v:"275 W"},
  {en:"Best dist.",ua:"Найдовша",  v:"198 km"},
];
const ZONE_D = [{pct:35,h:8.4},{pct:28,h:6.7},{pct:18,h:4.3},{pct:10,h:2.4},{pct:6,h:1.4},{pct:2,h:0.5},{pct:1,h:0.2}];

const SYSTEM_PROMPT = `You are an elite professional cycling coach specialising in structured training based on The Cyclist's Bible methodology.`;

// ── HELPERS ───────────────────────────────────────────────────────────────────
const ZoneBar = ({zones}) => (
  <div style={{display:"flex",height:6,borderRadius:3,overflow:"hidden",gap:1}}>
    {zones.map((p,i)=>p>0&&<div key={i} style={{flex:p,background:ZC[i],borderRadius:2}}/>)}
  </div>
);
const Badge = ({s,t}) => {
  const m={done:{bg:`${C.accent}22`,c:C.accent,l:t.completed},today:{bg:`${C.blue}22`,c:C.blue,l:t.today},upcoming:{bg:C.card2,c:C.muted2,l:t.upcoming},rest:{bg:C.card2,c:C.muted,l:t.rest}};
  const x=m[s]||m.rest;
  return <span style={{background:x.bg,color:x.c,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:600}}>{x.l}</span>;
};
const Toggle = ({on,flip}) => (
  <div onClick={flip} style={{width:44,height:24,borderRadius:12,cursor:"pointer",background:on?C.accent:C.border,position:"relative",transition:"background .2s",flexShrink:0}}>
    <div style={{position:"absolute",top:3,left:on?23:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
  </div>
);
const CTip = ({active,payload,label}) => active&&payload?.length
  ? <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 12px"}}>
      <div style={{color:C.muted,fontSize:11}}>{label}</div>
      <div style={{color:C.text,fontWeight:700}}>{payload[0].value}{payload[0].name==="ftp"?" W":" km"}</div>
    </div>
  : null;
const Row = ({children,style={}}) => <div style={{display:"flex",alignItems:"center",gap:10,...style}}>{children}</div>;
const SL = ({children}) => <div style={{color:C.muted,fontSize:11,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>{children}</div>;
const Card = ({children,style={}}) => <div style={{background:C.card,borderRadius:20,padding:14,border:`1px solid ${C.border}`,marginBottom:10,...style}}>{children}</div>;

// ── SCREENS ───────────────────────────────────────────────────────────────────
const HomeScreen = ({t,lang,gc,sc,setTab}) => (
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

    <Card style={{margin:"12px 20px 0"}}>
      <Row style={{justifyContent:"space-between",marginBottom:10}}>
        <div style={{color:C.muted,fontSize:11,textTransform:"uppercase",letterSpacing:".08em"}}>{t.todayWorkout}</div>
        <Badge s="today" t={t}/>
      </Row>
      <div style={{color:C.text,fontSize:17,fontWeight:700,marginBottom:6}}>{t.tempoRide}</div>
      <Row style={{gap:18,marginBottom:10}}>
        {[{l:t.duration,v:"1:00 h"},{l:t.tss,v:"65"},{l:t.power,v:"76–90%"}].map((m,i)=>(
          <div key={i}><div style={{color:C.text,fontSize:13,fontWeight:600}}>{m.v}</div><div style={{color:C.muted,fontSize:10}}>{m.l}</div></div>
        ))}
      </Row>
      <ZoneBar zones={[0,30,55,15,0,0,0]}/>
    </Card>
  </div>
);

const PlanScreen = ({t,selDay,setSelDay}) => {
  const sel=PLAN[selDay];
  return (
    <div style={{padding:"14px 0 12px"}}>
      <div style={{padding:"0 20px 10px"}}>
        <div style={{color:C.text,fontSize:20,fontWeight:700}}>{t.trainingPlan}</div>
        <div style={{color:C.muted,fontSize:13}}>{t.weekOf}</div>
      </div>
      <Card style={{margin:"0 20px"}}>
        <div style={{color:C.text,fontSize:15,fontWeight:700,marginBottom:8}}>{sel.s==="rest"?t.rest:(t[sel.t]||sel.t)}</div>
        <Badge s={sel.s} t={t}/>
      </Card>
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

const AnalyticsScreen = ({t}) => (
  <div style={{padding:"14px 0 12px", color: C.text}}>
    <div style={{padding:"0 20px 10px"}}>
      <div style={{fontSize:20,fontWeight:700}}>{t.performance}</div>
    </div>
    <Card style={{margin:"0 20px"}}>
      <div style={{color:C.muted,fontSize:12}}>{t.ftpTrend}</div>
      <div style={{fontSize:27,fontWeight:800}}>275 W</div>
    </Card>
  </div>
);

const ProfileScreen = ({t,lang,setLang,gc,setGc,sc,setSc}) => (
  <div style={{padding:"14px 0 12px"}}>
    <Card style={{margin:"0 20px"}}>
      <SL>{t.connectedServices}</SL>
      <Row style={{padding:"10px 0",justifyContent:"space-between"}}>
        <div>{t.garmin}</div>
        <Toggle on={gc} flip={()=>setGc(g=>!g)}/>
      </Row>
    </Card>
  </div>
);

// ── MAIN CYCLING APP EXPORT ───────────────────────────────────────────────────
export default function CyclingApp({ onBack, lang: externalLang }) {
  const [lang,setLang] = useState(externalLang || "en");
  const [tab,setTab]   = useState("home");
  const [gc,setGc]     = useState(true);
  const [sc,setSc]     = useState(true);
  const [selDay,setSelDay] = useState(3);
  const [notif,setNotif]   = useState(true);
  
  const t = T[lang];
  const isCoach = tab==="coach";

  const nav = [
    {k:"home",     l:t.home,      i:"🏠"},
    {k:"plan",     l:t.plan,      i:"📅"},
    {k:"coach",    l:t.coach,     i:"🤖"},
    {k:"analytics",l:t.analytics, i:"📊"},
    {k:"profile",  l:t.profile,   i:"👤"},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:C.bg,color:C.text,position:"relative"}}>
      {/* Верхняя кнопка возврата в Хаб */}
      <div style={{padding:"8px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", background: C.card}}>
        <button onClick={onBack} style={{background:"transparent", border:`1px solid ${C.border}`, color:C.text, borderRadius:8, padding:"4px 10px", cursor:"pointer", fontSize:11, fontWeight:600}}>
          ← Назад в хаб
        </button>
        <span style={{marginLeft:"auto", fontSize:11, color:C.accent, fontWeight:700}}>AI Cycling v2.4</span>
      </div>

      {/* Контент активного экрана велоприложения */}
      <div style={{flex:1,overflowY:isCoach?"hidden":"auto",display:"flex",flexDirection:"column"}}>
        {tab==="home"      &&<HomeScreen      t={t} lang={lang} gc={gc} sc={sc} setTab={setTab}/>}
        {tab==="plan"      &&<PlanScreen      t={t} selDay={selDay} setSelDay={setSelDay} t={t}/>}
        {tab==="coach"     &&<CoachScreen     t={t} />}
        {tab==="analytics" &&<AnalyticsScreen t={t} />}
        {tab==="profile"   &&<ProfileScreen   t={t} lang={lang} setLang={setLang} gc={gc} setGc={setGc} sc={sc} setSc={setSc} />}
      </div>

      {/* Нижняя навигация велоприложения */}
      <div style={{flexShrink:0,borderTop:`1px solid ${C.border}`,background:C.bg,display:"flex",paddingBottom:8,paddingTop:6}}>
        {nav.map(item=>(
          <div key={item.k} onClick={()=>setTab(item.k)} style={{flex:1,textAlign:"center",cursor:"pointer",padding:"2px 0"}}>
            <div style={{fontSize:17}}>{item.i}</div>
            <div style={{fontSize:9,marginTop:2,fontWeight:tab===item.k?700:400,color:tab===item.k?C.accent:C.muted}}>{item.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}