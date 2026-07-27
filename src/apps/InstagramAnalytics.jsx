import { useState } from "react";

const C = {
  bg: "#030508", card: "#0b101b", cardHover: "#111827", border: "#1a2338",
  accent: "#10B981", blue: "#3B82F6", amber: "#F59E0B", red: "#EF4444",
  purple: "#8B5CF6", pink: "#EC4899", muted: "#4e5d78", muted2: "#8896B3", 
  text: "#F8FAFC", glow: "rgba(16, 185, 129, 0.15)",
};

const T = {
  en: {
    title: "Instagram Analytics",
    subtitle: "Audience & ER monitoring",
    back: "OmbiWeb Hub",
    search: "Search accounts...",
    allTags: "All",
    followers: "Followers",
    er: "Engagement Rate",
    media: "Media",
    science: "Science",
    brand: "Brand",
    backToList: "← Back to list",
  },
  ua: {
    title: "Аналітика Instagram",
    subtitle: "Моніторинг аудиторії та ER",
    back: "OmbiWeb Хаб",
    search: "Пошук акаунтів...",
    allTags: "Всі",
    followers: "Підписники",
    er: "Рівень залученості",
    media: "Медіа",
    science: "Наука",
    brand: "Бренд",
    backToList: "← Назад до списку",
  }
};

const INITIAL_PROFILES = [
  { id: 1, name: "National Geographic", username: "@natgeo", followers: 280450000, er: 3.4, tagKey: "media" },
  { id: 2, name: "NASA", username: "@nasa", followers: 97800000, er: 4.1, tagKey: "science" },
  { id: 3, name: "Nike", username: "@nike", followers: 306000000, er: 2.8, tagKey: "brand" },
];

const fmt = n =>
  n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" :
  n >= 1_000     ? (n / 1_000).toFixed(1) + "k"     : String(Math.round(n));

export default function InstagramAnalyticsModule({ onBack, lang = "en" }) {
  const [profiles] = useState(INITIAL_PROFILES);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [activeProfileId, setActiveProfileId] = useState(null);

  const t = T[lang] || T.en;
  const tags = ["all", "media", "science", "brand"];
  const tagLabels = { all: t.allTags, media: t.media, science: t.science, brand: t.brand };

  const filtered = profiles.filter(p => {
    const matchesTag = selectedTag === "all" || p.tagKey === selectedTag;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.username.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C.bg, color: C.text, position: "relative" }}>
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", background: C.card, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
          ← {t.back}
        </button>
        <span style={{ marginLeft: "auto", fontSize: 11, color: C.pink, fontWeight: 700 }}>Instagram v1.0</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {activeProfile ? (
          <div>
            <button onClick={() => setActiveProfileId(null)} style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 11, marginBottom: 16, fontWeight: 600 }}>
              {t.backToList}
            </button>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{activeProfile.name}</div>
              <div style={{ color: C.muted, fontSize: 12, marginBottom: 16 }}>{activeProfile.username}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: C.cardHover, padding: 12, borderRadius: 12, border: `1px solid ${C.border}` }}>
                  <div style={{ color: C.muted, fontSize: 10, textTransform: "uppercase" }}>{t.followers}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginTop: 4 }}>{fmt(activeProfile.followers)}</div>
                </div>
                <div style={{ background: C.cardHover, padding: 12, borderRadius: 12, border: `1px solid ${C.border}` }}>
                  <div style={{ color: C.muted, fontSize: 10, textTransform: "uppercase" }}>{t.er}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.pink, marginTop: 4 }}>{activeProfile.er}%</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: C.text, fontSize: 20, fontWeight: 800, letterSpacing: "-.02em" }}>{t.title}</div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{t.subtitle}</div>
            </div>

            <input 
              type="text" 
              placeholder={t.search} 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none", marginBottom: 12 }}
            />

            <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
              {tags.map(tag => (
                <button 
                  key={tag} 
                  onClick={() => setSelectedTag(tag)} 
                  style={{ background: selectedTag === tag ? C.pink : C.card, color: selectedTag === tag ? "#fff" : C.muted, border: `1px solid ${selectedTag === tag ? C.pink : C.border}`, borderRadius: 10, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  {tagLabels[tag]}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {filtered.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => setActiveProfileId(p.id)} 
                  style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 14, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <div>
                    <div style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                    <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{p.username}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: C.text, fontSize: 13, fontWeight: 800 }}>{fmt(p.followers)}</div>
                    <div style={{ color: C.pink, fontSize: 11, fontWeight: 700, marginTop: 2 }}>{p.er}% ER</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}