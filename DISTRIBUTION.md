# Hướng dẫn phân phối ứng dụng

## Files cần gửi cho máy khác:

```
📦 ThienMongPDF_v2.0 (Gửi folder này)
├── 📄 ThienMongConvert.exe          [BẮT BUỘC] - Ứng dụng chính
├── 📄 requirements.txt               [BẮT BUỘC] - Python dependencies
├── 📄 INSTALL.md                     [NÊN CÓ] - Hướng dẫn cài đặt
├── 📄 setup.bat                      [NÊN CÓ] - Script tự động cài đặt
└── 📁 temp/                          [TỪY CHỌN]
    └── poppler-23.11.0/              [TỪY CHỌN] - Poppler binary
```

---

## Bước chuẩn bị để phân phối:

### **1. Build prod version (nếu chưa làm)**
```bash
cd d:\GoLang\convert-app\convert-app
wails build -nsis
```
Output: `build\bin\ThienMongConvert.exe`

### **2. Tạo folder phân phối**
```bash
mkdir "D:\Distribute\ThienMongPDF"
```

### **3. Copy các files cần thiết**
```bash
# Copy executable
copy "build\bin\ThienMongConvert.exe" "D:\Distribute\ThienMongPDF\"

# Copy Python requirements
copy "requirements.txt" "D:\Distribute\ThienMongPDF\"

# Copy batch scripts
copy "setup.bat" "D:\Distribute\ThienMongPDF\"
copy "build-dev.bat" "D:\Distribute\ThienMongPDF\"  (nếu muốn)

# Copy hướng dẫn
copy "INSTALL.md" "D:\Distribute\ThienMongPDF\"

# Copy Poppler (TUỲ CHỌN - để tăng kích thước)
xcopy "temp\poppler-23.11.0" "D:\Distribute\ThienMongPDF\temp\poppler-23.11.0\" /E /I /Y
```

### **4. Nén thành ZIP để gửi**
```bash
# Dùng PowerShell
Compress-Archive -Path "D:\Distribute\ThienMongPDF" -DestinationPath "D:\Distribute\ThienMongPDF-v2.0.zip"
```

---

## Hình ảnh các mục đích phân phối:

### **Phiên bản Minimal (500MB+)**
- ✅ ThienMongConvert.exe
- ✅ requirements.txt
- ✅ setup.bat
- ✅ INSTALL.md
- ❌ Poppler (người dùng cài sau)

**Ưu điểm**: Nhẹ, nhanh tải  
**Nhược điểm**: Cần hướng dẫn họ cài Python

### **Phiên bản Complete (1.5GB+)**
- ✅ Tất cả files ở trên
- ✅ Poppler (đã bundled)

**Ưu điểm**: Người dùng chỉ cần cài Python + requirements  
**Nhược điểm**: File lớn

---

## Gửi cho người dùng:

**Email/Zalo:**
```
Bạn tải file: ThienMongPDF-v2.0.zip
Giải nén ra
Chạy file setup.bat
Theo hướng dẫn INSTALL.md
```

---

## Kiểm tra trên máy khác:

1. Copy folder `ThienMongPDF` qua máy khác
2. Chạy `setup.bat`
3. Nhấp đôi `ThienMongConvert.exe`
4. Kiểm tra chức năng các tính năng

---

**Lưu ý**: Dù máy khác chưa có Python, phải chạy `setup.bat` để cài Python packages!
