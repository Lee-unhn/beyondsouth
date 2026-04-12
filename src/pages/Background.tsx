import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import BackgroundCanvas from '../components/BackgroundCanvas';

export default function Background() {
  return (
    <div className="min-h-screen">
      <BackgroundCanvas />

      <nav className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between py-4 px-6 md:px-12 lg:px-20 bg-bg/88 backdrop-blur-2xl border-b border-white/5">
        <Link to="/" className="flex items-baseline gap-3">
          <span className="font-display font-bold text-base text-white">Beyond South</span>
          <span className="text-[11px] text-teal tracking-[0.22em]">南向無界</span>
        </Link>
        <Link to="/" className="font-mono text-[10px] text-gray-muted tracking-widest border border-white/10 px-4 py-2 hover:text-teal hover:border-teal/30 transition-all flex items-center gap-2">
          <span className="text-xs">←</span> 返回活動主頁
        </Link>
      </nav>

      {/* Hero */}
      <section id="hero" className="min-h-[56vh] flex flex-col justify-end px-6 md:px-12 lg:px-20 pt-32 pb-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[9px] text-teal tracking-[0.36em] mb-6 flex items-center gap-3 opacity-80 before:content-[''] before:w-7 before:h-px before:bg-teal"
          >
            Industry Context · Beyond South 2026
          </motion.div>
          <div className="font-mono text-[clamp(10px,1.2vw,13px)] tracking-[0.24em] text-gray-muted uppercase mb-3">Activity Background / Why Now / Why South</div>
          <h1 className="font-bold text-[clamp(40px,6vw,80px)] leading-[1.04] mb-2.5">活動<span className="text-teal">背景</span></h1>
          <span className="font-display font-bold text-[clamp(40px,6vw,80px)] leading-[1.04] text-white/10 tracking-tight mb-5 block">Industry Context</span>
          <p className="text-base text-gray-muted leading-relaxed max-w-xl">為什麼是南部，為什麼是現在——從台灣中小企業的轉型困境、南部產業的結構性機會，到商業學習文化的斷層，理解這場年會存在的必要性。</p>
        </div>
      </section>

      {/* SMB */}
      <section id="smb" className="py-24 px-6 md:px-12 lg:px-20 bg-bg-alt">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="font-mono text-sm text-teal tracking-[0.2em] uppercase mb-4">產業背景與環境分析</div>
            <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] mb-4">台灣中小企業的<span className="text-teal">轉型困境</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 my-12">
            {[
              { n: '98%', l: '中小企業占比', s: '全台企業數量', color: 'teal' },
              { n: '80%', l: '就業吸納率', s: '全國受僱人口', color: 'purple' },
              { n: '~30%', l: 'GDP 貢獻', s: '中小企業直接產值', color: 'pink' }
            ].map((stat, i) => (
              <div key={i} className="bg-card p-9 text-center border-t-2 transition-colors hover:bg-white/[0.02]" style={{ borderTopColor: `var(--color-${stat.color})` }}>
                <div className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold leading-none mb-3" style={{ color: `var(--color-${stat.color})` }}>{stat.n}</div>
                <div className="text-base font-bold mb-1">{stat.l}</div>
                <div className="font-mono text-[9px] text-gray-muted tracking-widest">{stat.s}</div>
              </div>
            ))}
          </div>

          <div className="font-mono text-[9px] text-gray-muted tracking-[0.25em] uppercase mb-3">轉型知識的獲取障礙，體現在三個層次</div>
          <div className="flex flex-col gap-0.5">
            {[
              { label: '內容品質參差不齊', desc: '市場充斥理論型課程，缺乏以實戰驗證、可執行的方法論。企業主花時間學習，帶回去的卻是無法落地的知識框架。', color: 'teal' },
              { label: '知識流通圈地化', desc: '高品質商業交流高度集中雙北，南部企業主接觸需承擔額外成本——不只是交通票錢，更是時間與機會的雙重代價。', color: 'purple' },
              { label: '垂直連結斷裂', desc: '前行者與後進者間缺乏橫向交流管道，相同錯誤在不同公司一再重演，本可避免的學費被重複繳納。', color: 'pink' }
            ].map((b, i) => (
              <div key={i} className="bg-card p-7 md:p-8 grid md:grid-cols-[230px_1fr] gap-8 items-center border-l-2 border-transparent hover:bg-white/[0.02] transition-colors" style={{ borderLeftColor: `var(--color-${b.color})` }}>
                <div className="text-base font-bold" style={{ color: `var(--color-${b.color})` }}>{b.label}</div>
                <div className="text-sm text-gray-muted leading-relaxed">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* South */}
      <section id="south" className="py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="font-mono text-sm text-teal tracking-[0.2em] uppercase mb-4">南部產業</div>
            <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] mb-4">正在發生的<span className="text-teal">結構性機會</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 my-10">
            {[
              { region: '台南', desc: '台積電南科廠區持續擴建，帶動周邊供應鏈與消費力同步升級。製造業上下游正在快速重組，新一波服務需求正在形成。', color: 'teal' },
              { region: '高雄', desc: '亞灣科技創新園區加速推進，從重工業城市向多元產業平台城市轉型。數位經濟與傳統產業正在同一個地理空間上並行生長。', color: 'purple' },
              { region: '整體南部', desc: '本地 brand 意識崛起，從 OEM 代工思維向自有品牌思維的轉型浪潮正在形成。這是一個正在尋找自己敘事的市場。', color: 'pink' }
            ].map((card, i) => (
              <div key={i} className="bg-card p-8 relative">
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: `var(--color-${card.color})` }} />
                <div className="font-mono text-[10px] tracking-[0.24em] uppercase mb-4" style={{ color: `var(--color-${card.color})` }}>{card.region}</div>
                <div className="text-sm text-gray-light leading-relaxed">{card.desc}</div>
              </div>
            ))}
          </div>

          <div className="border border-white/5 bg-bg/60 p-9 md:p-10">
            <p className="text-lg md:text-xl text-white leading-relaxed mb-4">
              現在不是「南部準備好了嗎」的問題，<br />
              而是「<strong className="text-teal">誰要成為南部知識升級的那個平台</strong>」的問題。<br />
              知識資源不會自動流到最需要它的地方——<strong className="text-teal">先搭橋的人，決定知識怎麼流動。</strong>
            </p>
            <p className="font-mono text-[11px] text-white/25 tracking-widest">Beyond South｜南向無界 2026 講者邀請企劃書</p>
          </div>
        </div>
      </section>

      {/* Learning */}
      <section id="learning" className="py-24 px-6 md:px-12 lg:px-20 bg-bg-alt">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="font-mono text-sm text-teal tracking-[0.2em] uppercase mb-4">台灣商業學習文化</div>
            <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] mb-4">斷層與<span className="text-teal">三個缺口</span></h2>
          </motion.div>
          <p className="text-base text-gray-muted leading-loose max-w-2xl mb-12">市場上最有價值的知識，往往只存在於少數人的腦袋裡，靠人際網絡口耳相傳，而不是被有效記錄、傳播、放大。<br />真正有效的學習，需要同時具備三個條件：</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 mb-12">
            {[
              { num: '01', title: '宏觀戰略視野', desc: '理解產業趨勢與轉型邏輯。知道「為什麼要動」，才能判斷「往哪個方向動」。', color: 'teal' },
              { num: '02', title: '垂直領域實戰乾貨', desc: '可直接套用的執行路徑。不是名詞解釋，而是第一線摸爬滾打後歸納出的可執行方法論。', color: 'purple' },
              { num: '03', title: '同儕網絡連結', desc: '遇見願意互相借力的同行者。最有價值的對話，往往發生在正式議程結束之後。', color: 'pink' }
            ].map((p, i) => (
              <div key={i} className="bg-card p-9 border-t-2 flex flex-col gap-4" style={{ borderTopColor: `var(--color-${p.color})` }}>
                <div className="font-mono text-3xl md:text-4xl font-bold leading-none" style={{ color: `var(--color-${p.color})` }}>{p.num}</div>
                <div className="text-lg font-bold text-white">{p.title}</div>
                <div className="text-sm text-gray-muted leading-relaxed">{p.desc}</div>
              </div>
            ))}
          </div>

          <div className="bg-card border-l-[3px] border-purple p-7 md:p-8">
            <p className="text-sm text-gray-light leading-relaxed">三者缺一，學習效益都會大打折扣。<strong>Beyond South 南向無界的整體設計，就是以這三個條件為核心構建的</strong>——把最需要的東西，帶到最需要它的地方。</p>
          </div>

          <div className="mt-20 text-center">
            <Link 
              to="/register" 
              className="inline-block bg-teal text-bg px-12 md:px-16 py-4 text-sm font-bold tracking-[0.16em] hover:bg-[#00e8cc] hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(0,201,177,0.3)] transition-all"
            >
              立即報名年會
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-6 px-6 md:px-12 lg:px-20 border-t border-white/5 flex flex-wrap justify-between items-center gap-3 relative z-10">
        <div className="font-display font-bold text-sm text-gray-muted">Beyond South <span className="text-teal">｜ 南向無界 2026</span></div>
        <div className="font-mono text-[9px] text-white/10 tracking-wider">台南市 歸仁資安大樓 · 2026.06.15 · Beyond South Organizing Committee</div>
      </footer>
    </div>
  );
}
