import { useState } from 'react';
import { SelectSingleFile, ActionWordToPdf, OpenFileFolder, GetSavePath } from '../../wailsjs/go/main/App';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, Upload, Loader2, CheckCircle2, FolderOpen, RefreshCw, ArrowRight } from 'lucide-react';

export const WordToPdf = () => {
  const [path, setPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultPath, setResultPath] = useState('');

  const handleSelect = async () => {
    const selected = await SelectSingleFile('Word Files', '*.docx;*.doc');
    if (selected) { setPath(selected); setResultPath(''); }
  };

  const handleConvert = async () => {
    if (!path) return;
    const defaultName = path.split('\\').pop()?.replace(/\.[^/.]+$/, '') + '.pdf';
    const savePath = await GetSavePath(defaultName, '*.pdf');
    if (!savePath) return;
    setLoading(true);
    const result = await ActionWordToPdf(path, savePath);
    if (result.success) setResultPath(result.outputPath);
    else alert('Lỗi chuyển đổi: ' + result.error);
    setLoading(false);
  };

  const fileName = path.split('\\').pop() ?? '';
  const accent = '#3d82d6';
  const accentBg = 'rgba(61,130,214,0.1)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{ background: '#fff', borderRadius: 20, border: '1px solid #e8eaed', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
    >
      {/* Header */}
      <div style={{ padding: '28px 32px 24px', borderBottom: '1px solid #f1f3f5', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, flexShrink: 0 }}>
          <FileCode size={22} strokeWidth={1.8} />
        </div>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111', margin: 0, letterSpacing: '-0.3px' }}>Word sang PDF</h2>
          <p style={{ fontSize: 13, color: '#8b949e', margin: '3px 0 0', lineHeight: 1.4 }}>Đóng gói tài liệu .docx thành định dạng PDF chuyên nghiệp</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '28px 32px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Drop zone */}
        <div
          onClick={handleSelect}
          style={{ border: `2px dashed ${path ? accent : '#d1d5db'}`, borderRadius: 14, padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', background: path ? 'rgba(61,130,214,0.03)' : '#fafafa', transition: 'all 0.18s ease' }}
          onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.background = accentBg; }}
          onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = path ? accent : '#d1d5db'; e.currentTarget.style.background = path ? 'rgba(61,130,214,0.03)' : '#fafafa'; }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 10, background: path ? accentBg : '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: path ? accent : '#9ca3af' }}>
            <Upload size={18} strokeWidth={1.8} />
          </div>
          {path ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111', wordBreak: 'break-all' }}>{fileName}</div>
              <div style={{ fontSize: 12, color: accent, marginTop: 4, fontWeight: 500 }}>Nhấn để chọn file khác</div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Nhấn để chọn file Word</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Hỗ trợ .docx và .doc</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <AnimatePresence mode="wait">
          {!resultPath ? (
            <motion.button
              key="convert"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleConvert}
              disabled={!path || loading}
              style={{ width: '100%', padding: '14px 24px', borderRadius: 12, border: 'none', background: !path || loading ? '#e5e7eb' : accent, color: !path || loading ? '#9ca3af' : '#fff', fontSize: 14, fontWeight: 600, cursor: !path || loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.18s ease' }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { if (path && !loading) e.currentTarget.style.background = '#2d6bbf'; }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { if (path && !loading) e.currentTarget.style.background = accent; }}
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Đang chuyển đổi...</> : <>Chuyển đổi <ArrowRight size={16} strokeWidth={2} /></>}
            </motion.button>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: '14px 20px', borderRadius: 12, background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={18} color="#16a34a" strokeWidth={2} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>Xuất PDF thành công!</div>
                  <div style={{ fontSize: 11, color: '#86efac', marginTop: 1 }}>File .pdf đã được lưu</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
                <button
                  onClick={() => OpenFileFolder(resultPath)}
                  style={{ padding: '12px 20px', borderRadius: 12, border: 'none', background: '#111', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = '#333'; }}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = '#111'; }}
                >
                  <FolderOpen size={15} strokeWidth={1.8} /> Mở thư mục
                </button>
                <button
                  onClick={() => { setPath(''); setResultPath(''); }}
                  style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = '#f9fafb'; }}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = '#fff'; }}
                >
                  <RefreshCw size={15} strokeWidth={1.8} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};