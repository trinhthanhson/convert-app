import { useState, useEffect } from 'react';
import { SelectSingleFile, DeletePages, OpenFileFolder, GetSavePath, GetPdfPagePreviews } from '../../wailsjs/go/main/App';
import { motion, AnimatePresence } from 'framer-motion';
import { FileMinus, FolderOpen, CheckCircle2, Loader2, RefreshCw, ArrowRight, FileText, AlertCircle, X, Eye, EyeOff } from 'lucide-react';

// Type definitions
interface PdfPagePreview {
  pageNumber: number;
  imageData: string;
  width: number;
  height: number;
}

export const PdfDelete = () => {
  const [filePath, setFilePath] = useState('');
  const [pagesInput, setPagesInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultPath, setResultPath] = useState('');
  const [pagePreviews, setPagePreviews] = useState<PdfPagePreview[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [loadingPreviews, setLoadingPreviews] = useState(false);

  const handleSelect = async () => {
    const selected = await SelectSingleFile("Chọn file PDF cần xử lý", "*.pdf");
    if (selected) {
      setFilePath(selected);
      setResultPath('');
      setSelectedPages(new Set());
      setPagePreviews([]);
      
      // Load page previews
      setLoadingPreviews(true);
      try {
        const previews = await GetPdfPagePreviews(selected);
        setPagePreviews(previews || []);
      } catch (err) {
        console.error('Error loading previews:', err);
        alert('Không thể tải preview các trang PDF. Vui lòng thử lại.');
      } finally {
        setLoadingPreviews(false);
      }
    }
  };

  const togglePageSelection = (pageNumber: number) => {
    const newSelected = new Set(selectedPages);
    if (newSelected.has(pageNumber)) {
      newSelected.delete(pageNumber);
    } else {
      newSelected.add(pageNumber);
    }
    setSelectedPages(newSelected);
    
    // Update pagesInput
    const sortedPages = Array.from(newSelected).sort((a, b) => a - b);
    setPagesInput(sortedPages.join(', '));
  };

  const selectAllPages = () => {
    const allPages = new Set(pagePreviews.map(p => p.pageNumber));
    setSelectedPages(allPages);
    setPagesInput(Array.from(allPages).sort((a, b) => a - b).join(', '));
  };

  const clearSelection = () => {
    setSelectedPages(new Set());
    setPagesInput('');
  };

  const handleProcess = async () => {
    if (!filePath) return;
    
    // 1. Chuyển đổi input thành mảng số
    const pageArray = pagesInput
      .split(',')
      .map(p => parseInt(p.trim()))
      .filter(p => !isNaN(p));

    if (pageArray.length === 0) {
      alert('Vui lòng nhập số trang (ví dụ: 1, 2, 5)');
      return;
    }

    // 2. Mở hộp thoại chọn nơi lưu file mới
    const savePath = await GetSavePath('ThienMong_Removed.pdf', '*.pdf');
    if (!savePath) return; // Người dùng hủy chọn folder

    setLoading(true);
    try {
      // 3. Gọi hàm Go với 3 tham số (File gốc, Mảng trang, File đích)
      // Lưu ý: Nếu Go của bạn chưa cập nhật tham số thứ 3, hãy cập nhật app.go trước
      const result = await DeletePages(filePath, pageArray, savePath);
      
      if (result) {
        setResultPath(result);
      }
    } catch (err) {
      alert('Lỗi: ' + err);
    } finally {
      setLoading(false);
    }
  };

  const accent = '#ef4444';
  const accentBg = 'rgba(239, 68, 68, 0.08)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {/* UI Header & Content (Giữ nguyên như bản trước để đồng bộ) */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e8eaed', padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
          <FileMinus size={22} strokeWidth={1.8} />
        </div>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111', margin: 0 }}>Xóa trang PDF</h2>
          <p style={{ fontSize: 13, color: '#8b949e', margin: '3px 0 0' }}>Chọn file, nhập trang và chọn nơi lưu file mới</p>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e8eaed', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {!filePath ? (
          <div onClick={handleSelect} style={{ border: '2px dashed #e5e7eb', borderRadius: 16, padding: '40px 20px', textAlign: 'center', cursor: 'pointer' }}>
            <FileText size={32} style={{ color: '#9ca3af', marginBottom: 12, margin: '0 auto' }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Nhấp để chọn file PDF</div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#f9fafb', borderRadius: 12, border: '1px solid #f0f0f0' }}>
            <FileText size={18} color={accent} />
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {filePath.split('\\').pop()}
            </span>
            <button onClick={() => setFilePath('')} style={{ border: 'none', background: 'none', color: '#9ca3af', cursor: 'pointer' }}><X size={16}/></button>
          </div>
        )}

        {/* Page Previews */}
        {filePath && pagePreviews.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#4b5563' }}>
                Chọn các trang muốn xóa ({pagePreviews.length} trang)
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={selectAllPages}
                  style={{ 
                    padding: '6px 12px', 
                    borderRadius: 8, 
                    border: '1px solid #e5e7eb', 
                    background: '#fff', 
                    fontSize: 12, 
                    cursor: 'pointer',
                    color: '#374151'
                  }}
                >
                  Chọn tất cả
                </button>
                <button 
                  onClick={clearSelection}
                  style={{ 
                    padding: '6px 12px', 
                    borderRadius: 8, 
                    border: '1px solid #e5e7eb', 
                    background: '#fff', 
                    fontSize: 12, 
                    cursor: 'pointer',
                    color: '#374151'
                  }}
                >
                  Bỏ chọn
                </button>
              </div>
            </div>
            
            {loadingPreviews ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                <Loader2 size={24} style={{ margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
                Đang tải preview...
              </div>
            ) : (
              <div style={{ 
                maxHeight: '400px', 
                overflowY: 'auto', 
                border: '1px solid #e5e7eb', 
                borderRadius: 12, 
                padding: '16px',
                background: '#fafafa'
              }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                  gap: '12px'
                }}>
                  {pagePreviews.map((preview) => (
                    <div 
                      key={preview.pageNumber}
                      onClick={() => togglePageSelection(preview.pageNumber)}
                      style={{ 
                        position: 'relative',
                        cursor: 'pointer',
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: selectedPages.has(preview.pageNumber) ? '3px solid #ef4444' : '2px solid #e5e7eb',
                        background: '#fff',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <img 
                        src={preview.imageData} 
                        alt={`Trang ${preview.pageNumber}`}
                        style={{ 
                          width: '100%', 
                          height: '200px', 
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      <div style={{ 
                        position: 'absolute', 
                        top: 8, 
                        left: 8, 
                        background: selectedPages.has(preview.pageNumber) ? '#ef4444' : 'rgba(0,0,0,0.7)', 
                        color: 'white', 
                        padding: '2px 8px', 
                        borderRadius: 12, 
                        fontSize: 12, 
                        fontWeight: 600
                      }}>
                        {preview.pageNumber}
                      </div>
                      {selectedPages.has(preview.pageNumber) && (
                        <div style={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8, 
                          background: '#ef4444', 
                          color: 'white', 
                          borderRadius: '50%', 
                          width: 24, 
                          height: 24, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center'
                        }}>
                          <X size={14} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#4b5563' }}>Số trang muốn xóa (ví dụ: 1, 2, 5)</label>
          <input 
            type="text"
            value={pagesInput}
            onChange={(e) => setPagesInput(e.target.value)}
            placeholder="Chọn các trang từ preview ở trên hoặc nhập thủ công"
            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 14, outline: 'none' }}
            readOnly={pagePreviews.length > 0}
          />
          {pagePreviews.length > 0 && (
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              💡 Nhấp vào các trang ở trên để chọn/bỏ chọn. Hoặc nhập thủ công nếu cần.
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <AnimatePresence mode="wait">
        {!resultPath ? (
          <motion.button
            key="btn"
            onClick={handleProcess}
            disabled={!filePath || !pagesInput || loading}
            style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: (filePath && pagesInput) ? accent : '#e5e7eb', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Chọn nơi lưu & Xử lý <ArrowRight size={18} /></>}
          </motion.button>
        ) : (
          <motion.div key="res" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(22,163,74,0.1)', color: '#15803d', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600 }}>
              <CheckCircle2 size={18} /> Đã lưu file mới thành công!
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
              <button onClick={() => OpenFileFolder(resultPath)} style={{ padding: '12px', borderRadius: 12, background: '#111', color: '#fff', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                <FolderOpen size={16} /> Mở thư mục
              </button>
              <button onClick={() => {setFilePath(''); setPagesInput(''); setResultPath('');}} style={{ padding: '12px', borderRadius: 12, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>
                <RefreshCw size={16} color="#666" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};