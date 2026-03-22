import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PdfToWord } from './components/PdfToWord';
import { WordToPdf } from './components/WordToPdf';
import { PdfMerge } from './components/PdfMerge';
import { PdfDelete } from './components/PdfDelete';

const IconPdfToWord = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <path d="M9 13h6M9 17h4"/>
  </svg>
);

const IconWordToPdf = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <polyline points="12 18 15 21 18 18"/>
    <line x1="15" y1="21" x2="15" y2="12"/>
  </svg>
);

const IconMerge = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="8" height="11" rx="1"/>
    <rect x="14" y="3" width="8" height="11" rx="1"/>
    <path d="M6 14v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
  </svg>
);

const IconLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);
const IconDelete = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
  </svg>
);
const TABS = [
  {
    id: 'pdf2word',
    label: 'PDF sang Word',
    desc: 'Chuyển đổi có OCR',
    Icon: IconPdfToWord,
    color: '#e05c4b',
    colorBg: 'rgba(224,92,75,0.13)',
  },
  {
    id: 'word2pdf',
    label: 'Word sang PDF',
    desc: 'Giữ nguyên định dạng',
    Icon: IconWordToPdf,
    color: '#3d82d6',
    colorBg: 'rgba(61,130,214,0.13)',
  },
  {
    id: 'merge',
    label: 'Gộp PDF',
    desc: 'Nhiều file thành một',
    Icon: IconMerge,
    color: '#d4920a',
    colorBg: 'rgba(212,146,10,0.13)',
  },
  {
    id: 'delete',
    label: 'Xóa trang PDF',
    desc: 'Bỏ trang không cần thiết',
    Icon: IconDelete,
    color: '#ef4444',
    colorBg: 'rgba(239,68,68,0.1)',
  },
];
const winBtnStyle: React.CSSProperties = {
  width: '46px',
  height: '52px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  background: 'transparent',
  color: '#1f2937',
  cursor: 'pointer',
  transition: 'background 0.2s',
  outline: 'none',
  // QUAN TRỌNG: Phải có dòng này thì mới click được khi header là vùng drag
  WebkitAppRegion: 'no-drag', 
} as any;
const closeBtnStyle: React.CSSProperties = {
  ...winBtnStyle,
  borderRadius: '0',
};
export default function App() {
  const [active, setActive] = useState('pdf2word');
  const current = TABS.find(t => t.id === active);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      background: '#f0f2f5',   /* ← nền xám xanh trung tính, không beige */
      overflow: 'hidden',
    }}>

      {/* ══ SIDEBAR ══ */}
      <aside style={{
        width: '224px',
        background: '#18181b',  /* ← zinc-900, chuẩn dark */
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 14px',
        flexShrink: 0,
      }}>

        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '4px 8px 22px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          marginBottom: '20px',
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            background: 'linear-gradient(135deg, #e05c4b 0%, #d4920a 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0,
          }}>
            <IconLogo />
          </div>
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
              Thiên Mộng
            </div>
            <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.3)', marginTop: '1px' }}>
              Studio v2.0
            </div>
          </div>
        </div>

        {/* Label */}
        <div style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.09em',
          color: 'rgba(255,255,255,0.22)',
          textTransform: 'uppercase',
          padding: '0 10px',
          marginBottom: '6px',
        }}>
          Công cụ
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {TABS.map(tab => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '11px',
                  padding: '10px 10px',
                  borderRadius: '11px',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  background: isActive ? 'rgba(255,255,255,0.09)' : 'transparent',
                  position: 'relative',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '9px',
                  background: isActive ? tab.colorBg : 'rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? tab.color : 'rgba(255,255,255,0.35)',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}>
                  <tab.Icon />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.48)',
                    lineHeight: 1.25,
                  }}>
                    {tab.label}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: isActive ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.18)',
                    marginTop: '2px',
                  }}>
                    {tab.desc}
                  </div>
                </div>

                {isActive && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '18px',
                    borderRadius: '2px',
                    background: tab.color,
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Status */}
        <div style={{
          padding: '11px 13px',
          borderRadius: '11px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#4ade80',
            boxShadow: '0 0 7px rgba(74,222,128,0.7)',
            flexShrink: 0,
          }} />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
            Sẵn sàng xử lý
          </span>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      {/* ══ MAIN ══ */}
<div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

  {/* ══ TOPBAR: TRẮNG ĐỤC & CỬA SỔ ══ */}
  <header style={{
  height: '52px',
  background: 'rgba(255, 255, 255, 0.75)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 0 0 24px', // Bỏ padding phải để nút Close sát góc
  flexShrink: 0,
  zIndex: 10,
  // @ts-ignore
  "--wails-draggable": "drag" 
} as any}>
  
  {/* Phần thông tin Tab (Giữ nguyên) */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{
      width: '6px', height: '6px',
      borderRadius: '50%',
      background: current?.color,
      boxShadow: `0 0 10px ${current?.color}`,
    }} />
    <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827', letterSpacing: '-0.3px' }}>
      {current?.label}
    </span>
    <span style={{
      fontSize: '10.5px',
      padding: '2px 10px',
      borderRadius: '6px',
      background: 'rgba(0, 0, 0, 0.05)',
      color: '#4b5563',
      fontWeight: 600,
    }}>
      {current?.desc}
    </span>
  </div>

  {/* Phần Nút Điều Khiển - ĐÃ FIX HÀM RUNTIME */}
  <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
    {/* Nút Ẩn (Minimize) */}
    <button 
      className="win-btn" 
      onClick={() => (window as any).runtime.WindowMinimise()}
      style={winBtnStyle}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>
    </button>

    {/* Nút To/Nhỏ (Toggle Maximise) */}
    <button 
      className="win-btn" 
      onClick={() => (window as any).runtime.WindowToggleMaximise()}
      style={winBtnStyle}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>
    </button>

    {/* Nút Tắt (Quit) */}
    <button 
      className="win-btn close-btn" 
      onClick={() => (window as any).runtime.Quit()}
      style={closeBtnStyle}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
  </div>
</header>

        {/* Content area — nền xám xanh trung tính */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '36px 32px',
          background: '#f0f2f5',          /* ← khớp với nền app */
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              style={{ width: '100%', maxWidth: '760px' }}
            >
              {active === 'pdf2word' && <PdfToWord />}
              {active === 'word2pdf' && <WordToPdf />}
              {active === 'merge' && <PdfMerge />}
              {active === 'delete' && <PdfDelete />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}