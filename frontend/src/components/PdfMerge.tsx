import { useState } from 'react';
import { SelectMultipleFiles, ActionMergePDF, OpenFileFolder, GetSavePath } from '../../wailsjs/go/main/App';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Files, Plus, Trash2, FolderOpen, GripVertical, CheckCircle2, Loader2, RefreshCw, ArrowRight } from 'lucide-react';

export const PdfMerge = () => {
  const [paths, setPaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultPath, setResultPath] = useState('');

  const handleAdd = async () => {
    const selected = await SelectMultipleFiles();
    if (selected) { setPaths(prev => [...prev, ...selected]); setResultPath(''); }
  };

  const handleMerge = async () => {
    if (paths.length < 2) { alert('Vui lòng chọn ít nhất 2 file PDF!'); return; }
    const savePath = await GetSavePath('ThienMong_Merged.pdf', '*.pdf');
    if (!savePath) return;
    setLoading(true);
    try {
      const result = await ActionMergePDF(paths, savePath);
      if (result.success) setResultPath(result.outputPath);
      else alert('Lỗi: ' + result.error);
    } catch (err) { alert('Lỗi hệ thống: ' + err); }
    finally { setLoading(false); }
  };

  const accent = '#d4920a';
  const accentBg = 'rgba(212,146,10,0.1)';
  const canMerge = paths.length >= 2 && !loading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {/* Header card */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e8eaed', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
            <Files size={22} strokeWidth={1.8} />
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111', margin: 0, letterSpacing: '-0.3px' }}>Gộp nhiều PDF</h2>
            <p style={{ fontSize: 13, color: '#8b949e', margin: '3px 0 0' }}>
              {paths.length === 0 ? 'Chưa có file nào' : `${paths.length} file — kéo để sắp xếp thứ tự`}
            </p>
          </div>
        </div>
        <button
          onClick={handleAdd}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 10, border: `1.5px dashed ${accent}`, background: 'rgba(212,146,10,0.06)', color: '#b87d08', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = 'rgba(212,146,10,0.12)'; }}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = 'rgba(212,146,10,0.06)'; }}
        >
          <Plus size={15} strokeWidth={2.2} /> Thêm file
        </button>
      </div>

      {/* File list card */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e8eaed', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', minHeight: 160 }}>
        {paths.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c4c4c4' }}>
              <Files size={20} strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>Nhấn "Thêm file" để bắt đầu</div>
          </div>
        ) : (
          <div style={{ padding: 8 }}>
            <Reorder.Group axis="y" values={paths} onReorder={setPaths} style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {paths.map((p, i) => (
                <Reorder.Item
                  key={p + i}
                  value={p}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 12, background: '#fafafa', border: '1px solid #f0f0f0', cursor: 'grab', userSelect: 'none' }}
                  whileDrag={{ scale: 1.02, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 10 }}
                >
                  <GripVertical size={15} color="#c4c4c4" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: accentBg, color: '#b87d08', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 500, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.split('\\').pop()}
                  </span>
                  <button
                    onClick={() => setPaths(paths.filter((_, idx) => idx !== i))}
                    style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: 'transparent', color: '#c4c4c4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c4c4c4'; }}
                  >
                    <Trash2 size={14} strokeWidth={1.8} />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        )}
      </div>

      {/* Action */}
      <AnimatePresence mode="wait">
        {!resultPath ? (
          <motion.button
            key="merge"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleMerge}
            disabled={!canMerge}
            style={{ width: '100%', padding: '14px 24px', borderRadius: 12, border: 'none', background: canMerge ? accent : '#e5e7eb', color: canMerge ? '#fff' : '#9ca3af', fontSize: 14, fontWeight: 600, cursor: canMerge ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.18s ease', boxShadow: canMerge ? '0 4px 14px rgba(212,146,10,0.25)' : 'none' }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { if (canMerge) e.currentTarget.style.background = '#b87d08'; }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { if (canMerge) e.currentTarget.style.background = accent; }}
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Đang gộp file...</>
              : <>Gộp {paths.length >= 2 ? `${paths.length} file` : ''} <ArrowRight size={16} strokeWidth={2} /></>
            }
          </motion.button>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: '14px 20px', borderRadius: 12, background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={18} color="#16a34a" strokeWidth={2} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>Gộp file thành công!</div>
                <div style={{ fontSize: 11, color: '#86efac', marginTop: 1 }}>File PDF đã được lưu</div>
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
                onClick={() => { setPaths([]); setResultPath(''); }}
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
    </motion.div>
  );
};