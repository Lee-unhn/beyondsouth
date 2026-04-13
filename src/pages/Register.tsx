/**
 * Register Page - Beyond South 2026
 * Refreshed: 2026-04-13
 */
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import BackgroundCanvas from '../components/BackgroundCanvas';

export default function Register() {
  const [timeLeft, setTimeLeft] = useState({ d: '--', h: '--', m: '--', s: '--' });

  useEffect(() => {
    const target = new Date('2026-05-01T00:00:00+08:00').getTime();
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

  return (
    <div className="min-h-screen flex flex-col">
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

      <main className="flex-1 flex flex-col justify-center items-center text-center px-6 pt-32 pb-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-card border border-white/5 p-10 md:p-16 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal via-purple to-pink" />
          
          <div className="font-mono text-[10px] text-teal tracking-[0.3em] uppercase mb-6">Registration Opening Soon</div>
          <h1 className="font-bold text-4xl md:text-5xl mb-4">立即報名</h1>
          <p className="text-sm text-gray-muted leading-relaxed mb-12">感謝您的關注。Beyond South 2026 報名系統將於 2026 年 5 月 1 日正式開放。請鎖定官網資訊或追蹤我們的社交媒體。</p>

          <div className="mb-12">
            <div className="font-mono text-[9px] text-white/20 tracking-widest uppercase mb-6 flex items-center justify-center gap-3 before:content-[''] before:w-6 before:h-px before:bg-white/10 after:content-[''] after:w-6 after:h-px after:bg-white/10">
              距離報名開放還有
            </div>
            <div className="flex items-stretch justify-center gap-2 md:gap-4">
              {[
                { val: timeLeft.d, label: 'Days' },
                { val: timeLeft.h, label: 'Hours' },
                { val: timeLeft.m, label: 'Mins' },
                { val: timeLeft.s, label: 'Secs' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 md:gap-4">
                  <div className="text-center min-w-[60px] md:min-w-[80px]">
                    <span className="font-mono text-3xl md:text-5xl font-bold text-white leading-none block">{item.val}</span>
                    <small className="text-[9px] text-gray-muted tracking-widest mt-3 block uppercase">{item.label}</small>
                  </div>
                  {i < 3 && <div className="font-mono text-2xl text-white/10 self-center pb-4">:</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/background" className="bg-white/5 text-white border border-white/10 px-8 py-4 text-xs font-bold tracking-widest hover:bg-white/10 transition-all">
              查看活動背景
            </Link>
            <button disabled className="bg-gray-muted/20 text-gray-muted px-8 py-4 text-xs font-bold tracking-widest cursor-not-allowed">
              尚未開放報名
            </button>
          </div>
        </motion.div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="font-mono text-[10px] text-white/10 tracking-[0.2em]">FOLLOW US FOR UPDATES</div>
          <div className="flex gap-6">
            {['Facebook', 'Instagram', 'LinkedIn'].map(s => (
              <span key={s} className="text-[11px] text-gray-muted hover:text-teal cursor-pointer transition-colors">{s}</span>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-6 px-6 md:px-12 lg:px-20 border-t border-white/5 flex flex-wrap justify-between items-center gap-3 relative z-10">
        <div className="font-display font-bold text-sm text-gray-muted">Beyond South <span className="text-teal">｜ 南向無界 2026</span></div>
        <div className="font-mono text-[9px] text-white/10 tracking-wider">台南市 歸仁資安大樓 · 2026.06.15 · Beyond South Organizing Committee</div>
      </footer>
    </div>
  );
}
