/**
 * Floating registration CTA - 全站右下角懸浮按鈕，連到 Accupass 報名頁
 */
export default function FloatingCTA() {
  return (
    <a
      href="https://www.accupass.com/event/2605040805401337286380"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="立即報名"
      className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-[9999] flex items-center gap-2 sm:gap-2.5 bg-gradient-to-br from-purple to-teal text-white font-bold text-sm sm:text-[15px] tracking-wide px-5 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-[0_6px_28px_rgba(0,201,177,0.38),0_2px_8px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,201,177,0.52),0_4px_16px_rgba(0,0,0,0.4)] active:translate-y-0 transition-all whitespace-nowrap"
    >
      <svg
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0"
      >
        <line x1="3" y1="9" x2="15" y2="9" />
        <polyline points="10,4 15,9 10,14" />
      </svg>
      立即報名
    </a>
  );
}
