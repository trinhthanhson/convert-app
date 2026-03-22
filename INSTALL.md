# Hướng dẫn Cài đặt Thiên Mộng PDF

## Yêu cầu hệ thống

- **Windows 7 trở lên** (khuyến nghị Windows 10+)
- **Python 3.8 hoặc cao hơn** (bắt buộc)
- **Poppler** (để xử lý PDF, tùy chọn nhưng khuyến nghị)
- **RAM**: Tối thiểu 2GB, khuyến nghị 4GB+

---

## Cài đặt từng bước

### **Bước 1: Cài đặt Python**

1. Tải Python từ: https://www.python.org/downloads/
2. Chọn phiên bản **3.10 hoặc 3.11** (khuyến nghị)
3. **QUAN TRỌNG**: Tick ✓ vào **"Add Python to PATH"** trong quá trình cài đặt
4. Nhấn "Install Now"

**Kiểm tra Python đã cài đúng:**
```
Mở PowerShell và gõ: python --version
Kết quả: Python 3.x.x
```

---

### **Bước 2: Cài đặt Python Packages**

1. Tạo thư mục chứa file `ThienMongConvert.exe`
2. Copy file `requirements.txt` vào thư mục đó
3. Mở PowerShell **từ thư mục đó**
4. Gõ lệnh:
```bash
pip install -r requirements.txt
```
5. Chờ cài đặt hoàn tất (khoảng 2-5 phút)

**Hoặc chạy file `setup.bat`** (nếu có):
```bash
setup.bat
```

---

### **Bước 3 (Tùy chọn): Cài Poppler để tăng độ chính xác**

Poppler cải thiện chất lượng preview PDF, nhưng không bắt buộc.

**Cách 1: Dùng Chocolatey (nếu đã cài)**
```bash
choco install poppler
```

**Cách 2: Download từ GitHub**
1. Tải từ: https://github.com/oschwartz10612/poppler-windows/releases/
2. Chọn phiên bản mới nhất (Release-23.x hoặc cao hơn)
3. Giải nén vào `C:\Program Files\poppler`
4. Thêm `C:\Program Files\poppler\Library\bin` vào Windows PATH

**Hoặc set Environment Variable:**
```bash
$env:POPPLER_PATH = "C:\Program Files\poppler\Library\bin"
```

---

### **Bước 4: Chạy ứng dụng**

Nhấp đôi vào `ThienMongConvert.exe`

**Gặp lỗi "ModuleNotFoundError"?**
→ Chạy lại: `pip install -r requirements.txt` trong PowerShell

---

## Troubleshooting

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-----------|----------|
| `'python' is not recognized` | Python chưa cài hoặc chưa add vào PATH | Cài Python và tick "Add Python to PATH" |
| `ModuleNotFoundError: pdf2docx` | Package chưa cài | `pip install -r requirements.txt` |
| `Exit Code 1` | Python packages không đầy đủ | Chạy lại: `pip install --upgrade -r requirements.txt` |
| Preview PDF không hiển thị | Poppler chưa cài | Cài Poppler (Bước 3) hoặc bỏ qua |

---

## Gỡ cài đặt

Xóa folder chứa `ThienMongConvert.exe` và `requirements.txt`

Python vẫn sẽ lưu lại trên máy (tuỳ chọn):
```bash
pip uninstall pdf2docx docx2pdf pypdf pdf2image pillow
```

---

**Hỗ trợ**: Nếu gặp lỗi khác, hãy liên hệ với nhà phát triển.
