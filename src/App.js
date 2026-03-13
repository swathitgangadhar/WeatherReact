import { useState, useEffect } from "react";

const API_KEY = "fcf4eeffbeb6d7effdb9fdbd5a8388f8";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--blur:blur(18px);--trans:all .5s cubic-bezier(.22,1,.36,1);--shadow:0 24px 60px rgba(0,0,0,.35);--fn-d:'DM Serif Display',Georgia,serif;--fn-b:'DM Sans',system-ui,sans-serif;}
body{font-family:var(--fn-b)}
.wxbg-sunny{background:linear-gradient(160deg,#fbbf24 0%,#f59e0b 22%,#0ea5e9 60%,#0284c7 100%)}
.wxbg-night{background:linear-gradient(180deg,#0a0e27 0%,#0f1c3f 45%,#1a2a5e 100%)}
.wxbg-cloudy{background:linear-gradient(155deg,#94a3b8 0%,#64748b 50%,#475569 100%)}
.wxbg-rain{background:linear-gradient(175deg,#1e3a5f 0%,#1e293b 55%,#0f172a 100%)}
.wxbg-thunder{background:linear-gradient(170deg,#1a0535 0%,#2d1b69 38%,#0f0a1e 100%)}
.wxbg-snow{background:linear-gradient(165deg,#dbeafe 0%,#bfdbfe 38%,#93c5fd 65%,#60a5fa 100%)}
.wxbg-fog{background:linear-gradient(160deg,#9ca3af 0%,#6b7280 55%,#4b5563 100%)}
.particles{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:0}
.raindrop{position:absolute;top:-20px;width:1.5px;background:linear-gradient(to bottom,transparent,rgba(147,197,253,.65));border-radius:2px;animation:rain linear infinite}
@keyframes rain{to{transform:translateY(110vh);opacity:0}}
.snowflake{position:absolute;top:-20px;color:rgba(255,255,255,.8);animation:snowf linear infinite}
@keyframes snowf{0%{transform:translateY(-20px) translateX(0) rotate(0);opacity:0}10%{opacity:.9}90%{opacity:.8}100%{transform:translateY(108vh) translateX(35px) rotate(360deg);opacity:0}}
.sunglow{position:fixed;top:-80px;right:-80px;width:320px;height:320px;background:radial-gradient(circle,rgba(253,224,71,.45) 0%,rgba(251,191,36,.18) 48%,transparent 72%);border-radius:50%;animation:glow 3.5s ease-in-out infinite;pointer-events:none;z-index:0}
.sunray{position:fixed;top:-60px;right:-60px;width:350px;height:350px;background:conic-gradient(from 200deg,transparent 0deg,rgba(255,235,80,.07) 7deg,transparent 14deg,rgba(255,235,80,.06) 22deg,transparent 29deg,rgba(255,235,80,.09) 37deg,transparent 44deg);border-radius:50%;animation:spin 20s linear infinite;pointer-events:none;z-index:0}
@keyframes glow{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.12);opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
.star{position:absolute;background:white;border-radius:50%;animation:twinkle ease-in-out infinite}
@keyframes twinkle{0%,100%{opacity:.15;transform:scale(.7)}50%{opacity:1;transform:scale(1.5)}}
.lightning{position:fixed;inset:0;pointer-events:none;z-index:1;animation:flash 8s ease infinite}
@keyframes flash{0%,87%,91%,95%,100%{background:rgba(200,180,255,0)}88%{background:rgba(200,180,255,.22)}90%{background:rgba(200,180,255,.05)}94%{background:rgba(200,180,255,.12)}}
.wx-page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:48px 16px 64px;transition:background 1.2s ease}
.wx-content{position:relative;z-index:10;width:100%;max-width:560px}
.wx-input{font-family:var(--fn-b);background:rgba(255,255,255,.13);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border:1px solid rgba(255,255,255,.22);border-radius:999px;color:white;padding:14px 22px;font-size:15px;outline:none;transition:var(--trans);width:100%}
.wx-input::placeholder{color:rgba(255,255,255,.35)}
.wx-input:focus{border-color:rgba(255,255,255,.55);background:rgba(255,255,255,.18);box-shadow:0 0 0 3px rgba(255,255,255,.08)}
.wx-btn{font-family:var(--fn-b);font-weight:600;font-size:14px;letter-spacing:.04em;background:white;color:#0f172a;border:none;border-radius:999px;padding:14px 28px;cursor:pointer;transition:var(--trans);white-space:nowrap}
.wx-btn:hover{background:rgba(255,255,255,.9);transform:translateY(-1px)}
.wx-btn:active{transform:scale(.97)}
.wx-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.wx-card{position:relative;z-index:10;background:rgba(255,255,255,.13);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border:1px solid rgba(255,255,255,.22);border-radius:28px;box-shadow:var(--shadow);transition:var(--trans);overflow:hidden;margin-bottom:24px}
.wx-card:hover{transform:translateY(-2px);box-shadow:0 32px 72px rgba(0,0,0,.4)}
.wx-card.dark{background:rgba(0,0,0,.22);border-color:rgba(255,255,255,.10)}
.wx-card.light{background:rgba(255,255,255,.3);border-color:rgba(255,255,255,.55);color:#1e293b}
.wx-card.light .lbl,.wx-card.light .muted{color:rgba(15,23,42,.45)}
.wx-card.light .val,.wx-card.light .cname,.wx-card.light .tempn{color:#0f172a}
.wx-stat{background:rgba(255,255,255,.10);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:14px 16px;transition:var(--trans)}
.wx-stat:hover{background:rgba(255,255,255,.18)}
.tempn{font-family:var(--fn-d);font-style:italic;font-size:clamp(72px,16vw,108px);line-height:1;color:white;text-shadow:0 4px 30px rgba(0,0,0,.18)}
.cname{font-family:var(--fn-d);font-size:clamp(20px,4.5vw,28px);font-weight:400;color:white}
.lbl{font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.42)}
.val{font-size:22px;font-weight:600;color:white}
.muted{font-size:11px;color:rgba(255,255,255,.38)}
.bar-track{height:5px;background:rgba(255,255,255,.12);border-radius:999px;overflow:hidden;margin-top:8px}
.bar-fill{height:100%;border-radius:999px;transition:width 1s cubic-bezier(.22,1,.36,1)}
.uv-low{color:#4ade80}.uv-mod{color:#facc15}.uv-high{color:#fb923c}.uv-vh{color:#f87171}.uv-ext{color:#c084fc}
.bl{background:#4ade80}.bm{background:#facc15}.bh{background:#fb923c}.bvh{background:#f87171}.be{background:#c084fc}
.fc-cell{background:rgba(255,255,255,.10);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.13);border-radius:16px;padding:10px 6px;text-align:center;transition:var(--trans)}
.fc-cell:hover{background:rgba(255,255,255,.18)}
.fc-cell.light{background:rgba(0,0,0,.08);border-color:rgba(0,0,0,.1);color:#0f172a}
.wx-close{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.20);color:white;font-size:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:var(--trans)}
.wx-close:hover{background:rgba(239,68,68,.5);border-color:rgba(239,68,68,.4)}
`;

const getTheme = (cond, isDay) => {
  const c = (cond || "").toLowerCase();
  if (c.includes("thunder") || c.includes("storm")) return { bg:"wxbg-thunder", card:"dark",  icon:"⛈️", type:"thunder" };
  if (c.includes("snow") || c.includes("sleet"))     return { bg:"wxbg-snow",    card:"light", icon:"❄️", type:"snow" };
  if (c.includes("rain") || c.includes("drizzle"))   return { bg:"wxbg-rain",    card:"dark",  icon:"🌧️", type:"rain" };
  if (c.includes("mist") || c.includes("fog") || c.includes("haze")) return { bg:"wxbg-fog", card:"dark", icon:"🌫️", type:"fog" };
  if (c.includes("cloud") || c.includes("overcast")) return { bg:"wxbg-cloudy",  card:"",      icon:"☁️", type:"cloudy" };
  if (!isDay) return { bg:"wxbg-night", card:"dark", icon:"🌙", type:"night" };
  return         { bg:"wxbg-sunny", card:"", icon:"☀️", type:"sunny" };
};

const windDir = (deg) => { if (deg==null) return ""; return ["N","NE","E","SE","S","SW","W","NW"][Math.round(deg/45)%8]; };

const uvInfo = (uv) => {
  if (uv==null) return null;
  if (uv<=2)  return { label:"Low",       cls:"uv-low", bar:"bl",  w:Math.round(uv*9) };
  if (uv<=5)  return { label:"Moderate",  cls:"uv-mod", bar:"bm",  w:Math.round(uv*9) };
  if (uv<=7)  return { label:"High",      cls:"uv-high",bar:"bh",  w:Math.round(uv*9) };
  if (uv<=10) return { label:"Very High", cls:"uv-vh",  bar:"bvh", w:Math.min(uv*9,100) };
  return             { label:"Extreme",   cls:"uv-ext", bar:"be",  w:100 };
};

const Particles = ({ type }) => {
  const items = [];
  if (type === "rain" || type === "thunder") {
    for (let i=0;i<40;i++) items.push(<div key={i} className="raindrop" style={{ left:`${Math.random()*100}%`, height:`${12+Math.random()*22}px`, animationDuration:`${0.35+Math.random()*0.45}s`, animationDelay:`${Math.random()*2}s` }}/>);
    if (type==="thunder") items.push(<div key="lx" className="lightning"/>);
  }
  if (type === "snow") for (let i=0;i<28;i++) items.push(<div key={i} className="snowflake" style={{ left:`${Math.random()*100}%`, animationDuration:`${3+Math.random()*4}s`, animationDelay:`${Math.random()*5}s`, fontSize:`${10+Math.random()*10}px` }}>❄</div>);
  if (type === "night") for (let i=0;i<55;i++) items.push(<div key={i} className="star" style={{ left:`${Math.random()*100}%`, top:`${Math.random()*70}%`, width:`${1+Math.random()*2}px`, height:`${1+Math.random()*2}px`, animationDuration:`${1+Math.random()*2.5}s`, animationDelay:`${Math.random()*3}s` }}/>);
  if (type === "sunny") { items.push(<div key="sg" className="sunglow"/>); items.push(<div key="sr" className="sunray"/>); }
  return <div className="particles">{items}</div>;
};

const WeatherCard = ({ city, onRemove }) => {
  const [forecast, setForecast] = useState([]);
  const [uv, setUV] = useState(null);
  const [loading, setLoading] = useState(true);
  const isDay = city.dt > city.sys.sunrise && city.dt < city.sys.sunset;
  const theme = getTheme(city.weather[0].main, isDay);
  const uvMeta = uvInfo(uv);
  const dir = windDir(city.wind.deg);
  const isLight = theme.card === "light";

  useEffect(() => {
    (async () => {
      try {
        const [fr,or] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city.name}&units=metric&cnt=5&appid=${API_KEY}`),
          fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`),
        ]);
        if (fr.ok) { const d=await fr.json(); setForecast(d.list.slice(0,5)); }
        if (or.ok) { const d=await or.json(); setUV(d.current?.uvi??null); }
      } catch(_) {}
      setLoading(false);
    })();
  }, [city.name]);

  return (
    <div className={`wx-card ${theme.card}`}>
      <div style={{ padding:"24px 24px 10px", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <span style={{ fontSize:44, lineHeight:1 }}>{theme.icon}</span>
          <div>
            <div className="cname">{city.name}, {city.sys.country}</div>
            <div className="muted" style={{ marginTop:2, fontSize:13, textTransform:"capitalize" }}>{city.weather[0].description}</div>
          </div>
        </div>
        <button className="wx-close" onClick={() => onRemove(city.name)}>✕</button>
      </div>

      <div style={{ padding:"0 24px 16px", display:"flex", alignItems:"flex-end", gap:16 }}>
        <span className="tempn">{Math.round(city.main.temp)}°</span>
        <div style={{ paddingBottom:12 }} className="muted">
          <div>Feels {Math.round(city.main.feels_like)}°C</div>
          <div>↑ {Math.round(city.main.temp_max)}° &nbsp;↓ {Math.round(city.main.temp_min)}°</div>
        </div>
      </div>

      <div style={{ padding:"0 16px 16px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <div className="wx-stat">
          <div className="lbl">💧 Humidity</div>
          <div className="val" style={{ marginTop:6 }}>{city.main.humidity}%</div>
          <div className="bar-track"><div className="bar-fill" style={{ width:`${city.main.humidity}%`, background:"#60a5fa" }}/></div>
        </div>
        <div className="wx-stat">
          <div className="lbl">💨 Wind</div>
          <div className="val" style={{ marginTop:6 }}>{city.wind.speed} <span style={{ fontSize:13, fontWeight:400 }}>m/s</span></div>
          <div className="muted" style={{ marginTop:5 }}>{dir && `${dir} · `}Gusts {city.wind.gust?.toFixed(1)??"—"}</div>
        </div>
        <div className="wx-stat">
          <div className="lbl">🌞 UV Index</div>
          {!loading && uvMeta ? (
            <>
              <div className={`val ${uvMeta.cls}`} style={{ marginTop:6 }}>{uv?.toFixed(1)}</div>
              <div className="bar-track"><div className={`bar-fill ${uvMeta.bar}`} style={{ width:`${uvMeta.w}%` }}/></div>
              <div className={`muted ${uvMeta.cls}`} style={{ marginTop:5 }}>{uvMeta.label}</div>
            </>
          ) : <div className="muted" style={{ marginTop:6 }}>{loading?"Loading…":"N/A"}</div>}
        </div>
        <div className="wx-stat">
          <div className="lbl">🌡 Pressure</div>
          <div className="val" style={{ marginTop:6 }}>{city.main.pressure} <span style={{ fontSize:13, fontWeight:400 }}>hPa</span></div>
          {city.visibility && <div className="muted" style={{ marginTop:5 }}>Vis: {(city.visibility/1000).toFixed(1)} km</div>}
        </div>
      </div>

      {!loading && forecast.length > 0 && (
        <div style={{ padding:"0 16px 20px" }}>
          <div className="lbl" style={{ paddingLeft:2, marginBottom:10 }}>5-Step Forecast</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
            {forecast.map((f,i) => {
              const t = new Date(f.dt*1000);
              const lbl = i===0 ? "Now" : t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
              const fi = getTheme(f.weather[0].main,true).icon;
              return (
                <div key={f.dt} className={`fc-cell ${isLight?"light":""}`}>
                  <div className="muted" style={{ fontSize:10 }}>{lbl}</div>
                  <div style={{ fontSize:20, margin:"6px 0" }}>{fi}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:isLight?"#0f172a":"white" }}>{Math.round(f.main.temp)}°</div>
                  <div className="muted" style={{ fontSize:10, marginTop:2 }}>{f.main.humidity}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [cities, setCities] = useState([]);
  const [query, setQuery] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const activeBg = weatherData.length
    ? (() => { const w=weatherData[0]; const isDay=w.dt>w.sys.sunrise&&w.dt<w.sys.sunset; return getTheme(w.weather[0].main,isDay); })()
    : { bg:"wxbg-night", type:"night" };

  const fetchWeather = async (city) => {
    setBusy(true); setError("");
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
      if (res.ok) { const d=await res.json(); setWeatherData(p=>[d,...p]); setCities(p=>[city.toLowerCase(),...p]); }
      else setError("City not found — please try again.");
    } catch { setError("Network error. Check your connection."); }
    setBusy(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryTrim = query.trim();
    if (!queryTrim) return;
    if (cities.includes(queryTrim.toLowerCase())) { setError("Already showing that city."); return; }
    fetchWeather(queryTrim); setQuery("");
  };

  const removeCity = (name) => {
    setWeatherData(p=>p.filter(c=>c.name!==name));
    setCities(p=>p.filter(c=>c!==name.toLowerCase()));
  };

  return (
    <>
      <style>{CSS}</style>
      <div className={`wx-page ${activeBg.bg}`}>
        <Particles type={activeBg.type} />
        <div className="wx-content">
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <h1 style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontStyle:"italic", fontSize:"clamp(36px,8vw,52px)", fontWeight:400, color:"white", letterSpacing:"0.06em", textShadow:"0 4px 24px rgba(0,0,0,.25)" }}>Weather</h1>
            <p style={{ color:"rgba(255,255,255,.42)", fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase", marginTop:4 }}>Live Conditions</p>
          </div>
          <form onSubmit={handleSearch} style={{ display:"flex", gap:8, marginBottom:12 }}>
            <input className="wx-input" value={query} onChange={e=>{setQuery(e.target.value);setError("");}} placeholder="Search any city…"/>
            <button className="wx-btn" type="submit" disabled={busy}>{busy?"…":"Search"}</button>
          </form>
          {error && <p style={{ color:"#fca5a5", fontSize:13, textAlign:"center", marginBottom:14 }}>{error}</p>}
          {weatherData.map(city=><WeatherCard key={city.id} city={city} onRemove={removeCity}/>)}
          {weatherData.length===0 && !busy && (
            <div style={{ textAlign:"center", color:"rgba(255,255,255,.22)", marginTop:80 }}>
              <div style={{ fontSize:64, marginBottom:16 }}>🌍</div>
              <div style={{ fontSize:16, fontWeight:300 }}>Search a city to see live weather</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
