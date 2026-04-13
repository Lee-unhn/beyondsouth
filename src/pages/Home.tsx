import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import BackgroundCanvas from '../components/BackgroundCanvas';
import { cn } from '../lib/utils';

// 在此處填入您的 Google Sheet CSV 網址
const GOOGLE_SHEET_CSV_URL = ''; 

interface Speaker {
  name: string;
  title?: string;
  company?: string;
  topic?: string;
  session?: string;
  photo?: string;
}

export default function Home() {
  const [isNavSmall, setIsNavSmall] = useState(false);
  const [sheetUrl] = useState(localStorage.getItem('bs26_sheet_url') || '');
  const [regUrl] = useState(localStorage.getItem('bs26_reg_url') || '');
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isLoadingSpeakers, setIsLoadingSpeakers] = useState(false);
  const [speakerStatus, setSpeakerStatus] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ d: '--', h: '--', m: '--', s: '--' });

  useEffect(() => {
    const handleScroll = () => setIsNavSmall(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const target = new Date('2026-06-15T09:00:00+08:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ d: '00', h: '00', m: '00', s: '00' });
        clearInterval(interval);
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({
        d: String(d).padStart(2, '0'),
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchSpeakers = async (url: string) => {
    if (!url) return;
    setIsLoadingSpeakers(true);
    try {
      const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        setSpeakers([]);
        return;
      }
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
      const data = lines.slice(1).map(line => {
        const fields: string[] = [];
        let cur = '', inQ = false;
        for (const ch of line) {
          if (ch === '"') inQ = !inQ;
          else if (ch === ',' && !inQ) { fields.push(cur.trim()); cur = ''; }
          else cur += ch;
        }
        fields.push(cur.trim());
        const obj: any = {};
        headers.forEach((h, i) => obj[h] = (fields[i] || '').replace(/^"|"$/g, '').trim());
        return obj as Speaker;
      }).filter(s => s.name);
      setSpeakers(data);
      setSpeakerStatus({ type: 'ok', msg: `✓ 成功載入 ${data.length} 位講者` });
    } catch (err: any) {
      setSpeakerStatus({ type: 'err', msg: `✗ 載入失敗：${err.message}` });
      setSpeakers([]);
    } finally {
      setIsLoadingSpeakers(false);
    }
  };

  useEffect(() => {
    if (GOOGLE_SHEET_CSV_URL) {
      fetchSpeakers(GOOGLE_SHEET_CSV_URL);
    } else if (sheetUrl) {
      fetchSpeakers(sheetUrl);
    }
  }, [sheetUrl]);

  return (
    <div className="min-h-screen">
      <BackgroundCanvas />

      {/* Nav */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[200] flex items-center justify-between transition-all duration-300 bg-bg/85 backdrop-blur-2xl border-b border-white/5",
        isNavSmall ? "py-3 px-6 md:px-12 lg:px-20 border-purple/15" : "py-4 px-6 md:px-12 lg:px-20"
      )}>
        <Link to="/" className="flex items-baseline gap-3 group">
          <span className="font-display font-bold text-base tracking-tight group-hover:text-teal transition-colors">Beyond South</span>
          <span className="text-[11px] text-teal tracking-[0.22em] font-medium">南向無界</span>
        </Link>
        <ul className="hidden md:flex gap-8 list-none">
          {['about', 'speakers', 'agenda', 'sessions'].map((item) => (
            <li key={item}>
              <Link 
                to={`/#${item}`} 
                onClick={(e) => {
                  if (window.location.pathname === '/' || window.location.hash === '' || window.location.hash === '#/') {
                    e.preventDefault();
                    document.getElementById(item)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-gray-muted hover:text-teal text-sm tracking-wider transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-teal after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                {item === 'about' ? '緣起' : item === 'speakers' ? '講者' : item === 'agenda' ? '議程' : '主題'}
              </Link>
            </li>
          ))}
        </ul>
        <Link 
          to="/background"
          className="bg-teal text-bg px-6 py-2 text-[10px] md:text-xs font-bold tracking-widest hover:bg-[#00e8cc] hover:shadow-[0_6px_24px_rgba(0,201,177,0.3)] transition-all"
        >
          活動背景
        </Link>
      </nav>

      {/* Hero */}
      <section id="hero" className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-32 pb-20 relative">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-[9px] text-teal tracking-[0.36em] mb-7 flex items-center gap-3 opacity-80 before:content-[''] before:w-7 before:h-px before:bg-teal"
        >
          2026 Annual Conference · 台南市 歸仁資安大樓
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display font-bold text-[clamp(60px,10.5vw,122px)] leading-[0.86] tracking-tighter mb-2"
        >
          Beyond<br />South
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-bold text-[clamp(26px,4.5vw,52px)] tracking-[0.38em] text-purple mb-12"
        >
          南　向　無　界
        </motion.p>

        {/* Countdown */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-11"
        >
          <div className="font-mono text-[9px] text-gray-muted tracking-[0.28em] uppercase mb-4 flex items-center justify-center gap-3 before:content-[''] before:w-6 before:h-px before:bg-gray-muted/40">
            距離年會開幕
          </div>
          <div className="flex items-stretch justify-center gap-1 md:gap-4">
            {[
              { val: timeLeft.d, label: '天' },
              { val: timeLeft.h, label: '時' },
              { val: timeLeft.m, label: '分' },
              { val: timeLeft.s, label: '秒' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1 md:gap-4">
                <div className="bg-card border border-purple/20 border-t-2 border-t-teal px-4 md:px-6 py-4 text-center min-w-[70px] md:min-w-[80px]">
                  <span className="font-mono text-3xl md:text-5xl font-bold text-teal leading-none block">{item.val}</span>
                  <small className="text-[10px] text-gray-muted tracking-wider mt-2 block">{item.label}</small>
                </div>
                {i < 3 && <div className="font-mono text-3xl text-purple/50 self-center pb-3 leading-none">:</div>}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 font-mono text-[9px] text-white/20 tracking-widest before:content-[''] before:w-4 before:h-px before:bg-white/10">
            2026 · 06 · 15
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 md:gap-4 items-center flex-wrap justify-center"
        >
          <Link 
            to="/background" 
            className="bg-teal text-bg px-8 md:px-10 py-3.5 md:py-4 text-xs md:sm font-bold tracking-widest hover:bg-[#00e8cc] hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(0,201,177,0.28)] transition-all"
          >
            了解活動背景
          </Link>
          <Link 
            to="/#speakers" 
            onClick={(e) => {
              if (window.location.pathname === '/' || window.location.hash === '' || window.location.hash === '#/') {
                e.preventDefault();
                document.getElementById('speakers')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-gray-light border-b border-white/20 py-3.5 md:py-4 text-xs md:sm tracking-widest hover:text-teal hover:border-teal hover:gap-3 flex items-center gap-2 transition-all"
          >
            查看講者 <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="absolute bottom-9 left-6 md:left-12 lg:left-20 flex items-center gap-3 font-mono text-[9px] text-white/20 tracking-widest animate-pulse">
          <div className="w-px h-8 bg-gradient-to-b from-teal to-transparent" />
          SCROLL
        </div>
      </section>

      {/* Stats */}
      <div id="stats" className="border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {[
            { num: '300', label: '名額有限', sub: '企業主 · 創辦人 · 主管' },
            { num: '6', label: '主題演講', sub: '45 min + Q&A 實戰分享' },
            { num: '1', label: '全日制年會', sub: '09:00 — 18:00' },
            { num: '台南市', label: '歸仁資安大樓', sub: '2026 · 06 · 15', isSmall: true }
          ].map((item, i) => (
            <div key={i} className="py-8 text-center border-r border-white/5 last:border-r-0 hover:bg-white/[0.02] transition-colors">
              <div className={cn("font-mono font-bold text-teal leading-none mb-2", item.isSmall ? "text-lg md:text-2xl" : "text-3xl md:text-4xl")}>{item.num}</div>
              <div className="text-xs font-medium tracking-wider mb-1">{item.label}</div>
              <div className="font-mono text-[9px] text-gray-muted tracking-wider">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <section id="about" className="py-16 md:py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 font-mono text-xs md:text-sm text-teal tracking-[0.2em] uppercase mb-4">年會緣起</div>
            <h2 className="font-bold text-3xl md:text-5xl lg:text-6xl leading-[1.08] mb-4">資源，是<span className="text-teal">越分享<br />越多的</span></h2>
            <div className="pl-6 md:pl-8 border-l-4 border-purple bg-purple/5 p-5 md:p-7 text-xs md:text-sm text-gray-light leading-relaxed mt-6">
              很多人問我：忙得焦頭爛額的人，為什麼還要自找麻煩，籌辦一場幾百人的年會？<br /><br />
              我的答案很簡單：<strong className="text-teal">因為我看見了差距，而我想縮短它。</strong><br /><br />
              來到台南生活後，我發現「資訊落差」是真實存在的成本——它不只是高鐵票錢，它是時間，它是機會。<br /><br />
              從十幾人的小聚，到現在 300 人的年會——做的所有努力，都是為了縮短那個差距。
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 font-mono text-xs md:text-sm text-teal tracking-[0.2em] uppercase mb-4">我們的堅持</div>
            <h2 className="font-bold text-3xl md:text-5xl lg:text-6xl leading-[1.08] mb-2">拒絕教科書，<br />只談<span className="text-teal">真槍實彈</span></h2>
            <p className="text-[10px] md:text-xs text-gray-muted leading-relaxed mb-6">所有議程規劃從「南部企業主最需要的答案」出發，確保每場演講都是乾貨。</p>
            <div className="flex flex-col gap-1">
              {[
                { num: '01', title: '拒絕教科書式的理論', desc: '只談市場上真槍實彈的驗證，每一個觀點都必須有第一手市場基礎。', color: 'teal' },
                { num: '02', title: '分享可執行路徑，而非名詞解釋', desc: '講者帶來的是第一線摸爬滾打後歸納的方法，場下可以直接套用。', color: 'purple' },
                { num: '03', title: '每個洞見都必須落地', desc: '有案例支撐、有結論可行動，我們對演講密度和品質設有明確標準。', color: 'pink' }
              ].map((p, i) => (
                <div key={i} className="bg-card p-4 md:p-6 flex gap-4 md:gap-5 items-start border-l-2 border-transparent hover:bg-white/[0.025] transition-all" style={{ borderLeftColor: `var(--color-${p.color})` }}>
                  <div className="font-mono text-[9px] text-gray-muted min-w-[20px] pt-1 tracking-widest">{p.num}</div>
                  <div>
                    <div className="text-xs md:text-sm font-bold mb-1">{p.title}</div>
                    <div className="text-[10px] md:text-xs text-gray-muted leading-relaxed">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Speakers */}
      <section id="speakers" className="py-24 px-6 md:px-12 lg:px-20 bg-bg-alt">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-12">
            <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08]">講者<span className="text-teal">陣容</span></h2>
            <p className="text-sm text-gray-muted leading-relaxed max-w-md">我們尋找的不是名人，而是「有第一手答案的人」——在某個領域真正踩過坑、蹚出路，願意把核心洞見清晰傳遞的實踐者。</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5">
            {speakers.length > 0 ? (
              speakers.map((s, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card group cursor-default overflow-hidden hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="h-[210px] relative overflow-hidden bg-[#0f0f28] flex items-center justify-center">
                    {s.photo ? (
                      <img src={s.photo} alt={s.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-purple/15 border border-purple/20 flex items-center justify-center text-3xl">👤</div>
                    )}
                    {s.session && <div className="absolute top-0 left-0 bg-purple text-bg font-mono text-[9px] font-bold px-2.5 py-1 tracking-wider">{s.session}</div>}
                  </div>
                  <div className={cn("h-0.5", i % 3 === 0 ? "bg-teal" : i % 3 === 1 ? "bg-purple" : "bg-pink")} />
                  <div className="p-5 pb-6">
                    <div className="text-lg font-black mb-1">{s.name}</div>
                    <div className="text-xs text-teal mb-0.5">{s.title}</div>
                    <div className="text-[11px] text-gray-muted mb-3.5">{s.company}</div>
                    {s.topic && <div className="text-xs text-gray-light leading-relaxed border-t border-white/5 pt-3">{s.topic}</div>}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-sm text-gray-muted leading-loose">
                講者陣容即將公佈<br /><span className="text-teal">敬請期待 — 持續更新中</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Agenda */}
      <section id="agenda" className="py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] mb-6">全日時程<span className="text-teal">總覽</span></h2>
            <div className="flex gap-2 flex-wrap">
              {['09:00 開放報到', '10:00 開幕', '6 場主題演講', '17:00 散場', '17:00–18:00 自由交流'].map((p, i) => (
                <div key={i} className="border border-teal/20 px-3.5 py-1.5 text-[11px] font-mono text-teal tracking-wider bg-teal/5">{p}</div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {/* Desktop Header - Only visible on XL screens */}
            <div className="hidden xl:grid xl:grid-cols-[120px_140px_1fr] gap-6 px-10 py-4 bg-purple/10 border-b border-white/5">
              {['時間', '類型', '內容'].map((h, i) => (
                <div key={i} className="text-[11px] font-mono text-teal tracking-[0.25em] uppercase font-bold">{h}</div>
              ))}
            </div>

            {[
              { t: '09:00', type: '報到', title: '開放報到、茶敘交流', style: 'adm' },
              { t: '10:00', type: '開幕', title: '開幕致詞 ／ 年會定位說明', style: 'adm' },
              { t: '10:10', type: '主題演講', title: 'Session 1｜產業轉型實戰：從 0 到 1 的數位化路徑', style: 'talk' },
              { t: '11:10', type: '主題演講', title: 'Session 2｜全通路零售佈局：打破線上線下的疆界', style: 'talk' },
              { t: '12:10', type: '休息', title: '午餐休息（90 分鐘）', style: 'brk' },
              { t: '13:40', type: '主題演講', title: 'Session 3｜品牌國際化策略：台灣品牌如何走向東南亞', style: 'talk' },
              { t: '14:40', type: '主題演講', title: 'Session 4｜CRM 驅動增長：高價值顧客的留存藝術', style: 'talk' },
              { t: '15:30', type: '休息', title: '中場休息、茶點（15 分鐘）', style: 'brk' },
              { t: '15:45', type: '主題演講', title: 'Session 5｜企業 AI 發展方向：生成式 AI 的落地應用', style: 'talk' },
              { t: '16:45', type: '主題演講', title: 'Session 6｜南部產業機會 × 挑戰：下一個十年的增長點', style: 'talk' },
              { t: '17:00', type: '交流', title: '散場 ／ 現場自由交流開始', style: 'net' },
              { t: '18:00', type: '交流', title: '活動圓滿落幕', style: 'net' }
            ].map((row, i) => (
              <div key={i} className={cn(
                "group flex flex-col xl:grid xl:grid-cols-[120px_140px_1fr] gap-3 xl:gap-6 px-4 md:px-10 py-5 xl:py-5 bg-card border-l-[4px] transition-all hover:bg-white/[0.03] hover:translate-x-1",
                row.style === 'talk' ? "border-purple" : row.style === 'net' ? "border-teal" : "border-white/10"
              )}>
                {/* Mobile: Time & Type Row */}
                <div className="flex items-center justify-between xl:justify-start xl:contents">
                  <div className={cn(
                    "font-mono text-sm md:text-base font-bold tracking-tight",
                    (row.style === 'adm' || row.style === 'brk') ? "text-gray-muted" : "text-teal"
                  )}>
                    {row.t}
                  </div>
                  
                  <div className="xl:block">
                    <span className={cn(
                      "inline-block px-2.5 py-0.5 text-[9px] md:text-[10px] font-mono font-bold tracking-widest uppercase",
                      row.style === 'talk' ? "bg-purple/20 text-purple border border-purple/20" : 
                      row.style === 'net' ? "bg-teal/15 text-teal border border-teal/20" : 
                      "bg-white/5 text-gray-muted border border-white/10"
                    )}>
                      {row.type}
                    </span>
                  </div>
                </div>

                {/* Content Title - Full width on mobile */}
                <div className={cn(
                  "text-base md:text-lg xl:text-base font-bold xl:font-semibold leading-snug",
                  (row.style === 'adm' || row.style === 'brk') ? "text-gray-muted font-normal" : "text-white group-hover:text-teal transition-colors"
                )}>
                  {row.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sessions */}
      <section id="sessions" className="py-24 px-6 md:px-12 lg:px-20 bg-bg-alt">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <div className="flex items-center gap-3 font-mono text-sm text-teal tracking-[0.2em] uppercase mb-4">六大議題</div>
            <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08]">從南部企業主<span className="text-teal">最需要的答案</span>出發</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5">
            {[
              { id: '01', title: '產業轉型實戰', pain: '製造業 / 傳產如何活下去', q: '「轉型不是口號，聽聽過來人怎麼做才不會死」', color: 'teal' },
              { id: '02', title: '全通路零售佈局', pain: '線上紅利消失、線下成本高漲', q: '「零售該如何突圍？」', color: 'purple' },
              { id: '03', title: '品牌國際化策略', pain: '台灣品牌想走出海', q: '「第一步該踩穩哪裡？」', color: 'pink' },
              { id: '04', title: 'CRM 驅動增長', pain: '流量越來越貴', q: '「如何把過客變熟客、把熟客變營收？」', color: 'teal' },
              { id: '05', title: '企業 AI 發展方向', pain: 'AI 成為標配，導入卻不知從哪開始', q: '「企業導入的正確姿勢是什麼？」', color: 'purple' },
              { id: '06', title: '南部產業機會 × 挑戰', pain: '南部有自己的產業邏輯', q: '「屬於南部的優勢與破局點在哪裡？」', color: 'pink' }
            ].map((s, i) => (
              <div key={i} className="bg-card group hover:-translate-y-1 transition-transform">
                <div className={cn("h-0.5", `bg-${s.color}`)} />
                <div className="p-7 pb-8">
                  <div className={cn("font-mono text-[9px] tracking-[0.22em] mb-2.5", `text-${s.color}`)}>SESSION {s.id}</div>
                  <div className="text-lg font-black mb-2 leading-tight">{s.title}</div>
                  <div className="text-[11px] text-gray-muted mb-3.5 leading-relaxed">{s.pain}</div>
                  <div className={cn("text-[11px] italic border-t border-white/5 pt-3 leading-relaxed", `text-${s.color}/70`)}>{s.q}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Register CTA */}
      <section id="register" className="py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-radial-gradient from-purple/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-lg mx-auto">
          <h2 className="font-bold text-3xl md:text-5xl leading-[1.35] mb-4">南部第一場<span className="text-teal">企業成長年會</span></h2>
          <p className="text-sm text-gray-muted leading-relaxed mb-5">把「企業轉型」與「品牌成長」的關鍵知識，搬運到南部這塊土地上。為什麼是南部，為什麼是現在——了解這場年會背後的產業邏輯。</p>
          <div className="flex gap-2 flex-wrap justify-center mb-11">
            {['2026 · 06 · 15', '台南市 歸仁資安大樓', '限額 300 人'].map((p, i) => (
              <div key={i} className="font-mono text-[10px] text-teal border border-teal/20 px-3.5 py-1.5 bg-teal/5 tracking-wider">{p}</div>
            ))}
          </div>
          <Link 
            to="/background" 
            className="bg-teal text-bg px-12 md:px-16 py-3.5 md:py-4 text-xs md:sm font-bold tracking-[0.16em] hover:bg-[#00e8cc] hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(0,201,177,0.3)] transition-all"
          >
            深入了解活動背景
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 md:px-12 lg:px-20 border-t border-white/5 flex flex-wrap justify-between items-center gap-3 relative z-10">
        <div className="font-display font-bold text-sm text-gray-muted">Beyond South <span className="text-teal">｜ 南向無界 2026</span></div>
        <div className="font-mono text-[9px] text-white/10 tracking-wider">台南市 歸仁資安大樓 · 2026.06.15 · Beyond South Organizing Committee</div>
      </footer>
    </div>
  );
}
